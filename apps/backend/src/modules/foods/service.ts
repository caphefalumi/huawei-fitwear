import { asc, eq, like } from "drizzle-orm"
import { status } from "elysia"

import { getDb, foods as foodsTable, type Food } from "../../db"
import { scalePer100 } from "../../lib/nutrition"
import { getAiSearch } from "../../worker/bindings"
import type { FoodSearchQuery } from "./index"

const DEFAULT_LIMIT = 25

function catalog(): AiSearchInstance {
  const namespace = getAiSearch()
  if (!namespace) throw new Error("AI_SEARCH namespace binding is required")
  return namespace.get("vooc")
}

function parseCatalogFood(text: string, key: string): Food {
  const value: unknown = JSON.parse(text)
  if (!value || typeof value !== "object") throw new Error(`Invalid food catalog item: ${key}`)
  const food = value as Record<string, unknown>
  if (
    typeof food.id !== "string" ||
    key !== `${food.id}.txt` ||
    !/^usda-fdc-\d+$/.test(food.id) ||
    typeof food.name !== "string" ||
    typeof food.servingUnit !== "string" ||
    typeof food.glyph !== "string" ||
    !["caloriesPer100", "proteinPer100G", "carbsPer100G", "fatPer100G"].every((field) => {
      const amount = food[field]
      return typeof amount === "number" && Number.isFinite(amount) && amount >= 0
    })
  )
    throw new Error(`Invalid food catalog item: ${key}`)
  return food as Food
}

async function catalogFoodById(foodId: string): Promise<Food | undefined> {
  const instance = catalog()
  const key = `${foodId}.txt`
  const { result } = await instance.items.list({ key, source: "builtin" })
  const item = result.find((entry) => entry.key === key)
  if (!item) return undefined
  const file = await instance.items.get(item.id).download()
  if (file.size > 1024 * 1024) throw new Error(`Food catalog item too large: ${key}`)
  return parseCatalogFood(await new Response(file.body).text(), key)
}

export abstract class Foods {
  static async search(query: FoodSearchQuery, d1?: D1Database) {
    const db = getDb(d1)
    const term = query.q?.trim()

    const rows = term
      ? await db
          .select()
          .from(foodsTable)
          .where(like(foodsTable.name, `%${term}%`))
          .orderBy(asc(foodsTable.name))
          .limit(query.limit ?? DEFAULT_LIMIT)
          .all()
      : await db
          .select()
          .from(foodsTable)
          .orderBy(asc(foodsTable.name))
          .limit(query.limit ?? DEFAULT_LIMIT)
          .all()

    if (!term) return { foods: rows, count: rows.length }

    const result = await catalog().search({
      query: term,
      ai_search_options: {
        retrieval: { max_num_results: 50, return_on_failure: false },
        query_rewrite: { enabled: false },
      },
    })
    const foods = new Map(rows.map((food) => [food.id, food]))
    for (const chunk of result.chunks) {
      if (!/^usda-fdc-\d+\.txt$/.test(chunk.item.key)) continue
      const food = parseCatalogFood(chunk.text, chunk.item.key)
      if (!foods.has(food.id)) foods.set(food.id, food)
    }
    const combined = [...foods.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, query.limit ?? DEFAULT_LIMIT)
    return { foods: combined, count: combined.length }
  }

  static async byId(foodId: string, d1?: D1Database) {
    const db = getDb(d1)
    const food =
      (await db.select().from(foodsTable).where(eq(foodsTable.id, foodId)).get()) ??
      (/^usda-fdc-\d+$/.test(foodId) ? await catalogFoodById(foodId) : undefined)
    if (!food) {
      throw status(404, { success: false, message: "Food not found" })
    }
    return food
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
