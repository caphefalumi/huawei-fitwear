import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { HeightSheet, PlanSheet, WeightSheet } from '@/features/profile/sheets';
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

type OpenSheet = 'height' | 'weight' | 'plan' | 'recovery' | null;

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { weightKg, heightCm, plan, recovery } = useHealth();
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

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SN</Text>
        </View>
        <View style={styles.user}>
          <Text style={styles.userName}>Sam Nguyen</Text>
          <Text style={styles.userHandle}>Sam Nguyen</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile overview</Text>
        <ProfileRow label="Birthdate" value="14 Jun 1998" />
        <ProfileRow label="Sex / gender" value="Male" />
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

      <View style={styles.section}>
        <Pressable onPress={() => setOpenSheet('plan')} hitSlop={8}>
          <Text style={styles.sectionTitle}>Refine your plan</Text>
        </Pressable>
        <ProfileRow label="Goal / target" value={plan.goal} onPress={() => setOpenSheet('plan')} />
        <ProfileRow
          label="Workout frequency"
          value={`${plan.sessions} sessions/week`}
          onPress={() => setOpenSheet('plan')}
        />
        <ProfileRow label="Daily activity" value={plan.activity} onPress={() => setOpenSheet('plan')} />
        <ProfileRow
          label="Recovery plan"
          value={recovery.area}
          onPress={() => setOpenSheet('recovery')}
        />
      </View>

      {openSheet === 'height' ? <HeightSheet visible onClose={close} /> : null}
      {openSheet === 'weight' ? <WeightSheet visible onClose={close} /> : null}
      {openSheet === 'plan' ? <PlanSheet visible onClose={close} /> : null}
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
});
