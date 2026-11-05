import { describe, expect, it, beforeEach, spyOn } from "bun:test"

import { user as userTable } from "../../src/db/schema"
import type { EmailMessage } from "../../src/modules/email/queue"
import { app, setTestDatabaseBinding } from "../helpers/test-app"
import { createTestDatabase } from "../helpers/test-db"
import { createTestEmailQueue } from "../helpers/test-email-queue"
import { createTestKv } from "../helpers/test-kv"

describe("Integration Test: Auth API Endpoints", () => {
  let testD1: D1Database
  let emailQueue: ReturnType<typeof createTestEmailQueue>

  beforeEach(() => {
    const { d1 } = createTestDatabase()
    testD1 = d1
    emailQueue = createTestEmailQueue()
    setTestDatabaseBinding({ DB: d1, fitwear_kv: createTestKv(), EMAIL_QUEUE: emailQueue.queue })
  })

  describe("POST /auth/sign-up", () => {
    it("should register a new user, hash password, and issue a session", async () => {
      const payload = {
        email: "jordan@fitwear.dev",
        password: "SecurePassword123!",
        name: "Jordan Smith",
        heightCm: 180,
        currentWeightKg: 80,
        targetWeightKg: 75,
        activityLevel: "moderately_active",
        fitnessGoal: "weight_loss",
      }

      const res = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      )

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe("jordan@fitwear.dev")
      expect(data.user.name).toBe("Jordan Smith")
      expect(data.user.heightCm).toBe(180)
      expect(data.session).toBeDefined()
      expect(data.session.token).toBeString()
      expect(emailQueue.messages).toEqual([
        { type: "welcome", to: "jordan@fitwear.dev", name: "Jordan Smith" },
      ])

      const setCookie = res.headers.get("set-cookie")
      expect(setCookie).toContain("session_token=")
    })

    it("should reject sign-up with duplicate email", async () => {
      const payload = {
        email: "duplicate@fitwear.dev",
        password: "Password123!",
      }

      const res1 = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      )
      expect(res1.status).toBe(200)

      const res2 = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      )
      expect(res2.status).toBe(400)

      const err = await res2.json()
      expect(err.message).toBe("A user with this email address already exists")
      expect(emailQueue.messages).toHaveLength(1)
    })

    it("keeps successful signup when welcome queue publication fails", async () => {
      setTestDatabaseBinding({
        DB: testD1,
        fitwear_kv: createTestKv(),
        EMAIL_QUEUE: {
          send: async () => {
            throw new Error("queue unavailable")
          },
        } as unknown as Queue<EmailMessage>,
      })
      const response = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "queue-failure@fitwear.dev",
            password: "SecurePassword123!",
          }),
        }),
      )
      expect(response.status).toBe(200)
      expect(
        await testD1
          .prepare("SELECT id FROM user WHERE email = ?")
          .bind("queue-failure@fitwear.dev")
          .first(),
      ).not.toBeNull()
    })

    it("should reject duplicate when user already exists in D1", async () => {
      const { d1, db } = createTestDatabase()
      setTestDatabaseBinding({ DB: d1, fitwear_kv: createTestKv() })

      await db.insert(userTable).values({
        id: "legacy-user",
        email: "legacy-only@fitwear.dev",
        password: "hash",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const res = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "legacy-only@fitwear.dev",
            password: "Password123!",
          }),
        }),
      )

      expect(res.status).toBe(400)
      const err = await res.json()
      expect(err.message).toBe("A user with this email address already exists")
    })

    it("should reject invalid email format with 422", async () => {
      const res = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "not-valid", password: "Password123!" }),
        }),
      )
      expect(res.status).toBe(422)
    })
  })

  describe("auth rate limits", () => {
    it("returns 429 with Retry-After when sign-in bucket is exhausted", async () => {
      // Keep bucket refill deterministic while real cost-12 bcrypt work runs.
      const clock = spyOn(Date, "now").mockReturnValue(Date.now())
      try {
        const body = JSON.stringify({
          email: "unknown@fitwear.dev",
          password: "Password123!",
        })
        const headers = {
          "Content-Type": "application/json",
          "cf-connecting-ip": "203.0.113.50",
        }
        for (let i = 0; i < 20; i++) {
          await app.handle(
            new Request("http://localhost/auth/sign-in", { method: "POST", headers, body }),
          )
        }
        const res = await app.handle(
          new Request("http://localhost/auth/sign-in", { method: "POST", headers, body }),
        )
        expect(res.status).toBe(429)
        const retryAfter = res.headers.get("Retry-After")
        expect(retryAfter).not.toBeNull()
        const retryAfterSec = Number(retryAfter)
        expect(retryAfterSec).toBeGreaterThan(0)
        const err = await res.json()
        expect(err.retryAfterSec).toBe(retryAfterSec)
      } finally {
        clock.mockRestore()
      }
    }, 20_000)
  })

  describe("POST /auth/sign-in", () => {
    beforeEach(async () => {
      await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "member@fitwear.dev",
            password: "CorrectPassword123!",
            name: "Member User",
          }),
        }),
      )
    })

    it("should authenticate user with valid credentials", async () => {
      const res = await app.handle(
        new Request("http://localhost/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "member@fitwear.dev",
            password: "CorrectPassword123!",
          }),
        }),
      )

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.user.email).toBe("member@fitwear.dev")
      expect(data.session.token).toBeString()

      const setCookie = res.headers.get("set-cookie")
      expect(setCookie).toContain("session_token=")
    })

    it("does not distinguish unknown users from incorrect passwords or issue sessions", async () => {
      const sessionsBefore = await testD1.prepare("SELECT COUNT(*) AS total FROM session").first()
      const bodies = []
      for (const email of ["member@fitwear.dev", "unknown@fitwear.dev"]) {
        const response = await app.handle(
          new Request("http://localhost/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: "WrongPassword!" }),
          }),
        )
        expect(response.status).toBe(401)
        expect(response.headers.get("set-cookie")).toBeNull()
        bodies.push(await response.json())
      }
      expect(bodies[0]).toEqual(bodies[1])
      expect(await testD1.prepare("SELECT COUNT(*) AS total FROM session").first()).toEqual(
        sessionsBefore,
      )
    })
    it("throttles sign-in guesses by account across different IP addresses", async () => {
      const clock = spyOn(Date, "now").mockReturnValue(Date.now())
      try {
        for (let attempt = 0; attempt < 10; attempt++) {
          const response = await app.handle(
            new Request("http://localhost/auth/sign-in", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "cf-connecting-ip": `203.0.113.${attempt + 1}`,
              },
              body: JSON.stringify({ email: "target@fitwear.dev", password: "WrongPassword123!" }),
            }),
          )
          expect(response.status).toBe(401)
        }
        const limited = await app.handle(
          new Request("http://localhost/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json", "cf-connecting-ip": "203.0.113.99" },
            body: JSON.stringify({ email: "target@fitwear.dev", password: "WrongPassword123!" }),
          }),
        )
        expect(limited.status).toBe(429)
      } finally {
        clock.mockRestore()
      }
    }, 20_000)

    it("should sign in when user was inserted directly into D1", async () => {
      const password = "LegacyLogin123!"
      const { d1, db } = createTestDatabase()
      setTestDatabaseBinding({ DB: d1, fitwear_kv: createTestKv() })

      await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "first@fitwear.dev",
            password: "OtherPassword123!",
          }),
        }),
      )

      await db.insert(userTable).values({
        id: "legacy-signin",
        email: "legacy-signin@fitwear.dev",
        password: await Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 }),
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const res = await app.handle(
        new Request("http://localhost/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "legacy-signin@fitwear.dev",
            password,
          }),
        }),
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.email).toBe("legacy-signin@fitwear.dev")
      const updatedHash = await d1
        .prepare("SELECT password FROM user WHERE id = ?")
        .bind("legacy-signin")
        .first<{ password: string }>()
      expect(updatedHash?.password.slice(4, 6)).toBe("12")
    })
  })

  describe("Protected Routes: /auth/session, /auth/update-user, /auth/sign-out", () => {
    let sessionToken: string

    beforeEach(async () => {
      const res = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "active@fitwear.dev",
            password: "ActivePassword123!",
            name: "Active Member",
          }),
        }),
      )
      const data = await res.json()
      sessionToken = data.session.token
    })

    it("GET /auth/session should return active user when using Bearer auth", async () => {
      const res = await app.handle(
        new Request("http://localhost/auth/session", {
          headers: { Authorization: `Bearer ${sessionToken}` },
        }),
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.email).toBe("active@fitwear.dev")
      expect(data.session.token).toBe(sessionToken)
    })

    it("GET /auth/session should return active user when using session_token cookie", async () => {
      const res = await app.handle(
        new Request("http://localhost/auth/session", {
          headers: { Cookie: `session_token=${sessionToken}` },
        }),
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.email).toBe("active@fitwear.dev")
    })

    it("GET /auth/session should return 401 when no token is provided", async () => {
      const res = await app.handle(new Request("http://localhost/auth/session"))
      expect(res.status).toBe(401)
    })

    it("PUT /auth/update-user should update biometrics", async () => {
      const res = await app.handle(
        new Request("http://localhost/auth/update-user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            currentWeightKg: 78.5,
            targetWeightKg: 72.0,
            fitnessGoal: "weight_loss",
          }),
        }),
      )

      expect(res.status).toBe(200)
      const updated = await res.json()
      expect(updated.currentWeightKg).toBe(78.5)
      expect(updated.targetWeightKg).toBe(72.0)
      expect(updated.fitnessGoal).toBe("weight_loss")
    })

    it("POST /auth/sign-out should revoke session and block subsequent access", async () => {
      const signOutRes = await app.handle(
        new Request("http://localhost/auth/sign-out", {
          method: "POST",
          headers: { Authorization: `Bearer ${sessionToken}` },
        }),
      )
      expect(signOutRes.status).toBe(200)

      const checkRes = await app.handle(
        new Request("http://localhost/auth/session", {
          headers: { Authorization: `Bearer ${sessionToken}` },
        }),
      )
      expect(checkRes.status).toBe(401)
    })

    it("DELETE /auth/account should delete user account and revoke access", async () => {
      // First sign up a dedicated user to delete
      const userEmail = "to_delete@example.com"
      const signUpRes = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            password: "SecurePassword123!",
            name: "Delete Me",
          }),
        }),
      )
      expect(signUpRes.status).toBe(200)
      const { session } = await signUpRes.json()

      const deleteRes = await app.handle(
        new Request("http://localhost/auth/account", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.token}` },
        }),
      )
      expect(deleteRes.status).toBe(200)
      const body = await deleteRes.json()
      expect(body.success).toBe(true)

      // Session should no longer be valid
      const sessionRes = await app.handle(
        new Request("http://localhost/auth/session", {
          headers: { Authorization: `Bearer ${session.token}` },
        }),
      )
      expect(sessionRes.status).toBe(401)

      // User should no longer exist and re-registration with same email should now succeed
      const reSignUpRes = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            password: "SecurePassword123!",
            name: "Delete Me Again",
          }),
        }),
      )
      expect(reSignUpRes.status).toBe(200)
    })

    it("DELETE /auth/account should remove the user's private meal photos", async () => {
      const signUpRes = await app.handle(
        new Request("http://localhost/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "photos_to_delete@example.com",
            password: "SecurePassword123!",
            name: "Delete My Photos",
          }),
        }),
      )
      expect(signUpRes.status).toBe(200)
      const { user, session } = await signUpRes.json()

      const deletedKeys: string[] = []
      const bucket = {
        list: async ({ prefix }: { prefix?: string }) => ({
          objects: [{ key: `${prefix}meal_1` }, { key: `${prefix}meal_2` }],
          truncated: false,
        }),
        delete: async (keys: string | string[]) => {
          deletedKeys.push(...(Array.isArray(keys) ? keys : [keys]))
        },
      } as unknown as R2Bucket
      setTestDatabaseBinding({ DB: testD1, fitwear_kv: createTestKv(), MEAL_IMAGES: bucket })

      const deleteRes = await app.handle(
        new Request("http://localhost/auth/account", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.token}` },
        }),
      )
      expect(deleteRes.status).toBe(200)
      expect(deletedKeys).toEqual([`${user.id}/meal_1`, `${user.id}/meal_2`])
    })
  })
})
