import fs from "node:fs"

import { createD1Query } from "./cleanup-maestro-account"

// Called only after validate-e2e-environment has checked the staging bindings.
// Never initialize a partially populated database: migrations can drop columns.
const query = createD1Query({
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  databaseId: process.env.E2E_D1_DATABASE_ID!,
  token: process.env.CLOUDFLARE_API_TOKEN!,
})
try {
  const { results } = await query(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name != '_cf_KV'",
    [],
  )
  const empty = results.length === 0
  fs.appendFileSync(process.env.GITHUB_OUTPUT!, `empty=${empty}\n`)
  console.log(
    empty
      ? "Staging database is empty."
      : "Staging database contains tables; automatic initialization skipped.",
  )
} catch {
  console.error("Could not inspect staging database; refusing initialization.")
  process.exitCode = 1
}
