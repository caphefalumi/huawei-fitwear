import { router } from 'expo-router';

import { SignUpScreen } from '@/features/auth/sign-up-screen';

export default function SignUpRoute() {
  return <SignUpScreen onSignIn={() => router.back()} />;
}
