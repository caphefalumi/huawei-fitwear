import { useEffect, type ReactNode } from "react";
import {
  Keyboard,
  Modal,
  Pressable as ScrimPressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReducedMotion } from "react-native-reanimated";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";

type SheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Bottom overlay matching the Figma "Input sheet" frames (scrim + white card). */
export function Sheet({ visible, title, onClose, children }: SheetProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return;
    if (Keyboard.isVisible()) Keyboard.dismiss();
    return () => Keyboard.dismiss();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reducedMotion ? "none" : "slide"}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior="padding" automaticOffset style={styles.keyboardArea}>
          <ScrimPressable
            accessible={false}
            importantForAccessibility="no"
            style={styles.backdropFill}
            onPress={onClose}
          />
          <View
            accessibilityViewIsModal
            onAccessibilityEscape={onClose}
            style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}
          >
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              <Pressable
                accessibilityLabel={`Close ${title}`}
                onPress={onClose}
                style={styles.close}
              >
                <Text style={styles.secondaryLabel}>Close</Text>
              </Pressable>
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export function SheetField({ label, children }: { label: string; children: ReactNode }) {
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
  primaryDisabled = false,
  secondaryDisabled = false,
  busy = false,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  busy?: boolean;
}) {
  return (
    <View style={styles.actions}>
      <Pressable
        style={styles.primaryButton}
        disabled={primaryDisabled}
        accessibilityState={{ busy }}
        onPress={onPrimary}
      >
        <Text style={styles.primaryLabel}>{primaryLabel}</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} disabled={secondaryDisabled} onPress={onSecondary}>
        <Text style={styles.secondaryLabel}>{secondaryLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(37, 35, 33, 0.4)",
  },
  keyboardArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropFill: {
    flex: 1,
  },
  sheet: {
    maxHeight: "86%",
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  close: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "600",
    color: C.text,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
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
    fontWeight: "500",
    color: C.textMuted,
  },
  actions: {
    gap: 10,
    paddingTop: 6,
  },
  primaryButton: {
    minHeight: 52,
    padding: 12,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.onAccent,
  },
  secondaryButton: {
    minHeight: 48,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
});
