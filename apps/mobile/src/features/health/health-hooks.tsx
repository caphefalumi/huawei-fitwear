import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

import { useAuth } from "@/features/auth"
import { apiErrorMessage } from "@/lib/api/client"
import { refetchAllThrowing } from "@/lib/query/retry"

import { fetchWeights, putWeight } from "./health-api"

export type Sex = "Male" | "Female" | "Rather not say"
export type PlanPreferences = {
  goal: string
  activity: string
  sessions: number | null
  targetWeightKg: number | null
}
export type WeightLog = { id: string; loggedDate: string; weightKg: number }
export const GOALS = {
  weight_loss: "Lose fat",
  maintenance: "Maintain",
  muscle_gain: "Build muscle",
} as const
export const ACTIVITIES = {
  sedentary: "Sedentary",
  lightly_active: "Light",
  moderately_active: "Moderate",
  very_active: "High",
  extra_active: "Very high",
} as const

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function dateLabel(value: string, days = 0) {
  const date = new Date(`${value}T12:00:00`)
  date.setDate(date.getDate() + days)
  if (Number.isNaN(date.getTime())) return "Enter a valid date"
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

type HealthContextValue = {
  weightKg: number | null
  weights: WeightLog[]
  weightUpdated: boolean
  saveWeight: (kg: number) => Promise<void>
  heightCm: number | null
  saveHeight: (cm: number) => Promise<void>
  sex: Sex | null
  saveSex: (next: Sex) => Promise<void>
  plan: PlanPreferences
  savePlan: (next: PlanPreferences) => Promise<void>
  loading: boolean
  refreshing: boolean
  error: string | null
  refresh: () => Promise<void>
}
const HealthContext = createContext<HealthContextValue | null>(null)

export const healthQueryKeys = {
  all: (userId: string) => ["health", userId] as const,
  weights: (userId: string) => [...healthQueryKeys.all(userId), "weights"] as const,
}

export function HealthProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()
  const userId = user?.id
  const weightsQuery = useQuery({
    queryKey: userId ? healthQueryKeys.weights(userId) : ["health", "signed-out", "weights"],
    queryFn: ({ signal }) => fetchWeights(signal),
    enabled: Boolean(userId),
    networkMode: "always",
  })
  const [weightUpdated, setWeightUpdated] = useState(false)
  const weights = weightsQuery.data ?? []
  const loading = weightsQuery.isLoading
  const refreshing = weightsQuery.isFetching && !loading
  const error =
    weightsQuery.error instanceof Error
      ? apiErrorMessage(weightsQuery.error, "your health data")
      : null
  const saveWeightMutation = useMutation({
    mutationKey: [...healthQueryKeys.all(userId ?? "signed-out"), "save-weight"],
    mutationFn: async (weightKg: number) => putWeight(weightKg, dateKey()),
    onSuccess: (weight) => {
      if (!userId) return
      queryClient.setQueryData<WeightLog[]>(healthQueryKeys.weights(userId), (previous = []) =>
        [...previous.filter((row) => row.loggedDate !== weight.loggedDate), weight].sort((a, b) =>
          a.loggedDate.localeCompare(b.loggedDate),
        ),
      )
      setWeightUpdated(true)
    },
  })
  const { refetch: refetchWeights } = weightsQuery
  const refresh = useCallback(async () => {
    await refetchAllThrowing(refetchWeights)
  }, [refetchWeights])
  const saveWeight = async (weightKg: number) => {
    await saveWeightMutation.mutateAsync(weightKg)
    await updateUser({})
  }
  const saveSex = async (next: Sex) => {
    await updateUser({ gender: next === "Male" ? "male" : next === "Female" ? "female" : "other" })
  }
  const savePlan = async (next: PlanPreferences) => {
    const fitnessGoal = (Object.keys(GOALS) as (keyof typeof GOALS)[]).find(
      (key) => GOALS[key] === next.goal,
    )
    const activityLevel = (Object.keys(ACTIVITIES) as (keyof typeof ACTIVITIES)[]).find(
      (key) => ACTIVITIES[key] === next.activity,
    )
    await updateUser({
      ...(fitnessGoal ? { fitnessGoal } : {}),
      ...(activityLevel ? { activityLevel } : {}),
      ...(next.sessions !== null ? { weeklySessions: next.sessions } : {}),
      ...(next.targetWeightKg !== null ? { targetWeightKg: next.targetWeightKg } : {}),
    })
  }

  const plan: PlanPreferences = {
    goal: user?.fitnessGoal ? GOALS[user.fitnessGoal] : "Not set",
    activity: user?.activityLevel ? ACTIVITIES[user.activityLevel] : "Not set",
    sessions: user?.weeklySessions ?? null,
    targetWeightKg: user?.targetWeightKg ?? null,
  }
  return (
    <HealthContext.Provider
      value={{
        weightKg: weights.at(-1)?.weightKg ?? user?.currentWeightKg ?? null,
        weights,
        weightUpdated,
        saveWeight,
        heightCm: user?.heightCm ?? null,
        saveHeight: async (heightCm) => {
          await updateUser({ heightCm })
        },
        sex:
          user?.gender === "male"
            ? "Male"
            : user?.gender === "female"
              ? "Female"
              : user?.gender === "other"
                ? "Rather not say"
                : null,
        saveSex,
        plan,
        savePlan,
        loading,
        error,
        refreshing,
        refresh,
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

export function useHealth() {
  const value = useContext(HealthContext)
  if (!value) throw new Error("useHealth must be used inside HealthProvider")
  return value
}
