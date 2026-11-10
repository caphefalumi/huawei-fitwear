import { apiRequest } from "@/lib/api/client"

import type { Exercise, SessionWithSets, WorkoutSession } from "./workout-hooks"

export type WorkoutPage = { sessions: WorkoutSession[]; count: number }
export type WorkoutWriteInput = { path: string; method: string; body?: unknown }

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

export function fetchWorkoutSession(id: string, signal?: AbortSignal): Promise<SessionWithSets> {
  return apiRequest<SessionWithSets>(`/workouts/${encodeURIComponent(id)}`, { signal })
}

export function writeWorkout({ path, method, body }: WorkoutWriteInput): Promise<unknown> {
  return apiRequest<unknown>(path, { method, ...(body === undefined ? {} : { body }) })
}
