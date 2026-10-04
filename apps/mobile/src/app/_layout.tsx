import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { isDark } = useAppTheme();

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="snap-meal"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="active-workout"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="devices"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="watch-preview"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="exercise-detail"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="session-summary"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="ring-gallery"
          options={{ headerShown: false, presentation: 'card' }}
        />
      </Stack>
    </>
  );
}
