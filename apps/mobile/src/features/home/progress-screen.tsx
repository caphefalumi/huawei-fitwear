import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { BackHeader, Card } from '@/features/home/ui';

const icons = {
  weightLine: require('@/assets/images/progress/weight-line.svg'),
  weightDot: require('@/assets/images/progress/weight-dot.svg'),
  weightDotLatest: require('@/assets/images/progress/weight-dot-latest.svg'),
};

const RANGES = ['Week', 'Month', '3 mo', 'Year'] as const;

const WEEKS = [
  { label: 'Sep 17', sessions: 3 },
  { label: 'Sep 24', sessions: 4 },
  { label: 'Oct 1', sessions: 3 },
  { label: 'Oct 8', sessions: 2 },
];

/** Line geometry taken from the Figma export (weight-line.svg viewBox + vertices). */
const LINE_VIEWBOX = { width: 268.5, height: 52.4478 };
const LINE_POINTS = [
  { x: 0.2948, y: 1.2147 },
  { x: 89.2948, y: 22.8147 },
  { x: 134.295, y: 29.6147 },
  { x: 179.295, y: 36.4147 },
  { x: 268.295, y: 51.2147 },
];

const percent = (value: number, total: number): `${number}%` => `${(value / total) * 100}%`;

export function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { weightKg } = useHealth();
  const [range, setRange] = useState<(typeof RANGES)[number]>('Month');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <BackHeader label="Overview" onPress={() => router.back()} />

      <Text style={styles.title}>Your progress.</Text>

      <View style={styles.segments}>
        {RANGES.map((item) => {
          const active = item === range;
          return (
            <Pressable
              key={item}
              style={[styles.segment, active && styles.segmentActive]}
              onPress={() => setRange(item)}>
              <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <View style={styles.weightHeader}>
          <Text style={styles.cardTitle}>Weight</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>−1.2 kg</Text>
          </View>
        </View>

        <Text style={styles.bigValue}>{weightKg.toFixed(1)} kg</Text>

        <View style={styles.chartRow}>
          <View style={styles.chart}>
            <View style={styles.grid}>
              {[0, 1, 2].map((line) => (
                <View key={line} style={styles.gridLine} />
              ))}
            </View>

            <View style={styles.plotWrap}>
              <View style={styles.plot}>
                <Image source={icons.weightLine} style={styles.plotLine} contentFit="fill" />
                {LINE_POINTS.map((point, index) => (
                  <Image
                    key={`${point.x}-${point.y}`}
                    source={
                      index === LINE_POINTS.length - 1 ? icons.weightDotLatest : icons.weightDot
                    }
                    style={[
                      styles.dot,
                      {
                        left: percent(point.x, LINE_VIEWBOX.width),
                        top: percent(point.y, LINE_VIEWBOX.height),
                      },
                    ]}
                    contentFit="contain"
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.axis}>
            <Text style={styles.axisLabel}>73.5</Text>
            <Text style={styles.axisLabel}>72.5</Text>
            <Text style={styles.axisLabel}>71.5</Text>
          </View>
        </View>

        <View style={styles.dates}>
          {['Sep 17', 'Sep 24', 'Oct 1', 'Oct 7'].map((date) => (
            <Text key={date} style={styles.dateLabel}>
              {date}
            </Text>
          ))}
        </View>

        <Text style={styles.cardNote}>Goal 70.0 kg · Updated Oct 7</Text>
      </Card>

      <Card>
        <View style={styles.weightHeader}>
          <Text style={styles.cardTitle}>Training activity</Text>
          <Text style={styles.cardNote}>12 sessions · last 4 weeks</Text>
        </View>

        <View style={styles.bars}>
          {WEEKS.map((week) => (
            <View key={week.label} style={styles.barColumn}>
              <View style={[styles.bar, { height: 12 + week.sessions * 12 }]} />
              <Text style={styles.dateLabel}>{week.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.durationRow}>
          <Text style={styles.bigValue}>2h 18m</Text>
          <Text style={styles.cardNote}>total duration · this week</Text>
        </View>

        <Text style={styles.cardNote}>
          Logged sessions and total workout time. Weighted exercises are tracked separately in
          your workout history.
        </Text>
      </Card>

      <Card>
        <View style={styles.weightHeader}>
          <Text style={styles.cardTitle}>Body composition</Text>
          <Text style={styles.cardNote}>Oct 7</Text>
        </View>

        <View style={styles.compositionRow}>
          <View style={styles.compositionItem}>
            <Text style={styles.compositionValue}>19.4%</Text>
            <Text style={styles.compositionLabel}>Body fat</Text>
            <Text style={styles.compositionDelta}>−0.6 pp / month</Text>
          </View>
          <View style={styles.compositionItem}>
            <Text style={styles.compositionValue}>32.8 kg</Text>
            <Text style={styles.compositionLabel}>Muscle mass</Text>
            <Text style={styles.compositionDelta}>+0.3 kg / month</Text>
          </View>
        </View>

        <Text style={styles.cardNote}>Personal-scale estimates, not a diagnosis.</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Accuracy &amp; personalization</Text>
        <Text style={styles.cardNote}>
          Basic body info gives you a starting nutrition estimate. Adding daily activity and goals
          helps personalize your plan. More details live in Profile.
        </Text>
        <Pressable onPress={() => router.push('/profile')} hitSlop={8}>
          <Text style={styles.link}>Profile</Text>
        </Pressable>
      </Card>
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
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  segments: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: C.surface,
  },
  segmentLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  segmentLabelActive: {
    fontWeight: '600',
    color: C.accent,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },
  pill: {
    backgroundColor: C.accentTint,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '500',
    color: C.accent,
  },
  bigValue: {
    fontSize: 34,
    fontWeight: '600',
    color: C.text,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
  },
  chart: {
    flex: 1,
    height: 124,
    justifyContent: 'center',
  },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    bottom: 12,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: C.border,
  },
  plotWrap: {
    paddingHorizontal: 4,
  },
  plot: {
    width: '100%',
    aspectRatio: LINE_VIEWBOX.width / LINE_VIEWBOX.height,
  },
  plotLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    marginLeft: -4,
    marginTop: -4,
  },
  axis: {
    width: 26,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  axisLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  cardNote: {
    fontSize: 11,
    color: C.textMuted,
    flexShrink: 1,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    backgroundColor: C.accentTint,
    borderWidth: 1,
    borderColor: C.border,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  compositionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  compositionItem: {
    flex: 1,
    backgroundColor: C.previewTint,
    borderRadius: 16,
    padding: 12,
    gap: 3,
  },
  compositionValue: {
    fontSize: 20,
    fontWeight: '600',
    color: C.text,
  },
  compositionLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  compositionDelta: {
    fontSize: 10,
    color: C.accent,
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accent,
  },
});
