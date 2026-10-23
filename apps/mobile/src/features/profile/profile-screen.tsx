import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';

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

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { weightKg, saveWeight } = useHealth();
  const [weightSheetOpen, setWeightSheetOpen] = useState(false);
  const [draftWeight, setDraftWeight] = useState('');

  function openWeightSheet() {
    setDraftWeight(weightKg.toFixed(1));
    setWeightSheetOpen(true);
  }

  function handleSave() {
    const next = Number.parseFloat(draftWeight.replace(',', '.'));
    setWeightSheetOpen(false);
    if (Number.isFinite(next) && next > 0) {
      saveWeight(next);
      router.navigate('/home');
    }
  }

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
        <ProfileRow label="Height" value="175 cm" />
        <ProfileRow label="Weight" value={`${weightKg.toFixed(1)} kg`} onPress={openWeightSheet} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Refine your plan</Text>
        <ProfileRow label="Goal / target" value="Lose fat" />
        <ProfileRow label="Workout frequency" value="3 sessions/week" />
        <ProfileRow label="Daily activity" value="Moderate" />
        <ProfileRow label="Recovery plan" value="" onPress={() => router.push('/recovery')} />
      </View>

      <Modal
        visible={weightSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setWeightSheetOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropFill} onPress={() => setWeightSheetOpen(false)} />
          <View style={[styles.sheet, { paddingBottom: 26 + insets.bottom }]}>
            <Text style={styles.sheetTitle}>Update weight</Text>
            <Text style={styles.sheetBody}>
              Log your weekly weight to keep your nutrition guidance current.
            </Text>

            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>Current · updated Oct 7</Text>
              <Text style={styles.sheetCurrent}>{weightKg.toFixed(1)} kg</Text>
            </View>

            <View style={styles.sheetField}>
              <Text style={styles.sheetLabel}>New weight · today</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={draftWeight}
                  onChangeText={setDraftWeight}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
                <Text style={styles.sheetUnit}>kg</Text>
              </View>
            </View>

            <Text style={styles.sheetNote}>Nutrition updates happen behind the scenes.</Text>

            <Pressable style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryLabel}>Save update</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => setWeightSheetOpen(false)}>
              <Text style={styles.secondaryLabel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(37, 35, 33, 0.35)',
  },
  backdropFill: {
    flex: 1,
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 14,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: C.text,
  },
  sheetBody: {
    fontSize: 12,
    color: C.textMuted,
  },
  sheetField: {
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  sheetLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  sheetCurrent: {
    fontSize: 18,
    fontWeight: '600',
    color: C.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 26,
    fontWeight: '600',
    color: C.text,
    padding: 0,
  },
  sheetUnit: {
    fontSize: 14,
    color: C.textMuted,
  },
  sheetNote: {
    fontSize: 11,
    color: C.textMuted,
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
  secondaryButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
});
