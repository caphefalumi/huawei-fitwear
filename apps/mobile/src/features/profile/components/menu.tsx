import { Image } from "expo-image"
import { SymbolView, type SymbolViewProps } from "expo-symbols"
import { Children, type PropsWithChildren } from "react"
import { StyleSheet, Text, View } from "react-native"

import { Card } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

const chevron = require("@/assets/images/profile/chevron-right.svg")

/** A rounded card of divided rows, under an optional section title. */
export function MenuGroup({ title, children }: PropsWithChildren<{ title?: string }>) {
  return (
    <View style={styles.section}>
      {title ? (
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          {title}
        </Text>
      ) : null}
      <Card style={styles.group}>
        {Children.toArray(children).map((child, index) => (
          <View key={index} style={index > 0 && styles.divided}>
            {child}
          </View>
        ))}
      </Card>
    </View>
  )
}

export function MenuRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon?: SymbolViewProps["name"]
  label: string
  value?: string
  /** Without it the row only shows information. */
  onPress?: () => void
}) {
  const content = (
    <>
      {icon ? <SymbolView name={icon} size={22} tintColor={C.textMuted} /> : null}
      <Text style={styles.label}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {onPress ? (
        <Image accessible={false} source={chevron} style={styles.chevron} contentFit="contain" />
      ) : null}
    </>
  )
  if (!onPress) return <View style={styles.row}>{content}</View>
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityLabel={value ? `${label}, ${value}` : label}
    >
      {content}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "600", color: C.text, marginBottom: 2 },
  group: { paddingVertical: 0, gap: 0 },
  divided: { borderTopWidth: 1, borderTopColor: C.border },
  row: {
    minHeight: 56,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  label: { flex: 1, fontSize: 15, fontWeight: "500", color: C.text },
  value: {
    flexShrink: 1,
    maxWidth: "46%",
    textAlign: "right",
    fontSize: 14,
    color: C.textMuted,
  },
  chevron: { width: 16, height: 16 },
})
