import { Image } from 'expo-image';
import { router, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';

type TabBarRenderer = NonNullable<ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarRenderer>[0];

const LEFT_TABS = [
  { name: 'home', label: 'Home', icon: require('@/assets/images/home/tab-house.svg') },
  { name: 'meals', label: 'Meals', icon: require('@/assets/images/home/tab-utensils.svg') },
];

const RIGHT_TABS = [
  { name: 'workout', label: 'Workout', icon: require('@/assets/images/home/tab-dumbbell.svg') },
  { name: 'profile', label: 'Profile', icon: require('@/assets/images/home/tab-user-round.svg') },
];

function AppTabBar({ state, emitter, navigateToTab, insets }: TabBarProps) {
  const activeName = state.routes[state.index]?.name;

  function renderTab(tab: (typeof LEFT_TABS)[number]) {
    const route = state.routes.find((item) => item.name === tab.name);
    const active = activeName === tab.name;
    const color = active ? C.accent : C.textMuted;

    function handlePress() {
      if (!route) return;
      const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!active && !event.defaultPrevented) navigateToTab(route.key);
    }

    return (
      <Pressable key={tab.name} style={styles.tab} onPress={handlePress}>
        <Image source={tab.icon} style={styles.icon} contentFit="contain" tintColor={color} />
        <Text style={[styles.label, { color }]}>{tab.label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {LEFT_TABS.map(renderTab)}
      <View style={styles.centerSlot}>
        <Pressable
          style={styles.capture}
          accessibilityLabel="Capture meal"
          onPress={() => router.push('/capture')}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </Pressable>
      </View>
      {RIGHT_TABS.map(renderTab)}
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs tabBar={(props) => <AppTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="meals" />
      <Tabs.Screen name="workout" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  tab: {
    flex: 1,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  centerSlot: {
    width: 72,
    height: 58,
    alignItems: 'center',
  },
  capture: {
    position: 'absolute',
    top: -24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.accent,
    borderWidth: 4,
    borderColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.onAccent,
  },
  plusVertical: {
    position: 'absolute',
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: C.onAccent,
  },
});
