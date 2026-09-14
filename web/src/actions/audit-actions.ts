'use server';

import { db } from '@/db';
import { surveyHistoryLogs, users, hospitals } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { requireRole } from '@/lib/rbac';

export async function getAuditLogsAction(filterHospitalId?: string) {
  const actor = await requireRole(['SUPER_ADMIN', 'HOSPITAL_ADMIN']);

  let queryHospitalId = filterHospitalId;
  if (actor.role === 'HOSPITAL_ADMIN') {
    queryHospitalId = actor.hospitalId!;
  }

  const query = db
    .select({
      id: surveyHistoryLogs.id,
      hospitalId: surveyHistoryLogs.hospitalId,
      hospitalName: hospitals.name,
      hospitalCode: hospitals.code,
      actorUserId: surveyHistoryLogs.actorUserId,
      actorName: users.fullName,
      actorEmail: users.email,
      actorRole: users.role,
      entityType: surveyHistoryLogs.entityType,
      entityId: surveyHistoryLogs.entityId,
      action: surveyHistoryLogs.action,
      beforeJson: surveyHistoryLogs.beforeJson,
      afterJson: surveyHistoryLogs.afterJson,
      notes: surveyHistoryLogs.notes,
      ipAddress: surveyHistoryLogs.ipAddress,
      userAgent: surveyHistoryLogs.userAgent,
      createdAt: surveyHistoryLogs.createdAt,
    })
    .from(surveyHistoryLogs)
    .leftJoin(users, eq(surveyHistoryLogs.actorUserId, users.id))
    .leftJoin(hospitals, eq(surveyHistoryLogs.hospitalId, hospitals.id))
    .orderBy(desc(surveyHistoryLogs.createdAt));

  if (queryHospitalId) {
    return await query.where(eq(surveyHistoryLogs.hospitalId, queryHospitalId));
  }

  return await query;
}
