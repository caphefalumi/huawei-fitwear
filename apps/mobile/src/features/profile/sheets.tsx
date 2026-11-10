import * as Sentry from "@sentry/react-native"
import { useEffect, useRef, useState } from "react"
import { Alert, StyleSheet, Text, TextInput, View } from "react-native"

import { RadioList } from "@/components/ui/radio-list"
import { Sheet, SheetActions, SheetField } from "@/components/ui/sheet"
import { WheelPicker } from "@/components/ui/wheel-picker"
import { ACTIVITIES, GOALS, useHealth, type Sex } from "@/features/health"
import { PERIOD_AREA, useInjuries } from "@/features/recovery"
import {
  EMPHASES,
  emphasisFor,
  EXPERIENCES,
  SESSION_MINUTES,
  usePlanPreferences,
} from "@/features/workout"
import { apiErrorMessage } from "@/lib/api/client"
import { Palette as C } from "@/theme"

const ACTIVITY_OPTIONS = Object.values(ACTIVITIES)
const GOAL_OPTIONS = Object.values(GOALS)
const SEX_OPTIONS: readonly Sex[] = ["Male", "Female", "Rather not say"]
const SESSION_VALUES = [1, 2, 3, 4, 5, 6]
const HEIGHT_VALUES = Array.from({ length: 221 }, (_, index) => index + 80)
type SheetProps = { visible: boolean; onClose: () => void; onDismiss?: () => void }

function useSave(onClose: () => void) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const active = useRef(true)
  const busy = useRef(false)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])
  const save = async (mutation: () => Promise<void>) => {
    if (busy.current) return
    busy.current = true
    setPending(true)
    setError(null)
    try {
      await mutation()
      if (active.current) onClose()
    } catch (cause) {
      Sentry.captureException(cause)
      if (active.current) setError(apiErrorMessage(cause, "your profile", "save"))
    } finally {
      busy.current = false
      if (active.current) setPending(false)
    }
  }
  return {
    error,
    pending,
    save,
    close: () => {
      if (!busy.current) onClose()
    },
  }
}

function positiveNumber(value: string, maximum: number, minimum = 0) {
  const number = Number(value.trim().replace(",", "."))
  if (!Number.isFinite(number) || number <= 0 || number < minimum || number > maximum) {
    throw new Error(
      minimum > 0
        ? `Enter a number from ${minimum} to ${maximum}.`
        : `Enter a number greater than 0 and no more than ${maximum}.`,
    )
  }
  return number
}

function NumberField({
  value,
  onChange,
  unit,
}: {
  value: string
  onChange: (next: string) => void
  unit: string
}) {
  return (
    <View style={styles.inputRow}>
      <TextInput
        accessibilityLabel={unit === "cm" ? "Height in centimeters" : "Weight in kilograms"}
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        selectTextOnFocus
      />
      <Text style={styles.unit}>{unit}</Text>
    </View>
  )
}

export function HeightSheet({ visible, onClose, onDismiss }: SheetProps) {
  const { heightCm, saveHeight } = useHealth()
  const [draft, setDraft] = useState(heightCm ?? 170)
  const action = useSave(onClose)
  return (
    <Sheet visible={visible} title="Height" onClose={action.close} onDismiss={onDismiss}>
      <View style={styles.heightPicker}>
        <WheelPicker
          label="Height"
          values={HEIGHT_VALUES}
          value={draft}
          onChange={setDraft}
          format={(value) => `${value} cm`}
          showActions={false}
        />
      </View>
      <Text style={styles.body}>Height contributes to your initial energy estimate.</Text>
      {action.error ? <Text accessibilityRole="alert">{action.error}</Text> : null}
      <SheetActions
        primaryDisabled={action.pending}
        secondaryDisabled={action.pending}
        busy={action.pending}
        primaryLabel="OK"
        secondaryLabel="Cancel"
        onPrimary={() => {
          void action.save(async () => saveHeight(draft))
        }}
        onSecondary={action.close}
      />
    </Sheet>
  )
}

