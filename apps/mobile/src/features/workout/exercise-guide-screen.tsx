import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReducedMotion } from "react-native-reanimated";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { useHealth } from "@/features/health/health-store";
import { BackHeader, Card } from "@/features/home/ui";
import { WorkoutSessionPanel } from "@/features/workout/workout-session-panel";
import { useWorkouts } from "@/features/workout/workout-store";

export function ExerciseGuideScreen() {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const { name, group, sessionId } = useLocalSearchParams<{
    name?: string;
    group?: string;
    sessionId?: string;
  }>();
  const { recovery } = useHealth();
  const { exercises, loading, error, refresh } = useWorkouts();
  const guide = exercises.find((exercise) => exercise.id === name);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}
    >
      <BackHeader label="Workout plan" onPress={() => router.back()} />
      {!guide ? (
        <>
          <Text accessibilityRole="header" style={styles.title}>
            {loading ? "Loading exercise…" : "Exercise unavailable"}
          </Text>
          <Text accessibilityRole={error ? "alert" : undefined} style={styles.subtitle}>
            {error ??
              (loading
                ? "Loading the exercise catalog."
                : "Return to the workout plan and choose an available exercise.")}
          </Text>
          <Pressable
            disabled={loading}
            accessibilityState={{ busy: loading }}
            onPress={() => void refresh()}
          >
            <Text style={styles.cueTitle}>Retry loading exercises</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={styles.title}>
              {guide.name}
            </Text>
            <Text style={styles.subtitle}>
              {guide.muscleGroup} · {guide.equipment} · Technique guide
            </Text>
          </View>
          {guide.cadenceAnimationUrl ? (
            <View style={styles.demoWrap}>
              <Image
                accessible
                accessibilityLabel={`${guide.name} technique demonstration`}
                autoplay={!reducedMotion}
                source={{ uri: guide.cadenceAnimationUrl }}
                style={styles.demo}
                contentFit="contain"
              />
            </View>
          ) : null}
          <Card style={styles.prescriptionCard}>
            <View style={styles.prescriptionRow}>
              <View style={styles.prescription}>
                <Text style={styles.prescriptionValue}>{guide.defaultSets}</Text>
                <Text style={styles.prescriptionLabel}>planned sets</Text>
              </View>
              <View style={styles.prescription}>
                <Text style={styles.prescriptionValue}>{guide.defaultReps}</Text>
                <Text style={styles.prescriptionLabel}>target {guide.repetitionUnit}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>
              General exercise guidance, not a saved personal load.
            </Text>
          </Card>
          <View style={styles.cues}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Technique cues
            </Text>
            {guide.cues.map((cue, index) => (
              <View key={cue.title} style={styles.cue}>
                <View style={styles.cueMarker}>
                  <Text style={styles.cueMarkerLabel}>{index + 1}</Text>
                </View>
                <View style={styles.cueCopy}>
                  <Text accessibilityRole="header" style={styles.cueTitle}>
                    {cue.title}
                  </Text>
                  <Text style={styles.cueDetail}>{cue.detail}</Text>
                </View>
              </View>
            ))}
            {!guide.cues.length ? (
              <Text style={styles.subtitle}>
                No technique cues are available for this exercise.
              </Text>
            ) : null}
          </View>
          <WorkoutSessionPanel
            key={`${name}-${sessionId ?? ""}`}
            title={group ?? guide.muscleGroup}
            split={group ?? guide.muscleGroup}
            exercises={[guide]}
            sessionId={sessionId}
            recovery={Boolean(recovery)}
          />
        </>
      )}
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
    gap: 14,
  },
  heading: {
    gap: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  demoWrap: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: C.card,
  },
  demo: {
    width: "100%",
    aspectRatio: 354 / 160,
  },
  prescriptionCard: {
    padding: 14,
    gap: 12,
  },
  prescriptionRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  prescription: {
    flex: 1,
    minWidth: 120,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 5,
  },
  prescriptionValue: {
    fontSize: 16,
    color: C.text,
  },
  prescriptionLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  cues: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
  },
  cue: {
    flexDirection: "row",
    gap: 10,
  },
  cueMarker: {
    minWidth: 24,
    minHeight: 24,
    padding: 4,
    alignSelf: "flex-start",
    borderRadius: 100,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },
  cueMarkerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.text,
  },
  cueCopy: {
    flex: 1,
    gap: 3,
  },
  cueTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  cueDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
  },
});
