import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { qrCodes } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const qr = await db.select().from(qrCodes).where(eq(qrCodes.id, id)).limit(1);

    if (qr.length === 0) {
      return NextResponse.json(
        { success: false, error: 'QR Code tidak ditemukan.' },
        { status: 404 }
      );
    }

    await db
      .update(qrCodes)
      .set({ scanCount: sql`${qrCodes.scanCount} + 1` })
      .where(eq(qrCodes.id, id));

    return NextResponse.json({
      success: true,
      message: 'Scan berhasil dicatat.',
      scanCount: qr[0].scanCount + 1,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal memproses scan QR.' },
      { status: 500 }
    );
  }
}
