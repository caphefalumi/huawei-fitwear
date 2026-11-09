import { expect, test } from "bun:test"

import { validateE2EEnvironment } from "./validate-e2e-environment"

const PROD_DB = "e7f57e76-0a1b-4a58-a4ff-acaaeb10586f"
const STAGE_DB = "12345678-1234-4123-8123-123456789abc"

function wrangler() {
  return {
    name: "fitwear-backend",
    d1_databases: [{ binding: "DB", database_name: "fitwear-d1", database_id: PROD_DB }],
    kv_namespaces: [{ binding: "fitwear_kv", id: "production-kv-id" }],
    r2_buckets: [{ binding: "MEAL_IMAGES", bucket_name: "fitwear-meal-images" }],
    queues: {
      producers: [{ binding: "EMAIL_QUEUE", queue: "fitwear-email" }],
      consumers: [{ queue: "fitwear-email", dead_letter_queue: "fitwear-email-dlq" }],
    },
    env: {
      staging: {
        name: "fitwear-backend-staging",
        d1_databases: [
          { binding: "DB", database_name: "fitwear-d1-staging", database_id: STAGE_DB },
        ],
        kv_namespaces: [{ binding: "fitwear_kv", id: "staging-kv-id" }],
        r2_buckets: [{ binding: "MEAL_IMAGES", bucket_name: "fitwear-meal-images-staging" }],
        queues: {
          producers: [{ binding: "EMAIL_QUEUE", queue: "fitwear-email-staging" }],
          consumers: [
            { queue: "fitwear-email-staging", dead_letter_queue: "fitwear-email-staging-dlq" },
          ],
        },
      },
    },
  }
}

const config = {
  E2E_API_URL: "https://fitwear-backend-staging.example.workers.dev/",
  E2E_D1_DATABASE_ID: STAGE_DB,
  MAESTRO_TEST_EMAIL: "e2e@example.test",
  MAESTRO_TEST_PASSWORD: "test-secret",
  CLOUDFLARE_ACCOUNT_ID: "cloudflare-account",
  CLOUDFLARE_API_TOKEN: "api-secret",
}

test("accepts matching isolated staging config", () => {
  expect(validateE2EEnvironment(config, wrangler())).toEqual({
    apiUrl: config.E2E_API_URL,
    databaseId: STAGE_DB,
  })
})

test.each(Object.keys(config))("rejects missing %s", (key) => {
  expect(() => validateE2EEnvironment({ ...config, [key]: "" }, wrangler())).toThrow(key)
})

test.each([
  "http://api.staging.example.test/",
  "https://fitwear.tm-project.id.vn/",
  "https://FITWEAR.TM-PROJECT.ID.VN/api",
  "https://fitwear-backend.example.workers.dev/",
  "https://unrelated.example.workers.dev/",
  "https://user:password@fitwear-backend-staging.example.workers.dev/",
  "https://fitwear-backend-staging.example.workers.dev/?token=secret",
  "https://fitwear-backend-staging.example.workers.dev/#fragment",
  "not-a-url",
])("rejects unsafe E2E API URL %s", (url) => {
  expect(() => validateE2EEnvironment({ ...config, E2E_API_URL: url }, wrangler())).toThrow()
})

test("rejects a mismatched D1 secret", () => {
  expect(() =>
    validateE2EEnvironment({ ...config, E2E_D1_DATABASE_ID: PROD_DB }, wrangler()),
  ).toThrow(/production D1|does not match/)
})

test("rejects malformed D1 IDs or missing production D1 config", () => {
  expect(() =>
    validateE2EEnvironment({ ...config, E2E_D1_DATABASE_ID: "oops" }, wrangler()),
  ).toThrow(/UUID/)
  expect(() =>
    validateE2EEnvironment(config, { ...wrangler(), d1_databases: [] }),
  ).toThrow(/D1/)
})

test("fails closed if staging D1 has not been provisioned", () => {
  const stage = wrangler()
  delete (stage.env.staging.d1_databases[0] as { database_id?: string }).database_id
  expect(() => validateE2EEnvironment(config, stage)).toThrow(/no database_id yet/)
})

test("rejects staging resources pointing at production", () => {
  const sameD1 = wrangler()
  sameD1.env.staging.d1_databases[0].database_id = PROD_DB
  expect(() => validateE2EEnvironment(config, sameD1)).toThrow(/production D1/)

  const sameKv = wrangler()
  sameKv.env.staging.kv_namespaces[0].id = "production-kv-id"
  expect(() => validateE2EEnvironment(config, sameKv)).toThrow(/Staging KV/)

  const sameBucket = wrangler()
  sameBucket.env.staging.r2_buckets[0].bucket_name = "fitwear-meal-images"
  expect(() => validateE2EEnvironment(config, sameBucket)).toThrow(/Staging R2/)

  const sameQueue = wrangler()
  sameQueue.env.staging.queues.producers[0].queue = "fitwear-email"
  expect(() => validateE2EEnvironment(config, sameQueue)).toThrow(/Staging email queues/)
})

test("rejects a malformed account email", () => {
  expect(() => validateE2EEnvironment(
    { ...config, MAESTRO_TEST_EMAIL: "not-email" }, wrangler(),
  )).toThrow(/account email/)
})
