import { isCancel } from "axios"
import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { useIsFocused } from "expo-router/react-navigation"
import { StatusBar } from "expo-status-bar"
import { SymbolView } from "expo-symbols"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  AccessibilityInfo,
  ActivityIndicator,
  AppState,
  findNodeHandle,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type TextInputInstance,
} from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import Animated, { FadeIn, FadeOut, useReducedMotion } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/pressable"
import { Palette } from "@/constants/palette"
import { ApiError } from "@/lib/api"
import { useAuth } from "../store/auth.store"
import { AuthField } from "./auth-field"

const AuthColors = {
  ...Palette,
  background: "#FFFFFF",
  surface: "#FFFFFF",
  text: "#1C1B1F",
  textMuted: "#49454F",
  border: "#79747E",
  error: "#B3261D",
  errorContainer: "#F9DEDC",
  onErrorContainer: "#410E0B",
}
type AuthColorPalette = typeof AuthColors

const credentialMessage = "Incorrect email or password."
const shake = {
  "0%": { transform: [{ translateX: 0 }] },
  "25%": { transform: [{ translateX: -4 }] },
  "75%": { transform: [{ translateX: 4 }] },
  "100%": { transform: [{ translateX: 0 }] },
}

async function errorHaptic() {
  try {
    if (Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } else if (Platform.OS === "android") {
      try {
        await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject)
      } catch {
        await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press)
      }
    }
  } catch {
    // Haptics may be unavailable or disabled; visual feedback remains authoritative.
  }
}

