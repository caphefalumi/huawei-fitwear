import { and, asc, count, desc, eq, gte, isNotNull, lt, sql } from "drizzle-orm"
import { status } from "elysia"
import { exercises, getDb, workoutSessions, workoutSets } from "../../db"
import { isDateKey, shiftDateKey, toDateKey } from "../../lib/date"
import { generateId } from "../../lib/id"
import { Exercises } from "../exercises/service"
import type {
  WorkoutCompleteBody,
  WorkoutCreateBody,
  WorkoutListQuery,
  WorkoutSetBody,
  WorkoutSetUpdateBody,
  WorkoutStatsQuery,
} from "./index"

const badRequest = (message: string) => status(400, { success: false, message })
const parseTimestamp = (value: string | undefined, fallback = new Date()) => {
  const date = value === undefined ? fallback : new Date(value)
  if (!Number.isFinite(date.getTime())) throw badRequest("Timestamp must be valid ISO date-time")
  return date
}

export abstract class Workouts {
  static async create(userId: string, body: WorkoutCreateBody, d1?: D1Database) {
    const row = {
      id: generateId(),
      userId,
      sessionTitle: body.sessionTitle.trim(),
      workoutSplit: body.workoutSplit.trim(),
      startedAt: parseTimestamp(body.startedAt),
      createdAt: new Date(),
    }
    if (!row.sessionTitle || !row.workoutSplit) throw badRequest("Title and split are required")
    await getDb(d1).insert(workoutSessions).values(row).run()
    return Workouts.byId(userId, row.id, d1)
  }

