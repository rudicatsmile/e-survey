import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, hospitals, serviceUnits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, signJwtToken } from '@/lib/auth';
import { writeActivityLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const userRecords = await db
      .select({
        id: users.id,
        hospitalId: users.hospitalId,
        hospitalName: hospitals.name,
        hospitalCode: hospitals.code,
        email: users.email,
        passwordHash: users.passwordHash,
        fullName: users.fullName,
        role: users.role,
        assignedUnitId: users.assignedUnitId,
        assignedUnitName: serviceUnits.name,
        isActive: users.isActive,
        failedLoginAttempts: users.failedLoginAttempts,
        lockedUntil: users.lockedUntil,
      })
      .from(users)
      .leftJoin(hospitals, eq(users.hospitalId, hospitals.id))
      .leftJoin(serviceUnits, eq(users.assignedUnitId, serviceUnits.id))
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (userRecords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email atau kata sandi tidak valid.' },
        { status: 401 }
      );
    }

    const user = userRecords[0];

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Akun Anda telah dinonaktifkan.' },
        { status: 403 }
      );
    }

    if (user.failedLoginAttempts >= 5 && user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Akun terkunci sementara karena beberapa kali salah password. Silakan coba lagi nanti.',
        },
        { status: 423 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      const newAttempts = user.failedLoginAttempts + 1;
      let lockedUntil: Date | null = null;
      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await db
        .update(users)
        .set({ failedLoginAttempts: newAttempts, lockedUntil })
        .where(eq(users.id, user.id));

      return NextResponse.json(
        { success: false, error: 'Email atau kata sandi tidak valid.' },
        { status: 401 }
      );
    }

    // Reset failed count
    await db
      .update(users)
      .set({ failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId,
      hospitalCode: user.hospitalCode,
      assignedUnitId: user.assignedUnitId,
    });

    await writeActivityLog({
      userId: user.id,
      hospitalId: user.hospitalId,
      action: 'LOGIN_MOBILE',
      description: `Petugas/User ${user.fullName} berhasil masuk dari aplikasi mobile.`,
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          hospitalId: user.hospitalId,
          hospitalName: user.hospitalName,
          hospitalCode: user.hospitalCode,
          assignedUnitId: user.assignedUnitId,
          assignedUnitName: user.assignedUnitName,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal memproses login.' },
      { status: 500 }
    );
  }
}
