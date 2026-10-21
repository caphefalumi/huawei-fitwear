import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { env } from 'cloudflare:workers';

let prismaInstance: PrismaClient | null = null;

export function getPrisma(d1?: D1Database): PrismaClient {
  const db = d1 ?? (env as unknown as { DB?: D1Database })?.DB;
  if (!prismaInstance && db) {
    const adapter = new PrismaD1(db);
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance ?? new PrismaClient();
}
