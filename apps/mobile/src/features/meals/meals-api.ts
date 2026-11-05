import { apiRequest } from "@/lib/api"

import type { FoodEntry, NutritionSummary } from "./meals-store"

export type ApiMealItem = {
  id?: string
  foodName: string
  estimatedWeightG: number
  servingUnit?: "g" | "ml"
  correctedWeightG?: number | null
  caloriesKcal: number
  proteinG: number
  carbsG: number
  fatG: number
  aiConfidence?: number | null
}

export type ApiMeal = {
  id: string
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  targetDate: string
  loggedAt: string
  imageUrl: string | null
  items: ApiMealItem[]
}

type ApiFood = {
  id: string
  name: string
  servingUnit: "g" | "ml"
  glyph: FoodEntry["glyph"]
  caloriesPer100: number
  proteinPer100G: number
  carbsPer100G: number
  fatPer100G: number
}

export type MealWriteInput = {
  path: string
  method: string
  body?: unknown
}

export type AnalyzeMealInput = { image: string; mimeType: string; description?: string }

export async function fetchMeals(signal?: AbortSignal): Promise<ApiMeal[]> {
  const all: ApiMeal[] = []
  let offset = 0
  while (true) {
    const result = await apiRequest<{ meals: ApiMeal[] }>(`/meals?limit=100&offset=${offset}`, {
      signal,
    })
    all.push(...result.meals)
    if (result.meals.length < 100) return all
    offset += result.meals.length
  }
}

export function fetchMeal(id: string, signal?: AbortSignal): Promise<ApiMeal> {
  return apiRequest<ApiMeal>(`/meals/${encodeURIComponent(id)}`, { signal })
}

export function fetchMealSummary(date: string, signal?: AbortSignal): Promise<NutritionSummary> {
  return apiRequest<NutritionSummary>(`/meals/summary?date=${date}`, { signal })
}

export async function fetchMealPhoto(id: string, signal?: AbortSignal): Promise<string> {
  return (
    await apiRequest<{ imageUrl: string }>(`/meals/${encodeURIComponent(id)}/photo`, { signal })
  ).imageUrl
}

export async function analyzeMeal(input: AnalyzeMealInput): Promise<ApiMealItem[]> {
  return (
    await apiRequest<{ items: ApiMealItem[] }>("/meals/analyze", { method: "POST", body: input })
  ).items
}

export async function searchFoods(query: string, signal?: AbortSignal): Promise<FoodEntry[]> {
  const result = await apiRequest<{ foods: ApiFood[] }>(`/foods?q=${encodeURIComponent(query)}`, {
    signal,
  })
  return result.foods.map((food) => ({
    id: food.id,
    name: food.name,
    serving: `Per 100 ${food.servingUnit}`,
    unit: food.servingUnit,
    glyph: food.glyph,
    per100: {
      kcal: food.caloriesPer100,
      protein: food.proteinPer100G,
      carbs: food.carbsPer100G,
      fat: food.fatPer100G,
    },
  }))
}

export function writeMeal({ path, method, body }: MealWriteInput): Promise<unknown> {
  return apiRequest<unknown>(path, { method, ...(body === undefined ? {} : { body }) })
}
