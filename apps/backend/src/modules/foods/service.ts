import { asc, eq, or, sql } from "drizzle-orm"
import { status } from "elysia"

import vietnameseFoods from "../../../data/vietnamese-usda.json"
import { getDb, foods as foodsTable, type Food } from "../../db"
import { scalePer100 } from "../../lib/nutrition"
import type { FoodSearchQuery } from "./index"

const DEFAULT_LIMIT = 25

export function normalizeFoodSearch(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d")
}

const vietnameseSearch = vietnameseFoods.map((food) => ({
  name: food.name_vi,
  id: `usda-fdc-${food.fdc_id}`,
  names: [food.name_vi, ...food.aliases_vi, food.name_en].map(normalizeFoodSearch),
}))
const vietnameseNames = new Map(vietnameseSearch.map((food) => [food.id, food.name]))

function withVietnameseName(food: Food): Food {
  const name = vietnameseNames.get(food.id)
  return name ? { ...food, name } : food
}

export abstract class Foods {
  static async search(query: FoodSearchQuery, d1?: D1Database) {
    const term = query.q?.trim()
    const normalizedTerm = term ? normalizeFoodSearch(term) : ""
    const matchingIds = normalizedTerm
      ? vietnameseSearch
          .filter((food) => food.names.some((name) => name.includes(normalizedTerm)))
          .map((food) => food.id)
      : []
    // Bind the ID list as one parameter even for broad queries.
    const curatedMatch = matchingIds.length
      ? sql`${foodsTable.id} IN (SELECT value FROM json_each(${JSON.stringify(matchingIds)}))`
      : undefined
    const rows = await getDb(d1)
      .select()
      .from(foodsTable)
      .where(
        term
          ? or(sql`instr(lower(${foodsTable.name}), lower(${term})) > 0`, curatedMatch)
          : undefined,
      )
      .orderBy(...(curatedMatch ? [sql`${curatedMatch} DESC`] : []), asc(foodsTable.name))
      .limit(query.limit ?? DEFAULT_LIMIT)
      .all()
    return { foods: rows.map(withVietnameseName), count: rows.length }
  }

  static async byId(foodId: string, d1?: D1Database) {
    const db = getDb(d1)
    const food = await db.select().from(foodsTable).where(eq(foodsTable.id, foodId)).get()
    if (!food) {
      throw status(404, { success: false, message: "Food not found" })
    }
    return withVietnameseName(food)
  }

  static async estimatePortion(foodId: string, weightG: number, d1?: D1Database) {
    const food = await Foods.byId(foodId, d1)
    return {
      food,
      weightG,
      nutrition: scalePer100(food, weightG),
    }
  }
}
