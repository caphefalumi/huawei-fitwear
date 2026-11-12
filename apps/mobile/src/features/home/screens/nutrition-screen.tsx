import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Card, PageHeading, Screen } from "@/components/ui"
import { useMeals } from "@/features/meals"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { CompleteProfileCard } from "../components/complete-profile-card"
import { NutritionRing } from "../components/ring"
import { MacroBar } from "../components/ui"
import { nutritionView } from "../utils/nutrition-view"

export function NutritionScreen() {
  useMarkInteractive()
  const { summary, error } = useMeals()
  const nutrition = nutritionView(summary)
  const dateLine = usePlanNow().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  return (
    <Screen>
      <BackHeader label="Today" onPress={() => router.back()} />

      <PageHeading title="Nutrition" subtitle={dateLine} />

      {nutrition.status === "ready" ? (
        <>
          <Card style={styles.center}>
            <NutritionRing kcalLeft={nutrition.kcalLeft} progress={nutrition.progress} />

            <View style={styles.stats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Consumed</Text>
                <Text style={styles.statValue}>
                  {nutrition.consumedKcal.toLocaleString("en-US")} kcal
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Daily target</Text>
                <Text style={styles.statValue}>
                  {nutrition.targetKcal.toLocaleString("en-US")} kcal
                </Text>
              </View>
            </View>
          </Card>

          {nutrition.targetReached ? (
            <Card>
              <Text style={styles.cardTitle}>Target weight reached</Text>
              <Text style={styles.noteBody}>
                Your daily target now keeps your weight steady instead of changing it.
              </Text>
            </Card>
          ) : null}

          <Card>
            <Text style={styles.cardTitle}>Remaining today</Text>
            <Text style={styles.remaining}>{nutrition.kcalLeft.toLocaleString("en-US")} kcal</Text>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Macronutrients</Text>
            <View style={styles.macros}>
              {nutrition.macros.map((macro) => (
                <MacroBar
                  key={macro.label}
                  label={macro.label}
                  value={macro.value}
                  target={macro.target}
                  unit="g"
                  note={`${Math.max(0, Math.round(macro.target - macro.value))} g remaining`}
                />
              ))}
            </View>
          </Card>
        </>
      ) : nutrition.status === "incomplete" ? (
        <>
          <CompleteProfileCard />
          <Card>
            <Text style={styles.cardTitle}>Logged today</Text>
            <View style={styles.stats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Energy</Text>
                <Text style={styles.statValue}>
                  {nutrition.consumedKcal.toLocaleString("en-US")} kcal
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Protein</Text>
                <Text style={styles.statValue}>{nutrition.consumed.protein} g</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Carbs</Text>
                <Text style={styles.statValue}>{nutrition.consumed.carbs} g</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Fat</Text>
                <Text style={styles.statValue}>{nutrition.consumed.fat} g</Text>
              </View>
            </View>
          </Card>
        </>
      ) : (
        <Text style={styles.noteBody}>{error ?? "Loading nutrition..."}</Text>
      )}

      <View style={styles.note}>
        <Text style={styles.noteTitle}>About these numbers</Text>
        <Text style={styles.noteBody}>
          Food values and personal targets are estimates, not medical guidance.
        </Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
  },
  stats: {
    alignSelf: "stretch",
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  remaining: {
    fontSize: 27,
    fontWeight: "600",
    color: C.text,
  },
  macros: {
    gap: 12,
  },
  note: {
    gap: 4,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
  },
  noteBody: {
    fontSize: 11,
    color: C.textMuted,
  },
})
