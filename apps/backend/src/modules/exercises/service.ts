import { and, asc, count, eq, like, type SQL } from "drizzle-orm"
import { status } from "elysia"

import { getDb, exercises as exercisesTable } from "../../db"
import type { ExerciseListQuery } from "./index"

const DEFAULT_LIMIT = 100
const withGuide = (row: typeof exercisesTable.$inferSelect) => {
  const { cuesJson, ...exercise } = row
  return { ...exercise, cues: JSON.parse(cuesJson) as { title: string; detail: string }[] }
}

export abstract class Exercises {
  static async list(query: ExerciseListQuery, d1?: D1Database) {
    const db = getDb(d1)
    const filters: SQL[] = []

    if (query.muscleGroup) filters.push(eq(exercisesTable.muscleGroup, query.muscleGroup))
    if (query.equipment) filters.push(eq(exercisesTable.equipment, query.equipment))
    if (query.q?.trim()) filters.push(like(exercisesTable.name, `%${query.q.trim()}%`))
    const totals = await db
      .select({ count: count() })
      .from(exercisesTable)
      .where(and(...filters))
      .get()

    const rows = await db
      .select()
      .from(exercisesTable)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(asc(exercisesTable.name))
      .limit(query.limit ?? DEFAULT_LIMIT)
      .offset(query.offset ?? 0)
      .all()

    return { exercises: rows.map(withGuide), count: totals!.count }
  }

  static async byId(exerciseId: string, d1?: D1Database) {
    const db = getDb(d1)
    const exercise = await db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.id, exerciseId))
      .get()

    if (!exercise) {
      throw status(404, { success: false, message: "Exercise not found" })
    }

    return withGuide(exercise)
  }
}
