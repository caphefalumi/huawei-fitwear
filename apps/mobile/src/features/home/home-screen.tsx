import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CloseButton } from "@/components/close-button";
import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { dateLabel, recoveryTitle, useHealth } from "@/features/health/health-store";
import { useAuth } from "@/features/auth/auth-store";
import { useWorkouts } from "@/features/workout/workout-store";
import { WeightChart } from "@/features/home/weight-chart";
import { RecoverySheet } from "@/features/recovery/recovery-sheet";
import { RecoveryTracker } from "@/features/recovery/recovery-stages";
import { useMeals } from "@/features/meals/meals-store";
import { NutritionRing } from "@/features/home/ring";
import { Card, MacroBar, SectionHeading } from "@/features/home/ui";
import { FetchErrorState } from "@/components/fetch-states";

const icons = {
  check: require("@/assets/images/home/check.svg"),
};

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    weightKg,
    weights,
    weightUpdated,
    recovery,
    error: healthError,
    refreshing: healthRefreshing,
    refresh: refreshHealth,
  } = useHealth();
  const {
    summary,
    error: mealsError,
    refreshing: mealsRefreshing,
    actionError: mealsActionError,
    retryAction: retryMealAction,
    refresh: refreshMeals,
  } = useMeals();
  const {
    sessions,
    loading: workoutsLoading,
    error: workoutsError,
    refreshing: workoutsRefreshing,
    actionError: workoutActionError,
    retryAction: retryWorkoutAction,
    refresh: refreshWorkouts,
  } = useWorkouts();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [chartInfoOpen, setChartInfoOpen] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryClosing, setRecoveryClosing] = useState(false);
  useEffect(() => setBannerDismissed(false), [weightKg]);
  const latest = weights.at(-1);
  const previous = weights.at(-2);
  const completed = sessions.filter((session) => session.completedAt).slice(0, 3);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={healthRefreshing || mealsRefreshing || workoutsRefreshing}
          onRefresh={() => void Promise.all([refreshHealth(), refreshMeals(), refreshWorkouts()])}
          tintColor={C.accent}
          colors={[C.accent]}
        />
      }
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.date}>
          {new Date()
            .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
            .toUpperCase()}
        </Text>
        <Text style={styles.name}>{user?.name}</Text>
      </View>

      <Text accessibilityRole="header" style={styles.title}>
        Today
      </Text>
      {healthError ? (
        <FetchErrorState
          title={weights.length ? "Couldn't refresh health data" : "Couldn't load health data"}
          message={healthError}
          onRetry={refreshHealth}
        />
      ) : null}
      {mealsError ? (
        <FetchErrorState
          title={summary ? "Couldn't refresh nutrition" : "Couldn't load nutrition"}
          message={mealsError}
          onRetry={refreshMeals}
        />
      ) : null}
      {mealsActionError ? (
        <FetchErrorState
          title="Couldn't save your meal"
          message={mealsActionError}
          onRetry={retryMealAction}
        />
      ) : null}

      {weightUpdated && !bannerDismissed ? (
        <View style={styles.banner}>
          <Image
            accessible={false}
            source={icons.check}
            style={styles.bannerIcon}
            contentFit="contain"
          />
          <Text style={styles.bannerText}>Weight saved</Text>
          <CloseButton
            label="Dismiss weight saved notification"
            onPress={() => setBannerDismissed(true)}
            size={28}
            background={C.surface}
          />
        </View>
      ) : null}

      <Pressable
        accessibilityLabel={
          summary
            ? `Nutrition. ${summary.consumed.caloriesKcal} kilocalories consumed, ${summary.remaining.caloriesKcal} remaining of ${summary.targets.calorieTargetKcal}. Protein ${summary.consumed.proteinG} of ${summary.targets.proteinTargetG} grams. Carbs ${summary.consumed.carbsG} of ${summary.targets.carbsTargetG} grams. Fat ${summary.consumed.fatG} of ${summary.targets.fatTargetG} grams.`
            : "Nutrition. Summary is not available."
        }
        accessibilityHint="Opens your nutrition details"
        onPress={() => router.push("/nutrition")}
      >
        <Card>
          <Text style={styles.cardHeaderText}>Nutrition</Text>

          {summary ? (
            <>
              <View style={styles.nutritionBody}>
                <NutritionRing
                  kcalLeft={summary.remaining.caloriesKcal}
                  targetKcal={summary.targets.calorieTargetKcal}
                  consumedKcal={summary.consumed.caloriesKcal}
                />
                <View style={styles.macros}>
                  <MacroBar
                    label="Protein"
                    value={summary.consumed.proteinG}
                    target={summary.targets.proteinTargetG}
                    unit="g"
                  />
                  <MacroBar
                    label="Carbs"
                    value={summary.consumed.carbsG}
                    target={summary.targets.carbsTargetG}
                    unit="g"
                  />
                  <MacroBar
                    label="Fat"
                    value={summary.consumed.fatG}
                    target={summary.targets.fatTargetG}
                    unit="g"
                  />
                </View>
              </View>
              <Text style={styles.consumedLine}>
                {summary.consumed.caloriesKcal.toLocaleString()} of{" "}
                {summary.targets.calorieTargetKcal.toLocaleString()} kcal
              </Text>
            </>
          ) : (
            <Text style={styles.weightSub}>Your nutrition summary will appear after it loads.</Text>
          )}
        </Card>
      </Pressable>

      <View style={styles.section}>
        <SectionHeading title="Progress" />
        <Pressable
          accessibilityLabel={`Progress. ${latest ? `Latest weight ${latest.weightKg.toFixed(1)} kilograms, logged ${dateLabel(latest.loggedDate)}.` : "No weight logs yet."}${previous ? ` Previous weight ${previous.weightKg.toFixed(1)} kilograms, logged ${dateLabel(previous.loggedDate)}.` : ""}`}
          accessibilityHint="Opens weight and training progress"
          onPress={() => router.push("/progress")}
        >
          <Card>
            <View style={styles.weightRow}>
              <View style={styles.weightText}>
                <Text style={styles.weightLabel}>Latest weight</Text>
                <View style={styles.weightValueRow}>
                  <Text style={styles.weightValue}>{weightKg?.toFixed(1) ?? "—"}</Text>
                  <Text style={styles.weightUnit}>kg</Text>
                </View>
                <Text style={styles.weightSub}>
                  {latest ? `Logged ${dateLabel(latest.loggedDate)}` : "No weight logs yet"}
                </Text>
              </View>
              {weights.length >= 2 ? (
                <View style={{ flex: 1, minWidth: 120 }}>
                  <WeightChart weights={weights.slice(-14).map((row) => row.weightKg)} />
                </View>
              ) : (
                <Pressable
                  accessibilityLabel="About the weight chart"
                  onPress={() => setChartInfoOpen((open) => !open)}
                  hitSlop={10}
                  style={styles.infoButton}
                >
                  <Text style={styles.infoGlyph}>i</Text>
                </Pressable>
              )}
            </View>
            {weights.length < 2 && chartInfoOpen ? (
              <Text accessibilityRole="alert" style={styles.weightSub}>
                Chart appears after 2 weight logs.
              </Text>
            ) : null}

            {previous ? (
              <View style={styles.previousRow}>
                <Text style={styles.previousText}>Previous · {dateLabel(previous.loggedDate)}</Text>
                <Text style={styles.previousValue}>{previous.weightKg.toFixed(1)} kg</Text>
              </View>
            ) : null}
          </Card>
        </Pressable>
      </View>
      <View style={styles.section}>
        <SectionHeading
          title="Workouts"
          actionLabel="Plan"
          onPress={() => router.push("/workout")}
        />
        <Card>
          {workoutsError ? (
            <FetchErrorState
              title={sessions.length ? "Couldn't refresh workouts" : "Couldn't load workouts"}
              message={workoutsError}
              onRetry={refreshWorkouts}
            />
          ) : null}
          {workoutActionError ? (
            <FetchErrorState
              title="Couldn't save your workout"
              message={workoutActionError}
              onRetry={retryWorkoutAction}
            />
          ) : null}
          {completed.map((session) => (
            <View key={session.id}>
              <Text style={styles.cardHeaderText}>{session.sessionTitle}</Text>
              <Text style={styles.weightSub}>
                Completed {new Date(session.completedAt!).toLocaleDateString()}
              </Text>
            </View>
          ))}
          {!workoutsLoading && !completed.length ? (
            <Text style={styles.weightSub}>
              No completed workouts yet. Open your plan to start a session.
            </Text>
          ) : null}
        </Card>
      </View>

      {recovery ? (
        <RecoveryTracker
          recovery={recovery}
          label={`Recovery. ${recoveryTitle(recovery)}. ${recovery.restDays} rest days, ${recovery.lightDays} light days.`}
          onPress={() => setRecoveryOpen(true)}
        />
      ) : null}

      {recoveryOpen || recoveryClosing ? (
        <RecoverySheet
          visible={recoveryOpen}
          onClose={() => {
            setRecoveryClosing(true);
            setRecoveryOpen(false);
          }}
          onDismiss={() => setRecoveryClosing(false)}
        />
      ) : null}

      <Text style={styles.footnote}>Personal targets are estimates, not medical advice.</Text>
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
  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: C.textMuted,
  },
  name: {
    fontSize: 13,
    flexShrink: 1,
    fontWeight: "600",
    color: C.accent,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
    marginTop: -6,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.accentTint,
    borderRadius: 12,
    minHeight: 48,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
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
  infoButton: {
    width: 24,
    height: 24,
    minWidth: 0,
    minHeight: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  infoGlyph: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 14,
    includeFontPadding: false,
    color: C.textMuted,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  nutritionBody: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 20,
  },
  macros: {
    flex: 1,
    minWidth: 120,
    gap: 10,
  },
  consumedLine: {
    fontSize: 11,
    color: C.textMuted,
  },
  section: {
    gap: 10,
  },
  weightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  weightText: {
    gap: 2,
    flexShrink: 1,
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
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
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
  footnote: {
    fontSize: 10,
    color: C.textMuted,
    textAlign: "center",
  },
});
