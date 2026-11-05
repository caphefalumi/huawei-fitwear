import { Elysia, t, type Static } from "elysia"

import { authGuard } from "../auth/service"
import { Exercises } from "./service"

const ExerciseListQuerySchema = t.Object({
  muscleGroup: t.Optional(t.String()),
  equipment: t.Optional(t.String()),
  q: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 200, multipleOf: 1 })),
  offset: t.Optional(t.Numeric({ minimum: 0, multipleOf: 1 })),
})

export type ExerciseListQuery = Static<typeof ExerciseListQuerySchema>

const exerciseModels = new Elysia().model({
  "exercises.listQuery": ExerciseListQuerySchema,
})

export const exercises = new Elysia({
  prefix: "/exercises",
  detail: { tags: ["Exercises"] },
})
  .use(exerciseModels)
  .use(authGuard)
  .get("/", ({ query }) => Exercises.list(query), {
    auth: true,
    query: "exercises.listQuery",
    detail: {
      summary: "List the exercise catalogue",
      description: "Filter by muscle group, equipment or a name substring.",
    },
  })
  .get("/:exerciseId", ({ params }) => Exercises.byId(params.exerciseId), {
    auth: true,
    detail: { summary: "Get a single exercise with its cadence animation" },
  })
