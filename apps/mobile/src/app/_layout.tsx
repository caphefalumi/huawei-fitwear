import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { HealthProvider } from '@/features/health/health-store';
import { MealsProvider } from '@/features/meals/meals-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HealthProvider>
          <MealsProvider>
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="nutrition" />
              <Stack.Screen name="progress" />
              <Stack.Screen name="recovery" />
              <Stack.Screen name="chest-plan" />
              <Stack.Screen name="exercise-guide" />
              <Stack.Screen name="meal" />
              <Stack.Screen name="add-item" />
              <Stack.Screen name="review-item" />
              <Stack.Screen name="replace-food" />
            </Stack>
          </MealsProvider>
        </HealthProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
