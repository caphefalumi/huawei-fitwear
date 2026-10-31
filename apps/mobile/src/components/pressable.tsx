import { Pressable as RNPressable, StyleSheet, type PressableProps } from 'react-native';

/** Pressable with shared press feedback and a web-only hover state. */
export function Pressable({ style, disabled, onPress, ...props }: PressableProps) {
  const interactive = !disabled && !!onPress;

  return (
    <RNPressable
      {...props}
      disabled={disabled}
      onPress={onPress}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        interactive && (state as { hovered?: boolean }).hovered && styles.hovered,
        interactive && state.pressed && styles.pressed,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  hovered: {
    opacity: 0.85,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
