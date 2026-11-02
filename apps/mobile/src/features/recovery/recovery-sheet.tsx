import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { Pressable } from "@/components/pressable";
import { Sheet, SheetActions, SheetField } from "@/components/sheet";
import { Palette as C } from "@/constants/palette";
import {
  createRecovery,
  dateLabel,
  INJURY_AREAS,
  PERIOD_AREA,
  useHealth,
  type RecoveryPlan,
} from "@/features/health/health-store";

const icons = {
  shieldCheck: require("@/assets/images/home/shield-check.svg"),
};

const NONE = "None";

export function RecoverySheet({
  visible,
  onClose,
  initialArea,
}: {
  visible: boolean;
  onClose: () => void;
  initialArea?: string;
}) {
  const { recovery, saveRecovery, sex, loading, error: loadError } = useHealth();
  const [draft, setDraft] = useState<RecoveryPlan | null>(() =>
    initialArea ? createRecovery(initialArea) : recovery,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);
  const busy = useRef(false);
  const dirty = useRef(false);
  useEffect(() => {
    if (!dirty.current && !initialArea) setDraft(recovery);
  }, [recovery, initialArea]);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const options = [NONE, ...INJURY_AREAS, ...(sex === "Female" ? [PERIOD_AREA] : [])];
  const close = () => {
    if (!busy.current) onClose();
  };
  async function handleSave() {
    if (busy.current || loading || loadError) return;
    setError(null);
    if (
      draft &&
      (!Number.isInteger(draft.restDays) ||
        !Number.isInteger(draft.lightDays) ||
        draft.restDays < 0 ||
        draft.lightDays < 0 ||
        draft.restDays > 365 ||
        draft.lightDays > 365)
    ) {
      setError("Enter whole rest and light day counts between 0 and 365.");
      return;
    }
    if (
      draft &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(draft.startDate) ||
        Number.isNaN(new Date(`${draft.startDate}T12:00:00`).getTime()) ||
        new Date(`${draft.startDate}T12:00:00`).getDate() !== Number(draft.startDate.slice(-2)))
    ) {
      setError("Enter a valid start date in YYYY-MM-DD format.");
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      await saveRecovery(draft);
      if (active.current) onClose();
    } catch (cause) {
      if (active.current)
        setError(
          `${cause instanceof Error ? cause.message : "Could not save recovery."} Please try again.`,
        );
    } finally {
      busy.current = false;
      if (active.current) setPending(false);
    }
  }

  return (
    <Sheet visible={visible} title="Recovery plan" onClose={close}>
      <Text style={styles.body}>
        Choose your recovery schedule. Follow advice from your healthcare professional.
      </Text>
      {loading ? <Text style={styles.body}>Loading recovery plan…</Text> : null}
      {loadError ? (
        <Text accessibilityRole="alert">
          {loadError} Close this sheet and retry loading your health data.
        </Text>
      ) : null}

      <View style={styles.chips}>
        {options.map((area) => {
          const active = area === (draft?.area ?? NONE);
          return (
            <Pressable
              key={area}
              style={[styles.chip, active && styles.chipActive]}
              disabled={pending || loading || !!loadError}
              onPress={() => {
                if (active) return;
                dirty.current = true;
                setDraft(area === NONE ? null : createRecovery(area));
              }}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{area}</Text>
            </Pressable>
          );
        })}
      </View>

      {draft ? (
        <RecoveryDetails
          draft={draft}
          onChange={(next) => {
            dirty.current = true;
            setDraft(next);
          }}
          disabled={pending || loading || !!loadError}
        />
      ) : (
        <Text style={styles.selectedNote}>No recovery plan. Your workouts continue as normal.</Text>
      )}
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}

      <SheetActions
        primaryLabel="Save recovery plan"
        secondaryLabel="Cancel"
        onPrimary={handleSave}
        onSecondary={close}
      />
    </Sheet>
  );
}

function RecoveryDetails({
  draft,
  onChange,
  disabled,
}: {
  draft: RecoveryPlan;
  onChange: (next: RecoveryPlan) => void;
  disabled: boolean;
}) {
  return (
    <>
      <View style={styles.selectedArea}>
        <View style={styles.selectedCopy}>
          <Text style={styles.selectedTitle}>{draft.area}</Text>
          <TextInput
            style={styles.selectedNote}
            value={draft.note}
            placeholder="Optional recovery note"
            maxLength={2000}
            editable={!disabled}
            onChangeText={(note) => onChange({ ...draft, note })}
          />
        </View>
      </View>

      <View style={styles.pair}>
        <View style={styles.pairItem}>
          <SheetField label="Rest days">
            <TextInput
              accessibilityLabel="Rest days"
              style={styles.value}
              value={String(draft.restDays)}
              keyboardType="number-pad"
              editable={!disabled}
              onChangeText={(value) => onChange({ ...draft, restDays: Number(value) })}
            />
          </SheetField>
        </View>
        <View style={styles.pairItem}>
          <SheetField label="Light days">
            <TextInput
              accessibilityLabel="Light days"
              style={styles.value}
              value={String(draft.lightDays)}
              keyboardType="number-pad"
              editable={!disabled}
              onChangeText={(value) => onChange({ ...draft, lightDays: Number(value) })}
            />
          </SheetField>
        </View>
      </View>

      <SheetField label="Start date · YYYY-MM-DD">
        <TextInput
          accessibilityLabel="Recovery start date"
          style={styles.value}
          value={draft.startDate}
          editable={!disabled}
          onChangeText={(startDate) => onChange({ ...draft, startDate })}
        />
      </SheetField>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tentative return · if ready</Text>
        <Text style={styles.summaryValue}>
          {dateLabel(draft.startDate, draft.restDays + draft.lightDays)}
        </Text>
      </View>

      <View style={styles.warning}>
        <Image source={icons.shieldCheck} style={styles.warningIcon} contentFit="contain" />
        <Text style={styles.warningText}>
          Your recovery schedule adjusts workout suggestions. If pain persists or worsens, seek
          medical advice.
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontWeight: "600",
    color: C.text,
  },
  selectedNote: {
    fontSize: 11,
    color: C.textMuted,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontWeight: "600",
    color: C.accent,
  },
  pair: {
    flexDirection: "row",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  warning: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
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
