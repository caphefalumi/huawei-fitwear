import { apiRequest } from "@/lib/api/client"

import type { WeightLog } from "./health-hooks"

const healthEndpoints = {
  weights: "/health/weights",
  weight: "/health/weight",
} as const

export async function fetchWeights(signal?: AbortSignal): Promise<WeightLog[]> {
  return (await apiRequest<{ weights: WeightLog[] }>(healthEndpoints.weights, { signal })).weights
}

export async function putWeight(weightKg: number, date: string): Promise<WeightLog> {
  return (
    await apiRequest<{ weight: WeightLog }>(healthEndpoints.weight, {
      method: "PUT",
      body: { weightKg, date },
    })
  ).weight
}
