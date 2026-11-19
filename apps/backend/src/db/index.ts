import { drizzle } from "drizzle-orm/d1"
import type { DrizzleD1Database } from "drizzle-orm/d1"

import { getDatabaseBinding } from "../worker/bindings"
import * as schema from "./schema"

export type Schema = typeof schema
export type Database = DrizzleD1Database<typeof schema>

export function getDb(d1?: D1Database): Database {
  const client = d1 ?? getDatabaseBinding()
  if (!client) {
    throw new Error("D1Database binding is required. Make sure env.DB is passed or bound.")
  }
  return drizzle(client, { schema })
}

export * from "./schema"
