import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState } from "react-native";

import { ApiError } from "@/lib/api";
focusManager.setEventListener((onFocus) => {
  const subscription = AppState.addEventListener("change", (state) => {
    onFocus(state === "active");
  });
  return () => subscription.remove();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnReconnect: true,
      retry: (failureCount, error) =>
        failureCount < 1 &&
        (!(error instanceof ApiError) || error.code === "NETWORK_ERROR" || error.status >= 500),
    },
    mutations: { retry: false },
  },
});
