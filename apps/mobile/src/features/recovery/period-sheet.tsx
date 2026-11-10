import { useState } from "react"
import { StyleSheet, Text } from "react-native"

import { Sheet, SheetActions } from "@/components/sheet"
import { Palette as C } from "@/theme"

import { PERIOD_FEELINGS, type PeriodFeeling } from "./injuries"
import { OptionList } from "./option-list"

const days = (count: number) => `${count} ${count === 1 ? "day" : "days"}`

const OPTIONS = (Object.keys(PERIOD_FEELINGS) as PeriodFeeling[]).map((value) => {
  const { excludeDays, lightDays } = PERIOD_FEELINGS[value]
  const light = `for ${days(lightDays)}`
  const detail = excludeDays
    ? `Rest ${excludeDays === 1 ? "today" : days(excludeDays)}, then light ${light}`
    : `Light ${light}`
  return { value, detail }
})

/** Asks how the user feels and adds period recovery to match. */
export function PeriodSheet({
  visible,
  onClose,
  onBack,
  onAdd,
}: {
  visible: boolean
  onClose: () => void
  /** Shows "Back" instead of "Cancel" when this is a step of another sheet. */
  onBack?: () => void
  onAdd: (feeling: PeriodFeeling) => void
}) {
  const [feeling, setFeeling] = useState<PeriodFeeling>("Tired or crampy")
  return (
    <Sheet visible={visible} title="How are you feeling?" onClose={onClose}>
      <Text style={styles.muted}>Feeling fine? No need to add it, train as usual.</Text>
      <OptionList options={OPTIONS} value={feeling} onChange={setFeeling} />
      <Text style={styles.muted}>
        Used only to adjust your plan. You can change the days anytime.
      </Text>
      <SheetActions
        primaryLabel="Add"
        secondaryLabel={onBack ? "Back" : "Cancel"}
        onPrimary={() => onAdd(feeling)}
        onSecondary={onBack ?? onClose}
      />
    </Sheet>
  )
}

const styles = StyleSheet.create({
  muted: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
  },
})
