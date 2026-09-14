import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp,
  boolean,
  decimal,
  mysqlEnum,
  json,
  index,
  uniqueIndex,
  bigint,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const hospitals = mysqlTable(
  'hospitals',
  {
    id: varchar('id', { length: 26 }).primaryKey(),
    code: varchar('code', { length: 20 }).notNull().unique(),
    name: varchar('name', { length: 150 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    address: text('address'),
    phone: varchar('phone', { length: 30 }),
    email: varchar('email', { length: 150 }),
    logoUrl: varchar('logo_url', { length: 255 }),
    description: text('description'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    codeIdx: uniqueIndex('idx_hospitals_code').on(t.code),
  })
);

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 26 }).primaryKey(),
    hospitalId: varchar('hospital_id', { length: 26 }), // NULL untuk Super Admin
    email: varchar('email', { length: 150 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 120 }).notNull(),
    role: mysqlEnum('role', ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'FIELD_OFFICER']).notNull(),
    assignedUnitId: varchar('assigned_unit_id', { length: 26 }), // khusus FIELD_OFFICER
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at'),
    failedLoginAttempts: int('failed_login_attempts').default(0).notNull(),
    lockedUntil: timestamp('locked_until'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    emailIdx: uniqueIndex('idx_users_email').on(t.email),
    roleHospitalIdx: index('idx_users_role_hospital').on(t.role, t.hospitalId),
  })
);

