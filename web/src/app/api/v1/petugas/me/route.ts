import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';
import { db } from '@/db';
import { users, hospitals, serviceUnits } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

  const userRecords = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      hospitalId: users.hospitalId,
      hospitalName: hospitals.name,
      hospitalCode: hospitals.code,
      assignedUnitId: users.assignedUnitId,
      assignedUnitName: serviceUnits.name,
    })
    .from(users)
    .leftJoin(hospitals, eq(users.hospitalId, hospitals.id))
    .leftJoin(serviceUnits, eq(users.assignedUnitId, serviceUnits.id))
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (userRecords.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Pengguna tidak ditemukan.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: userRecords[0],
  });
}
