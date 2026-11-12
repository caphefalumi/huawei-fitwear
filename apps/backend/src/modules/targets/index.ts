import { Elysia, t, type Static } from "elysia"

import { toDateKey, DATE_KEY_PATTERN } from "../../lib/date"
import { authGuard } from "../auth/service"
import { Targets } from "./service"

const dateKey = t.String({
  pattern: DATE_KEY_PATTERN,
  error: "date must be formatted as YYYY-MM-DD",
})
const dateQuery = t.Object({ date: t.Optional(dateKey) })
const upsertBody = t.Object({
  date: t.Optional(dateKey),
  calorieTargetKcal: t.Integer({ minimum: 500, maximum: 10000 }),
  proteinTargetG: t.Number({ minimum: 0, maximum: 1000 }),
  carbsTargetG: t.Number({ minimum: 0, maximum: 2000 }),
  fatTargetG: t.Number({ minimum: 0, maximum: 1000 }),
})

const targetsModel = new Elysia().model({
  "targets.dateQuery": dateQuery,
  "targets.upsertBody": upsertBody,
})

export type TargetDateQuery = Static<typeof dateQuery>
export type TargetUpsertBody = Static<typeof upsertBody>

export const targets = new Elysia({
  prefix: "/targets",
  detail: { tags: ["Daily Targets"] },
})
  .use(authGuard)
  .use(targetsModel)
  .get("/", ({ user, query }) => Targets.resolve(user.id, query.date), {
    auth: true,
    query: "targets.dateQuery",
    detail: {
      summary: "Resolve calorie & macro targets for a date",
      description:
        "Derives targets from the profile: Mifflin-St Jeor BMR x activity factor, plus a goal offset (+300 / 0 / -400 kcal), floored by sex and rounded to 10 kcal, with whole-gram macros. Weight used is a basis that only moves every 5 kg or on reaching the target weight; once reached, `targetReached` is true and the goal counts as maintenance. `targets` is null and `missingFields` lists what is needed while the profile is incomplete.",
    },
  })
  .put("/", ({ user, body }) => Targets.upsert(user.id, body), {
    auth: true,
    body: "targets.upsertBody",
    detail: {
      summary: "Create or replace the stored target for a date",
      description: "Stored targets are not used by GET /targets or the daily summary.",
    },
  })
  .delete("/", ({ user, query }) => Targets.remove(user.id, query.date ?? toDateKey()), {
    auth: true,
    query: "targets.dateQuery",
    detail: { summary: "Delete the stored target for a date" },
  })