export const serviceUnits = mysqlTable(
  'service_units',
  {
    id: varchar('id', { length: 26 }).primaryKey(),
    hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
    code: varchar('code', { length: 20 }).notNull(),
    name: varchar('name', { length: 120 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    uniqCodePerHospital: uniqueIndex('idx_units_hospital_code').on(t.hospitalId, t.code),
  })
);

export const surveyPeriods = mysqlTable(
  'survey_periods',
  {
    id: varchar('id', { length: 26 }).primaryKey(),
    hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
    name: varchar('name', { length: 150 }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    status: mysqlEnum('status', ['DRAFT', 'ACTIVE', 'CLOSED']).default('DRAFT').notNull(),
    createdBy: varchar('created_by', { length: 26 }).notNull(),
    closedAt: timestamp('closed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    hospitalStatusIdx: index('idx_periods_hospital_status').on(t.hospitalId, t.status),
    dateRangeIdx: index('idx_periods_dates').on(t.hospitalId, t.startDate, t.endDate),
  })
);

export const questionnaires = mysqlTable(
  'questionnaires',
  {
    id: varchar('id', { length: 26 }).primaryKey(),
    hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
    periodId: varchar('period_id', { length: 26 }),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    version: int('version').default(1).notNull(),
    status: mysqlEnum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT').notNull(),
    publishedAt: timestamp('published_at'),
    createdBy: varchar('created_by', { length: 26 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    hospitalPeriodIdx: index('idx_questionnaires_hospital_period').on(t.hospitalId, t.periodId, t.status),
  })
);

export const questionCategories = mysqlTable('question_categories', {
  id: varchar('id', { length: 26 }).primaryKey(),
  questionnaireId: varchar('questionnaire_id', { length: 26 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).default('1.00').notNull(),
  orderIndex: int('order_index').notNull(),
});

export const questions = mysqlTable('questions', {
  id: varchar('id', { length: 26 }).primaryKey(),
  questionnaireId: varchar('questionnaire_id', { length: 26 }).notNull(),
  categoryId: varchar('category_id', { length: 26 }),
  text: text('text').notNull(),
  type: mysqlEnum('type', ['LIKERT_5', 'MULTIPLE_CHOICE', 'SHORT_TEXT', 'LONG_TEXT']).notNull(),
  optionsJson: json('options_json'), // untuk MULTIPLE_CHOICE
  isRequired: boolean('is_required').default(true).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).default('1.00').notNull(),
  orderIndex: int('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const respondents = mysqlTable(
  'respondents',
  {
    id: varchar('id', { length: 26 }).primaryKey(),
    code: varchar('code', { length: 30 }).notNull().unique(), // RES-2025-xxxxxx
    hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
    periodId: varchar('period_id', { length: 26 }).notNull(),
    unitId: varchar('unit_id', { length: 26 }).notNull(),
    ageRange: varchar('age_range', { length: 20 }), // '17-25', '26-35', dst
    gender: mysqlEnum('gender', ['MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED']).default('UNSPECIFIED'),
    education: varchar('education', { length: 50 }),
    occupation: varchar('occupation', { length: 80 }),
    ipHash: varchar('ip_hash', { length: 64 }),
    sessionFingerprint: varchar('session_fingerprint', { length: 64 }),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },
  (t) => ({
    hospitalPeriodIdx: index('idx_respondents_hospital_period').on(t.hospitalId, t.periodId),
    unitIdx: index('idx_respondents_unit').on(t.unitId, t.submittedAt),
  })
);

export const surveyResponses = mysqlTable(
  'survey_responses',
  {
    id: varchar('id', { length: 26 }).primaryKey(),
    hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
    periodId: varchar('period_id', { length: 26 }).notNull(),
    questionnaireId: varchar('questionnaire_id', { length: 26 }).notNull(),
    respondentId: varchar('respondent_id', { length: 26 }).notNull(),
    unitId: varchar('unit_id', { length: 26 }).notNull(),
    overallScore: decimal('overall_score', { precision: 5, scale: 2 }), // 0-100
    npsScore: int('nps_score'), // 0-10
    isLocked: boolean('is_locked').default(false).notNull(),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },
  (t) => ({
    hospitalPeriodIdx: index('idx_responses_hospital_period').on(t.hospitalId, t.periodId),
    unitDateIdx: index('idx_responses_unit_date').on(t.unitId, t.submittedAt),
  })
);

export const surveyAnswers = mysqlTable('survey_answers', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  responseId: varchar('response_id', { length: 26 }).notNull(),
  questionId: varchar('question_id', { length: 26 }).notNull(),
  likertValue: int('likert_value'), // 1-5
  choiceValues: json('choice_values'),
  textValue: text('text_value'),
});

export const surveyReviews = mysqlTable('survey_reviews', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  responseId: varchar('response_id', { length: 26 }).notNull(),
  reviewText: text('review_text').notNull(),
  sentiment: mysqlEnum('sentiment', ['POSITIVE', 'NEUTRAL', 'NEGATIVE']).default('NEUTRAL'),
  keywordsJson: json('keywords_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const qrCodes = mysqlTable('qr_codes', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
  unitId: varchar('unit_id', { length: 26 }).notNull(),
  periodId: varchar('period_id', { length: 26 }),
  qrUrl: varchar('qr_url', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }),
  scanCount: int('scan_count').default(0).notNull(),
  createdBy: varchar('created_by', { length: 26 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const surveyHistoryLogs = mysqlTable(
  'survey_history_logs',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    hospitalId: varchar('hospital_id', { length: 26 }).notNull(),
    actorUserId: varchar('actor_user_id', { length: 26 }).notNull(),
    entityType: mysqlEnum('entity_type', [
      'QUESTIONNAIRE',
      'PERIOD',
      'UNIT',
      'HOSPITAL',
      'USER',
      'QRCODE',
    ]).notNull(),
    entityId: varchar('entity_id', { length: 26 }).notNull(),
    action: mysqlEnum('action', [
      'CREATE',
      'UPDATE',
      'DELETE',
      'PUBLISH',
      'CLOSE',
      'ARCHIVE',
      'ACTIVATE',
    ]).notNull(),
    beforeJson: json('before_json'),
    afterJson: json('after_json'),
    notes: text('notes'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    hospitalIdx: index('idx_history_hospital').on(t.hospitalId, t.createdAt),
    entityIdx: index('idx_history_entity').on(t.entityType, t.entityId, t.createdAt),
  })
);

export const activityLogs = mysqlTable(
  'activity_logs',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    userId: varchar('user_id', { length: 26 }),
    hospitalId: varchar('hospital_id', { length: 26 }),
    action: varchar('action', { length: 80 }).notNull(), // LOGIN, LOGOUT, EXPORT, SUBMIT_RESPONSE, dll
    description: text('description'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index('idx_activity_user').on(t.userId, t.createdAt),
  })
);

export const passwordResetTokens = mysqlTable('password_reset_tokens', {
  id: varchar('id', { length: 26 }).primaryKey(),
  userId: varchar('user_id', { length: 26 }).notNull(),
  token: varchar('token', { length: 120 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationEmails = mysqlTable('notification_emails', {
  id: varchar('id', { length: 26 }).primaryKey(),
  hospitalId: varchar('hospital_id', { length: 26 }),
  recipientEmail: varchar('recipient_email', { length: 150 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  body: text('body').notNull(),
  status: mysqlEnum('status', ['PENDING', 'SENT', 'FAILED']).default('PENDING').notNull(),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const hospitalsRelations = relations(hospitals, ({ many }) => ({
  users: many(users),
  units: many(serviceUnits),
  periods: many(surveyPeriods),
  questionnaires: many(questionnaires),
  respondents: many(respondents),
  responses: many(surveyResponses),
  qrCodes: many(qrCodes),
}));

export const usersRelations = relations(users, ({ one }) => ({
  hospital: one(hospitals, {
    fields: [users.hospitalId],
    references: [hospitals.id],
  }),
  assignedUnit: one(serviceUnits, {
    fields: [users.assignedUnitId],
    references: [serviceUnits.id],
  }),
}));

export const serviceUnitsRelations = relations(serviceUnits, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [serviceUnits.hospitalId],
    references: [hospitals.id],
  }),
  responses: many(surveyResponses),
  respondents: many(respondents),
  qrCodes: many(qrCodes),
}));

export const surveyPeriodsRelations = relations(surveyPeriods, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [surveyPeriods.hospitalId],
    references: [hospitals.id],
  }),
  questionnaires: many(questionnaires),
  responses: many(surveyResponses),
  respondents: many(respondents),
}));

export const questionnairesRelations = relations(questionnaires, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [questionnaires.hospitalId],
    references: [hospitals.id],
  }),
  period: one(surveyPeriods, {
    fields: [questionnaires.periodId],
    references: [surveyPeriods.id],
  }),
  categories: many(questionCategories),
  questions: many(questions),
  responses: many(surveyResponses),
}));

export const questionCategoriesRelations = relations(questionCategories, ({ one, many }) => ({
  questionnaire: one(questionnaires, {
    fields: [questionCategories.questionnaireId],
    references: [questionnaires.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  questionnaire: one(questionnaires, {
    fields: [questions.questionnaireId],
    references: [questionnaires.id],
  }),
  category: one(questionCategories, {
    fields: [questions.categoryId],
    references: [questionCategories.id],
  }),
  answers: many(surveyAnswers),
}));

export const respondentsRelations = relations(respondents, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [respondents.hospitalId],
    references: [hospitals.id],
  }),
  unit: one(serviceUnits, {
    fields: [respondents.unitId],
    references: [serviceUnits.id],
  }),
  period: one(surveyPeriods, {
    fields: [respondents.periodId],
    references: [surveyPeriods.id],
  }),
  responses: many(surveyResponses),
}));

