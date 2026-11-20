import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query"
import { File, Paths } from "expo-file-system"
import { Platform } from "react-native"

import type { WeightLog } from "@/features/health/hooks/health-hooks"
import type { MealLog, NutritionSummary } from "@/features/meals/hooks/meals-hooks"
import type { WorkoutPage, WorkoutStats } from "@/features/workout/api/workout-api"
import type { Exercise } from "@/features/workout/hooks/workout-hooks"

const CACHE_NAME = "fitwear-offline-v1.json"
const MAX_AGE = 7 * 86_400_000
const MAX_BYTES = 384 * 1024
const MAX_ENTRIES = 12
const datePattern = /^\d{4}-\d{2}-\d{2}$/
type Owner = { accountId: string; sessionId: string }
type Entry = { key: QueryKey; at: number; data: unknown }
type Snapshot = Owner & { entries: Entry[] }

function mealTotals({ caloriesKcal, proteinG, carbsG, fatG }: NutritionSummary["consumed"]) {
  return { caloriesKcal, proteinG, carbsG, fatG }
}

// Only renderable fields enter the file; in particular, no photos, URLs, or raw set data.
function project(key: QueryKey, accountId: string, data: unknown): unknown {
  if (key[1] !== accountId) return undefined
  if (key.length === 4 && key[0] === "meals" && key[2] === "summary") {
    if (typeof key[3] !== "string" || !datePattern.test(key[3])) return undefined
    const {
      targetDate,
      profileComplete,
      missingFields,
      targetReached,
      targets,
      consumed,
      remaining,
      mealCount,
    } = data as NutritionSummary
    if (targetDate !== key[3]) return undefined
    return {
      targetDate,
      profileComplete,
      missingFields,
      targetReached,
      mealCount,
      targets: targets && {
        calorieTargetKcal: targets.calorieTargetKcal,
        proteinTargetG: targets.proteinTargetG,
        carbsTargetG: targets.carbsTargetG,
        fatTargetG: targets.fatTargetG,
      },
      consumed: mealTotals(consumed),
      remaining: remaining && mealTotals(remaining),
    } satisfies NutritionSummary
  }
  if (key.length !== 3) return undefined
  if (key[0] === "health" && key[2] === "weights") {
    return (data as WeightLog[]).slice(-366).map(({ id, loggedDate, weightKg }) => ({
      id,
      loggedDate,
      weightKg,
    }))
  }
  if (key[0] === "meals" && key[2] === "history") {
    return (data as MealLog[]).slice(0, 60).map((meal) => ({
      id: meal.id,
      name: meal.name,
      date: meal.date,
      time: meal.time,
      targetDate: meal.targetDate,
      loggedAt: meal.loggedAt,
      imageUrl: null,
      kcal: meal.kcal,
      macros: { protein: meal.macros.protein, carbs: meal.macros.carbs, fat: meal.macros.fat },
      items: meal.items.map(({ id, name, detail, kcal, macros, glyph }) => ({
        id,
        name,
        detail,
        kcal,
        glyph,
        macros: { protein: macros.protein, carbs: macros.carbs, fat: macros.fat },
      })),
    }))
  }
  if (key[0] !== "workouts") return undefined
  if (key[2] === "exercises") {
    return (data as Exercise[]).slice(0, 500).map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      cadenceAnimationUrl: null,
      cues: exercise.cues.map(({ title, detail }) => ({ title, detail })),
      defaultSets: exercise.defaultSets,
      defaultReps: exercise.defaultReps,
      repetitionUnit: exercise.repetitionUnit,
    }))
  }
  if (key[2] === "history") {
    const { pages, pageParams } = data as InfiniteData<WorkoutPage, number>
    return {
      pageParams: pageParams.slice(0, 3),
      pages: pages.slice(0, 3).map(({ count, sessions }) => ({
        count,
        sessions: sessions.map((session) => ({
          id: session.id,
          userId: accountId,
          sessionTitle: session.sessionTitle,
          workoutSplit: session.workoutSplit,
          startedAt: session.startedAt,
          completedAt: session.completedAt,
          avgHeartRateBpm: null,
          maxHeartRateBpm: null,
        })),
      })),
    }
  }
  if (key[2] === "stats") {
    const { byDate } = data as WorkoutStats
    return {
      byDate: byDate.slice(-366).map(({ date, sessionCount, totalDurationSeconds }) => ({
        date,
        sessionCount,
        totalDurationSeconds,
      })),
    } satisfies WorkoutStats
  }
}

