const { AndroidConfig, withGradleProperties } = require("@expo/config-plugins")

/**
 * Pins CMake 3.31.6 for Windows builds only; react-native-worklets needs it and
 * the Windows toolchain does not ship that version. Plain CommonJS so every
 * eas-cli / Expo version can resolve this plugin (no TypeScript loader needed).
 */
module.exports = function withAndroidCmake(config) {
  if (process.platform !== "win32") {
    return config
  }
  return withGradleProperties(config, (config) => {
    config.modResults = AndroidConfig.BuildProperties.updateAndroidBuildProperty(
      config.modResults,
      "android.cmakeVersion",
      "3.31.6",
    )
    return config
  })
}
