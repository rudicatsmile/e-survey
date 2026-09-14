import { getCurrentUser, AuthUser } from './auth';

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError('Sesi Anda telah berakhir. Silakan masuk kembali.', 401);
  }
  return user;
}

export async function requireRole(
  allowedRoles: ('SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'FIELD_OFFICER')[]
): Promise<AuthUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError('Anda tidak memiliki izin (role) untuk mengakses sumber daya ini.', 403);
  }
  return user;
}

export async function assertHospitalAccess(targetHospitalIdOrCode: string): Promise<AuthUser> {
  const user = await requireAuth();

  // Super Admin memiliki akses penuh ke seluruh rumah sakit
  if (user.role === 'SUPER_ADMIN') {
    return user;
  }

  // Admin RS dan Petugas hanya boleh mengakses rumah sakit milik mereka sendiri
  const matchesId = user.hospitalId === targetHospitalIdOrCode;
  const matchesCode =
    user.hospitalCode?.toLowerCase() === targetHospitalIdOrCode.toLowerCase();

  if (!matchesId && !matchesCode) {
    throw new AuthError(
      'Akses Ditolak: Anda tidak diizinkan mengakses atau memodifikasi data rumah sakit lain (Isolasi Multi-Tenant).',
      403
    );
  }

  return user;
}
