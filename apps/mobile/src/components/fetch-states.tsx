import { useEffect, useRef, useState } from "react"
import { AccessibilityInfo, ActivityIndicator, StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/theme"

export function LoadingSkeleton({
  label = "Loading",
  rows = 3,
}: {
  label?: string
  rows?: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), 250)
    return () => clearTimeout(timer)
  }, [label, rows])
  if (!visible) return null
  return (
    <View accessibilityLabel={label} accessibilityLiveRegion="polite" style={styles.skeleton}>
      {Array.from({ length: rows }, (_, index) => (
        <View
          key={index}
          style={[
            styles.skeletonLine,
            index === 0 && styles.skeletonHeading,
            { width: index === 1 ? "72%" : "100%" },
          ]}
        />
      ))}
    </View>
  )
}

export function FetchErrorState({
  title = "Could not load this information",
  message,
  onRetry,
  retrying = false,
  onBack,
  retrySuccessMessage = "Updated successfully.",
  onRetrySuccess,
}: {
  title?: string
  message: string
  onRetry?: () => void | Promise<unknown>
  retrying?: boolean
  onBack?: () => void
  retrySuccessMessage?: string
  onRetrySuccess?: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [recovered, setRecovered] = useState(false)
  const retryLock = useRef(false)
  const runRetry = async () => {
    if (!onRetry || retryLock.current || retrying) return
    retryLock.current = true
    setBusy(true)
    setRecovered(false)
    try {
      await onRetry()
      setRecovered(true)
      onRetrySuccess?.()
      void AccessibilityInfo.announceForAccessibility(retrySuccessMessage)
    } catch {
      // Keep the visible error; the caller retains the failed state.
    } finally {
      retryLock.current = false
      setBusy(false)
    }
  }
  if (recovered) {
    return (
      <View accessibilityRole="summary" accessibilityLiveRegion="polite" style={styles.success}>
        <Text style={styles.successTitle}>{retrySuccessMessage}</Text>
      </View>
    )
  }
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
      <Text accessibilityLabel="Warning" style={styles.icon}>
        !
      </Text>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try again"
          accessibilityState={{ disabled: busy || retrying, busy: busy || retrying }}
          disabled={busy || retrying}
          onPress={() => void runRetry()}
          style={styles.retry}
        >
          {busy || retrying ? (
            <ActivityIndicator color={C.onAccent} />
          ) : (
            <Text style={styles.retryText}>Try again</Text>
          )}
        </Pressable>
      ) : null}
      {onBack ? (
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: { gap: 12, paddingVertical: 12 },
  skeletonLine: { height: 14, borderRadius: 7, backgroundColor: C.card },
  skeletonHeading: { height: 22, width: "58%" },
  error: {
    alignItems: "flex-start",
    gap: 8,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: C.surface,
    padding: 16,
  },
  icon: {
    color: C.accent,
    borderColor: C.accent,
    borderWidth: 2,
    borderRadius: 99,
    width: 24,
    height: 24,
    textAlign: "center",
    fontWeight: "700",
  },
  title: { color: C.text, fontSize: 16, fontWeight: "600" },
  message: { color: C.textMuted, fontSize: 14, lineHeight: 20 },
  retry: {
    minWidth: 100,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accent,
    borderRadius: 10,
    paddingHorizontal: 18,
    marginTop: 4,
  },
  retryText: { color: C.onAccent, fontSize: 15, fontWeight: "600" },
  back: { minHeight: 48, justifyContent: "center", paddingHorizontal: 8 },
  backText: { color: C.accent, fontSize: 15, fontWeight: "600" },
  success: {
    gap: 4,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: C.surface,
    padding: 16,
  },
  successTitle: { color: C.text, fontSize: 14, lineHeight: 20, fontWeight: "600" },
})
