import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import {
  createInjury,
  injuryEffect,
  PERIOD_AREA,
  type InjuryArea,
  type PhaseDays,
} from "../hooks/injuries"

const MAX_DAYS = 60
export const CUSTOM = "Custom"
export const CUSTOM_OPTION = { value: CUSTOM, detail: "Choose the days for each phase" } as const

/** Whether custom days add anything to the plan. */
export const hasDays = (days: PhaseDays) => days.excludeDays + days.lightDays > 0

function Stepper({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: number
  onChange: (next: number) => void
}) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <Pressable
        style={styles.step}
        disabled={value <= 0}
        accessibilityLabel={`Fewer ${label.toLowerCase()} days`}
        onPress={() => onChange(value - 1)}
      >
        <Text style={[styles.stepText, value <= 0 && styles.stepOff]}>−</Text>
      </Pressable>
      <Text style={styles.value} accessibilityLabel={`${label}, ${value} days`}>
        {value}
        <Text style={styles.unit}> {value === 1 ? "day" : "days"}</Text>
      </Text>
      <Pressable
        style={styles.step}
        disabled={value >= MAX_DAYS}
        accessibilityLabel={`More ${label.toLowerCase()} days`}
        onPress={() => onChange(value + 1)}
      >
        <Text style={[styles.stepText, value >= MAX_DAYS && styles.stepOff]}>+</Text>
      </Pressable>
    </View>
  )
}

/** Day steppers for each phase, with the resulting change in the plan spelled out. */
export function CustomDays({
  area,
  today,
  value,
  onChange,
}: {
  area: InjuryArea
  today: string
  value: PhaseDays
  onChange: (next: PhaseDays) => void
}) {
  const period = area === PERIOD_AREA
  return (
    <View style={styles.box}>
      <Stepper
        label={period ? "Rest" : "Exclude"}
        hint={period ? "Rest days first" : "Skip these exercises first"}
        value={value.excludeDays}
        onChange={(excludeDays) => onChange({ ...value, excludeDays })}
      />
      <Stepper
        label="Light"
        hint="Then 3 → 2 sets"
        value={value.lightDays}
        onChange={(lightDays) => onChange({ ...value, lightDays })}
      />
      <Text style={styles.summary}>
        {hasDays(value)
          ? injuryEffect(createInjury(area, value, today), today)
          : "Add at least one day."}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 14,
    backgroundColor: C.background,
    padding: 12,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  hint: {
    fontSize: 11,
    color: C.textMuted,
  },
  step: {
    width: 40,
    height: 40,
    minWidth: 40,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: "center",
  },
  stepText: {
    fontSize: 20,
    color: C.accent,
    textAlign: "center",
  },
  stepOff: {
    color: C.track,
  },
  value: {
    minWidth: 64,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: C.text,
  },
  unit: {
    fontSize: 12,
    fontWeight: "400",
    color: C.textMuted,
  },
  summary: {
    paddingTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: C.text,
  },
})
