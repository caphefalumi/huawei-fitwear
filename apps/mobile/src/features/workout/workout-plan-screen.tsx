import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Pressable } from "@/components/pressable"
import { Button, Card, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Palette as C } from "@/constants/palette"
import { recoveryRanges, useHealth } from "@/features/health/health-store"
import { routinesFor, type Routine } from "@/features/workout/routines"
import { RecoverySheet } from "@/features/recovery/recovery-sheet"

const icons = {
  shieldCheck: require("@/assets/images/home/shield-check.svg"),
}

const WEEK = [
  { day: "Mon", date: "05" },
  { day: "Tue", date: "06" },
  { day: "Wed", date: "07" },
  { day: "Thu", date: "08" },
  { day: "Fri", date: "09" },
  { day: "Sat", date: "10" },
  { day: "Sun", date: "11" },
]

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
  const { plan, recovery } = useHealth()
  const [recoveryOpen, setRecoveryOpen] = useState(false)

  const { today, next, adjustedFor } = routinesFor(recovery)
  const ranges = recovery ? recoveryRanges(recovery) : null
  const recoveryLine =
    recovery && ranges
      ? `Rest ${ranges.rest} · light ${ranges.light}\nReturn ${recovery.returnDate}, if ready`
      : ""
  const summary = (routine: Routine) =>
    `${routine.name} · ${routine.exercises.length} exercises · ${routine.sets} sets · ${routine.minutes} min`

  return (
    <Screen>
      <PageHeading
        eyebrow="My plan"
        title="Workout plan"
        subtitle={`${plan.sessions}x/week · fat loss & muscle maintenance`}
      />

      <View style={styles.week}>
        {WEEK.map((day) => {
          const active = day.date === "08"
          return (
            <View key={day.date} style={[styles.day, active && styles.dayActive]}>
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{day.day}</Text>
              <Text style={[styles.dayDate, active && styles.dayDateActive]}>{day.date}</Text>
            </View>
          )
        })}
      </View>

      {recovery ? (
        <Animated.View entering={FadeInUp.duration(220)}>
          <Pressable style={styles.recoveryCard} onPress={() => setRecoveryOpen(true)}>
            <Image source={icons.shieldCheck} style={styles.recoveryIcon} contentFit="contain" />
            <View style={styles.recoveryCopy}>
              <Text style={styles.recoveryTitle}>Recovery</Text>
              <Text style={styles.recoverySub}>{recoveryLine}</Text>
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
                <Text style={styles.badgeLabel}>OCT 8</Text>
              </View>
            </View>
            <View style={styles.exerciseList}>
              {today.exercises.map((exercise) => (
                <View key={exercise.name} style={styles.exerciseRow}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
                </View>
              ))}
            </View>
            {adjustedFor ? (
              <Text style={styles.footnote}>ADJUSTED FOR {adjustedFor.toUpperCase()}</Text>
            ) : null}
          </Card>
        </Animated.View>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Upcoming" actionLabel="Oct 9" />
        <Animated.View entering={FadeInUp.delay(100).duration(220)}>
          <Card>
            <View style={styles.nextHeader}>
              <View style={styles.todayCopy}>
                <Text style={styles.rowTitle}>Next routine</Text>
                <Text style={styles.cardSub}>{summary(next)}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>OCT 9</Text>
              </View>
            </View>
            <View style={styles.exerciseList}>
              {next.exercises.map((exercise) => (
                <View key={exercise.name} style={styles.exerciseRow}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
                </View>
              ))}
            </View>
            {recovery ? (
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

      {recoveryOpen ? <RecoverySheet visible onClose={() => setRecoveryOpen(false)} /> : null}
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
