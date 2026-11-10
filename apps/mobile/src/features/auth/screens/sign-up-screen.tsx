import { Image } from "expo-image"
import { router } from "expo-router"
import { useRef, useState } from "react"
import { findNodeHandle, Platform, ScrollView, StyleSheet, Text, View } from "react-native"
import { AccessibilityInfo, type TextInputInstance } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/ui/pressable"
import {
  PASSWORD_FIELD_HELPER,
  validateBirthDate,
  validateEmail,
  validatePassword,
} from "@/lib/forms/form-validation"
import { useMarkInteractive } from "@/lib/monitoring/observe"

import { AuthField } from "../auth-field"
import { APP_ROUTES, useAuth } from "../auth-hooks"
import { DateOfBirthField } from "../date-of-birth-field"
import { AuthColors } from "../login-styles"

const icons = {
  check: require("@/assets/images/auth/check.svg"),
  lock: require("@/assets/images/auth/lock-keyhole.svg"),
}

type FieldKey = "name" | "email" | "password" | "birthDate" | "terms"

export function SignUpScreen({ onSignIn }: { onSignIn?: () => void } = {}) {
  const insets = useSafeAreaInsets()
  const { signUp, pending, error: serverError } = useAuth()
  useMarkInteractive()
  const handleSignIn = onSignIn ?? (() => router.replace(APP_ROUTES.login))
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [showErrors, setShowErrors] = useState<Partial<Record<FieldKey, boolean>>>({})
  const nameInput = useRef<TextInputInstance>(null)
  const emailInput = useRef<TextInputInstance>(null)
  const passwordInput = useRef<TextInputInstance>(null)
  const birthYearInput = useRef<TextInputInstance>(null)

  function focusField(ref: React.RefObject<TextInputInstance | null>) {
    ref.current?.focus()
    if (Platform.OS !== "web") {
      const handle = findNodeHandle(ref.current)
      if (typeof handle === "number") AccessibilityInfo.setAccessibilityFocus(handle)
    }
  }

  function validateField(key: FieldKey): string | undefined {
    switch (key) {
      case "name":
        return name.trim() ? undefined : "Enter your username."
      case "email":
        return validateEmail(email) ?? undefined
      case "password":
        return validatePassword(password) ?? undefined
      case "birthDate":
        return validateBirthDate(birthDate) ?? undefined
      case "terms":
        return agreed ? undefined : "Please agree to the terms before creating an account."
      default:
        return undefined
    }
  }

  function setFieldError(key: FieldKey, message?: string) {
    setFieldErrors((previous) => {
      const next = { ...previous }
      if (message) next[key] = message
      else delete next[key]
      return next
    })
  }

  function markShown(key: FieldKey) {
    setShowErrors((previous) => ({ ...previous, [key]: true }))
  }

  function revalidateField(key: FieldKey) {
    if (!showErrors[key]) return
    setFieldError(key, validateField(key))
  }

  function validateOnBlur(key: FieldKey) {
    if (key === "name" && !name.trim()) return
    if (key === "email" && !email.trim()) return
    if (key === "password" && !password) return
    if (key === "birthDate" && !birthDate) return
    markShown(key)
    setFieldError(key, validateField(key))
  }

  async function submit() {
    const order: FieldKey[] = ["name", "email", "password", "birthDate", "terms"]
    const nextShown: Partial<Record<FieldKey, boolean>> = {}
    const nextErrors: Partial<Record<FieldKey, string>> = {}
    for (const key of order) {
      nextShown[key] = true
      const message = validateField(key)
      if (message) nextErrors[key] = message
    }
    setShowErrors((previous) => ({ ...previous, ...nextShown }))
    setFieldErrors(nextErrors)
    const firstInvalid = order.find((key) => nextErrors[key])
    if (firstInvalid) {
      if (firstInvalid === "name") focusField(nameInput)
      else if (firstInvalid === "email") focusField(emailInput)
      else if (firstInvalid === "password") focusField(passwordInput)
      else if (firstInvalid === "birthDate") focusField(birthYearInput)
      return
    }
    try {
      await signUp({ name: name.trim(), email: email.trim(), password, birthDate })
    } catch {
      // Server error remains in the auth store; field values are preserved.
    }
  }

  const nameError = showErrors.name ? fieldErrors.name : undefined
  const emailError = showErrors.email ? fieldErrors.email : undefined
  const passwordError = showErrors.password ? fieldErrors.password : undefined
  const birthError = showErrors.birthDate ? fieldErrors.birthDate : undefined
  const termsError = showErrors.terms ? fieldErrors.terms : undefined

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}
      keyboardDismissMode="interactive"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        disabled={pending}
        style={styles.back}
        onPress={() => router.replace("/(auth)")}
        hitSlop={8}
      >
        <Text style={styles.backLabel}>‹ Back</Text>
      </Pressable>

      <Text accessibilityRole="header" style={styles.title}>
        Create account
      </Text>

      <View style={styles.form}>
        <AuthField
          label="Username"
          inputRef={nameInput}
          value={name}
          error={Boolean(nameError)}
          errorMessage={nameError}
          onChangeText={(value) => {
            setName(value)
            if (showErrors.name) revalidateField("name")
          }}
          onBlur={() => validateOnBlur("name")}
          placeholder="Your username"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
          autoComplete="username"
          returnKeyType="next"
          editable={!pending}
        />
        <AuthField
          label="Email"
          inputRef={emailInput}
          value={email}
          error={Boolean(emailError)}
          errorMessage={emailError}
          onChangeText={(value) => {
            setEmail(value)
            if (showErrors.email) revalidateField("email")
          }}
          onBlur={() => validateOnBlur("email")}
          placeholder="Your email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          autoComplete="email"
          editable={!pending}
        />
        <DateOfBirthField
          yearInputRef={birthYearInput}
          value={birthDate}
          onChange={(value) => {
            setBirthDate(value)
            if (showErrors.birthDate) {
              setFieldError("birthDate", validateField("birthDate"))
            }
          }}
          onBlurField={() => validateOnBlur("birthDate")}
          error={birthError ?? null}
          showError={Boolean(showErrors.birthDate)}
          editable={!pending}
        />
        <AuthField
          testID="sign-up-password"
          label="Password"
          inputRef={passwordInput}
          helper={!passwordError ? PASSWORD_FIELD_HELPER : undefined}
          error={Boolean(passwordError)}
          errorMessage={passwordError}
          maxLength={72}
          value={password}
          onChangeText={(value) => {
            setPassword(value)
            if (showErrors.password) revalidateField("password")
          }}
          onBlur={() => validateOnBlur("password")}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
          autoCorrect={false}
          editable={!pending}
          onSubmitEditing={() => void submit()}
        />
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel="I accept the terms and privacy policy."
        accessibilityState={{ checked: agreed, disabled: pending }}
        disabled={pending}
        style={styles.consent}
        onPress={() => {
          const next = !agreed
          setAgreed(next)
          if (showErrors.terms) {
            setFieldError("terms", next ? undefined : validateField("terms"))
          }
        }}
      >
        <View style={[styles.checkbox, !agreed && styles.checkboxUnchecked]}>
          {agreed ? (
            <Image source={icons.check} style={styles.checkIcon} contentFit="contain" />
          ) : null}
        </View>
        <Text style={styles.consentText}>I accept the terms and privacy policy.</Text>
      </Pressable>
      {termsError ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.termsError}>
          {termsError}
        </Text>
      ) : null}

      {serverError ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.serverError}>
          {serverError}
        </Text>
      ) : null}

      <Pressable
        testID="sign-up-submit"
        accessibilityRole="button"
        accessibilityLabel="Create account"
        accessibilityState={{ disabled: pending, busy: pending }}
        disabled={pending}
        onPress={() => {
          void submit()
        }}
        style={[styles.primaryButton, pending && styles.disabled]}
      >
        <Text style={styles.primaryLabel}>Create account</Text>
      </Pressable>

      <View style={styles.privacy}>
        <Image source={icons.lock} style={styles.lockIcon} contentFit="contain" />
        <Text style={styles.privacyLabel}>Your health data is private</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log in"
          disabled={pending}
          onPress={pending ? undefined : handleSignIn}
          hitSlop={8}
        >
          <Text style={styles.footerLink}>Log in</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  termsError: { color: AuthColors.error, fontSize: 13, lineHeight: 20, marginTop: -8 },
  serverError: {
    color: AuthColors.onErrorContainer,
    fontSize: 13,
    lineHeight: 20,
    backgroundColor: AuthColors.errorContainer,
    borderRadius: 12,
    padding: 12,
  },
  disabled: { opacity: 0.6 },
  screen: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 18,
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: AuthColors.accent,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    color: AuthColors.text,
  },
  form: {
    gap: 24,
    paddingTop: 18,
  },
  consent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: AuthColors.accent,
  },
  checkboxUnchecked: {
    backgroundColor: AuthColors.surface,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  checkIcon: {
    width: 16,
    height: 16,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: AuthColors.textMuted,
  },
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
  primaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: AuthColors.onAccent,
  },
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 18,
    backgroundColor: AuthColors.card,
    borderRadius: 20,
  },
  lockIcon: {
    width: 16,
    height: 16,
  },
  privacyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: AuthColors.text,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 4,
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
})
