import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { status } from "elysia"
import { getDb, mealItems as mealItemsTable, mealLogs as mealLogsTable } from "../../db"
import { generateId } from "../../lib/id"
import { isDateKey, toDateKey } from "../../lib/date"
import { sumNutrition, type NutritionTotals } from "../../lib/nutrition"
import { deleteMealImage, saveMealImage } from "../../lib/meal-images"
import { Targets } from "../targets/service"
import type {
  MealCreateBody,
  MealItemBody,
  MealItemUpdateBody,
  MealListQuery,
  MealUpdateBody,
} from "./index"

const DEFAULT_LIMIT = 20

const round1 = (value: number): number => Math.round(value * 10) / 10

export type MealItemRecord = typeof mealItemsTable.$inferSelect
export type MealLogRecord = typeof mealLogsTable.$inferSelect

export type MealWithItems = MealLogRecord & {
  items: MealItemRecord[]
  totals: NutritionTotals
}

const itemTotals = (items: MealItemRecord[]): NutritionTotals =>
  sumNutrition(
    items.map((item) => ({
      caloriesKcal: item.caloriesKcal,
      proteinG: item.proteinG,
      carbsG: item.carbsG,
      fatG: item.fatG,
    })),
  )

const buildItemRow = (mealLogId: string, item: MealItemBody, createdAt: Date) => ({
  id: generateId(),
  mealLogId,
  foodName: item.foodName,
  servingUnit: item.servingUnit ?? "g",
  estimatedWeightG: item.estimatedWeightG,
  correctedWeightG: item.correctedWeightG ?? null,
  caloriesKcal: item.caloriesKcal,
  proteinG: item.proteinG,
  carbsG: item.carbsG,
  fatG: item.fatG,
  aiConfidence: item.aiConfidence ?? null,
  boundingBoxJson: item.boundingBoxJson ?? null,
  createdAt,
})

export abstract class Meals {
  static async create(
    userId: string,
    body: MealCreateBody,
    d1?: D1Database,
  ): Promise<MealWithItems> {
    const db = getDb(d1)
    const now = new Date()
    const loggedAt = body.loggedAt === undefined ? now : new Date(body.loggedAt)
    if (body.targetDate && !isDateKey(body.targetDate)) {
      throw status(400, { success: false, message: "targetDate must be a valid calendar date" })
    }

    if (Number.isNaN(loggedAt.getTime())) {
      throw status(400, { success: false, message: "loggedAt must be a valid ISO timestamp" })
    }

    const mealLog = {
      id: generateId(),
      userId,
      targetDate: body.targetDate ?? toDateKey(loggedAt),
      mealType: body.mealType,
      imageUrl: body.imageUrl ?? null,
      scaleReferenceType: body.scaleReferenceType ?? "finger",
      aiConfidenceOverall: body.aiConfidenceOverall ?? null,
      loggedAt,
      createdAt: now,
    }
    if (body.image) mealLog.imageUrl = await saveMealImage(userId, mealLog.id, body.image)

    const itemRows = body.items.map((item) => buildItemRow(mealLog.id, item, now))

    try {
      await db.batch([
        db.insert(mealLogsTable).values(mealLog),
        db.insert(mealItemsTable).values(itemRows),
      ])
    } catch (error) {
      if (body.image) {
        try {
          await deleteMealImage(userId, mealLog.id)
        } catch (cleanupError) {
          console.error("Meal image rollback failed", { mealId: mealLog.id, error: cleanupError })
        }
      }
      throw error
    }

    return { ...mealLog, items: itemRows, totals: itemTotals(itemRows) }
  }

  static async list(userId: string, query: MealListQuery, d1?: D1Database) {
    const db = getDb(d1)
    if (query.date && !isDateKey(query.date))
      throw status(400, { success: false, message: "date must be a valid calendar date" })
    const limit = query.limit ?? DEFAULT_LIMIT
    const offset = query.offset ?? 0

    const where = query.date
      ? and(eq(mealLogsTable.userId, userId), eq(mealLogsTable.targetDate, query.date))
      : eq(mealLogsTable.userId, userId)

    const logs = await db
      .select()
      .from(mealLogsTable)
      .where(where)
      .orderBy(desc(mealLogsTable.loggedAt))
      .limit(limit)
      .offset(offset)
      .all()

    if (logs.length === 0) {
      return { meals: [] as MealWithItems[], count: 0 }
    }

    const items = await db
      .select()
      .from(mealItemsTable)
      .where(
        inArray(
          mealItemsTable.mealLogId,
          logs.map((log) => log.id),
        ),
      )
      .all()

    const grouped = new Map<string, MealItemRecord[]>()
    for (const item of items) {
      const bucket = grouped.get(item.mealLogId)
      if (bucket) bucket.push(item)
      else grouped.set(item.mealLogId, [item])
    }

    const meals = logs.map((log) => {
      const logItems = grouped.get(log.id) ?? []
      return { ...log, items: logItems, totals: itemTotals(logItems) }
    })

    return { meals, count: meals.length }
  }

