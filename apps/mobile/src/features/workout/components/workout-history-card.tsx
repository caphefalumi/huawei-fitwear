import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import type { WorkoutSession } from "../hooks/workout-hooks"
import { sessionSummary, summaryLine } from "../utils/history"

const MAX_GROUPS = 3

const dayLabel = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

/** One saved workout: name and day, then time, sets and volume, then the muscle groups trained. */
export function WorkoutHistoryCard({
  session,
  onPress,
}: {
  session: WorkoutSession
  onPress: () => void
}) {
  const line = summaryLine(session)
  const groups = (sessionSummary(session)?.muscleGroups ?? [])
    .slice(0, MAX_GROUPS)
    .map(({ muscleGroup }) => muscleGroup)
  const day = dayLabel(session.startedAt)
  return (
    <Pressable
      style={styles.card}
      accessibilityLabel={[session.sessionTitle, day, line, groups.join(", ")]
        .filter(Boolean)
        .join(", ")}
      onPress={onPress}
    >
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={1}>
          {session.sessionTitle}
        </Text>
        <Text style={styles.day}>{day}</Text>
      </View>
      {line ? (
        <Text style={[styles.meta, !session.completedAt && styles.metaActive]}>{line}</Text>
      ) : null}
      {groups.length ? (
        <View style={styles.chips}>
          {groups.map((group) => (
            <Text key={group} style={styles.chip}>
              {group}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },
  top: { flexDirection: "row", alignItems: "baseline", gap: 12 },
  title: { flex: 1, color: C.text, fontSize: 15, fontWeight: "600" },
  day: { color: C.textMuted, fontSize: 12 },
  meta: { color: C.textMuted, fontSize: 12, lineHeight: 16 },
  metaActive: { color: C.accent, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  chip: {
    backgroundColor: C.card,
    color: C.textMuted,
    fontSize: 11,
    fontWeight: "600",
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
})
