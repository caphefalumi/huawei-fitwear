import type { ConfigContext } from "expo/config"

export default ({ config }: ConfigContext) => {
  if (!process.env.POSTHOG_CLI_API_KEY || !process.env.POSTHOG_CLI_PROJECT_ID) return config

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      ["posthog-react-native/expo", { uploadNativeSymbols: true }],
    ],
  }
}
