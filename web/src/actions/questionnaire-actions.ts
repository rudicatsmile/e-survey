'use server';

import { db } from '@/db';
import {
  questionnaires,
  questionCategories,
  questions,
  surveyResponses,
} from '@/db/schema';
import { eq, and, desc, asc, count } from 'drizzle-orm';
import { assertHospitalAccess } from '@/lib/rbac';
import { writeHistoryLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function getQuestionnairesAction(hospitalId: string) {
  await assertHospitalAccess(hospitalId);
  return await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.hospitalId, hospitalId))
    .orderBy(desc(questionnaires.createdAt));
}

export async function getQuestionnaireDetailAction(id: string, hospitalId: string) {
  await assertHospitalAccess(hospitalId);

  const quest = await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.id, id))
    .limit(1);

  if (quest.length === 0) return null;

  const categories = await db
    .select()
    .from(questionCategories)
    .where(eq(questionCategories.questionnaireId, id))
    .orderBy(asc(questionCategories.orderIndex));

  const questionsList = await db
    .select()
    .from(questions)
    .where(eq(questions.questionnaireId, id))
    .orderBy(asc(questions.orderIndex));

  return {
    ...quest[0],
    categories,
    questions: questionsList,
  };
}

export async function createQuestionnaireAction(data: {
  hospitalId: string;
  title: string;
  description?: string;
  periodId?: string | null;
  categories: { name: string; weight?: string }[];
  questions: {
    text: string;
    type: 'LIKERT_5' | 'MULTIPLE_CHOICE' | 'SHORT_TEXT' | 'LONG_TEXT';
    categoryIndex: number;
    optionsJson?: string[] | null;
    isRequired?: boolean;
    weight?: string;
  }[];
}) {
  const actor = await assertHospitalAccess(data.hospitalId);

  const qId = `quest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  const newQ = {
    id: qId,
    hospitalId: data.hospitalId,
    periodId: data.periodId || null,
    title: data.title.trim(),
    description: data.description?.trim() || null,
    version: 1,
    status: 'DRAFT' as const,
    createdBy: actor.id,
  };

  await db.insert(questionnaires).values(newQ);

  // Insert categories
  const categoryIds: string[] = [];
  for (let i = 0; i < data.categories.length; i++) {
    const cat = data.categories[i];
    const catId = `cat_${Date.now().toString(36)}_${i}`;
    categoryIds.push(catId);
    await db.insert(questionCategories).values({
      id: catId,
      questionnaireId: qId,
      name: cat.name.trim(),
      weight: cat.weight || '1.00',
      orderIndex: i + 1,
    });
  }

  // Insert questions
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const catId = categoryIds[q.categoryIndex] || categoryIds[0] || null;
    await db.insert(questions).values({
      id: `q_${Date.now().toString(36)}_${i}`,
      questionnaireId: qId,
      categoryId: catId,
      text: q.text.trim(),
      type: q.type,
      optionsJson: q.optionsJson || null,
      isRequired: q.isRequired ?? true,
      weight: q.weight || '1.00',
      orderIndex: i + 1,
    });
  }

  await writeHistoryLog({
    hospitalId: data.hospitalId,
    actorUserId: actor.id,
    entityType: 'QUESTIONNAIRE',
    entityId: qId,
    action: 'CREATE',
    beforeJson: null,
    afterJson: newQ,
    notes: `Kuesioner baru "${newQ.title}" dibuat (DRAFT) dengan ${data.questions.length} butir pertanyaan.`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/questionnaires`);
  return { success: true, questionnaireId: qId };
}

export async function publishQuestionnaireAction(id: string, hospitalId: string) {
  const actor = await assertHospitalAccess(hospitalId);

  const existing = await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.id, id))
    .limit(1);

  if (existing.length === 0) {
    return { success: false, error: 'Kuesioner tidak ditemukan.' };
  }

  const before = existing[0];
  const newVersion = before.version + 1;

  await db
    .update(questionnaires)
    .set({
      status: 'PUBLISHED',
      publishedAt: new Date(),
      version: newVersion,
    })
    .where(eq(questionnaires.id, id));

  await writeHistoryLog({
    hospitalId: hospitalId,
    actorUserId: actor.id,
    entityType: 'QUESTIONNAIRE',
    entityId: id,
    action: 'PUBLISH',
    beforeJson: { status: before.status, version: before.version },
    afterJson: { status: 'PUBLISHED', version: newVersion },
    notes: `Kuesioner dipublikasikan ke Versi ${newVersion}.`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/questionnaires`);
  return { success: true };
}

export async function reorderQuestionsAction(
  questionnaireId: string,
  orderedQuestionIds: string[],
  hospitalId: string
) {
  const actor = await assertHospitalAccess(hospitalId);

  for (let i = 0; i < orderedQuestionIds.length; i++) {
    await db
      .update(questions)
      .set({ orderIndex: i + 1 })
      .where(
        and(
          eq(questions.id, orderedQuestionIds[i]),
          eq(questions.questionnaireId, questionnaireId)
        )
      );
  }

  await writeHistoryLog({
    hospitalId: hospitalId,
    actorUserId: actor.id,
    entityType: 'QUESTIONNAIRE',
    entityId: questionnaireId,
    action: 'UPDATE',
    beforeJson: null,
    afterJson: { orderedQuestionIds },
    notes: `Urutan pertanyaan kuesioner disesuaikan ulang.`,
  });

  return { success: true };
}

export async function deleteQuestionnaireAction(id: string, hospitalId: string) {
  const actor = await assertHospitalAccess(hospitalId);

  // Aturan PRD: Tidak dapat dihapus jika ada respons
  const responseTotal = await db
    .select({ count: count() })
    .from(surveyResponses)
    .where(eq(surveyResponses.questionnaireId, id));

  if (responseTotal[0]?.count > 0) {
    return {
      success: false,
      error: `Kuesioner tidak dapat dihapus karena telah terisi ${responseTotal[0].count} respons responden. Anda dapat mengarsipkannya saja.`,
    };
  }

  const existing = await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.id, id))
    .limit(1);

  if (existing.length === 0) {
    return { success: false, error: 'Kuesioner tidak ditemukan.' };
  }

  await db.delete(questions).where(eq(questions.questionnaireId, id));
  await db.delete(questionCategories).where(eq(questionCategories.questionnaireId, id));
  await db.delete(questionnaires).where(eq(questionnaires.id, id));

  await writeHistoryLog({
    hospitalId: hospitalId,
    actorUserId: actor.id,
    entityType: 'QUESTIONNAIRE',
    entityId: id,
    action: 'DELETE',
    beforeJson: existing[0],
    afterJson: null,
    notes: `Kuesioner "${existing[0].title}" dihapus permanen.`,
  });

  revalidatePath(`/h/${actor.hospitalCode}/questionnaires`);
  return { success: true };
}
