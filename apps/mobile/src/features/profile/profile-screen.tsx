import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import { createRecovery, PERIOD_AREA, useHealth } from '@/features/health/health-store';
import {
  ActivitySheet,
  FrequencySheet,
  GoalSheet,
  HeightSheet,
  SexSheet,
  TargetWeightSheet,
  WeightSheet,
} from '@/features/profile/sheets';
import { RecoverySheet } from '@/features/recovery/recovery-sheet';

const icons = {
  chevronRight: require('@/assets/images/profile/chevron-right.svg'),
};

type RowProps = {
  label: string;
  value: string;
  onPress?: () => void;
};

function ProfileRow({ label, value, onPress }: RowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>{value}</Text>
        <Image source={icons.chevronRight} style={styles.chevron} contentFit="contain" />
      </View>
    </Pressable>
  );
}

type OpenSheet = 'height' | 'weight' | 'sex' | 'goal' | 'frequency' | 'activity' | 'target' | 'recovery' | null;

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { weightKg, heightCm, sex, plan, recovery, saveRecovery } = useHealth();
  const inPeriod = recovery?.area === PERIOD_AREA;
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);

  const close = () => setOpenSheet(null);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <Text style={styles.title}>Profile</Text>

      <Animated.View entering={FadeInUp.duration(220)}>
        <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SN</Text>
        </View>
        <View style={styles.user}>
          <Text style={styles.userName}>Sam Nguyen</Text>
          <Text style={styles.userHandle}>Sam Nguyen</Text>
        </View>
      </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(50).duration(220)}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile overview</Text>
        <ProfileRow label="Birthdate" value="14 Jun 1998" />
        <ProfileRow label="Sex / gender" value={sex} onPress={() => setOpenSheet('sex')} />
        <ProfileRow
          label="Height"
          value={`${heightCm} cm`}
          onPress={() => setOpenSheet('height')}
        />
        <ProfileRow
          label="Weight"
          value={`${weightKg.toFixed(1)} kg`}
          onPress={() => setOpenSheet('weight')}
        />
      </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(220)}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Refine your plan</Text>
        <ProfileRow label="Goal / target" value={plan.goal} onPress={() => setOpenSheet('goal')} />
        <ProfileRow
          label="Workout frequency"
          value={`${plan.sessions} sessions/week`}
          onPress={() => setOpenSheet('frequency')}
        />
        <ProfileRow
          label="Daily activity"
          value={plan.activity}
          onPress={() => setOpenSheet('activity')}
        />
        <ProfileRow
          label="Target weight"
          value={`${plan.targetWeightKg.toFixed(1)} kg`}
          onPress={() => setOpenSheet('target')}
        />
        <ProfileRow
          label="Recovery plan"
          value={recovery?.area ?? 'None'}
          onPress={() => setOpenSheet('recovery')}
        />
      </View>
      </Animated.View>

      {sex === 'Female' ? (
        <Animated.View entering={FadeInUp.delay(150).duration(220)}>
        <Pressable
          style={[styles.periodButton, inPeriod && styles.periodButtonActive]}
          onPress={() => saveRecovery(inPeriod ? null : createRecovery(PERIOD_AREA))}>
          <Text style={[styles.periodLabel, inPeriod && styles.periodLabelActive]}>
            {inPeriod ? 'My period has ended' : 'I am in my period'}
          </Text>
        </Pressable>
        </Animated.View>
      ) : null}

      {openSheet === 'height' ? <HeightSheet visible onClose={close} /> : null}
      {openSheet === 'weight' ? <WeightSheet visible onClose={close} /> : null}
      {openSheet === 'sex' ? <SexSheet visible onClose={close} /> : null}
      {openSheet === 'goal' ? <GoalSheet visible onClose={close} /> : null}
      {openSheet === 'frequency' ? <FrequencySheet visible onClose={close} /> : null}
      {openSheet === 'activity' ? <ActivitySheet visible onClose={close} /> : null}
      {openSheet === 'target' ? <TargetWeightSheet visible onClose={close} /> : null}
      {openSheet === 'recovery' ? <RecoverySheet visible onClose={close} /> : null}
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
    gap: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: C.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '500',
    color: C.accent,
  },
  user: {
    flex: 1,
    gap: 5,
  },
  userName: {
    fontSize: 19,
    fontWeight: '600',
    color: C.text,
  },
  userHandle: {
    fontSize: 12,
    color: C.textMuted,
  },
  section: {
    gap: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: C.text,
    paddingBottom: 8,
  },
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  chevron: {
    width: 16,
    height: 16,
  },
  periodButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodButtonActive: {
    backgroundColor: C.accentTint,
  },
  periodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: C.onAccent,
  },
  periodLabelActive: {
    color: C.accent,
  },
});
