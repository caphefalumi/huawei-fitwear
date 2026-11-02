import { StyleSheet, Text, View } from "react-native";
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
  const progress = targetKcal > 0 ? Math.max(0, Math.min(1, consumedKcal / targetKcal)) : 0;
  return (
    <View style={styles.ring} accessibilityLabel={`${Math.round(kcalLeft)} kilocalories remaining`}>
      <Svg width={SIZE} height={SIZE}>
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
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.value}>{Math.round(kcalLeft)}</Text>
        <Text style={styles.label}>kcal left</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { width: SIZE, height: SIZE },
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  value: { fontSize: 18, fontWeight: "700", color: C.text },
  label: { fontSize: 9, color: C.textMuted },
});
