import PostHog from "posthog-react-native"

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST

export const isPostHogConfigured = Boolean(projectToken && host)

if (!isPostHogConfigured && __DEV__) {
  const missingVariable = projectToken
    ? "EXPO_PUBLIC_POSTHOG_HOST"
    : "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN"

  console.error(
    new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    ),
  )
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host: host!,
      captureAppLifecycleEvents: true,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
          console: [],
        },
      },
      logs: {
        serviceName: "huawei-fitwear-mobile",
      },
    })
  : undefined

export const posthogLog = {
  info: (message: string, attributes?: Record<string, boolean | number | string>) =>
    posthog?.logger.info(message, attributes),
  warn: (message: string, attributes?: Record<string, boolean | number | string>) =>
    posthog?.logger.warn(message, attributes),
}
