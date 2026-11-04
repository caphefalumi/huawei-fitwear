import { existsSync, readFileSync } from "node:fs"
import { spawnSync } from "node:child_process"

const hookPath = spawnSync("git", ["rev-parse", "--git-path", "hooks/pre-commit"], {
  encoding: "utf8",
}).stdout.trim()

if (
  hookPath &&
  existsSync(hookPath) &&
  readFileSync(hookPath, "utf8").includes("pre-commit/hook")
) {
  process.exit(0)
}

import "../node_modules/pre-commit/install.js"
