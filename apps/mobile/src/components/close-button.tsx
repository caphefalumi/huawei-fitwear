import { StyleSheet } from "react-native"
import Svg, { Path } from "react-native-svg"

import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/constants/palette"

/** Circular X button with a centered glyph; the hit area stays at least 44dp via hitSlop. */
export function CloseButton({
  label,
  onPress,
  size = 32,
  background = C.card,
}: {
  label: string
  onPress: () => void
  size?: number
  background?: string
}) {
  const slop = Math.max(0, Math.ceil((44 - size) / 2))
  const glyph = Math.round(size * 0.4)
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={slop}
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: background },
      ]}
    >
      <Svg width={glyph} height={glyph} viewBox="0 0 10 10">
        <Path d="M1 1L9 9M9 1L1 9" stroke={C.text} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  circle: {
    minWidth: 0,
    minHeight: 0,
    alignItems: "center",
    justifyContent: "center",
  },
})
