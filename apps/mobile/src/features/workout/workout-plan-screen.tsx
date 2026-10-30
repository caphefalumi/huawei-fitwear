import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import { Card, SectionHeading } from '@/features/home/ui';
import { recoveryRanges, useHealth } from '@/features/health/health-store';
import { routinesFor, type Routine } from '@/features/workout/routines';
import { RecoverySheet } from '@/features/recovery/recovery-sheet';

const icons = {
  shieldCheck: require('@/assets/images/home/shield-check.svg'),
};

const WEEK = [
  { day: 'Mon', date: '05' },
  { day: 'Tue', date: '06' },
  { day: 'Wed', date: '07' },
  { day: 'Thu', date: '08' },
  { day: 'Fri', date: '09' },
  { day: 'Sat', date: '10' },
  { day: 'Sun', date: '11' },
];

const MUSCLE_GROUPS = [
  {
    key: 'chest',
    label: 'Chest',
    icon: require('@/assets/images/recovery/body-chest.svg'),
    designed: true,
  },
  {
    key: 'back',
    label: 'Back',
    icon: require('@/assets/images/recovery/body-back.svg'),
    designed: false,
  },
  {
    key: 'shoulders',
    label: 'Shoulders',
    icon: require('@/assets/images/recovery/body-shoulders.svg'),
    designed: false,
  },
  {
    key: 'arms',
    label: 'Arms',
    icon: require('@/assets/images/recovery/body-arms.svg'),
    designed: false,
  },
  {
    key: 'legs',
    label: 'Legs',
    icon: require('@/assets/images/recovery/body-legs.svg'),
    designed: false,
  },
  {
    key: 'core',
    label: 'Core',
    icon: require('@/assets/images/recovery/body-core.svg'),
    designed: false,
  },
];

export function WorkoutPlanScreen() {
  const insets = useSafeAreaInsets();
  const { plan, recovery } = useHealth();
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const { today, next, adjustedFor } = routinesFor(recovery);
  const ranges = recovery ? recoveryRanges(recovery) : null;
  const recoveryLine =
    recovery && ranges
      ? `Rest ${ranges.rest} · light ${ranges.light}\nReturn ${recovery.returnDate}, if ready`
      : '';
  const summary = (routine: Routine) =>
    `${routine.name} · ${routine.exercises.length} exercises · ${routine.sets} sets · ${routine.minutes} min`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>My plan</Text>
        <Text style={styles.title}>Workout plan</Text>
        <Text style={styles.subtitle}>
          {plan.sessions}x/week · fat loss &amp; muscle maintenance
        </Text>
      </View>

      <View style={styles.week}>
        {WEEK.map((day) => {
          const active = day.date === '08';
          return (
            <View key={day.date} style={[styles.day, active && styles.dayActive]}>
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{day.day}</Text>
              <Text style={[styles.dayDate, active && styles.dayDateActive]}>{day.date}</Text>
            </View>
          );
        })}
      </View>

      {recovery ? (
        <Pressable style={styles.recoveryCard} onPress={() => setRecoveryOpen(true)}>
          <Image source={icons.shieldCheck} style={styles.recoveryIcon} contentFit="contain" />
          <View style={styles.recoveryCopy}>
            <Text style={styles.recoveryTitle}>Recovery</Text>
            <Text style={styles.recoverySub}>{recoveryLine}</Text>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.section}>
        <SectionHeading title="Today" actionLabel={today.name} />
        <Card style={styles.todayCard}>
          <View style={styles.todayRow}>
            <View style={styles.todayCopy}>
              <Text style={styles.todayTitle}>Current routine</Text>
              <Text style={styles.cardSub}>{summary(today)}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>OCT 8</Text>
            </View>
          </View>
          <View style={styles.exerciseList}>
            {today.exercises.map((exercise) => (
              <View key={exercise.name} style={styles.exerciseRow}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
              </View>
            ))}
          </View>
          {adjustedFor ? (
            <Text style={styles.footnote}>ADJUSTED FOR {adjustedFor.toUpperCase()}</Text>
          ) : null}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Upcoming" actionLabel="Oct 9" />
        <Card>
          <View style={styles.nextHeader}>
            <View style={styles.todayCopy}>
              <Text style={styles.rowTitle}>Next routine</Text>
              <Text style={styles.cardSub}>{summary(next)}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>OCT 9</Text>
            </View>
          </View>
          <View style={styles.exerciseList}>
            {next.exercises.map((exercise) => (
              <View key={exercise.name} style={styles.exerciseRow}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
              </View>
            ))}
          </View>
          {recovery ? <Text style={styles.footnote}>IF READY · not cleared medically</Text> : null}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Browse muscle groups" actionLabel="6 groups" />
        <View style={styles.groups}>
          {MUSCLE_GROUPS.map((group) => (
            <Pressable
              key={group.key}
              style={styles.group}
              disabled={!group.designed}
              onPress={() => router.push('/chest-plan')}>
              <Image source={group.icon} style={styles.groupImage} contentFit="contain" />
              <Text style={styles.groupLabel}>{group.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => router.push('/chest-plan')}>
        <Text style={styles.primaryLabel}>View Chest plan</Text>
      </Pressable>

      {recoveryOpen ? <RecoverySheet visible onClose={() => setRecoveryOpen(false)} /> : null}
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
    gap: 3,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  day: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayActive: {
    backgroundColor: C.accent,
  },
  dayLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  dayLabelActive: {
    color: C.onAccent,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  dayDateActive: {
    color: C.onAccent,
  },
  recoveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.accentTint,
    borderRadius: 18,
    padding: 16,
  },
  recoveryIcon: {
    width: 24,
    height: 24,
  },
  recoveryCopy: {
    flex: 1,
    gap: 4,
  },
  recoveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  recoverySub: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  section: {
    gap: 8,
  },
  todayCard: {
    paddingVertical: 14,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayCopy: {
    flex: 1,
    gap: 3,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.text,
  },
  cardSub: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: C.accentTint,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.accent,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },
  nextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  exerciseList: {
    gap: 8,
    paddingTop: 12,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 12,
    color: C.text,
  },
  exercisePrescription: {
    fontSize: 12,
    color: C.textMuted,
  },
  footnote: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: C.textMuted,
    paddingTop: 10,
  },
  groups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  group: {
    width: '31%',
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  },
  groupImage: {
    width: 26,
    height: 34,
    marginBottom: 2,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: C.onAccent,
  },
});
