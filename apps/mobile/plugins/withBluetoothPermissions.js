const { withAndroidManifest } = require("@expo/config-plugins")

// Keep the app's legacy permissions consistent with RxAndroidBle on API 31+.
module.exports = function withBluetoothPermissions(config) {
  return withAndroidManifest(config, (config) => {
    for (const permission of config.modResults.manifest["uses-permission"] ?? []) {
      const name = permission.$["android:name"]
      if (
        name === "android.permission.BLUETOOTH" ||
        name === "android.permission.BLUETOOTH_ADMIN"
      ) {
        permission.$["android:maxSdkVersion"] = "30"
      }
    }
    return config
  })
}
