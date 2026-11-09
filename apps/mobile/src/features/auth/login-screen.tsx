import * as Sentry from "@sentry/react-native"
import { isCancel } from "axios"
import { router } from "expo-router"
import { useIsFocused } from "expo-router/react-navigation"
import { StatusBar } from "expo-status-bar"
import { SymbolView } from "expo-symbols"
import { useEffect, useRef, useState } from "react"
import {
  AccessibilityInfo,
  ActivityIndicator,
  findNodeHandle,
  Platform,
  ScrollView,
  Text,
  View,
  type TextInputInstance,
} from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import Animated, { useReducedMotion } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/pressable"
import { ApiError } from "@/lib/api"
import { validateEmail } from "@/lib/form-validation"
import { useMarkInteractive } from "@/lib/observe"

import { AuthField } from "./auth-field"
import { useAuth } from "./auth-hooks"
import {
  AuthColors,
  authStyles as styles,
  credentialMessage,
  errorHaptic,
  shake,
} from "./login-styles"
import { PasswordResetPanel } from "./password-reset-panel"
import { useLoginLockout } from "./use-login-lockout"
import { usePasswordReset } from "./use-password-reset"

export function LoginScreen({ onCreateAccount }: { onCreateAccount?: () => void } = {}) {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const reducedMotion = useReducedMotion()
  const { signIn, pending, error: authError } = useAuth()
  useMarkInteractive()
  const handleCreateAccount = onCreateAccount ?? (() => router.replace("/(auth)/sign-up"))
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showEmailError, setShowEmailError] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const mounted = useRef(true)
  const submittingRef = useRef(false)
  const emailInput = useRef<TextInputInstance>(null)
  const passwordInput = useRef<TextInputInstance>(null)
  const {
    kind: lockoutKind,
    message: lockoutMessage,
    lock,
    clear: clearLockout,
  } = useLoginLockout()
  const reset = usePasswordReset({
    email,
    onStart: clearLoginError,
    onCompleted: () => {
      clearLockout()
      setFailedAttempts(0)
      setPassword("")
    },
  })
  const loginPending = pending || submitting
  const loginDisabled = loginPending || lockoutKind !== null

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (authError) setValidationError(authError)
  }, [authError])

  function clearLoginError() {
    setFieldError(null)
    setValidationError(null)
    setEmailError(null)
    setShowEmailError(false)
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
  }

  async function submit() {
    if (submittingRef.current || pending || lockoutKind !== null) return
    const nextEmailError = validateEmail(email)
    if (nextEmailError) {
      setValidationError(null)
      setFieldError(null)
      setEmailError(nextEmailError)
      setShowEmailError(true)
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
        lock(cause.code === "ACCOUNT_LOCKED" ? "locked" : "rate", cause.retryAfterSec)
      } else if (cause instanceof ApiError && cause.status === 401) {
        setFailedAttempts((attempts) => attempts + 1)
        setFieldError(null)
        setValidationError("We could not sign you in. Check your email and password and try again.")
      } else if (cause instanceof ApiError && cause.status === 410) {
        setValidationError("Account deletion has completed. Create a new account to continue.")
      } else if (cause instanceof ApiError && (cause.status === 400 || cause.status === 422)) {
        setValidationError("Check your email address and try again.")
      } else {
        Sentry.captureException(cause)
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

        {reset.active ? (
          <PasswordResetPanel
            email={email}
            onEmailChange={(value) => {
              clearLoginError()
              setEmail(value)
            }}
            reset={reset}
          />
        ) : (
          <>
            <Text accessibilityRole="header" style={styles.welcome}>
              Hi, welcome back.
            </Text>

            <View style={styles.credentials}>
              <View>
                <AuthField
                  colors={AuthColors}
                  label="Email address"
                  inputRef={emailInput}
                  value={email}
                  error={showEmailError && emailError !== null}
                  errorMessage={showEmailError ? (emailError ?? undefined) : undefined}
                  errorHintId="login-email-error"
                  aria-invalid={showEmailError && emailError !== null}
                  aria-describedby={showEmailError && emailError ? "login-email-error" : undefined}
                  placeholder="example@gmail.com"
                  keyboardType="email-address"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  autoComplete="email"
                  editable={!loginDisabled}
                  submitBehavior="submit"
                  onChangeText={(value) => {
                    setValidationError(null)
                    setFieldError(null)
                    setEmail(value)
                    if (showEmailError) setEmailError(validateEmail(value))
                  }}
                  onBlur={() => {
                    if (!email.trim()) return
                    setShowEmailError(true)
                    setEmailError(validateEmail(email))
                  }}
                  onSubmitEditing={() => passwordInput.current?.focus()}
                />
              </View>

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
                  testID="login-password"
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
                  errorMessage={fieldError ?? undefined}
                  errorHintId="login-password-error"
                  aria-invalid={fieldError !== null}
                  aria-describedby={fieldError ? "login-password-error" : undefined}
                  editable={!loginDisabled}
                  onChangeText={(value) => {
                    setFieldError(null)
                    setPassword(value)
                  }}
                  onSubmitEditing={() => {
                    void submit()
                  }}
                />
              </Animated.View>
            </View>

            <Pressable accessibilityRole="button" disabled={loginPending} onPress={reset.start}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>

            {failedAttempts >= 3 && lockoutKind === null ? (
              <View style={styles.resetHint}>
                <Text style={styles.terms}>Having trouble? Reset your password.</Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={loginPending}
                  onPress={reset.start}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryLabel}>Reset password</Text>
                </Pressable>
              </View>
            ) : null}
            {validationError ? (
              <View style={styles.errorBanner}>
                <Text selectable accessibilityLiveRegion="polite" style={styles.bannerText}>
                  {validationError}
                </Text>
              </View>
            ) : null}
            {lockoutMessage ? (
              <View style={styles.errorBanner}>
                <Text selectable accessibilityLiveRegion="polite" style={styles.bannerText}>
                  {lockoutMessage}
                </Text>
                <Text style={styles.bannerText}>
                  Log in and credential editing are disabled. Password reset is still available.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={reset.start}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryLabel}>Reset password</Text>
                </Pressable>
              </View>
            ) : null}

            <Pressable
              testID="login-submit"
              accessibilityRole="button"
              accessibilityLabel="Log in"
              accessibilityState={{ disabled: loginDisabled, busy: loginPending }}
              accessibilityHint={lockoutMessage ?? undefined}
              disabled={loginDisabled}
              style={[styles.primaryButton, loginDisabled && styles.disabled]}
              onPress={() => {
                void submit()
              }}
            >
              <View style={styles.buttonContents}>
                <View
                  style={styles.spinnerSlot}
                  accessible={false}
                  importantForAccessibility="no-hide-descendants"
                >
                  {loginPending ? (
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
                <Text style={styles.primaryLabel}>Log in</Text>
                <View style={styles.spinnerSlot} />
              </View>
            </Pressable>

            <View style={styles.footer}>
              <View style={styles.separator} />
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
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
