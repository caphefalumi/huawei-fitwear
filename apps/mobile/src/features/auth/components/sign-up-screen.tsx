import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/pressable"
import { Palette as AuthColors } from "@/theme"
import { APP_ROUTES, useAuth } from "../store/auth.store"
import { AuthField } from "./auth-field"
import { DateOfBirthField } from "./date-of-birth-field"

const icons = {
  check: require("@/assets/images/auth/check.svg"),
  lock: require("@/assets/images/auth/lock-keyhole.svg"),
}

export function SignUpScreen({ onSignIn }: { onSignIn?: () => void } = {}) {
  const insets = useSafeAreaInsets()
  const { signUp, pending, error } = useAuth()
  const handleSignIn = onSignIn ?? (() => router.replace(APP_ROUTES.login))
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  async function submit() {
    const date = new Date(`${birthDate}T00:00:00Z`)
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError("Enter your name and a valid email address.")
      return
    }
    if (Array.from(password).length < 8) {
      setValidationError("Password must contain at least 8 characters.")
      return
    }
    const passwordBytes = encodeURIComponent(password).replace(/%[0-9A-F]{2}/gi, "x").length
    if (passwordBytes > 72) {
      setValidationError("Password must not exceed 72 UTF-8 bytes.")
      return
    }
    const validDate =
      /^\d{4}-\d{2}-\d{2}$/.test(birthDate) &&
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === birthDate
    if (!validDate) {
      setValidationError("Enter a valid date")
      return
    }
    if (birthDate > new Date().toISOString().slice(0, 10)) {
      setValidationError("Date can't be in the future")
      return
    }
    const today = new Date()
    const age =
      today.getUTCFullYear() -
      date.getUTCFullYear() -
      (today.getUTCMonth() < date.getUTCMonth() ||
      (today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() < date.getUTCDate())
        ? 1
        : 0)
    if (age < 13) {
      setValidationError("You must be at least 13 years old to create an account.")
      return
    }
    if (date.getUTCFullYear() < today.getUTCFullYear() - 120) {
      setValidationError("Enter a valid date")
      return
    }
    if (!agreed) {
      setValidationError("Please agree to the terms before creating an account.")
      return
    }
    setValidationError(null)
    try {
      await signUp({ name, email, password, birthDate })
    } catch {
      // Keep input values and display the server error from the auth store.
    }
  }

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
          value={name}
          onChangeText={setName}
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
          value={email}
          onChangeText={setEmail}
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
          value={birthDate}
          onChange={(value) => {
            setBirthDate(value)
            setValidationError(null)
          }}
          error={
            validationError?.includes("date") ||
            validationError?.includes("Date") ||
            validationError?.includes("years old")
              ? validationError
              : null
          }
          editable={!pending}
        />
        <AuthField
          label="Password"
          helper="At least 8 characters. Maximum 72 UTF-8 bytes."
          maxLength={72}
          value={password}
          onChangeText={setPassword}
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
        onPress={() => setAgreed((value) => !value)}
      >
        <View style={[styles.checkbox, !agreed && styles.checkboxUnchecked]}>
          {agreed ? (
            <Image source={icons.check} style={styles.checkIcon} contentFit="contain" />
          ) : null}
        </View>
        <Text style={styles.consentText}>I accept the terms and privacy policy.</Text>
      </Pressable>

      {validationError || error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {validationError ?? error}
        </Text>
      ) : null}

      <Pressable
        testID="sign-up-submit"
        accessibilityRole="button"
        accessibilityLabel="Create account"
        accessibilityState={{
          disabled:
            pending ||
            name.trim().length === 0 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            Array.from(password).length < 8 ||
            !birthDate ||
            !agreed,
        }}
        disabled={
          pending ||
          name.trim().length === 0 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
          Array.from(password).length < 8 ||
          !birthDate ||
          !agreed
        }
        onPress={() => {
          void submit()
        }}
        style={[
          styles.primaryButton,
          (pending ||
            name.trim().length === 0 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            Array.from(password).length < 8 ||
            !birthDate ||
            !agreed) &&
            styles.disabled,
        ]}
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
  error: { color: AuthColors.text, fontSize: 13, lineHeight: 20 },
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