function file(part = false) {
  // Native cache directories are app-private, excluded from backups, and OS-evictable.
  return new File(Paths.cache, part ? `${CACHE_NAME}.part` : CACHE_NAME)
}

export function clearOfflineCache() {
  if (Platform.OS === "web") return
  let failed = false
  for (const part of [false, true]) {
    try {
      const saved = file(part)
      if (saved.exists) saved.delete()
    } catch {
      failed = true
    }
  }
  if (failed) throw new Error("Could not remove the offline query files.")
}

const fresh = (at: number, now: number) => Number.isFinite(at) && at <= now && now - at < MAX_AGE

export function openOfflineCache(client: QueryClient, owner: Owner) {
  if (Platform.OS === "web") return () => {}
  const entries = new Map<string, Entry>()
  try {
    const saved = file()
    if (saved.exists) {
      const snapshot = (
        saved.size <= MAX_BYTES ? JSON.parse(saved.textSync()) : null
      ) as Snapshot | null
      if (snapshot?.accountId === owner.accountId && snapshot.sessionId === owner.sessionId) {
        const now = Date.now()
        for (const entry of snapshot.entries.slice(0, MAX_ENTRIES)) {
          if (!Array.isArray(entry.key) || !fresh(entry.at, now)) continue
          const data = project(entry.key, owner.accountId, entry.data)
          if (data === undefined) continue
          entries.set(JSON.stringify(entry.key), { ...entry, data })
          client.setQueryData(entry.key, data, { updatedAt: entry.at })
          // The on-disk projection is deliberately incomplete, even if fetched just before restart.
          void client.invalidateQueries({ queryKey: entry.key, exact: true, refetchType: "none" })
        }
      } else {
        clearOfflineCache()
      }
    }
  } catch {
    // An unreadable cache is never used as an authentication or data source.
    try {
      clearOfflineCache()
    } catch {
      // Storage may be unavailable.
    }
  }

  let pending: ReturnType<typeof setTimeout> | undefined
  const flush = () => {
    pending = undefined
    const now = Date.now()
    const kept = [...entries.values()]
      .filter((entry) => fresh(entry.at, now))
      .sort((a, b) => b.at - a.at)
      .slice(0, MAX_ENTRIES)
    let serialized = JSON.stringify({ ...owner, entries: kept } satisfies Snapshot)
    // One UTF-16 code unit uses no more than three bytes in UTF-8.
    while (serialized.length * 3 > MAX_BYTES && kept.length) {
      kept.pop()
      serialized = JSON.stringify({ ...owner, entries: kept } satisfies Snapshot)
    }
    entries.clear()
    for (const entry of kept) entries.set(JSON.stringify(entry.key), entry)
    try {
      const saved = file()
      const temporary = file(true)
      try {
        temporary.create({ overwrite: true })
        temporary.writeSync(serialized)
        temporary.moveSync(saved, { overwrite: true })
      } finally {
        if (temporary.uri !== saved.uri && temporary.exists) temporary.delete()
      }
    } catch {
      // Disk pressure must not affect a successful online fetch.
    }
  }
  const unsubscribe = client.getQueryCache().subscribe((event) => {
    if (event.type !== "updated" || event.action.type !== "success" || event.action.manual) return
    const {
      queryKey: key,
      state: { dataUpdatedAt: at },
    } = event.query
    try {
      const data = project(key, owner.accountId, event.action.data)
      if (data === undefined) return
      entries.set(JSON.stringify(key), { key, at, data })
      pending ??= setTimeout(flush, 0)
    } catch {
      // Ignore a response that doesn't have the allowlisted shape.
    }
  })
  return () => {
    unsubscribe()
    clearTimeout(pending)
  }
}
