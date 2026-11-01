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
import { useWorkouts } from '@/features/workout/workout-store';
import { RecoverySheet } from '@/features/recovery/recovery-sheet';

const icons = {
  shieldCheck: require('@/assets/images/home/shield-check.svg'),
  chest: require('@/assets/images/recovery/body-chest.svg'),
  back: require('@/assets/images/recovery/body-back.svg'),
  shoulders: require('@/assets/images/recovery/body-shoulders.svg'),
  arms: require('@/assets/images/recovery/body-arms.svg'),
  legs: require('@/assets/images/recovery/body-legs.svg'),
  core: require('@/assets/images/recovery/body-core.svg'),
};

export function WorkoutPlanScreen() {
  const insets = useSafeAreaInsets();
  const { plan, recovery } = useHealth();
  const { exercises, sessions, loading, error, refresh, hasMore, loadMore } = useWorkouts();
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const { today, next } = routinesFor(recovery, exercises);
  const ranges = recovery ? recoveryRanges(recovery) : null;
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });
  const groups = [...new Set(exercises.map((exercise) => exercise.muscleGroup))];

  function routineCard(routine: Routine, label: string) {
    return (
      <View style={styles.section} key={routine.id}>
        <SectionHeading title={label} actionLabel={routine.name} />
        <Card style={styles.todayCard}>
          <View style={styles.todayRow}>
            <View style={styles.todayCopy}>
              <Text style={styles.todayTitle}>{routine.name}</Text>
              <Text style={styles.cardSub}>{routine.exercises.length} exercises · {routine.sets} planned sets</Text>
            </View>
            <View style={styles.badge}><Text style={styles.badgeLabel}>PLAN</Text></View>
          </View>
          <View style={styles.exerciseList}>
            {routine.exercises.map((exercise) => <View key={exercise.id} style={styles.exerciseRow}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
            </View>)}
          </View>
          <Pressable onPress={() => router.push({ pathname: '/chest-plan', params: { group: routine.name } })}><Text style={styles.footnote}>VIEW PLAN</Text></Pressable>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom }]}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>My plan</Text>
        <Text style={styles.title}>Workout plan</Text>
        <Text style={styles.subtitle}>{plan.sessions != null ? `${plan.sessions} sessions/week` : 'Set a weekly goal in your profile'}{plan.goal ? ` · ${plan.goal}` : ''}</Text>
      </View>
      <View style={styles.week}>
        {week.map((date) => {
          const active = date.toDateString() === now.toDateString();
          return <View key={date.toISOString()} style={[styles.day, active && styles.dayActive]}>
            <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</Text>
            <Text style={[styles.dayDate, active && styles.dayDateActive]}>{date.getDate()}</Text>
          </View>;
        })}
      </View>
      {loading ? <Text style={styles.subtitle}>Loading workouts…</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.subtitle}>{error}</Text> : null}
      <Pressable disabled={loading} onPress={() => void refresh()}><Text style={styles.footnote}>Refresh workouts</Text></Pressable>
      {recovery && ranges ? <Pressable style={styles.recoveryCard} onPress={() => setRecoveryOpen(true)}>
        <Image source={icons.shieldCheck} style={styles.recoveryIcon} contentFit="contain" />
        <View style={styles.recoveryCopy}>
          <Text style={styles.recoveryTitle}>Recovery</Text>
          <Text style={styles.recoverySub}>Rest {ranges.rest} · light {ranges.light}{'\n'}Return {recovery.returnDate}, if ready</Text>
        </View>
      </Pressable> : null}
      {today ? routineCard(today, 'Explore a routine') : null}
      {next ? routineCard(next, 'More routines') : null}
      <View style={styles.section}>
        <SectionHeading title="Browse muscle groups" actionLabel={`${groups.length} groups`} />
        {!groups.length && !loading ? <Text style={styles.subtitle}>No exercises are available yet. Refresh to try again.</Text> : null}
        <View style={styles.groups}>
          {groups.map((group) => <Pressable key={group} style={styles.group} onPress={() => router.push({ pathname: '/chest-plan', params: { group } })}>
            <Image source={icons[group.toLowerCase() as keyof typeof icons] ?? icons.shieldCheck} style={styles.groupImage} contentFit="contain" />
            <Text style={styles.groupLabel}>{group}</Text>
          </Pressable>)}
        </View>
      </View>
      <View style={styles.section}>
        <SectionHeading title="Workout history" actionLabel={`${sessions.length} loaded`} />
        {!sessions.length && !loading ? <Text style={styles.subtitle}>No saved workouts yet. Choose a group to start your first session.</Text> : null}
        {sessions.map((session) => <Pressable key={session.id} onPress={() => router.push({ pathname: '/chest-plan', params: { sessionId: session.id, group: session.workoutSplit } })}>
          <Card>
            <Text style={styles.rowTitle}>{session.sessionTitle}</Text>
            <Text style={styles.cardSub}>{new Date(session.startedAt).toLocaleString()} · {session.completedAt ? 'Completed' : 'In progress'}</Text>
            {session.completedAt ? <Text style={styles.cardSub}>{Math.max(0, Math.round((Date.parse(session.completedAt) - Date.parse(session.startedAt)) / 60000))} min elapsed</Text> : null}
          </Card>
        </Pressable>)}
        {hasMore ? <Pressable disabled={loading} onPress={() => void loadMore()}><Text style={styles.footnote}>Load older workouts</Text></Pressable> : null}
      </View>
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
});
