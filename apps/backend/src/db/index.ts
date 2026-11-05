import { AsyncLocalStorage } from "node:async_hooks"

import { drizzle } from "drizzle-orm/d1"
import type { DrizzleD1Database } from "drizzle-orm/d1"

import type { EmailMessage } from "../modules/email/queue"
import * as schema from "./schema"

export type Schema = typeof schema
export type Database = DrizzleD1Database<typeof schema>

export type WorkerBindings = Partial<
  Pick<Env, "DB" | "fitwear_kv" | "AI" | "MEAL_IMAGES" | "EMAIL_QUEUE">
> & {
  RESEND_API_KEY?: string
  RESEND_FROM?: string
  RESEND_WELCOME_TEMPLATE_ID?: string
  RESEND_PASSWORD_RESET_TEMPLATE_ID?: string
}
const requestBindings = new AsyncLocalStorage<WorkerBindings>()

export function withDatabaseBinding<T>(env: WorkerBindings, run: () => T): T {
  return requestBindings.run(env, run)
}

export function getKv(): KVNamespace | undefined {
  return requestBindings.getStore()?.fitwear_kv
}

export function getEmailConfig() {
  const bindings = requestBindings.getStore()
  return {
    apiKey: bindings?.RESEND_API_KEY,
    from: bindings?.RESEND_FROM,
    welcomeTemplateId: bindings?.RESEND_WELCOME_TEMPLATE_ID,
    passwordResetTemplateId: bindings?.RESEND_PASSWORD_RESET_TEMPLATE_ID,
  }
}

export function getEmailQueue(): Queue<EmailMessage> | undefined {
  return requestBindings.getStore()?.EMAIL_QUEUE
}
export function getAi(): Ai | undefined {
  return requestBindings.getStore()?.AI
}

export function getMealImages(): R2Bucket | undefined {
  return requestBindings.getStore()?.MEAL_IMAGES
}

export function getDb(d1?: D1Database): Database {
  const client = d1 ?? requestBindings.getStore()?.DB
  if (!client) {
    throw new Error("D1Database binding is required. Make sure env.DB is passed or bound.")
  }
  return drizzle(client, { schema })
}

export * from "./schema"
