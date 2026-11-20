import { focusManager, onlineManager, QueryClient } from "@tanstack/react-query"
import { addNetworkStateListener, getNetworkStateAsync } from "expo-network"
import { AppState, Platform } from "react-native"

import { ApiError } from "@/lib/api/client"

const isOnline = (state: { isInternetReachable?: boolean | null; isConnected?: boolean | null }) =>
  state.isInternetReachable ?? state.isConnected ?? true

if (Platform.OS !== "web" || typeof window !== "undefined") {
  focusManager.setEventListener((onFocus) => {
    const subscription = AppState.addEventListener("change", (state) => {
      onFocus(state === "active")
    })
    return () => subscription.remove()
  })
}

// On native AuthProvider owns reconnect, so Query cannot resume before session validation.
if (Platform.OS === "web" && typeof window !== "undefined") {
  onlineManager.setEventListener((setOnline) => {
    void getNetworkStateAsync()
      .then((state) => setOnline(isOnline(state)))
      .catch(() => {})
    const subscription = addNetworkStateListener((state) => setOnline(isOnline(state)))
    return () => subscription.remove()
  })
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnReconnect: true,
      retry: (failureCount, error) =>
        failureCount < 3 && (!(error instanceof ApiError) || error.retryable),
      retryDelay: (attempt) => Math.min(750 * 2 ** attempt + Math.random() * 250, 8_000),
    },
    // A native offline write must fail in the API client, not wait to replay at reconnect.
    mutations: { retry: false, networkMode: Platform.OS === "web" ? "online" : "always" },
  },
})
