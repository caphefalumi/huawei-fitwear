import { Elysia, t, type Static } from "elysia"

import {
  InvalidPasswordResetToken,
  isPasswordResetConfigured,
  passwordResetMessage,
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetCode,
} from "./password-reset"
import { assertAuthRateLimit, canSendPasswordResetEmail } from "./rate-limit"
import { Auth, authGuard } from "./service"

export const AuthSchemas = {
  signUpBody: t.Object({
    email: t.String({ format: "email", error: "Valid email is required" }),
    password: t.String({
      minLength: 8,
      maxLength: 72,
      error: "Password must be at least 8 characters and no more than 72 characters",
    }),
    name: t.Optional(t.String()),
    gender: t.Optional(t.Union([t.Literal("male"), t.Literal("female"), t.Literal("other")])),
    birthDate: t.Optional(t.String()),
    heightCm: t.Optional(t.Number({ minimum: 0 })),
    currentWeightKg: t.Optional(t.Number({ minimum: 0 })),
    targetWeightKg: t.Optional(t.Number({ minimum: 0 })),
    activityLevel: t.Optional(
      t.Union([
        t.Literal("sedentary"),
        t.Literal("lightly_active"),
        t.Literal("moderately_active"),
        t.Literal("very_active"),
        t.Literal("extra_active"),
      ]),
    ),
    fitnessGoal: t.Optional(
      t.Union([t.Literal("weight_loss"), t.Literal("maintenance"), t.Literal("muscle_gain")]),
    ),
    weeklySessions: t.Optional(t.Integer({ minimum: 1, maximum: 7 })),
  }),
  signInBody: t.Object({
    email: t.String({ format: "email", error: "Valid email is required" }),
    password: t.String({ minLength: 1, error: "Password is required" }),
  }),
  passwordResetRequestBody: t.Object({
    email: t.String({ format: "email", error: "Valid email is required" }),
  }),
  passwordResetVerifyBody: t.Object({
    email: t.String({ format: "email", error: "Valid email is required" }),
    code: t.String({ minLength: 4, maxLength: 4, pattern: "^[0-9]{4}$" }),
  }),
  passwordResetBody: t.Object({
    resetToken: t.String({ minLength: 1 }),
    password: t.String({
      minLength: 8,
      maxLength: 72,
      error: "Password must be at least 8 characters and no more than 72 characters",
    }),
  }),
  updateUserBody: t.Object({
    name: t.Optional(t.String()),
    gender: t.Optional(t.Union([t.Literal("male"), t.Literal("female"), t.Literal("other")])),
    birthDate: t.Optional(t.String()),
    heightCm: t.Optional(t.Number({ minimum: 0 })),
    currentWeightKg: t.Optional(t.Number({ minimum: 0 })),
    targetWeightKg: t.Optional(t.Number({ minimum: 0 })),
    activityLevel: t.Optional(
      t.Union([
        t.Literal("sedentary"),
        t.Literal("lightly_active"),
        t.Literal("moderately_active"),
        t.Literal("very_active"),
        t.Literal("extra_active"),
      ]),
    ),
    fitnessGoal: t.Optional(
      t.Union([t.Literal("weight_loss"), t.Literal("maintenance"), t.Literal("muscle_gain")]),
    ),
    weeklySessions: t.Optional(t.Integer({ minimum: 1, maximum: 7 })),
  }),
} as const

export type SignUpBody = Static<typeof AuthSchemas.signUpBody>
export type SignInBody = Static<typeof AuthSchemas.signInBody>
export type PasswordResetRequestBody = Static<typeof AuthSchemas.passwordResetRequestBody>
export type PasswordResetVerifyBody = Static<typeof AuthSchemas.passwordResetVerifyBody>
export type PasswordResetBody = Static<typeof AuthSchemas.passwordResetBody>
export type UpdateUserBody = Static<typeof AuthSchemas.updateUserBody>