export const responsesRelations = relations(surveyResponses, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [surveyResponses.hospitalId],
    references: [hospitals.id],
  }),
  respondent: one(respondents, {
    fields: [surveyResponses.respondentId],
    references: [respondents.id],
  }),
  unit: one(serviceUnits, {
    fields: [surveyResponses.unitId],
    references: [serviceUnits.id],
  }),
  period: one(surveyPeriods, {
    fields: [surveyResponses.periodId],
    references: [surveyPeriods.id],
  }),
  questionnaire: one(questionnaires, {
    fields: [surveyResponses.questionnaireId],
    references: [questionnaires.id],
  }),
  answers: many(surveyAnswers),
  reviews: many(surveyReviews),
}));

export const surveyAnswersRelations = relations(surveyAnswers, ({ one }) => ({
  response: one(surveyResponses, {
    fields: [surveyAnswers.responseId],
    references: [surveyResponses.id],
  }),
  question: one(questions, {
    fields: [surveyAnswers.questionId],
    references: [questions.id],
  }),
}));

export const surveyReviewsRelations = relations(surveyReviews, ({ one }) => ({
  response: one(surveyResponses, {
    fields: [surveyReviews.responseId],
    references: [surveyResponses.id],
  }),
  hospital: one(hospitals, {
    fields: [surveyReviews.hospitalId],
    references: [hospitals.id],
  }),
}));

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  hospital: one(hospitals, {
    fields: [qrCodes.hospitalId],
    references: [hospitals.id],
  }),
  unit: one(serviceUnits, {
    fields: [qrCodes.unitId],
    references: [serviceUnits.id],
  }),
}));

// Export Types
export type Hospital = typeof hospitals.$inferSelect;
export type NewHospital = typeof hospitals.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ServiceUnit = typeof serviceUnits.$inferSelect;
export type NewServiceUnit = typeof serviceUnits.$inferInsert;

export type SurveyPeriod = typeof surveyPeriods.$inferSelect;
export type NewSurveyPeriod = typeof surveyPeriods.$inferInsert;

export type Questionnaire = typeof questionnaires.$inferSelect;
export type NewQuestionnaire = typeof questionnaires.$inferInsert;

export type QuestionCategory = typeof questionCategories.$inferSelect;
export type NewQuestionCategory = typeof questionCategories.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type Respondent = typeof respondents.$inferSelect;
export type NewRespondent = typeof respondents.$inferInsert;

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type NewSurveyResponse = typeof surveyResponses.$inferInsert;

export type SurveyAnswer = typeof surveyAnswers.$inferSelect;
export type NewSurveyAnswer = typeof surveyAnswers.$inferInsert;

export type SurveyReview = typeof surveyReviews.$inferSelect;
export type NewSurveyReview = typeof surveyReviews.$inferInsert;

export type QrCode = typeof qrCodes.$inferSelect;
export type NewQrCode = typeof qrCodes.$inferInsert;

export type SurveyHistoryLog = typeof surveyHistoryLogs.$inferSelect;
export type NewSurveyHistoryLog = typeof surveyHistoryLogs.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
