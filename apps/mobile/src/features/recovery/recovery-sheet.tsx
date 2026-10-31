import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { Sheet, SheetActions, SheetField } from '@/components/sheet';
import { Palette as C } from '@/constants/palette';
import {
  createRecovery,
  INJURY_AREAS,
  PERIOD_AREA,
  useHealth,
  type RecoveryPlan,
} from '@/features/health/health-store';

const icons = {
  shieldCheck: require('@/assets/images/home/shield-check.svg'),
};

const NONE = 'None';

export function RecoverySheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { recovery, saveRecovery, sex } = useHealth();
  const [draft, setDraft] = useState<RecoveryPlan | null>(recovery);

  const options = [NONE, ...INJURY_AREAS, ...(sex === 'Female' ? [PERIOD_AREA] : [])];

  function handleSave() {
    saveRecovery(draft);
    onClose();
  }

  return (
    <Sheet visible={visible} title="Recovery plan" onClose={onClose}>
      <Text style={styles.body}>Pause workouts and ease back with light days.</Text>

      <View style={styles.chips}>
        {options.map((area) => {
          const active = area === (draft?.area ?? NONE);
          return (
            <Pressable
              key={area}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setDraft(area === NONE ? null : createRecovery(area))}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{area}</Text>
            </Pressable>
          );
        })}
      </View>

      {draft ? (
        <RecoveryDetails draft={draft} />
      ) : (
        <Text style={styles.selectedNote}>No recovery plan. Your workouts continue as normal.</Text>
      )}

      <SheetActions
        primaryLabel="Save recovery plan"
        secondaryLabel="Cancel"
        onPrimary={handleSave}
        onSecondary={onClose}
      />
    </Sheet>
  );
}

function RecoveryDetails({ draft }: { draft: RecoveryPlan }) {
  return (
    <>
      <View style={styles.selectedArea}>
        <View style={styles.selectedCopy}>
          <Text style={styles.selectedTitle}>{draft.area}</Text>
          <Text style={styles.selectedNote}>{draft.note}</Text>
        </View>
      </View>

      <View style={styles.pair}>
        <View style={styles.pairItem}>
          <SheetField label="Rest days">
            <Text style={styles.value}>
              {draft.restDays} <Text style={styles.unit}>days</Text>
            </Text>
          </SheetField>
        </View>
        <View style={styles.pairItem}>
          <SheetField label="Light days">
            <Text style={styles.value}>
              {draft.lightDays} <Text style={styles.unit}>days</Text>
            </Text>
          </SheetField>
        </View>
      </View>

      <SheetField label="Start date">
        <Text style={styles.value}>{draft.start}</Text>
      </SheetField>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tentative return · if ready</Text>
        <Text style={styles.summaryValue}>{draft.returnDate}</Text>
      </View>

      <View style={styles.warning}>
        <Image source={icons.shieldCheck} style={styles.warningIcon} contentFit="contain" />
        <Text style={styles.warningText}>
          Today’s workouts stay paused. If pain persists or worsens, seek medical advice.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 13,
    color: C.textMuted,
  },
  selectedArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: C.previewTint,
    borderRadius: 16,
    padding: 14,
  },
  selectedCopy: {
    flex: 1,
    gap: 4,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  selectedNote: {
    fontSize: 11,
    color: C.textMuted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: {
    backgroundColor: C.accentTint,
    borderColor: C.accentBorder,
  },
  chipLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
  chipLabelActive: {
    fontWeight: '600',
    color: C.accent,
  },
  pair: {
    flexDirection: 'row',
    gap: 10,
  },
  pairItem: {
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: C.text,
  },
  unit: {
    fontSize: 13,
    color: C.textMuted,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  warning: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  warningIcon: {
    width: 16,
    height: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: C.textMuted,
  },
});
