import fs from "node:fs"
import path from "node:path"

type Environment = Record<string, string | undefined>
type WranglerConfig = { d1_databases?: { binding: string; database_id: string }[] }

const REQUIRED = [
  "E2E_API_URL",
  "E2E_D1_DATABASE_ID",
  "MAESTRO_TEST_EMAIL",
  "MAESTRO_TEST_PASSWORD",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
] as const

export function validateE2EEnvironment(
  env: Environment,
  productionConfig: WranglerConfig,
  productionApiUrl = "https://fitwear.tm-project.id.vn/",
) {
  for (const key of REQUIRED) {
    if (!env[key]?.trim()) throw new Error("Missing required E2E configuration: " + key)
  }

  const input = env.E2E_API_URL!.trim()
  let api: URL
  try {
    api = new URL(input)
  } catch {
    throw new Error("E2E_API_URL is not a valid absolute URL")
  }
  if (
    api.protocol !== "https:" ||
    !api.hostname ||
    api.username ||
    api.password ||
    api.search ||
    api.hash
  ) {
    throw new Error("E2E_API_URL must be an HTTPS API URL without credentials, query or fragment")
  }
  const productionApi = new URL(productionApiUrl)
  if (api.hostname.toLowerCase() === productionApi.hostname.toLowerCase()) {
    throw new Error("E2E_API_URL must not target the production API host")
  }

  const productionDatabase = productionConfig.d1_databases?.find((db) => db.binding === "DB")?.database_id
  if (!productionDatabase) throw new Error("Cannot identify production D1 database; refusing E2E")
  const stagingDatabase = env.E2E_D1_DATABASE_ID!.trim()
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stagingDatabase)) {
    throw new Error("E2E_D1_DATABASE_ID must be a valid UUID")
  }
  if (stagingDatabase.toLowerCase() === productionDatabase.toLowerCase()) {
    throw new Error("E2E_D1_DATABASE_ID must not be the production D1 database")
  }
  if (!env.MAESTRO_TEST_EMAIL!.includes("@")) {
    throw new Error("MAESTRO_TEST_EMAIL must be an account email")
  }
  return { apiUrl: api.toString(), databaseId: stagingDatabase }
}

if (import.meta.main) {
  try {
    const config = JSON.parse(
      fs.readFileSync(path.join(import.meta.dir, "../../apps/backend/wrangler.json"), "utf8"),
    ) as WranglerConfig
    validateE2EEnvironment(process.env, config)
    console.log("E2E staging environment validated. Production API and D1 database rejected.")
  } catch (error) {
    console.error(error instanceof Error ? error.message : "E2E environment validation failed")
    process.exitCode = 1
  }
}
