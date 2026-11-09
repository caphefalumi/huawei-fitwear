import { afterEach, beforeEach, expect, test } from "bun:test"
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import { resolveMaestroExitCode, shouldFailCiJob } from "./record-maestro-exit"

let tempDir: string
let artifactsDir: string

beforeEach(() => {
  tempDir = mkdtempSync(path.join(tmpdir(), "maestro-exit-"))
  artifactsDir = path.join(tempDir, "maestro-artifacts")
  mkdirSync(artifactsDir, { recursive: true })
})

afterEach(() => rmSync(tempDir, { recursive: true, force: true }))

test("missing exit file fails the CI gate", () => {
  const resolved = resolveMaestroExitCode(artifactsDir)
  expect(resolved).toEqual({ code: 1, missingFile: true })
  expect(shouldFailCiJob(resolved.code)).toBe(true)
})

test.each([
  ["0", false],
  ["1", true],
  ["127", true],
])("exit file %s maps to fail=%s", (raw, fail) => {
  writeFileSync(path.join(artifactsDir, "maestro-exit-code.txt"), `${raw}\n`)
  const resolved = resolveMaestroExitCode(artifactsDir)
  expect(resolved.code).toBe(Number(raw))
  expect(shouldFailCiJob(resolved.code)).toBe(fail)
})

test("CLI records outputs without failing the summary step", () => {
  const script = path.join(import.meta.dir, "record-maestro-exit.ts")
  writeFileSync(path.join(artifactsDir, "maestro-exit-code.txt"), "1\n")
  const summary = path.join(tempDir, "summary.md")
  const env = {
    ...process.env,
    GITHUB_OUTPUT: path.join(tempDir, "out.txt"),
    GITHUB_ENV: path.join(tempDir, "env.txt"),
    GITHUB_STEP_SUMMARY: summary,
  }
  const run = Bun.spawnSync([process.execPath, script], { cwd: tempDir, env })
  expect(run.exitCode).toBe(0)
  expect(readFileSync(env.GITHUB_OUTPUT!, "utf8")).toContain("exit_code=1")
  expect(readFileSync(env.GITHUB_ENV!, "utf8")).toContain("MAESTRO_EXIT_CODE=1")
})
