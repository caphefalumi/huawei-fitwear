import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { NutritionRing } from '@/features/home/ring';
import { BackHeader, Card, MacroBar } from '@/features/home/ui';

export function NutritionScreen() {
  const insets = useSafeAreaInsets();
  const { weightUpdated } = useHealth();

  const targetKcal = weightUpdated ? 2160 : 2200;
  const consumedKcal = 1320;
  const left = targetKcal - consumedKcal;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <BackHeader label="Today" onPress={() => router.back()} />

      <View style={styles.heading}>
        <Text style={styles.title}>Nutrition</Text>
        <Text style={styles.subtitle}>Thursday, Oct 8</Text>
      </View>

      <Card style={styles.center}>
        <NutritionRing kcalLeft={left} saved={weightUpdated} />

        <View style={styles.stats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Consumed</Text>
            <Text style={styles.statValue}>{consumedKcal.toLocaleString('en-US')} kcal</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Daily target</Text>
            <Text style={styles.statValue}>{targetKcal.toLocaleString('en-US')} kcal</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Remaining today</Text>
        <Text style={styles.remaining}>{left} kcal</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Macronutrients</Text>
        <View style={styles.macros}>
          <MacroBar label="Protein" value={92} target={140} unit="g" note="48 g remaining" />
          <MacroBar label="Carbs" value={152} target={265} unit="g" note="113 g remaining" />
          <MacroBar label="Fat" value={38} target={60} unit="g" note="22 g remaining" />
        </View>
      </Card>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>About these numbers</Text>
        <Text style={styles.noteBody}>
          Food values and personal targets are estimates, not medical guidance.
        </Text>
      </View>
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
  heading: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  subtitle: {
    fontSize: 12,
    color: C.textMuted,
  },
  center: {
    alignItems: 'center',
  },
  stats: {
    alignSelf: 'stretch',
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  remaining: {
    fontSize: 27,
    fontWeight: '600',
    color: C.text,
  },
  macros: {
    gap: 12,
  },
  note: {
    gap: 4,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: C.text,
  },
  noteBody: {
    fontSize: 11,
    color: C.textMuted,
  },
});
