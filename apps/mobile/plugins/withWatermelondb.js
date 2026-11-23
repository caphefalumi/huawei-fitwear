const { withDangerousMod } = require("@expo/config-plugins")
const fs = require("node:fs")
const path = require("node:path")

/**
 * @nozbe/simdjson is not autolinked, but WatermelonDB's pod needs it built as a module.
 * See https://watermelondb.dev/docs/Installation#ios-react-native
 * Plain CommonJS so every eas-cli / Expo version can resolve this plugin.
 */
module.exports = function withWatermelondb(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile")
      const podfile = await fs.promises.readFile(podfilePath, "utf8")
      if (podfile.includes("simdjson")) return config
      // bun hoists packages to the workspace root, so resolve the real location.
      const simdjson = path.dirname(require.resolve("@nozbe/simdjson/package.json"))
      const relative = path
        .relative(config.modRequest.platformProjectRoot, simdjson)
        .replace(/\\/g, "/")
      const line = `  pod 'simdjson', path: '${relative}', modular_headers: true\n`
      await fs.promises.writeFile(podfilePath, podfile.replace(/^(target .* do\n)/m, `$1${line}`))
      return config
    },
  ])
}