const authModels = new Elysia().model({
  "auth.signUpBody": AuthSchemas.signUpBody,
  "auth.signInBody": AuthSchemas.signInBody,
  "auth.passwordResetRequestBody": AuthSchemas.passwordResetRequestBody,
  "auth.passwordResetVerifyBody": AuthSchemas.passwordResetVerifyBody,
  "auth.passwordResetBody": AuthSchemas.passwordResetBody,
  "auth.updateUserBody": AuthSchemas.updateUserBody,
})
export const auth = new Elysia({
  prefix: "/auth",
  detail: { tags: ["Authentication"] },
})
  .use(authModels)
  .use(authGuard)
  .post(
    "/sign-up",
    async ({ body, cookie: { session_token } }) => {
      const res = await Auth.signUp(body)
      session_token.set({
        value: res.session.token,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      })
      return res
    },
    {
      beforeHandle: ({ request, body, set }) =>
        assertAuthRateLimit(request, "sign-up", set, body.email),
      body: "auth.signUpBody",
      detail: {
        summary: "Register a new user account",
        description:
          "Creates user, hashes password with Web Crypto PBKDF2-HMAC-SHA256, and issues a 30-day session token.",
      },
    },
  )
  .post(
    "/sign-in",
    async ({ body, cookie: { session_token } }) => {
      const res = await Auth.signIn(body)
      session_token.set({
        value: res.session.token,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      })
      return res
    },
    {
      beforeHandle: ({ request, body, set }) =>
        assertAuthRateLimit(request, "sign-in", set, body.email),
      body: "auth.signInBody",
      detail: {
        summary: "Sign in with credentials",
        description: "Verifies email/password and returns a session token.",
      },
    },
  )
  .post(
    "/password-reset",
    async ({ body, set }) => {
      if (!isPasswordResetConfigured()) {
        set.status = 503
        return { success: false, message: "Password reset email is not configured." }
      }
      let resendAfterSeconds = 30
      try {
        const slot = await canSendPasswordResetEmail(body.email)
        resendAfterSeconds = slot.retryAfterSeconds
        if (slot.dailyLimitReached) {
          set.status = 429
          set.headers["Retry-After"] = String(resendAfterSeconds)
          return {
            success: false,
            message: "Too many requests. Try again later.",
            resendAfterSeconds,
          }
        }
        if (slot.allowed) {
          await requestPasswordReset(body.email)
        }
      } catch {
        console.error("Password reset email request failed.")
      }
      return { success: true, message: passwordResetMessage, resendAfterSeconds }
    },
    {
      beforeHandle: ({ request, set }) => assertAuthRateLimit(request, "password-reset", set),
      body: "auth.passwordResetRequestBody",
      detail: {
        summary: "Request a password reset email",
        description: "Returns the same response whether the email is registered or not.",
      },
    },
  )
  .post(
    "/password-reset/verify",
    async ({ body, set }) => {
      try {
        return await verifyPasswordResetCode(body)
      } catch (error) {
        set.status =
          error instanceof InvalidPasswordResetToken ? 400 : error instanceof RangeError ? 422 : 500
        return {
          success: false,
          message:
            error instanceof InvalidPasswordResetToken
              ? "This reset code is invalid or expired."
              : "Unable to verify the reset code. Please try again.",
        }
      }
    },
    {
      beforeHandle: ({ request, body, set }) =>
        assertAuthRateLimit(request, "password-reset-confirm", set, body.email),
      body: "auth.passwordResetVerifyBody",
      detail: { summary: "Verify a four-digit password reset code" },
    },
  )
  .post(
    "/reset-password",
    async ({ body, set }) => {
      try {
        await resetPassword(body)
        return { success: true, message: "Password updated. You can now sign in." }
      } catch (error) {
        set.status =
          error instanceof InvalidPasswordResetToken ? 400 : error instanceof RangeError ? 422 : 500
        return {
          success: false,
          message:
            error instanceof InvalidPasswordResetToken
              ? "This reset token is invalid or expired."
              : error instanceof RangeError
                ? "Password must not exceed 72 UTF-8 bytes."
                : "Unable to update your password. Please try again.",
        }
      }
    },
    {
      beforeHandle: ({ request, set }) =>
        assertAuthRateLimit(request, "password-reset-confirm", set),
      body: "auth.passwordResetBody",
      detail: { summary: "Set a new password with a short-lived reset token" },
    },
  )
  .get(
    "/session",
    ({ user, session }) => ({
      user,
      session: {
        id: session.id,
        token: session.token,
        expiresAt: new Date(session.expiresAt).toISOString(),
        userId: session.userId,
      },
    }),
    {
      auth: true,
      detail: {
        summary: "Get active session details",
      },
    },
  )
  .put("/update-user", async ({ user, body }) => Auth.updateUser(user.id, body), {
    auth: true,
    body: "auth.updateUserBody",
    detail: {
      summary: "Update user profile & biometrics",
    },
  })
  .post(
    "/sign-out",
    async ({ token, cookie: { session_token } }) => {
      await Auth.signOut(token)
      delete session_token.value
      return { success: true, message: "Signed out successfully" }
    },
    {
      auth: true,
      detail: {
        summary: "Sign out active session",
        description: "Revokes the active session token in the database and clears the cookie.",
      },
    },
  )
  .delete(
    "/account",
    async ({ user, cookie: { session_token } }) => {
      await Auth.deleteAccount(user.id)
      delete session_token.value
      return { success: true, message: "Account deleted successfully" }
    },
    {
      auth: true,
      detail: {
        summary: "Delete authenticated user account",
        description:
          "Deletes private photos before cascading user data and sessions. Interrupted cleanup stays pending and can be retried.",
      },
    },
  )
