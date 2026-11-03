import { StyleSheet, Text, View } from "react-native";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { recoveryProgress, type RecoveryPlan } from "@/features/health/health-store";

const STAGES = ["Rest", "Rehab", "Return"];

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
        style={styles.row}
      >
        {STAGES.map((stage, index) => (
          <View key={stage} style={styles.step}>
            {index > 0 ? (
              <View style={[styles.line, reached[index - 1] && styles.lineReached]} />
            ) : null}
            <View style={[styles.circle, reached[index] && styles.circleReached]} />
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tracker: {
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  step: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
    backgroundColor: C.border,
  },
  lineReached: {
    backgroundColor: C.accent,
  },
});
