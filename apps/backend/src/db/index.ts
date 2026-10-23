import * as schema from './schema';
import { drizzle } from 'drizzle-orm/d1';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export type Schema = typeof schema;
export type Database = DrizzleD1Database<typeof schema>;

let boundEnv: { DB?: D1Database } = {};

export function setDatabaseBinding(env: { DB?: D1Database }) {
  boundEnv = env;
}

export function getDb(d1?: D1Database): Database {
  const client = d1 || boundEnv.DB;
  if (!client) {
    throw new Error('D1Database binding is required. Make sure env.DB is passed or bound.');
  }
  return drizzle(client, { schema });
}

export * from './schema';
