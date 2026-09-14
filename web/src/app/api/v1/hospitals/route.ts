import { NextResponse } from 'next/server';
import { db } from '@/db';
import { hospitals, serviceUnits } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    const list = await db
      .select({
        id: hospitals.id,
        code: hospitals.code,
        name: hospitals.name,
        city: hospitals.city,
        address: hospitals.address,
        phone: hospitals.phone,
        email: hospitals.email,
        logoUrl: hospitals.logoUrl,
        description: hospitals.description,
        isActive: hospitals.isActive,
      })
      .from(hospitals)
      .where(eq(hospitals.isActive, true));

    // Ambil jumlah unit per RS
    const units = await db.select().from(serviceUnits).where(eq(serviceUnits.isActive, true));
    const unitCountMap = new Map<string, number>();
    for (const u of units) {
      unitCountMap.set(u.hospitalId, (unitCountMap.get(u.hospitalId) || 0) + 1);
    }

    const data = list.map((h) => ({
      ...h,
      totalUnits: unitCountMap.get(h.id) || 0,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal memuat daftar rumah sakit.' },
      { status: 500 }
    );
  }
}
