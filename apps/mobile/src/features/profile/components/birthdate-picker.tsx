import { StyleSheet, Text, View } from "react-native"

import { WheelPicker } from "@/components/ui/wheel-picker"
import { Palette as C } from "@/theme"

export type BirthdateParts = { day: number; month: number; year: number }

const MIN_YEAR = 1900
const pad = (value: number) => String(value).padStart(2, "0")
const daysIn = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate()

export const DEFAULT_BIRTHDATE: BirthdateParts = { day: 1, month: 1, year: 2000 }

export function birthdateParts(iso: string | null | undefined): BirthdateParts {
  const match = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null
  if (!match) return DEFAULT_BIRTHDATE
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
  return parts.month >= 1 && parts.month <= 12 && parts.day >= 1 && parts.day <= 31
    ? parts
    : DEFAULT_BIRTHDATE
}

export function birthdateToIso({ day, month, year }: BirthdateParts) {
  return `${year}-${pad(month)}-${pad(day)}`
}

/** Day, month and year wheels (DD-MM-YYYY), styled like the Height picker. */
export function BirthdatePicker({
  value,
  onChange,
  today = new Date(),
}: {
  value: BirthdateParts
  onChange: (next: BirthdateParts) => void
  today?: Date
}) {
  const currentYear = today.getUTCFullYear()
  const currentMonth = today.getUTCMonth() + 1
  const currentDay = today.getUTCDate()
  const maxDay = daysIn(value.year, value.month)
  const day = Math.min(value.day, maxDay)
  const days = Array.from({ length: maxDay }, (_, index) => index + 1)
  const months = Array.from({ length: 12 }, (_, index) => index + 1)
  const years = Array.from(
    { length: Math.max(1, currentYear - MIN_YEAR + 1) },
    (_, index) => MIN_YEAR + index,
  )
  const inCurrentYear = value.year === currentYear
  const inCurrentMonth = inCurrentYear && value.month === currentMonth

  function change(next: Partial<BirthdateParts>) {
    const merged = { ...value, day, ...next }
    onChange({ ...merged, day: Math.min(merged.day, daysIn(merged.year, merged.month)) })
  }

  return (
    <View>
      <View style={styles.headings}>
        {["DD", "MM", "YYYY"].map((heading, index) => (
          <Text key={heading} style={[styles.heading, index === 2 && styles.wide]}>
            {heading}
          </Text>
        ))}
      </View>
      <View style={styles.picker}>
        <WheelPicker
          style={styles.column}
          label="Day"
          values={days}
          value={day}
          onChange={(next) => change({ day: next })}
          format={pad}
          showActions={false}
          isUnavailable={(item) => inCurrentMonth && item > currentDay}
        />
        <WheelPicker
          style={styles.column}
          label="Month"
          values={months}
          value={value.month}
          onChange={(next) => change({ month: next })}
          format={pad}
          showActions={false}
          isUnavailable={(item) => inCurrentYear && item > currentMonth}
        />
        <WheelPicker
          style={[styles.column, styles.wide]}
          label="Year"
          values={years}
          value={value.year}
          onChange={(next) => change({ year: next })}
          format={String}
          showActions={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headings: { flexDirection: "row", paddingHorizontal: 8, marginBottom: 8 },
  heading: { flex: 1, textAlign: "center", fontSize: 13, fontWeight: "500", color: C.textMuted },
  picker: {
    flexDirection: "row",
    overflow: "hidden",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    backgroundColor: C.surface,
  },
  column: { flex: 1 },
  wide: { flex: 1.4 },
})
