const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");

const hookPath = spawnSync("git", ["rev-parse", "--git-path", "hooks/pre-commit"], {
  encoding: "utf8",
}).stdout.trim();

if (
  hookPath &&
  existsSync(hookPath) &&
  readFileSync(hookPath, "utf8").includes("pre-commit/hook")
) {
  process.exit(0);
}

require("../node_modules/pre-commit/install.js");
