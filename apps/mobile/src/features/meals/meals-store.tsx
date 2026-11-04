import { apiErrorMessage, apiRequest } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { AppState } from "react-native"
import { useAuth } from "@/features/auth/auth-store"
import { useMealClientStore } from "./meal-client.store"

export type Macros = { protein: number; carbs: number; fat: number }
export type MealGlyph = "wheat" | "drumstick" | "carrot" | "droplet"
export type MealItem = {
  id: string
  name: string
  detail: string
  kcal: number
  macros: Macros
  glyph: MealGlyph
  aiConfidence?: number
}
const EMPTY_MEAL_ITEMS: MealItem[] = []
export type FoodEntry = {
  id: string
  name: string
  serving: string
  per100: Macros & { kcal: number }
  glyph: MealGlyph
  unit: "g" | "ml"
}
export type MealEstimate = Macros & { kcal: number }
export type MealType = "breakfast" | "lunch" | "dinner" | "snack"
export type MealImage = { data: string; mimeType: "image/jpeg" | "image/png" }
export type MealLog = {
  id: string
  name: string
  date: string
  time: string
  targetDate: string
  loggedAt: string
  mealType: MealType
  imageUrl: string | null
  items: MealItem[]
  kcal: number
  macros: Macros
}
export type NutritionSummary = {
  targetDate: string
  targets: {
    calorieTargetKcal: number
    proteinTargetG: number
    carbsTargetG: number
    fatTargetG: number
    source: "stored" | "derived"
  }
  consumed: { caloriesKcal: number; proteinG: number; carbsG: number; fatG: number }
  remaining: { caloriesKcal: number; proteinG: number; carbsG: number; fatG: number }
  mealCount: number
}
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
type ApiMeal = {
  id: string
  mealType: MealType
  targetDate: string
  loggedAt: string
  imageUrl: string | null
  items: ApiMealItem[]
}
const round1 = (value: number) => Math.round(value * 10) / 10
export const localDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
export const mealTypeLabel = (type: MealType) => type.charAt(0).toUpperCase() + type.slice(1)
export const sumItems = (items: MealItem[]): MealEstimate =>
  items.reduce(
    (sum, item) => ({
      kcal: round1(sum.kcal + item.kcal),
      protein: round1(sum.protein + item.macros.protein),
      carbs: round1(sum.carbs + item.macros.carbs),
      fat: round1(sum.fat + item.macros.fat),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  )
export function estimatePortion(food: FoodEntry, amount: number): MealEstimate {
  const factor = amount / 100
  return {
    kcal: Math.round(food.per100.kcal * factor),
    protein: round1(food.per100.protein * factor),
    carbs: round1(food.per100.carbs * factor),
    fat: round1(food.per100.fat * factor),
  }
}
export function splitDetail(detail: string): { amount: number; unit: string; note: string } {
  const match = /(\d+(?:\.\d+)?)\s*(g|ml)\b/i.exec(detail)
  if (!match) return { amount: 0, unit: "g", note: detail }
  return {
    amount: Number(match[1]),
    unit: match[2].toLowerCase(),
    note: detail.replace(match[0], "").replace(/^\s*·\s*/, ""),
  }
}
export function rescaleItem(item: MealItem, amount: number): MealItem {
  const { amount: previous, unit, note } = splitDetail(item.detail)
  if (previous <= 0) return item
  const factor = amount / previous
  return {
    ...item,
    detail: `${amount}${unit}${note ? ` · ${note}` : ""}`,
    kcal: Math.round(item.kcal * factor),
    macros: {
      protein: round1(item.macros.protein * factor),
      carbs: round1(item.macros.carbs * factor),
      fat: round1(item.macros.fat * factor),
    },
  }
}
export function fromApiItem(item: ApiMealItem, index = 0): MealItem {
  return {
    id: item.id ?? `analysis-${index}`,
    name: item.foodName,
    detail: `${item.correctedWeightG ?? item.estimatedWeightG}${item.servingUnit ?? "g"}`,
    kcal: item.caloriesKcal,
    macros: { protein: item.proteinG, carbs: item.carbsG, fat: item.fatG },
    glyph: "wheat",
    aiConfidence: item.aiConfidence ?? undefined,
  }
}
export function fromApiMeal(meal: ApiMeal): MealLog {
  const items = meal.items.map(fromApiItem)
  const { kcal, ...macros } = sumItems(items)
  const date = new Date(meal.loggedAt)
  return {
    ...meal,
    name: mealTypeLabel(meal.mealType),
    date: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    items,
    kcal,
    macros,
  }
}
const toApiItem = (item: MealItem) => ({
  foodName: item.name,
  estimatedWeightG: splitDetail(item.detail).amount,
  servingUnit: splitDetail(item.detail).unit,
  caloriesKcal: item.kcal,
  proteinG: item.macros.protein,
  carbsG: item.macros.carbs,
  fatG: item.macros.fat,
  ...(item.aiConfidence !== undefined ? { aiConfidence: item.aiConfidence } : {}),
})
const validateItem = (item: MealItem) => {
  if (
    !item.name.trim() ||
    splitDetail(item.detail).amount <= 0 ||
    [item.kcal, ...Object.values(item.macros)].some((value) => !Number.isFinite(value) || value < 0)
  )
    throw new Error("Enter a name, positive portion and non-negative nutrition values.")
}

type MealsContextValue = {
  mealName: string
  mealType: MealType
  setMealType: (type: MealType) => void
  items: MealItem[]
  totals: MealEstimate
  draftImage: string | null
  setAnalysis: (items: ApiMealItem[], imageUri: string, image: MealImage) => void
  setDraftPhoto: (imageUri: string, image: MealImage) => void
  loggedKcal: number
  loggedMacros: Macros
  loggedMealName: string | null
  history: MealLog[]
  summary: NutritionSummary | null
  loading: boolean
  refreshing: boolean
  busy: boolean
  error: string | null
  actionError: string | null
  retryAction: () => Promise<void>
  refresh: () => Promise<void>
  tutorialSeen: boolean
  dismissTutorial: () => void
  addItem: (item: MealItem, mealId?: string) => Promise<void>
  updateItem: (id: string, item: MealItem, mealId?: string) => Promise<void>
  removeItem: (id: string, mealId?: string) => Promise<void>
  deleteMeal: () => void
  logMeal: () => Promise<void>
  deleteLog: (id: string) => Promise<void>
  updateMealType: (id: string, type: MealType) => Promise<void>
}
type WriteMutationInput = {
  path: string
  method: string
  body?: unknown
  onSuccess?: () => void
}
const MealsContext = createContext<MealsContextValue | null>(null)
export const mealsQueryKeys = {
  all: (userId: string) => ["meals", userId] as const,
  history: (userId: string) => [...mealsQueryKeys.all(userId), "history"] as const,
  summary: (userId: string, date: string) =>
    [...mealsQueryKeys.all(userId), "summary", date] as const,
  foodSearch: (userId: string, query: string) =>
    [...mealsQueryKeys.all(userId), "food-search", query] as const,
  detail: (userId: string, mealId: string) =>
    [...mealsQueryKeys.all(userId), "detail", mealId] as const,
  photo: (userId: string, mealId: string) =>
    [...mealsQueryKeys.all(userId), "photo", mealId] as const,
}

export function MealsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const userId = user?.id
  const accountMatches = useMealClientStore((state) => state.accountId === (userId ?? null))
  const items = useMealClientStore((state) => (accountMatches ? state.items : EMPTY_MEAL_ITEMS))
  const mealType = useMealClientStore((state) => (accountMatches ? state.mealType : "lunch"))
  const draftImage = useMealClientStore((state) => (accountMatches ? state.draftImage : null))
  const draftImageData = useMealClientStore((state) =>
    accountMatches ? state.draftImageData : null,
  )
  const tutorialSeen = useMealClientStore((state) => state.tutorialSeen)
  const storedSummaryDate = useMealClientStore((state) => (accountMatches ? state.summaryDate : ""))
  const summaryDate = storedSummaryDate || localDate()
  const setItems = useMealClientStore((state) => state.setItems)
  const setMealType = useMealClientStore((state) => state.setMealType)
  const setDraftPhoto = useMealClientStore((state) => state.setDraftPhoto)
  const setAnalysis = useMealClientStore((state) => state.setAnalysis)
  const clearDraft = useMealClientStore((state) => state.clearDraft)
  const setSummaryDate = useMealClientStore((state) => state.setSummaryDate)
  const dismissTutorial = useMealClientStore((state) => state.dismissTutorial)
  useEffect(() => {
    useMealClientStore.getState().setAccountId(userId ?? null, localDate())
  }, [userId])
  const historyQuery = useQuery({
    queryKey: userId ? mealsQueryKeys.history(userId) : ["meals", "signed-out", "history"],
    enabled: Boolean(userId),
    queryFn: async ({ signal }) => {
      const all: MealLog[] = []
      let offset = 0
      while (true) {
        const result = await apiRequest<{ meals: ApiMeal[] }>(`/meals?limit=100&offset=${offset}`, {
          signal,
        })
        all.push(...result.meals.map(fromApiMeal))
        if (result.meals.length < 100) return all
        offset += result.meals.length
      }
    },
  })
  const summaryQuery = useQuery({
    queryKey: userId
      ? mealsQueryKeys.summary(userId, summaryDate)
      : ["meals", "signed-out", "summary", summaryDate],
    enabled: Boolean(userId),
    queryFn: ({ signal }) =>
      apiRequest<NutritionSummary>(`/meals/summary?date=${summaryDate}`, { signal }),
  })
  const history = historyQuery.data ?? []
  const summary = summaryQuery.data ?? null
  const loading = historyQuery.isLoading || summaryQuery.isLoading
  const refresh = useCallback(async () => {
    await Promise.all([historyQuery.refetch(), summaryQuery.refetch()])
  }, [historyQuery.refetch, summaryQuery.refetch])
  const invalidateMeals = async (_result: unknown, variables: { path: string; method: string }) => {
    if (!userId) return
    const mealId = /^\/meals\/([^/]+)/.exec(variables.path)?.[1]
    const deletingMeal =
      variables.method === "DELETE" && mealId && variables.path === `/meals/${mealId}`
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: mealsQueryKeys.history(userId) }),
      queryClient.invalidateQueries({ queryKey: [...mealsQueryKeys.all(userId), "summary"] }),
      ...(mealId && !deletingMeal
        ? [queryClient.invalidateQueries({ queryKey: mealsQueryKeys.detail(userId, mealId) })]
        : []),
    ])
    if (deletingMeal && mealId) {
      queryClient.removeQueries({ queryKey: mealsQueryKeys.detail(userId, mealId) })
      queryClient.removeQueries({ queryKey: mealsQueryKeys.photo(userId, mealId) })
    }
  }
  const writeMutation = useMutation({
    mutationKey: [...mealsQueryKeys.all(userId ?? "signed-out"), "write"],
    mutationFn: ({ path, method, body }: WriteMutationInput) =>
      apiRequest<unknown>(path, { method, ...(body === undefined ? {} : { body }) }),
    onMutate: async ({ path, method, body }) => {
      if (!userId) return undefined
      const key = mealsQueryKeys.history(userId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<MealLog[]>(key)
      const match = /^\/meals\/([^/]+)$/.exec(path)
      if (previous && match && method === "DELETE") {
        queryClient.setQueryData(
          key,
          previous.filter((meal) => meal.id !== match[1]),
        )
      }
      if (previous && match && method === "PATCH" && body && typeof body === "object") {
        const { mealType: nextType } = body as { mealType?: MealType }
        if (nextType) {
          queryClient.setQueryData(
            key,
            previous.map((meal) => (meal.id === match[1] ? { ...meal, mealType: nextType } : meal)),
          )
        }
      }
      return { key, previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous)
    },
    onSuccess: async (result, variables) => {
      await invalidateMeals(result, variables)
      variables.onSuccess?.()
    },
  })
  const error = [historyQuery.error, summaryQuery.error].find((cause) => cause instanceof Error)
  const errorMessage = error ? apiErrorMessage(error, "your meals") : null
  const actionError = writeMutation.error
    ? apiErrorMessage(writeMutation.error, "that change")
    : null
  const retryAction = async () => {
    if (writeMutation.variables) await writeMutation.mutateAsync(writeMutation.variables)
  }
  const busy = writeMutation.isPending
  const runWrite = async <T,>(
    path: string,
    method: string,
    body?: unknown,
    onSuccess?: () => void,
  ): Promise<T> =>
    (await writeMutation.mutateAsync({
      path,
      method,
      body,
      ...(onSuccess ? { onSuccess } : {}),
    })) as T
  useEffect(() => {
    if (user?.updatedAt) void summaryQuery.refetch()
  }, [user?.updatedAt, summaryQuery.refetch])
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setSummaryDate(localDate())
        void refresh()
      }
    })
    let midnight: ReturnType<typeof setTimeout>
    const schedule = () => {
      const next = new Date()
      next.setHours(24, 0, 0, 0)
      midnight = setTimeout(() => {
        setSummaryDate(localDate())
        void refresh()
        schedule()
      }, next.getTime() - Date.now())
    }
    schedule()
    return () => {
      subscription.remove()
      clearTimeout(midnight)
    }
  }, [refresh])
  const addItem = async (item: MealItem, mealId?: string) => {
    validateItem(item)
    if (!mealId) {
      setItems((previous) => [...previous, item])
      return
    }
    await runWrite<ApiMeal>(`/meals/${mealId}/items`, "POST", toApiItem(item))
  }
  const updateItem = async (id: string, item: MealItem, mealId?: string) => {
    validateItem(item)
    if (!mealId) {
      setItems((previous) => previous.map((entry) => (entry.id === id ? item : entry)))
      return
    }
    const { estimatedWeightG, aiConfidence: _confidence, ...body } = toApiItem(item)
    await runWrite<ApiMeal>(`/meals/${mealId}/items/${id}`, "PATCH", {
      ...body,
      correctedWeightG: estimatedWeightG,
    })
  }
  const removeItem = async (id: string, mealId?: string) => {
    if (!mealId) {
      setItems((previous) => previous.filter((entry) => entry.id !== id))
      return
    }
    await runWrite<ApiMeal | { success: true }>(`/meals/${mealId}/items/${id}`, "DELETE")
  }
  const deleteMeal = () => {
    clearDraft()
  }
  const logMeal = async () => {
    if (!items.length) throw new Error("Add at least one item before logging.")
    items.forEach(validateItem)
    await runWrite<ApiMeal>(
      "/meals",
      "POST",
      {
        mealType,
        targetDate: localDate(),
        loggedAt: new Date().toISOString(),
        scaleReferenceType: "none",
        items: items.map(toApiItem),
        ...(draftImageData ? { image: draftImageData } : {}),
      },
      deleteMeal,
    )
  }
  const deleteLog = async (id: string) => {
    await runWrite(`/meals/${id}`, "DELETE")
  }
  const updateMealType = async (id: string, type: MealType) => {
    await runWrite(`/meals/${id}`, "PATCH", { mealType: type })
  }
  const totals = useMemo(() => sumItems(items), [items])
  const refreshing = (historyQuery.isFetching || summaryQuery.isFetching) && !loading
  return (
    <MealsContext.Provider
      value={{
        mealName: mealTypeLabel(mealType),
        mealType,
        setMealType,
        items,
        totals,
        draftImage,
        setDraftPhoto,
        setAnalysis: (next, imageUri, image) => setAnalysis(next.map(fromApiItem), imageUri, image),
        history,
        summary,
        loading,
        refreshing,
        busy,
        error: errorMessage,
        actionError,
        retryAction,
        refresh,
        loggedKcal: summary?.consumed.caloriesKcal ?? 0,
        loggedMacros: {
          protein: summary?.consumed.proteinG ?? 0,
          carbs: summary?.consumed.carbsG ?? 0,
          fat: summary?.consumed.fatG ?? 0,
        },
        loggedMealName: history.find((meal) => meal.targetDate === localDate())?.name ?? null,
        tutorialSeen,
        dismissTutorial,
        addItem,
        updateItem,
        removeItem,
        deleteMeal,
        logMeal,
        deleteLog,
        updateMealType,
      }}
    >
      {children}
    </MealsContext.Provider>
  )
}
export function useMeals(): MealsContextValue {
  const value = useContext(MealsContext)
  if (!value) throw new Error("useMeals must be used inside MealsProvider")
  return value
}

