import { apiRequest } from "@/lib/api"

import type { RecoveryPlan, WeightLog } from "./health-hooks"

export type RecoveryRow = Omit<RecoveryPlan, "start" | "returnDate" | "note"> & {
  note: string | null
}

const healthEndpoints = {
  weights: "/health/weights",
  weight: "/health/weight",
  recovery: "/health/recovery",
} as const

export async function fetchWeights(signal?: AbortSignal): Promise<WeightLog[]> {
  return (await apiRequest<{ weights: WeightLog[] }>(healthEndpoints.weights, { signal })).weights
}

export async function fetchRecovery(signal?: AbortSignal): Promise<RecoveryRow | null> {
  return (await apiRequest<{ recovery: RecoveryRow | null }>(healthEndpoints.recovery, { signal }))
    .recovery
}

export async function putWeight(weightKg: number, date: string): Promise<WeightLog> {
  return (
    await apiRequest<{ weight: WeightLog }>(healthEndpoints.weight, {
      method: "PUT",
      body: { weightKg, date },
    })
  ).weight
}

export async function putRecovery(next: RecoveryPlan | null): Promise<RecoveryRow | null> {
  const result = await apiRequest<{ recovery?: RecoveryRow }>(
    healthEndpoints.recovery,
    next
      ? {
          method: "PUT",
          body: {
            area: next.area,
            note: next.note,
            restDays: next.restDays,
            lightDays: next.lightDays,
            startDate: next.startDate,
          },
        }
      : { method: "DELETE" },
  )
  return result.recovery ?? null
}
