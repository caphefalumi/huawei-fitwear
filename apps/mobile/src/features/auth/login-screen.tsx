import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthField } from './auth-field';
import { AuthColors } from './tokens';

const icons = {
  logo: require('@/assets/images/auth/logo.svg'),
  user: require('@/assets/images/auth/user-round.svg'),
  eyeOff: require('@/assets/images/auth/eye-off.svg'),
};

export function LoginScreen({ onCreateAccount, onForgotPassword }: {
  onCreateAccount: () => void;
  onForgotPassword?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('Sam.Nguyen');
  const [password, setPassword] = useState('password1234');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom }]}
      keyboardShouldPersistTaps="handled">
      <View style={styles.brand}>
        <Image source={icons.logo} style={styles.brandMark} contentFit="contain" />
        <Text style={styles.brandName}>VoocHealth</Text>
      </View>

      <Text style={styles.welcome}>Welcome back.</Text>

      <View style={styles.credentials}>
        <AuthField
          label="Username"
          icon={icons.user}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
        />
        <AuthField
          label="Password"
          icon={icons.eyeOff}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />
      </View>

      <Pressable onPress={onForgotPassword} hitSlop={8}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </Pressable>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryLabel}>Log in</Text>
      </Pressable>

      <Text style={styles.terms}>
        By continuing, you agree to <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>User Agreement</Text>.
      </Text>

      <View style={styles.footer}>
        <View style={styles.separator} />
        <Text style={styles.footerText}>
          No account?{'  '}
          <Text style={styles.footerLink} onPress={onCreateAccount}>
            Create account
          </Text>
        </Text>
      </View>
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
    gap: 22,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandMark: {
    width: 26,
    height: 26,
  },
  brandName: {
    fontSize: 19,
    fontWeight: '400',
    color: AuthColors.text,
  },
  welcome: {
    marginTop: 70,
    fontSize: 36,
    lineHeight: 41,
    fontWeight: '600',
    color: AuthColors.text,
  },
  credentials: {
    gap: 18,
  },
  forgot: {
    fontSize: 13,
    fontWeight: '500',
    color: AuthColors.accent,
    textAlign: 'right',
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
  terms: {
    fontSize: 11,
    lineHeight: 19,
    color: AuthColors.textMuted,
    textAlign: 'center',
  },
  link: {
    color: AuthColors.accent,
  },
  footer: {
    alignItems: 'center',
    gap: 15,
    paddingTop: 20,
  },
  separator: {
    width: 48,
    height: 1,
    borderRadius: 100,
    backgroundColor: AuthColors.border,
  },
  footerText: {
    fontSize: 13,
    color: AuthColors.textMuted,
  },
  footerLink: {
    fontWeight: '600',
    color: AuthColors.accent,
  },
});
