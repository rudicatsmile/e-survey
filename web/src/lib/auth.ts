import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users, hospitals } from '@/db/schema';
import { writeActivityLog } from './audit';

const JWT_SECRET = process.env.JWT_SECRET || 'surveikepuasan-jwt-super-secret-key-2025';
const SESSION_COOKIE_NAME = 'surveikepuasan_session';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'FIELD_OFFICER';
  hospitalId: string | null;
  hospitalCode?: string | null;
  assignedUnitId?: string | null;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'FIELD_OFFICER';
  hospitalId: string | null;
  hospitalCode?: string | null;
  assignedUnitId?: string | null;
  iat?: number;
  exp?: number;
}

export function signJwtToken(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresIn = '24h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function loginWithEmailPassword(email: string, plainPass: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const userRecords = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (userRecords.length === 0) {
    return { success: false as const, error: 'Email atau kata sandi tidak valid.' };
  }

  const user = userRecords[0];

  // 1. Cek apakah akun aktif
  if (!user.isActive) {
    return { success: false as const, error: 'Akun Anda telah dinonaktifkan. Hubungi administrator.' };
  }

  // 2. Cek apakah akun terkunci karena gagal login 5x berturut-turut
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    const diffMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / (60 * 1000));
    return {
      success: false as const,
      error: `Akun Anda terkunci sementara karena 5 kali salah kata sandi. Coba lagi dalam ${diffMinutes} menit.`,
    };
  }

  // 3. Verifikasi kata sandi
  const isMatch = await verifyPassword(plainPass, user.passwordHash);

  if (!isMatch) {
    const newAttempts = user.failedLoginAttempts + 1;
    let lockedUntil: Date | null = null;
    let errorMsg = 'Email atau kata sandi tidak valid.';

    if (newAttempts >= 5) {
      lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
      errorMsg = 'Anda telah 5 kali salah kata sandi. Akun terkunci selama 15 menit.';
    }

    await db
      .update(users)
      .set({
        failedLoginAttempts: newAttempts,
        lockedUntil,
      })
      .where(eq(users.id, user.id));

    await writeActivityLog({
      userId: user.id,
      hospitalId: user.hospitalId,
      action: 'LOGIN_FAILED',
      description: `Percobaan login gagal untuk email ${normalizedEmail}. Percobaan ke-${newAttempts}.`,
    });

    return { success: false as const, error: errorMsg };
  }

  // 4. Sukses Login: Reset counter gagal & catat waktu login
  await db
    .update(users)
    .set({
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    })
    .where(eq(users.id, user.id));

  // Ambil kode rumah sakit jika ada
  let hospitalCode: string | null = null;
  if (user.hospitalId) {
    const hospRecords = await db
      .select({ code: hospitals.code })
      .from(hospitals)
      .where(eq(hospitals.id, user.hospitalId))
      .limit(1);
    if (hospRecords.length > 0) {
      hospitalCode = hospRecords[0].code;
    }
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    hospitalId: user.hospitalId,
    hospitalCode,
    assignedUnitId: user.assignedUnitId,
  };

  const token = signJwtToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    hospitalId: user.hospitalId,
    hospitalCode,
    assignedUnitId: user.assignedUnitId,
  });

  // Pasang cookie session
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 jam
    path: '/',
  });

  await writeActivityLog({
    userId: user.id,
    hospitalId: user.hospitalId,
    action: 'LOGIN',
    description: `Pengguna ${user.fullName} (${user.role}) berhasil masuk ke sistem.`,
  });

  // Tentukan redirect URL sesuai peran
  let redirectUrl = '/';
  if (user.role === 'SUPER_ADMIN') {
    redirectUrl = '/admin/dashboard';
  } else if (user.role === 'FIELD_OFFICER') {
    redirectUrl = hospitalCode
      ? `/h/${hospitalCode}/petugas/dashboard`
      : '/';
  } else if (user.role === 'HOSPITAL_ADMIN') {
    redirectUrl = hospitalCode
      ? `/h/${hospitalCode}/dashboard`
      : '/';
  }

  return { success: true as const, user: authUser, redirectUrl, token };
}

export async function logoutSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    const payload = verifyJwtToken(sessionToken);
    if (payload) {
      await writeActivityLog({
        userId: payload.userId,
        hospitalId: payload.hospitalId,
        action: 'LOGOUT',
        description: `Pengguna ${payload.email} keluar dari sistem.`,
      });
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyJwtToken(token);
    if (!payload) return null;

    // Verifikasi user masih aktif di database
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (userRecords.length === 0 || !userRecords[0].isActive) {
      return null;
    }

    const u = userRecords[0];
    let hospitalCode = payload.hospitalCode || null;

    if (u.hospitalId && !hospitalCode) {
      const hosp = await db
        .select({ code: hospitals.code })
        .from(hospitals)
        .where(eq(hospitals.id, u.hospitalId))
        .limit(1);
      if (hosp.length > 0) hospitalCode = hosp[0].code;
    }

    return {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      hospitalId: u.hospitalId,
      hospitalCode,
      assignedUnitId: u.assignedUnitId,
    };
  } catch {
    return null;
  }
}
