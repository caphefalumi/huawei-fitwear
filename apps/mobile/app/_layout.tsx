import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/query-client";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { NetworkStatusBanner } from "@/components/network-status";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { APP_ROUTES, AuthProvider, useAuth } from "@/features/auth";
import { HealthProvider } from "@/features/health";
import { MealsProvider } from "@/features/meals";
import { WorkoutProvider } from "@/features/workout";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <NetworkStatusBanner />
              <RootNavigator />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AccountProviders({ children }: PropsWithChildren) {
  return (
    <HealthProvider>
      <MealsProvider>
        <WorkoutProvider>{children}</WorkoutProvider>
      </MealsProvider>
    </HealthProvider>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;
  const navigation = (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user} redirectTo={APP_ROUTES.login}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="account-data" />
          <Stack.Screen name="nutrition" />
          <Stack.Screen name="progress" />
          <Stack.Screen name="capture" />
          <Stack.Screen name="chest-plan" />
          <Stack.Screen name="exercise-guide" />
          <Stack.Screen name="meal" />
          <Stack.Screen name="add-item" />
          <Stack.Screen name="review-item" />
          <Stack.Screen name="replace-food" />
          <Stack.Screen name="ble-sync" />
        </Stack.Protected>
        <Stack.Protected guard={!user} redirectTo={APP_ROUTES.home}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
  return user ? <AccountProviders key={user.id}>{navigation}</AccountProviders> : navigation;
}
