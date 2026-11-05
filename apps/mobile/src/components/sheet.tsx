import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  Modal,
  Pressable as ScrimPressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { useReducedMotion } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { CloseButton } from "@/components/close-button"
import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/theme"

type SheetProps = {
  visible: boolean
  title: string
  onClose: () => void
  onDismiss?: () => void
  children: ReactNode
}

/** Bottom overlay matching the Figma "Input sheet" frames (scrim + white card). */
export function Sheet({ visible, title, onClose, onDismiss, children }: SheetProps) {
  const insets = useSafeAreaInsets()
  const reducedMotion = useReducedMotion()
  const [appearance] = useState(() => new Animated.Value(reducedMotion ? 1 : 0))
  const [presented, setPresented] = useState(visible)
  const dismissCallback = useRef(onDismiss)
  const content = useRef({ title, children })
  useEffect(() => {
    dismissCallback.current = onDismiss
    if (visible) content.current = { title, children }
  }, [onDismiss, visible, title, children])

  useEffect(() => {
    if (visible) setPresented(true)
    const animation = Animated.timing(appearance, {
      toValue: visible ? 1 : 0,
      duration: reducedMotion ? 0 : visible ? 220 : 160,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
      useNativeDriver: true,
    })
    animation.start(({ finished }) => {
      if (finished && !visible) {
        setPresented(false)
        dismissCallback.current?.()
      }
    })
    return () => animation.stop()
  }, [appearance, reducedMotion, visible])

  const displayed = visible ? { title, children } : content.current

  useEffect(() => {
    if (!visible) return
    if (Keyboard.isVisible()) Keyboard.dismiss()
    return () => Keyboard.dismiss()
  }, [visible])

  return (
    <Modal
      visible={visible || presented}
      transparent
      animationType="none"
      onRequestClose={() => {
        if (visible) onClose()
      }}
    >
      <View style={styles.backdrop} pointerEvents={visible ? "auto" : "none"}>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.scrim, { opacity: appearance }]}
        />
        <KeyboardAvoidingView behavior="padding" automaticOffset style={styles.keyboardArea}>
          <ScrimPressable
            accessible={false}
            importantForAccessibility="no"
            style={styles.backdropFill}
            onPress={onClose}
          />
          <Animated.View
            accessibilityViewIsModal
            onAccessibilityEscape={onClose}
            style={[
              styles.sheet,
              {
                paddingBottom: 20 + insets.bottom,
                opacity: appearance,
                transform: [
                  {
                    translateY: appearance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                {displayed.title}
              </Text>
              <CloseButton label={`Close ${displayed.title}`} onPress={onClose} />
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {displayed.children}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

export function SheetField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  )
}

export function SheetActions({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled = false,
  secondaryDisabled = false,
  busy = false,
  primaryAccessibilityLabel,
}: {
  primaryLabel: string
  secondaryLabel: string
  onPrimary: () => void
  onSecondary: () => void
  primaryDisabled?: boolean
  secondaryDisabled?: boolean
  busy?: boolean
  primaryAccessibilityLabel?: string
}) {
  return (
    <View style={styles.actions}>
      <Pressable
        style={styles.primaryButton}
        disabled={primaryDisabled}
        accessibilityLabel={primaryAccessibilityLabel}
        accessibilityState={{ busy }}
        onPress={onPrimary}
      >
        <View style={styles.primaryContent}>
          {busy ? <ActivityIndicator color={C.onAccent} size="small" /> : null}
          <Text style={styles.primaryLabel}>{primaryLabel}</Text>
        </View>
      </Pressable>
      <Pressable style={styles.secondaryButton} disabled={secondaryDisabled} onPress={onSecondary}>
        <Text style={styles.secondaryLabel}>{secondaryLabel}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  scrim: {
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
  primaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
})
