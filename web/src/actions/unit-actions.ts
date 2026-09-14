'use server';

import { db } from '@/db';
import { serviceUnits, surveyResponses } from '@/db/schema';
import { eq, and, desc, count } from 'drizzle-orm';
import { assertHospitalAccess } from '@/lib/rbac';
import { writeHistoryLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function getUnitsAction(hospitalId: string) {
  await assertHospitalAccess(hospitalId);
  return await db
    .select()
    .from(serviceUnits)
    .where(eq(serviceUnits.hospitalId, hospitalId))
    .orderBy(desc(serviceUnits.createdAt));
}

export async function createUnitAction(data: {
  hospitalId: string;
  code: string;
  name: string;
  description?: string;
}) {
  const actor = await assertHospitalAccess(data.hospitalId);

  const cleanCode = data.code.trim().toUpperCase();

  // Validasi kode unik per rumah sakit
  const existing = await db
    .select()
    .from(serviceUnits)
    .where(
      and(
        eq(serviceUnits.hospitalId, data.hospitalId),
        eq(serviceUnits.code, cleanCode)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      error: `Kode unit "${cleanCode}" sudah ada di rumah sakit ini. Gunakan kode lain.`,
    };
  }

  const newId = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  const newRecord = {
    id: newId,
    hospitalId: data.hospitalId,
    code: cleanCode,
    name: data.name.trim(),
    description: data.description?.trim() || null,
    isActive: true,
  };

  await db.insert(serviceUnits).values(newRecord);

  await writeHistoryLog({
    hospitalId: data.hospitalId,
    actorUserId: actor.id,
    entityType: 'UNIT',
    entityId: newId,
    action: 'CREATE',
    beforeJson: null,
    afterJson: newRecord,
    notes: `Unit layanan baru "${newRecord.name}" (${newRecord.code}) ditambahkan.`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/units`);
  return { success: true, unit: newRecord };
}

export async function updateUnitAction(
  id: string,
  data: {
    hospitalId: string;
    name: string;
    description?: string;
    isActive?: boolean;
  }
) {
  const actor = await assertHospitalAccess(data.hospitalId);

  const existing = await db.select().from(serviceUnits).where(eq(serviceUnits.id, id)).limit(1);
  if (existing.length === 0) {
    return { success: false, error: 'Unit layanan tidak ditemukan.' };
  }

  const before = existing[0];
  const updateData = {
    name: data.name.trim(),
    description: data.description?.trim() || null,
    ...(data.isActive !== undefined && { isActive: data.isActive }),
  };

  await db.update(serviceUnits).set(updateData).where(eq(serviceUnits.id, id));

  await writeHistoryLog({
    hospitalId: data.hospitalId,
    actorUserId: actor.id,
    entityType: 'UNIT',
    entityId: id,
    action: 'UPDATE',
    beforeJson: before,
    afterJson: { ...before, ...updateData },
    notes: `Unit layanan "${data.name}" diperbarui.`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/units`);
  return { success: true };
}

export async function deleteUnitAction(id: string, hospitalId: string) {
  const actor = await assertHospitalAccess(hospitalId);

  const existing = await db.select().from(serviceUnits).where(eq(serviceUnits.id, id)).limit(1);
  if (existing.length === 0) {
    return { success: false, error: 'Unit layanan tidak ditemukan.' };
  }

  // Cek apakah sudah ada respon survey yang tertaut ke unit ini
  const responseCount = await db
    .select({ count: count() })
    .from(surveyResponses)
    .where(eq(surveyResponses.unitId, id));

  if (responseCount[0]?.count > 0) {
    return {
      success: false,
      error: `Unit tidak dapat dihapus karena telah memiliki ${responseCount[0].count} data respons survey. Anda dapat menonaktifkannya saja.`,
    };
  }

  await db.delete(serviceUnits).where(eq(serviceUnits.id, id));

  await writeHistoryLog({
    hospitalId: hospitalId,
    actorUserId: actor.id,
    entityType: 'UNIT',
    entityId: id,
    action: 'DELETE',
    beforeJson: existing[0],
    afterJson: null,
    notes: `Unit layanan "${existing[0].name}" dihapus.`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/units`);
  return { success: true };
}
