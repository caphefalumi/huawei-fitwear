import { Platform } from "react-native"

import { posthog } from "@/config/posthog"
import { apiRequest } from "@/lib/api/client"
import { posthogLog } from "@/lib/monitoring/posthog-logs"

import type { FoodEntry, NutritionSummary } from "../hooks/meals-hooks"

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

export type AnalyzeMealInput = { photoId: string; description?: string }

export async function uploadMealPhoto(uri: string): Promise<string> {
  const body = new FormData()
  if (Platform.OS === "web") {
    body.append("image", await (await fetch(uri)).blob(), "meal.webp")
  } else {
    // React Native FormData accepts a URI-backed file part.
    const file = { uri, type: "image/webp", name: "meal.webp" }
    body.append("image", file as unknown as Blob)
  }
  return (await apiRequest<{ photoId: string }>("/meals/photos", { method: "POST", body })).photoId
}

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

function mealAnalysisTraceId() {
  return `meal-analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function captureMealAnalysisGeneration(
  traceId: string,
  input: AnalyzeMealInput,
  startedAt: number,
  items?: ApiMealItem[],
) {
  posthog?.capture("$ai_generation", {
    $ai_trace_id: traceId,
    $ai_session_id: null,
    $ai_span_name: "meal_photo_analysis",
    $ai_latency: (Date.now() - startedAt) / 1000,
    ...(input.description
      ? { $ai_input: [{ role: "user", content: input.description }] }
      : {}),
    ...(items
      ? {
          $ai_output_choices: [
            {
              role: "assistant",
              content: JSON.stringify(items),
            },
          ],
        }
      : { $ai_is_error: true }),
  })
}

export async function analyzeMeal(input: AnalyzeMealInput): Promise<ApiMealItem[]> {
  const traceId = mealAnalysisTraceId()
  const startedAt = Date.now()
  try {
    const items = (
      await apiRequest<{ items: ApiMealItem[] }>("/meals/analyze", { method: "POST", body: input })
    ).items
    captureMealAnalysisGeneration(traceId, input, startedAt, items)
    posthogLog.info("meal analysis completed", { workflow: "meal_analysis", outcome: "completed" })
    return items
  } catch (error) {
    captureMealAnalysisGeneration(traceId, input, startedAt)
    posthogLog.warn("meal analysis failed", { workflow: "meal_analysis", outcome: "failed" })
    throw error
  }
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
