import { Database } from "bun:sqlite"

// The Items API requires an account token with AI Search: Edit and AI Search: Run.
const account = process.env.CLOUDFLARE_ACCOUNT_ID
const token = process.env.CLOUDFLARE_API_TOKEN
if (!account || !token)
  throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required")

const base = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai-search/namespaces/vooc-health/instances/vooc/items`
const headers = { Authorization: `Bearer ${token}` }
const sleep = Bun.sleep

type Food = {
  id: string
  name: string
  servingUnit: string
  glyph: string
  caloriesPer100: number
  proteinPer100G: number
  carbsPer100G: number
  fatPer100G: number
}
type Item = {
  id: string
  key: string
  status: string
  error?: string
  metadata: Record<string, string | number | boolean> | null
}
type Envelope<T> = {
  success: boolean
  result: T
  result_info?: { total_count: number }
  errors?: { code: number; message: string }[]
}
async function fetchRead(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(url, { ...init, signal: AbortSignal.timeout(30000) })
    } catch (error) {
      if (attempt >= 8) throw error
      await sleep(Math.min(1000 * 2 ** attempt, 30000))
    }
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<Envelope<T>> {
  for (let attempt = 0; ; attempt++) {
    const options = { ...init, headers: { ...headers, ...init.headers } }
    const response =
      !init.method || init.method === "GET"
        ? await fetchRead(url, options)
        : await fetch(url, options)
    const body = ((await response.json().catch(() => null)) ?? {
      success: false,
      errors: [{ code: 0, message: "Empty or non-JSON response from Cloudflare" }],
    }) as Envelope<T>
    if (response.ok && body.success) return body
    const transient =
      (response.status === 429 &&
        !body.errors?.some((error) => [7112, 7116].includes(error.code))) ||
      response.status >= 500
    if (transient && attempt < 8) {
      const retryAfter = Number(response.headers.get("Retry-After")) || 0
      await sleep(Math.max(retryAfter * 1000, Math.min(1000 * 2 ** attempt, 30000)))
      continue
    }
    throw new Error(`AI Search ${response.status}: ${JSON.stringify(body.errors)}`)
  }
}

async function listItems(): Promise<Map<string, Item>> {
  const items = new Map<string, Item>()
  for (let page = 1; ; page++) {
    const response = await request<Item[]>(
      `${base}?source=builtin&per_page=50&sort_by=modified_at&page=${page}`,
    )
    for (const item of response.result) items.set(item.key, item)
    if (page * 50 >= (response.result_info?.total_count ?? 0)) break
  }
  return items
}

const db = new Database(":memory:")
db.exec(
  "CREATE TABLE foods (id TEXT PRIMARY KEY, name TEXT, servingUnit TEXT, glyph TEXT, caloriesPer100 REAL, proteinPer100G REAL, carbsPer100G REAL, fatPer100G REAL)",
)
db.exec(await Bun.file(new URL("./usda_food_catalog.sql", import.meta.url)).text())
const foods = db.query("SELECT * FROM foods").all() as Food[]
db.close()
if (foods.length === 0) throw new Error("USDA catalog is empty")

const existing = await listItems()
const pending: Food[] = []
const retry: Item[] = []
let checked = 0
async function checkExisting() {
  while (checked < foods.length) {
    const food = foods[checked++]!
    const item = existing.get(`${food.id}.txt`)
    if (!item) {
      pending.push(food)
    } else if (
      item.metadata?.catalog_sha256 !==
        new Bun.CryptoHasher("sha256").update(JSON.stringify(food)).digest("hex") &&
      !(await (async () => {
        for (let attempt = 0; ; attempt++) {
          const response = await fetchRead(`${base}/${encodeURIComponent(item.id)}/download`, {
            headers,
          })
          if (response.ok) return (await response.text()) === JSON.stringify(food)
          if ((response.status === 429 || response.status >= 500) && attempt < 8) {
            const retryAfter = Number(response.headers.get("Retry-After")) || 0
            await sleep(Math.max(retryAfter * 1000, Math.min(1000 * 2 ** attempt, 30000)))
            continue
          }
          throw new Error(`AI Search download ${response.status}: ${item.key}`)
        }
      })())
    ) {
      throw new Error(
        `Existing item ${item.key} does not match the USDA seed; refusing to overwrite it`,
      )
    } else if (item.status === "error") {
      retry.push(item)
    } else if (item.status === "skipped") {
      throw new Error(`Existing item ${item.key} was skipped: ${item.error ?? ""}`)
    }
  }
}
await Promise.all(Array.from({ length: 6 }, () => checkExisting()))
console.log(
  `Found ${foods.length - pending.length} existing USDA foods; uploading ${pending.length}`,
)
for (const item of retry) {
  await request(`${base}/${encodeURIComponent(item.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ next_action: "INDEX" }),
  })
}

let next = 0
async function upload() {
  while (next < pending.length) {
    const food = pending[next++]!
    const form = new FormData()
    form.set("file", new Blob([JSON.stringify(food)], { type: "text/plain" }), `${food.id}.txt`)
    form.set(
      "metadata",
      JSON.stringify({
        catalog_sha256: new Bun.CryptoHasher("sha256").update(JSON.stringify(food)).digest("hex"),
      }),
    )
    const result = await request<Item>(base, { method: "POST", body: form })
    if (result.result.status === "error" || result.result.status === "skipped") {
      throw new Error(`Failed to index ${food.id}: ${result.result.error ?? result.result.status}`)
    }
    if (next % 500 === 0) console.log(`Uploaded ${next}/${pending.length}`)
  }
}
await Promise.all(Array.from({ length: 6 }, () => upload()))

// Uploads are asynchronous; don't deploy a search client against a partial catalog.
for (;;) {
  const items = await listItems()
  let remaining = 0
  for (const food of foods) {
    const item = items.get(`${food.id}.txt`)
    if (
      !item ||
      item.status === "queued" ||
      item.status === "running" ||
      item.status === "outdated"
    )
      remaining++
    else if (item.status !== "completed")
      throw new Error(`Failed to index ${food.id}: ${item.error ?? item.status}`)
  }
  if (remaining === 0) break
  console.log(`Waiting for ${remaining} USDA foods to finish indexing`)
  await sleep(30000)
}
console.log(`Indexed all ${foods.length} USDA foods`)
