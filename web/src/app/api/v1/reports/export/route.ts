import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  hospitals,
  surveyResponses,
  respondents,
  serviceUnits,
  surveyReviews,
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { writeActivityLog } from '@/lib/audit';

// In-memory rate limiting map: ip -> timestamps[]
const exportRateLimitMap = new Map<string, number[]>();

function checkExportRateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = exportRateLimitMap.get(ip) || [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= limit) return false;

  valid.push(now);
  exportRateLimitMap.set(ip, valid);
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const rawIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate Limit (5 export per menit)
    if (!checkExportRateLimit(rawIp, 5, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Batas unduh laporan tercapai (maksimal 5 kali per menit). Harap tunggu beberapa saat.',
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const hospitalCode = searchParams.get('hospitalCode') || 'RSUD-CIANJUR';
    const format = searchParams.get('format') || 'csv';

    const hosp = await db
      .select()
      .from(hospitals)
      .where(sql`UPPER(${hospitals.code}) = UPPER(${hospitalCode})`)
      .limit(1);

    if (hosp.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Rumah sakit tidak ditemukan.' },
        { status: 404 }
      );
    }

    const hospital = hosp[0];

    const data = await db
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
      .where(eq(surveyResponses.hospitalId, hospital.id))
      .orderBy(desc(surveyResponses.submittedAt));

    await writeActivityLog({
      hospitalId: hospital.id,
      action: 'EXPORT_REPORT',
      description: `Export laporan data respons survei format ${format.toUpperCase()} (${data.length} baris).`,
    });

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        hospital: { name: hospital.name, code: hospital.code },
        totalRows: data.length,
        exportedAt: new Date().toISOString(),
        data,
      });
    }

    // Generate CSV
    const headers = [
      'ID Respons',
      'Kode Responden',
      'Unit Layanan',
      'Rentang Usia',
      'Gender',
      'Skor IKM (0-100)',
      'Skor NPS (0-10)',
      'Tanggal Pengisian',
      'Sentimen',
      'Ulasan Responden',
    ];

    const csvRows = [headers.join(',')];

    for (const row of data) {
      const cleanReview = (row.reviewText || '').replace(/"/g, '""').replace(/\n/g, ' ');
      const values = [
        `"${row.id}"`,
        `"${row.respondentCode || ''}"`,
        `"${row.unitName || ''}"`,
        `"${row.ageRange || ''}"`,
        `"${row.gender || ''}"`,
        `"${row.overallScore || ''}"`,
        `"${row.npsScore ?? ''}"`,
        `"${new Date(row.submittedAt).toISOString()}"`,
        `"${row.sentiment || 'NEUTRAL'}"`,
        `"${cleanReview}"`,
      ];
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const filename = `Laporan_Survei_${hospital.code}_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal mengekspor laporan.' },
      { status: 500 }
    );
  }
}
