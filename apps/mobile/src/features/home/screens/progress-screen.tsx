import { router, type Href } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, Card, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { dateKey, useHealth } from "@/features/health"
import {
  usePlanInput,
  useRoutines,
  useWorkoutProgress,
  useWorkouts,
  WorkoutHistoryCard,
} from "@/features/workout"
import { Palette as C } from "@/theme"

import { TrainingActivityCard } from "../components/training-activity-card"
import { WeightChart } from "../components/weight-chart"
import { approx, bodyComposition } from "../utils/body-composition"
import { progressData, RANGE_PERIODS, RANGES, type Range } from "../utils/progress-data"
import { trainingActivity } from "../utils/training-activity"
import { towardGoal, weightGoal } from "../utils/weight-goal"

const RECENT_COUNT = 3

const shortDate = (value: string | Date) =>
  (typeof value === "string" ? new Date(`${value}T12:00:00`) : value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

export function ProgressScreen() {
  const { weightKg, weights, plan, heightCm, sex, loading: weightsLoading } = useHealth()
  const { sessions, historyMessage, error: historyError, refresh } = useWorkouts()
  const stats = useWorkoutProgress()
  const input = usePlanInput()
  const { today } = useRoutines()
  const { user } = useAuth()
  const [range, setRange] = useState<Range>("Month")

  const data = progressData(range, weights)
  const goal = weightGoal(weights, weightKg, plan.targetWeightKg)
  const good =
    data.changeKg === null ? null : towardGoal(data.changeKg, weightKg, plan.targetWeightKg)
  const activity = trainingActivity(range, stats.data ?? null, {
    sessions: Math.max(1, input.sessions ?? 3),
    minutes: input.minutes,
  })
  const recent = sessions.slice(0, RECENT_COUNT)

  const composition = bodyComposition({ weightKg, heightCm, sex, birthDate: user?.birthDate })
  const latestLog = weights.at(-1)?.loggedDate
  const measuredOn = latestLog ? shortDate(latestLog) : null

  return (
    <Screen>
      <BackHeader label="Today" onPress={() => router.back()} />

      <PageHeading title="Progress" subtitle={RANGE_PERIODS[range]} />

      <View style={styles.segments}>
        {RANGES.map((item) => {
          const active = item === range
          return (
            <Pressable
              key={item}
              style={[styles.segment, active && styles.segmentActive]}
              accessibilityState={{ selected: active }}
              onPress={() => setRange(item)}
            >
              <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{item}</Text>
            </Pressable>
          )
        })}
      </View>

      <Card>
        <View style={styles.weightHeader}>
          <Text style={styles.cardTitle}>Weight</Text>
          <View style={[styles.pill, good === false && styles.pillMuted]}>
            <Text style={[styles.pillText, good === false && styles.pillTextMuted]}>
              {data.delta}
            </Text>
          </View>
        </View>

        <Text style={styles.bigValue}>
          {weightKg !== null ? `${weightKg.toFixed(1)} kg` : weightsLoading ? "Loading…" : "—"}
        </Text>

        <WeightChart key={range} weights={data.weights} goalKg={plan.targetWeightKg} />

        <View style={styles.dates}>
          {data.dates.map((date) => (
            <Text key={date} style={styles.dateLabel}>
              {shortDate(date)}
            </Text>
          ))}
        </View>

        {goal?.status === "reached" ? (
          <Text style={styles.goalReached}>
            {`Target weight reached - ${goal.goalKg.toFixed(1)} kg`}
          </Text>
        ) : goal?.status === "progress" ? (
          <View style={styles.goal}>
            <View
              style={styles.goalTrack}
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel={`${goal.leftKg.toFixed(1)} kg to your goal of ${goal.goalKg.toFixed(1)} kg`}
              accessibilityValue={{ min: 0, max: 100, now: Math.round(goal.progress * 100) }}
            >
              <View style={[styles.goalFill, { width: `${goal.progress * 100}%` }]} />
            </View>
            <View style={styles.weightHeader}>
              <Text style={styles.goalLeft}>{`${goal.leftKg.toFixed(1)} kg to go`}</Text>
              <Text style={styles.cardNote}>
                {`${Math.round(goal.progress * 100)}% of the way from ${goal.startKg.toFixed(1)} kg`}
              </Text>
            </View>
            {goal.eta ? (
              <Text style={styles.cardNote}>
                {`At this pace, around ${shortDate(goal.eta)} (estimate)`}
              </Text>
            ) : goal.away ? (
              <Text style={styles.cardNote}>Your recent trend is moving away from your goal.</Text>
            ) : null}
          </View>
        ) : null}
      </Card>

      <TrainingActivityCard
        activity={activity}
        range={range}
        status={stats.isLoading ? "loading" : stats.data ? "ready" : "error"}
      />

      <Card style={styles.recentCard}>
        <View style={styles.weightHeader}>
          <Text accessibilityRole="header" style={styles.cardTitle}>
            Recent workouts
          </Text>
          {recent.length ? (
            <Pressable onPress={() => router.push("/workout-history" as Href)} hitSlop={8}>
              <Text style={styles.link}>View all ›</Text>
            </Pressable>
          ) : null}
        </View>
        {recent.length ? (
          recent.map((entry, index) => (
            <View key={entry.id} style={index > 0 ? styles.recentDivider : undefined}>
              <WorkoutHistoryCard
                bare
                session={entry}
                onPress={() =>
                  router.push(`/workout-history/${encodeURIComponent(entry.id)}` as Href)
                }
              />
            </View>
          ))
        ) : historyError || historyMessage ? (
          <>
            <Text style={styles.cardNote}>{historyError ?? historyMessage}</Text>
            {historyError ? (
              <Button
                label="Retry"
                variant="secondary"
                onPress={() => void refresh().catch(() => undefined)}
              />
            ) : null}
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.cardNote}>Your saved workouts and their sets show up here.</Text>
            <Button
              label={today.exercises.length ? "Start today's workout" : "View plan"}
              onPress={() =>
                router.push(
                  (today.exercises.length ? `/routine?date=${dateKey()}` : "/workout") as Href,
                )
              }
            />
          </View>
        )}
      </Card>

      <Card>
        <View style={styles.weightHeader}>
          <Text style={styles.cardTitle}>Body composition</Text>
          {composition.status === "ready" && measuredOn ? (
            <Text style={styles.cardNote}>{measuredOn}</Text>
          ) : null}
        </View>

        {composition.status === "ready" ? (
          <View style={styles.compositionRow}>
            <View
              style={styles.compositionItem}
              accessible
              accessibilityLabel={`Body fat, about ${approx(composition.bodyFat, " percent").slice(1)}`}
            >
              <Text style={styles.compositionValue}>{approx(composition.bodyFat, "%")}</Text>
              <Text style={styles.compositionLabel}>Body fat</Text>
            </View>
            <View
              style={styles.compositionItem}
              accessible
              accessibilityLabel={`Lean mass, about ${approx(composition.leanKg, " kilograms").slice(1)}`}
            >
              <Text style={styles.compositionValue}>{approx(composition.leanKg, " kg")}</Text>
              <Text style={styles.compositionLabel}>Lean mass</Text>
            </View>
          </View>
        ) : composition.status === "incomplete" ? (
          <>
            <Text style={styles.cardNote}>
              {`Add your ${composition.missing.join(", ")} in Profile to see an estimate.`}
            </Text>
            <Pressable onPress={() => router.push("/profile")} hitSlop={8}>
              <Text style={styles.link}>Complete profile</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.cardNote}>{composition.reason}</Text>
        )}

        <Text style={styles.cardNote}>Personal-scale estimates, not a diagnosis</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Accuracy &amp; personalization</Text>
        <Text style={styles.cardNote}>
          Basic body info gives you a starting nutrition estimate. Adding daily activity and goals
          helps personalize your plan. More details live in Profile.
        </Text>
        <Pressable onPress={() => router.push("/profile")} hitSlop={8}>
          <Text style={styles.link}>Profile</Text>
        </Pressable>
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  segments: {
    flexDirection: "row",
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: C.surface,
  },
  segmentLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  segmentLabelActive: {
    fontWeight: "600",
    color: C.accent,
  },
  weightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  pill: {
    backgroundColor: C.accentTint,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillMuted: { backgroundColor: C.card },
  pillTextMuted: { color: C.textMuted },
  goal: { gap: 6 },
  goalTrack: { height: 6, borderRadius: 100, backgroundColor: C.card, overflow: "hidden" },
  goalFill: { height: 6, borderRadius: 100, backgroundColor: C.accent },
  goalLeft: { fontSize: 13, fontWeight: "600", color: C.text },
  goalReached: { fontSize: 13, fontWeight: "600", color: C.accent },
  recentCard: { gap: 4 },
  recentDivider: { borderTopWidth: 1, borderTopColor: C.border },
  empty: { gap: 6, paddingTop: 4 },
  emptyTitle: { fontSize: 14, fontWeight: "600", color: C.text },
  pillText: {
    fontSize: 11,
    fontWeight: "500",
    color: C.accent,
  },
  bigValue: {
    fontSize: 34,
    fontWeight: "600",
    color: C.text,
  },
  dates: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  cardNote: {
    fontSize: 11,
    color: C.textMuted,
    flexShrink: 1,
  },
  compositionRow: {
    flexDirection: "row",
    gap: 12,
  },
  compositionItem: {
    flex: 1,
    backgroundColor: C.previewTint,
    borderRadius: 16,
    padding: 12,
    gap: 3,
  },
  compositionValue: {
    fontSize: 20,
    fontWeight: "600",
    color: C.text,
  },
  compositionLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  link: {
    fontSize: 12,
    fontWeight: "600",
    color: C.accent,
  },
})
