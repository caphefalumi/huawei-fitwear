import { Database } from "bun:sqlite"
import { afterEach, beforeEach, expect, test } from "bun:test"
import fs from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import { createD1Query, runAccountCommand } from "./cleanup-maestro-account"

let db: Database
let tempDir: string
let requests: { sql: string; params: string[] }[]
const email = "dedicated@example.test"
const cloudflareAccountId = "cloudflare-account"
const databaseId = "database-id"
const token = "secret-cloudflare-token"

function addSession(id: string, userId = "dedicated-user") {
  db.query(
    'INSERT INTO "session" ("id", "token", "userId", "expiresAt", "createdAt", "updatedAt") VALUES (?, ?, ?, 1000, 1, 1)',
  ).run(id, `secret-session-token-${id}`, userId)
}

function addMeal(id: string, userId = "dedicated-user") {
  db.query(
    'INSERT INTO "meal_logs" ("id", "userId", "targetDate", "mealType", "loggedAt", "createdAt") VALUES (?, ?, ?, ?, 1, 1)',
  ).run(id, userId, "2026-11-09", "lunch")
  db.query(
    'INSERT INTO "meal_items" ("id", "mealLogId", "foodName", "estimatedWeightG", "caloriesKcal", "proteinG", "carbsG", "fatG", "createdAt") VALUES (?, ?, ?, 100, 100, 1, 1, 1, 1)',
  ).run(`item-${id}`, id, `Food ${id}`)
}

function retainedIds() {
  return db.query('SELECT "id" FROM "session" ORDER BY "id"').all()
}

function retainedMealIds() {
  return db.query('SELECT "id" FROM "meal_logs" ORDER BY "id"').all()
}

function retainedItems() {
  return db.query('SELECT "id", "mealLogId" FROM "meal_items" ORDER BY "id"').all()
}

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(tmpdir(), "maestro-account-"))
  db = new Database(":memory:")
  db.exec("PRAGMA foreign_keys = ON")
  // Use the repository's real user/session schema, including the custom-auth migration.
  for (const migration of ["0000_true_pandemic.sql", "0001_public_galactus.sql"]) {
    db.exec(
      fs.readFileSync(
        path.join(import.meta.dir, "../../apps/backend/migrations", migration),
        "utf8",
      ),
    )
  }
  for (const [id, address] of [
    ["dedicated-user", email],
    ["other-user", "other@example.test"],
  ]) {
    db.query(
      'INSERT INTO "user" ("id", "email", "password", "createdAt", "updatedAt") VALUES (?, ?, ?, 1, 1)',
    ).run(id, address, "existing-password-hash")
  }
  addMeal("existing-meal")
  addSession("existing-session")
  addSession("other-session", "other-user")
  requests = []
})

afterEach(() => {
  db.close()
  fs.rmSync(tempDir, { recursive: true, force: true })
})

