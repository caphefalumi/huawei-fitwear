import { Database, type SQLQueryBindings } from "bun:sqlite"
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { drizzle } from "drizzle-orm/d1"

import * as schema from "../../src/db/schema"

export function createTestDatabase(): { d1: D1Database; db: ReturnType<typeof drizzle> } {
  const sqlite = new Database(":memory:")
  sqlite.exec("PRAGMA foreign_keys = ON;")

  const d1 = {
    prepare(query: string) {
      let boundParams: SQLQueryBindings[] = []
      const stmt = {
        bind(...params: unknown[]) {
          boundParams = params.map((p) => {
            if (p instanceof Date) {
              return Math.floor(p.getTime() / 1000)
            }
            if (typeof p === "boolean") {
              return p ? 1 : 0
            }
            if (
              p === null ||
              typeof p === "string" ||
              typeof p === "number" ||
              typeof p === "bigint" ||
              p instanceof Uint8Array
            )
              return p
            throw new TypeError("Unsupported SQLite parameter")
          })
          return stmt
        },
        async first(colName?: string) {
          const res = sqlite
            .prepare<Record<string, unknown>, SQLQueryBindings[]>(query)
            .get(...boundParams)
          if (colName && res) return res[colName]
          return res
        },
        async all() {
          const results = sqlite.prepare(query).all(...boundParams)
          return { results, success: true, meta: {} }
        },
        async run() {
          const res = sqlite.prepare(query).run(...boundParams)
          return {
            success: true,
            meta: { changes: res.changes, last_row_id: Number(res.lastInsertRowid) },
          }
        },
        async raw() {
          return sqlite.prepare(query).values(...boundParams)
        },
      }
      return stmt
    },
    async exec(query: string) {
      sqlite.exec(query)
      return { count: 1, duration: 0 }
    },
    async batch(stmts: { run: () => Promise<unknown> }[]) {
      sqlite.exec("BEGIN TRANSACTION;")
      try {
        const results = []
        for (const statement of stmts) results.push(await statement.run())
        sqlite.exec("COMMIT;")
        return results
      } catch (err) {
        sqlite.exec("ROLLBACK;")
        throw err
      }
    },
    async dump() {
      return new ArrayBuffer(0)
    },
  } as unknown as D1Database

  const migrationsPath = fileURLToPath(new URL("../../migrations/", import.meta.url))
  for (const filename of readdirSync(migrationsPath)
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    sqlite.exec(readFileSync(`${migrationsPath}/${filename}`, "utf8"))
  }

  const db = drizzle(d1, { schema })
  return { d1, db }
}
