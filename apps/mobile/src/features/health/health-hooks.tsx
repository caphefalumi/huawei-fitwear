import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

import { useAuth } from "@/features/auth"
import { apiErrorMessage } from "@/lib/api"
import { refetchAllThrowing } from "@/lib/query-retry"

import { fetchRecovery, fetchWeights, putRecovery, putWeight, type RecoveryRow } from "./health-api"

export type Sex = "Male" | "Female" | "Rather not say"
export type PlanPreferences = {
  goal: string
  activity: string
  sessions: number | null
  targetWeightKg: number | null
}
export type WeightLog = { id: string; loggedDate: string; weightKg: number }
export type RecoveryPlan = {
  area: string
  note: string
  restDays: number
  lightDays: number
  startDate: string
  start: string
  returnDate: string
}
export const PERIOD_AREA = "In period"
const PERIOD_REST_DAYS = 3
const PERIOD_LIGHT_DAYS = 4
export const INJURY_AREAS = ["Right shoulder", "Left shoulder", "Lower back", "Right knee"]
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

function recoveryFromRow(row: RecoveryRow): RecoveryPlan {
  return {
    ...row,
    note: row.note ?? "",
    start: dateLabel(row.startDate),
    returnDate: dateLabel(row.startDate, row.restDays + row.lightDays),
  }
}

export function createRecovery(area: string): RecoveryPlan {
  const period = area === PERIOD_AREA
  return recoveryFromRow({
    area,
    note: "",
    restDays: period ? PERIOD_REST_DAYS : 0,
    lightDays: period ? PERIOD_LIGHT_DAYS : 0,
    startDate: dateKey(),
  })
}

export function recoveryRanges(recovery: RecoveryPlan) {
  const range = (offset: number, count: number) =>
    count === 0
      ? "None"
      : count === 1
        ? dateLabel(recovery.startDate, offset)
        : `${dateLabel(recovery.startDate, offset)} – ${dateLabel(recovery.startDate, offset + count - 1)}`
  return { rest: range(0, recovery.restDays), light: range(recovery.restDays, recovery.lightDays) }
}

/** Fill (0–1) of the rest, rehab and return stages, measured in days since the plan started. */
export function recoveryProgress(recovery: RecoveryPlan, now = new Date()) {
  const [year, month, day] = recovery.startDate.split("-").map(Number)
  const dayNumber = (date: Date) =>
    Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
  const elapsed = dayNumber(now) - dayNumber(new Date(year, month - 1, day))
  const stage = (start: number, length: number) =>
    length === 0 ? (elapsed >= start ? 1 : 0) : Math.max(0, Math.min(1, (elapsed - start) / length))
  const total = recovery.restDays + recovery.lightDays
  return [
    stage(0, recovery.restDays),
    stage(recovery.restDays, recovery.lightDays),
    elapsed >= total ? 1 : 0,
  ]
}

export const recoveryTitle = (recovery: RecoveryPlan) =>
  recovery.area === PERIOD_AREA ? "Period recovery" : `${recovery.area} recovery`

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
  recovery: RecoveryPlan | null
  saveRecovery: (next: RecoveryPlan | null) => Promise<void>
  loading: boolean
  refreshing: boolean
  error: string | null
  refresh: () => Promise<void>
}
const HealthContext = createContext<HealthContextValue | null>(null)

export const healthQueryKeys = {
  all: (userId: string) => ["health", userId] as const,
  weights: (userId: string) => [...healthQueryKeys.all(userId), "weights"] as const,
  recovery: (userId: string) => [...healthQueryKeys.all(userId), "recovery"] as const,
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
  const recoveryQuery = useQuery({
    queryKey: userId ? healthQueryKeys.recovery(userId) : ["health", "signed-out", "recovery"],
    queryFn: ({ signal }) => fetchRecovery(signal),
    enabled: Boolean(userId),
    networkMode: "always",
  })
  const [weightUpdated, setWeightUpdated] = useState(false)
  const weights = weightsQuery.data ?? []
  const recovery = recoveryQuery.data ? recoveryFromRow(recoveryQuery.data) : null
  const loading = weightsQuery.isLoading || recoveryQuery.isLoading
  const refreshing = (weightsQuery.isFetching || recoveryQuery.isFetching) && !loading
  const errorCause = [weightsQuery.error, recoveryQuery.error].find(
    (cause) => cause instanceof Error,
  )
  const error = errorCause ? apiErrorMessage(errorCause, "your health data") : null
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
  const saveRecoveryMutation = useMutation({
    mutationKey: [...healthQueryKeys.all(userId ?? "signed-out"), "save-recovery"],
    mutationFn: (next: RecoveryPlan | null) => putRecovery(next),
    onSuccess: (next) => {
      if (userId) queryClient.setQueryData(healthQueryKeys.recovery(userId), next)
    },
  })
  const { refetch: refetchWeights } = weightsQuery
  const { refetch: refetchRecovery } = recoveryQuery
  const refresh = useCallback(async () => {
    await refetchAllThrowing(refetchWeights, refetchRecovery)
  }, [refetchWeights, refetchRecovery])
  const saveWeight = async (weightKg: number) => {
    await saveWeightMutation.mutateAsync(weightKg)
    await updateUser({})
  }
  const saveRecovery = async (next: RecoveryPlan | null) => {
    await saveRecoveryMutation.mutateAsync(next)
  }
  const saveSex = async (next: Sex) => {
    await updateUser({ gender: next === "Male" ? "male" : next === "Female" ? "female" : "other" })
    if (next !== "Female" && recovery?.area === PERIOD_AREA) await saveRecovery(null)
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
        recovery,
        saveRecovery,
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
