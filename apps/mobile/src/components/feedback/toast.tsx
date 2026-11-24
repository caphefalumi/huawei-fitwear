import { useEffect } from "react"
import { AccessibilityInfo, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { create } from "zustand"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

export const TOAST_DURATION_MS = 5000
/** Keeps the toast clear of the tab bar. */
const TAB_BAR_CLEARANCE = 72

type Toast = {
  id: number
  message: string
  actionLabel?: string
  onAction?: () => void
}

type ToastState = {
  toast: Toast | null
  show: (toast: Omit<Toast, "id">) => number
  hide: (id?: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>((set, get) => ({
  toast: null,
  show: (toast) => {
    const id = nextId++
    set({ toast: { ...toast, id } })
    return id
  },
  hide: (id) => {
    if (id === undefined || get().toast?.id === id) set({ toast: null })
  },
}))

export const showToast = (toast: Omit<Toast, "id">) => useToastStore.getState().show(toast)
export const hideToast = (id?: number) => useToastStore.getState().hide(id)

/** One app-wide snackbar. A new toast replaces the current one. */
export function ToastHost() {
  const toast = useToastStore((state) => state.toast)
  const hide = useToastStore((state) => state.hide)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!toast) return
    AccessibilityInfo.announceForAccessibility(toast.message)
    const timer = setTimeout(() => hide(toast.id), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast, hide])

  if (!toast) return null
  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { bottom: insets.bottom + TAB_BAR_CLEARANCE }]}
    >
      <View style={styles.toast} accessibilityLiveRegion="polite" testID="toast">
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
        {toast.actionLabel && toast.onAction ? (
          <Pressable
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={toast.actionLabel}
            onPress={() => {
              hide(toast.id)
              toast.onAction?.()
            }}
          >
            <Text style={styles.action}>{toast.actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    backgroundColor: C.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: C.onAccent,
  },
  action: {
    fontSize: 13,
    fontWeight: "700",
    color: C.accentSoft,
  },
})
