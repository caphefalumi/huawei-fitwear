import { afterEach, describe, expect, it } from "bun:test"
import { withDatabaseBinding } from "../../src/db"
import { consumeEmailBatch, isEmailMessage, type EmailMessage } from "../../src/modules/email/queue"

const originalFetch = globalThis.fetch

type Captured = {
  id: string
  body: unknown
  attempts: number
  acked: boolean
  retryDelay?: number
}
function queueMessage(id: string, body: unknown): Captured {
  const message: Captured = { id, body, attempts: 1, acked: false }
  return Object.assign(message, {
    ack() {
      message.acked = true
    },
    retry(options: { delaySeconds?: number }) {
      message.retryDelay = options.delaySeconds
    },
  })
}

describe("Email queue consumer", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it("validates supported message types and suppresses expired reset messages", async () => {
    expect(isEmailMessage({ type: "welcome", to: "a@example.test", name: null })).toBe(true)
    expect(isEmailMessage({ type: "unsupported", to: "a@example.test" })).toBe(false)
    const resetMessage = {
      type: "password-reset",
      to: "a@example.test",
      expiresAt: Date.now() + 30_000,
    }
    expect(isEmailMessage({ ...resetMessage, otp: "0123" })).toBe(true)
    expect(isEmailMessage({ ...resetMessage, otp: "123" })).toBe(false)
    expect(isEmailMessage({ ...resetMessage, otp: "12345" })).toBe(false)
    const expired = queueMessage("expired-reset", {
      type: "password-reset",
      to: "a@example.test",
      otp: "1234",
      expiresAt: Date.now() - 1,
    })
    let sends = 0
    globalThis.fetch = (async () => {
      sends++
      return Response.json({})
    }) as typeof fetch
    await withDatabaseBinding({ RESEND_API_KEY: "key", RESEND_FROM: "sender@example.test" }, () =>
      consumeEmailBatch({ messages: [expired] } as unknown as MessageBatch<unknown>),
    )
    expect(expired.acked).toBe(true)
    expect(sends).toBe(0)
  })

  it("sends in order at least 110 ms apart with message-id idempotency and retries provider failures", async () => {
    const startTimes: number[] = []
    const headers: string[] = []
    const templates: { id: string; variables: Record<string, string> }[] = []
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      startTimes.push(Date.now())
      headers.push(new Headers(init?.headers).get("Idempotency-Key") ?? "")
      const payload = JSON.parse(String(init?.body)) as {
        template: { id: string; variables: Record<string, string> }
      }
      templates.push(payload.template)
      return headers.length === 2
        ? new Response("down", { status: 503 })
        : Response.json({ id: "sent" })
    }) as typeof fetch
    const first = queueMessage("welcome-1", {
      type: "welcome",
      to: "one@example.test",
      name: "<Alice>",
    } satisfies EmailMessage)
    const second = queueMessage("welcome-2", {
      type: "welcome",
      to: "two@example.test",
      name: null,
    } satisfies EmailMessage)
    await withDatabaseBinding(
      {
        RESEND_API_KEY: "key",
        RESEND_FROM: "sender@example.test",
        RESEND_WELCOME_TEMPLATE_ID: "welcome-test-template",
      },
      async () => {
        await consumeEmailBatch({ messages: [first] } as unknown as MessageBatch<unknown>)
        await consumeEmailBatch({ messages: [second] } as unknown as MessageBatch<unknown>)
      },
    )
    expect(first.acked).toBe(true)
    expect(second.retryDelay).toBe(60)
    expect(headers).toEqual(["welcome-1", "welcome-2"])
    expect(templates).toEqual([
      { id: "welcome-test-template", variables: { NAME: "&lt;Alice&gt;" } },
      { id: "welcome-test-template", variables: { NAME: "there" } },
    ])
    expect(startTimes[1]! - startTimes[0]!).toBeGreaterThanOrEqual(110)
  })
})
