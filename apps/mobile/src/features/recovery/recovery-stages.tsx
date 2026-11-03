import { StyleSheet, Text, View } from "react-native";

import { Palette as C } from "@/constants/palette";
import { recoveryProgress, type RecoveryPlan } from "@/features/health/health-store";

const STAGES = ["Rest", "Rehab", "Return"];

/** Three stages: white while empty, red once complete (partly filled while in progress). */
export function RecoveryStages({ recovery }: { recovery: RecoveryPlan }) {
  const progress = recoveryProgress(recovery);
  const current = progress.findIndex((fill) => fill < 1);
  const label = current === -1 ? "All stages complete" : `${STAGES[current]} stage in progress`;
  return (
    <View accessible accessibilityLabel={`Recovery progress. ${label}`} style={styles.row}>
      {STAGES.map((name, index) => (
        <View key={name} style={styles.stage}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress[index] * 100}%` }]} />
          </View>
          <Text style={styles.label}>{name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
  },
  stage: {
    flex: 1,
    gap: 4,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.surface,
    overflow: "hidden",
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  label: {
    fontSize: 10,
    color: C.textMuted,
  },
});
