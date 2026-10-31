import {
  TabList,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
  Tabs,
  type TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette as C } from '@/constants/palette';

const TABS = [
  { name: 'home', label: 'Home' },
  { name: 'meals', label: 'Meals' },
  { name: 'workout', label: 'Workout' },
  { name: 'profile', label: 'Profile' },
] as const;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <TabBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={`/${tab.name}`} asChild>
              <TabButton>{tab.label}</TabButton>
            </TabTrigger>
          ))}
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={[styles.label, isFocused && styles.labelActive]}>{children}</Text>
      {isFocused && <View style={styles.dot} />}
    </Pressable>
  );
}

function TabBar(props: TabListProps) {
  return (
    <View {...props} style={styles.bar}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    height: '100%',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingVertical: 12,
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 10,
    color: C.textMuted,
  },
  labelActive: {
    fontWeight: '700',
    color: C.accent,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.accent,
    marginTop: 3,
  },
});
