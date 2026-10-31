import type { ReactNode } from 'react';
import { Modal, Pressable as ScrimPressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';

type SheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Bottom overlay matching the Figma "Input sheet" frames (scrim + white card). */
export function Sheet({ visible, title, onClose, children }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <ScrimPressable style={styles.backdropFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function SheetField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function SheetActions({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <View style={styles.actions}>
      <Pressable style={styles.primaryButton} onPress={onPrimary}>
        <Text style={styles.primaryLabel}>{primaryLabel}</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onSecondary}>
        <Text style={styles.secondaryLabel}>{secondaryLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(37, 35, 33, 0.4)',
  },
  backdropFill: {
    flex: 1,
  },
  sheet: {
    maxHeight: '86%',
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: C.text,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 4,
  },
  field: {
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: C.textMuted,
  },
  actions: {
    gap: 10,
    paddingTop: 6,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: C.onAccent,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
});
