import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { Pressable } from '@/components/pressable';
import { useMeals } from '@/features/meals/meals-store';
import { NutritionRing } from '@/features/home/ring';
import { BackHeader, Card, MacroBar } from '@/features/home/ui';

export function NutritionScreen() {
  const insets = useSafeAreaInsets();
  const { summary, loading, error, refresh } = useMeals();
  const consumed = summary?.consumed;
  const targets = summary?.targets;
  const left = summary?.remaining.caloriesKcal;

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
        <Text style={styles.subtitle}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
      </View>
      {loading ? <Text style={styles.noteBody}>Loading nutrition…</Text> : null}
      {error ? <Pressable onPress={() => { void refresh(); }}><Text accessibilityRole="alert">{error} Tap to retry.</Text></Pressable> : null}
      {!summary && !loading ? <Text style={styles.noteBody}>Nutrition summary is unavailable. Retry to load your targets and logged meals.</Text> : null}
      {summary && targets && consumed && left !== undefined ? <>

      <Card style={styles.center}>
        <NutritionRing kcalLeft={left} targetKcal={targets.calorieTargetKcal} consumedKcal={consumed.caloriesKcal} />

        <View style={styles.stats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Consumed</Text>
            <Text style={styles.statValue}>{consumed.caloriesKcal.toLocaleString()} kcal</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Daily target</Text>
            <Text style={styles.statValue}>{targets.calorieTargetKcal.toLocaleString()} kcal</Text>
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
          <MacroBar
            label="Protein"
            value={consumed.proteinG}
            target={targets.proteinTargetG}
            unit="g"
            note={`${Math.max(0, Math.round(summary.remaining.proteinG))} g remaining`}
          />
          <MacroBar
            label="Carbs"
            value={consumed.carbsG}
            target={targets.carbsTargetG}
            unit="g"
            note={`${Math.max(0, Math.round(summary.remaining.carbsG))} g remaining`}
          />
          <MacroBar
            label="Fat"
            value={consumed.fatG}
            target={targets.fatTargetG}
            unit="g"
            note={`${Math.max(0, Math.round(summary.remaining.fatG))} g remaining`}
          />
        </View>
      </Card>
      </> : null}

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
