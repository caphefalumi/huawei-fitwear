import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { env } from 'cloudflare:workers';
import * as schema from './schema';

export type Database = DrizzleD1Database<typeof schema>;

let dbInstance: Database | null = null;

export function getDb(d1?: D1Database): Database {
  const client = d1 ?? (env as unknown as { DB?: D1Database })?.DB;
  if (d1) {
    return drizzle(d1, { schema });
  }
  if (!dbInstance && client) {
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance ?? drizzle(client as D1Database, { schema });
}

export * from './schema';
