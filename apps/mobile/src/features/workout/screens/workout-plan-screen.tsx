import { Image } from "expo-image"
import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Pressable } from "@/components/pressable"
import { Button, Card, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { useHealth } from "@/features/health"
import { injuryEffect, useActiveInjuries } from "@/features/recovery"
import { useMarkInteractive } from "@/lib/observe"
import { Palette as C } from "@/theme"

import { usePlanPreferences, useRoutines } from "../plan-preferences.store"
import type { Routine } from "../routines"

const icons = {
  shieldCheck: require("@/assets/images/home/shield-check.svg"),
}

/** Monday-to-Sunday strip of the current week. */
function currentWeek(today: Date) {
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: String(date.getDate()).padStart(2, "0"),
      active: date.toDateString() === today.toDateString(),
    }
  })
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
        <Text style={styles.exerciseName}>Rest and recover today.</Text>
      )}
    </View>
  )
}

const MUSCLE_GROUPS = [
  {
    key: "chest",
    label: "Chest",
    icon: require("@/assets/images/recovery/body-chest.svg"),
  },
  {
    key: "back",
    label: "Back",
    icon: require("@/assets/images/recovery/body-back.svg"),
  },
  {
    key: "shoulders",
    label: "Shoulders",
    icon: require("@/assets/images/recovery/body-shoulders.svg"),
  },
  {
    key: "arms",
    label: "Arms",
    icon: require("@/assets/images/recovery/body-arms.svg"),
  },
  {
    key: "legs",
    label: "Legs",
    icon: require("@/assets/images/recovery/body-legs.svg"),
  },
  {
    key: "core",
    label: "Core",
    icon: require("@/assets/images/recovery/body-core.svg"),
  },
]

export function WorkoutPlanScreen() {
  useMarkInteractive()
  const { plan } = useHealth()
  const minutes = usePlanPreferences((state) => state.minutes)
  const injuries = useActiveInjuries()
  const now = new Date()
  const { today, next, nextDate, adjustedFor } = useRoutines(now)
  const summary = (routine: Routine) =>
    routine.exercises.length
      ? `${routine.name} · ${routine.exercises.length} exercises · ${routine.sets} sets · ${routine.minutes} min`
      : routine.name

  return (
    <Screen>
      <PageHeading
        eyebrow="My plan"
        title="Workout plan"
        subtitle={`${plan.sessions ?? 3}x/week · ${minutes} min · ${plan.goal}`}
      />

      <View style={styles.week}>
        {currentWeek(now).map(({ active, ...day }) => {
          return (
            <View key={day.date} style={[styles.day, active && styles.dayActive]}>
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{day.day}</Text>
              <Text style={[styles.dayDate, active && styles.dayDateActive]}>{day.date}</Text>
            </View>
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
        <SectionHeading title="Today" actionLabel={today.name} />
        <Animated.View entering={FadeInUp.delay(50).duration(220)}>
          <Card style={styles.todayCard}>
            <View style={styles.todayRow}>
              <View style={styles.todayCopy}>
                <Text style={styles.todayTitle}>Current routine</Text>
                <Text style={styles.cardSub}>{summary(today)}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>{shortDate(now).toUpperCase()}</Text>
              </View>
            </View>
            <ExerciseRows routine={today} />
            {adjustedFor ? (
              <Text style={styles.footnote}>ADJUSTED FOR {adjustedFor.toUpperCase()}</Text>
            ) : null}
          </Card>
        </Animated.View>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Upcoming" actionLabel={shortDate(nextDate)} />
        <Animated.View entering={FadeInUp.delay(100).duration(220)}>
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
          </Card>
        </Animated.View>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Browse muscle groups" actionLabel="6 groups" />
        <Animated.View entering={FadeInUp.delay(150).duration(220)}>
          <View style={styles.groups}>
            {MUSCLE_GROUPS.map((group) => (
              <Pressable
                key={group.key}
                style={styles.group}
                onPress={() =>
                  router.push(group.key === "chest" ? "/chest-plan" : `/plan?group=${group.key}`)
                }
              >
                <Image source={group.icon} style={styles.groupImage} contentFit="contain" />
                <Text style={styles.groupLabel}>{group.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>

      <Button label="View Chest plan" onPress={() => router.push("/chest-plan")} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  week: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  day: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayActive: {
    backgroundColor: C.accent,
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
