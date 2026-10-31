import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { RadioList } from '@/components/radio-list';
import { Sheet, SheetActions, SheetField } from '@/components/sheet';
import { WheelPicker } from '@/components/wheel-picker';
import { Palette as C } from '@/constants/palette';
import { useHealth, type Sex } from '@/features/health/health-store';

const ACTIVITY_OPTIONS = ['Sedentary', 'Light', 'Moderate', 'High'] as const;
const GOAL_OPTIONS = ['Lose fat', 'Maintain', 'Build muscle'] as const;
const SEX_OPTIONS: readonly Sex[] = ['Male', 'Female', 'Rather not say'];

const HEIGHT_VALUES = Array.from({ length: 101 }, (_, index) => 120 + index);
const SESSION_VALUES = [1, 2, 3, 4, 5, 6, 7];

type SheetProps = { visible: boolean; onClose: () => void };

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

export function HeightSheet({ visible, onClose }: SheetProps) {
  const { heightCm, saveHeight } = useHealth();
  const [draft, setDraft] = useState(heightCm);

  function handleSave() {
    saveHeight(draft);
    onClose();
  }

  return (
    <Sheet visible={visible} title="Height" onClose={onClose}>
      <WheelPicker
        values={HEIGHT_VALUES}
        value={draft}
        onChange={setDraft}
        format={(value) => `${value} cm`}
      />
      <Text style={styles.body}>Height contributes to your initial energy estimate.</Text>
      <SheetActions
        primaryLabel="OK"
        secondaryLabel="Cancel"
        onPrimary={handleSave}
        onSecondary={onClose}
      />
    </Sheet>
  );
}

export function WeightSheet({ visible, onClose }: SheetProps) {
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

export function SexSheet({ visible, onClose }: SheetProps) {
  const { sex, saveSex } = useHealth();

  return (
    <Sheet visible={visible} title="Sex" onClose={onClose}>
      <RadioList
        options={SEX_OPTIONS}
        value={sex}
        onChange={(next) => {
          saveSex(next);
          onClose();
        }}
      />
    </Sheet>
  );
}

export function GoalSheet({ visible, onClose }: SheetProps) {
  const { plan, savePlan } = useHealth();

  return (
    <Sheet visible={visible} title="Goal / target" onClose={onClose}>
      <RadioList
        options={GOAL_OPTIONS}
        value={plan.goal as (typeof GOAL_OPTIONS)[number]}
        onChange={(goal) => {
          savePlan({ ...plan, goal });
          onClose();
        }}
      />
    </Sheet>
  );
}

export function ActivitySheet({ visible, onClose }: SheetProps) {
  const { plan, savePlan } = useHealth();

  return (
    <Sheet visible={visible} title="Daily activity" onClose={onClose}>
      <RadioList
        options={ACTIVITY_OPTIONS}
        value={plan.activity as (typeof ACTIVITY_OPTIONS)[number]}
        onChange={(activity) => {
          savePlan({ ...plan, activity });
          onClose();
        }}
      />
    </Sheet>
  );
}

export function FrequencySheet({ visible, onClose }: SheetProps) {
  const { plan, savePlan } = useHealth();
  const [draft, setDraft] = useState(plan.sessions);

  function handleSave() {
    savePlan({ ...plan, sessions: draft });
    onClose();
  }

  return (
    <Sheet visible={visible} title="Workout frequency" onClose={onClose}>
      <WheelPicker
        values={SESSION_VALUES}
        value={draft}
        onChange={setDraft}
        format={(value) => `${value} ${value === 1 ? 'session' : 'sessions'}/week`}
      />
      <SheetActions
        primaryLabel="OK"
        secondaryLabel="Cancel"
        onPrimary={handleSave}
        onSecondary={onClose}
      />
    </Sheet>
  );
}

export function TargetWeightSheet({ visible, onClose }: SheetProps) {
  const { plan, savePlan } = useHealth();
  const [draft, setDraft] = useState(plan.targetWeightKg.toFixed(1));

  function handleSave() {
    const next = Number.parseFloat(draft.replace(',', '.'));
    if (Number.isFinite(next) && next > 0) savePlan({ ...plan, targetWeightKg: next });
    onClose();
  }

  return (
    <Sheet visible={visible} title="Target weight" onClose={onClose}>
      <SheetField label="Target weight">
        <NumberField value={draft} onChange={setDraft} unit="kg" />
      </SheetField>
      <SheetActions
        primaryLabel="Save"
        secondaryLabel="Cancel"
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
});
