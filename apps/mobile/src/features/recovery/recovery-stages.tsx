import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { recoveryProgress, type RecoveryPlan } from "@/features/health/health-store";

const STAGES = ["Rest", "Rehab", "Return"];

/** Short day and month, e.g. "8 Nov", for the day a stage begins. */
function stageDate(recovery: RecoveryPlan, offset: number) {
  const date = new Date(`${recovery.startDate}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** "Recovery" heading over three checkpoints: white while pending, primary red once reached. */
export function RecoveryTracker({
  recovery,
  label,
  onPress,
}: {
  recovery: RecoveryPlan;
  label: string;
  onPress: () => void;
}) {
  const reached = recoveryProgress(recovery).map((fill) => fill >= 1);
  const offsets = [0, recovery.restDays, recovery.restDays + recovery.lightDays];
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityHint="Opens recovery details"
      style={styles.tracker}
      onPress={onPress}
    >
      <Text style={styles.title}>Recovery</Text>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.graph}
      >
        <View style={styles.row}>
          {STAGES.map((stage, index) => (
            <Fragment key={stage}>
              {index > 0 ? (
                <View style={[styles.line, reached[index - 1] && styles.lineReached]} />
              ) : null}
              <View style={[styles.circle, reached[index] && styles.circleReached]} />
            </Fragment>
          ))}
        </View>
        <View style={styles.row}>
          {STAGES.map((stage, index) => (
            <View
              key={stage}
              style={[
                styles.caption,
                index === 1 && styles.captionMiddle,
                index === 2 && styles.captionEnd,
              ]}
            >
              <Text style={styles.stage}>{stage}</Text>
              <Text style={styles.date}>{stageDate(recovery, offsets[index])}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tracker: {
    gap: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
  },
  graph: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.accent,
    backgroundColor: C.surface,
  },
  circleReached: {
    backgroundColor: C.accent,
  },
  line: {
    flex: 1,
    height: 2,
    marginTop: 10,
    backgroundColor: C.border,
  },
  lineReached: {
    backgroundColor: C.accent,
  },
  caption: {
    flex: 1,
    alignItems: "flex-start",
    gap: 2,
  },
  captionMiddle: {
    alignItems: "center",
  },
  captionEnd: {
    alignItems: "flex-end",
  },
  stage: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
  },
  date: {
    fontSize: 11,
    color: C.textMuted,
  },
});
