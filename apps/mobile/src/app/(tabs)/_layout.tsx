import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';

export default function TabsLayout() {
  const { theme, radii } = useAppTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: Math.max(bottom, 8) + 8,
            left: 18,
            right: 18,
            height: 60,
            borderRadius: radii.full,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.isDark ? '#161618F0' : '#FFFFFFF2',
            paddingBottom: 6,
            paddingTop: 6,
            paddingHorizontal: 8,
            ...Platform.select({
              web: {
                boxShadow: theme.isDark
                  ? '0 12px 32px rgba(0, 0, 0, 0.65)'
                  : '0 12px 32px rgba(15, 23, 42, 0.12)'
              },
              default: {
                shadowColor: theme.shadow,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: theme.isDark ? 0.45 : 0.12,
                shadowRadius: 16,
                elevation: 8
              }
            })
          },
          tabBarItemStyle: {
            paddingVertical: 2
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.3
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={21} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="nutrition"
          options={{
            title: 'Nutrition',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={21} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="train"
          options={{
            title: 'Train',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={21} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'trending-up' : 'trending-up-outline'} size={21} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="me"
          options={{
            title: 'Me',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={21} color={color} />
            )
          }}
        />
      </Tabs>
    </View>
  );
}