export function WeightSheet({ visible, onClose, onDismiss }: SheetProps) {
  const { weightKg, weights, saveWeight } = useHealth()
  const [draft, setDraft] = useState(weightKg?.toFixed(1) ?? "")
  const action = useSave(onClose)
  return (
    <Sheet visible={visible} title="Update weight" onClose={action.close} onDismiss={onDismiss}>
      <Text style={styles.body}>Log your weight to keep your nutrition guidance current.</Text>
      <SheetField
        label={
          weights.at(-1) ? `Current · ${weights.at(-1)!.loggedDate}` : "Current profile weight"
        }
      >
        <Text style={styles.current}>
          {weightKg === null ? "Not set" : `${weightKg.toFixed(1)} kg`}
        </Text>
      </SheetField>
      <SheetField label="New weight · today">
        <NumberField value={draft} onChange={setDraft} unit="kg" />
      </SheetField>
      <Text style={styles.note}>Nutrition targets use your latest profile information.</Text>
      {action.error ? <Text accessibilityRole="alert">{action.error}</Text> : null}
      <SheetActions
        primaryDisabled={action.pending}
        secondaryDisabled={action.pending}
        busy={action.pending}
        primaryLabel="Save update"
        secondaryLabel="Cancel"
        onPrimary={() => {
          void action.save(async () => saveWeight(positiveNumber(draft, 500, 20)))
        }}
        onSecondary={action.close}
      />
    </Sheet>
  )
}

export function SexSheet({ visible, onClose, onDismiss }: SheetProps) {
  const { sex, saveSex } = useHealth()
  const inPeriod = useInjuries((state) => state.injuries.some((i) => i.area === PERIOD_AREA))
  const removeInjury = useInjuries((state) => state.remove)
  const action = useSave(onClose)
  const changeSex = (next: Sex) => {
    void action.save(async () => {
      await saveSex(next)
      if (next !== "Female") removeInjury(PERIOD_AREA)
    })
  }
  return (
    <Sheet visible={visible} title="Sex" onClose={action.close} onDismiss={onDismiss}>
      <RadioList
        options={SEX_OPTIONS}
        value={sex ?? ("" as Sex)}
        onChange={(next) => {
          if (next !== "Female" && inPeriod) {
            Alert.alert(
              "Remove period recovery data?",
              "Changing this will remove your period recovery settings.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Change and remove", onPress: () => changeSex(next) },
              ],
            )
            return
          }
          changeSex(next)
        }}
      />
      {action.error ? <Text accessibilityRole="alert">{action.error}</Text> : null}
    </Sheet>
  )
}

export function GoalSheet({ visible, onClose, onDismiss }: SheetProps) {
  const { plan, savePlan } = useHealth()
  const action = useSave(onClose)
  return (
    <Sheet visible={visible} title="Goal / target" onClose={action.close} onDismiss={onDismiss}>
      <RadioList
        options={GOAL_OPTIONS}
        value={plan.goal as (typeof GOAL_OPTIONS)[number]}
        onChange={(goal) => {
          void action.save(() => savePlan({ ...plan, goal }))
        }}
      />
      {action.error ? <Text accessibilityRole="alert">{action.error}</Text> : null}
    </Sheet>
  )
}

export function ActivitySheet({ visible, onClose, onDismiss }: SheetProps) {
  const { plan, savePlan } = useHealth()
  const action = useSave(onClose)
  return (
    <Sheet visible={visible} title="Daily activity" onClose={action.close} onDismiss={onDismiss}>
      <RadioList
        options={ACTIVITY_OPTIONS}
        value={plan.activity as (typeof ACTIVITY_OPTIONS)[number]}
        onChange={(activity) => {
          void action.save(() => savePlan({ ...plan, activity }))
        }}
      />
      {action.error ? <Text accessibilityRole="alert">{action.error}</Text> : null}
    </Sheet>
  )
}

