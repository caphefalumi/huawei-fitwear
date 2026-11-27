import { StyleSheet, Text, View } from "react-native"

import { Palette as C } from "@/theme"

import type { StatsSession } from "../api/workout-api"
import {
  compactVolume,
  formatVolume,
  setsByMuscleGroup,
  trainedDays,
  weekStreak,
  weeklyVolume,
} from "../utils/history"
import { MUSCLE_GROUPS } from "../utils/muscle-groups"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const BAR_HEIGHT = 64

const shortDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

/**
 * This week against the plan (sessions, training days, sets per muscle group)
 * and working volume for the last eight weeks.
 */
export function WorkoutOverview({
  sessions,
  now,
  target,
  plannedDays,
}: {
  sessions: StatsSession[]
  now: Date
  /** Planned sessions per week. */
  target: number
  /** Monday to Sunday: whether the plan has a workout that day. */
  plannedDays: boolean[]
}) {
  const trained = trainedDays(sessions, now)
  const done = trained.filter(Boolean).length
  const streak = weekStreak(sessions, now, target)
  const muscles = setsByMuscleGroup(
    sessions,
    now,
    MUSCLE_GROUPS.map(({ group }) => group),
  )
  const maxSets = Math.max(1, ...muscles.map(({ sets }) => sets))
  const weeks = weeklyVolume(sessions, now)
  const maxVolume = Math.max(1, ...weeks.map(({ volumeKg }) => volumeKg))
  const thisWeek = weeks[weeks.length - 1]!.volumeKg
  const lastWeek = weeks[weeks.length - 2]!.volumeKg
  const daySummary = WEEKDAYS.map((day, index) =>
    trained[index] ? `${day} trained` : plannedDays[index] ? `${day} planned` : null,
  )
    .filter(Boolean)
    .join(", ")

  return (
    <View style={styles.stack}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text accessibilityRole="header" style={styles.cardTitle}>
            This week
          </Text>
          {streak > 1 ? <Text style={styles.side}>{`${streak}-week streak`}</Text> : null}
        </View>
        <Text accessibilityLabel={`${done} of ${target} planned sessions`}>
          <Text style={styles.hero}>{done}</Text>
          <Text style={styles.heroUnit}>{`  of ${target} planned sessions`}</Text>
        </Text>
        <View
          style={styles.days}
          accessible
          accessibilityLabel={daySummary || "No training days this week"}
        >
          {WEEKDAYS.map((day, index) => (
            <View key={day} style={styles.dayCell}>
              <View
                style={[
                  styles.dot,
                  plannedDays[index] && !trained[index] && styles.dotPlanned,
                  trained[index] && styles.dotDone,
                ]}
              />
              <Text style={styles.dayLabel}>{day.charAt(0)}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.legend}>Filled: trained. Dashed: planned.</Text>

        <View style={styles.divider} />
        <Text style={styles.subTitle}>Sets by muscle group</Text>
        {muscles.map(({ group, sets }) => (
          <View
            key={group}
            style={styles.muscleRow}
            accessible
            accessibilityLabel={`${group}, ${sets} ${sets === 1 ? "set" : "sets"}`}
          >
            <Text style={styles.muscleName}>{group}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(sets / maxSets) * 100}%` }]} />
            </View>
            <Text style={[styles.muscleCount, !sets && styles.muscleZero]}>{sets}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text accessibilityRole="header" style={styles.cardTitle}>
            Weekly volume
          </Text>
          <Text style={styles.side}>8 weeks</Text>
        </View>
        <View
          style={styles.bars}
          accessible
          accessibilityLabel={weeks
            .map(({ start, volumeKg }) => `${shortDate(start)}: ${formatVolume(volumeKg)}`)
            .join(", ")}
        >
          {weeks.map(({ start, volumeKg }, index) => (
            <View key={start.toISOString()} style={styles.barCell}>
              <Text style={styles.barValue} numberOfLines={1}>
                {volumeKg ? compactVolume(volumeKg) : ""}
              </Text>
              <View
                style={[
                  styles.bar,
                  index === weeks.length - 1 && styles.barCurrent,
                  { height: Math.max(3, (volumeKg / maxVolume) * BAR_HEIGHT) },
                ]}
              />
            </View>
          ))}
        </View>
        <View style={styles.row}>
          <Text style={styles.axis}>{shortDate(weeks[0]!.start)}</Text>
          <Text style={styles.axis}>This week</Text>
        </View>
        <Text style={styles.footnote}>
          {`${formatVolume(thisWeek)} this week - last week ${formatVolume(lastWeek)}`}
        </Text>
        <Text style={styles.footnote}>Volume is weight x reps of working sets.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  cardTitle: { color: C.text, fontSize: 14, fontWeight: "600" },
  side: { color: C.accent, fontSize: 12, fontWeight: "600" },
  hero: { color: C.text, fontSize: 27, fontWeight: "600" },
  heroUnit: { color: C.textMuted, fontSize: 13 },
  days: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  dayCell: { alignItems: "center", gap: 4, flex: 1 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: C.border },
  dotPlanned: { borderColor: C.accent, borderStyle: "dashed", borderWidth: 1.5 },
  dotDone: { backgroundColor: C.accent, borderColor: C.accent },
  dayLabel: { color: C.textMuted, fontSize: 10 },
  legend: { color: C.textMuted, fontSize: 11 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 4 },
  subTitle: { color: C.text, fontSize: 13, fontWeight: "600" },
  muscleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  muscleName: { width: 72, color: C.text, fontSize: 12 },
  track: { flex: 1, height: 6, borderRadius: 100, backgroundColor: C.card, overflow: "hidden" },
  fill: { height: 6, borderRadius: 100, backgroundColor: C.accent },
  muscleCount: { width: 24, textAlign: "right", color: C.text, fontSize: 12, fontWeight: "600" },
  muscleZero: { color: C.textMuted, fontWeight: "400" },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginTop: 4 },
  barCell: { flex: 1, alignItems: "center", gap: 3 },
  barValue: { color: C.textMuted, fontSize: 9 },
  bar: { width: "100%", borderRadius: 4, backgroundColor: C.track },
  barCurrent: { backgroundColor: C.accent },
  axis: { color: C.textMuted, fontSize: 10 },
  footnote: { color: C.textMuted, fontSize: 11 },
})
