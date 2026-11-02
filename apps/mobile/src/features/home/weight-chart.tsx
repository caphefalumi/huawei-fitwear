import { useState } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";

import { Palette as C } from "@/constants/palette";

const CHART_HEIGHT = 124;
const GRID_INSET = 12;
const PLOT_HEIGHT = CHART_HEIGHT - GRID_INSET * 2;
const X_PADDING = 8;

/** Weight line over three gridlines; the y-axis rounds to whole kilograms around the data. */
export function WeightChart({ weights }: { weights: number[] }) {
  const [width, setWidth] = useState(0);
  if (!weights.length) return <Text style={styles.axisLabel}>No weight logs in this period.</Text>;

  const maximum = Math.max(...weights);
  const minimum = Math.min(...weights);
  const top = Math.ceil(maximum);
  const bottom = Math.min(Math.floor(minimum), top - 1);
  const axis = [top, (top + bottom) / 2, bottom];

  const points = weights.map((weight, index) => ({
    x: X_PADDING + (index * (width - X_PADDING * 2)) / Math.max(1, weights.length - 1),
    y: GRID_INSET + ((top - weight) / (top - bottom)) * PLOT_HEIGHT,
  }));
  const last = points[points.length - 1];

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Weight chart, ${weights.length} ${weights.length === 1 ? "log" : "logs"} in chronological order. First ${weights[0].toFixed(1)} kilograms, latest ${weights[weights.length - 1].toFixed(1)} kilograms. Lowest ${minimum.toFixed(1)}, highest ${maximum.toFixed(1)} kilograms.`}
      style={styles.row}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.chart}
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      >
        <View style={styles.grid}>
          {axis.map((value) => (
            <View key={value} style={styles.gridLine} />
          ))}
        </View>
        {width > 0 ? (
          <Svg width={width} height={CHART_HEIGHT} style={StyleSheet.absoluteFill}>
            <Polyline
              points={points.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke={C.accent}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.slice(0, -1).map((point) => (
              <Circle key={`${point.x}`} cx={point.x} cy={point.y} r={3} fill={C.accentBorder} />
            ))}
            <Circle
              cx={last.x}
              cy={last.y}
              r={5}
              fill={C.accentBorder}
              stroke={C.surface}
              strokeWidth={2}
            />
          </Svg>
        ) : null}
      </View>

      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.axis}
      >
        {axis.map((value) => (
          <Text key={value} style={styles.axisLabel}>
            {value.toFixed(1)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 6,
  },
  chart: {
    flex: 1,
    height: CHART_HEIGHT,
  },
  grid: {
    position: "absolute",
    left: 0,
    right: 0,
    top: GRID_INSET,
    bottom: GRID_INSET,
    justifyContent: "space-between",
  },
  gridLine: {
    height: 1,
    backgroundColor: C.border,
  },
  axis: {
    minWidth: 30,
    minHeight: CHART_HEIGHT,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: GRID_INSET - 6,
  },
  axisLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
});