function options() {
  const fetcher = (async (url: string | URL | Request, init?: RequestInit) => {
    expect(String(url)).toBe(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/d1/database/${databaseId}/query`,
    )
    expect(init?.method).toBe("POST")
    expect(new Headers(init?.headers).get("Authorization")).toBe(`Bearer ${token}`)
    const request = JSON.parse(String(init?.body)) as { sql: string; params: string[] }
    requests.push(request)
    // Execute the script's actual SQL/bindings, not canned query responses.
    const results = db.query(request.sql).all(...request.params)
    const { changes } = db.query("SELECT changes() AS changes").get() as { changes: number }
    return Response.json({
      success: true,
      errors: [],
      result: [{ success: true, results, meta: { changes } }],
    })
  }) as typeof fetch
  return {
    email,
    statePath: path.join(tempDir, "cleanup.json"),
    cloudflareAccountId,
    databaseId,
    query: createD1Query({ cloudflareAccountId, databaseId, token, fetcher }),
  }
}

test("cleanup preserves baseline data and removes only a passing run's session and meal", async () => {
  const opts = options()
  const accountsBefore = db.query('SELECT * FROM "user" ORDER BY "id"').all()
  const mealsBefore = db
    .query('SELECT * FROM "meal_logs" WHERE "userId" = ? ORDER BY "id"')
    .all("dedicated-user")
  expect(await runAccountCommand("snapshot", opts)).toEqual({
    baselineSessions: 1,
    deletedSessions: 0,
    baselineMeals: 1,
    deletedMeals: 0,
  })
  const state = fs.readFileSync(opts.statePath, "utf8")
  expect(JSON.parse(state)).toEqual({
    version: 2,
    cloudflareAccountId,
    databaseId,
    userId: "dedicated-user",
    sessionIds: ["existing-session"],
    mealIds: ["existing-meal"],
  })
  for (const secret of [email, token, "existing-password-hash", "secret-session-token"]) {
    expect(state).not.toContain(secret)
  }
  if (process.platform !== "win32") expect(fs.statSync(opts.statePath).mode & 0o777).toBe(0o600)

  // Cross the D1 100-parameter ceiling and include SQL-looking IDs to prove binding.
  for (let i = 0; i < 205; i++) addSession(`new-${i}' OR 1=1 --`)
  addSession("other-new-session", "other-user")
  addMeal("run-meal-0' OR 1=1 --")
  for (let i = 1; i < 205; i++) addMeal(`run-meal-${i}' OR 1=1 --`)
  addMeal("other-new-meal", "other-user")
  expect(await runAccountCommand("cleanup", opts)).toEqual({
    baselineSessions: 1,
    deletedSessions: 205,
    baselineMeals: 1,
    deletedMeals: 205,
  })
  expect(retainedIds()).toEqual([
    { id: "existing-session" },
    { id: "other-new-session" },
    { id: "other-session" },
  ])
  expect(retainedMealIds()).toEqual([{ id: "existing-meal" }, { id: "other-new-meal" }])
  expect(retainedItems()).toEqual([
    { id: "item-existing-meal", mealLogId: "existing-meal" },
    { id: "item-other-new-meal", mealLogId: "other-new-meal" },
  ])
  expect(db.query('SELECT * FROM "user" ORDER BY "id"').all()).toEqual(accountsBefore)
  expect(
    db.query('SELECT * FROM "meal_logs" WHERE "userId" = ? ORDER BY "id"').all("dedicated-user"),
  ).toEqual(mealsBefore)
  const deletes = requests.filter(({ sql }) => sql.startsWith("DELETE"))
  expect(deletes).toHaveLength(9)
  expect(deletes.every(({ params }) => params.length <= 100)).toBe(true)
  expect(deletes.every(({ sql }) => !sql.includes("new-") && !sql.includes("run-meal-"))).toBe(true)
  expect(
    deletes
      .filter(({ sql }) => sql.includes('"session"') || sql.includes('"meal_logs"'))
      .every(({ params }) => params[0] === "dedicated-user"),
  ).toBe(true)
  expect(await runAccountCommand("cleanup", opts)).toEqual({
    baselineSessions: 1,
    deletedSessions: 0,
    baselineMeals: 1,
    deletedMeals: 0,
  })
  expect(fs.readFileSync(opts.statePath, "utf8")).toBe(state)
})

test("an empty baseline removes only a failed run's session and leaves meals alone", async () => {
  const opts = options()
  db.exec('DELETE FROM "session" WHERE "userId" = \'dedicated-user\'')
  expect(await runAccountCommand("snapshot", opts)).toEqual({
    baselineSessions: 0,
    deletedSessions: 0,
    baselineMeals: 1,
    deletedMeals: 0,
  })
  addSession("new-session")
  expect(await runAccountCommand("cleanup", opts)).toEqual({
    baselineSessions: 0,
    deletedSessions: 1,
    baselineMeals: 1,
    deletedMeals: 0,
  })
  expect(retainedIds()).toEqual([{ id: "other-session" }])
  expect(retainedMealIds()).toEqual([{ id: "existing-meal" }])
  expect(retainedItems()).toEqual([{ id: "item-existing-meal", mealLogId: "existing-meal" }])
  expect(db.query('SELECT "id" FROM "user" WHERE "email" = ?').get(email)).toEqual({
    id: "dedicated-user",
  })
})

test.each([undefined, "not-json", "{}"])(
  "missing or malformed snapshot %s fails before API access",
  async (state) => {
    const opts = options()
    if (state !== undefined) fs.writeFileSync(opts.statePath, state)
    addSession("new-session")
    const before = retainedIds()
    await expect(runAccountCommand("cleanup", opts)).rejects.toThrow(/snapshot/)
    expect(requests).toHaveLength(0)
    expect(retainedIds()).toEqual(before)
  },
)

test("an older snapshot without meal IDs fails before API access", async () => {
  const opts = options()
  fs.writeFileSync(
    opts.statePath,
    JSON.stringify({
      version: 1,
      cloudflareAccountId,
      databaseId,
      userId: "dedicated-user",
      sessionIds: ["existing-session"],
    }),
  )
  addSession("new-session")
  addMeal("new-meal")
  await expect(runAccountCommand("cleanup", opts)).rejects.toThrow(/snapshot/)
  expect(requests).toHaveLength(0)
  expect(retainedIds()).toContainEqual({ id: "new-session" })
  expect(retainedMealIds()).toContainEqual({ id: "new-meal" })
})

test("a snapshot cannot be overwritten by a later baseline", async () => {
  const opts = options()
  await runAccountCommand("snapshot", opts)
  const before = fs.readFileSync(opts.statePath, "utf8")
  addSession("new-session")
  await expect(runAccountCommand("snapshot", opts)).rejects.toThrow()
  expect(fs.readFileSync(opts.statePath, "utf8")).toBe(before)
  expect((await runAccountCommand("cleanup", opts)).deletedSessions).toBe(1)
})

test.each(["cloudflareAccountId", "databaseId"] as const)(
  "snapshot from another %s fails closed",
  async (field) => {
    const opts = options()
    await runAccountCommand("snapshot", opts)
    requests.length = 0
    addSession("new-session")
    await expect(
      runAccountCommand("cleanup", { ...opts, [field]: "another-target" }),
    ).rejects.toThrow(/snapshot/)
    expect(requests).toHaveLength(0)
    expect(retainedIds()).toContainEqual({ id: "new-session" })
  },
)

test("same email on a replacement account cannot authorize cleanup", async () => {
  const opts = options()
  await runAccountCommand("snapshot", opts)
  db.query('UPDATE "user" SET "email" = ? WHERE "id" = ?').run("old@example.test", "dedicated-user")
  db.query('UPDATE "user" SET "email" = ? WHERE "id" = ?').run(email, "other-user")
  addSession("new-session")
  await expect(runAccountCommand("cleanup", opts)).rejects.toThrow(/account is missing or changed/)
  expect(requests.some(({ sql }) => sql.startsWith("DELETE"))).toBe(false)
  expect(retainedIds()).toContainEqual({ id: "new-session" })
})

test("missing dedicated account blocks snapshot and cleanup without deletion", async () => {
  const opts = options()
  await runAccountCommand("snapshot", opts)
  db.query('UPDATE "user" SET "email" = ? WHERE "id" = ?').run(
    "renamed@example.test",
    "dedicated-user",
  )
  await expect(
    runAccountCommand("snapshot", { ...opts, statePath: path.join(tempDir, "another.json") }),
  ).rejects.toThrow(/account/)
  await expect(runAccountCommand("cleanup", opts)).rejects.toThrow(/account/)
  expect(requests.some(({ sql }) => sql.startsWith("DELETE"))).toBe(false)
})

test.each([
  ["HTTP", () => new Response(token, { status: 403 })],
  ["API", () => Response.json({ success: false, errors: [{ message: token }] })],
  [
    "SQL",
    () => Response.json({ success: true, errors: [], result: [{ success: false, error: token }] }),
  ],
  ["JSON", () => new Response(token)],
  [
    "network",
    () => {
      throw new Error(token)
    },
  ],
] as const)(
  "%s failures propagate without exposing API contents or writing a snapshot",
  async (_, response) => {
    const opts = options()
    opts.query = createD1Query({
      cloudflareAccountId,
      databaseId,
      token,
      fetcher: (async () => response()) as typeof fetch,
    })
    let message = ""
    try {
      await runAccountCommand("snapshot", opts)
    } catch (error) {
      message = (error as Error).message
    }
    expect(message).toContain("D1")
    expect(message).not.toContain(token)
    expect(fs.existsSync(opts.statePath)).toBe(false)
  },
)

test("failed cleanup keeps its original baseline and can safely resume", async () => {
  const opts = options()
  await runAccountCommand("snapshot", opts)
  const state = fs.readFileSync(opts.statePath, "utf8")
  addSession("new-session")
  addMeal("new-meal")
  const query = opts.query
  opts.query = (sql, params) => {
    if (sql.startsWith("DELETE")) return Promise.reject(new Error("D1 deletion failed"))
    return query(sql, params)
  }
  await expect(runAccountCommand("cleanup", opts)).rejects.toThrow("D1 deletion failed")
  expect(retainedIds()).toContainEqual({ id: "new-session" })
  expect(retainedMealIds()).toContainEqual({ id: "new-meal" })
  expect(fs.readFileSync(opts.statePath, "utf8")).toBe(state)
  opts.query = query
  expect(await runAccountCommand("cleanup", opts)).toMatchObject({
    deletedSessions: 1,
    deletedMeals: 1,
  })
  expect(retainedMealIds()).toEqual([{ id: "existing-meal" }])
  expect(retainedItems()).toEqual([{ id: "item-existing-meal", mealLogId: "existing-meal" }])
})

test("cleanup resumes after one delete chunk succeeds and the next fails", async () => {
  const opts = options()
  await runAccountCommand("snapshot", opts)
  for (let i = 0; i < 105; i++) addSession(`new-${i}`)
  const query = opts.query
  let deletes = 0
  opts.query = (sql, params) => {
    if (sql.startsWith("DELETE") && ++deletes === 2) {
      return Promise.reject(new Error("D1 second chunk failed"))
    }
    return query(sql, params)
  }
  await expect(runAccountCommand("cleanup", opts)).rejects.toThrow("D1 second chunk failed")
  expect(retainedIds()).toHaveLength(8)
  opts.query = query
  expect((await runAccountCommand("cleanup", opts)).deletedSessions).toBe(6)
  expect(retainedIds()).toEqual([{ id: "existing-session" }, { id: "other-session" }])
})

test("D1 errors identify the failed lookup without leaking response messages", async () => {
  const fetcher = (async () =>
    Response.json(
      { errors: [{ code: 7500, message: "sensitive SQL or credentials" }] },
      { status: 400 },
    )) as typeof fetch
  const query = createD1Query({ cloudflareAccountId, databaseId, token, fetcher })
  await expect(query('SELECT "id" FROM "user" WHERE "email" = ?', [email])).rejects.toThrow(
    "D1 account lookup failed (HTTP 400; codes: 7500)",
  )
})
