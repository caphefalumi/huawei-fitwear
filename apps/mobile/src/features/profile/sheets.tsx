import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Sheet, SheetActions, SheetField } from '@/components/sheet';
import { Palette as C } from '@/constants/palette';
import {
  useHealth,
  type PlanPreferences,
} from '@/features/health/health-store';

const ACTIVITY_OPTIONS = ['Sedentary', 'Light', 'Moderate', 'High'];
const GOAL_OPTIONS = ['Lose fat', 'Maintain', 'Build muscle'];

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option)}>
            <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function NumberField({
  value,
  onChange,
  unit,
}: {
  value: string;
  onChange: (next: string) => void;
  unit: string;
}) {
  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        selectTextOnFocus
      />
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

export function HeightSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { heightCm, saveHeight } = useHealth();
  const [draft, setDraft] = useState(String(heightCm));

  function handleSave() {
    const next = Number.parseInt(draft, 10);
    onClose();
    if (Number.isFinite(next) && next > 0) saveHeight(next);
  }

  return (
    <Sheet visible={visible} title="Update height" onClose={onClose}>
      <Text style={styles.body}>Height contributes to your initial energy estimate.</Text>
      <SheetField label="Height">
        <NumberField value={draft} onChange={setDraft} unit="cm" />
      </SheetField>
      <SheetActions
        primaryLabel="Save height"
        secondaryLabel="Cancel"
        onPrimary={handleSave}
        onSecondary={onClose}
      />
    </Sheet>
  );
}

export function WeightSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { weightKg, saveWeight } = useHealth();
  const [draft, setDraft] = useState(weightKg.toFixed(1));

  function handleSave() {
    const next = Number.parseFloat(draft.replace(',', '.'));
    onClose();
    if (Number.isFinite(next) && next > 0) saveWeight(next);
  }

  return (
    <Sheet visible={visible} title="Update weight" onClose={onClose}>
      <Text style={styles.body}>
        Log your weekly weight to keep your nutrition guidance current.
      </Text>
      <SheetField label="Current · updated Oct 7">
        <Text style={styles.current}>{weightKg.toFixed(1)} kg</Text>
      </SheetField>
      <SheetField label="New weight · today">
        <NumberField value={draft} onChange={setDraft} unit="kg" />
      </SheetField>
      <Text style={styles.note}>Nutrition updates happen behind the scenes.</Text>
      <SheetActions
        primaryLabel="Save update"
        secondaryLabel="Cancel"
        onPrimary={handleSave}
        onSecondary={onClose}
      />
    </Sheet>
  );
}

export function PlanSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { plan, savePlan } = useHealth();
  const [draft, setDraft] = useState<PlanPreferences>(plan);
  const [target, setTarget] = useState(String(plan.targetWeightKg));
  const [sessions, setSessions] = useState(String(plan.sessions));

  function update(patch: Partial<PlanPreferences>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleSave() {
    const nextTarget = Number.parseFloat(target.replace(',', '.'));
    const nextSessions = Number.parseInt(sessions, 10);
    savePlan({
      ...draft,
      targetWeightKg: Number.isFinite(nextTarget) && nextTarget > 0 ? nextTarget : plan.targetWeightKg,
      sessions: Number.isFinite(nextSessions) && nextSessions > 0 ? nextSessions : plan.sessions,
    });
    onClose();
  }

  return (
    <Sheet visible={visible} title="Refine your plan" onClose={onClose}>
      <Text style={styles.optional}>OPTIONAL</Text>
      <Text style={styles.body}>
        Basics give a starting estimate. Activity and goals personalize it with a little extra
        input.
      </Text>
      <SheetField label="Daily activity">
        <Chips
          options={ACTIVITY_OPTIONS}
          value={draft.activity}
          onChange={(activity) => update({ activity })}
        />
      </SheetField>
      <SheetField label="Goal">
        <Chips
          options={GOAL_OPTIONS}
          value={draft.goal}
          onChange={(goal) => update({ goal })}
        />
      </SheetField>
      <View style={styles.pair}>
        <View style={styles.pairItem}>
          <SheetField label="Target weight">
            <NumberField value={target} onChange={setTarget} unit="kg" />
          </SheetField>
        </View>
        <View style={styles.pairItem}>
          <SheetField label="Sessions / week">
            <NumberField value={sessions} onChange={setSessions} unit="sessions" />
          </SheetField>
        </View>
      </View>
      <SheetActions
        primaryLabel="Save preferences"
        secondaryLabel="Skip for now"
        onPrimary={handleSave}
        onSecondary={onClose}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 13,
    color: C.textMuted,
  },
  optional: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: C.accent,
  },
  note: {
    fontSize: 11,
    color: C.textMuted,
  },
  current: {
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
    fontSize: 22,
    fontWeight: '600',
    color: C.text,
    padding: 0,
  },
  unit: {
    fontSize: 13,
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
});
