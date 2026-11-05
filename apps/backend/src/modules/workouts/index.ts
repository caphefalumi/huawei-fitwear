import { Elysia, t, type Static } from "elysia"

import { DATE_KEY_PATTERN } from "../../lib/date"
import { authGuard } from "../auth/service"
import { Workouts } from "./service"

const dateKey = t.String({
  pattern: DATE_KEY_PATTERN,
  error: "date must be formatted as YYYY-MM-DD",
})
const heartRate = t.Integer({ minimum: 20, maximum: 260 })
const createBody = t.Object({
  sessionTitle: t.String({ minLength: 1 }),
  workoutSplit: t.String({ minLength: 1 }),
  startedAt: t.Optional(t.String({ format: "date-time" })),
})
const completeBody = t.Object({
  completedAt: t.Optional(t.String({ format: "date-time" })),
  avgHeartRateBpm: t.Optional(heartRate),
  maxHeartRateBpm: t.Optional(heartRate),
})
const setBody = t.Object({
  exerciseId: t.String({ minLength: 1 }),
  setIndex: t.Optional(t.Integer({ minimum: 1 })),
  weightKg: t.Number({ minimum: 0, maximum: 1000 }),
  targetReps: t.Optional(t.Integer({ minimum: 1, maximum: 100 })),
  detectedReps: t.Optional(t.Integer({ minimum: 0, maximum: 100 })),
  userConfirmedReps: t.Integer({ minimum: 0, maximum: 100 }),
  restDurationSeconds: t.Optional(t.Integer({ minimum: 0, maximum: 3600 })),
  avgHrBpm: t.Optional(heartRate),
})
const updateSetBody = t.Object({
  weightKg: t.Optional(t.Number({ minimum: 0, maximum: 1000 })),
  targetReps: t.Optional(t.Integer({ minimum: 1, maximum: 100 })),
  detectedReps: t.Optional(t.Integer({ minimum: 0, maximum: 100 })),
  userConfirmedReps: t.Optional(t.Integer({ minimum: 0, maximum: 100 })),
  restDurationSeconds: t.Optional(t.Integer({ minimum: 0, maximum: 3600 })),
  avgHrBpm: t.Optional(heartRate),
})
const listQuery = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, multipleOf: 1 })),
  offset: t.Optional(t.Numeric({ minimum: 0, multipleOf: 1 })),
})
const statsQuery = t.Object({ from: t.Optional(dateKey), to: t.Optional(dateKey) })

export type WorkoutCreateBody = Static<typeof createBody>
export type WorkoutCompleteBody = Static<typeof completeBody>
export type WorkoutSetBody = Static<typeof setBody>
export type WorkoutSetUpdateBody = Static<typeof updateSetBody>
export type WorkoutListQuery = Static<typeof listQuery>
export type WorkoutStatsQuery = Static<typeof statsQuery>

const workoutModels = new Elysia().model({
  "workouts.statsQuery": statsQuery,
  "workouts.listQuery": listQuery,
  "workouts.createBody": createBody,
  "workouts.completeBody": completeBody,
  "workouts.setBody": setBody,
  "workouts.updateSetBody": updateSetBody,
})

export const workouts = new Elysia({ prefix: "/workouts", detail: { tags: ["Workouts"] } })
  .use(authGuard)
  .use(workoutModels)
  .get("/stats", ({ user, query }) => Workouts.stats(user.id, query), {
    auth: true,
    query: "workouts.statsQuery",
  })
  .get("/", ({ user, query }) => Workouts.list(user.id, query), {
    auth: true,
    query: "workouts.listQuery",
  })
  .post("/", ({ user, body }) => Workouts.create(user.id, body), {
    auth: true,
    body: "workouts.createBody",
  })
  .get("/:sessionId", ({ user, params }) => Workouts.byId(user.id, params.sessionId), {
    auth: true,
  })
  .delete("/:sessionId", ({ user, params }) => Workouts.remove(user.id, params.sessionId), {
    auth: true,
  })
  .post(
    "/:sessionId/complete",
    ({ user, params, body }) => Workouts.complete(user.id, params.sessionId, body),
    { auth: true, body: "workouts.completeBody" },
  )
  .post(
    "/:sessionId/sets",
    ({ user, params, body }) => Workouts.addSet(user.id, params.sessionId, body),
    { auth: true, body: "workouts.setBody" },
  )
  .patch(
    "/:sessionId/sets/:setId",
    ({ user, params, body }) => Workouts.updateSet(user.id, params.sessionId, params.setId, body),
    { auth: true, body: "workouts.updateSetBody" },
  )
  .delete(
    "/:sessionId/sets/:setId",
    ({ user, params }) => Workouts.removeSet(user.id, params.sessionId, params.setId),
    { auth: true },
  )
