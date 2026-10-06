import React from 'react';
import { Tabs, router } from 'expo-router';
import { View, Text, Pressable, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../theme';

interface CustomTabBarProps {
  state: any;
  navigation: any;
  descriptors: any;
}

function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const { theme } = useAppTheme();
  const { bottom } = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  // Floating tab bar: 16px side margins
  const tabWidth = windowWidth - 32;
  const tabHeight = 62;
  const center = tabWidth / 2;
  const pillRadius = 31;

  // Smooth circular cradle contouring symmetrically around and underneath the bottom of the camera FAB
  const d = [
    `M ${pillRadius} 0`,
    `L ${center - 42} 0`,
    `C ${center - 32} 0, ${center - 28} 8, ${center - 25} 18`,
    `C ${center - 20} 32, ${center - 13} 39, ${center} 39`,
    `C ${center + 13} 39, ${center + 20} 32, ${center + 25} 18`,
    `C ${center + 28} 8, ${center + 32} 0, ${center + 42} 0`,
    `L ${tabWidth - pillRadius} 0`,
    `A ${pillRadius} ${pillRadius} 0 0 1 ${tabWidth} ${pillRadius}`,
    `A ${pillRadius} ${pillRadius} 0 0 1 ${tabWidth - pillRadius} ${tabHeight}`,
    `L ${pillRadius} ${tabHeight}`,
    `A ${pillRadius} ${pillRadius} 0 0 1 0 ${pillRadius}`,
    `A ${pillRadius} ${pillRadius} 0 0 1 ${pillRadius} 0`,
    'Z'
  ].join(' ');

  const activeRouteName = state.routes[state.index]?.name;

  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          bottom: Math.max(bottom, 6) + 4,
          width: tabWidth,
          left: 16
        }
      ]}
      pointerEvents="box-none"
    >
      {/* SVG Background with Concave V/U Scoop Notch */}
      <View
        style={[
          StyleSheet.absoluteFill,
          Platform.select({
            web: {
              filter: theme.isDark
                ? 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.65))'
                : 'drop-shadow(0 8px 24px rgba(37, 99, 235, 0.12))'
            },
            default: {
              shadowColor: theme.shadow,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: theme.isDark ? 0.45 : 0.12,
              shadowRadius: 16,
              elevation: 8
            }
          })
        ]}
        pointerEvents="none"
      >
        <Svg width={tabWidth} height={tabHeight} style={StyleSheet.absoluteFill}>
          <Path
            d={d}
            fill={theme.isDark ? '#111827F2' : '#FFFFFFF8'}
            stroke={theme.border}
            strokeWidth={1}
          />
        </Svg>
      </View>

      {/* 5 Symmetrically Spaced Items (Each taking exactly 20% width) */}
      <View style={styles.tabItemsRow}>
        {/* Tab 1: Home (10% center) */}
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Home"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            navigation.navigate('index');
          }}
          style={styles.tabItem}
        >
          <Ionicons
            name={activeRouteName === 'index' ? 'home' : 'home-outline'}
            size={22}
            color={activeRouteName === 'index' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeRouteName === 'index' ? theme.primary : theme.textSecondary }
            ]}
          >
            Home
          </Text>
        </Pressable>

        {/* Tab 2: Nutrition (30% center) */}
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Nutrition"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            navigation.navigate('nutrition');
          }}
          style={styles.tabItem}
        >
          <Ionicons
            name={activeRouteName === 'nutrition' ? 'restaurant' : 'restaurant-outline'}
            size={21}
            color={activeRouteName === 'nutrition' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeRouteName === 'nutrition' ? theme.primary : theme.textSecondary }
            ]}
          >
            Nutrition
          </Text>
        </Pressable>

        {/* Tab 3: Center Floating Camera FAB (50% center - Nestled inside the V/U scoop notch) */}
        <View style={styles.centerFabSlot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Meal Snap Camera"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              router.push('/snap-meal');
            }}
            style={({ pressed }) => [
              styles.centerCircleBtn,
              {
                backgroundColor: theme.primary,
                transform: [{ scale: pressed ? 0.94 : 1 }],
                ...Platform.select({
                  web: {
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.40)'
                  },
                  default: {
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.40,
                    shadowRadius: 10,
                    elevation: 7
                  }
                })
              }
            ]}
          >
            <Ionicons name="camera" size={24} color={theme.onPrimary} />
          </Pressable>
        </View>

        {/* Tab 4: Plan (70% center) */}
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Plan"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            navigation.navigate('train');
          }}
          style={styles.tabItem}
        >
          <Ionicons
            name={activeRouteName === 'train' ? 'calendar' : 'calendar-outline'}
            size={21}
            color={activeRouteName === 'train' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeRouteName === 'train' ? theme.primary : theme.textSecondary }
            ]}
          >
            Plan
          </Text>
        </Pressable>

        {/* Tab 5: Progress (90% center) */}
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Progress"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            navigation.navigate('progress');
          }}
          style={styles.tabItem}
        >
          <Ionicons
            name={activeRouteName === 'progress' ? 'bar-chart' : 'bar-chart-outline'}
            size={21}
            color={activeRouteName === 'progress' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeRouteName === 'progress' ? theme.primary : theme.textSecondary }
            ]}
          >
            Progress
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: theme.background }
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="nutrition" options={{ title: 'Nutrition' }} />
        <Tabs.Screen name="camera" options={{ title: 'Camera' }} />
        <Tabs.Screen name="train" options={{ title: 'Plan Generation' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
        <Tabs.Screen name="learn" options={{ href: null }} />
        <Tabs.Screen name="me" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  tabItemsRow: {
    flexDirection: 'row',
    width: '100%',
    height: 62,
    alignItems: 'center'
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
    gap: 3
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600'
  },
  centerFabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 62
  },
  centerCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12
  }
});
