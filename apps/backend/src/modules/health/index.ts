import { Elysia, t, type Static } from "elysia"
import { authGuard } from "../auth/service"
import { DATE_KEY_PATTERN } from "../../lib/date"
import { Health } from "./service"

const dateKey = t.String({ pattern: DATE_KEY_PATTERN })
const weightsQuery = t.Object({ from: t.Optional(dateKey), to: t.Optional(dateKey) })
const weightBody = t.Object({
  weightKg: t.Number({ minimum: 20, maximum: 500 }),
  date: t.Optional(dateKey),
})
const recoveryBody = t.Object({
  area: t.String({ minLength: 1, maxLength: 100 }),
  note: t.Optional(t.String({ maxLength: 2000 })),
  restDays: t.Integer({ minimum: 0, maximum: 365 }),
  lightDays: t.Integer({ minimum: 0, maximum: 365 }),
  startDate: dateKey,
})

const healthModel = new Elysia().model({
  "health.weightsQuery": weightsQuery,
  "health.weightBody": weightBody,
  "health.recoveryBody": recoveryBody,
})

export type WeightsQuery = Static<typeof weightsQuery>
export type WeightBody = Static<typeof weightBody>
export type RecoveryBody = Static<typeof recoveryBody>

export const health = new Elysia({ prefix: "/health", detail: { tags: ["Health"] } })
  .use(authGuard)
  .use(healthModel)
  .get("/weights", ({ user, query }) => Health.weights(user.id, query), {
    auth: true,
    query: "health.weightsQuery",
  })
  .put("/weight", ({ user, body }) => Health.putWeight(user.id, body), {
    auth: true,
    body: "health.weightBody",
  })
  .get("/recovery", ({ user }) => Health.recovery(user.id), { auth: true })
  .put("/recovery", ({ user, body }) => Health.putRecovery(user.id, body), {
    auth: true,
    body: "health.recoveryBody",
  })
  .delete("/recovery", ({ user }) => Health.removeRecovery(user.id), { auth: true })
