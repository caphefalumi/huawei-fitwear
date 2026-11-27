import { apiRequest } from "@/lib/api/client"

import type {
  Exercise,
  SessionWithSets,
  WorkoutSession,
  WorkoutSummary,
} from "../hooks/workout-hooks"
import type { ExerciseProgression } from "../utils/progression"

export type WorkoutPage = { sessions: WorkoutSession[]; count: number }
export type WorkoutWriteInput = { path: string; method: string; body?: unknown }
export type StatsSession = WorkoutSummary & {
  id: string
  sessionTitle: string
  workoutSplit: string
  startedAt: string
  completedAt: string
}
export type WorkoutStats = {
  byDate: { date: string; sessionCount: number; totalDurationSeconds: number }[]
  /** Completed sessions in the range, oldest first. Missing in caches saved by older versions. */
  sessions?: StatsSession[]
}

export async function fetchExerciseCatalog(signal?: AbortSignal): Promise<Exercise[]> {
  const initial = await apiRequest<{ exercises: Exercise[]; count: number }>(
    "/exercises?limit=200",
    { signal },
  )
  const exercises = [...initial.exercises]
  while (exercises.length < initial.count) {
    const next = await apiRequest<{ exercises: Exercise[] }>(
      `/exercises?limit=200&offset=${exercises.length}`,
      { signal },
    )
    if (!next.exercises.length) throw new Error("The exercise catalog could not be fully loaded.")
    exercises.push(...next.exercises)
  }
  return exercises
}

export function fetchWorkoutHistory(pageParam: number, signal?: AbortSignal): Promise<WorkoutPage> {
  return apiRequest<WorkoutPage>(`/workouts?limit=20&offset=${pageParam}`, { signal })
}

export function fetchWorkoutStats(signal?: AbortSignal): Promise<WorkoutStats> {
  const from = new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10)
  return apiRequest<WorkoutStats>(`/workouts/stats?from=${from}`, { signal })
}

export function fetchPreviousProgression(
  session: { id: string; startedAt: string },
  signal?: AbortSignal,
): Promise<{ exercises: ExerciseProgression[] }> {
  const query = `excludeSessionId=${encodeURIComponent(session.id)}&before=${encodeURIComponent(session.startedAt)}`
  return apiRequest(`/workouts/progression?${query}`, { signal })
}

export function fetchWorkoutSession(id: string, signal?: AbortSignal): Promise<SessionWithSets> {
  return apiRequest<SessionWithSets>(`/workouts/${encodeURIComponent(id)}`, { signal })
}

export function writeWorkout({ path, method, body }: WorkoutWriteInput): Promise<unknown> {
  return apiRequest<unknown>(path, { method, ...(body === undefined ? {} : { body }) })
}
