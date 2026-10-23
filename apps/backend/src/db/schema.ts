import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// 1. BETTER AUTH MODELS (With User Extended for Biometrics)
// ============================================================================

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),

  // Better Auth Extended Biometrics & Goals
  gender: text('gender'),
  birthDate: text('birthDate'),
  heightCm: real('heightCm'),
  currentWeightKg: real('currentWeightKg'),
  targetWeightKg: real('targetWeightKg'),
  activityLevel: text('activityLevel').default('moderately_active'),
  fitnessGoal: text('fitnessGoal').default('muscle_gain'),
  bmrKcal: real('bmrKcal'),
  tdeeKcal: real('tdeeKcal'),
  proteinTargetG: real('proteinTargetG'),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
}, (table) => [
  index('session_userId_idx').on(table.userId),
]);

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('account_userId_idx').on(table.userId),
]);

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================================
// 2. DAILY NUTRITION TARGETS & RING SYNC (Watch 10% Tick Steps)
// ============================================================================

export const dailyTargets = sqliteTable('daily_targets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  targetDate: text('targetDate').notNull(), // ISO 'YYYY-MM-DD'
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

// ============================================================================
// 3. MEAL LOGS & ITEMS (Vision AI & Ground Truth User Edits)
// ============================================================================

export const mealLogs = sqliteTable('meal_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  targetDate: text('targetDate').notNull(), // ISO 'YYYY-MM-DD'
  mealType: text('mealType').notNull(), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  imageUrl: text('imageUrl'),
  scaleReferenceType: text('scaleReferenceType').default('finger'),
  totalCaloriesKcal: real('totalCaloriesKcal').notNull(),
  totalProteinG: real('totalProteinG').notNull(),
  totalCarbsG: real('totalCarbsG').notNull(),
  totalFatG: real('totalFatG').notNull(),
  aiConfidenceOverall: real('aiConfidenceOverall'),
  loggedAt: integer('loggedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('meal_logs_userId_targetDate_idx').on(table.userId, table.targetDate),
]);

export const mealItems = sqliteTable('meal_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  mealLogId: text('mealLogId').notNull().references(() => mealLogs.id, { onDelete: 'cascade' }),
  foodName: text('foodName').notNull(),
  estimatedWeightG: real('estimatedWeightG').notNull(),
  correctedWeightG: real('correctedWeightG'), // User manual ground truth edit for accuracy testing
  caloriesKcal: real('caloriesKcal').notNull(),
  proteinG: real('proteinG').notNull(),
  carbsG: real('carbsG').notNull(),
  fatG: real('fatG').notNull(),
  aiConfidence: real('aiConfidence'),
  boundingBoxJson: text('boundingBoxJson'), // JSON string: {"ymin":..,"xmin":..,"ymax":..,"xmax":..}
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('meal_items_mealLogId_idx').on(table.mealLogId),
]);

// ============================================================================
// 4. EXERCISES & WORKOUT SESSIONS (Watch IMU Rep-Counting & Sets)
// ============================================================================

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  muscleGroup: text('muscleGroup').notNull(), // 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'
  equipment: text('equipment').notNull().default('barbell'),
  cadenceAnimationUrl: text('cadenceAnimationUrl'),
});

export const workoutSessions = sqliteTable('workout_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  sessionTitle: text('sessionTitle').notNull(), // e.g. 'Push Day'
  workoutSplit: text('workoutSplit').notNull(), // 'push' | 'pull' | 'legs'
  avgHeartRateBpm: integer('avgHeartRateBpm'),
  maxHeartRateBpm: integer('maxHeartRateBpm'),
  totalVolumeKg: real('totalVolumeKg').notNull().default(0),
  startedAt: integer('startedAt', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completedAt', { mode: 'timestamp' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('workout_sessions_userId_startedAt_idx').on(table.userId, table.startedAt),
]);

export const workoutSets = sqliteTable('workout_sets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  workoutSessionId: text('workoutSessionId').notNull().references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exerciseId: text('exerciseId').notNull().references(() => exercises.id),
  setIndex: integer('setIndex').notNull(),
  weightKg: real('weightKg').notNull(),
  targetReps: integer('targetReps').notNull().default(10),
  detectedReps: integer('detectedReps'), // Reps counted by Watch IMU classifier
  userConfirmedReps: integer('userConfirmedReps').notNull(), // Reps confirmed on watch
  restDurationSeconds: integer('restDurationSeconds'), // Rest buzzer duration (60s, 90s)
  avgHrBpm: integer('avgHrBpm'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => [
  index('workout_sets_workoutSessionId_idx').on(table.workoutSessionId),
]);

// ============================================================================
// RELATIONS
// ============================================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
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

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
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

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
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