export function FrequencySheet({ visible, onClose, onDismiss }: SheetProps) {
  const { plan, savePlan } = useHealth()
  const [draft, setDraft] = useState(
    Math.min(plan.sessions ?? SESSION_VALUES[0], SESSION_VALUES.length),
  )
  const action = useSave(onClose)
  return (
    <Sheet visible={visible} title="Workout frequency" onClose={action.close} onDismiss={onDismiss}>
      <WheelPicker
        label="Workout frequency"
        values={SESSION_VALUES}
        value={draft}
        onChange={setDraft}
        format={(value) => `${value} ${value === 1 ? "session" : "sessions"}/week`}
      />
      {action.error ? <Text accessibilityRole="alert">{action.error}</Text> : null}
      <SheetActions
        primaryDisabled={action.pending}
        secondaryDisabled={action.pending}
        busy={action.pending}
        primaryLabel="OK"
        secondaryLabel="Cancel"
        onPrimary={() => {
          void action.save(() => savePlan({ ...plan, sessions: draft }))
        }}
        onSecondary={action.close}
      />
    </Sheet>
  )
}

export function SessionLengthSheet({ visible, onClose, onDismiss }: SheetProps) {
  const { minutes, setMinutes } = usePlanPreferences()
  const [draft, setDraft] = useState(minutes)
  const action = useSave(onClose)
  return (
    <Sheet visible={visible} title="Session length" onClose={action.close} onDismiss={onDismiss}>
      <WheelPicker
        label="Session length"
        values={SESSION_MINUTES}
        value={draft}
        onChange={setDraft}
        format={(value) => `${value} min`}
      />
      <SheetActions
        primaryDisabled={action.pending}
        secondaryDisabled={action.pending}
        busy={action.pending}
        primaryLabel="OK"
        secondaryLabel="Cancel"
        onPrimary={() => {
          void action.save(async () => setMinutes(draft))
        }}
        onSecondary={action.close}
      />
    </Sheet>
  )
}

export function EmphasisSheet({ visible, onClose, onDismiss }: SheetProps) {
  const { sex } = useHealth()
  const emphasis = usePlanPreferences((state) => emphasisFor(state.emphasis, sex))
  const setEmphasis = usePlanPreferences((state) => state.setEmphasis)
  return (
    <Sheet visible={visible} title="Emphasis" onClose={onClose} onDismiss={onDismiss}>
      <RadioList
        options={EMPHASES}
        value={emphasis}
        onChange={(next) => {
          setEmphasis(next)
          onClose()
        }}
      />
      <Text style={styles.body}>Lower body gives glutes and hamstrings more of each session.</Text>
    </Sheet>
  )
}

export function ExperienceSheet({ visible, onClose, onDismiss }: SheetProps) {
  const experience = usePlanPreferences((state) => state.experience)
  const setExperience = usePlanPreferences((state) => state.setExperience)
  return (
    <Sheet visible={visible} title="Experience" onClose={onClose} onDismiss={onDismiss}>
      <RadioList
        options={EXPERIENCES}
        value={experience}
        onChange={(next) => {
          setExperience(next)
          onClose()
        }}
      />
      <Text style={styles.body}>Beginner uses easier variations and fewer sets.</Text>
    </Sheet>
  )
}

export function TargetWeightSheet({ visible, onClose, onDismiss }: SheetProps) {
  const { plan, savePlan } = useHealth()
  const [draft, setDraft] = useState(plan.targetWeightKg?.toFixed(1) ?? "")
  const action = useSave(onClose)
  return (
    <Sheet visible={visible} title="Target weight" onClose={action.close} onDismiss={onDismiss}>
      <SheetField label="Target weight">
        <NumberField value={draft} onChange={setDraft} unit="kg" />
      </SheetField>
      {action.error ? <Text accessibilityRole="alert">{action.error}</Text> : null}
      <SheetActions
        primaryDisabled={action.pending}
        secondaryDisabled={action.pending}
        busy={action.pending}
        primaryLabel="Save"
        secondaryLabel="Cancel"
        onPrimary={() => {
          void action.save(async () =>
            savePlan({ ...plan, targetWeightKg: positiveNumber(draft, 1000) }),
          )
        }}
        onSecondary={action.close}
      />
    </Sheet>
  )
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
    fontWeight: "600",
    color: C.text,
  },
  heightPicker: {
    overflow: "hidden",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    backgroundColor: C.surface,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: "600",
    color: C.text,
    padding: 0,
  },
  unit: {
    fontSize: 13,
    color: C.textMuted,
  },
})
