import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { hospitals, serviceUnits, surveyPeriods } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const hosp = await db
      .select()
      .from(hospitals)
      .where(eq(hospitals.code, code.toUpperCase()))
      .limit(1);

    if (hosp.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Rumah sakit tidak ditemukan.' },
        { status: 404 }
      );
    }

    const hospital = hosp[0];

    // Ambil unit layanan aktif
    const units = await db
      .select()
      .from(serviceUnits)
      .where(
        and(
          eq(serviceUnits.hospitalId, hospital.id),
          eq(serviceUnits.isActive, true)
        )
      );

    // Ambil periode survey yang sedang aktif
    const activePeriods = await db
      .select()
      .from(surveyPeriods)
      .where(
        and(
          eq(surveyPeriods.hospitalId, hospital.id),
          eq(surveyPeriods.status, 'ACTIVE')
        )
      )
      .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        hospital,
        units,
        activePeriod: activePeriods[0] || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal memuat profil rumah sakit.' },
      { status: 500 }
    );
  }
}
