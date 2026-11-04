import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { Pressable } from "@/components/pressable";
import { Palette as AuthColors } from "@/constants/palette";

type AuthFieldProps = {
  label: string;
  icon?: number;
  helper?: string;
  style?: TextInputProps["style"];
} & Omit<TextInputProps, "style">;

function EyeIcon({ color = AuthColors.textMuted, size = 19 }: { color?: string; size?: number }) {
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
  );
}

function EyeOffIcon({
  color = AuthColors.textMuted,
  size = 19,
}: {
  color?: string;
  size?: number;
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
  );
}

export function AuthField({ label, icon, helper, style, ...inputProps }: AuthFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={helper}
          placeholderTextColor={AuthColors.textMuted}
          {...inputProps}
          secureTextEntry={inputProps.secureTextEntry && !passwordVisible}
          style={[styles.input, style]}
        />
        {inputProps.secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
            accessibilityHint={
              passwordVisible ? "Obscures password characters" : "Displays password in plain text"
            }
            accessibilityState={{ disabled: inputProps.editable === false }}
            disabled={inputProps.editable === false}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={[
              styles.visibilityButton,
              inputProps.editable === false && styles.visibilityButtonDisabled,
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID="password-visibility-toggle"
          >
            {passwordVisible ? (
              <EyeOffIcon color={AuthColors.text} />
            ) : (
              <EyeIcon color={AuthColors.textMuted} />
            )}
          </Pressable>
        ) : icon ? (
          <Image source={icon} style={styles.icon} contentFit="contain" accessible={false} />
        ) : null}
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: AuthColors.textMuted,
  },
  box: {
    minHeight: 52,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    backgroundColor: AuthColors.surface,
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    color: AuthColors.text,
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
  visibilityButtonDisabled: {
    opacity: 0.4,
  },
  helper: {
    fontSize: 11,
    lineHeight: 16,
    color: AuthColors.textMuted,
  },
});
