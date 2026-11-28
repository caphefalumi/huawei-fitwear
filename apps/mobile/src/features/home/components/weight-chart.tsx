import { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native"
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg"

import { Palette as C } from "@/theme"

const APolyline = Animated.createAnimatedComponent(Polyline)
const ACircle = Animated.createAnimatedComponent(Circle)

const CHART_HEIGHT = 124
const GRID_INSET = 12
const PLOT_HEIGHT = CHART_HEIGHT - GRID_INSET * 2
const X_PADDING = 8
/** A goal this close to the logged weights is drawn on the chart; a farther one is pinned to the edge. */
const GOAL_REACH_KG = 5

/**
 * Weight line over three gridlines; the y-axis rounds to whole kilograms around the data, and
 * stretches to include the goal when it is near enough.
 */
export function WeightChart({
  weights,
  goalKg = null,
}: {
  weights: number[]
  goalKg?: number | null
}) {
  const [width, setWidth] = useState(0)
  const draw = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const t = Animated.timing(draw, { toValue: 1, duration: 900, useNativeDriver: false })
    t.start()
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]),
    )
    loop.start()
    return () => {
      t.stop()
      loop.stop()
    }
  }, [draw, pulse])

  if (weights.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyLabel}>No weight logs yet</Text>
      </View>
    )
  }

  const dashOffset = draw.interpolate({ inputRange: [0, 1], outputRange: [800, 0] })
  const pulseR = pulse.interpolate({ inputRange: [0, 1], outputRange: [5, 12] })
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] })

  const high = Math.max(...weights)
  const low = Math.min(...weights)
  const goalInside =
    goalKg !== null && goalKg <= high + GOAL_REACH_KG && goalKg >= low - GOAL_REACH_KG
  const top = Math.ceil(goalInside ? Math.max(high, goalKg) : high)
  const bottom = Math.min(Math.floor(goalInside ? Math.min(low, goalKg) : low), top - 1)
  const goalY = goalInside ? GRID_INSET + ((top - goalKg) / (top - bottom)) * PLOT_HEIGHT : null
  const axis = [top, (top + bottom) / 2, bottom]

  const points = weights.map((weight, index) => ({
    x: X_PADDING + (index * (width - X_PADDING * 2)) / Math.max(1, weights.length - 1),
    y: GRID_INSET + ((top - weight) / (top - bottom)) * PLOT_HEIGHT,
  }))
  const last = points[points.length - 1]

  return (
    <View style={styles.row}>
      <View
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
            {goalY !== null ? (
              <>
                <Line
                  x1={0}
                  x2={width}
                  y1={goalY}
                  y2={goalY}
                  stroke={C.accent}
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />
                <SvgText
                  x={width - 2}
                  y={goalY < GRID_INSET + 14 ? goalY + 13 : goalY - 5}
                  textAnchor="end"
                  fontSize={10}
                  fontWeight="600"
                  fill={C.accent}
                >
                  {`Goal ${goalKg!.toFixed(1)}`}
                </SvgText>
              </>
            ) : null}
            <APolyline
              points={points.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke={C.accent}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="800"
              strokeDashoffset={dashOffset}
            />
            {points.slice(0, -1).map((point) => (
              <Circle key={`${point.x}`} cx={point.x} cy={point.y} r={3} fill={C.accentBorder} />
            ))}
            <ACircle
              cx={last.x}
              cy={last.y}
              r={pulseR}
              fill={C.accentBorder}
              opacity={pulseOpacity}
            />
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
        {goalKg !== null && !goalInside ? (
          <Text style={[styles.goalPinned, goalKg > high ? styles.goalTop : styles.goalBottom]}>
            {`Goal ${goalKg.toFixed(1)} ${goalKg > high ? "↑" : "↓"}`}
          </Text>
        ) : null}
      </View>

      <View style={styles.axis}>
        {axis.map((value) => (
          <Text key={value} style={styles.axisLabel}>
            {value.toFixed(1)}
          </Text>
        ))}
      </View>
    </View>
  )
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
  empty: {
    flex: 1,
    height: CHART_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  goalPinned: {
    position: "absolute",
    right: 2,
    fontSize: 10,
    fontWeight: "600",
    color: C.accent,
  },
  goalTop: { top: 0 },
  goalBottom: { bottom: 0 },
  emptyLabel: {
    fontSize: 11,
    color: C.textMuted,
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
    width: 30,
    height: CHART_HEIGHT,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: GRID_INSET - 6,
  },
  axisLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
})
