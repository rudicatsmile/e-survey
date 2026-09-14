'use server';

import { db } from '@/db';
import { users, hospitals, serviceUnits } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { requireRole, assertHospitalAccess } from '@/lib/rbac';
import { writeHistoryLog } from '@/lib/audit';
import { hashPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUsersAction(targetHospitalId?: string) {
  const actor = await requireRole(['SUPER_ADMIN', 'HOSPITAL_ADMIN']);

  let queryHospitalId = targetHospitalId;
  if (actor.role === 'HOSPITAL_ADMIN') {
    queryHospitalId = actor.hospitalId!;
  }

  const query = db
    .select({
      id: users.id,
      hospitalId: users.hospitalId,
      hospitalName: hospitals.name,
      hospitalCode: hospitals.code,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      assignedUnitId: users.assignedUnitId,
      assignedUnitName: serviceUnits.name,
      isActive: users.isActive,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(hospitals, eq(users.hospitalId, hospitals.id))
    .leftJoin(serviceUnits, eq(users.assignedUnitId, serviceUnits.id))
    .orderBy(desc(users.createdAt));

  if (queryHospitalId) {
    return await query.where(eq(users.hospitalId, queryHospitalId));
  }

  return await query;
}

export async function createUserAction(data: {
  email: string;
  password: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'FIELD_OFFICER';
  hospitalId?: string | null;
  assignedUnitId?: string | null;
}) {
  const actor = await requireRole(['SUPER_ADMIN', 'HOSPITAL_ADMIN']);

  const cleanEmail = data.email.trim().toLowerCase();

  // Role validation
  if (actor.role === 'HOSPITAL_ADMIN') {
    if (data.role !== 'FIELD_OFFICER') {
      return { success: false, error: 'Admin RS hanya dapat mendaftarkan Petugas Survey.' };
    }
    data.hospitalId = actor.hospitalId;
  }

  if (data.role !== 'SUPER_ADMIN' && !data.hospitalId) {
    return { success: false, error: 'Pengguna non-Super Admin wajib ditautkan ke sebuah Rumah Sakit.' };
  }

  // Cek email duplikat
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, cleanEmail))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: `Email "${cleanEmail}" sudah terdaftar.` };
  }

  const newId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const passwordHash = await hashPassword(data.password);

  const newUser = {
    id: newId,
    hospitalId: data.hospitalId || null,
    email: cleanEmail,
    passwordHash: passwordHash,
    fullName: data.fullName.trim(),
    role: data.role,
    assignedUnitId: data.assignedUnitId || null,
    isActive: true,
  };

  await db.insert(users).values(newUser);

  await writeHistoryLog({
    hospitalId: data.hospitalId || 'SYSTEM',
    actorUserId: actor.id,
    entityType: 'USER',
    entityId: newId,
    action: 'CREATE',
    beforeJson: null,
    afterJson: {
      id: newId,
      email: cleanEmail,
      fullName: newUser.fullName,
      role: newUser.role,
      hospitalId: newUser.hospitalId,
    },
    notes: `Pengguna baru "${newUser.fullName}" (${newUser.role}) ditambahkan oleh ${actor.fullName}.`,
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUserAction(
  id: string,
  data: {
    fullName?: string;
    assignedUnitId?: string | null;
  }
) {
  const actor = await requireRole(['SUPER_ADMIN', 'HOSPITAL_ADMIN']);

  const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (existing.length === 0) {
    return { success: false, error: 'Pengguna tidak ditemukan.' };
  }

  const targetUser = existing[0];
  if (actor.role === 'HOSPITAL_ADMIN' && targetUser.hospitalId !== actor.hospitalId) {
    return { success: false, error: 'Akses ditolak ke pengguna rumah sakit lain.' };
  }

  await db
    .update(users)
    .set({
      ...(data.fullName && { fullName: data.fullName.trim() }),
      ...(data.assignedUnitId !== undefined && { assignedUnitId: data.assignedUnitId }),
    })
    .where(eq(users.id, id));

  await writeHistoryLog({
    hospitalId: targetUser.hospitalId || 'SYSTEM',
    actorUserId: actor.id,
    entityType: 'USER',
    entityId: id,
    action: 'UPDATE',
    beforeJson: { fullName: targetUser.fullName, assignedUnitId: targetUser.assignedUnitId },
    afterJson: { fullName: data.fullName || targetUser.fullName, assignedUnitId: data.assignedUnitId },
    notes: `Profil pengguna diperbarui.`,
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function toggleUserStatusAction(id: string, isActive: boolean) {
  const actor = await requireRole(['SUPER_ADMIN', 'HOSPITAL_ADMIN']);

  const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (existing.length === 0) {
    return { success: false, error: 'Pengguna tidak ditemukan.' };
  }

  const targetUser = existing[0];
  if (actor.role === 'HOSPITAL_ADMIN' && targetUser.hospitalId !== actor.hospitalId) {
    return { success: false, error: 'Akses ditolak.' };
  }

  await db.update(users).set({ isActive }).where(eq(users.id, id));

  await writeHistoryLog({
    hospitalId: targetUser.hospitalId || 'SYSTEM',
    actorUserId: actor.id,
    entityType: 'USER',
    entityId: id,
    action: isActive ? 'ACTIVATE' : 'ARCHIVE',
    beforeJson: { isActive: targetUser.isActive },
    afterJson: { isActive },
    notes: `Status akun diubah menjadi ${isActive ? 'Aktif' : 'Non-aktif'}.`,
  });

  revalidatePath('/admin/users');
  return { success: true };
}
