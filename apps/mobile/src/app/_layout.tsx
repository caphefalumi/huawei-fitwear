import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { type PropsWithChildren } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/features/auth/auth-store";
import { HealthProvider } from "@/features/health/health-store";
import { MealsProvider } from "@/features/meals/meals-store";
import { WorkoutProvider } from "@/features/workout/workout-store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <RootNavigator />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
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
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator accessibilityLabel="Restoring session" />
      </View>
    );
  }
  const navigation = (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user} redirectTo="/">
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="nutrition" />
          <Stack.Screen name="progress" />
          <Stack.Screen name="capture" />
          <Stack.Screen name="chest-plan" />
          <Stack.Screen name="exercise-guide" />
          <Stack.Screen name="meal" />
          <Stack.Screen name="add-item" />
          <Stack.Screen name="review-item" />
          <Stack.Screen name="replace-food" />
        </Stack.Protected>
        <Stack.Protected guard={!user} redirectTo="/home">
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
  return user ? <AccountProviders key={user.id}>{navigation}</AccountProviders> : navigation;
}
