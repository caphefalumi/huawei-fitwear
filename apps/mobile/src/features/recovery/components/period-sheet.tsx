import { useState } from "react"
import { StyleSheet, Text } from "react-native"

import { Sheet, SheetActions } from "@/components/ui/sheet"
import { dateKey } from "@/features/health"
import { Palette as C } from "@/theme"

import { PERIOD_AREA, PERIOD_FEELINGS, type PeriodFeeling, type PhaseDays } from "../hooks/injuries"
import { CUSTOM, CUSTOM_OPTION, CustomDays, hasDays } from "./custom-days"
import { OptionList } from "./option-list"

const days = (count: number) => `${count} ${count === 1 ? "day" : "days"}`

const OPTIONS = [
  ...(Object.keys(PERIOD_FEELINGS) as PeriodFeeling[]).map((value) => {
    const { excludeDays, lightDays } = PERIOD_FEELINGS[value]
    const light = `for ${days(lightDays)}`
    const detail = excludeDays
      ? `Rest ${excludeDays === 1 ? "today" : days(excludeDays)}, then light ${light}`
      : `Light ${light}`
    return { value, detail }
  }),
  CUSTOM_OPTION,
]
type Choice = PeriodFeeling | typeof CUSTOM

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
  onAdd: (option: PeriodFeeling | PhaseDays) => void
}) {
  const [choice, setChoice] = useState<Choice>("Tired or crampy")
  const [custom, setCustom] = useState<PhaseDays>(PERIOD_FEELINGS["Tired or crampy"])
  const isCustom = choice === CUSTOM
  return (
    <Sheet visible={visible} title="How are you feeling?" onClose={onClose}>
      <Text style={styles.muted}>Feeling fine? No need to add it, train as usual.</Text>
      <OptionList
        options={OPTIONS}
        value={choice}
        onChange={(next) => {
          // Custom starts from the option the user had picked.
          if (next === CUSTOM && choice !== CUSTOM) setCustom(PERIOD_FEELINGS[choice])
          setChoice(next)
        }}
      />
      {isCustom ? (
        <CustomDays area={PERIOD_AREA} today={dateKey()} value={custom} onChange={setCustom} />
      ) : null}
      <Text style={styles.muted}>
        Used only to adjust your plan. You can change the days anytime.
      </Text>
      <SheetActions
        primaryLabel="Add"
        secondaryLabel={onBack ? "Back" : "Cancel"}
        primaryDisabled={isCustom && !hasDays(custom)}
        onPrimary={() => onAdd(isCustom ? custom : choice)}
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
