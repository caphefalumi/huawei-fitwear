import { Image } from "expo-image"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Card, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { useMeals } from "@/features/meals"
import { injuryEffect, injuryTitle, useActiveInjuries } from "@/features/recovery"
import { useRoutines } from "@/features/workout"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { CompleteProfileCard } from "../components/complete-profile-card"
import { NutritionRing } from "../components/ring"
import { MacroBar } from "../components/ui"
import { WeightChart } from "../components/weight-chart"
import { nutritionView } from "../utils/nutrition-view"

const DEMO_WEIGHTS = [72.8, 72.5, 72.3, 72.1, 71.9, 71.7, 71.5]
const WEEK_ACTIVE = [true, true, false, true, true, false, true]

const icons = {
  chevronRight: require("@/assets/images/home/chevron-right.svg"),
  previousLog: require("@/assets/images/home/previous-log.svg"),
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
  const { weightKg, weightUpdated } = useHealth()
  const injuries = useActiveInjuries()
  const { summary, error: mealsError } = useMeals()
  useMarkInteractive()
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
  const latestWeightKg = weightKg ?? DEMO_WEIGHTS[DEMO_WEIGHTS.length - 1]
  const weights =
    latestWeightKg >= 70 && latestWeightKg <= 74
      ? [...DEMO_WEIGHTS.slice(0, -1), latestWeightKg]
      : DEMO_WEIGHTS

  return (
    <Screen>
      <View style={styles.topRow}>
        <Text style={styles.date}>{dateLine}</Text>
        <Text style={styles.name}>{user?.name?.trim() || "Sam N."}</Text>
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
          <Text style={styles.focusMuted} numberOfLines={1}>
            {injuries.length ? injuryTitle(injuries) : "Watch connected"}
          </Text>
          <View style={styles.weekDots}>
            {WEEK_ACTIVE.map((active, index) => (
              <View
                // ponytail: static demo strip, real activity data when health store has it
                key={index}
                style={[styles.dot, active ? styles.dotActive : styles.dotIdle]}
              />
            ))}
          </View>
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
              <View style={styles.weightValueRow}>
                <Text style={styles.weightValue} numberOfLines={1}>
                  {latestWeightKg.toFixed(1)}
                </Text>
                <Text style={styles.weightUnit}>kg</Text>
              </View>
              <Text style={styles.weightSub} numberOfLines={1}>
                {weightUpdated ? "Logged Oct 8" : "−1.2 kg in 4 weeks"}
              </Text>
            </View>
            <WeightChart weights={weights} />

            {weightUpdated ? (
              <View style={styles.previousRow}>
                <Image
                  source={icons.previousLog}
                  style={styles.previousChart}
                  contentFit="contain"
                />
                <Text style={styles.previousText}>Previous · Oct 7</Text>
                <Text style={styles.previousValue}>72.0 kg</Text>
              </View>
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
  weekDots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: C.accent,
  },
  dotIdle: {
    borderWidth: 1,
    borderColor: C.border,
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
  previousRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previousChart: {
    width: 44,
    height: 20,
  },
  previousText: {
    flex: 1,
    fontSize: 11,
    color: C.textMuted,
  },
  previousValue: {
    fontSize: 11,
    fontWeight: "600",
    color: C.text,
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
