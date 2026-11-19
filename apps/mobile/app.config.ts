import type { ExpoConfig } from "expo/config"

const appConfig = require("./app.json") as { expo: ExpoConfig }

export default (): ExpoConfig => ({
  ...appConfig.expo,
  extra: {
    ...appConfig.expo.extra,
    posthogProjectToken: process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  },
})
