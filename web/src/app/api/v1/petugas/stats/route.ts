import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { db } from '@/db';
import { surveyResponses } from '@/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';

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

  if (!payload || !payload.hospitalId) {
    return NextResponse.json(
      { success: false, error: 'Token tidak valid.' },
      { status: 401 }
    );
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const conditions = [
      eq(surveyResponses.hospitalId, payload.hospitalId),
    ];

    if (payload.assignedUnitId) {
      conditions.push(eq(surveyResponses.unitId, payload.assignedUnitId));
    }

    // Total responses
    const allResponses = await db
      .select({
        overallScore: surveyResponses.overallScore,
        submittedAt: surveyResponses.submittedAt,
      })
      .from(surveyResponses)
      .where(and(...conditions));

    const totalCount = allResponses.length;
    let totalScoreSum = 0;
    let todayCount = 0;
    let satisfiedCount = 0;

    for (const r of allResponses) {
      const score = Number(r.overallScore) || 0;
      totalScoreSum += score;
      if (score >= 75) satisfiedCount++;
      if (new Date(r.submittedAt) >= today) {
        todayCount++;
      }
    }

    const averageScore = totalCount > 0 ? (totalScoreSum / totalCount).toFixed(1) : '0.0';
    const satisfactionRate = totalCount > 0 ? Math.round((satisfiedCount / totalCount) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalResponses: totalCount,
        todayResponses: todayCount,
        averageScore: Number(averageScore),
        satisfactionRate,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal menghitung statistik petugas.' },
      { status: 500 }
    );
  }
}
