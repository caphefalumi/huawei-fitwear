import { Pressable as RNPressable, StyleSheet, type PressableProps } from "react-native";

/** Pressable with shared press feedback and a web-only hover state. */
export function Pressable({
  style,
  disabled,
  onPress,
  accessibilityRole = "button",
  accessibilityState,
  ...props
}: PressableProps) {
  const interactive = !disabled && !!onPress;

  return (
    <RNPressable
      {...props}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled: disabled ?? accessibilityState?.disabled }}
      disabled={disabled}
      onPress={onPress}
      style={(state) => [
        styles.target,
        typeof style === "function" ? style(state) : style,
        interactive && (state as { hovered?: boolean }).hovered && styles.hovered,
        interactive && state.pressed && styles.pressed,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  target: {
    minWidth: 48,
    minHeight: 48,
  },
  hovered: {
    opacity: 0.85,
  },
  pressed: {
    opacity: 0.7,
  },
});
