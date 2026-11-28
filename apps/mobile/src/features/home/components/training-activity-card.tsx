import { useEffect, useRef, useState } from "react"
import { Animated, Easing, StyleSheet, Text, View } from "react-native"

import { Card } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import type { Range } from "../utils/progress-data"
import { formatTraining, type TrainingActivity } from "../utils/training-activity"

const BAR_HEIGHT = 88
/** Above this many bars only the busiest and the current bar carry a value. */
const MAX_LABELLED_BARS = 8

const PREVIOUS: Record<Range, string> = {
  Week: "previous week",
  Month: "previous 30 days",
  "3 mo": "previous 3 months",
  Year: "previous year",
}

/** Bar grows into place each time the range changes. */
function GrowingBar({
  height,
  index,
  current,
}: {
  height: number
  index: number
  current: boolean
}) {
  const anim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const timing = Animated.timing(anim, {
      toValue: height,
      duration: 500,
      delay: index * 40,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    })
    timing.start()
    return () => timing.stop()
  }, [anim, height, index])
  return <Animated.View style={[styles.bar, current && styles.barCurrent, { height: anim }]} />
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

/** Training time per day, week or month, against the plan and the period before. */
export function TrainingActivityCard({
  activity,
  range,
  status,
}: {
  activity: TrainingActivity
  range: Range
  status: "loading" | "error" | "ready"
}) {
  const [picked, setPicked] = useState<string | null>(null)
  useEffect(() => setPicked(null), [range])

  const { bars, planSeconds, previousSeconds, totalSeconds, sessions, weeksOnPlan } = activity
  const max = Math.max(1, planSeconds ?? 0, ...bars.map((bar) => bar.seconds))
  const busiest = bars.reduce((best, bar) => (bar.seconds > best.seconds ? bar : best), bars[0]!)
  const many = bars.length > MAX_LABELLED_BARS
  const compact = range === "Year" || range === "3 mo"
  const selected = bars.find((bar) => bar.key === picked)
  const diff = previousSeconds === null ? null : totalSeconds - previousSeconds

  return (
    <Card>
      <Text accessibilityRole="header" style={styles.title}>
        Training time
      </Text>

      {status === "loading" ? (
        <Text style={styles.note}>Loading training activity…</Text>
      ) : status === "error" ? (
        <Text style={styles.note}>Training data unavailable</Text>
      ) : (
        <>
          <View style={styles.heroRow}>
            <Text style={styles.hero}>{formatTraining(totalSeconds)}</Text>
            {diff !== null ? (
              <Text style={[styles.compare, diff > 0 && styles.compareUp]}>
                {diff === 0
                  ? `Same as ${PREVIOUS[range]}`
                  : `${diff > 0 ? "+" : "-"}${formatTraining(Math.abs(diff))} vs ${PREVIOUS[range]}`}
              </Text>
            ) : null}
          </View>

          <View style={styles.chart}>
            {planSeconds ? (
              <View
                pointerEvents="none"
                style={[styles.planLine, { bottom: 16 + (planSeconds / max) * BAR_HEIGHT }]}
              />
            ) : null}
            {bars.map((bar, index) => {
              const showValue = !many || bar.current || bar.key === busiest.key
              return (
                <Pressable
                  key={bar.key}
                  style={styles.column}
                  accessibilityLabel={`${bar.period}, ${bar.sessions} ${bar.sessions === 1 ? "session" : "sessions"}, ${formatTraining(bar.seconds)}`}
                  accessibilityState={{ selected: picked === bar.key }}
                  onPress={() => setPicked((current) => (current === bar.key ? null : bar.key))}
                >
                  <Text style={[styles.value, !bar.seconds && styles.valueEmpty]} numberOfLines={1}>
                    {showValue ? (bar.seconds ? formatTraining(bar.seconds, compact) : "-") : ""}
                  </Text>
                  <GrowingBar
                    key={`${range}-${bar.key}`}
                    height={Math.max(3, (bar.seconds / max) * BAR_HEIGHT)}
                    index={index}
                    current={bar.current || picked === bar.key}
                  />
                  <Text style={styles.label} numberOfLines={1}>
                    {many && index % 4 !== 0 && !bar.current
                      ? ""
                      : bar.current && range !== "Year"
                        ? "Now"
                        : bar.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.note}>
              {selected
                ? `${selected.period}: ${selected.sessions} ${selected.sessions === 1 ? "session" : "sessions"}, ${formatTraining(selected.seconds)}`
                : "Tap a bar for details."}
            </Text>
            {planSeconds ? (
              <Text style={styles.planLegend}>
                {`Plan ${formatTraining(planSeconds, true)} / ${range === "Year" ? "month" : "week"}`}
              </Text>
            ) : null}
          </View>

          <View style={styles.stats}>
            <Stat value={String(sessions)} label="Sessions" />
            <Stat
              value={sessions ? formatTraining(totalSeconds / sessions) : "-"}
              label="Avg session"
            />
            <Stat
              value={weeksOnPlan.total ? `${weeksOnPlan.met} of ${weeksOnPlan.total}` : "-"}
              label="Weeks on plan"
            />
          </View>
        </>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 15, fontWeight: "600", color: C.text },
  note: { fontSize: 11, color: C.textMuted, flexShrink: 1 },
  heroRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
  },
  hero: { fontSize: 34, fontWeight: "600", color: C.text },
  compare: { fontSize: 12, color: C.textMuted, flexShrink: 1, textAlign: "right" },
  compareUp: { color: C.accent, fontWeight: "600" },
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 6, height: BAR_HEIGHT + 34 },
  planLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderStyle: "dashed",
    borderColor: C.accent,
    opacity: 0.7,
  },
  column: { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 3, minWidth: 0 },
  value: { fontSize: 10, fontWeight: "600", color: C.text, fontVariant: ["tabular-nums"] },
  valueEmpty: { fontWeight: "400", color: C.textMuted },
  bar: { width: "100%", borderRadius: 5, backgroundColor: C.track },
  barCurrent: { backgroundColor: C.accent },
  label: { fontSize: 9, color: C.textMuted, height: 13 },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  planLegend: { fontSize: 11, color: C.accent, fontWeight: "600" },
  stats: { flexDirection: "row", gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: C.previewTint,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    gap: 2,
  },
  statValue: { fontSize: 15, fontWeight: "600", color: C.text },
  statLabel: { fontSize: 10, color: C.textMuted },
})
