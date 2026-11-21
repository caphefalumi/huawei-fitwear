import { Image } from "expo-image"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Card, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { dateLabel } from "@/features/health/hooks/health-hooks"
import { useMeals } from "@/features/meals"
import { injuryEffect, injuryTitle, useActiveInjuries } from "@/features/recovery"
import { useRoutines } from "@/features/workout"
import { usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { CompleteProfileCard } from "../components/complete-profile-card"
import { NutritionRing } from "../components/ring"
import { MacroBar } from "../components/ui"
import { WeightChart } from "../components/weight-chart"
import { nutritionView } from "../utils/nutrition-view"

const icons = {
  chevronRight: require("@/assets/images/home/chevron-right.svg"),
  shieldCheck: require("@/assets/images/home/shield-check.svg"),
  check: require("@/assets/images/home/check.svg"),
}

/** Ease-out count-up for hero numbers. */
function useCountUp(target: number, duration = 600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = Date.now()
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration)
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

export function HomeScreen() {
  const { weights, loading: weightsLoading, error: weightsError } = useHealth()
  const injuries = useActiveInjuries()
  const { summary, error: mealsError } = useMeals()
  const [visit, setVisit] = useState(0)

  useFocusEffect(useCallback(() => setVisit((v) => v + 1), []))

  const nutrition = nutritionView(summary)
  const targetKcal = nutrition.status === "ready" ? nutrition.targetKcal : null
  const kcalShown = useCountUp(nutrition.status === "ready" ? nutrition.kcalLeft : 0)

  // Tell the user when a profile change moved their daily target.
  const previousTargetKcal = useRef<number | null>(null)
  const [targetsUpdated, setTargetsUpdated] = useState(false)
  useEffect(() => {
    if (targetKcal === null) return
    if (previousTargetKcal.current !== null && previousTargetKcal.current !== targetKcal) {
      setTargetsUpdated(true)
    }
    previousTargetKcal.current = targetKcal
  }, [targetKcal])
  const today = useRoutines().today
  const { user } = useAuth()
  const dateLine = usePlanNow()
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase()
  const latestWeight = weights.at(-1)

  return (
    <Screen>
      <View style={styles.topRow}>
        <Text style={styles.date}>{dateLine}</Text>
        {user?.name?.trim() ? <Text style={styles.name}>{user.name.trim()}</Text> : null}
      </View>

      <PageHeading title="Today" style={styles.heading} />

      <Animated.View entering={FadeInUp.duration(250)}>
        <Card style={styles.focus}>
          <Text style={styles.focusLine} numberOfLines={1}>
            Today: {today.name}
            {today.exercises.length ? ` · ${today.sets} sets · ~${today.minutes} min` : ""}
          </Text>
          {nutrition.status === "ready" ? (
            <Text style={styles.focusMuted} numberOfLines={1}>
              {kcalShown} kcal left
            </Text>
          ) : nutrition.status === "incomplete" ? (
            <Text style={styles.focusMuted} numberOfLines={1}>
              Complete profile to see your daily target
            </Text>
          ) : null}
          {injuries.length ? <Text style={styles.focusMuted}>{injuryTitle(injuries)}</Text> : null}
          <Pressable onPress={() => router.push("/ble-sync")}>
            <Text style={styles.focusMuted}>Watch sync</Text>
          </Pressable>
        </Card>
      </Animated.View>

      {targetsUpdated ? (
        <View style={styles.banner}>
          <Image source={icons.check} style={styles.bannerIcon} contentFit="contain" />
          <Text style={styles.bannerText}>Nutrition targets updated</Text>
          <Pressable
            onPress={() => setTargetsUpdated(false)}
            hitSlop={10}
            accessibilityLabel="Dismiss"
          >
            <Text style={styles.bannerClose}>✕</Text>
          </Pressable>
        </View>
      ) : null}

      <Animated.View key={visit} entering={FadeInUp.delay(60).duration(250)}>
        {nutrition.status === "ready" ? (
          <Pressable onPress={() => router.push("/nutrition")}>
            <Card>
              <Text style={styles.cardHeaderText}>Nutrition</Text>

              <View style={styles.nutritionBody}>
                <NutritionRing kcalLeft={kcalShown} progress={nutrition.progress} />

                <View style={styles.macros}>
                  {nutrition.macros.map((macro) => (
                    <MacroBar
                      key={macro.label}
                      label={macro.label}
                      value={macro.value}
                      target={macro.target}
                      unit="g"
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.consumedLine}>
                {nutrition.consumedKcal.toLocaleString("en-US")} consumed - {kcalShown} kcal left of{" "}
                {nutrition.targetKcal.toLocaleString("en-US")}
              </Text>
              {nutrition.targetReached ? (
                <Text style={styles.consumedLine}>
                  Target weight reached - your target now keeps your weight steady.
                </Text>
              ) : null}
            </Card>
          </Pressable>
        ) : (
          <Card>
            <Text style={styles.cardHeaderText}>Nutrition</Text>
            {nutrition.status === "incomplete" ? (
              <>
                <CompleteProfileCard missing={nutrition.missing} />
                <Text style={styles.consumedLine}>
                  {nutrition.consumedKcal.toLocaleString("en-US")} kcal logged today
                </Text>
              </>
            ) : (
              <Text style={styles.consumedLine}>{mealsError ?? "Loading nutrition..."}</Text>
            )}
          </Card>
        )}
      </Animated.View>

      <Animated.View
        key={`progress-${visit}`}
        entering={FadeInUp.delay(120).duration(250)}
        style={styles.section}
      >
        <SectionHeading title="Progress" />
        <Pressable onPress={() => router.push("/progress")}>
          <Card>
            <View style={styles.weightText}>
              <Text style={styles.weightLabel} numberOfLines={1}>
                Latest weight
              </Text>
              {latestWeight ? (
                <>
                  <View style={styles.weightValueRow}>
                    <Text style={styles.weightValue}>{latestWeight.weightKg.toFixed(1)}</Text>
                    <Text style={styles.weightUnit}>kg</Text>
                  </View>
                  <Text style={styles.weightSub}>Logged {dateLabel(latestWeight.loggedDate)}</Text>
                </>
              ) : (
                <Text style={styles.weightSub}>
                  {weightsLoading ? "Loading weight…" : (weightsError ?? "No weight logged yet.")}
                </Text>
              )}
            </View>
            {weights.length > 1 ? (
              <WeightChart weights={weights.slice(-7).map(({ weightKg }) => weightKg)} />
            ) : null}
          </Card>
        </Pressable>
      </Animated.View>

      {injuries.length ? (
        <Pressable style={styles.recovery} onPress={() => router.push("/injuries")}>
          <Image source={icons.shieldCheck} style={styles.recoveryIcon} contentFit="contain" />
          <View style={styles.recoveryText}>
            <Text style={styles.recoveryTitle}>{injuryTitle(injuries)}</Text>
            <Text style={styles.recoverySub}>
              {injuries.map((injury) => injuryEffect(injury)).join("\n")}
            </Text>
          </View>
          <Image source={icons.chevronRight} style={styles.recoveryChevron} contentFit="contain" />
        </Pressable>
      ) : null}

      {nutrition.status === "ready" ? (
        <Text style={styles.footnote}>Targets are estimates, not medical advice.</Text>
      ) : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: C.textMuted,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
  },
  heading: {
    marginTop: -6,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.accentTint,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bannerIcon: {
    width: 14,
    height: 14,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: C.accent,
  },
  bannerClose: {
    fontSize: 14,
    fontWeight: "600",
    color: C.accent,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  nutritionBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  macros: {
    flex: 1,
    gap: 10,
  },
  consumedLine: {
    fontSize: 11,
    color: C.textMuted,
  },
  focus: {
    gap: 4,
    paddingVertical: 14,
  },
  focusLine: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  focusMuted: {
    fontSize: 12,
    color: C.textMuted,
  },
  section: {
    gap: 10,
  },
  weightText: {
    gap: 2,
  },
  weightLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  weightValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  weightValue: {
    fontSize: 27,
    fontWeight: "600",
    color: C.text,
  },
  weightUnit: {
    fontSize: 14,
    color: C.textMuted,
  },
  weightSub: {
    fontSize: 11,
    color: C.textMuted,
  },
  recovery: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
  },
  recoveryIcon: {
    width: 21,
    height: 21,
  },
  recoveryText: {
    flex: 1,
    gap: 2,
  },
  recoveryTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
  },
  recoverySub: {
    fontSize: 11,
    color: C.textMuted,
  },
  recoveryChevron: {
    width: 17,
    height: 17,
  },
  footnote: {
    fontSize: 10,
    color: C.textMuted,
    textAlign: "center",
  },
})
