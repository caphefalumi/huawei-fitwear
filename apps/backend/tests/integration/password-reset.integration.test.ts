import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { like } from "drizzle-orm"
import { app, setTestDatabaseBinding } from "../helpers/test-app"
import { createTestDatabase } from "../helpers/test-db"
import { createTestKv } from "../helpers/test-kv"
import type { Database } from "../../src/db"
import { consumeEmailBatch } from "../../src/modules/email/queue"
import { createTestEmailQueue } from "../helpers/test-email-queue"
import type { EmailMessage } from "../../src/modules/email/queue"
import { withDatabaseBinding } from "../../src/db"
import { verification } from "../../src/db/schema"
import { requestPasswordReset } from "../../src/modules/auth/password-reset"
import { takePasswordResetEmailSlot } from "../../src/modules/auth/rate-limit"
const originalFetch = globalThis.fetch
let db: Database
let d1: D1Database
let queued: ReturnType<typeof createTestEmailQueue>
let lastEmail:
  | { from: string; to: string[]; template: { id: string; variables: Record<string, string> } }
  | undefined
function post(path: string, body: unknown, ip = "203.0.113.70") {
  return app.handle(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "cf-connecting-ip": ip },
      body: JSON.stringify(body),
    }),
  )
}

async function createAccount(email = "reset@fitwear.dev") {
  const response = await post("/auth/sign-up", {
    email,
    password: "OriginalPassword123!",
    name: "Reset User",
  })
  expect(response.status).toBe(200)
  return (await response.json()) as { session: { token: string } }
}

async function requestReset(email: string, ip?: string) {
  return post("/auth/password-reset", { email }, ip)
}

async function getResetCode(email: string) {
  await requestReset(email)
  const body = queued.messages.findLast((message) => message.type === "password-reset")
  expect(body?.type).toBe("password-reset")
  if (body?.type !== "password-reset") throw new Error("Expected reset queue message.")
  expect(body.otp).toMatch(/^\d{4}$/)
  return body.otp
}

