import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { Pressable } from "@/components/pressable";
import { Palette as AuthColors } from "@/constants/palette";

type AuthFieldProps = {
  label: string;
  icon: number;
  helper?: string;
  style?: TextInputProps["style"];
} & Omit<TextInputProps, "style">;

export function AuthField({ label, icon, helper, ...inputProps }: AuthFieldProps) {
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
          style={styles.input}
        />
        {inputProps.secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
            disabled={inputProps.editable === false}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={styles.visibilityButton}
          >
            <Text style={styles.visibilityLabel}>{passwordVisible ? "Hide" : "Show"}</Text>
          </Pressable>
        ) : (
          <Image source={icon} style={styles.icon} contentFit="contain" accessible={false} />
        )}
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
    fontSize: 12,
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
    fontSize: 15,
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
  visibilityLabel: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: "500",
  },
  helper: {
    fontSize: 11,
    lineHeight: 16,
    color: AuthColors.textMuted,
  },
});
