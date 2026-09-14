import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  surveyPeriods,
  surveyResponses,
  notificationEmails,
  hospitals,
  users,
} from '@/db/schema';
import { eq, and, lt, lte, gte } from 'drizzle-orm';
import { writeHistoryLog } from '@/lib/audit';

export async function GET(request: NextRequest) {
  return handleCron(request);
}

export async function POST(request: NextRequest) {
  return handleCron(request);
}

async function handleCron(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET || 'cron-secret-xxxxx';
    const authHeader =
      request.headers.get('x-cron-secret') ||
      request.nextUrl.searchParams.get('secret');

    if (authHeader !== cronSecret && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid CRON Secret' },
        { status: 401 }
      );
    }

    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // 1. Auto-Close Periode yang sudah melewati endDate
    const expiredPeriods = await db
      .select()
      .from(surveyPeriods)
      .where(and(eq(surveyPeriods.status, 'ACTIVE'), lt(surveyPeriods.endDate, now)));

    let closedCount = 0;
    for (const p of expiredPeriods) {
      await db
        .update(surveyPeriods)
        .set({ status: 'CLOSED', closedAt: now })
        .where(eq(surveyPeriods.id, p.id));

      await db
        .update(surveyResponses)
        .set({ isLocked: true })
        .where(eq(surveyResponses.periodId, p.id));

      await writeHistoryLog({
        hospitalId: p.hospitalId,
        actorUserId: 'SYSTEM_CRON',
        entityType: 'PERIOD',
        entityId: p.id,
        action: 'CLOSE',
        beforeJson: { status: 'ACTIVE' },
        afterJson: { status: 'CLOSED', closedAt: now.toISOString() },
        notes: `Periode "${p.name}" ditutup otomatis oleh Background Cron Job karena telah melewati batas akhir.`,
      });

      closedCount++;
    }

    // 2. Email Pengingat untuk Periode yang akan berakhir dalam 3 hari
    const endingSoonPeriods = await db
      .select()
      .from(surveyPeriods)
      .where(
        and(
          eq(surveyPeriods.status, 'ACTIVE'),
          gte(surveyPeriods.endDate, now),
          lte(surveyPeriods.endDate, threeDaysLater)
        )
      );

    let remindersSent = 0;
    for (const p of endingSoonPeriods) {
      // Ambil admin RS bersangkutan
      const adminUsers = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.hospitalId, p.hospitalId),
            eq(users.role, 'HOSPITAL_ADMIN')
          )
        );

      for (const u of adminUsers) {
        await db.insert(notificationEmails).values({
          id: `email_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
          hospitalId: p.hospitalId,
          recipientEmail: u.email,
          subject: `[Pengingat] Periode Survei "${p.name}" Akan Berakhir dalam 3 Hari`,
          body: `Halo ${u.fullName},\n\nPeriode survei kepuasan "${p.name}" dijadwalkan berakhir pada ${p.endDate.toLocaleDateString('id-ID')}. Pastikan pengumpulan data dan rekapitulasi unit telah optimal sebelum sistem menutup periode ini secara otomatis.\n\nSalam,\nTim SurveiKepuasan`,
          status: 'SENT',
          sentAt: now,
        });
        remindersSent++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Daily background cron job executed successfully.',
      timestamp: now.toISOString(),
      summary: {
        autoClosedPeriods: closedCount,
        remindersDispatched: remindersSent,
      },
    });
  } catch (error: any) {
    console.error('Error running cron job:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Cron Error' },
      { status: 500 }
    );
  }
}
