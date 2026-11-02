import { router } from "expo-router";

import { SignUpScreen } from "@/features/auth/sign-up-screen";
import { APP_ROUTES } from "@/features/auth/auth-store";

export default function SignUpRoute() {
  return <SignUpScreen onSignIn={() => router.replace(APP_ROUTES.login)} />;
}
