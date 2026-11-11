import { Image } from "expo-image"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Card, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { dateKey, useHealth } from "@/features/health"
import { injuryEffect, useActiveInjuries } from "@/features/recovery"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { usePlanInput, usePlanPreferences, useRoutines } from "../store/plan-preferences.store"
import { MUSCLE_GROUPS } from "../utils/muscle-groups"
import { routineOn, type PlanInput, type Routine } from "../utils/routines"

const icons = {
  shieldCheck: require("@/assets/images/home/shield-check.svg"),
}

/** Monday-to-Sunday dates of the week containing `today`. */
function currentWeek(today: Date) {
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return date
  })
}

/** Session names short enough for the week strip. */
const SHORT_NAMES: Record<string, string> = {
  "Full Body A": "Full A",
  "Full Body B": "Full B",
  "Upper A": "Up A",
  "Upper B": "Up B",
  "Lower A": "Low A",
  "Lower B": "Low B",
  "Rest day": "Rest",
}
const shortName = (name: string) => SHORT_NAMES[name] ?? name

const TOAST_MS = 4000
/** Plan settings as last seen on this screen, to say what changed when the user comes back. */
let seenPlan: Record<string, string> | null = null

function planParts(input: PlanInput) {
  return [
    { key: "sessions", value: String(input.sessions ?? 3), label: `${input.sessions ?? 3}x/week` },
    { key: "minutes", value: String(input.minutes), label: `${input.minutes} min` },
    { key: "goal", value: input.goal, label: input.goal },
    { key: "emphasis", value: input.emphasis ?? "", label: `${input.emphasis} focus` },
    { key: "experience", value: input.experience ?? "", label: input.experience ?? "" },
    {
      key: "picks",
      value: JSON.stringify([input.likes, input.dislikes]),
      label: "your exercise picks",
    },
    { key: "recovery", value: JSON.stringify(input.injuries), label: "recovery" },
    { key: "reps", value: JSON.stringify(input.repTargets ?? {}), label: "your reps" },
  ]
}

const shortDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

