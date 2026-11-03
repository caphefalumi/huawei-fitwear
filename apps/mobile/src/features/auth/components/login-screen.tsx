import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable } from "@/components/pressable";
import { Palette as AuthColors } from "@/constants/palette";
import { APP_ROUTES, useAuth } from "../store/auth.store";
import { AuthField } from "./auth-field";

const icons = {
  logo: require("@/assets/images/auth/logo.svg"),
  user: require("@/assets/images/auth/user-round.svg"),
  eyeOff: require("@/assets/images/auth/eye-off.svg"),
};

export function LoginScreen({ onCreateAccount }: { onCreateAccount?: () => void } = {}) {
  const insets = useSafeAreaInsets();
  const { signIn, requestPasswordReset, pending, error } = useAuth();
  const handleCreateAccount = onCreateAccount ?? (() => router.push(APP_ROUTES.signUp));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetPending, setResetPending] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || !password) {
      setValidationError("Enter your email address and password.");
      return;
    }
    setValidationError(null);
    try {
      await signIn(email, password);
    } catch {
      // The auth store exposes the server error without discarding entered fields.
    }
  }

  async function submitPasswordReset() {
    if (!email.trim()) {
      setResetError("Enter your email address.");
      return;
    }
    setResetPending(true);
    setResetError(null);
    setResetMessage(null);
    try {
      setResetMessage(await requestPasswordReset(email));
    } catch (cause) {
      setResetError(cause instanceof Error ? cause.message : "Unable to request a password reset.");
    } finally {
      setResetPending(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.brand}>
        <Image
          accessible={false}
          source={icons.logo}
          style={styles.brandMark}
          contentFit="contain"
        />
        <Text style={styles.brandName}>VoocHealth</Text>
      </View>

      <Text accessibilityRole="header" style={styles.welcome}>
        {resetMode ? "Reset your password." : "Welcome back."}
      </Text>

      <View style={styles.credentials}>
        <AuthField
          label="Email"
          icon={icons.user}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          autoComplete="email"
          editable={!pending && !resetPending}
        />
        {!resetMode ? (
          <AuthField
            label="Password"
            icon={icons.eyeOff}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="current-password"
            editable={!pending}
            onSubmitEditing={() => {
              void submit();
            }}
          />
        ) : (
          <Text style={styles.terms}>
            Enter your account email. If it matches an account, we’ll send an 8-digit reset code.
          </Text>
        )}
      </View>

      {!resetMode ? (
        <Pressable
          accessibilityRole="button"
          disabled={pending}
          onPress={() => {
            setResetMode(true);
            setResetError(null);
            setResetMessage(null);
            setValidationError(null);
          }}
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>
      ) : null}

      {resetMessage ? (
        <Text accessibilityRole="status" accessibilityLiveRegion="polite" style={styles.terms}>
          {resetMessage}
        </Text>
      ) : null}
      {resetError || (!resetMode && (validationError || error)) ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {resetMode ? resetError : (validationError ?? error)}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={resetMode ? "Send reset code" : "Log in"}
        accessibilityState={{
          disabled: resetMode ? resetPending : pending,
          busy: resetMode ? resetPending : pending,
        }}
        disabled={resetMode ? resetPending : pending}
        style={[styles.primaryButton, (resetMode ? resetPending : pending) && styles.disabled]}
        onPress={() => {
          void (resetMode ? submitPasswordReset() : submit());
        }}
      >
        {(resetMode ? resetPending : pending) ? (
          <ActivityIndicator color={AuthColors.onAccent} />
        ) : (
          <Text style={styles.primaryLabel}>{resetMode ? "Send reset code" : "Log in"}</Text>
        )}
      </Pressable>

      {!resetMode ? (
        <Text style={styles.terms}>
          By continuing, you agree to <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>User Agreement</Text>.
        </Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.separator} />
        {resetMode ? (
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remembered your password?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to log in"
              onPress={() => {
                setResetMode(false);
                setResetError(null);
                setResetMessage(null);
              }}
              hitSlop={8}
            >
              <Text style={styles.footerLink}>Back to log in</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>No account?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create account"
              disabled={pending}
              onPress={pending ? undefined : handleCreateAccount}
              hitSlop={8}
            >
              <Text style={styles.footerLink}>Create account</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  error: { color: AuthColors.text, fontSize: 13, lineHeight: 20 },
  disabled: { opacity: 0.6 },
  screen: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 22,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  brandMark: {
    width: 26,
    height: 26,
  },
  brandName: {
    fontSize: 19,
    fontWeight: "400",
    color: AuthColors.text,
  },
  welcome: {
    marginTop: 70,
    fontSize: 36,
    lineHeight: 41,
    fontWeight: "600",
    color: AuthColors.text,
  },
  credentials: {
    gap: 18,
  },
  forgot: {
    fontSize: 13,
    fontWeight: "500",
    color: AuthColors.accent,
    textAlign: "right",
  },
  primaryButton: {
    minHeight: 52,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AuthColors.accent,
    borderWidth: 1,
    borderColor: AuthColors.accentBorder,
    borderRadius: 12,
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: AuthColors.onAccent,
  },
  terms: {
    fontSize: 11,
    lineHeight: 19,
    color: AuthColors.textMuted,
    textAlign: "center",
  },
  link: {
    color: AuthColors.accent,
  },
  footer: {
    alignItems: "center",
    gap: 15,
    paddingTop: 20,
  },
  separator: {
    width: 48,
    height: 1,
    borderRadius: 100,
    backgroundColor: AuthColors.border,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: AuthColors.textMuted,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "600",
    color: AuthColors.accent,
  },
});
