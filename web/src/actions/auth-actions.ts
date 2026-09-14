'use server';

import { loginWithEmailPassword, logoutSession, getCurrentUser, hashPassword } from '@/lib/auth';
import { db } from '@/db';
import { users, passwordResetTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false as const, error: 'Email dan kata sandi wajib diisi.' };
  }

  return await loginWithEmailPassword(email, password);
}

export async function logoutAction() {
  return await logoutSession();
}

export async function getCurrentUserAction() {
  return await getCurrentUser();
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  if (!email) {
    return { success: false, error: 'Alamat email wajib diisi.' };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    // Demi keamanan, tetap beri respons sukses agar tidak membocorkan enumerasi email
    return {
      success: true,
      message: 'Jika email terdaftar, instruksi pemulihan kata sandi telah dikirimkan ke email Anda.',
    };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

  await db.insert(passwordResetTokens).values({
    id: `prt_${Date.now().toString(36)}_${token.substring(0, 8)}`,
    userId: user[0].id,
    token: token,
    expiresAt: expiresAt,
  });

  return {
    success: true,
    message: 'Tautan pemulihan kata sandi berhasil dibuat.',
    resetToken: token, // Untuk keperluan dev/demo
  };
}

export async function resetPasswordWithTokenAction(formData: FormData) {
  const token = formData.get('token') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!token || !newPassword || newPassword.length < 8) {
    return { success: false, error: 'Kata sandi baru minimal 8 karakter.' };
  }

  const tokenRecords = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (tokenRecords.length === 0) {
    return { success: false, error: 'Token tidak valid atau telah digunakan.' };
  }

  const tokenData = tokenRecords[0];
  if (tokenData.usedAt || new Date(tokenData.expiresAt) < new Date()) {
    return { success: false, error: 'Token telah kadaluarsa atau sudah pernah dipakai.' };
  }

  const newHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      passwordHash: newHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    })
    .where(eq(users.id, tokenData.userId));

  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, tokenData.id));

  return { success: true, message: 'Kata sandi berhasil diperbarui. Silakan masuk kembali.' };
}
