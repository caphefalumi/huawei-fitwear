import { Text, TextInput, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import { PASSWORD_FIELD_HELPER } from "@/lib/forms/form-validation"

import type { PasswordResetState } from "../hooks/use-password-reset"
import { AuthField } from "./auth-field"
import { AuthColors, authStyles as styles } from "./login-styles"

export function PasswordResetPanel({
  email,
  onEmailChange,
  reset,
}: {
  email: string
  onEmailChange: (value: string) => void
  reset: PasswordResetState
}) {
  const {
    step,
    code,
    setCode,
    newPassword,
    setNewPassword,
    pending,
    message,
    error,
    resendLabel,
    resendSeconds,
    verify,
    resend,
    submit,
    exit,
    changeEmail,
  } = reset
  const heading =
    step === "email"
      ? "Reset your password."
      : step === "code"
        ? "Check your email."
        : step === "password"
          ? "Choose a new password."
          : "Password updated."

  return (
    <>
      <Text accessibilityRole="header" style={styles.welcome}>
        {heading}
      </Text>

      <View style={styles.credentials}>
        {step === "email" ? (
          <>
            <AuthField
              colors={AuthColors}
              label="Email address"
              value={email}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              autoComplete="email"
              autoFocus
              editable={!pending}
              submitBehavior="submit"
              onChangeText={onEmailChange}
            />
            <Text style={styles.terms}>
              Enter your account email. If it matches an account, we’ll send a 4-digit reset code.
            </Text>
          </>
        ) : step === "code" ? (
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
                    style={[styles.otpCell, code.length === index && styles.otpCellActive]}
                  >
                    <Text style={styles.otpDigit}>{code[index] ?? ""}</Text>
                  </View>
                ))}
              </View>
              <TextInput
                accessibilityLabel="4-digit reset code"
                value={code}
                onChangeText={(value) => {
                  const next = value.replace(/\D/g, "").slice(0, 4)
                  setCode(next)
                  if (next.length === 4) void verify(next)
                }}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={4}
                autoComplete="one-time-code"
                autoFocus
                editable={!pending}
                selectionColor="transparent"
                style={styles.otpOverlay}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change email address"
              onPress={changeEmail}
            >
              <Text style={styles.footerLink}>Change email address</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={resendLabel ?? "Resend reset code"}
              accessibilityState={{ disabled: pending || resendSeconds > 0 }}
              disabled={pending || resendSeconds > 0}
              onPress={() => {
                void resend()
              }}
            >
              <Text style={styles.footerLink}>{resendLabel ?? "Resend code"}</Text>
            </Pressable>
          </>
        ) : step === "password" ? (
          <>
            <AuthField
              colors={AuthColors}
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoComplete="new-password"
              editable={!pending}
            />
            <Text accessibilityLiveRegion="polite" style={styles.passwordRequirement}>
              {Array.from(newPassword).length >= 8
                ? `✓ ${PASSWORD_FIELD_HELPER}`
                : `• ${PASSWORD_FIELD_HELPER}`}
            </Text>
          </>
        ) : (
          <Text style={styles.terms}>{message}</Text>
        )}
      </View>

      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}

      {step === "code" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue to choose a new password"
          accessibilityState={{ disabled: pending || code.length !== 4 }}
          disabled={pending || code.length !== 4}
          style={[styles.primaryButton, code.length !== 4 && styles.disabled]}
          onPress={() => {
            void submit()
          }}
        >
          <Text style={styles.primaryLabel}>Continue</Text>
        </Pressable>
      ) : step !== "done" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={step === "email" ? "Send reset code" : "Reset password"}
          accessibilityState={{ disabled: pending, busy: pending }}
          disabled={pending}
          style={[styles.primaryButton, pending && styles.disabled]}
          onPress={() => {
            void submit()
          }}
        >
          <View style={styles.buttonContents}>
            <View
              style={styles.spinnerSlot}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            />
            <Text style={styles.primaryLabel}>
              {step === "email" ? "Send reset code" : "Reset password"}
            </Text>
            <View style={styles.spinnerSlot} />
          </View>
        </Pressable>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.separator} />
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Remembered your password?</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to log in"
            onPress={exit}
            hitSlop={8}
          >
            <Text style={styles.footerLink}>Back to log in</Text>
          </Pressable>
        </View>
      </View>
    </>
  )
}