describe("Password reset integration", () => {
  beforeEach(() => {
    const fixture = createTestDatabase()
    d1 = fixture.d1
    db = fixture.db
    queued = createTestEmailQueue()
    lastEmail = undefined
    setTestDatabaseBinding({
      DB: fixture.d1,
      fitwear_kv: createTestKv(),
      EMAIL_QUEUE: queued.queue,
      RESEND_API_KEY: "test-resend-key",
      RESEND_FROM: "VoocHealth <support@example.test>",
      RESEND_PASSWORD_RESET_TEMPLATE_ID: "reset-template-test",
    })
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-resend-key")
      expect(new Headers(init?.headers).get("Idempotency-Key")).toBe("queue-message-reset")
      lastEmail = JSON.parse(String(init?.body)) as {
        from: string
        to: string[]
        template: { id: string; variables: Record<string, string> }
      }
      return Response.json({ id: "email-test-id" })
    }) as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it("rejects malformed OTP verification codes", async () => {
    for (const code of ["123", "12345"]) {
      const response = await post("/auth/password-reset/verify", {
        email: "reset@fitwear.dev",
        code,
      })
      expect(response.status).toBe(422)
    }
  })

  it("applies staged resend delays by normalized address", async () => {
    const kv = createTestKv()
    const email = "person@example.test"
    const firstSentAt = 1_000
    const sent = async (at: number, expected: number) =>
      expect(await takePasswordResetEmailSlot(kv, email, at)).toEqual({
        allowed: true,
        retryAfterSeconds: expected,
      })
    const blocked = async (at: number) =>
      expect(await takePasswordResetEmailSlot(kv, email.toUpperCase(), at)).toEqual({
        allowed: false,
        retryAfterSeconds: 1,
      })

    await sent(firstSentAt, 30)
    await blocked(firstSentAt + 29_999)
    await sent(firstSentAt + 30_000, 60)
    await blocked(firstSentAt + 89_999)
    await sent(firstSentAt + 90_000, 180)
    await blocked(firstSentAt + 269_999)
    await sent(firstSentAt + 270_000, 300)
    await blocked(firstSentAt + 569_999)
    await sent(firstSentAt + 570_000, 600)
    await blocked(firstSentAt + 1_169_999)
    await sent(firstSentAt + 1_170_000, 600)
  })

  it("returns the same response for known and unknown addresses and queues only for the account owner", async () => {
    await createAccount()
    const unknown = await requestReset("absent@fitwear.dev")
    const unknownBody = await unknown.json()
    expect(unknownBody.success).toBe(true)
    expect(typeof unknownBody.message).toBe("string")
    expect(unknownBody.resendAfterSeconds).toBe(30)
    expect(unknown.status).toBe(200)
    expect(queued.messages).toHaveLength(1)

    const known = await requestReset("RESET@fitwear.dev")
    expect(known.status).toBe(200)
    const knownBody = await known.json()
    expect(knownBody.message).toEqual(unknownBody.message)
    expect(knownBody.resendAfterSeconds).toBeGreaterThan(0)
    expect(knownBody.resendAfterSeconds).toBeLessThanOrEqual(30)
    expect(queued.messages).toHaveLength(2)
    const resetMessage = queued.messages[1]
    expect(resetMessage).toMatchObject({ type: "password-reset", to: "reset@fitwear.dev" })
    if (resetMessage.type !== "password-reset") throw new Error("Expected reset queue message.")
    const code = resetMessage.otp
    const batchMessage = {
      id: "queue-message-reset",
      body: resetMessage,
      attempts: 1,
      ack: () => {},
      retry: () => {},
    }
    await withDatabaseBinding(
      {
        RESEND_API_KEY: "test-resend-key",
        RESEND_FROM: "VoocHealth <support@example.test>",
        RESEND_PASSWORD_RESET_TEMPLATE_ID: "reset-template-test",
      },
      () => consumeEmailBatch({ messages: [batchMessage] } as unknown as MessageBatch<unknown>),
    )
    expect(lastEmail?.from).toBe("VoocHealth <support@example.test>")
    expect(lastEmail?.template.id).toBe("reset-template-test")
    expect(lastEmail?.template.variables.RESET_OTP).toBe(code)
    expect(Object.keys(lastEmail?.template.variables ?? {})).toEqual(["RESET_OTP"])
    const stored = await db
      .select({ value: verification.value })
      .from(verification)
      .where(like(verification.identifier, "password-reset:%"))
      .get()
    expect(stored?.value).not.toBe(code)
  })
  it("returns the same generic response while an address is in resend cooldown", async () => {
    await createAccount()
    const first = await requestReset("reset@fitwear.dev")
    const firstBody = await first.json()
    expect(first.status).toBe(200)
    expect(queued.messages.filter((message) => message.type === "password-reset")).toHaveLength(1)

    const resend = await requestReset("reset@fitwear.dev")
    expect(resend.status).toBe(200)
    expect(await resend.json()).toEqual(firstBody)
    expect(queued.messages.filter((message) => message.type === "password-reset")).toHaveLength(1)
  })

  it("exchanges an OTP for a hashed one-time token, resets the password, and revokes sessions", async () => {
    const { session: signedUpSession } = await createAccount()
    const secondLogin = await post("/auth/sign-in", {
      email: "reset@fitwear.dev",
      password: "OriginalPassword123!",
    })
    const secondSessionToken = ((await secondLogin.json()) as { session: { token: string } })
      .session.token
    const code = await getResetCode("reset@fitwear.dev")

    const verificationResponse = await post("/auth/password-reset/verify", {
      email: "reset@fitwear.dev",
      code,
    })
    expect(verificationResponse.status).toBe(200)
    const { resetToken } = (await verificationResponse.json()) as { resetToken: string }
    expect(resetToken).toBeTruthy()

    const storedReset = await db
      .select({ identifier: verification.identifier, value: verification.value })
      .from(verification)
      .where(like(verification.identifier, "password-reset-token:%"))
      .get()
    expect(storedReset?.identifier).toMatch(/^password-reset-token:/)
    expect(storedReset?.value).not.toBe(resetToken)
    expect(
      await db
        .select({ id: verification.id })
        .from(verification)
        .where(like(verification.identifier, "password-reset:%"))
        .all(),
    ).toHaveLength(0)

    const replayedCode = await post("/auth/password-reset/verify", {
      email: "reset@fitwear.dev",
      code,
    })
    expect(replayedCode.status).toBe(400)

    const reset = await post("/auth/reset-password", {
      resetToken,
      password: "ReplacementPassword123!",
    })
    expect(reset.status).toBe(200)
    expect((await reset.json()).message).toBe("Password updated. You can now sign in.")
    expect(
      (
        await post("/auth/sign-in", {
          email: "reset@fitwear.dev",
          password: "OriginalPassword123!",
        })
      ).status,
    ).toBe(401)
    expect(
      (
        await post("/auth/sign-in", {
          email: "reset@fitwear.dev",
          password: "ReplacementPassword123!",
        })
      ).status,
    ).toBe(200)
    for (const token of [signedUpSession.token, secondSessionToken]) {
      const oldSession = await app.handle(
        new Request("http://localhost/auth/session", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      )
      expect(oldSession.status).toBe(401)
    }
    expect(
      (await post("/auth/reset-password", { resetToken, password: "ThirdPassword123!" })).status,
    ).toBe(400)
    expect(
      (
        await post("/auth/reset-password", {
          email: "reset@fitwear.dev",
          code,
          password: "ThirdPassword123!",
        })
      ).status,
    ).toBe(422)
  })

  it("removes the reset code record when queue publication fails", async () => {
    await createAccount()
    setTestDatabaseBinding({
      DB: d1,
      EMAIL_QUEUE: {
        send: async () => {
          throw new Error("queue unavailable")
        },
      } as unknown as Queue<EmailMessage>,
      RESEND_API_KEY: "test-resend-key",
      RESEND_FROM: "VoocHealth <support@example.test>",
      RESEND_PASSWORD_RESET_TEMPLATE_ID: "reset-template-test",
    })
    const response = await requestReset("reset@fitwear.dev")
    expect(response.status).toBe(200)
    expect(
      await db
        .select({ id: verification.id })
        .from(verification)
        .where(like(verification.identifier, "password-reset:%"))
        .all(),
    ).toHaveLength(0)
  })

  it("preserves the existing reset code when replacement insertion fails", async () => {
    await createAccount()
    const existingCode = await getResetCode("reset@fitwear.dev")
    await d1.exec(`
      CREATE TRIGGER reject_reset_replacement
      BEFORE INSERT ON verification
      WHEN NEW.identifier LIKE 'password-reset:%'
      BEGIN
        SELECT RAISE(ABORT, 'forced reset insert failure');
      END;
    `)

    await expect(
      withDatabaseBinding(
        {
          DB: d1,
          fitwear_kv: createTestKv(),
          EMAIL_QUEUE: queued.queue,
          RESEND_API_KEY: "test-resend-key",
          RESEND_FROM: "VoocHealth <support@example.test>",
          RESEND_PASSWORD_RESET_TEMPLATE_ID: "reset-template-test",
        },
        () => requestPasswordReset("reset@fitwear.dev"),
      ),
    ).rejects.toThrow()

    const response = await post("/auth/password-reset/verify", {
      email: "reset@fitwear.dev",
      code: existingCode,
    })
    expect(response.status).toBe(200)
  })

  it("rejects expired OTPs before issuing a reset token", async () => {
    await createAccount()
    const code = await getResetCode("reset@fitwear.dev")
    await db
      .update(verification)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(like(verification.identifier, "password-reset:%"))
      .run()
    const response = await post("/auth/password-reset/verify", {
      email: "reset@fitwear.dev",
      code,
    })
    expect(response.status).toBe(400)
    expect(
      await db
        .select({ id: verification.id })
        .from(verification)
        .where(like(verification.identifier, "password-reset-token:%"))
        .all(),
    ).toHaveLength(0)
  })
  it("rejects wrong and expired reset tokens", async () => {
    await createAccount()
    const code = await getResetCode("reset@fitwear.dev")
    const verified = await post("/auth/password-reset/verify", {
      email: "reset@fitwear.dev",
      code,
    })
    const { resetToken } = (await verified.json()) as { resetToken: string }
    expect(
      (
        await post("/auth/reset-password", {
          resetToken: "wrong-token",
          password: "ReplacementPassword123!",
        })
      ).status,
    ).toBe(400)

    await db
      .update(verification)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(like(verification.identifier, "password-reset-token:%"))
      .run()
    expect(
      (await post("/auth/reset-password", { resetToken, password: "ReplacementPassword123!" }))
        .status,
    ).toBe(400)
  })

  it("a newly issued OTP invalidates outstanding reset tokens", async () => {
    await createAccount()
    const code = await getResetCode("reset@fitwear.dev")
    const verified = await post("/auth/password-reset/verify", {
      email: "reset@fitwear.dev",
      code,
    })
    const { resetToken } = (await verified.json()) as { resetToken: string }

    await withDatabaseBinding(
      {
        DB: d1,
        fitwear_kv: createTestKv(),
        EMAIL_QUEUE: queued.queue,
        RESEND_API_KEY: "test-resend-key",
        RESEND_FROM: "VoocHealth <support@example.test>",
        RESEND_PASSWORD_RESET_TEMPLATE_ID: "reset-template-test",
      },
      () => requestPasswordReset("reset@fitwear.dev"),
    )
    expect(
      await db
        .select({ id: verification.id })
        .from(verification)
        .where(like(verification.identifier, "password-reset-token:%"))
        .all(),
    ).toHaveLength(0)
    expect(
      (await post("/auth/reset-password", { resetToken, password: "ReplacementPassword123!" }))
        .status,
    ).toBe(400)
  })

  it("rate-limits failed OTP verification attempts", async () => {
    await createAccount()
    const code = await getResetCode("reset@fitwear.dev")
    const incorrectCode = `${code[0] === "9" ? "8" : "9"}${code.slice(1)}`
    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await post(
        "/auth/password-reset/verify",
        { email: "reset@fitwear.dev", code: incorrectCode },
        "203.0.113.78",
      )
      expect(response.status).toBe(400)
    }
    const limited = await post(
      "/auth/password-reset/verify",
      { email: "reset@fitwear.dev", code: incorrectCode },
      "203.0.113.78",
    )
    expect(limited.status).toBe(429)
    expect(limited.headers.get("Retry-After")).not.toBeNull()
  })

  it("requires email configuration and rate-limits reset requests", async () => {
    const limiter = createTestDatabase()
    setTestDatabaseBinding({ DB: limiter.d1, fitwear_kv: createTestKv() })
    const unavailable = await requestReset("absent@fitwear.dev")
    expect(unavailable.status).toBe(503)

    setTestDatabaseBinding({
      DB: limiter.d1,
      fitwear_kv: createTestKv(),
      EMAIL_QUEUE: queued.queue,
      RESEND_API_KEY: "test-resend-key",
      RESEND_FROM: "VoocHealth <support@example.test>",
      RESEND_PASSWORD_RESET_TEMPLATE_ID: "reset-template-test",
    })
    for (let index = 0; index < 5; index++) await requestReset("absent@fitwear.dev", "203.0.113.71")
    const limited = await requestReset("absent@fitwear.dev", "203.0.113.71")
    expect(limited.status).toBe(429)
    expect(limited.headers.get("Retry-After")).not.toBeNull()
  })
})
