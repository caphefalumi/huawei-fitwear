import fs from "node:fs"
import path from "node:path"

type QueryResult = { results: Record<string, unknown>[]; meta: { changes: number } }
type Query = (sql: string, params: string[]) => Promise<QueryResult>
type Snapshot = {
  version: 1
  cloudflareAccountId: string
  databaseId: string
  userId: string
  sessionIds: string[]
}
type Options = {
  email: string
  statePath: string
  cloudflareAccountId: string
  databaseId: string
  query: Query
}

export function createD1Query({
  cloudflareAccountId,
  databaseId,
  token,
  fetcher = fetch,
}: {
  cloudflareAccountId: string
  databaseId: string
  token: string
  fetcher?: typeof fetch
}): Query {
  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(cloudflareAccountId)}/d1/database/${encodeURIComponent(databaseId)}/query`
  return async (sql, params) => {
    let response: Response
    try {
      response = await fetcher(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ sql, params }),
      })
    } catch {
      throw new Error("D1 request failed")
    }
    if (!response.ok) throw new Error(`D1 request failed (HTTP ${response.status})`)
    let body
    try {
      body = await response.json()
    } catch {
      throw new Error("D1 returned invalid JSON")
    }
    // Never echo API error bodies: they may include SQL parameters or credentials.
    const result = body?.result?.[0]
    if (
      body?.success !== true ||
      !Array.isArray(body.errors) ||
      body.errors.length !== 0 ||
      !Array.isArray(body.result) ||
      body.result.length !== 1 ||
      result?.success !== true ||
      !Array.isArray(result.results) ||
      !Number.isSafeInteger(result.meta?.changes) ||
      result.meta.changes < 0
    ) {
      throw new Error("D1 query failed or returned an invalid result")
    }
    return result as QueryResult
  }
}

function readSnapshot(options: Options): Snapshot {
  let state
  try {
    state = JSON.parse(fs.readFileSync(options.statePath, "utf8"))
  } catch {
    throw new Error("Cleanup snapshot is missing or unreadable; refusing to delete sessions")
  }
  if (
    state?.version !== 1 ||
    state.cloudflareAccountId !== options.cloudflareAccountId ||
    state.databaseId !== options.databaseId ||
    typeof state.userId !== "string" ||
    !state.userId ||
    !Array.isArray(state.sessionIds) ||
    !state.sessionIds.every((id: unknown) => typeof id === "string" && id.length > 0) ||
    new Set(state.sessionIds).size !== state.sessionIds.length
  ) {
    throw new Error("Cleanup snapshot is invalid or targets a different database")
  }
  return state as Snapshot
}

async function accountId({ query, email }: Options, expectedId?: string) {
  const { results } = await query('SELECT "id" FROM "user" WHERE "email" = ?', [email])
  const id = results[0]?.id
  if (results.length !== 1 || typeof id !== "string" || !id || (expectedId && id !== expectedId)) {
    throw new Error("Dedicated E2E account is missing or changed; refusing account cleanup")
  }
  return id
}

async function sessionIds(query: Query, userId: string) {
  const { results } = await query('SELECT "id" FROM "session" WHERE "userId" = ?', [userId])
  return results.map((row) => {
    if (typeof row.id !== "string" || !row.id) throw new Error("D1 returned an invalid session ID")
    return row.id
  })
}

export async function runAccountCommand(command: "snapshot" | "cleanup", options: Options) {
  if (command === "snapshot") {
    const userId = await accountId(options)
    const ids = await sessionIds(options.query, userId)
    await accountId(options, userId)
    const state: Snapshot = {
      version: 1,
      cloudflareAccountId: options.cloudflareAccountId,
      databaseId: options.databaseId,
      userId,
      sessionIds: ids,
    }
    // Exclusive creation prevents accidentally replacing the pre-run baseline.
    fs.writeFileSync(options.statePath, JSON.stringify(state), { mode: 0o600, flag: "wx" })
    return { baselineSessions: ids.length, deletedSessions: 0 }
  }

  // Load and validate before making any API request, especially on a failed snapshot step.
  const state = readSnapshot(options)
  await accountId(options, state.userId)
  const baseline = new Set(state.sessionIds)
  const created = (await sessionIds(options.query, state.userId)).filter((id) => !baseline.has(id))
  let deletedSessions = 0
  // D1 permits 100 bound parameters: one account ID plus at most 99 session IDs.
  for (let offset = 0; offset < created.length; offset += 99) {
    const chunk = created.slice(offset, offset + 99)
    const result = await options.query(
      `DELETE FROM "session" WHERE "userId" = ? AND "id" IN (${chunk.map(() => "?").join(", ")})`,
      [state.userId, ...chunk],
    )
    deletedSessions += result.meta.changes
  }
  await accountId(options, state.userId)
  if ((await sessionIds(options.query, state.userId)).some((id) => !baseline.has(id))) {
    throw new Error("New E2E sessions remain after cleanup")
  }
  return { baselineSessions: baseline.size, deletedSessions }
}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value?.trim()) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

if (import.meta.main) {
  try {
    const command = process.argv[2]
    if (command !== "snapshot" && command !== "cleanup") {
      throw new Error("Usage: bun .github/scripts/cleanup-maestro-account.ts <snapshot|cleanup>")
    }
    const email = requiredEnv("MAESTRO_TEST_EMAIL")
    const statePath = requiredEnv("MAESTRO_CLEANUP_STATE")
    const cloudflareAccountId = requiredEnv("CLOUDFLARE_ACCOUNT_ID")
    const token = requiredEnv("CLOUDFLARE_API_TOKEN")
    const config = JSON.parse(
      fs.readFileSync(path.join(import.meta.dir, "../../apps/backend/wrangler.json"), "utf8"),
    )
    const databaseId = config.d1_databases?.find(
      (binding: { binding: string }) => binding.binding === "DB",
    )?.database_id
    if (typeof databaseId !== "string" || !databaseId) {
      throw new Error("Backend Wrangler configuration has no DB database ID")
    }
    const counts = await runAccountCommand(command, {
      email,
      statePath,
      cloudflareAccountId,
      databaseId,
      query: createD1Query({ cloudflareAccountId, databaseId, token }),
    })
    console.log(
      `E2E account ${command}: account preserved; ${counts.baselineSessions} baseline sessions; ${counts.deletedSessions} new sessions deleted`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : "E2E account cleanup failed")
    process.exitCode = 1
  }
}
