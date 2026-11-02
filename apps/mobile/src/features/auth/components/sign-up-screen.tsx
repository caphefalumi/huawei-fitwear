import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable } from "@/components/pressable";
import { WheelPicker } from "@/components/wheel-picker";
import { Palette as AuthColors } from "@/constants/palette";
import { APP_ROUTES, useAuth } from "../store/auth.store";
import { resolveBirthdaySelection } from "../utils/birth-date";
import { AuthField } from "./auth-field";

const icons = {
  chevronLeft: require("@/assets/images/auth/chevron-left.svg"),
  user: require("@/assets/images/auth/user-round.svg"),
  eyeOff: require("@/assets/images/auth/eye-off.svg"),
  check: require("@/assets/images/auth/check.svg"),
  lock: require("@/assets/images/auth/lock-keyhole.svg"),
};

const DATE_COLUMN_ORDER = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "numeric",
  year: "numeric",
})
  .formatToParts(new Date())
  .flatMap(({ type }) => (type === "day" || type === "month" || type === "year" ? [type] : []));

const MONTH_NAMES = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(2000, index, 1)),
);

export function SignUpScreen({ onSignIn }: { onSignIn?: () => void } = {}) {
  const insets = useSafeAreaInsets();
  const { signUp, pending, error } = useAuth();
  const handleSignIn = onSignIn ?? (() => router.replace(APP_ROUTES.login));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const today = new Date();
  const initialBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const [birthYear, setBirthYear] = useState(initialBirthDate.getFullYear());
  const [birthMonth, setBirthMonth] = useState(initialBirthDate.getMonth() + 1);
  const [birthDay, setBirthDay] = useState(initialBirthDate.getDate());
  const birthDate = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;
  const [agreed, setAgreed] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const yearValues = Array.from({ length: 201 }, (_, index) => today.getFullYear() - 100 + index);

  function selectBirthday(year: number, month: number, day: number) {
    const { date } = resolveBirthdaySelection(year, month, day);
    setBirthYear(date.getFullYear());
    setBirthMonth(date.getMonth() + 1);
    setBirthDay(date.getDate());
  }

  function isFutureDate(year: number, month: number, day: number) {
    return resolveBirthdaySelection(year, month, day).isFuture;
  }

  async function submit() {
    const date = new Date(`${birthDate}T00:00:00Z`);
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError("Enter your name and a valid email address.");
      return;
    }
    if (Array.from(password).length < 8) {
      setValidationError("Password must contain at least 8 characters.");
      return;
    }
    const passwordBytes = encodeURIComponent(password).replace(/%[0-9A-F]{2}/gi, "x").length;
    if (passwordBytes > 72) {
      setValidationError("Password must not exceed 72 UTF-8 bytes.");
      return;
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== birthDate ||
      date > new Date()
    ) {
      setValidationError("Select a valid date of birth, not in the future.");
      return;
    }
    if (!agreed) {
      setValidationError("Please agree to the terms before creating an account.");
      return;
    }
    setValidationError(null);
    try {
      await signUp({ name, email, password, birthDate });
    } catch {
      // Keep input values and display the server error from the auth store.
    }
  }
  const dateWheels = {
    month: (
      <WheelPicker
        label="Birth month"
        values={Array.from({ length: 12 }, (_, index) => index + 1)}
        value={birthMonth}
        onChange={(month) => selectBirthday(birthYear, month, birthDay)}
        format={(month) => MONTH_NAMES[month - 1]}
        isUnavailable={(month) => isFutureDate(birthYear, month, birthDay)}
        showActions={false}
        style={styles.monthColumn}
      />
    ),
    day: (
      <WheelPicker
        label="Birth day"
        values={Array.from(
          { length: new Date(birthYear, birthMonth, 0).getDate() },
          (_, index) => index + 1,
        )}
        value={birthDay}
        onChange={(day) => selectBirthday(birthYear, birthMonth, day)}
        format={(day) => String(day)}
        isUnavailable={(day) => isFutureDate(birthYear, birthMonth, day)}
        showActions={false}
        style={styles.dayColumn}
      />
    ),
    year: (
      <WheelPicker
        label="Birth year"
        values={yearValues}
        value={birthYear}
        onChange={(year) => selectBirthday(year, birthMonth, birthDay)}
        format={(year) => String(year)}
        isUnavailable={(year) => isFutureDate(year, birthMonth, birthDay)}
        showActions={false}
        style={styles.yearColumn}
      />
    ),
  };
  const dateColumnStyles = {
    day: styles.dayColumn,
    month: styles.monthColumn,
    year: styles.yearColumn,
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign in"
        disabled={pending}
        style={styles.back}
        onPress={handleSignIn}
        hitSlop={8}
      >
        <Image
          accessible={false}
          source={icons.chevronLeft}
          style={styles.backIcon}
          contentFit="contain"
        />
        <Text style={styles.backLabel}>Sign in</Text>
      </Pressable>

      <Text accessibilityRole="header" style={styles.title}>
        Start your journey.
      </Text>

      <View style={styles.form}>
        <AuthField
          label="Name"
          icon={icons.user}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          textContentType="name"
          autoComplete="name"
          editable={!pending}
        />
        <AuthField
          label="Email"
          icon={icons.user}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          autoComplete="email"
          editable={!pending}
        />
        <AuthField
          label="Password"
          icon={icons.eyeOff}
          helper="At least 8 characters. Maximum 72 UTF-8 bytes."
          maxLength={72}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          editable={!pending}
        />
        <View style={styles.dateField}>
          <Text style={styles.dateLabel}>Date of birth</Text>
          <View style={styles.dateColumns}>
            {DATE_COLUMN_ORDER.map((column) => (
              <View key={column} style={dateColumnStyles[column]}>
                {dateWheels[column]}
              </View>
            ))}
          </View>
          <Text style={styles.dateHelper}>
            Future dates appear dimmed and snap back to today when released.
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel="Agree to Terms of Service and User Agreement"
        aria-checked={agreed}
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
        <Text style={styles.consentText}>
          I agree to the <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>User Agreement</Text>.
        </Text>
      </Pressable>

      {validationError || error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {validationError ?? error}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create account"
        accessibilityState={{ disabled: pending, busy: pending }}
        disabled={pending}
        onPress={() => {
          void submit();
        }}
        style={[styles.primaryButton, pending && styles.disabled]}
      >
        {pending ? (
          <ActivityIndicator color={AuthColors.onAccent} />
        ) : (
          <Text style={styles.primaryLabel}>Create account</Text>
        )}
      </Pressable>

      <View style={styles.privacy}>
        <Image source={icons.lock} style={styles.lockIcon} contentFit="contain" />
        <Text style={styles.privacyLabel}>Your health data is private</Text>
      </View>

      <Text style={styles.footer}>
        Already have an account?{" "}
        <Text
          accessibilityRole="link"
          style={styles.footerLink}
          onPress={pending ? undefined : handleSignIn}
        >
          Sign in
        </Text>
      </Text>
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
    gap: 18,
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: AuthColors.accent,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "400",
    color: AuthColors.text,
  },
  form: {
    gap: 18,
    paddingTop: 18,
  },
  dateField: {
    gap: 8,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: AuthColors.text,
  },
  dateColumns: {
    flexDirection: "row",
    gap: 4,
    overflow: "hidden",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: 14,
    backgroundColor: AuthColors.surface,
  },
  monthColumn: {
    flex: 1.1,
  },
  dayColumn: {
    flex: 0.7,
  },
  yearColumn: {
    flex: 1.2,
  },
  dateHelper: {
    fontSize: 11,
    lineHeight: 16,
    color: AuthColors.textMuted,
  },
  consent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
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
    fontSize: 12,
    lineHeight: 20,
    color: AuthColors.textMuted,
  },
  link: {
    color: AuthColors.accent,
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
  footer: {
    paddingTop: 4,
    fontSize: 13,
    color: AuthColors.textMuted,
    textAlign: "center",
  },
  footerLink: {
    fontWeight: "600",
    color: AuthColors.accent,
  },
});
