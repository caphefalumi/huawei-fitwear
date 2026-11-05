import { useEffect, useRef, useState, type ElementRef } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

import { Palette as AuthColors } from "@/theme"

const ORDER = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "numeric",
  year: "numeric",
})
  .formatToParts(new Date())
  .flatMap(({ type }) => (type === "day" || type === "month" || type === "year" ? [type] : []))

type DateParts = { day: string; month: string; year: string }

function parseISO(value: string): DateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match
    ? { year: match[1], month: match[2], day: match[3] }
    : { day: "", month: "", year: "" }
}

export function DateOfBirthField({
  value,
  onChange,
  error,
  editable = true,
}: {
  value: string
  onChange: (isoDate: string) => void
  error?: string | null
  editable?: boolean
}) {
  const refs = useRef<Record<keyof DateParts, ElementRef<typeof TextInput> | null>>({
    day: null,
    month: null,
    year: null,
  })
  const [parts, setParts] = useState(() => parseISO(value))
  useEffect(() => {
    if (value) setParts(parseISO(value))
  }, [value])

  function commit(next: DateParts) {
    setParts(next)
    onChange(
      next.year.length === 4 && next.month && next.day
        ? `${next.year}-${next.month.padStart(2, "0")}-${next.day.padStart(2, "0")}`
        : "",
    )
  }

  function handleInput(field: keyof DateParts, raw: string) {
    const digits = raw.replace(/\D/g, "")
    if (digits.length >= 8) {
      const yearFirst = /^(\d{4})[-/. ]?(\d{1,2})[-/. ]?(\d{1,2})$/.exec(raw.trim())
      const localeOrder = /^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/.exec(raw.trim())
      const pasted = yearFirst
        ? { year: yearFirst[1], month: yearFirst[2], day: yearFirst[3] }
        : localeOrder
          ? {
              day: ORDER[0] === "day" ? localeOrder[1] : localeOrder[2],
              month: ORDER[0] === "month" ? localeOrder[1] : localeOrder[2],
              year: localeOrder[3],
            }
          : null
      if (pasted) {
        commit(pasted)
        refs.current.year?.blur()
        return
      }
    }
    const limit = field === "year" ? 4 : 2
    const next = { ...parts, [field]: digits.slice(0, limit) }
    commit(next)
    const invalidSecondDigit =
      digits.length === 1 &&
      ((field === "day" && Number(digits) >= 4) || (field === "month" && Number(digits) >= 2))
    if (field !== "year" && (digits.length >= limit || invalidSecondDigit)) {
      if (field === "day" && next.day.length === 1) next.day = next.day.padStart(2, "0")
      if (field === "month" && next.month.length === 1) next.month = next.month.padStart(2, "0")
      commit(next)
      refs.current[field === "day" ? "month" : "year"]?.focus()
    }
  }

  function focusPrevious(field: keyof DateParts) {
    if (field === "month" && parts.month.length === 0) {
      refs.current.day?.focus()
      commit({ ...parts, day: parts.day.slice(0, -1) })
    } else if (field === "year" && parts.year.length === 0) {
      refs.current.month?.focus()
      commit({ ...parts, month: parts.month.slice(0, -1) })
    }
  }

  const fieldWidths = { day: 1, month: 1, year: 2 } as const
  const placeholders = { day: "DD", month: "MM", year: "YYYY" } as const

  return (
    <View style={styles.group}>
      <Text style={styles.label}>Date of birth</Text>
      <View style={styles.row}>
        {ORDER.map((field, index) => (
          <TextInput
            key={field}
            ref={(node) => {
              refs.current[field] = node
            }}
            accessibilityLabel={field === "day" ? "Day" : field === "month" ? "Month" : "Year"}
            accessibilityHint="Enter numbers only"
            keyboardType="number-pad"
            inputMode="numeric"
            maxLength={field === "year" ? 8 : 10}
            placeholder={placeholders[field]}
            placeholderTextColor={AuthColors.textMuted}
            value={parts[field]}
            editable={editable}
            selectTextOnFocus
            returnKeyType={index === ORDER.length - 1 ? "done" : "next"}
            onChangeText={(text) => handleInput(field, text)}
            onBlur={() => {
              if (field !== "year" && parts[field].length === 1) {
                commit({ ...parts, [field]: parts[field].padStart(2, "0") })
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !parts[field]) focusPrevious(field)
            }}
            onSubmitEditing={() => refs.current[ORDER[index + 1] ?? field]?.focus()}
            style={[styles.input, error && styles.inputError, { flex: fieldWidths[field] }]}
          />
        ))}
      </View>
      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  label: { color: AuthColors.textMuted, fontSize: 14, fontWeight: "500" },
  row: { flexDirection: "row", gap: 12 },
  input: {
    minWidth: 0,
    minHeight: 54,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: 10,
    backgroundColor: AuthColors.surface,
    color: AuthColors.text,
    fontSize: 16,
    textAlign: "center",
  },
  inputError: { borderColor: AuthColors.accent, borderWidth: 2 },
  error: { color: AuthColors.accent, fontSize: 13, lineHeight: 18 },
})
