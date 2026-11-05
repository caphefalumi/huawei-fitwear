import { and, asc, eq, gte, lte, sql } from "drizzle-orm"
import { status } from "elysia"

import { getDb, recoveryPlans, user, weightLogs } from "../../db"
import { isDateKey, toDateKey } from "../../lib/date"
import type { RecoveryBody, WeightBody, WeightsQuery } from "./index"

const requireDate = (date: string) => {
  if (!isDateKey(date))
    throw status(400, { success: false, message: "Date must be a valid YYYY-MM-DD calendar date" })
}

export abstract class Health {
  static async weights(userId: string, query: WeightsQuery, d1?: D1Database) {
    if (query.from) requireDate(query.from)
    if (query.to) requireDate(query.to)
    if (query.from && query.to && query.from > query.to)
      throw status(400, { success: false, message: "from must not exceed to" })
    const weights = await getDb(d1)
      .select()
      .from(weightLogs)
      .where(
        and(
          eq(weightLogs.userId, userId),
          query.from ? gte(weightLogs.loggedDate, query.from) : undefined,
          query.to ? lte(weightLogs.loggedDate, query.to) : undefined,
        ),
      )
      .orderBy(asc(weightLogs.loggedDate))
      .all()
    return { weights }
  }

  static async putWeight(userId: string, body: WeightBody, d1?: D1Database) {
    const loggedDate = body.date ?? toDateKey()
    requireDate(loggedDate)
    if (loggedDate > toDateKey())
      throw status(400, { success: false, message: "Weight cannot be logged in the future" })
    const db = getDb(d1)
    await db.batch([
      db
        .insert(weightLogs)
        .values({ userId, loggedDate, weightKg: body.weightKg })
        .onConflictDoUpdate({
          target: [weightLogs.userId, weightLogs.loggedDate],
          set: { weightKg: body.weightKg },
        }),
      db
        .update(user)
        .set({
          currentWeightKg: sql<number>`(select "weightKg" from "weight_logs" where "userId" = ${userId} order by "loggedDate" desc limit 1)`,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId)),
    ])
    const weight = await db
      .select()
      .from(weightLogs)
      .where(and(eq(weightLogs.userId, userId), eq(weightLogs.loggedDate, loggedDate)))
      .get()
    return { weight: weight! }
  }

  static async recovery(userId: string, d1?: D1Database) {
    const recovery = await getDb(d1)
      .select()
      .from(recoveryPlans)
      .where(eq(recoveryPlans.userId, userId))
      .get()
    return { recovery: recovery ?? null }
  }

  static async putRecovery(userId: string, body: RecoveryBody, d1?: D1Database) {
    requireDate(body.startDate)
    const area = body.area.trim()
    if (!area) throw status(400, { success: false, message: "Recovery area is required" })
    const values = { ...body, area, note: body.note?.trim() || null }
    await getDb(d1)
      .insert(recoveryPlans)
      .values({ ...values, userId })
      .onConflictDoUpdate({
        target: recoveryPlans.userId,
        set: values,
      })
      .run()
    return Health.recovery(userId, d1)
  }

  static async removeRecovery(userId: string, d1?: D1Database) {
    await getDb(d1).delete(recoveryPlans).where(eq(recoveryPlans.userId, userId)).run()
    return { success: true }
  }
}
