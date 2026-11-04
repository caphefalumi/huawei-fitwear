import { Elysia, t, type Static } from "elysia"
import { authGuard } from "../auth/service"
import { toDateKey, DATE_KEY_PATTERN } from "../../lib/date"
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
        "Returns the stored target when present, otherwise derives one from the profile using Mifflin-St Jeor BMR, the activity multiplier and the fitness goal.",
    },
  })
  .put("/", ({ user, body }) => Targets.upsert(user.id, body), {
    auth: true,
    body: "targets.upsertBody",
    detail: { summary: "Create or replace the stored target for a date" },
  })
  .delete("/", ({ user, query }) => Targets.remove(user.id, query.date ?? toDateKey()), {
    auth: true,
    query: "targets.dateQuery",
    detail: { summary: "Delete a stored target so it falls back to derived values" },
  })
