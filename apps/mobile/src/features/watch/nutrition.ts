/** What the watch shows about food, and the meals it asks the phone to log. */
import * as SecureStore from "expo-secure-store"

import {
  fetchMeal,
  fetchMealSummary,
  localDate,
  mealTitle,
  writeMeal,
  type ApiMeal,
  type MealLog,
  type MealType,
  type NutritionSummary,
} from "@/features/meals"
import { captureException } from "@/lib/analytics/posthog"

import { MAX_FAVORITES, type WireDay, type WireFoodLog } from "./protocol"
import type { WatchNutrition } from "./watch-link"

const SAVED_KEY = "watch.saved-logs"
/** Enough to cover every log the watch can have waiting, within SecureStore's size limit. */
const SAVED_LIMIT = 40

/** The meals logged most often, newest first among equals. */
export function favoritesFrom(history: MealLog[]) {
  const byName = new Map<string, { meal: MealLog; count: number }>()
  const newestFirst = [...history].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
  for (const meal of newestFirst) {
    if (!meal.items.length) continue
    const name = mealTitle(meal)
    const entry = byName.get(name)
    if (entry) entry.count++
    else byName.set(name, { meal, count: 1 })
  }
  return [...byName.entries()]
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, MAX_FAVORITES)
    .map(([name, { meal }]) => ({
      ref: meal.id,
      name: name.slice(0, 60),
      kcal: Math.round(meal.kcal),
      protein: Math.round(meal.macros.protein),
      carbs: Math.round(meal.macros.carbs),
      fat: Math.round(meal.macros.fat),
    }))
}

export function toWireDay(
  summary: NutritionSummary,
  history: MealLog[],
  owner: string,
  applied: string[],
): WireDay {
  const { targets, consumed } = summary
  return {
    date: summary.targetDate,
    owner,
    kcalTarget: Math.round(targets?.calorieTargetKcal ?? 0),
    target: {
      protein: Math.round(targets?.proteinTargetG ?? 0),
      carbs: Math.round(targets?.carbsTargetG ?? 0),
      fat: Math.round(targets?.fatTargetG ?? 0),
    },
    kcalEaten: Math.round(consumed.caloriesKcal),
    eaten: {
      protein: Math.round(consumed.proteinG),
      carbs: Math.round(consumed.carbsG),
      fat: Math.round(consumed.fatG),
    },
    favorites: favoritesFrom(history),
    applied,
  }
}

export function mealTypeAt(date: Date): MealType {
  const hour = date.getHours()
  if (hour >= 4 && hour < 11) return "breakfast"
  if (hour >= 11 && hour < 15) return "lunch"
  if (hour >= 17 && hour < 22) return "dinner"
  return "snack"
}

/** A new meal with the same food as `source`, eaten at `at`. */
export function copyMeal(source: ApiMeal, at: number) {
  const loggedAt = new Date(Math.min(at, Date.now()))
  return {
    mealType: mealTypeAt(loggedAt),
    targetDate: localDate(loggedAt),
    loggedAt: loggedAt.toISOString(),
    scaleReferenceType: "none",
    items: source.items.map((item) => ({
      foodName: item.foodName,
      estimatedWeightG: item.correctedWeightG ?? item.estimatedWeightG,
      servingUnit: item.servingUnit ?? "g",
      caloriesKcal: item.caloriesKcal,
      proteinG: item.proteinG,
      carbsG: item.carbsG,
      fatG: item.fatG,
    })),
  }
}

async function savedIds(): Promise<string[]> {
  try {
    return JSON.parse((await SecureStore.getItemAsync(SAVED_KEY)) ?? "[]") as string[]
  } catch {
    return []
  }
}

/** The server will never accept these, so keeping them would only repeat the failure. */
const isPermanent = (error: unknown) => {
  const status = (error as { status?: number } | null)?.status
  return status === 400 || status === 404
}

export function createWatchNutrition(options: {
  owner: string
  history: () => MealLog[]
  /** Called after meals were added, so that the app's screens refetch. */
  onSaved: () => void
}): WatchNutrition {
  const owner = options.owner.slice(0, 64)
  return {
    day: async () => {
      // Read before the totals, so every ID listed is certainly counted in them.
      const applied = await savedIds()
      const summary = await fetchMealSummary(localDate())
      return toWireDay(summary, options.history(), owner, applied)
    },
    save: async (logs: WireFoodLog[]) => {
      const done = await savedIds()
      let added = false
      for (const log of logs) {
        if (done.includes(log.id) || log.owner !== owner) continue
        try {
          const source = await fetchMeal(log.ref)
          await writeMeal({ path: "/meals", method: "POST", body: copyMeal(source, log.at) })
          added = true
        } catch (error) {
          if (!isPermanent(error)) continue
          captureException(error)
        }
        done.push(log.id)
        await SecureStore.setItemAsync(SAVED_KEY, JSON.stringify(done.slice(-SAVED_LIMIT)))
      }
      if (added) options.onSaved()
    },
  }
}