  static async byId(userId: string, mealId: string, d1?: D1Database): Promise<MealWithItems> {
    const db = getDb(d1)

    const log = await db
      .select()
      .from(mealLogsTable)
      .where(and(eq(mealLogsTable.id, mealId), eq(mealLogsTable.userId, userId)))
      .get()

    if (!log) {
      throw status(404, { success: false, message: "Meal log not found" })
    }

    const items = await db
      .select()
      .from(mealItemsTable)
      .where(eq(mealItemsTable.mealLogId, mealId))
      .all()

    return { ...log, items, totals: itemTotals(items) }
  }

  static async update(userId: string, mealId: string, body: MealUpdateBody, d1?: D1Database) {
    const db = getDb(d1)
    await Meals.byId(userId, mealId, d1)

    if (Object.keys(body).length)
      await db.update(mealLogsTable).set(body).where(eq(mealLogsTable.id, mealId)).run()

    return Meals.byId(userId, mealId, d1)
  }

  static async remove(userId: string, mealId: string, d1?: D1Database) {
    const db = getDb(d1)
    await Meals.byId(userId, mealId, d1)

    await db.batch([
      db.delete(mealItemsTable).where(eq(mealItemsTable.mealLogId, mealId)),
      db.delete(mealLogsTable).where(eq(mealLogsTable.id, mealId)),
    ])
    await deleteMealImage(userId, mealId)

    return { success: true, message: "Meal log deleted" }
  }

  static async addItem(userId: string, mealId: string, item: MealItemBody, d1?: D1Database) {
    const db = getDb(d1)
    await Meals.byId(userId, mealId, d1)

    const row = buildItemRow(mealId, item, new Date())
    await db.insert(mealItemsTable).values(row).run()

    return Meals.byId(userId, mealId, d1)
  }

  static async updateItem(
    userId: string,
    mealId: string,
    itemId: string,
    body: MealItemUpdateBody,
    d1?: D1Database,
  ) {
    const db = getDb(d1)
    await Meals.byId(userId, mealId, d1)

    const existing = await db
      .select()
      .from(mealItemsTable)
      .where(and(eq(mealItemsTable.id, itemId), eq(mealItemsTable.mealLogId, mealId)))
      .get()

    if (!existing) {
      throw status(404, { success: false, message: "Meal item not found" })
    }

    if (Object.keys(body).length)
      await db.update(mealItemsTable).set(body).where(eq(mealItemsTable.id, itemId)).run()

    return Meals.byId(userId, mealId, d1)
  }

  static async removeItem(userId: string, mealId: string, itemId: string, d1?: D1Database) {
    const db = getDb(d1)
    const meal = await Meals.byId(userId, mealId, d1)

    if (!meal.items.some((item) => item.id === itemId)) {
      throw status(404, { success: false, message: "Meal item not found" })
    }

    if (meal.items.length === 1) {
      return Meals.remove(userId, mealId, d1)
    }

    await db.delete(mealItemsTable).where(eq(mealItemsTable.id, itemId)).run()

    return Meals.byId(userId, mealId, d1)
  }

  static async dailySummary(userId: string, date?: string, d1?: D1Database) {
    const targetDate = date ?? toDateKey()
    if (!isDateKey(targetDate))
      throw status(400, { success: false, message: "date must be a valid calendar date" })
    const db = getDb(d1)
    const [totals, resolvedTargets] = await Promise.all([
      db
        .select({
          caloriesKcal: sql<number>`coalesce(sum(${mealItemsTable.caloriesKcal}), 0)`,
          proteinG: sql<number>`coalesce(sum(${mealItemsTable.proteinG}), 0)`,
          carbsG: sql<number>`coalesce(sum(${mealItemsTable.carbsG}), 0)`,
          fatG: sql<number>`coalesce(sum(${mealItemsTable.fatG}), 0)`,
          mealCount: sql<number>`count(distinct ${mealLogsTable.id})`,
        })
        .from(mealLogsTable)
        .leftJoin(mealItemsTable, eq(mealItemsTable.mealLogId, mealLogsTable.id))
        .where(and(eq(mealLogsTable.userId, userId), eq(mealLogsTable.targetDate, targetDate)))
        .get(),
      Targets.resolve(userId, targetDate, d1),
    ])
    const consumed = sumNutrition([totals!])

    return {
      targetDate,
      targets: resolvedTargets,
      consumed,
      remaining: {
        caloriesKcal: Math.round(resolvedTargets.calorieTargetKcal - consumed.caloriesKcal),
        proteinG: round1(resolvedTargets.proteinTargetG - consumed.proteinG),
        carbsG: round1(resolvedTargets.carbsTargetG - consumed.carbsG),
        fatG: round1(resolvedTargets.fatTargetG - consumed.fatG),
      },
      mealCount: totals!.mealCount,
    }
  }
}
