import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { BackHeader, Card } from '@/features/home/ui';
import { RANGE_DATA, RANGES, type Range } from '@/features/home/progress-data';
import { WeightChart } from '@/features/home/weight-chart';

export function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { weightKg } = useHealth();
  const [range, setRange] = useState<Range>('Month');
  const data = RANGE_DATA[range];
  const maxSessions = Math.max(...data.bars.map((bar) => bar.sessions));

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
            <Text style={styles.pillText}>{data.delta}</Text>
          </View>
        </View>

        <Text style={styles.bigValue}>{weightKg.toFixed(1)} kg</Text>

        <WeightChart weights={data.weights} />

        <View style={styles.dates}>
          {data.dates.map((date) => (
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
          <Text style={styles.cardNote}>{data.sessionsNote}</Text>
        </View>

        <View style={styles.bars}>
          {data.bars.map((week) => (
            <View key={week.label} style={styles.barColumn}>
              <View style={[styles.bar, { height: 12 + (week.sessions / maxSessions) * 48 }]} />
              <Text style={styles.dateLabel}>{week.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.durationRow}>
          <Text style={styles.bigValue}>{data.duration}</Text>
          <Text style={styles.cardNote}>{data.durationNote}</Text>
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
