import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthColors } from '@/features/auth/tokens';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: AuthColors.background },
        }}
      />
    </>
  );
}
