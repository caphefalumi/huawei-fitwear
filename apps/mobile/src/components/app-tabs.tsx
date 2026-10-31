import { Image } from 'expo-image';
import { router, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

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

type TabDef = (typeof LEFT_TABS)[number];

const BUBBLE_DURATION = 250;
const CONTENT_DURATION = 200;
const LABEL_HEIGHT = 15;
const BUBBLE_INSET_X = 8;
const BUBBLE_HEIGHT = 44;

function TabButton({
  tab,
  active,
  onPress,
  onLayout,
}: {
  tab: TabDef;
  active: boolean;
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const color = active ? C.accent : C.textMuted;
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: CONTENT_DURATION });
  }, [active, progress]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + 0.45 * progress.value,
    transform: [{ scale: 0.96 + 0.04 * progress.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    height: progress.value * LABEL_HEIGHT,
    marginTop: progress.value * 4,
    transform: [{ scale: 0.9 + 0.1 * progress.value }],
  }));

  return (
    <Pressable style={styles.tab} onPress={onPress} onLayout={onLayout}>
      <Animated.View style={[styles.tabInner, contentStyle]}>
        <Image source={tab.icon} style={styles.icon} contentFit="contain" tintColor={color} />
        <Animated.Text style={[styles.label, { color }, labelStyle]}>{tab.label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

function AppTabBar({ state, emitter, navigateToTab, insets }: TabBarProps) {
  const activeName = state.routes[state.index]?.name;
  const [layouts, setLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const bubbleX = useSharedValue(0);
  const bubbleW = useSharedValue(0);
  const pop = useSharedValue(1);
  const ripple = useSharedValue(0);

  const target = activeName ? layouts[activeName] : undefined;
  const targetX = target ? target.x + BUBBLE_INSET_X : null;
  const targetW = target ? target.width - BUBBLE_INSET_X * 2 : null;

  useEffect(() => {
    if (targetX !== null && targetW !== null) {
      bubbleX.value = withTiming(targetX, { duration: BUBBLE_DURATION });
      bubbleW.value = withTiming(targetW, { duration: BUBBLE_DURATION });
    }
  }, [targetX, targetW, bubbleX, bubbleW]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bubbleX.value }],
    width: bubbleW.value,
  }));

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ripple.value * 0.8 }],
    opacity: 0.45 * (1 - ripple.value),
  }));

  function handleCapture() {
    pop.value = withSequence(
      withTiming(0.88, { duration: 90 }),
      withSpring(1, { damping: 11, stiffness: 320 }),
    );
    ripple.value = 0;
    ripple.value = withTiming(1, { duration: 450 });
    router.push('/capture');
  }

  function renderTab(tab: TabDef) {
    const route = state.routes.find((item) => item.name === tab.name);
    const active = activeName === tab.name;

    function handlePress() {
      if (!route) return;
      const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!active && !event.defaultPrevented) navigateToTab(route.key);
    }

    function handleLayout(e: LayoutChangeEvent) {
      const { x, width } = e.nativeEvent.layout;
      setLayouts((prev) => {
        const prevLayout = prev[tab.name];
        if (prevLayout?.x === x && prevLayout?.width === width) return prev;
        return { ...prev, [tab.name]: { x, width } };
      });
    }

    return (
      <TabButton key={tab.name} tab={tab} active={active} onPress={handlePress} onLayout={handleLayout} />
    );
  }

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.bubble, bubbleStyle, { opacity: targetX === null ? 0 : 1 }]}
      />
      {LEFT_TABS.map(renderTab)}
      <View style={styles.centerSlot}>
        <Animated.View style={[styles.captureWrap, popStyle]}>
          <Animated.View pointerEvents="none" style={[styles.ripple, rippleStyle]} />
          <Pressable
            style={styles.capture}
            accessibilityLabel="Capture meal"
            onPress={handleCapture}>
            <View style={styles.plusHorizontal} />
            <View style={styles.plusVertical} />
          </Pressable>
        </Animated.View>
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
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    top: (58 - BUBBLE_HEIGHT) / 2,
    left: 0,
    height: BUBBLE_HEIGHT,
    borderRadius: 100,
    backgroundColor: 'rgba(157,35,50,0.12)',
  },
  centerSlot: {
    width: 72,
    height: 58,
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.accent,
  },
  captureWrap: {
    width: 60,
    height: 60,
    marginTop: -24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
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
