'use server';

import { db } from '@/db';
import {
  hospitals,
  surveyReviews,
  surveyResponses,
  serviceUnits,
  respondents,
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { assertHospitalAccess } from '@/lib/rbac';

export async function getHospitalReviewsAction(
  hospitalCodeOrId: string,
  sentimentFilter: string = 'ALL'
) {
  await assertHospitalAccess(hospitalCodeOrId);

  const hosp = await db
    .select()
    .from(hospitals)
    .where(
      sql`${hospitals.id} = ${hospitalCodeOrId} OR UPPER(${hospitals.code}) = UPPER(${hospitalCodeOrId})`
    )
    .limit(1);

  if (hosp.length === 0) return [];

  const hospitalId = hosp[0].id;

  const query = db
    .select({
      id: surveyReviews.id,
      reviewText: surveyReviews.reviewText,
      sentiment: surveyReviews.sentiment,
      keywords: surveyReviews.keywordsJson,
      createdAt: surveyReviews.createdAt,
      overallScore: surveyResponses.overallScore,
      unitName: serviceUnits.name,
      respondentCode: respondents.code,
    })
    .from(surveyReviews)
    .leftJoin(surveyResponses, eq(surveyReviews.responseId, surveyResponses.id))
    .leftJoin(serviceUnits, eq(surveyResponses.unitId, serviceUnits.id))
    .leftJoin(respondents, eq(surveyResponses.respondentId, respondents.id))
    .orderBy(desc(surveyReviews.createdAt));

  let list;
  if (sentimentFilter && sentimentFilter !== 'ALL') {
    list = await query.where(
      and(
        eq(surveyReviews.hospitalId, hospitalId),
        eq(surveyReviews.sentiment, sentimentFilter as any)
      )
    );
  } else {
    list = await query.where(eq(surveyReviews.hospitalId, hospitalId));
  }

  return list;
}

export async function getSentimentSummaryAction(hospitalCodeOrId: string) {
  await assertHospitalAccess(hospitalCodeOrId);

  const reviews = await getHospitalReviewsAction(hospitalCodeOrId, 'ALL');

  const total = reviews.length;
  let positive = 0;
  let neutral = 0;
  let negative = 0;

  const keywordCounts: Record<string, number> = {};

  for (const r of reviews) {
    if (r.sentiment === 'POSITIVE') positive++;
    else if (r.sentiment === 'NEGATIVE') negative++;
    else neutral++;

    if (Array.isArray(r.keywords)) {
      for (const kw of r.keywords) {
        if (typeof kw === 'string' && kw.length > 2) {
          keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
        }
      }
    }
  }

  // Ubah keywordCounts ke sorted list
  const topKeywords = Object.entries(keywordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;

  return {
    totalReviews: total,
    positive,
    neutral,
    negative,
    positivePercent,
    neutralPercent,
    negativePercent,
    topKeywords,
  };
}
