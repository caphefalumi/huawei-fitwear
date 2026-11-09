import { spawnSync } from "node:child_process"
import fs from "node:fs"

export const APP_SOURCE_DIFF_SPECS = [
  "apps/mobile",
  ":(exclude)apps/mobile/tests",
  ":(exclude)apps/mobile/README.md",
  "package.json",
  "bun.lock",
] as const

export type ApkPlanInput = {
  eventName: string
  forceRebuild: boolean
  filterRebuild: boolean
  branch: string
  headSha: string
  runList: (branch: string) => string[]
  runHeadSha: (runId: string) => string | null
  runBuildConclusion: (runId: string) => string | null
  hasAppChangesSince: (baseSha: string, headSha: string) => boolean
}

export function findLastApkBuildSha(
  branch: string,
  deps: Pick<ApkPlanInput, "runList" | "runHeadSha" | "runBuildConclusion">,
): string | null {
  for (const runId of deps.runList(branch)) {
    if (deps.runBuildConclusion(runId) !== "success") continue
    const sha = deps.runHeadSha(runId)
    if (sha) return sha
  }
  return null
}

export function shouldRebuildApk(input: ApkPlanInput): { rebuild: boolean; reason: string } {
  if (input.eventName === "schedule") {
    return { rebuild: true, reason: "Scheduled runs always build a fresh APK." }
  }
  if (input.forceRebuild) {
    return { rebuild: true, reason: "force_rebuild was requested." }
  }
  if (input.filterRebuild) {
    return { rebuild: true, reason: "App sources changed compared to main." }
  }

  const branches =
    input.branch === "main" ? ["main"] : [input.branch, "main"]
  for (const branch of branches) {
    const buildSha = findLastApkBuildSha(branch, input)
    if (!buildSha) continue
    if (!input.hasAppChangesSince(buildSha, input.headSha)) {
      return {
        rebuild: false,
        reason: `Reusing APK built at ${buildSha.slice(0, 7)} from ${branch}.`,
      }
    }
    return {
      rebuild: true,
      reason: `App sources changed since the last successful build on ${branch} (${buildSha.slice(0, 7)}).`,
    }
  }

  return {
    rebuild: true,
    reason: "No prior successful build job found for reuse.",
  }
}

function ghJson(args: string[]) {
  const result = spawnSync("gh", args, { encoding: "utf8" })
  if (result.status !== 0) return null
  return result.stdout.trim()
}

function gitHasAppChangesSince(baseSha: string, headSha: string) {
  const result = spawnSync(
    "git",
    ["diff", "--quiet", `${baseSha}..${headSha}`, "--", ...APP_SOURCE_DIFF_SPECS],
    { encoding: "utf8" },
  )
  if (result.status === 0) return false
  if (result.status === 1) return true
  throw new Error(result.stderr || "git diff failed")
}

function defaultRunList(branch: string) {
  const raw = ghJson([
    "run",
    "list",
    "--workflow=mobile-e2e.yml",
    `--branch=${branch}`,
    "--limit=30",
    "--json=databaseId,conclusion",
  ])
  if (!raw) return []
  const rows = JSON.parse(raw) as { databaseId: number; conclusion: string }[]
  return rows.filter((row) => row.conclusion === "success").map((row) => String(row.databaseId))
}

function defaultRunHeadSha(runId: string) {
  return ghJson(["run", "view", runId, "--json=headSha", "--jq", ".headSha"])
}

function defaultRunBuildConclusion(runId: string) {
  return ghJson(["run", "view", runId, "--json=jobs", "--jq", '.jobs[] | select(.name=="build") | .conclusion'])
}

if (import.meta.main) {
  const reasonPath = process.env.GITHUB_OUTPUT
  if (!reasonPath) throw new Error("GITHUB_OUTPUT is required")

  const decision = shouldRebuildApk({
    eventName: process.env.EVENT_NAME ?? "",
    forceRebuild: process.env.FORCE_REBUILD === "true",
    filterRebuild: process.env.FILTER_REBUILD === "true",
    branch: process.env.GITHUB_REF_NAME ?? "main",
    headSha: process.env.GITHUB_SHA ?? "HEAD",
    runList: defaultRunList,
    runHeadSha: defaultRunHeadSha,
    runBuildConclusion: defaultRunBuildConclusion,
    hasAppChangesSince: gitHasAppChangesSince,
  })

  fs.appendFileSync(
    reasonPath,
    `rebuild_apk=${decision.rebuild}\n` +
      `plan_reason<<EOF\n${decision.reason}\nEOF\n`,
  )
  console.log(decision.reason)
}
