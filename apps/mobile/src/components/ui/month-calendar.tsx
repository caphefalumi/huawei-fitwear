import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"]

const pad = (value: number) => String(value).padStart(2, "0")
const keyOf = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`
const dayOf = (key: string) => Number(key.slice(8, 10))

/** Monday-first grid of the month containing `month`, padded with nulls. */
export function monthGrid(month: Date) {
  const year = month.getFullYear()
  const index = month.getMonth()
  const first = new Date(year, index, 1, 12)
  const days = new Date(year, index + 1, 0).getDate()
  const cells: (string | null)[] = Array.from({ length: (first.getDay() + 6) % 7 }, () => null)
  for (let day = 1; day <= days; day += 1) cells.push(keyOf(year, index, day))
  while (cells.length % 7) cells.push(null)
  return cells
}

const shiftMonth = (month: Date, by: number) =>
  new Date(month.getFullYear(), month.getMonth() + by, 1, 12)

/**
 * Month grid with previous and next month arrows. Days are `YYYY-MM-DD` keys in local time.
 * `marked` adds a dot under the date, `inRange` tints a span, and `today` gets a ring.
 */
export function MonthCalendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  isDisabled,
  inRange,
  marked,
  today,
  canGoNext = true,
  dayLabel,
}: {
  month: Date
  onMonthChange: (next: Date) => void
  selected?: string
  onSelect: (key: string) => void
  isDisabled?: (key: string) => boolean
  inRange?: (key: string) => boolean
  marked?: (key: string) => boolean
  today?: string
  canGoNext?: boolean
  dayLabel?: (key: string) => string
}) {
  return (
    <View style={styles.calendar}>
      <View style={styles.monthRow}>
        <Pressable
          hitSlop={10}
          accessibilityLabel="Previous month"
          onPress={() => onMonthChange(shiftMonth(month, -1))}
        >
          <Text style={styles.monthArrow}>‹</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.monthTitle}>
          {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </Text>
        <Pressable
          hitSlop={10}
          disabled={!canGoNext}
          accessibilityLabel="Next month"
          onPress={() => onMonthChange(shiftMonth(month, 1))}
        >
          <Text style={[styles.monthArrow, !canGoNext && styles.monthArrowOff]}>›</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {WEEKDAYS.map((day, index) => (
          <Text key={`${day}${index}`} style={[styles.cell, styles.weekday]}>
            {day}
          </Text>
        ))}
        {monthGrid(month).map((key, index) => {
          if (!key) return <View key={`pad${index}`} style={styles.cell} />
          const disabled = isDisabled?.(key) ?? false
          const picked = key === selected
          const dot = marked?.(key) ?? false
          return (
            <Pressable
              key={key}
              testID={`calendar-day-${key}`}
              disabled={disabled}
              style={[styles.cell, inRange?.(key) && styles.cellRange]}
              accessibilityState={{ selected: picked, disabled }}
              accessibilityLabel={dayLabel?.(key) ?? key}
              onPress={() => onSelect(key)}
            >
              <View
                style={[
                  styles.day,
                  key === today && !picked && styles.dayToday,
                  picked && styles.dayPicked,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    disabled && styles.dayDisabled,
                    picked && styles.dayTextPicked,
                  ]}
                >
                  {dayOf(key)}
                </Text>
              </View>
              {marked ? (
                <View
                  style={[styles.dot, dot && styles.dotOn, dot && picked && styles.dotPicked]}
                />
              ) : null}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  calendar: {
    gap: 8,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthArrow: {
    fontSize: 24,
    paddingHorizontal: 8,
    color: C.accent,
  },
  monthArrowOff: {
    color: C.track,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    minWidth: 0,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
  weekday: {
    fontSize: 11,
    color: C.textMuted,
    lineHeight: 44,
  },
  cellRange: {
    backgroundColor: C.accentTint,
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: C.accent,
  },
  dayPicked: {
    backgroundColor: C.accent,
  },
  dayText: {
    fontSize: 14,
    color: C.text,
  },
  dayDisabled: {
    color: C.border,
  },
  dayTextPicked: {
    color: C.onAccent,
    fontWeight: "700",
  },
  dot: {
    position: "absolute",
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotOn: {
    backgroundColor: C.accent,
  },
  dotPicked: {
    backgroundColor: C.accent,
  },
})
