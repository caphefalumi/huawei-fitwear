import Constants from "expo-constants"
import PostHog from "posthog-react-native"

type PostHogExtra = {
  posthogProjectToken?: unknown
  posthogHost?: unknown
}

const extra = Constants.expoConfig?.extra as PostHogExtra | undefined
const projectToken =
  typeof extra?.posthogProjectToken === "string" ? extra.posthogProjectToken : undefined
const host = typeof extra?.posthogHost === "string" ? extra.posthogHost : undefined
const serviceVersion =
  typeof Constants.expoConfig?.version === "string" ? Constants.expoConfig.version : undefined

if (__DEV__ && !projectToken) {
  throw new Error(
    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
  )
}

if (__DEV__ && !host) {
  throw new Error(
    "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured",
  )
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        logs: {
          serviceName: "fitwear-mobile",
          environment: __DEV__ ? "development" : "production",
          serviceVersion,
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
          },
        },
        debug: __DEV__,
      })
    : undefined

export const posthogLogger = {
  info(body: string, attributes: Record<string, boolean | number | string>) {
    posthog?.logger.info(body, attributes)
  },
  error(body: string, attributes: Record<string, boolean | number | string>) {
    posthog?.logger.error(body, attributes)
  },
}
