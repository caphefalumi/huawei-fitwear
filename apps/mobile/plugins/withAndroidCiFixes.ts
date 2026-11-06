import {
  AndroidConfig,
  withAndroidManifest,
  withAppBuildGradle,
  withGradleProperties,
  type ConfigPlugin,
} from "@expo/config-plugins"

/**
 * Expo Config Plugin to ensure Continuous Native Generation (CNG) maintains
 * Android CI and Maestro E2E build requirements across clean prebuilds:
 *
 * 1. Aligns android.permission.BLUETOOTH and android.permission.BLUETOOTH_ADMIN with
 *    android:maxSdkVersion="30" to prevent conflicts with rxandroidble.
 * 2. Injects `debuggableVariants = []` when CI=true or bundleInDebug=true so that
 *    debug APKs bundle Hermes JavaScript assets and run offline without Metro.
 * 3. Preserves android.cmakeVersion=3.31.6 in gradle.properties for CMake/Ninja builds on Windows.
 */
const withAndroidBluetoothMaxSdk: ConfigPlugin = (config) =>
  withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest
    if (Array.isArray(manifest["uses-permission"])) {
      for (const permission of manifest["uses-permission"]) {
        const name = permission.$?.["android:name"]
        if (
          name === "android.permission.BLUETOOTH" ||
          name === "android.permission.BLUETOOTH_ADMIN"
        ) {
          Object.assign(permission.$, { "android:maxSdkVersion": "30" })
        }
      }
    }
    return config
  })

const withAndroidCiDebugBundle: ConfigPlugin = (config) =>
  withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents
    const snippetMarker = "debuggableVariants = []"
    if (!contents.includes(snippetMarker)) {
      const target = "react {"
      const replacement = `react {\n    if (System.getenv("CI") == "true" || (findProperty('bundleInDebug') ?: false).toBoolean()) {\n        debuggableVariants = []\n    }`
      config.modResults.contents = contents.replace(target, replacement)
    }
    return config
  })

const withAndroidCmakeVersion: ConfigPlugin = (config) =>
  process.platform === "win32"
    ? withGradleProperties(config, (config) => {
        config.modResults = AndroidConfig.BuildProperties.updateAndroidBuildProperty(
          config.modResults,
          "android.cmakeVersion",
          "3.31.6",
        )
        return config
      })
    : config

const withAndroidCiFixes: ConfigPlugin = (config) =>
  withAndroidCmakeVersion(withAndroidCiDebugBundle(withAndroidBluetoothMaxSdk(config)))

export default withAndroidCiFixes
