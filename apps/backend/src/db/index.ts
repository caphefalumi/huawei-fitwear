import * as schema from './schema';
import { drizzle } from 'drizzle-orm/d1';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export type Schema = typeof schema;
export type Database = DrizzleD1Database<typeof schema>;

export type WorkerBindings = {
  DB?: D1Database;
  fitwear_kv?: KVNamespace;
};

let boundEnv: WorkerBindings = {};

export function setDatabaseBinding(env: WorkerBindings) {
  boundEnv = env;
}

export function getKv(): KVNamespace | undefined {
  return boundEnv.fitwear_kv;
}

export function getDb(d1?: D1Database): Database {
  const client = d1 || boundEnv.DB;
  if (!client) {
    throw new Error('D1Database binding is required. Make sure env.DB is passed or bound.');
  }
  return drizzle(client, { schema });
}

export * from './schema';
