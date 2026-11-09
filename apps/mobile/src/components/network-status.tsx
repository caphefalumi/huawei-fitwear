import { useNetworkState } from "expo-network"
import { StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Palette as C } from "@/theme"

export function NetworkStatusBanner() {
  const state = useNetworkState()
  const insets = useSafeAreaInsets()
  if (state.isInternetReachable !== false && state.isConnected !== false) return null

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          paddingTop: Math.max(insets.top, 8) + 8,
          paddingBottom: 10,
        },
      ]}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.icon}
      >
        <Text style={styles.iconMark}>!</Text>
      </View>
      <Text style={styles.message}>You're offline. Saved information may be out of date.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  iconMark: {
    color: C.accent,
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 16,
  },
  message: {
    flex: 1,
    color: C.text,
    fontSize: 14,
    lineHeight: 20,
  },
})
