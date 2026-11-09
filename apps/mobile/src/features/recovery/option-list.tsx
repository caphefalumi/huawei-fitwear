import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/theme"

/** Bordered radio cards with a title and one line of detail. */
export function OptionList<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; detail: string }[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.option, selected && styles.selected]}
            onPress={() => onChange(option.value)}
          >
            <Text style={styles.title}>{option.value}</Text>
            <Text style={styles.detail}>{option.detail}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  option: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 14,
    gap: 2,
  },
  selected: {
    borderColor: C.accent,
    backgroundColor: C.accentTint,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  detail: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
  },
})
