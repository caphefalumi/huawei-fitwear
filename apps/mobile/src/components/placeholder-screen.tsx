import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';

/** Placeholder for tab screens that have no Figma design yet. */
export function PlaceholderScreen({ title, note }: { title: string; note: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  note: {
    fontSize: 13,
    color: C.textMuted,
  },
});
