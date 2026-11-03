import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AppState, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
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
  const {
    signIn,
    requestPasswordReset,
    verifyPasswordReset,
    completePasswordReset,
    pending,
    error,
  } = useAuth();
  const handleCreateAccount = onCreateAccount ?? (() => router.push(APP_ROUTES.signUp));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState<"email" | "code" | "password" | "done">("email");
  const [resetPending, setResetPending] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resendDeadline, setResendDeadline] = useState<number | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (resendDeadline === null) return;
    const updateRemaining = () =>
      setResendSeconds(Math.max(0, Math.ceil((resendDeadline - Date.now()) / 1000)));
    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    const foregroundListener = AppState.addEventListener("change", updateRemaining);
    return () => {
      clearInterval(timer);
      foregroundListener.remove();
    };
  }, [resendDeadline]);

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
  async function verifyResetCode(code: string) {
    if (resetPending) return;
    if (!/^\d{4}$/.test(code)) {
      setResetError("Enter the 4-digit code from your email.");
      return;
    }
    setResetPending(true);
    setResetError(null);
    try {
      const token = await verifyPasswordReset(email, code);
      setResetToken(token);
      setResetStep("password");
    } catch (cause) {
      setResetCode("");
      setResetError(
        cause instanceof Error ? cause.message : "This reset code is invalid or expired.",
      );
    } finally {
      setResetPending(false);
    }
  }
  async function resendResetCode() {
    if (resetPending || resendSeconds > 0) return;
    setResetPending(true);
    setResetError(null);
    try {
      const result = await requestPasswordReset(email);
      setResetMessage(result.message);
      setResendDeadline(Date.now() + result.resendAfterSeconds * 1000);
      setResetCode("");
    } catch (cause) {
      setResetError(cause instanceof Error ? cause.message : "Unable to resend the reset code.");
    } finally {
      setResetPending(false);
    }
  }

  async function submitPasswordReset() {
    if (!email.trim()) {
      setResetError("Enter your email address.");
      return;
    }
    if (resetStep === "email") {
      setResetPending(true);
      setResetError(null);
      setResetMessage(null);
      try {
        const result = await requestPasswordReset(email);
        setResetMessage(result.message);
        setResendDeadline(Date.now() + result.resendAfterSeconds * 1000);
        setResetStep("code");
      } catch (cause) {
        setResetError(
          cause instanceof Error ? cause.message : "Unable to request a password reset.",
        );
      } finally {
        setResetPending(false);
      }
      return;
    }
    if (resetStep === "code") {
      void verifyResetCode(resetCode);
      return;
    }
    if (Array.from(newPassword).length < 8) {
      setResetError("Password must contain at least 8 characters.");
      return;
    }
    const passwordBytes = encodeURIComponent(newPassword).replace(/%[0-9A-F]{2}/gi, "x").length;
    if (passwordBytes > 72) {
      setResetError("Password must not exceed 72 UTF-8 bytes.");
      return;
    }
    if (!resetToken) {
      setResetError("Verify your reset code before choosing a new password.");
      return;
    }
    setResetPending(true);
    setResetError(null);
    try {
      setResetMessage(await completePasswordReset(resetToken, newPassword));
      setResetToken(null);
      setResetCode("");
      setResetStep("done");
    } catch (cause) {
      setResetError(cause instanceof Error ? cause.message : "Unable to reset your password.");
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
        {!resetMode
          ? "Welcome back."
          : resetStep === "email"
            ? "Reset your password."
            : resetStep === "code"
              ? "Check your email."
              : resetStep === "password"
                ? "Choose a new password."
                : "Password updated."}
      </Text>

      <View style={styles.credentials}>
        {!resetMode || resetStep === "email" ? (
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
            autoFocus={resetMode && resetStep === "email"}
            editable={!pending && !resetPending}
          />
        ) : null}
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
        ) : resetStep === "email" ? (
          <Text style={styles.terms}>
            Enter your account email. If it matches an account, we’ll send a 4-digit reset code.
          </Text>
        ) : resetStep === "code" ? (
          <>
            <Text style={styles.terms}>
              We sent a 4-digit code to {email.replace(/^(.{1,2})[^@]*/, "$1•••")}. Codes expire
              after 10 minutes.
            </Text>
            <View style={styles.otpField}>
              <Text style={styles.otpLabel}>4-digit reset code</Text>
              <View style={styles.otpCells} accessible={false} pointerEvents="none">
                {[0, 1, 2, 3].map((index) => (
                  <View
                    key={index}
                    style={[styles.otpCell, resetCode.length === index && styles.otpCellActive]}
                  >
                    <Text style={styles.otpDigit}>{resetCode[index] ?? ""}</Text>
                  </View>
                ))}
              </View>
              <TextInput
                accessibilityLabel="4-digit reset code"
                value={resetCode}
                onChangeText={(value) => {
                  const code = value.replace(/\D/g, "").slice(0, 4);
                  setResetCode(code);
                  if (code.length === 4) void verifyResetCode(code);
                }}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={4}
                autoComplete="one-time-code"
                autoFocus
                editable={!resetPending}
                selectionColor="transparent"
                style={styles.otpOverlay}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change email address"
              onPress={() => {
                setResetStep("email");
                setResetToken(null);
                setResetCode("");
                setResetError(null);
                setResendDeadline(null);
                setResendSeconds(0);
              }}
            >
              <Text style={styles.footerLink}>Change email address</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                resendSeconds > 0
                  ? `Resend reset code in ${resendSeconds} seconds`
                  : "Resend reset code"
              }
              accessibilityState={{ disabled: resetPending || resendSeconds > 0 }}
              disabled={resetPending || resendSeconds > 0}
              onPress={() => {
                void resendResetCode();
              }}
            >
              <Text style={styles.footerLink}>
                {resendSeconds > 0
                  ? `Resend in ${String(Math.floor(resendSeconds / 60)).padStart(2, "0")}:${String(resendSeconds % 60).padStart(2, "0")}`
                  : "Resend code"}
              </Text>
            </Pressable>
          </>
        ) : resetStep === "password" ? (
          <>
            <AuthField
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoComplete="new-password"
              editable={!resetPending}
            />
            <Text accessibilityLiveRegion="polite" style={styles.passwordRequirement}>
              {Array.from(newPassword).length >= 8
                ? "✓ Requirement met: at least 8 characters."
                : "• At least 8 characters."}
            </Text>
          </>
        ) : (
          <Text style={styles.terms}>{resetMessage}</Text>
        )}
      </View>

      {!resetMode ? (
        <Pressable
          accessibilityRole="button"
          disabled={pending}
          onPress={() => {
            setResetMode(true);
            setResetStep("email");
            setResetCode("");
            setResetToken(null);
            setNewPassword("");
            setResetError(null);
            setResetMessage(null);
            setValidationError(null);
          }}
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>
      ) : null}

      {resetError || (!resetMode && (validationError || error)) ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {resetMode ? resetError : (validationError ?? error)}
        </Text>
      ) : null}

      {resetMode && resetStep === "code" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue to choose a new password"
          accessibilityState={{ disabled: resetPending || resetCode.length !== 4 }}
          disabled={resetPending || resetCode.length !== 4}
          style={[styles.primaryButton, resetCode.length !== 4 && styles.disabled]}
          onPress={() => {
            void submitPasswordReset();
          }}
        >
          <Text style={styles.primaryLabel}>Continue</Text>
        </Pressable>
      ) : resetStep !== "done" || !resetMode ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            resetMode ? (resetStep === "email" ? "Send reset code" : "Reset password") : "Log in"
          }
          accessibilityState={{
            disabled: resetMode ? resetPending : pending,
          }}
          disabled={resetMode ? resetPending : pending}
          style={[styles.primaryButton, (resetMode ? resetPending : pending) && styles.disabled]}
          onPress={() => {
            void (resetMode ? submitPasswordReset() : submit());
          }}
        >
          <Text style={styles.primaryLabel}>
            {resetMode ? (resetStep === "email" ? "Send reset code" : "Reset password") : "Log in"}
          </Text>
        </Pressable>
      ) : null}

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
                setResetStep("email");
                setResetCode("");
                setResetToken(null);
                setNewPassword("");
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
  otpField: {
    gap: 8,
  },
  otpLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: AuthColors.textMuted,
  },
  otpCells: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  otpCell: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AuthColors.surface,
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: 12,
  },
  otpCellActive: {
    borderColor: AuthColors.accent,
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: AuthColors.text,
  },
  otpOverlay: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.02,
    color: "transparent",
    backgroundColor: "transparent",
  },
  passwordRequirement: {
    fontSize: 12,
    lineHeight: 18,
    color: AuthColors.textMuted,
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