function ExerciseRows({ routine }: { routine: Routine }) {
  return (
    <View style={styles.exerciseList}>
      {routine.exercises.length ? (
        routine.exercises.map((exercise) => (
          <View key={exercise.key} style={styles.exerciseRow}>
            <Text style={styles.exerciseName}>
              {exercise.name}
              {exercise.liked ? <Text style={styles.liked}> ♥</Text> : null}
            </Text>
            <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.exerciseName}>Rest and recover.</Text>
      )}
    </View>
  )
}

export function WorkoutPlanScreen() {
  useMarkInteractive()
  const { plan } = useHealth()
  const minutes = usePlanPreferences((state) => state.minutes)
  const injuries = useActiveInjuries()
  const now = usePlanNow()
  const { today, next, nextDate, adjustedFor } = useRoutines(now)
  const input = usePlanInput()
  const week = currentWeek(now).map((date) => ({ date, routine: routineOn(date, input) }))
  const todayKey = dateKey(now)
  const [selectedKey, setSelectedKey] = useState(todayKey)
  useEffect(() => setSelectedKey(todayKey), [todayKey])
  const selected =
    week.find(({ date }) => dateKey(date) === selectedKey) ??
    week.find(({ date }) => dateKey(date) === todayKey)!
  const isToday = dateKey(selected.date) === todayKey
  const shown = isToday ? today : selected.routine

  // Tell the user what changed when they come back after editing their plan.
  const [toast, setToast] = useState<string | null>(null)
  const signature = JSON.stringify(planParts(input))
  useFocusEffect(
    useCallback(() => {
      const parts: ReturnType<typeof planParts> = JSON.parse(signature)
      const changed = seenPlan ? parts.filter((part) => seenPlan?.[part.key] !== part.value) : []
      if (changed.length)
        setToast(`Plan updated · ${changed.map((part) => part.label).join(" · ")}`)
      seenPlan = Object.fromEntries(parts.map((part) => [part.key, part.value]))
    }, [signature]),
  )
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])
  const summary = (routine: Routine) =>
    routine.exercises.length ? `${routine.name} - ${routine.minutes} min` : routine.name

  return (
    <View style={styles.container}>
      <Screen>
        <PageHeading
          eyebrow="My plan"
          title="Workout plan"
          subtitle={`${plan.sessions ?? 3}x/week · ${minutes} min · ${plan.goal}`}
        />

        <View style={styles.week}>
          {week.map(({ date, routine }) => {
            const key = dateKey(date)
            const active = key === dateKey(selected.date)
            const rest = !routine.exercises.length
            const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
            return (
              <Pressable
                key={key}
                style={[
                  styles.day,
                  rest && styles.dayRest,
                  key === todayKey && styles.dayToday,
                  active && styles.dayActive,
                ]}
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${weekday} ${date.getDate()}, ${routine.name}`}
                onPress={() => setSelectedKey(key)}
              >
                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{weekday}</Text>
                <Text style={[styles.dayDate, active && styles.dayDateActive]}>
                  {String(date.getDate()).padStart(2, "0")}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.dayName,
                    rest && styles.dayNameRest,
                    active && styles.dayLabelActive,
                  ]}
                >
                  {shortName(routine.name)}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {injuries.length ? (
          <Animated.View entering={FadeInUp.duration(220)}>
            <Pressable style={styles.recoveryCard} onPress={() => router.push("/injuries")}>
              <Image source={icons.shieldCheck} style={styles.recoveryIcon} contentFit="contain" />
              <View style={styles.recoveryCopy}>
                <Text style={styles.recoveryTitle}>Recovery</Text>
                <Text style={styles.recoverySub}>
                  {injuries.map((injury) => injuryEffect(injury)).join("\n")}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ) : null}

        <View style={styles.section}>
          <SectionHeading
            title={
              isToday ? "Today" : selected.date.toLocaleDateString("en-US", { weekday: "long" })
            }
            actionLabel="Plan Preferences"
            onPress={() => router.push("/exercise-preferences")}
          />
          <Animated.View entering={FadeInUp.delay(50).duration(220)}>
            <Pressable
              accessibilityLabel={`${isToday ? "Current routine" : "Planned"}, ${summary(shown)}`}
              accessibilityHint="Opens the routine"
              onPress={() => router.push(`/routine?date=${dateKey(selected.date)}`)}
            >
              <Card style={styles.todayCard}>
                <View style={styles.todayRow}>
                  <View style={styles.todayCopy}>
                    <Text style={styles.todayTitle}>{isToday ? "Current routine" : "Planned"}</Text>
                    <Text style={styles.cardSub}>{summary(shown)}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>{shortDate(selected.date).toUpperCase()}</Text>
                  </View>
                </View>
                <ExerciseRows routine={shown} />
                {isToday && adjustedFor ? (
                  <Text style={styles.footnote}>ADJUSTED FOR {adjustedFor.toUpperCase()}</Text>
                ) : null}
                {shown.exercises.length ? (
                  <Text style={styles.viewLink}>
                    {isToday ? "View and start ›" : "View routine ›"}
                  </Text>
                ) : null}
              </Card>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <SectionHeading title="Upcoming" />
          <Animated.View entering={FadeInUp.delay(100).duration(220)}>
            <Pressable
              accessibilityLabel={`Next routine, ${summary(next)}`}
              accessibilityHint="Opens the routine"
              onPress={() => router.push(`/routine?date=${dateKey(nextDate)}`)}
            >
              <Card>
                <View style={styles.nextHeader}>
                  <View style={styles.todayCopy}>
                    <Text style={styles.rowTitle}>Next routine</Text>
                    <Text style={styles.cardSub}>{summary(next)}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>{shortDate(nextDate).toUpperCase()}</Text>
                  </View>
                </View>
                <ExerciseRows routine={next} />
                {injuries.length ? (
                  <Text style={styles.footnote}>IF READY · not cleared medically</Text>
                ) : null}
                <Text style={styles.viewLink}>View routine ›</Text>
              </Card>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <SectionHeading title="Browse muscle groups" actionLabel="6 groups" />
          <Animated.View entering={FadeInUp.delay(150).duration(220)}>
            <View style={styles.groups}>
              {MUSCLE_GROUPS.map(({ group, icon }) => (
                <Pressable
                  key={group}
                  style={styles.group}
                  onPress={() => router.push(`/plan?group=${group.toLowerCase()}`)}
                >
                  <Image source={icon} style={styles.groupImage} contentFit="contain" />
                  <Text style={styles.groupLabel}>{group}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      </Screen>
      {toast ? (
        <View style={styles.toast} accessibilityLiveRegion="polite">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  day: {
    flex: 1,
    minWidth: 0,
    height: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.surface,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayRest: {
    backgroundColor: C.background,
    borderColor: C.border,
  },
  dayToday: {
    borderColor: C.accent,
  },
  dayActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  dayLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  dayLabelActive: {
    color: C.onAccent,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  dayDateActive: {
    color: C.onAccent,
  },
  dayName: {
    fontSize: 9,
    fontWeight: "600",
    color: C.accent,
  },
  dayNameRest: {
    color: C.textMuted,
    fontWeight: "400",
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: C.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toastText: {
    fontSize: 13,
    color: C.onAccent,
  },
  recoveryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.accentTint,
    borderRadius: 18,
    padding: 16,
  },
  recoveryIcon: {
    width: 24,
    height: 24,
  },
  recoveryCopy: {
    flex: 1,
    gap: 4,
  },
  recoveryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  recoverySub: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  section: {
    gap: 8,
  },
  todayCard: {
    paddingVertical: 14,
  },
  todayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  todayCopy: {
    flex: 1,
    gap: 3,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  cardSub: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: C.accentTint,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: C.accent,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },
  nextHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  exerciseList: {
    gap: 8,
    paddingTop: 12,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseName: {
    fontSize: 12,
    color: C.text,
  },
  liked: {
    color: C.accent,
  },
  exercisePrescription: {
    fontSize: 12,
    color: C.textMuted,
  },
  viewLink: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
    paddingTop: 12,
  },
  footnote: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: C.textMuted,
    paddingTop: 10,
  },
  groups: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  group: {
    width: "31%",
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 6,
  },
  groupImage: {
    width: 26,
    height: 34,
    marginBottom: 2,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
})
