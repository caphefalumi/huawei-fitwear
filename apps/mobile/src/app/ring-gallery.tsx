import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, watchFace } from '../theme';
import { ProgressRing, RestTimerRing, type ProgressRingProps } from '../components/ui';

const SIZES = [
  { label: 'Large', size: 170, strokeWidth: 10 },
  { label: 'Medium', size: 120, strokeWidth: 8 },
  { label: 'Small', size: 76, strokeWidth: 5 }
] as const;

const STATES = [
  { label: '0%', progress: 0 },
  { label: '50%', progress: 0.5 },
  { label: '100%', progress: 1 },
  { label: 'Over target', progress: 1.25 }
] as const;

const REST_TOTAL = 6;

export default function RingGalleryScreen() {
  const { theme } = useAppTheme();
  const [replay, setReplay] = useState(0);
  const [restLeft, setRestLeft] = useState(REST_TOTAL);

  // Loops 6 -> 0 so the last-3-seconds icon pulse can be watched
  useEffect(() => {
    const id = setInterval(() => setRestLeft((s) => (s <= 0 ? REST_TOTAL : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const types = [
    { key: 'calories', title: 'Calories · fire', color: theme.calories, icon: 'fire', iconColor: theme.ringIcon.calories, target: 2200, unit: '', label: 'KCAL' },
    { key: 'protein', title: 'Protein · arm-flex', color: theme.protein, icon: 'arm-flex', iconColor: theme.ringIcon.protein, target: 150, unit: 'g', label: 'Protein' },
    { key: 'carbs', title: 'Carbs · grain', color: theme.carbs, icon: 'grain', iconColor: theme.ringIcon.carbs, target: 250, unit: 'g', label: 'Carbs' },
    { key: 'fat', title: 'Fat · water (icon uses textSecondary)', color: theme.fat, icon: 'water', iconColor: theme.ringIcon.fat, target: 70, unit: 'g', label: 'Fat' },
    { key: 'workout', title: 'Workout · dumbbell → check', color: theme.protein, icon: 'dumbbell', iconColor: theme.ringIcon.workout, target: 4, unit: '', label: 'Sets', workout: true }
  ] as const;

  const ringFor = (t: (typeof types)[number], progress: number, size: number, strokeWidth: number): ProgressRingProps => {
    const raw = Math.round(progress * t.target);
    const shown = 'workout' in t ? `${Math.min(raw, t.target)}/${t.target}` : `${raw}${t.unit}`;
    return {
      size,
      strokeWidth,
      progress,
      color: t.color,
      primaryValue: shown,
      primaryLabel: t.label,
      icon: { name: t.icon, color: t.iconColor },
      isWorkoutRing: 'workout' in t,
      accessibilityLabel: `${t.label}, ${shown}, ${Math.round(progress * 100)} percent`
    };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={[styles.roundBtn, { backgroundColor: theme.surfaceElevated }]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Ring gallery</Text>
        <Pressable
          onPress={() => setReplay((n) => n + 1)}
          accessibilityRole="button"
          accessibilityLabel="Replay mount animation"
          style={[styles.roundBtn, { backgroundColor: theme.surfaceElevated }]}
        >
          <Ionicons name="refresh" size={20} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.note, { color: theme.textSecondary }]}>
          Each ring type at 0%, 50%, 100% and over target, at three sizes. Check icon alignment, contrast and
          motion. Refresh replays the mount animation.
        </Text>

        {SIZES.map((s) => (
          <View key={s.label} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {s.label} · {s.size}
            </Text>
            {types.map((t) => (
              <View key={t.key} style={styles.typeBlock}>
                <Text style={[styles.typeTitle, { color: theme.textSecondary }]}>{t.title}</Text>
                <View style={styles.grid}>
                  {STATES.map((st) => (
                    <View key={st.label} style={styles.cell}>
                      <ProgressRing key={`${replay}-${s.label}-${t.key}-${st.label}`} {...ringFor(t, st.progress, s.size, s.strokeWidth)} />
                      <Text
                        style={[
                          styles.stateLabel,
                          { color: st.progress > 1 ? theme.overTarget : theme.textSecondary }
                        ]}
                      >
                        {st.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Concentric · one icon per ring</Text>
          <Text style={[styles.typeTitle, { color: theme.textSecondary }]}>
            fire · arm-flex · grain · water, on a bead at each ring start
          </Text>
          <View style={styles.grid}>
            {[0.7, 0.35].map((v) => (
              <View key={v} style={styles.cell}>
                <ProgressRing
                  key={`${replay}-hero-${v}`}
                  size={200}
                  rings={[
                    { value: v, color: theme.calories, radius: 84, strokeWidth: 10, icon: 'fire' },
                    { value: v, color: theme.protein, radius: 70, strokeWidth: 5, icon: 'arm-flex' },
                    { value: v, color: theme.carbs, radius: 60, strokeWidth: 5, icon: 'grain' },
                    { value: v, color: theme.fat, radius: 50, strokeWidth: 5, icon: 'water' }
                  ]}
                  primaryValue="663"
                  primaryLabel="KCAL LEFT"
                  icon={{ name: 'fire', color: theme.ringIcon.calories }}
                  accessibilityLabel={`Calories, 663 kilocalories left, ${Math.round(v * 100)} percent of target`}
                />
                <Text style={[styles.stateLabel, { color: theme.textSecondary }]}>{Math.round(v * 100)}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Rest timer · timer-outline</Text>
          <Text style={[styles.typeTitle, { color: theme.textSecondary }]}>
            Live loop from {REST_TOTAL}s; the icon pulses once per second in the last 3 seconds
          </Text>
          <View style={styles.grid}>
            <View style={styles.cell}>
              <RestTimerRing key={`rest-l-${replay}`} size={220} secondsLeft={restLeft} totalSeconds={REST_TOTAL} />
              <Text style={[styles.stateLabel, { color: theme.textSecondary }]}>Large · {restLeft}s</Text>
            </View>
            <View style={styles.cell}>
              <RestTimerRing key={`rest-m-${replay}`} size={120} secondsLeft={restLeft} totalSeconds={REST_TOTAL} />
              <Text style={[styles.stateLabel, { color: theme.textSecondary }]}>Medium · {restLeft}s</Text>
            </View>
          </View>
        </View>

        <View style={[styles.watchSection, { backgroundColor: watchFace.screen, borderColor: watchFace.bezelBorder }]}>
          <Text style={[styles.sectionTitle, { color: watchFace.text }]}>Watch face · dark</Text>
          <Text style={[styles.typeTitle, { color: watchFace.textSecondary }]}>
            White icon above the number at 16% of the ring width
          </Text>
          <View style={styles.grid}>
            <View style={styles.cell}>
              <ProgressRing
                key={`w-cal-${replay}`}
                size={180}
                progress={0.75}
                color={watchFace.calories}
                primaryValue="550"
                primaryLabel="KCAL LEFT"
                icon={{ name: 'fire', color: watchFace.ringIcon.calories }}
                isWatch={true}
                accessibilityLabel="Calories, 550 kilocalories left, 75 percent of target"
              />
              <Text style={[styles.stateLabel, { color: watchFace.textSecondary }]}>Calories</Text>
            </View>
            <View style={styles.cell}>
              <ProgressRing
                key={`w-wo-${replay}`}
                size={180}
                progress={0.8}
                color={watchFace.workout}
                primaryValue="8/10"
                primaryLabel="REPS"
                icon={{ name: 'dumbbell', color: watchFace.ringIcon.workout }}
                isWatch={true}
                isWorkoutRing={true}
                accessibilityLabel="Workout, 8 of 10 reps, 80 percent"
              />
              <Text style={[styles.stateLabel, { color: watchFace.textSecondary }]}>Workout</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 40 },
  note: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  typeBlock: { marginTop: 8 },
  typeTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  cell: { alignItems: 'center' },
  stateLabel: { fontSize: 11, fontWeight: '700', marginTop: 6 },
  watchSection: {
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20
  }
});
