import { Image } from "expo-image"
import { useState } from "react"
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from "react-native"
import Animated, { useReducedMotion } from "react-native-reanimated"
import Svg, { Circle, Path } from "react-native-svg"

import { Pressable } from "@/components/pressable"
import { Palette as AuthColors } from "@/theme"

const defaultColors = { ...AuthColors, error: "#B3261D" }

type AuthFieldColors = {
  surface: string
  text: string
  textMuted: string
  border: string
  accent: string
  error: string
}

type AuthFieldProps = {
  label: string
  icon?: number
  helper?: string
  error?: boolean
  inputRef?: React.Ref<TextInputInstance>
  errorMessage?: string
  colors?: AuthFieldColors
  style?: TextInputProps["style"]
} & Omit<TextInputProps, "style">

function EyeIcon({ color = AuthColors.textMuted, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

function EyeOffIcon({
  color = AuthColors.textMuted,
  size = 24,
}: {
  color?: string
  size?: number
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <Path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <Path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <Path d="m2 2 20 20" />
    </Svg>
  )
}

export function AuthField({
  label,
  icon,
  helper,
  error = false,
  inputRef,
  errorMessage,
  colors = defaultColors,
  style,
  ...inputProps
}: AuthFieldProps) {
  const reducedMotion = useReducedMotion()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  const disabled = inputProps.editable === false
  return (
    <View style={[styles.field, disabled && { opacity: 0.38 }]}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Animated.View
        style={[
          styles.box,
          {
            backgroundColor: colors.surface,
            borderWidth: !disabled && (error || focused) ? 2 : 1,
            borderColor: disabled
              ? colors.border
              : error
                ? colors.error
                : focused
                  ? colors.accent
                  : colors.border,
            transitionProperty: "borderColor",
            transitionDuration: reducedMotion ? 0 : 150,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          accessibilityHint={error ? errorMessage : helper}
          accessibilityState={{ disabled: inputProps.editable === false }}
          placeholderTextColor={colors.textMuted}
          aria-invalid={error || undefined}
          {...inputProps}
          onFocus={(event) => {
            setFocused(true)
            inputProps.onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            inputProps.onBlur?.(event)
          }}
          secureTextEntry={inputProps.secureTextEntry && !passwordVisible}
          style={[styles.input, { color: colors.text }, style]}
        />
        {inputProps.secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
            accessibilityHint={passwordVisible ? "Password is visible" : "Password is hidden"}
            accessibilityState={{
              disabled: inputProps.editable === false,
            }}
            disabled={inputProps.editable === false}
            onPress={() => {
              const visible = !passwordVisible
              setPasswordVisible(visible)
              AccessibilityInfo.announceForAccessibility(
                visible ? "Password is visible" : "Password is hidden",
              )
            }}
            style={styles.visibilityButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="password-visibility-toggle"
          >
            {passwordVisible ? (
              <EyeOffIcon color={colors.text} />
            ) : (
              <EyeIcon color={colors.textMuted} />
            )}
          </Pressable>
        ) : icon ? (
          <Image source={icon} style={styles.icon} contentFit="contain" accessible={false} />
        ) : null}
      </Animated.View>
      {helper ? <Text style={[styles.helper, { color: colors.textMuted }]}>{helper}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: AuthColors.textMuted,
  },
  box: {
    minHeight: Platform.OS === "android" ? 56 : 52,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: AuthColors.surface,
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: AuthColors.text,
    outlineWidth: 0,
  },
  icon: {
    width: 19,
    height: 19,
  },
  visibilityButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  helper: {
    fontSize: 11,
    lineHeight: 16,
    color: AuthColors.textMuted,
  },
})
