import fs from "node:fs"
import path from "node:path"

type Environment = Record<string, string | undefined>
type Database = { binding: string; database_name?: string; database_id?: string }
type KV = { binding: string; id?: string }
type Bucket = { binding: string; bucket_name: string }
type QueueProducer = { binding: string; queue: string }
type QueueConsumer = { queue: string; dead_letter_queue?: string }
type WranglerBindings = {
  name?: string
  d1_databases?: Database[]
  kv_namespaces?: KV[]
  r2_buckets?: Bucket[]
  queues?: { producers?: QueueProducer[]; consumers?: QueueConsumer[] }
}
type WranglerConfig = WranglerBindings & { env?: { staging?: WranglerBindings } }

const REQUIRED = [
  "E2E_API_URL",
  "E2E_D1_DATABASE_ID",
  "MAESTRO_TEST_EMAIL",
  "MAESTRO_TEST_PASSWORD",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
] as const

function requireIsolatedBindings(config: WranglerConfig, expectedStagingDatabaseId: string) {
  const staging = config.env?.staging
  if (!staging?.name || staging.name === config.name) {
    throw new Error("Wrangler staging Worker must have a distinct name")
  }
  const productionDatabase = config.d1_databases?.find((db) => db.binding === "DB")
  const stagingDatabase = staging.d1_databases?.find((db) => db.binding === "DB")
  if (!productionDatabase?.database_id || !stagingDatabase?.database_name) {
    throw new Error("Both production and staging D1 bindings must be configured")
  }
  if (stagingDatabase.database_name === productionDatabase.database_name) {
    throw new Error("Staging D1 must have a different database name")
  }
  if (!stagingDatabase.database_id) {
    throw new Error("Staging D1 has no database_id yet; provision it and commit the real ID")
  }
  if (stagingDatabase.database_id.toLowerCase() === productionDatabase.database_id.toLowerCase()) {
    throw new Error("Wrangler staging D1 must not use the production D1 database")
  }
  if (stagingDatabase.database_id.toLowerCase() !== expectedStagingDatabaseId.toLowerCase()) {
    throw new Error("E2E_D1_DATABASE_ID does not match the Wrangler staging DB binding")
  }

  const productionKv = config.kv_namespaces?.find((kv) => kv.binding === "fitwear_kv")
  const stagingKv = staging.kv_namespaces?.find((kv) => kv.binding === "fitwear_kv")
  if (!stagingKv || (productionKv?.id && stagingKv.id === productionKv.id)) {
    throw new Error("Staging KV binding missing or refers to production")
  }

  const productionBucket = config.r2_buckets?.find((bucket) => bucket.binding === "MEAL_IMAGES")
  const stagingBucket = staging.r2_buckets?.find((bucket) => bucket.binding === "MEAL_IMAGES")
  if (!stagingBucket?.bucket_name || stagingBucket.bucket_name === productionBucket?.bucket_name) {
    throw new Error("Staging R2 bucket missing or refers to production")
  }

  const productionQueue = config.queues?.producers?.find((queue) => queue.binding === "EMAIL_QUEUE")
  const stagingQueue = staging.queues?.producers?.find((queue) => queue.binding === "EMAIL_QUEUE")
  const stagingConsumer = staging.queues?.consumers?.find(
    (queue) => queue.queue === stagingQueue?.queue,
  )
  if (
    !stagingQueue?.queue ||
    stagingQueue.queue === productionQueue?.queue ||
    !stagingConsumer ||
    !stagingConsumer.dead_letter_queue ||
    stagingConsumer.dead_letter_queue === config.queues?.consumers?.[0]?.dead_letter_queue
  ) {
    throw new Error("Staging email queues must be separate from production")
  }
  return staging.name
}

export function validateE2EEnvironment(
  env: Environment,
  wrangler: WranglerConfig,
  productionApiUrl = "https://fitwear.tm-project.id.vn/",
) {
  for (const key of REQUIRED) {
    if (!env[key]?.trim()) throw new Error("Missing required E2E configuration: " + key)
  }

  const stageId = env.E2E_D1_DATABASE_ID!.trim()
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stageId)) {
    throw new Error("E2E_D1_DATABASE_ID must be a valid UUID")
  }
  const stageWorker = requireIsolatedBindings(wrangler, stageId)

  let api: URL
  try {
    api = new URL(env.E2E_API_URL!.trim())
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
  const hostname = api.hostname.toLowerCase()
  if (
    hostname === new URL(productionApiUrl).hostname.toLowerCase() ||
    (wrangler.name &&
      hostname.endsWith(".workers.dev") &&
      hostname.startsWith(wrangler.name.toLowerCase() + "."))
  ) {
    throw new Error("E2E_API_URL must not target a production API host")
  }
  if (
    hostname.endsWith(".workers.dev") &&
    !hostname.startsWith(stageWorker.toLowerCase() + ".")
  ) {
    throw new Error("E2E_API_URL workers.dev hostname must match the staging Worker")
  }
  if (!env.MAESTRO_TEST_EMAIL!.includes("@")) {
    throw new Error("MAESTRO_TEST_EMAIL must be an account email")
  }
  return { apiUrl: api.toString(), databaseId: stageId }
}

if (import.meta.main) {
  try {
    const config = JSON.parse(
      fs.readFileSync(path.join(import.meta.dir, "../../apps/backend/wrangler.json"), "utf8"),
    ) as WranglerConfig
    validateE2EEnvironment(process.env, config)
    console.log("E2E staging environment validated. Production bindings and API rejected.")
  } catch (error) {
    console.error(error instanceof Error ? error.message : "E2E environment validation failed")
    process.exitCode = 1
  }
}