export function useFoodSearch(query: string) {
  const { user } = useAuth()
  const normalized = query.trim()
  const [debounced, setDebounced] = useState(normalized)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(normalized), 250)
    return () => clearTimeout(timer)
  }, [normalized])
  const searchQuery = useQuery({
    queryKey: mealsQueryKeys.foodSearch(user?.id ?? "signed-out", debounced),
    enabled: Boolean(user?.id && debounced),
    queryFn: async ({ signal }) => {
      const result = await apiRequest<{
        foods: {
          id: string
          name: string
          servingUnit: "g" | "ml"
          glyph: MealGlyph
          caloriesPer100: number
          proteinPer100G: number
          carbsPer100G: number
          fatPer100G: number
        }[]
      }>(`/foods?q=${encodeURIComponent(debounced)}`, { signal })
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
    },
  })
  const matches = debounced === normalized ? (searchQuery.data ?? []) : []
  return {
    matches,
    error: searchQuery.error ? apiErrorMessage(searchQuery.error, "food search") : null,
    loading: Boolean(normalized && (debounced !== normalized || searchQuery.isLoading)),
    refreshing: searchQuery.isFetching && !searchQuery.isLoading,
    empty: Boolean(
      normalized && debounced === normalized && !searchQuery.isLoading && matches.length === 0,
    ),
  }
}
