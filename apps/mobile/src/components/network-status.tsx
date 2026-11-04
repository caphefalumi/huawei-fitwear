import { useNetworkState } from "expo-network";
import { Text, View } from "react-native";

import { Palette as C } from "@/constants/palette";

export function NetworkStatusBanner() {
  const state = useNetworkState();
  if (state.isInternetReachable !== false && state.isConnected !== false) return null;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: C.card,
      }}
    >
      <Text accessibilityLabel="Warning" style={{ color: C.accent, fontWeight: "700" }}>
        !
      </Text>
      <Text style={{ color: C.text, fontSize: 14 }}>
        You're offline. Saved information may be out of date.
      </Text>
    </View>
  );
}
