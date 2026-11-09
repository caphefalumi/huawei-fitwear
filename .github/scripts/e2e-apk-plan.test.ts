import { expect, test } from "bun:test"

import { findLastApkBuildSha, shouldRebuildApk } from "./e2e-apk-plan"

const deps = {
  runList: () => ["20", "10"],
  runHeadSha: (runId: string) => (runId === "20" ? "abc1234" : "def5678"),
  runBuildConclusion: (runId: string) => (runId === "20" ? "skipped" : "success"),
  hasAppChangesSince: () => false,
}

test("schedule and explicit force always rebuild", () => {
  expect(shouldRebuildApk({ ...deps, eventName: "schedule", forceRebuild: false, filterRebuild: false, branch: "main", headSha: "aaa" }).rebuild).toBe(true)
  expect(
    shouldRebuildApk({ ...deps, eventName: "workflow_dispatch", forceRebuild: true, filterRebuild: false, branch: "main", headSha: "aaa" }).rebuild,
  ).toBe(true)
})

test("findLastApkBuildSha skips runs without a successful build job", () => {
  expect(findLastApkBuildSha("main", deps)).toBe("def5678")
})

test("reuses APK when app sources are unchanged since last build", () => {
  const decision = shouldRebuildApk({
    ...deps,
    eventName: "workflow_dispatch",
    forceRebuild: false,
    filterRebuild: false,
    branch: "main",
    headSha: "aaa",
    hasAppChangesSince: () => false,
  })
  expect(decision.rebuild).toBe(false)
  expect(decision.reason).toContain("def5678")
})

test("rebuilds when flows changed but app sources changed after the last APK build", () => {
  const decision = shouldRebuildApk({
    ...deps,
    eventName: "workflow_dispatch",
    forceRebuild: false,
    filterRebuild: false,
    branch: "main",
    headSha: "aaa",
    hasAppChangesSince: () => true,
  })
  expect(decision.rebuild).toBe(true)
  expect(decision.reason).toContain("App sources changed")
})

test("rebuilds when no build job ever succeeded", () => {
  const decision = shouldRebuildApk({
    ...deps,
    runList: () => [],
    eventName: "workflow_dispatch",
    forceRebuild: false,
    filterRebuild: false,
    branch: "main",
    headSha: "aaa",
  })
  expect(decision.rebuild).toBe(true)
})
