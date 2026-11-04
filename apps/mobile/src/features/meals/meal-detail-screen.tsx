import { useQuery } from "@tanstack/react-query";
import { FetchErrorState, LoadingSkeleton } from "@/components/fetch-states";
import { Text, View } from "react-native";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { useAuth } from "@/features/auth/store/auth.store";
import { apiErrorMessage, apiRequest } from "@/lib/api";
import { MealResultScreen } from "@/features/meals/meal-result-screen";
import {
  fromApiMeal,
  mealsQueryKeys,
  useMeals,
  type ApiMealItem,
  type MealType,
} from "@/features/meals/meals-store";

export function MealDetailScreen({ logId, onBack }: { logId?: string; onBack: () => void }) {
  const { user } = useAuth();
  const { history, loading } = useMeals();
  const saved = history.find((item) => item.id === logId);
  const detailQuery = useQuery({
    queryKey: mealsQueryKeys.detail(user?.id ?? "signed-out", logId ?? "missing"),
    enabled: Boolean(logId && user?.id && !saved && !loading),
    queryFn: async ({ signal }) => {
      const meal = await apiRequest<{
        id: string;
        mealType: MealType;
        targetDate: string;
        loggedAt: string;
        imageUrl: string | null;
        items: ApiMealItem[];
      }>(`/meals/${encodeURIComponent(logId!)}`, { signal });
      return fromApiMeal(meal);
    },
  });
  const loaded = detailQuery.data;
  const error = detailQuery.error ? apiErrorMessage(detailQuery.error, "this meal") : null;

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
        {detailQuery.isLoading ? <LoadingSkeleton label="Loading meal" rows={3} /> : null}
        {error ? (
          <FetchErrorState
            title={
              detailQuery.error instanceof Error &&
              "status" in detailQuery.error &&
              detailQuery.error.status === 404
                ? "Meal not found"
                : "Couldn't load this meal"
            }
            message={error}
            onRetry={() => detailQuery.refetch()}
            retrying={detailQuery.isFetching}
            onBack={onBack}
          />
        ) : null}
        {!error && !detailQuery.isLoading ? (
          <FetchErrorState
            title="Meal unavailable"
            message="This meal couldn't be found."
            onBack={onBack}
          />
        ) : null}
        <Pressable onPress={onBack}>
          <Text style={{ color: C.accent }}>Back</Text>
        </Pressable>
      </View>
    );
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
  );
}
