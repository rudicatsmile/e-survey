import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { db } from '@/db';
import { surveyResponses, respondents, serviceUnits, surveyReviews } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Token autentikasi tidak ditemukan.' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const payload = verifyJwtToken(token);

  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Token tidak valid atau telah kadaluarsa.' },
      { status: 401 }
    );
  }

  // Petugas hanya boleh melihat data unit yang ditugaskan
  const unitId = payload.assignedUnitId;
  const hospitalId = payload.hospitalId;

  if (!hospitalId) {
    return NextResponse.json(
      { success: false, error: 'Petugas tidak ditautkan ke rumah sakit mana pun.' },
      { status: 403 }
    );
  }

  try {
    const query = db
      .select({
        id: surveyResponses.id,
        respondentCode: respondents.code,
        ageRange: respondents.ageRange,
        gender: respondents.gender,
        unitName: serviceUnits.name,
        overallScore: surveyResponses.overallScore,
        npsScore: surveyResponses.npsScore,
        submittedAt: surveyResponses.submittedAt,
        reviewText: surveyReviews.reviewText,
        sentiment: surveyReviews.sentiment,
      })
      .from(surveyResponses)
      .leftJoin(respondents, eq(surveyResponses.respondentId, respondents.id))
      .leftJoin(serviceUnits, eq(surveyResponses.unitId, serviceUnits.id))
      .leftJoin(surveyReviews, eq(surveyResponses.id, surveyReviews.responseId))
      .orderBy(desc(surveyResponses.submittedAt))
      .limit(50);

    let list;
    if (unitId) {
      list = await query.where(
        and(
          eq(surveyResponses.hospitalId, hospitalId),
          eq(surveyResponses.unitId, unitId)
        )
      );
    } else {
      list = await query.where(eq(surveyResponses.hospitalId, hospitalId));
    }

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal memuat daftar respons.' },
      { status: 500 }
    );
  }
}
