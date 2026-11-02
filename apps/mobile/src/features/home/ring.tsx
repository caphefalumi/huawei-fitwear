import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Palette as C } from "@/constants/palette";

const SIZE = 112;
const RADIUS = 49;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function NutritionRing({
  kcalLeft,
  targetKcal,
  consumedKcal,
}: {
  kcalLeft: number;
  targetKcal: number;
  consumedKcal: number;
}) {
  const { fontScale } = useWindowDimensions();
  const progress = targetKcal > 0 ? Math.max(0, Math.min(1, consumedKcal / targetKcal)) : 0;
  return (
    <View
      accessible
      accessibilityRole="image"
      style={styles.ring}
      accessibilityLabel={`${Math.round(kcalLeft)} kilocalories remaining. ${Math.round(consumedKcal)} consumed of ${Math.round(targetKcal)} kilocalories daily target.`}
    >
      <Svg accessible={false} width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={C.border}
          strokeWidth={10}
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={C.accent}
          strokeWidth={10}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          strokeLinecap="round"
        />
      </Svg>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.center, fontScale > 1.3 && styles.centerStacked]}
      >
        <Text style={styles.value}>{Math.round(kcalLeft)}</Text>
        <Text style={styles.label}>kcal left</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { minWidth: SIZE, maxWidth: "100%", minHeight: SIZE, alignItems: "center" },
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerStacked: {
    position: "relative",
    alignSelf: "stretch",
    paddingTop: 8,
  },
  value: { fontSize: 18, fontWeight: "700", color: C.text },
  label: { fontSize: 9, color: C.textMuted },
});
