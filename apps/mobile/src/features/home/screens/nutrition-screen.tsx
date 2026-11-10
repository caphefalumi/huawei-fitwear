import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Card, PageHeading, Screen } from "@/components/ui"
import { useHealth } from "@/features/health"
import { useMeals } from "@/features/meals"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { Palette as C } from "@/theme"

import { NutritionRing } from "../components/ring"
import { MacroBar } from "../components/ui"

export function NutritionScreen() {
  useMarkInteractive()
  const { weightUpdated } = useHealth()
  const { loggedKcal, loggedMacros } = useMeals()

  const targetKcal = weightUpdated ? 2160 : 2200
  const consumedKcal = 1320 + loggedKcal
  const left = targetKcal - consumedKcal

  return (
    <Screen>
      <BackHeader label="Today" onPress={() => router.back()} />

      <PageHeading title="Nutrition" subtitle="Thursday, Oct 8" />

      <Card style={styles.center}>
        <NutritionRing kcalLeft={left} progress={consumedKcal / targetKcal} />

        <View style={styles.stats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Consumed</Text>
            <Text style={styles.statValue}>{consumedKcal.toLocaleString("en-US")} kcal</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Daily target</Text>
            <Text style={styles.statValue}>{targetKcal.toLocaleString("en-US")} kcal</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Remaining today</Text>
        <Text style={styles.remaining}>{left} kcal</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Macronutrients</Text>
        <View style={styles.macros}>
          <MacroBar
            label="Protein"
            value={92 + loggedMacros.protein}
            target={140}
            unit="g"
            note={`${Math.max(0, Math.round(140 - 92 - loggedMacros.protein))} g remaining`}
          />
          <MacroBar
            label="Carbs"
            value={152 + loggedMacros.carbs}
            target={265}
            unit="g"
            note={`${Math.max(0, Math.round(265 - 152 - loggedMacros.carbs))} g remaining`}
          />
          <MacroBar
            label="Fat"
            value={38 + loggedMacros.fat}
            target={60}
            unit="g"
            note={`${Math.max(0, Math.round(60 - 38 - loggedMacros.fat))} g remaining`}
          />
        </View>
      </Card>

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
