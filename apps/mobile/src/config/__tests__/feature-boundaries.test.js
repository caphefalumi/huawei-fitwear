const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const { spawnSync } = require("node:child_process")

test("feature boundary check rejects deep cross-feature imports through aliases and relative paths", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "feature-boundaries-"))
  const feature = path.join(dir, "home")
  fs.mkdirSync(feature)
  const file = path.join(feature, "screen.ts")
  const script = path.resolve(__dirname, "../../../scripts/check-feature-boundaries.cjs")
  const check = () => spawnSync(process.execPath, [script, dir], { encoding: "utf8" })
  try {
    fs.writeFileSync(file, 'import "@/features/meals"\nimport "../meals"\nimport "./local"\n')
    expect(check().status).toBe(0)
    fs.writeFileSync(
      file,
      'import "@/features/meals/hooks/private"\nimport "../meals/hooks/private"\n',
    )
    const result = check()
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("@/features/meals/hooks/private")
    expect(result.stderr).toContain("../meals/hooks/private")
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
