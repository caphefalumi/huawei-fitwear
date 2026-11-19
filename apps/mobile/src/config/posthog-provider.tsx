import { type PropsWithChildren } from "react"
import { PostHogProvider as ReactNativePostHogProvider } from "posthog-react-native"

import { posthog } from "@/config/posthog"

export function PostHogProvider({ children }: PropsWithChildren) {
  if (!posthog) return children

  return <ReactNativePostHogProvider client={posthog}>{children}</ReactNativePostHogProvider>
}
