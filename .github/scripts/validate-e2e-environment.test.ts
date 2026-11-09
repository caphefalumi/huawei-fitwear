import { expect, test } from "bun:test"
import { validateE2EEnvironment } from "./validate-e2e-environment"

const PROD_DB = "e7f57e76-0a1b-4a58-a4ff-acaaeb10586f"
const STAGE_DB = "12345678-1234-4123-8123-123456789abc"
const production = { d1_databases: [{ binding: "DB", database_id: PROD_DB }] }
const config = {
  E2E_API_URL: "https://api.staging.example.test/",
  E2E_D1_DATABASE_ID: STAGE_DB,
  MAESTRO_TEST_EMAIL: "e2e@example.test",
  MAESTRO_TEST_PASSWORD: "test-secret",
  CLOUDFLARE_ACCOUNT_ID: "cloudflare-account",
  CLOUDFLARE_API_TOKEN: "api-secret",
}

test("accepts an isolated staging API and D1 database", () => {
  expect(validateE2EEnvironment(config, production)).toEqual({
    apiUrl: config.E2E_API_URL,
    databaseId: STAGE_DB,
  })
})

test.each(Object.keys(config))("rejects missing %s", (key) => {
  expect(() => validateE2EEnvironment({ ...config, [key]: "" }, production)).toThrow(key)
})

test.each([
  "http://api.staging.example.test/",
  "https://fitwear.tm-project.id.vn/",
  "https://FITWEAR.TM-PROJECT.ID.VN/api",
  "https://user:password@api.staging.example.test/",
  "https://api.staging.example.test/?access_token=secret",
  "https://api.staging.example.test/#fragment",
  "not-a-url",
])("rejects unsafe E2E API URL %s", (url) => {
  expect(() => validateE2EEnvironment({ ...config, E2E_API_URL: url }, production)).toThrow()
})

test("rejects the production D1 database", () => {
  expect(() => validateE2EEnvironment({ ...config, E2E_D1_DATABASE_ID: PROD_DB }, production))
    .toThrow(/production D1/)
})

test("rejects malformed or missing database identifiers", () => {
  expect(() => validateE2EEnvironment({ ...config, E2E_D1_DATABASE_ID: "oops" }, production))
    .toThrow(/UUID/)
  expect(() => validateE2EEnvironment(config, {})).toThrow(/production D1/)
})

test("rejects a missing or invalid E2E account", () => {
  expect(() => validateE2EEnvironment({ ...config, MAESTRO_TEST_EMAIL: "not-email" }, production))
    .toThrow(/email/)
})
