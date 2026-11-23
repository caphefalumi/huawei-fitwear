import { AsyncLocalStorage } from "node:async_hooks"

import type { EmailMessage } from "../modules/email/queue"

export type WorkerBindings = Partial<
  Pick<Env, "DB" | "fitwear_kv" | "AI" | "MEAL_IMAGES" | "EMAIL_QUEUE">
> & {
  RESEND_API_KEY?: string
  RESEND_FROM?: string
  RESEND_WELCOME_TEMPLATE_ID?: string
  RESEND_PASSWORD_RESET_TEMPLATE_ID?: string
}

const requestBindings = new AsyncLocalStorage<WorkerBindings>()

export function withWorkerBindings<T>(env: WorkerBindings, run: () => T): T {
  return requestBindings.run(env, run)
}

export function getDatabaseBinding(): D1Database | undefined {
  return requestBindings.getStore()?.DB
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
