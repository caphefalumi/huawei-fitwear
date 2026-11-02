import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { MealResultScreen } from "@/features/meals/meal-result-screen";
import {
  fromApiMeal,
  useMeals,
  type ApiMealItem,
  type MealLog,
  type MealType,
} from "@/features/meals/meals-store";
import { apiRequest } from "@/lib/api";

export default function MealRoute() {
  const { log } = useLocalSearchParams<{ log?: string }>();
  const { history, loading } = useMeals();
  const [loaded, setLoaded] = useState<MealLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const saved = history.find((item) => item.id === log);
  useEffect(() => {
    let current = true;
    setLoaded(null);
    setError(null);
    if (!log || saved || loading) return;
    apiRequest<{
      id: string;
      mealType: MealType;
      targetDate: string;
      loggedAt: string;
      imageUrl: string | null;
      items: ApiMealItem[];
    }>(`/meals/${encodeURIComponent(log)}`)
      .then((meal) => {
        if (current) setLoaded(fromApiMeal(meal));
      })
      .catch((cause) => {
        if (current) setError(cause instanceof Error ? cause.message : "Could not load this meal.");
      });
    return () => {
      current = false;
    };
  }, [log, Boolean(saved), loading, attempt]);
  if (log && !saved && !loaded)
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
        <Text style={{ color: C.text }} accessibilityRole={error ? "alert" : undefined}>
          {error ?? "Loading meal…"}
        </Text>
        {error ? (
          <Pressable onPress={() => setAttempt((value) => value + 1)}>
            <Text style={{ color: C.accent }}>Retry</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: C.accent }}>Back</Text>
        </Pressable>
      </View>
    );
  return <MealResultScreen log={saved ?? loaded ?? undefined} />;
}
