import { router } from 'expo-router';

import { LoginScreen } from '@/features/auth/login-screen';

export default function LoginRoute() {
  return <LoginScreen onCreateAccount={() => router.push('/sign-up')} />;
}
