import { hashPassword, isPasswordWithinLimit } from "../../apps/backend/src/lib/password"
import { createD1Query } from "./cleanup-maestro-account"

// Explicit opt-in only, after staging isolation validation. Never alter an existing account.
const email = process.env.MAESTRO_TEST_EMAIL!.toLowerCase()
const password = process.env.MAESTRO_TEST_PASSWORD!
const query = createD1Query({
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  databaseId: process.env.E2E_D1_DATABASE_ID!,
  token: process.env.CLOUDFLARE_API_TOKEN!,
})
try {
  if (password.length < 8 || !isPasswordWithinLimit(password)) {
    throw new Error("E2E password does not meet backend requirements")
  }
  const { results } = await query('SELECT "id" FROM "user" LIMIT 1', [])
  if (results.length !== 0)
    throw new Error("Staging already has users; refusing automatic account provisioning")
  const hash = await hashPassword(password)
  const now = String(Math.floor(Date.now() / 1000))
  const inserted = await query(
    'INSERT INTO "user" ("id", "email", "password", "name", "createdAt", "updatedAt") SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM "user")',
    [crypto.randomUUID(), email, hash, "E2E Test", now, now],
  )
  if (inserted.meta.changes !== 1) throw new Error("Staging account was not created")
  console.log("Dedicated E2E staging account created.")
} catch (error) {
  console.error(error instanceof Error ? error.message : "E2E account provisioning failed")
  process.exitCode = 1
}
