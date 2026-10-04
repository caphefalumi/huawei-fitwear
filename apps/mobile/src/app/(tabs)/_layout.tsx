import React from 'react';
import { Tabs, router } from 'expo-router';
import { View, Pressable, Platform, StyleSheet } from 'react-native';
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
            bottom: Math.max(bottom, 6) + 4,
            left: 16,
            right: 16,
            height: 60,
            borderRadius: radii.full,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.isDark ? '#161C1BF0' : '#FFFFFFF2',
            paddingBottom: 6,
            paddingTop: 6,
            paddingHorizontal: 8,
            ...Platform.select({
              web: {
                boxShadow: theme.isDark
                  ? '0 12px 32px rgba(0, 0, 0, 0.65)'
                  : '0 8px 24px rgba(0, 94, 83, 0.10)'
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
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600'
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'flame' : 'flame-outline'} size={22} color={color} />
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
          name="camera"
          options={{
            title: '',
            tabBarButton: () => (
              <View style={styles.centerButtonWrapper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Meal Snap Camera"
                  onPress={() => router.push('/snap-meal')}
                  style={({ pressed }) => [
                    styles.centerCircleBtn,
                    {
                      backgroundColor: theme.primary,
                      transform: [{ scale: pressed ? 0.94 : 1 }],
                      ...Platform.select({
                        web: {
                          boxShadow: '0 4px 16px rgba(0, 94, 83, 0.35)'
                        },
                        default: {
                          shadowColor: theme.primary,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.35,
                          shadowRadius: 10,
                          elevation: 6
                        }
                      })
                    }
                  ]}
                >
                  <Ionicons name="camera" size={26} color={theme.onPrimary} />
                </Pressable>
              </View>
            )
          }}
        />

        <Tabs.Screen
          name="train"
          options={{
            title: 'Plan',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={22} color={color} />
            )
          }}
        />

        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={21} color={color} />
            )
          }}
        />

        <Tabs.Screen
          name="learn"
          options={{
            href: null
          }}
        />

        <Tabs.Screen
          name="me"
          options={{
            href: null
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  centerButtonWrapper: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60
  },
  centerCircleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
