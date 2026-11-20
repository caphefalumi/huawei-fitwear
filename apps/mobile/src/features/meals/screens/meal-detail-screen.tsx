import { useQuery } from "@tanstack/react-query"
import { Text, View } from "react-native"

import { FetchErrorState, LoadingSkeleton } from "@/components/feedback/fetch-states"
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { apiErrorMessage } from "@/lib/api/client"
import { refetchThrowing } from "@/lib/query/retry"
import { Palette as C } from "@/theme"

import { fetchMeal } from "../api/meals-api"
import { fromApiMeal, mealsQueryKeys, useMeals } from "../hooks/meals-hooks"
import { MealResultScreen } from "./meal-result-screen"

export function MealDetailScreen({ logId, onBack }: { logId?: string; onBack: () => void }) {
  const { user, offline } = useAuth()
  const { history, loading } = useMeals()
  const saved = history.find((item) => item.id === logId)
  const detailQuery = useQuery({
    queryKey: mealsQueryKeys.detail(user?.id ?? "signed-out", logId ?? "missing"),
    enabled: Boolean(logId && user?.id && !saved && !loading),
    queryFn: async ({ signal }) => fromApiMeal(await fetchMeal(logId!, signal)),
  })
  const loaded = detailQuery.data
  const error = detailQuery.error ? apiErrorMessage(detailQuery.error, "this meal") : null
  const waitingForHistory = loading && !detailQuery.isFetching
  const unavailableOffline = offline || detailQuery.fetchStatus === "paused"

  if (logId && !saved && !loaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: C.background,
          padding: 32,
          justifyContent: "center",
          gap: 16,
        }}
      >
        <Text accessibilityRole="header" style={{ color: C.text, fontSize: 20, fontWeight: "600" }}>
          Meal
        </Text>
        {!unavailableOffline && (waitingForHistory || detailQuery.isLoading) ? (
          <LoadingSkeleton label="Loading meal" rows={3} />
        ) : null}
        {unavailableOffline ? (
          <FetchErrorState
            title="Meal unavailable offline"
            message="This meal isn't saved on this device. Reconnect to load it."
            onBack={onBack}
          />
        ) : error ? (
          <FetchErrorState
            title={
              detailQuery.error instanceof Error &&
              "status" in detailQuery.error &&
              detailQuery.error.status === 404
                ? "Meal not found"
                : "Could not load this meal"
            }
            message={error}
            retrySuccessMessage="Meal loaded."
            onRetry={async () => {
              await refetchThrowing(() => detailQuery.refetch())
            }}
            retrying={detailQuery.isFetching}
            onBack={onBack}
          />
        ) : null}
        {!unavailableOffline && !error && !waitingForHistory && !detailQuery.isLoading ? (
          <FetchErrorState
            title="Meal unavailable"
            message="This meal could not be found."
            onBack={onBack}
          />
        ) : null}
        <Pressable onPress={onBack}>
          <Text style={{ color: C.accent }}>Back</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <>
      {loaded && error ? (
        <View style={{ padding: 12, backgroundColor: C.background }}>
          <Text accessibilityRole="alert" style={{ color: C.text }}>
            Could not refresh this meal. Showing saved data. {error}
          </Text>
          <Pressable onPress={() => void detailQuery.refetch()}>
            <Text style={{ color: C.accent }}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      <MealResultScreen log={saved ?? loaded ?? undefined} />
    </>
  )
}
