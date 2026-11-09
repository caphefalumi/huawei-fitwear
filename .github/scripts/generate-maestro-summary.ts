import fs from "node:fs"
import path from "node:path"

import { DOMParser, onWarningStopParsing } from "@xmldom/xmldom"

type TestCase = {
  name: string
  file: string
  status: "Passed" | "Failed" | "Error" | "Skipped"
  duration: number
  details: string
}

export type SummaryOptions = {
  artifactsDir?: string
  exitCode?: string | number
  artifactsUrl?: string
  recordingUrl?: string
  runUrl?: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function cell(value: string) {
  return escapeHtml(value).replaceAll("|", "&#124;").replaceAll("\n", "<br>")
}

function findRecordings(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const recordings: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) recordings.push(...findRecordings(fullPath))
    else if (entry.isFile() && entry.name.endsWith(".mp4")) recordings.push(fullPath)
  }
  return recordings
}

export function generateSummary({
  artifactsDir = "maestro-artifacts",
  exitCode,
  artifactsUrl = "",
  recordingUrl = "",
  runUrl = "",
}: SummaryOptions = {}) {
  let cases: TestCase[] = []
  let reportError = ""
  try {
    const xml = fs.readFileSync(path.join(artifactsDir, "report.xml"), "utf8")
    const report = new DOMParser({ onError: onWarningStopParsing }).parseFromString(
      xml,
      "application/xml",
    )
    for (const node of Array.from(report.getElementsByTagName("testcase"))) {
      const issues = [
        ...Array.from(node.getElementsByTagName("failure")),
        ...Array.from(node.getElementsByTagName("error")),
      ]
      const reportedStatus = node.getAttribute("status")?.toUpperCase() ?? ""
      let status: TestCase["status"] = "Passed"
      if (
        issues.some((issue) => issue.tagName === "error") ||
        (issues.length === 0 && reportedStatus === "ERROR")
      ) {
        status = "Error"
      } else if (issues.length > 0 || ["FAILED", "FAILURE"].includes(reportedStatus)) {
        status = "Failed"
      } else if (node.getElementsByTagName("skipped").length > 0 || reportedStatus === "SKIPPED") {
        status = "Skipped"
      }
      const duration = Number(node.getAttribute("time") || "0")
      if (!Number.isFinite(duration) || duration < 0) throw new Error("Invalid testcase duration")
      cases.push({
        name: node.getAttribute("name") || "Unnamed flow",
        file: (node.getAttribute("file") || "").replaceAll("\\", "/"),
        status,
        duration,
        details: issues
          .map((issue) =>
            [issue.getAttribute("message")?.trim(), issue.textContent?.trim()]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n\n"),
      })
    }
    if (cases.length === 0) reportError = "The JUnit report contains no flow results."
  } catch (error) {
    reportError = `JUnit report unavailable or invalid: ${error instanceof Error ? error.message : String(error)}`
    cases = []
  }

  const passed = cases.filter((test) => test.status === "Passed").length
  const failed = cases.filter((test) => test.status === "Failed").length
  const errors = cases.filter((test) => test.status === "Error").length
  const skipped = cases.filter((test) => test.status === "Skipped").length
  const success =
    String(exitCode) === "0" && !reportError && passed > 0 && failed === 0 && errors === 0
  const duration = cases.reduce((total, test) => total + test.duration, 0)
  const lines = [
    "## Maestro E2E results",
    "",
    `**Status:** ${success ? "Passed" : "Failed"}`,
    `**Flows:** ${cases.length} total; ${passed} passed, ${failed} failed, ${errors} errors, ${skipped} skipped`,
    `**Flow time:** ${duration.toFixed(2)}s`,
    `**Maestro exit code:** ${exitCode === undefined ? "Not recorded" : cell(String(exitCode))}`,
    "",
  ]
  if (reportError) {
    lines.push(`> ${cell(reportError)}`, "")
  } else if (passed === 0 && failed === 0 && errors === 0) {
    lines.push(
      "> No flows completed successfully; an empty or skipped-only suite is not a pass.",
      "",
    )
  } else if (String(exitCode) !== "0" && failed === 0 && errors === 0) {
    lines.push(
      "> The process did not finish successfully, even though the report has no failed cases.",
      "",
    )
  }
  if (cases.length > 0) {
    lines.push("| Flow | File | Result | Duration |", "| --- | --- | --- | --- |")
    for (const test of cases) {
      lines.push(
        `| ${cell(test.name)} | ${cell(test.file)} | ${test.status} | ${test.duration.toFixed(2)}s |`,
      )
    }
    lines.push("")
    for (const test of cases) {
      if (test.status === "Failed" || test.status === "Error") {
        lines.push(
          "<details>",
          `<summary>${escapeHtml(test.name)}: ${test.status}</summary>`,
          "",
          `<pre>${escapeHtml(test.details || "No failure detail was recorded.")}</pre>`,
          "</details>",
          "",
        )
      }
    }
  }

  const recordings = findRecordings(artifactsDir).sort()
  lines.push("### Recordings", "")
  if (recordings.length > 0) {
    lines.push("| File | Size (bytes) |", "| --- | ---: |")
    for (const recording of recordings) {
      const name = path.relative(artifactsDir, recording).replaceAll("\\", "/")
      lines.push(`| ${cell(name)} | ${fs.statSync(recording).size} |`)
    }
    lines.push("")
    if (recordingUrl) lines.push(`[Download all recordings](<${recordingUrl}>)`, "")
  } else {
    lines.push(
      "No recordings were generated. Flows can opt in with startRecording/stopRecording.",
      "",
    )
  }
  const bundleUrl = artifactsUrl || runUrl
  if (bundleUrl) lines.push(`[JUnit report, screenshots, logs, and artifacts](<${bundleUrl}>)`, "")
  return { markdown: lines.join("\n"), success }
}

if (import.meta.main) {
  const { GITHUB_REPOSITORY, GITHUB_RUN_ID, GITHUB_RUN_ATTEMPT = "1" } = process.env
  const runUrl =
    GITHUB_REPOSITORY && GITHUB_RUN_ID
      ? `https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}/attempts/${GITHUB_RUN_ATTEMPT}`
      : ""
  const { markdown, success } = generateSummary({
    exitCode: process.env.MAESTRO_EXIT_CODE || undefined,
    artifactsUrl: process.env.ARTIFACTS_URL,
    recordingUrl: process.env.RECORDING_URL,
    runUrl,
  })
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + "\n")
  } else {
    console.log(markdown)
  }
  // Always exit successfully so this reporting step stays green when Maestro failed earlier.
  process.exitCode = 0
}