  static async list(userId: string, query: WorkoutListQuery, d1?: D1Database) {
    const db = getDb(d1)
    const totals = await db
      .select({ count: count() })
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId))
      .get()
    const sessions = await db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.userId, userId))
      .orderBy(desc(workoutSessions.startedAt), desc(workoutSessions.id))
      .limit(query.limit ?? 20)
      .offset(query.offset ?? 0)
      .all()
    return { sessions, count: totals!.count }
  }

  static async byId(userId: string, sessionId: string, d1?: D1Database) {
    const db = getDb(d1)
    const session = await db
      .select()
      .from(workoutSessions)
      .where(and(eq(workoutSessions.id, sessionId), eq(workoutSessions.userId, userId)))
      .get()
    if (!session) throw status(404, { success: false, message: "Workout session not found" })
    const sets = await db
      .select()
      .from(workoutSets)
      .where(eq(workoutSets.workoutSessionId, sessionId))
      .orderBy(asc(workoutSets.setIndex))
      .all()
    const catalogue = await Promise.all(
      [...new Set(sets.map((set) => set.exerciseId))].map((id) => Exercises.byId(id, d1)),
    )
    const byId = new Map(catalogue.map((exercise) => [exercise.id, exercise]))
    return {
      ...session,
      sets: sets.map((set) => ({ ...set, exercise: byId.get(set.exerciseId)! })),
    }
  }

  static async remove(userId: string, sessionId: string, d1?: D1Database) {
    await Workouts.byId(userId, sessionId, d1)
    const db = getDb(d1)
    await db.batch([
      db.delete(workoutSets).where(eq(workoutSets.workoutSessionId, sessionId)),
      db
        .delete(workoutSessions)
        .where(and(eq(workoutSessions.id, sessionId), eq(workoutSessions.userId, userId))),
    ])
    return { success: true }
  }

  static async complete(
    userId: string,
    sessionId: string,
    body: WorkoutCompleteBody,
    d1?: D1Database,
  ) {
    const session = await Workouts.byId(userId, sessionId, d1)
    const completedAt = parseTimestamp(body.completedAt, session.completedAt ?? new Date())
    if (completedAt < session.startedAt) throw badRequest("Completion must not precede the start")
    const avg = body.avgHeartRateBpm ?? session.avgHeartRateBpm
    const max = body.maxHeartRateBpm ?? session.maxHeartRateBpm
    if (avg != null && max != null && avg > max)
      throw badRequest("Average heart rate must not exceed maximum")
    await getDb(d1)
      .update(workoutSessions)
      .set({ completedAt, avgHeartRateBpm: avg, maxHeartRateBpm: max })
      .where(and(eq(workoutSessions.id, sessionId), eq(workoutSessions.userId, userId)))
      .run()
    return Workouts.byId(userId, sessionId, d1)
  }

  static async addSet(userId: string, sessionId: string, body: WorkoutSetBody, d1?: D1Database) {
    await Workouts.byId(userId, sessionId, d1)
    await Exercises.byId(body.exerciseId, d1)
    const db = getDb(d1)
    // Resolve the next index inside the INSERT so simultaneous appends cannot choose the same index.
    const nextIndex = sql<number>`(select coalesce(max("setIndex"), 0) + 1 from "workout_sets" where "workoutSessionId" = ${sessionId})`
    const rows = await db
      .insert(workoutSets)
      .values({
        ...body,
        id: generateId(),
        workoutSessionId: sessionId,
        setIndex: body.setIndex ?? nextIndex,
      })
      .onConflictDoNothing({ target: [workoutSets.workoutSessionId, workoutSets.setIndex] })
      .returning()
      .all()
    if (!rows.length)
      throw status(409, { success: false, message: "Set index already exists in this session" })
    return Workouts.byId(userId, sessionId, d1)
  }

  static async updateSet(
    userId: string,
    sessionId: string,
    setId: string,
    body: WorkoutSetUpdateBody,
    d1?: D1Database,
  ) {
    const session = await Workouts.byId(userId, sessionId, d1)
    if (!session.sets.some((set) => set.id === setId))
      throw status(404, { success: false, message: "Workout set not found" })
    if (Object.keys(body).length)
      await getDb(d1)
        .update(workoutSets)
        .set(body)
        .where(and(eq(workoutSets.id, setId), eq(workoutSets.workoutSessionId, sessionId)))
        .run()
    return Workouts.byId(userId, sessionId, d1)
  }

  static async removeSet(userId: string, sessionId: string, setId: string, d1?: D1Database) {
    const session = await Workouts.byId(userId, sessionId, d1)
    if (!session.sets.some((set) => set.id === setId))
      throw status(404, { success: false, message: "Workout set not found" })
    await getDb(d1)
      .delete(workoutSets)
      .where(and(eq(workoutSets.id, setId), eq(workoutSets.workoutSessionId, sessionId)))
      .run()
    return Workouts.byId(userId, sessionId, d1)
  }

  static async stats(userId: string, query: WorkoutStatsQuery, d1?: D1Database) {
    if (
      (query.from && !isDateKey(query.from)) ||
      (query.to && !isDateKey(query.to)) ||
      (query.from && query.to && query.from > query.to)
    ) {
      throw badRequest("Date range must contain valid ordered calendar dates")
    }
    const db = getDb(d1)
    const filter = and(
      eq(workoutSessions.userId, userId),
      isNotNull(workoutSessions.completedAt),
      query.from ? gte(workoutSessions.startedAt, new Date(`${query.from}T00:00:00Z`)) : undefined,
      query.to
        ? lt(workoutSessions.startedAt, new Date(`${shiftDateKey(query.to, 1)}T00:00:00Z`))
        : undefined,
    )
    const sessions = await db
      .select()
      .from(workoutSessions)
      .where(filter)
      .orderBy(asc(workoutSessions.startedAt))
      .all()
    const sets = sessions.length
      ? await db
          .select({
            workoutSessionId: workoutSets.workoutSessionId,
            weightKg: workoutSets.weightKg,
            userConfirmedReps: workoutSets.userConfirmedReps,
            repetitionUnit: exercises.repetitionUnit,
          })
          .from(workoutSets)
          .innerJoin(exercises, eq(exercises.id, workoutSets.exerciseId))
          .innerJoin(workoutSessions, eq(workoutSessions.id, workoutSets.workoutSessionId))
          .where(filter)
          .all()
      : []
    const byDate = new Map<
      string,
      {
        date: string
        sessionCount: number
        totalSets: number
        totalReps: number
        totalVolumeKg: number
        totalDurationSeconds: number
      }
    >()
    const sessionDates = new Map(
      sessions.map((session) => [session.id, toDateKey(session.startedAt)]),
    )
    for (const session of sessions) {
      const date = toDateKey(session.startedAt)
      const bucket = byDate.get(date) ?? {
        date,
        sessionCount: 0,
        totalSets: 0,
        totalReps: 0,
        totalVolumeKg: 0,
        totalDurationSeconds: 0,
      }
      bucket.sessionCount++
      bucket.totalDurationSeconds += Math.max(
        0,
        Math.floor((session.completedAt!.getTime() - session.startedAt.getTime()) / 1000),
      )
      byDate.set(date, bucket)
    }
    for (const set of sets) {
      const bucket = byDate.get(sessionDates.get(set.workoutSessionId)!)!
      bucket.totalSets++
      if (set.repetitionUnit === "reps") {
        bucket.totalReps += set.userConfirmedReps
        bucket.totalVolumeKg += set.weightKg * set.userConfirmedReps
      }
    }
    const days = [...byDate.values()].map((day) => ({
      ...day,
      totalVolumeKg: Math.round(day.totalVolumeKg * 100) / 100,
    }))
    return {
      sessionCount: sessions.length,
      completedSessionCount: sessions.length,
      totalSets: sets.length,
      totalReps: days.reduce((total, day) => total + day.totalReps, 0),
      totalVolumeKg:
        Math.round(days.reduce((total, day) => total + day.totalVolumeKg, 0) * 100) / 100,
      totalDurationSeconds: days.reduce((total, day) => total + day.totalDurationSeconds, 0),
      byDate: days,
    }
  }
}
