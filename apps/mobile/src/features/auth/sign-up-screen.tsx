import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { AuthField } from './auth-field';
import { AuthColors } from './tokens';

const icons = {
  chevronLeft: require('@/assets/images/auth/chevron-left.svg'),
  user: require('@/assets/images/auth/user-round.svg'),
  eyeOff: require('@/assets/images/auth/eye-off.svg'),
  calendar: require('@/assets/images/auth/calendar-days.svg'),
  check: require('@/assets/images/auth/check.svg'),
  lock: require('@/assets/images/auth/lock-keyhole.svg'),
};

export function SignUpScreen({ onSignIn }: { onSignIn: () => void }) {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('Sam.Nguyen');
  const [password, setPassword] = useState('password1234');
  const [dateOfBirth, setDateOfBirth] = useState('2 Sep 1976');
  const [agreed, setAgreed] = useState(true);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom }]}
      keyboardShouldPersistTaps="handled">
      <Pressable style={styles.back} onPress={onSignIn} hitSlop={8}>
        <Image source={icons.chevronLeft} style={styles.backIcon} contentFit="contain" />
        <Text style={styles.backLabel}>Sign in</Text>
      </Pressable>

      <Text style={styles.title}>Start your journey.</Text>

      <View style={styles.form}>
        <AuthField
          label="Username"
          icon={icons.user}
          helper="3–30 characters, no spaces."
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
        />
        <AuthField
          label="Password"
          icon={icons.eyeOff}
          helper="8+ characters, letters & numbers"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
        />
        <AuthField
          label="Date of birth"
          icon={icons.calendar}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />
      </View>

      <Pressable style={styles.consent} onPress={() => setAgreed((value) => !value)}>
        <View style={[styles.checkbox, !agreed && styles.checkboxUnchecked]}>
          {agreed ? <Image source={icons.check} style={styles.checkIcon} contentFit="contain" /> : null}
        </View>
        <Text style={styles.consentText}>
          I agree to the <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>User Agreement</Text>.
        </Text>
      </Pressable>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryLabel}>Create account</Text>
      </Pressable>

      <View style={styles.privacy}>
        <Image source={icons.lock} style={styles.lockIcon} contentFit="contain" />
        <Text style={styles.privacyLabel}>Your health data is private</Text>
      </View>

      <Text style={styles.footer}>
        Already have an account?{' '}
        <Text style={styles.footerLink} onPress={onSignIn}>
          Sign in
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 18,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: AuthColors.accent,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '400',
    color: AuthColors.text,
  },
  form: {
    gap: 18,
    paddingTop: 18,
  },
  consent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AuthColors.accent,
    borderWidth: 1,
    borderColor: AuthColors.accentBorder,
    borderRadius: 12,
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AuthColors.onAccent,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    color: AuthColors.text,
  },
  footer: {
    paddingTop: 4,
    fontSize: 13,
    color: AuthColors.textMuted,
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: '600',
    color: AuthColors.accent,
  },
});
