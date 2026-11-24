import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import { Sheet, SheetActions } from "@/components/ui/sheet"
import { WheelPicker } from "@/components/ui/wheel-picker"
import { Palette as C } from "@/theme"

import { localDate } from "../hooks/meals-hooks"
import { dayLabel, daysBetween, shiftDateKey } from "../utils/meal-journal"

const MIN_DAYS_BACK = 30
const pad = (value: number) => String(value).padStart(2, "0")
const hours = Array.from({ length: 24 }, (_, index) => index)
const minutes = Array.from({ length: 60 }, (_, index) => index)

type Parts = { dayOffset: number; hour: number; minute: number }

const toParts = (date: Date, todayKey: string): Parts => ({
  dayOffset: daysBetween(todayKey, localDate(date)),
  hour: date.getHours(),
  minute: date.getMinutes(),
})

export function toDate({ dayOffset, hour, minute }: Parts, todayKey: string) {
  const [year, month, day] = shiftDateKey(todayKey, dayOffset).split("-").map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

/** Day, hour and minute wheels for moving a logged meal. Future times are unavailable. */
export function MealTimeSheet({
  visible,
  value,
  pending,
  error,
  onClose,
  onSave,
  now = new Date(),
}: {
  visible: boolean
  value: Date
  pending: boolean
  error: string | null
  onClose: () => void
  onSave: (next: Date) => void
  now?: Date
}) {
  const todayKey = localDate(now)
  const [parts, setParts] = useState(() => toParts(value, todayKey))
  useEffect(() => {
    if (visible) setParts(toParts(value, todayKey))
    // Reset only when the sheet opens; `value` changes after a save while it closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const oldest = Math.min(-MIN_DAYS_BACK, parts.dayOffset)
  const days = Array.from({ length: -oldest + 1 }, (_, index) => oldest + index)
  const today = parts.dayOffset === 0
  const future = toDate(parts, todayKey).getTime() > now.getTime()

  return (
    <Sheet visible={visible} title="Meal time" onClose={onClose}>
      <View style={styles.quick}>
        {[
          { offset: 0, label: "Today" },
          { offset: -1, label: "Yesterday" },
        ].map(({ offset, label }) => {
          const selected = parts.dayOffset === offset
          return (
            <Pressable
              key={label}
              testID={`meal-time-${label.toLowerCase()}`}
              accessibilityRole="button"
              accessibilityLabel={`Set day to ${label.toLowerCase()}`}
              accessibilityState={{ selected }}
              onPress={() => setParts((previous) => ({ ...previous, dayOffset: offset }))}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
            </Pressable>
          )
        })}
      </View>
      <View style={styles.picker}>
        <WheelPicker
          style={styles.day}
          label="Day"
          values={days}
          value={parts.dayOffset}
          onChange={(dayOffset) => setParts((previous) => ({ ...previous, dayOffset }))}
          format={(offset) => dayLabel(shiftDateKey(todayKey, offset), todayKey)}
          showActions={false}
        />
        <WheelPicker
          style={styles.column}
          label="Hour"
          values={hours}
          value={parts.hour}
          onChange={(hour) => setParts((previous) => ({ ...previous, hour }))}
          format={pad}
          showActions={false}
          isUnavailable={(hour) => today && hour > now.getHours()}
        />
        <WheelPicker
          style={styles.column}
          label="Minute"
          values={minutes}
          value={parts.minute}
          onChange={(minute) => setParts((previous) => ({ ...previous, minute }))}
          format={pad}
          showActions={false}
          isUnavailable={(minute) =>
            today && parts.hour === now.getHours() && minute > now.getMinutes()
          }
        />
      </View>
      {future ? (
        <Text accessibilityRole="alert" style={styles.note}>
          Choose a time that is not in the future.
        </Text>
      ) : error ? (
        <Text accessibilityRole="alert" style={styles.note}>
          {error}
        </Text>
      ) : (
        <Text style={styles.hint}>The meal moves to the day you pick.</Text>
      )}
      <SheetActions
        primaryLabel="Save"
        secondaryLabel="Cancel"
        primaryAccessibilityLabel="Save meal time"
        primaryDisabled={future || pending}
        busy={pending}
        onPrimary={() => onSave(toDate(parts, todayKey))}
        onSecondary={onClose}
      />
    </Sheet>
  )
}

const styles = StyleSheet.create({
  quick: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: C.accentTint,
    borderColor: C.accentBorder,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textMuted,
  },
  chipLabelSelected: {
    color: C.accent,
  },
  picker: {
    flexDirection: "row",
    overflow: "hidden",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    backgroundColor: C.surface,
  },
  day: {
    flex: 2,
  },
  column: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
    color: C.textMuted,
  },
  note: {
    fontSize: 12,
    color: C.accent,
  },
})
