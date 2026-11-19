import "@/global.css"
import { QueryClientProvider } from "@tanstack/react-query"
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, usePathname } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native"
import { type PropsWithChildren, useEffect } from "react"
import { Text, useColorScheme, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"

import { AnimatedSplashOverlay } from "@/components/animated-icon"
import { NetworkStatusBanner } from "@/components/feedback/network-status"
import { APP_ROUTES, AuthProvider, useAuth } from "@/features/auth"
import { HealthProvider } from "@/features/health"
import { MealsProvider } from "@/features/meals"
import { WorkoutProvider } from "@/features/workout"
import { posthog } from "@/lib/analytics/posthog"
import { queryClient } from "@/lib/query/client"

SplashScreen.preventAutoHideAsync()

function ScreenTracker() {
  const pathname = usePathname()

  useEffect(() => {
    posthog?.screen(pathname)
  }, [pathname])

  return null
}

function AppRoot() {
  const colorScheme = useColorScheme()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <ScreenTracker />
              <NetworkStatusBanner />
              <RootNavigator />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function AccountProviders({ children }: PropsWithChildren) {
  return (
    <HealthProvider>
      <MealsProvider>
        <WorkoutProvider>{children}</WorkoutProvider>
      </MealsProvider>
    </HealthProvider>
  )
}

function RootNavigator() {
  const { user, loading } = useAuth()
  if (loading) return null
  const navigation = (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user} redirectTo={APP_ROUTES.login}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(settings)/account-data" />
          <Stack.Screen name="(settings)/developer-options" />
          <Stack.Screen name="(details)/nutrition" />
          <Stack.Screen name="(details)/progress" />
          <Stack.Screen name="(modals)/capture" />
          <Stack.Screen name="(workout)/chest-plan" />
          <Stack.Screen name="(workout)/exercise-guide" />
          <Stack.Screen name="(workout)/exercise-preferences" />
          <Stack.Screen name="(workout)/training-weights" />
          <Stack.Screen name="(workout)/plan" />
          <Stack.Screen name="(workout)/routine" />
          <Stack.Screen name="(workout)/session" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(details)/injuries" />
          <Stack.Screen name="(details)/meal" />
          <Stack.Screen name="(modals)/add-item" />
          <Stack.Screen name="(modals)/review-item" />
          <Stack.Screen name="(modals)/replace-food" />
          <Stack.Screen name="(details)/ble-sync" />
        </Stack.Protected>
        <Stack.Protected guard={!user} redirectTo={APP_ROUTES.home}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  )
  return user ? <AccountProviders key={user.id}>{navigation}</AccountProviders> : navigation
}

function StartupErrorFallback() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Text style={{ color: "#111111", textAlign: "center" }}>
        Something went wrong while starting the app. Reopen it to try again.
      </Text>
    </View>
  )
}

export default function RootLayout() {
  const app = (
    <PostHogErrorBoundary fallback={<StartupErrorFallback />}>
      <AppRoot />
    </PostHogErrorBoundary>
  )

  return posthog ? (
    <PostHogProvider client={posthog} autocapture={{ captureScreens: false }}>
      {app}
    </PostHogProvider>
  ) : (
    app
  )
}
