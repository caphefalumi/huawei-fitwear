import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { useAuth } from "@/features/auth";
import { dateLabel, useHealth } from "@/features/health/health-store";
import { BackHeader, Card } from "@/features/home/ui";
import { WeightChart } from "@/features/home/weight-chart";
import { apiRequest } from "@/lib/api";
import {
  progressBounds,
  progressData,
  RANGES,
  type Range,
  type WorkoutStats,
} from "@/features/home/progress-data";
import { workoutQueryKeys } from "@/features/workout/workout-store";

export function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    weights,
    plan,
    error,
    refresh,
    loading: healthLoading,
    refreshing: healthRefreshing,
  } = useHealth();
  const [range, setRange] = useState<Range>("Month");
  const bounds = progressBounds(range);
  const statsQuery = useQuery({
    queryKey: [...workoutQueryKeys.progress(user?.id ?? "signed-out"), bounds.from, bounds.to],
    enabled: Boolean(user?.id),
    queryFn: ({ signal }) =>
      apiRequest<WorkoutStats>(`/workouts/stats?from=${bounds.from}&to=${bounds.to}`, { signal }),
  });
  const stats = statsQuery.data ?? null;
  const statsError = statsQuery.error instanceof Error ? statsQuery.error.message : null;
  const statsLoading = statsQuery.isLoading;
  const data = progressData(range, weights, stats);
  const maxSessions = Math.max(1, ...data.bars.map((bar) => bar.sessions));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}
    >
      <BackHeader label="Overview" onPress={() => router.back()} />

      <Text accessibilityRole="header" style={styles.title}>
        Your progress.
      </Text>
      {error ? (
        <Pressable onPress={() => void refresh()}>
          <Text accessibilityRole="alert">
            {weights.length ? `Could not refresh health data. Showing saved data. ${error}` : error}{" "}
            Tap to retry.
          </Text>
        </Pressable>
      ) : null}
      {healthLoading ? <Text style={styles.cardNote}>Loading health data…</Text> : null}
      {healthRefreshing ? <Text style={styles.cardNote}>Updating health data…</Text> : null}

      <View style={styles.segments}>
        {RANGES.map((item) => {
          const active = item === range;
          return (
            <Pressable
              key={item}
              accessibilityLabel={item === "3 mo" ? "Last 3 months" : `Last ${item.toLowerCase()}`}
              accessibilityState={{ selected: active }}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => setRange(item)}
            >
              <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <View style={styles.weightHeader}>
          <Text accessibilityRole="header" style={styles.cardTitle}>
            Weight
          </Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{data.delta}</Text>
          </View>
        </View>

        <Text style={styles.bigValue}>
          {data.weights.length ? `${data.weights[data.weights.length - 1].toFixed(1)} kg` : "—"}
        </Text>

        <WeightChart weights={data.weights} />
        {!healthLoading && !data.weights.length ? (
          <Text style={styles.cardNote}>No weight entries for this period yet.</Text>
        ) : null}

        <View style={styles.dates}>
          {data.dates.map((date) => (
            <Text key={date} style={styles.dateLabel}>
              {dateLabel(date)}
            </Text>
          ))}
        </View>

        <Text style={styles.cardNote}>
          {plan.targetWeightKg === null
            ? "Set a target weight in Profile."
            : `Goal ${plan.targetWeightKg.toFixed(1)} kg`}
        </Text>
      </Card>

      <Card>
        <View style={styles.weightHeader}>
          <Text accessibilityRole="header" style={styles.cardTitle}>
            Training activity
          </Text>
          <Text style={styles.cardNote}>{!statsLoading ? data.sessionsNote : ""}</Text>
        </View>
        {statsError ? (
          <Pressable onPress={() => void statsQuery.refetch()}>
            <Text accessibilityRole="alert">
              {stats
                ? `Could not refresh training activity. Showing saved data. ${statsError} Tap to retry.`
                : `${statsError} Tap to retry.`}
            </Text>
          </Pressable>
        ) : null}
        {statsLoading ? <Text style={styles.cardNote}>Loading training activity…</Text> : null}
        {statsQuery.isFetching && !statsLoading ? (
          <Text style={styles.cardNote}>Updating training activity…</Text>
        ) : null}
        {stats?.completedSessionCount ? (
          <View style={styles.bars}>
            {data.bars.map((week) => (
              <View
                accessible
                accessibilityLabel={`Period starting ${week.label}: ${week.sessions} completed sessions`}
                key={week.label}
                style={styles.barColumn}
              >
                <View
                  style={[
                    styles.bar,
                    { height: week.sessions ? 12 + (week.sessions / maxSessions) * 48 : 2 },
                  ]}
                />
                <Text accessible={false} style={styles.dateLabel}>
                  {week.label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        {stats && stats.completedSessionCount === 0 ? (
          <Text style={styles.cardNote}>No completed workouts in this period yet.</Text>
        ) : null}

        <View style={styles.durationRow}>
          <Text style={styles.bigValue}>{data.duration}</Text>
          <Text style={styles.cardNote}>{data.durationNote}</Text>
        </View>

        <Text style={styles.cardNote}>
          Logged sessions and total workout time. Weighted exercises are tracked separately in your
          workout history.
        </Text>
      </Card>

      <Card>
        <Text accessibilityRole="header" style={styles.cardTitle}>
          Body composition
        </Text>
        <Text style={styles.cardNote}>
          No body-composition measurements are available. Weight logs do not measure body fat or
          muscle mass.
        </Text>
      </Card>

      <Card>
        <Text accessibilityRole="header" style={styles.cardTitle}>
          Accuracy &amp; personalization
        </Text>
        <Text style={styles.cardNote}>
          Basic body info gives you a starting nutrition estimate. Adding daily activity and goals
          helps personalize your plan. More details live in Profile.
        </Text>
        <Pressable onPress={() => router.push("/profile")} hitSlop={8}>
          <Text style={styles.link}>Profile</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
  },
  segments: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flexGrow: 1,
    flexBasis: 60,
    minHeight: 48,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: C.surface,
  },
  segmentLabel: {
    fontSize: 12,
    textAlign: "center",
    color: C.textMuted,
  },
  segmentLabelActive: {
    fontWeight: "600",
    color: C.accent,
  },
  weightHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    flexShrink: 1,
    fontWeight: "600",
    color: C.text,
  },
  pill: {
    backgroundColor: C.accentTint,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
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
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  dateLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  cardNote: {
    fontSize: 11,
    color: C.textMuted,
    flexShrink: 1,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  bar: {
    width: "100%",
    borderRadius: 6,
    backgroundColor: C.accentTint,
    borderWidth: 1,
    borderColor: C.border,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 8,
  },
  link: {
    fontSize: 12,
    fontWeight: "600",
    color: C.accent,
  },
});
