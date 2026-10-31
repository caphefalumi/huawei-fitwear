import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { Palette as C } from '@/constants/palette';

const APolyline = Animated.createAnimatedComponent(Polyline);
const ACircle = Animated.createAnimatedComponent(Circle);

const CHART_HEIGHT = 124;
const GRID_INSET = 12;
const PLOT_HEIGHT = CHART_HEIGHT - GRID_INSET * 2;
const X_PADDING = 8;

/** Weight line over three gridlines; the y-axis rounds to whole kilograms around the data. */
export function WeightChart({ weights }: { weights: number[] }) {
  const [width, setWidth] = useState(0);
  const draw = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = Animated.timing(draw, { toValue: 1, duration: 900, useNativeDriver: false });
    t.start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => {
      t.stop();
      loop.stop();
    };
  }, [draw, pulse]);

  const dashOffset = draw.interpolate({ inputRange: [0, 1], outputRange: [800, 0] });
  const pulseR = pulse.interpolate({ inputRange: [0, 1], outputRange: [5, 12] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  const top = Math.ceil(Math.max(...weights));
  const bottom = Math.min(Math.floor(Math.min(...weights)), top - 1);
  const axis = [top, (top + bottom) / 2, bottom];

  const points = weights.map((weight, index) => ({
    x: X_PADDING + (index * (width - X_PADDING * 2)) / Math.max(1, weights.length - 1),
    y: GRID_INSET + ((top - weight) / (top - bottom)) * PLOT_HEIGHT,
  }));
  const last = points[points.length - 1];

  return (
    <View style={styles.row}>
      <View
        style={styles.chart}
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}>
        <View style={styles.grid}>
          {axis.map((value) => (
            <View key={value} style={styles.gridLine} />
          ))}
        </View>
        {width > 0 ? (
          <Svg width={width} height={CHART_HEIGHT} style={StyleSheet.absoluteFill}>
            <APolyline
              points={points.map((point) => `${point.x},${point.y}`).join(' ')}
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
            <ACircle cx={last.x} cy={last.y} r={pulseR} fill={C.accentBorder} opacity={pulseOpacity} />
            <Circle cx={last.x} cy={last.y} r={5} fill={C.accentBorder} stroke={C.surface} strokeWidth={2} />
          </Svg>
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
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
  },
  chart: {
    flex: 1,
    height: CHART_HEIGHT,
  },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: GRID_INSET,
    bottom: GRID_INSET,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: C.border,
  },
  axis: {
    width: 30,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: GRID_INSET - 6,
  },
  axisLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
});