export function LoginScreen({ onCreateAccount }: { onCreateAccount?: () => void } = {}) {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const styles = useMemo(() => createStyles(AuthColors), [])
  const reducedMotion = useReducedMotion()
  const { fontScale } = useWindowDimensions()
  const { signIn, requestPasswordReset, verifyPasswordReset, completePasswordReset, pending } =
    useAuth()
  const handleCreateAccount = onCreateAccount ?? (() => router.replace("/(auth)/sign-up"))
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const mounted = useRef(true)
  const submittingRef = useRef(false)
  const focusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const emailInput = useRef<TextInputInstance>(null)
  const passwordInput = useRef<TextInputInstance>(null)
  const [resetMode, setResetMode] = useState(false)
  const [resetStep, setResetStep] = useState<"email" | "code" | "password" | "done">("email")
  const [resetPending, setResetPending] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)
  const [resendDeadline, setResendDeadline] = useState<number | null>(null)
  const [resendSeconds, setResendSeconds] = useState(0)
  const [lockoutDeadline, setLockoutDeadline] = useState<number | null>(null)
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const [lockoutKind, setLockoutKind] = useState<"rate" | "locked" | null>(null)
  const loginPending = pending || submitting
  const loginDisabled = loginPending || lockoutKind !== null
  const lockoutMessage =
    lockoutKind === null
      ? null
      : lockoutSeconds > 0
        ? `${lockoutKind === "locked" ? "Account temporarily locked" : "Too many attempts"}. Try again in ${Math.floor(lockoutSeconds / 60)}:${String(lockoutSeconds % 60).padStart(2, "0")}.`
        : lockoutKind === "locked"
          ? "Account locked. Reset your password to regain access."
          : "Too many attempts. Reset your password or try again later."
  const resendLabel =
    resendSeconds === 0
      ? null
      : resendSeconds >= 3600
        ? "Try again later"
        : `Resend in ${String(Math.floor(resendSeconds / 60)).padStart(2, "0")}:${String(resendSeconds % 60).padStart(2, "0")}`

  useEffect(() => {
    if (resendDeadline === null) return
    const updateRemaining = () =>
      setResendSeconds(Math.max(0, Math.ceil((resendDeadline - Date.now()) / 1000)))
    updateRemaining()
    const timer = setInterval(updateRemaining, 1000)
    const foregroundListener = AppState.addEventListener("change", updateRemaining)
    return () => {
      clearInterval(timer)
      foregroundListener.remove()
    }
  }, [resendDeadline])

  useEffect(() => {
    if (lockoutDeadline === null) return
    const update = () => {
      const remaining = Math.max(0, Math.ceil((lockoutDeadline - Date.now()) / 1000))
      setLockoutSeconds(remaining)
      if (remaining === 0) {
        setLockoutDeadline(null)
        setLockoutKind(null)
      }
    }
    update()
    const timer = setInterval(update, 1000)
    const foregroundListener = AppState.addEventListener("change", (state) => {
      if (state === "active") update()
    })
    return () => {
      clearInterval(timer)
      foregroundListener.remove()
    }
  }, [lockoutDeadline])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(focusTimer.current)
    }
  }, [])

  function clearLoginError() {
    setFieldError(null)
    setValidationError(null)
    clearTimeout(focusTimer.current)
    focusTimer.current = undefined
  }

  function startPasswordReset() {
    setResetMode(true)
    setResetStep("email")
    setResetCode("")
    setResetToken(null)
    setNewPassword("")
    setResetError(null)
    setResetMessage(null)
    clearLoginError()
  }

  function focusEmail() {
    emailInput.current?.focus()
    if (Platform.OS !== "web") {
      const handle = findNodeHandle(emailInput.current)
      if (typeof handle === "number") AccessibilityInfo.setAccessibilityFocus(handle)
    }
  }

  function showFieldError(message: string) {
    setFieldError(message)
    void errorHaptic()
    clearTimeout(focusTimer.current)
    focusTimer.current = setTimeout(() => {
      focusTimer.current = undefined
      if (!mounted.current) return
      passwordInput.current?.focus()
      if (Platform.OS !== "web") {
        const handle = findNodeHandle(passwordInput.current)
        if (typeof handle === "number") AccessibilityInfo.setAccessibilityFocus(handle)
      }
      if (Platform.OS === "ios") AccessibilityInfo.announceForAccessibility(message)
    }, 100)
  }
  async function submit() {
    if (submittingRef.current || pending || lockoutKind !== null) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      clearLoginError()
      setValidationError("Enter a valid email address.")
      focusEmail()
      return
    }
    if (!password) {
      setValidationError(null)
      showFieldError("Enter your password.")
      return
    }
    submittingRef.current = true
    setSubmitting(true)
    clearLoginError()
    try {
      await signIn(email.trim(), password)
    } catch (cause) {
      if (!mounted.current || isCancel(cause)) return
      if (cause instanceof ApiError && (cause.code === "ACCOUNT_LOCKED" || cause.status === 429)) {
        setLockoutKind(cause.code === "ACCOUNT_LOCKED" ? "locked" : "rate")
        const seconds = cause.retryAfterSec
        setLockoutSeconds(seconds ?? 0)
        setLockoutDeadline(seconds === undefined ? null : Date.now() + seconds * 1000)
      } else if (cause instanceof ApiError && cause.status === 401) {
        setFailedAttempts((attempts) => attempts + 1)
        setFieldError(null)
        setValidationError("We could not sign you in. Check your email and password and try again.")
      } else if (cause instanceof ApiError && (cause.status === 400 || cause.status === 422)) {
        setValidationError("Check your email address and try again.")
      } else {
        setValidationError(
          cause instanceof ApiError && cause.status >= 500
            ? "Something went wrong on our end. Try again."
            : "Can't connect. Check your connection and try again.",
        )
      }
    } finally {
      submittingRef.current = false
      if (mounted.current) setSubmitting(false)
    }
  }
  async function verifyResetCode(code: string) {
    if (resetPending) return
    if (!/^\d{4}$/.test(code)) {
      setResetError("Enter the 4-digit code from your email.")
      return
    }
    setResetPending(true)
    setResetError(null)
    try {
      const token = await verifyPasswordReset(email, code)
      if (!mounted.current) return
      setResetToken(token)
      setResetStep("password")
    } catch (cause) {
      if (!mounted.current) return
      setResetCode("")
      setResetError(
        cause instanceof Error ? cause.message : "This reset code is invalid or expired.",
      )
    } finally {
      if (mounted.current) setResetPending(false)
    }
  }
  async function resendResetCode() {
    if (resetPending || resendSeconds > 0) return
    setResetPending(true)
    setResetError(null)
    try {
      const result = await requestPasswordReset(email)
      if (!mounted.current) return
      setResetMessage(result.message)
      setResendDeadline(Date.now() + result.resendAfterSeconds * 1000)
      setResetCode("")
    } catch (cause) {
      if (!mounted.current) return
      setResetError(cause instanceof Error ? cause.message : "Could not resend the reset code.")
    } finally {
      if (mounted.current) setResetPending(false)
    }
  }

  async function submitPasswordReset() {
    if (resetPending) return
    if (!email.trim()) {
      setResetError("Enter your email address.")
      return
    }
    if (resetStep === "email") {
      setResetPending(true)
      setResetError(null)
      setResetMessage(null)
      try {
        const result = await requestPasswordReset(email)
        if (!mounted.current) return
        setResetMessage(result.message)
        setResendDeadline(Date.now() + result.resendAfterSeconds * 1000)
        setResetStep("code")
      } catch (cause) {
        if (!mounted.current) return
        setResetError(
          cause instanceof Error ? cause.message : "Could not request a password reset.",
        )
      } finally {
        if (mounted.current) setResetPending(false)
      }
      return
    }
    if (resetStep === "code") {
      void verifyResetCode(resetCode)
      return
    }
    if (Array.from(newPassword).length < 8) {
      setResetError("Password must contain at least 8 characters.")
      return
    }
    const passwordBytes = encodeURIComponent(newPassword).replace(/%[0-9A-F]{2}/gi, "x").length
    if (passwordBytes > 72) {
      setResetError("Password must not exceed 72 UTF-8 bytes.")
      return
    }
    if (!resetToken) {
      setResetError("Verify your reset code before choosing a new password.")
      return
    }
    setResetPending(true)
    setResetError(null)
    try {
      const message = await completePasswordReset(resetToken, newPassword)
      if (!mounted.current) return
      setResetMessage(message)
      setLockoutKind(null)
      setLockoutDeadline(null)
      setLockoutSeconds(0)
      setFailedAttempts(0)
      setPassword("")
      setNewPassword("")
      setResetToken(null)
      setResetCode("")
      setResetStep("done")
    } catch (cause) {
      if (!mounted.current) return
      setResetError(cause instanceof Error ? cause.message : "Could not reset your password.")
    } finally {
      if (mounted.current) setResetPending(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.screen]}>
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
        ]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        {isFocused ? <StatusBar style="auto" /> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.replace("/(auth)")}
          style={styles.back}
        >
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>

        <Text accessibilityRole="header" style={styles.welcome}>
          {!resetMode
            ? "Hi, welcome back."
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
            <View>
              <AuthField
                colors={AuthColors}
                label="Email address"
                inputRef={emailInput}
                value={email}
                error={validationError === "Enter a valid email address."}
                errorMessage={
                  validationError === "Enter a valid email address." ? validationError : undefined
                }
                aria-invalid={validationError === "Enter a valid email address."}
                aria-describedby={
                  validationError === "Enter a valid email address."
                    ? "login-email-error"
                    : undefined
                }
                accessibilityHint={
                  validationError === "Enter a valid email address." ? validationError : undefined
                }
                placeholder="example@gmail.com"
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                autoFocus={resetMode && resetStep === "email"}
                editable={resetMode ? !resetPending : !loginDisabled}
                submitBehavior="submit"
                onChangeText={(value) => {
                  clearLoginError()
                  setEmail(value)
                }}
                onSubmitEditing={() => passwordInput.current?.focus()}
              />
              {validationError === "Enter a valid email address." ? (
                <Text
                  nativeID="login-email-error"
                  accessibilityLiveRegion="polite"
                  style={styles.error}
                >
                  Enter a valid email address.
                </Text>
              ) : null}
            </View>
          ) : null}
          {!resetMode ? (
            <Animated.View
              style={
                !reducedMotion && fieldError === credentialMessage
                  ? {
                      animationName: shake,
                      animationDuration: 100,
                      animationIterationCount: 3,
                    }
                  : undefined
              }
            >
              <AuthField
                colors={AuthColors}
                label="Password"
                value={password}
                inputRef={passwordInput}
                placeholder="Your password"
                secureTextEntry
                textContentType="password"
                autoComplete="current-password"
                returnKeyType="done"
                autoCorrect={false}
                autoCapitalize="none"
                submitBehavior="submit"
                error={fieldError !== null}
                errorMessage="Re-enter your password."
                aria-invalid={fieldError !== null}
                aria-describedby={fieldError ? "login-password-error" : undefined}
                editable={!loginDisabled}
                onChangeText={(value) => {
                  clearLoginError()
                  setPassword(value)
                }}
                onSubmitEditing={() => {
                  void submit()
                }}
              />
              <View style={[styles.errorSpace, { minHeight: 32 * fontScale + 4 }]}>
                {fieldError ? (
                  <Animated.View
                    entering={reducedMotion ? undefined : FadeIn.duration(150)}
                    exiting={reducedMotion ? undefined : FadeOut.duration(100)}
                    style={styles.errorRow}
                  >
                    <SymbolView
                      name={{
                        ios: "exclamationmark.triangle.fill",
                        android: "warning",
                        web: "warning",
                      }}
                      size={16}
                      tintColor={AuthColors.error}
                      accessible={false}
                    />
                    <Text
                      nativeID="login-password-error"
                      selectable
                      accessibilityRole={Platform.OS === "web" ? "alert" : undefined}
                      accessibilityLiveRegion={Platform.OS === "ios" ? "none" : "polite"}
                      style={styles.credentialError}
                    >
                      {fieldError}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
            </Animated.View>
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
                    const code = value.replace(/\D/g, "").slice(0, 4)
                    setResetCode(code)
                    if (code.length === 4) void verifyResetCode(code)
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
                  setResetStep("email")
                  setResetToken(null)
                  setResetCode("")
                  setResetError(null)
                  setResendDeadline(null)
                  setResendSeconds(0)
                }}
              >
                <Text style={styles.footerLink}>Change email address</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={resendLabel ?? "Resend reset code"}
                accessibilityState={{ disabled: resetPending || resendSeconds > 0 }}
                disabled={resetPending || resendSeconds > 0}
                onPress={() => {
                  void resendResetCode()
                }}
              >
                <Text style={styles.footerLink}>{resendLabel ?? "Resend code"}</Text>
              </Pressable>
            </>
          ) : resetStep === "password" ? (
            <>
              <AuthField
                colors={AuthColors}
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
            disabled={loginPending}
            onPress={startPasswordReset}
          >
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>
        ) : null}

        {!resetMode && failedAttempts >= 3 && lockoutKind === null ? (
          <View style={styles.resetHint}>
            <Text style={styles.terms}>Having trouble? Reset your password.</Text>
            <Pressable
              accessibilityRole="button"
              disabled={loginPending}
              onPress={startPasswordReset}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryLabel}>Reset password</Text>
            </Pressable>
          </View>
        ) : null}
        {!resetMode && validationError && validationError !== "Enter a valid email address." ? (
          <View style={styles.errorBanner}>
            <Text selectable accessibilityLiveRegion="polite" style={styles.bannerText}>
              {validationError}
            </Text>
          </View>
        ) : null}
        {!resetMode && lockoutMessage ? (
          <View style={styles.errorBanner}>
            <Text selectable accessibilityLiveRegion="polite" style={styles.bannerText}>
              {lockoutMessage}
            </Text>
            <Text style={styles.bannerText}>
              Log in and credential editing are disabled. Password reset is still available.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={startPasswordReset}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryLabel}>Reset password</Text>
            </Pressable>
          </View>
        ) : null}
        {resetMode && resetError ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {resetError}
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
              void submitPasswordReset()
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
              disabled: resetMode ? resetPending : loginDisabled,
              busy: resetMode ? resetPending : loginPending,
            }}
            accessibilityHint={!resetMode ? (lockoutMessage ?? undefined) : undefined}
            disabled={resetMode ? resetPending : loginDisabled}
            style={[
              styles.primaryButton,
              (resetMode ? resetPending : loginDisabled) && styles.disabled,
            ]}
            onPress={() => {
              void (resetMode ? submitPasswordReset() : submit())
            }}
          >
            <View style={styles.buttonContents}>
              <View
                style={styles.spinnerSlot}
                accessible={false}
                importantForAccessibility="no-hide-descendants"
              >
                {loginPending && !resetMode ? (
                  reducedMotion ? (
                    <SymbolView
                      name={{
                        ios: "hourglass",
                        android: "hourglass_empty",
                        web: "hourglass_empty",
                      }}
                      size={20}
                      tintColor={AuthColors.onAccent}
                    />
                  ) : (
                    <ActivityIndicator size={20} color={AuthColors.onAccent} />
                  )
                ) : null}
              </View>
              <Text style={styles.primaryLabel}>
                {resetMode
                  ? resetStep === "email"
                    ? "Send reset code"
                    : "Reset password"
                  : "Log in"}
              </Text>
              <View style={styles.spinnerSlot} />
            </View>
          </Pressable>
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
                  setResetMode(false)
                  setResetStep("email")
                  setResetCode("")
                  setResetToken(null)
                  setNewPassword("")
                  setResetMessage(null)
                }}
                hitSlop={8}
              >
                <Text style={styles.footerLink}>Back to log in</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sign up"
                disabled={loginPending}
                onPress={loginPending ? undefined : handleCreateAccount}
                hitSlop={8}
              >
                <Text style={styles.footerLink}>Sign up</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const createStyles = (AuthColors: AuthColorPalette) =>
  StyleSheet.create({
    errorSpace: { paddingTop: 4 },
    resetHint: { gap: 8 },
    errorRow: { flexDirection: "row", alignItems: "flex-start", gap: 4, paddingHorizontal: 16 },
    credentialError: { color: AuthColors.error, fontSize: 12, lineHeight: 16, flex: 1 },
    error: { color: AuthColors.error, fontSize: 13, lineHeight: 20 },
    errorBanner: {
      padding: 16,
      gap: 8,
      backgroundColor: AuthColors.errorContainer,
      borderRadius: 12,
    },
    bannerText: { color: AuthColors.onErrorContainer, fontSize: 13, lineHeight: 20 },
    spinnerSlot: { width: 20, height: 20 },
    buttonContents: { flexDirection: "row", alignItems: "center", gap: 8 },
    disabled: { opacity: 0.6 },
    screen: { flex: 1, backgroundColor: AuthColors.background },
    content: { paddingHorizontal: 24, gap: 22 },
    back: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
    backLabel: { fontSize: 30, lineHeight: 36, color: AuthColors.text },
    welcome: {
      marginTop: 70,
      fontSize: 32,
      lineHeight: 38,
      fontWeight: "700",
      color: AuthColors.text,
    },
    credentials: { gap: 24 },
    forgot: { fontSize: 14, fontWeight: "600", color: AuthColors.accent, textAlign: "right" },
    primaryButton: {
      minHeight: 54,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: AuthColors.accent,
      borderWidth: 1,
      borderColor: AuthColors.accentBorder,
      borderRadius: 12,
    },
    primaryLabel: { fontSize: 16, fontWeight: "600", color: AuthColors.onAccent },
    otpField: { gap: 8 },
    otpLabel: { fontSize: 12, fontWeight: "500", color: AuthColors.textMuted },
    otpCells: { flexDirection: "row", justifyContent: "center", gap: 12 },
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
    otpCellActive: { borderColor: AuthColors.accent },
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
    passwordRequirement: { fontSize: 12, lineHeight: 18, color: AuthColors.textMuted },
    terms: { fontSize: 13, lineHeight: 19, color: AuthColors.textMuted, textAlign: "center" },
    footer: { alignItems: "center", gap: 15, paddingTop: 20 },
    separator: { width: 48, height: 1, borderRadius: 100, backgroundColor: AuthColors.border },
    footerRow: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    footerText: { fontSize: 14, color: AuthColors.textMuted },
    footerLink: { fontSize: 14, fontWeight: "700", color: AuthColors.accent },
  })
