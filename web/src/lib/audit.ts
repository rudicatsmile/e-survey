import { db } from '@/db';
import { surveyHistoryLogs, activityLogs } from '@/db/schema';
import { headers } from 'next/headers';

export type EntityType = 'QUESTIONNAIRE' | 'PERIOD' | 'UNIT' | 'HOSPITAL' | 'USER' | 'QRCODE';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'CLOSE' | 'ARCHIVE' | 'ACTIVATE';

interface WriteHistoryLogParams {
  hospitalId: string;
  actorUserId: string;
  entityType: EntityType;
  entityId: string;
  action: AuditAction;
  beforeJson?: Record<string, any> | null;
  afterJson?: Record<string, any> | null;
  notes?: string;
}

export async function writeHistoryLog(params: WriteHistoryLogParams) {
  try {
    let ipAddress = '127.0.0.1';
    let userAgent = 'system';
    try {
      const headerList = await headers();
      ipAddress =
        headerList.get('x-forwarded-for')?.split(',')[0].trim() ||
        headerList.get('x-real-ip') ||
        '127.0.0.1';
      userAgent = headerList.get('user-agent') || 'unknown';
    } catch {
      // In background jobs or direct scripts headers() may throw
    }

    await db.insert(surveyHistoryLogs).values({
      hospitalId: params.hospitalId,
      actorUserId: params.actorUserId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      beforeJson: params.beforeJson || null,
      afterJson: params.afterJson || null,
      notes: params.notes || null,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Failed to write survey history log:', err);
  }
}

interface WriteActivityLogParams {
  userId?: string | null;
  hospitalId?: string | null;
  action: string;
  description: string;
}

export async function writeActivityLog(params: WriteActivityLogParams) {
  try {
    let ipAddress = '127.0.0.1';
    let userAgent = 'system';
    try {
      const headerList = await headers();
      ipAddress =
        headerList.get('x-forwarded-for')?.split(',')[0].trim() ||
        headerList.get('x-real-ip') ||
        '127.0.0.1';
      userAgent = headerList.get('user-agent') || 'unknown';
    } catch {
      // In background jobs or direct scripts headers() may throw
    }

    await db.insert(activityLogs).values({
      userId: params.userId || null,
      hospitalId: params.hospitalId || null,
      action: params.action,
      description: params.description,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Failed to write activity log:', err);
  }
}
