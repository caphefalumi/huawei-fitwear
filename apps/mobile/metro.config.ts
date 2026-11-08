import path from "node:path"

import { getSentryExpoConfig } from "@sentry/react-native/metro.js"
import type { CustomResolver } from "metro-resolver"

const projectRoot = import.meta.dirname
const config = getSentryExpoConfig(projectRoot)

// Bun symlinks some packages into a second physical React. Web hooks then
// crash with "Cannot read properties of null (reading 'useContext')".
// `expo` too: a second copy of expo/src/async-require/hmr.ts registers a second
// HMR client whose entry point is the bare page URL, which kills Metro's
// HMR server ("has an empty path and cannot be converted to a JSC-safe format").
const singleton = new Set(["react", "react-dom", "expo"])
const upstream = config.resolver?.resolveRequest

const resolveRequest: CustomResolver = (context, moduleName, platform) => {
  const resolve = upstream ?? context.resolveRequest
  if (
    singleton.has(moduleName) ||
    moduleName.startsWith("react/") ||
    moduleName.startsWith("react-dom/") ||
    moduleName.startsWith("expo/")
  ) {
    return resolve(
      { ...context, originModulePath: path.join(projectRoot, "package.json") },
      moduleName,
      platform,
    )
  }
  return resolve(context, moduleName, platform)
}

export default {
  ...config,
  resolver: {
    ...config.resolver,
    resolveRequest,
  },
}
