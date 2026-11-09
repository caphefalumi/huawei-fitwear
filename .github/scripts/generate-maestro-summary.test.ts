import { afterEach, beforeEach, expect, test } from "bun:test"
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import { generateSummary } from "./generate-maestro-summary"

let tempDir: string
let artifactsDir: string
beforeEach(() => {
  tempDir = mkdtempSync(path.join(tmpdir(), "maestro-summary-"))
  artifactsDir = path.join(tempDir, "maestro-artifacts")
  mkdirSync(artifactsDir)
})
afterEach(() => rmSync(tempDir, { recursive: true, force: true }))

function writeReport(xml: string) {
  writeFileSync(path.join(artifactsDir, "report.xml"), xml)
}

test("new flows are listed without known names or suite counters", () => {
  writeReport(`<testsuites><testsuite tests="3" failures="0" time="6">
    <testcase file="flows/onboarding.yaml" time="1" name="onboarding" status="SUCCESS"/>
    <testcase name="account-export" time="2" file="flows/account-export.yml"></testcase>
    <testsuite><testcase time="3" name="future-flow"/></testsuite>
    </testsuite></testsuites>`)
  const { markdown, success } = generateSummary({ artifactsDir, exitCode: 0 })
  expect(success).toBe(true)
  expect(markdown).toContain("3 total; 3 passed, 0 failed, 0 errors, 0 skipped")
  expect(markdown).toContain("| onboarding | flows/onboarding.yaml | Passed | 1.00s |")
  expect(markdown).toContain("| account-export | flows/account-export.yml | Passed | 2.00s |")
  expect(markdown).toContain("| future-flow |  | Passed | 3.00s |")
  expect(markdown).not.toContain("fitness.yaml")
})

test("failure bodies, errors, and skips override a zero process exit", () => {
  writeReport(`<testsuites><testsuite tests="4" failures="1">
    <testcase name="ok"/>
    <testcase name="checkout|&amp;" file="new.yaml" time="1">
      <failure><![CDATA[Assertion is false: <Pay> is visible]]></failure>
    </testcase>
    <testcase name="crash"><error message="App exited">Native trace</error></testcase>
    <testcase name="not-applicable"><skipped/></testcase>
    </testsuite></testsuites>`)
  const { markdown, success } = generateSummary({ artifactsDir, exitCode: "0" })
  expect(success).toBe(false)
  expect(markdown).toContain("4 total; 1 passed, 1 failed, 1 errors, 1 skipped")
  expect(markdown).toContain("checkout&#124;&amp;")
  expect(markdown).toContain("Assertion is false: &lt;Pay&gt; is visible")
  expect(markdown).toContain("App exited\nNative trace")
  expect(markdown).not.toContain("<Pay>")
})

test("reported error status without a failure element is not a pass", () => {
  writeReport('<testsuite><testcase name="interrupted" status="ERROR"/></testsuite>')
  const { markdown, success } = generateSummary({ artifactsDir, exitCode: "0" })
  expect(success).toBe(false)
  expect(markdown).toContain("interrupted |  | Error")
})

test.each([
  ["missing", undefined],
  ["malformed", "<broken"],
  ["empty", "<testsuites/>"],
  ["skipped-only", '<testsuite><testcase name="skip"><skipped/></testcase></testsuite>'],
  ["invalid time", '<testsuite><testcase name="bad-time" time="nan"/></testsuite>'],
])("%s reports fail closed", (_, xml) => {
  if (xml !== undefined) writeReport(xml)
  const { markdown, success } = generateSummary({ artifactsDir, exitCode: "0" })
  expect(success).toBe(false)
  expect(markdown).toContain("**Status:** Failed")
})

test.each([undefined, "", "1", "127"])(
  "process exit %s cannot be hidden by passing cases",
  (exitCode) => {
    writeReport('<testsuite><testcase name="flow"/></testsuite>')
    expect(generateSummary({ artifactsDir, exitCode }).success).toBe(false)
  },
)

test("all recordings keep their flow-relative paths", () => {
  writeReport('<testsuite><testcase name="flow"/></testsuite>')
  for (const [name, contents] of [
    ["first", "one"],
    ["second", "longer"],
  ]) {
    const recording = path.join(artifactsDir, name, "startRecording", "recording.mp4")
    mkdirSync(path.dirname(recording), { recursive: true })
    writeFileSync(recording, contents)
  }
  const { markdown, success } = generateSummary({
    artifactsDir,
    exitCode: "0",
    artifactsUrl: "https://example.test/bundle",
    recordingUrl: "https://example.test/videos",
  })
  expect(success).toBe(true)
  expect(markdown).toContain("first/startRecording/recording.mp4 | 3")
  expect(markdown).toContain("second/startRecording/recording.mp4 | 6")
  expect(markdown).toContain("https://example.test/videos")
  expect(markdown).toContain("https://example.test/bundle")
})

test("CLI appends its summary even when Maestro failed or report is missing", () => {
  const script = path.join(import.meta.dir, "generate-maestro-summary.ts")
  const summaryFile = path.join(tempDir, "summary.md")
  writeFileSync(summaryFile, "Previous step\n")
  const env = { ...process.env, MAESTRO_EXIT_CODE: "1", GITHUB_STEP_SUMMARY: summaryFile }
  const missingReport = Bun.spawnSync([process.execPath, script], { cwd: tempDir, env })
  expect(missingReport.exitCode).toBe(0)
  expect(readFileSync(summaryFile, "utf8")).toContain("JUnit report unavailable")
  expect(readFileSync(summaryFile, "utf8")).toContain("**Maestro exit code:** 1")
  writeReport('<testsuite><testcase name="new-flow"/></testsuite>')
  const passed = Bun.spawnSync([process.execPath, script], { cwd: tempDir, env })
  expect(passed.exitCode).toBe(0)
  expect(readFileSync(summaryFile, "utf8")).toStartWith("Previous step\n")
  expect(readFileSync(summaryFile, "utf8")).toContain("| new-flow |  | Passed")
})
