import { router } from 'expo-router';

import { LoginScreen } from '@/features/auth/login-screen';

export default function LoginRoute() {
  return (
    <LoginScreen
      onLoggedIn={() => router.replace('/home')}
      onCreateAccount={() => router.push('/sign-up')}
    />
  );
}
