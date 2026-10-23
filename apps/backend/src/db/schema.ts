import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { generateId } from '../lib/id';

export const user = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  gender: text('gender'),
  birthDate: text('birthDate'),
  heightCm: real('heightCm'),
  currentWeightKg: real('currentWeightKg'),
  targetWeightKg: real('targetWeightKg'),
  activityLevel: text('activityLevel').default('moderately_active'),
  fitnessGoal: text('fitnessGoal').default('muscle_gain'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  token: text('token').notNull().unique(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('session_userId_idx').on(table.userId),
]);

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => [
  uniqueIndex('verification_identifier_value_unique').on(table.identifier, table.value),
]);

export const dailyTargets = sqliteTable('daily_targets', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  targetDate: text('targetDate').notNull(),
  calorieTargetKcal: integer('calorieTargetKcal').notNull(),
  proteinTargetG: real('proteinTargetG').notNull(),
  carbsTargetG: real('carbsTargetG').notNull(),
  fatTargetG: real('fatTargetG').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  uniqueIndex('daily_targets_userId_targetDate_unique').on(table.userId, table.targetDate),
  index('daily_targets_userId_targetDate_idx').on(table.userId, table.targetDate),
]);

export const mealLogs = sqliteTable('meal_logs', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  targetDate: text('targetDate').notNull(),
  mealType: text('mealType').notNull(),
  imageUrl: text('imageUrl'),
  scaleReferenceType: text('scaleReferenceType').default('finger'),
  aiConfidenceOverall: real('aiConfidenceOverall'),
  loggedAt: integer('loggedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('meal_logs_userId_targetDate_idx').on(table.userId, table.targetDate),
]);

export const mealItems = sqliteTable('meal_items', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  mealLogId: text('mealLogId').notNull().references(() => mealLogs.id, { onDelete: 'cascade' }),
  foodName: text('foodName').notNull(),
  estimatedWeightG: real('estimatedWeightG').notNull(),
  correctedWeightG: real('correctedWeightG'),
  caloriesKcal: real('caloriesKcal').notNull(),
  proteinG: real('proteinG').notNull(),
  carbsG: real('carbsG').notNull(),
  fatG: real('fatG').notNull(),
  aiConfidence: real('aiConfidence'),
  boundingBoxJson: text('boundingBoxJson'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('meal_items_mealLogId_idx').on(table.mealLogId),
]);

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull().unique(),
  muscleGroup: text('muscleGroup').notNull(),
  equipment: text('equipment').notNull().default('barbell'),
  cadenceAnimationUrl: text('cadenceAnimationUrl'),
});

export const workoutSessions = sqliteTable('workout_sessions', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  sessionTitle: text('sessionTitle').notNull(),
  workoutSplit: text('workoutSplit').notNull(),
  avgHeartRateBpm: integer('avgHeartRateBpm'),
  maxHeartRateBpm: integer('maxHeartRateBpm'),
  startedAt: integer('startedAt', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completedAt', { mode: 'timestamp' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('workout_sessions_userId_startedAt_idx').on(table.userId, table.startedAt),
]);

export const workoutSets = sqliteTable('workout_sets', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  workoutSessionId: text('workoutSessionId').notNull().references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exerciseId: text('exerciseId').notNull().references(() => exercises.id),
  setIndex: integer('setIndex').notNull(),
  weightKg: real('weightKg').notNull(),
  targetReps: integer('targetReps').notNull().default(10),
  detectedReps: integer('detectedReps'),
  userConfirmedReps: integer('userConfirmedReps').notNull(),
  restDurationSeconds: integer('restDurationSeconds'),
  avgHrBpm: integer('avgHrBpm'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  uniqueIndex('workout_sets_session_setIndex_unique').on(table.workoutSessionId, table.setIndex),
  index('workout_sets_workoutSessionId_idx').on(table.workoutSessionId),
]);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  dailyTargets: many(dailyTargets),
  mealLogs: many(mealLogs),
  workoutSessions: many(workoutSessions),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const dailyTargetsRelations = relations(dailyTargets, ({ one }) => ({
  user: one(user, {
    fields: [dailyTargets.userId],
    references: [user.id],
  }),
}));

export const mealLogsRelations = relations(mealLogs, ({ one, many }) => ({
  user: one(user, {
    fields: [mealLogs.userId],
    references: [user.id],
  }),
  items: many(mealItems),
}));

export const mealItemsRelations = relations(mealItems, ({ one }) => ({
  mealLog: one(mealLogs, {
    fields: [mealItems.mealLogId],
    references: [mealLogs.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  sets: many(workoutSets),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ one, many }) => ({
  user: one(user, {
    fields: [workoutSessions.userId],
    references: [user.id],
  }),
  sets: many(workoutSets),
}));

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
  workoutSession: one(workoutSessions, {
    fields: [workoutSets.workoutSessionId],
    references: [workoutSessions.id],
  }),
  exercise: one(exercises, {
    fields: [workoutSets.exerciseId],
    references: [exercises.id],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
export type DailyTarget = typeof dailyTargets.$inferSelect;
export type NewDailyTarget = typeof dailyTargets.$inferInsert;
export type MealLog = typeof mealLogs.$inferSelect;
export type NewMealLog = typeof mealLogs.$inferInsert;
export type MealItem = typeof mealItems.$inferSelect;
export type NewMealItem = typeof mealItems.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type NewWorkoutSession = typeof workoutSessions.$inferInsert;
export type WorkoutSet = typeof workoutSets.$inferSelect;
export type NewWorkoutSet = typeof workoutSets.$inferInsert;
