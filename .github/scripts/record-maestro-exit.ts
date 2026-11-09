import fs from "node:fs"
import path from "node:path"

export function resolveMaestroExitCode(artifactsDir = "maestro-artifacts") {
  const file = path.join(artifactsDir, "maestro-exit-code.txt")
  if (!fs.existsSync(file)) {
    return { code: 1, missingFile: true as const }
  }
  const raw = fs.readFileSync(file, "utf8").trim()
  const code = Number(raw)
  if (!Number.isInteger(code) || code < 0) {
    return { code: 1, missingFile: false as const }
  }
  return { code, missingFile: false as const }
}

export function shouldFailCiJob(exitCode: number) {
  return exitCode !== 0
}

if (import.meta.main) {
  const { code, missingFile } = resolveMaestroExitCode()
  if (missingFile) {
    console.log("::warning::Maestro exit code file missing; treating the run as failed.")
  }
  const output = process.env.GITHUB_OUTPUT
  if (!output) throw new Error("GITHUB_OUTPUT is required")
  fs.appendFileSync(output, `exit_code=${code}\n`)
  if (process.env.GITHUB_ENV) {
    fs.appendFileSync(process.env.GITHUB_ENV, `MAESTRO_EXIT_CODE=${code}\n`)
  }
  console.log(`Maestro exit code: ${code}`)
  process.exitCode = 0
}
