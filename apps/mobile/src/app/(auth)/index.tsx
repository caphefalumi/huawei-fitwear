import { router } from "expo-router";

import { LoginScreen } from "@/features/auth/login-screen";
import { APP_ROUTES } from "@/features/auth/auth-store";

export default function LoginRoute() {
  return <LoginScreen onCreateAccount={() => router.push(APP_ROUTES.signUp)} />;
}
