'use server';

import { db } from '@/db';
import { hospitals } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireRole } from '@/lib/rbac';
import { writeHistoryLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function getHospitals() {
  return await db.select().from(hospitals).orderBy(desc(hospitals.createdAt));
}

export async function getHospitalByCode(code: string) {
  const list = await db
    .select()
    .from(hospitals)
    .where(eq(hospitals.code, code))
    .limit(1);
  return list[0] || null;
}

export async function createHospitalAction(data: {
  code: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  description?: string;
}) {
  const actor = await requireRole(['SUPER_ADMIN']);

  const cleanCode = data.code.trim().toUpperCase();

  // Validasi kode unik
  const existing = await db
    .select()
    .from(hospitals)
    .where(eq(hospitals.code, cleanCode))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: `Kode rumah sakit "${cleanCode}" sudah digunakan.` };
  }

  const newId = `hosp_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString(36).slice(-4)}`;

  const newRecord = {
    id: newId,
    code: cleanCode,
    name: data.name.trim(),
    city: data.city.trim(),
    address: data.address?.trim() || null,
    phone: data.phone?.trim() || null,
    email: data.email?.trim() || null,
    logoUrl: data.logoUrl?.trim() || null,
    description: data.description?.trim() || null,
    isActive: true,
  };

  await db.insert(hospitals).values(newRecord);

  await writeHistoryLog({
    hospitalId: newId,
    actorUserId: actor.id,
    entityType: 'HOSPITAL',
    entityId: newId,
    action: 'CREATE',
    beforeJson: null,
    afterJson: newRecord,
    notes: `Rumah Sakit baru "${newRecord.name}" (${newRecord.code}) ditambahkan oleh Super Admin.`,
  });

  revalidatePath('/admin/hospitals');
  revalidatePath('/pilih-rs');
  return { success: true, hospital: newRecord };
}

export async function updateHospitalAction(
  id: string,
  data: {
    name?: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    logoUrl?: string;
    description?: string;
  }
) {
  const actor = await requireRole(['SUPER_ADMIN']);

  const existing = await db.select().from(hospitals).where(eq(hospitals.id, id)).limit(1);
  if (existing.length === 0) {
    return { success: false, error: 'Rumah sakit tidak ditemukan.' };
  }

  const before = existing[0];
  const updateData = {
    ...(data.name && { name: data.name.trim() }),
    ...(data.city && { city: data.city.trim() }),
    ...(data.address !== undefined && { address: data.address.trim() }),
    ...(data.phone !== undefined && { phone: data.phone.trim() }),
    ...(data.email !== undefined && { email: data.email.trim() }),
    ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl.trim() }),
    ...(data.description !== undefined && { description: data.description.trim() }),
  };

  await db.update(hospitals).set(updateData).where(eq(hospitals.id, id));

  await writeHistoryLog({
    hospitalId: id,
    actorUserId: actor.id,
    entityType: 'HOSPITAL',
    entityId: id,
    action: 'UPDATE',
    beforeJson: before,
    afterJson: { ...before, ...updateData },
    notes: `Data profil rumah sakit diperbarui oleh Super Admin.`,
  });

  revalidatePath('/admin/hospitals');
  revalidatePath(`/admin/hospitals/${id}`);
  return { success: true };
}

export async function toggleHospitalStatusAction(id: string, isActive: boolean) {
  const actor = await requireRole(['SUPER_ADMIN']);

  const existing = await db.select().from(hospitals).where(eq(hospitals.id, id)).limit(1);
  if (existing.length === 0) {
    return { success: false, error: 'Rumah sakit tidak ditemukan.' };
  }

  const before = existing[0];

  await db.update(hospitals).set({ isActive }).where(eq(hospitals.id, id));

  await writeHistoryLog({
    hospitalId: id,
    actorUserId: actor.id,
    entityType: 'HOSPITAL',
    entityId: id,
    action: isActive ? 'ACTIVATE' : 'ARCHIVE',
    beforeJson: { isActive: before.isActive },
    afterJson: { isActive },
    notes: `Status rumah sakit diubah menjadi ${isActive ? 'Aktif' : 'Non-aktif'}.`,
  });

  revalidatePath('/admin/hospitals');
  return { success: true };
}
