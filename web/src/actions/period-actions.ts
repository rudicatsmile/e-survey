'use server';

import { db } from '@/db';
import { surveyPeriods, surveyResponses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { assertHospitalAccess } from '@/lib/rbac';
import { writeHistoryLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function getPeriodsAction(hospitalId: string) {
  await assertHospitalAccess(hospitalId);
  return await db
    .select()
    .from(surveyPeriods)
    .where(eq(surveyPeriods.hospitalId, hospitalId))
    .orderBy(desc(surveyPeriods.createdAt));
}

export async function createPeriodAction(data: {
  hospitalId: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: 'DRAFT' | 'ACTIVE';
}) {
  const actor = await assertHospitalAccess(data.hospitalId);

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (end <= start) {
    return { success: false, error: 'Tanggal selesai harus setelah tanggal mulai.' };
  }

  const pId = `period_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  const newPeriod = {
    id: pId,
    hospitalId: data.hospitalId,
    name: data.name.trim(),
    startDate: start,
    endDate: end,
    status: data.status || ('ACTIVE' as const),
    createdBy: actor.id,
  };

  await db.insert(surveyPeriods).values(newPeriod);

  await writeHistoryLog({
    hospitalId: data.hospitalId,
    actorUserId: actor.id,
    entityType: 'PERIOD',
    entityId: pId,
    action: data.status === 'ACTIVE' ? 'ACTIVATE' : 'CREATE',
    beforeJson: null,
    afterJson: newPeriod,
    notes: `Periode survey baru "${newPeriod.name}" dibuat dengan status ${newPeriod.status}.`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/periods`);
  return { success: true, period: newPeriod };
}

export async function closePeriodAction(id: string, hospitalId: string) {
  const actor = await assertHospitalAccess(hospitalId);

  const existing = await db
    .select()
    .from(surveyPeriods)
    .where(eq(surveyPeriods.id, id))
    .limit(1);

  if (existing.length === 0) {
    return { success: false, error: 'Periode tidak ditemukan.' };
  }

  const before = existing[0];
  const now = new Date();

  // Update status periode ke CLOSED dan kunci semua respons yang terkait
  await db
    .update(surveyPeriods)
    .set({
      status: 'CLOSED',
      closedAt: now,
    })
    .where(eq(surveyPeriods.id, id));

  // Lock semua responses pada periode ini
  await db
    .update(surveyResponses)
    .set({ isLocked: true })
    .where(eq(surveyResponses.periodId, id));

  await writeHistoryLog({
    hospitalId: hospitalId,
    actorUserId: actor.id,
    entityType: 'PERIOD',
    entityId: id,
    action: 'CLOSE',
    beforeJson: before,
    afterJson: { ...before, status: 'CLOSED', closedAt: now },
    notes: `Periode survey "${before.name}" resmi ditutup. Seluruh data respons dikunci (read-only).`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/periods`);
  return { success: true };
}
