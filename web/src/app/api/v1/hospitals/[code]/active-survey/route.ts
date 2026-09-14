import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  hospitals,
  serviceUnits,
  surveyPeriods,
  questionnaires,
  questionCategories,
  questions,
} from '@/db/schema';
import { eq, and, asc, desc } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const hosp = await db
      .select()
      .from(hospitals)
      .where(eq(hospitals.code, code.toUpperCase()))
      .limit(1);

    if (hosp.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Rumah sakit tidak ditemukan.' },
        { status: 404 }
      );
    }

    const hospital = hosp[0];

    // Ambil unit layanan aktif
    const units = await db
      .select()
      .from(serviceUnits)
      .where(
        and(
          eq(serviceUnits.hospitalId, hospital.id),
          eq(serviceUnits.isActive, true)
        )
      )
      .orderBy(asc(serviceUnits.name));

    // Ambil periode aktif
    const activePeriods = await db
      .select()
      .from(surveyPeriods)
      .where(
        and(
          eq(surveyPeriods.hospitalId, hospital.id),
          eq(surveyPeriods.status, 'ACTIVE')
        )
      )
      .limit(1);

    if (activePeriods.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Saat ini belum ada periode survey yang sedang aktif untuk rumah sakit ini.',
        },
        { status: 400 }
      );
    }

    const period = activePeriods[0];

    // Ambil kuesioner published untuk periode ini atau untuk RS ini
    const questList = await db
      .select()
      .from(questionnaires)
      .where(
        and(
          eq(questionnaires.hospitalId, hospital.id),
          eq(questionnaires.status, 'PUBLISHED')
        )
      )
      .orderBy(desc(questionnaires.version))
      .limit(1);

    if (questList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Belum ada kuesioner yang dipublikasikan untuk rumah sakit ini.',
        },
        { status: 400 }
      );
    }

    const questionnaire = questList[0];

    // Ambil kategori pertanyaan
    const categories = await db
      .select()
      .from(questionCategories)
      .where(eq(questionCategories.questionnaireId, questionnaire.id))
      .orderBy(asc(questionCategories.orderIndex));

    // Ambil butir pertanyaan
    const questionsList = await db
      .select()
      .from(questions)
      .where(eq(questions.questionnaireId, questionnaire.id))
      .orderBy(asc(questions.orderIndex));

    return NextResponse.json({
      success: true,
      data: {
        hospital: {
          id: hospital.id,
          code: hospital.code,
          name: hospital.name,
          city: hospital.city,
          logoUrl: hospital.logoUrl,
        },
        period: {
          id: period.id,
          name: period.name,
          startDate: period.startDate,
          endDate: period.endDate,
        },
        questionnaire: {
          id: questionnaire.id,
          title: questionnaire.title,
          description: questionnaire.description,
          version: questionnaire.version,
        },
        units,
        categories,
        questions: questionsList,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Gagal memuat kuesioner aktif.' },
      { status: 500 }
    );
  }
}
