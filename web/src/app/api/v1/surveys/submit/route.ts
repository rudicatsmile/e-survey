import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import {
  respondents,
  surveyResponses,
  surveyAnswers,
  surveyReviews,
  surveyPeriods,
} from '@/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';
import { writeActivityLog } from '@/lib/audit';

function sha256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// In-memory rate limiting map fallback: ipHash -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ipHash: string, limit = 5, windowMs = 3600000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ipHash) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  rateLimitMap.set(ipHash, validTimestamps);
  return true;
}

const POSITIVE_WORDS = [
  'ramah', 'cepat', 'bersih', 'puas', 'bagus', 'nyaman', 'sigap', 'teratur',
  'profesional', 'membantu', 'lengkap', 'terbaik', 'sopan', 'hebat', 'rapi', 'mudah'
];

const NEGATIVE_WORDS = [
  'lama', 'antre', 'kecewa', 'kotor', 'lambat', 'buruk', 'kasar', 'mahal',
  'rusak', 'kurang', 'antrian', 'ribet', 'keluhan', 'sulit', 'penuh', 'bau'
];

function analyzeReview(text: string): {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  keywords: string[];
} {
  const lower = text.toLowerCase();
  const words = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  let posCount = 0;
  let negCount = 0;
  const matchedKeywords = new Set<string>();

  for (const w of words) {
    if (POSITIVE_WORDS.includes(w)) {
      posCount++;
      matchedKeywords.add(w);
    }
    if (NEGATIVE_WORDS.includes(w)) {
      negCount++;
      matchedKeywords.add(w);
    }
  }

  let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
  if (posCount > negCount) {
    sentiment = 'POSITIVE';
  } else if (negCount > posCount) {
    sentiment = 'NEGATIVE';
  }

  return {
    sentiment,
    keywords: Array.from(matchedKeywords),
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'SurveyMobile';

    const ipHash = sha256(rawIp);

    // Rate Limiting (5 kali/jam/IP)
    if (!checkRateLimit(ipHash, 5, 3600000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Batas pengisian survey tercapai (maksimal 5 kali per jam per perangkat). Silakan coba lagi nanti.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      hospitalId,
      periodId,
      questionnaireId,
      unitId,
      demographics,
      answers, // array of { questionId, likertValue, choiceValues, textValue }
      reviewText,
    } = body;

    if (!hospitalId || !periodId || !questionnaireId || !unitId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: 'Data formulir survey tidak lengkap.' },
        { status: 400 }
      );
    }

    // Pastikan periode survey masih aktif dan tidak ditutup
    const periodCheck = await db
      .select()
      .from(surveyPeriods)
      .where(and(eq(surveyPeriods.id, periodId), eq(surveyPeriods.status, 'ACTIVE')))
      .limit(1);

    if (periodCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Periode survey ini sudah ditutup atau tidak aktif lagi.' },
        { status: 400 }
      );
    }

    // 1. Buat Responden Anonim
    const randCodeNum = Math.floor(100000 + Math.random() * 900000);
    const respondentCode = `RES-2025-${randCodeNum}`;
    const respondentId = `resp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    await db.insert(respondents).values({
      id: respondentId,
      code: respondentCode,
      hospitalId,
      periodId,
      unitId,
      ageRange: demographics?.ageRange || null,
      gender: demographics?.gender || 'UNSPECIFIED',
      education: demographics?.education || null,
      occupation: demographics?.occupation || null,
      ipHash,
      sessionFingerprint: sha256(`${rawIp}-${userAgent}-${Date.now()}`),
    });

    // 2. Hitung overall score
    let totalLikert = 0;
    let likertCount = 0;

    const answerRecords: any[] = [];
    for (const ans of answers) {
      if (ans.likertValue) {
        totalLikert += Number(ans.likertValue);
        likertCount++;
      }
      answerRecords.push({
        responseId: '', // akan diisi setelah responseId dibuat
        questionId: ans.questionId,
        likertValue: ans.likertValue ? Number(ans.likertValue) : null,
        choiceValues: ans.choiceValues || null,
        textValue: ans.textValue || null,
      });
    }

    const overallScore =
      likertCount > 0
        ? ((totalLikert / (likertCount * 5)) * 100).toFixed(2)
        : '100.00';

    const npsScore = Math.min(10, Math.max(1, Math.round(Number(overallScore) / 10)));
    const responseId = `sresp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    // 3. Simpan Survey Response
    await db.insert(surveyResponses).values({
      id: responseId,
      hospitalId,
      periodId,
      questionnaireId,
      respondentId,
      unitId,
      overallScore,
      npsScore,
      isLocked: false,
    });

    // 4. Batch Insert Answers
    const answersToInsert = answerRecords.map((a) => ({
      ...a,
      responseId,
    }));
    if (answersToInsert.length > 0) {
      await db.insert(surveyAnswers).values(answersToInsert);
    }

    // 5. Simpan Ulasan Kualitatif jika ada
    if (reviewText && typeof reviewText === 'string' && reviewText.trim().length > 0) {
      const cleanReview = reviewText.trim();
      const analysis = analyzeReview(cleanReview);

      await db.insert(surveyReviews).values({
        id: `rev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        hospitalId,
        responseId,
        reviewText: cleanReview,
        sentiment: analysis.sentiment,
        keywordsJson: analysis.keywords,
      });
    }

    await writeActivityLog({
      hospitalId,
      action: 'SUBMIT_RESPONSE',
      description: `Survey responden baru ${respondentCode} berhasil diterima dengan skor ${overallScore}.`,
    });

    return NextResponse.json({
      success: true,
      message: 'Terima kasih! Survei kepuasan Anda berhasil dikirim.',
      data: {
        respondentCode,
        overallScore: Number(overallScore),
        npsScore,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error submitting survey:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal mengirimkan survey kepuasan.' },
      { status: 500 }
    );
  }
}
