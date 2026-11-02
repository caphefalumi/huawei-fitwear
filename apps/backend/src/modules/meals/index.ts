import { Elysia, t, type Static } from "elysia";
import { DATE_KEY_PATTERN } from "../../lib/date";
import { authGuard } from "../auth/service";
import { Meals } from "./service";

const dateKey = t.String({
  pattern: DATE_KEY_PATTERN,
  error: "date must be formatted as YYYY-MM-DD",
});
const mealType = t.Union(
  [t.Literal("breakfast"), t.Literal("lunch"), t.Literal("dinner"), t.Literal("snack")],
  { error: "mealType must be breakfast, lunch, dinner or snack" },
);
const itemBody = t.Object({
  foodName: t.String({ minLength: 1 }),
  servingUnit: t.Optional(t.Union([t.Literal("g"), t.Literal("ml")])),
  estimatedWeightG: t.Number({ minimum: 0 }),
  correctedWeightG: t.Optional(t.Number({ minimum: 0 })),
  caloriesKcal: t.Number({ minimum: 0 }),
  proteinG: t.Number({ minimum: 0 }),
  carbsG: t.Number({ minimum: 0 }),
  fatG: t.Number({ minimum: 0 }),
  aiConfidence: t.Optional(t.Number({ minimum: 0, maximum: 1 })),
  boundingBoxJson: t.Optional(t.String()),
});
const createBody = t.Object({
  targetDate: t.Optional(dateKey),
  mealType,
  imageUrl: t.Optional(t.String()),
  image: t.Optional(
    t.Object({
      data: t.String({ minLength: 1, maxLength: 8000000 }),
      mimeType: t.Union([t.Literal("image/jpeg"), t.Literal("image/png")]),
    }),
  ),
  scaleReferenceType: t.Optional(
    t.Union([t.Literal("finger"), t.Literal("card"), t.Literal("coin"), t.Literal("none")]),
  ),
  aiConfidenceOverall: t.Optional(t.Number({ minimum: 0, maximum: 1 })),
  loggedAt: t.Optional(t.String({ format: "date-time" })),
  items: t.Array(itemBody, { minItems: 1, error: "A meal needs at least one item" }),
});
const updateBody = t.Object({
  mealType: t.Optional(mealType),
  imageUrl: t.Optional(t.String()),
  aiConfidenceOverall: t.Optional(t.Number({ minimum: 0, maximum: 1 })),
});
const updateItemBody = t.Object({
  foodName: t.Optional(t.String({ minLength: 1 })),
  servingUnit: t.Optional(t.Union([t.Literal("g"), t.Literal("ml")])),
  correctedWeightG: t.Optional(t.Number({ minimum: 0 })),
  caloriesKcal: t.Optional(t.Number({ minimum: 0 })),
  proteinG: t.Optional(t.Number({ minimum: 0 })),
  carbsG: t.Optional(t.Number({ minimum: 0 })),
  fatG: t.Optional(t.Number({ minimum: 0 })),
});
const listQuery = t.Object({
  date: t.Optional(dateKey),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, multipleOf: 1 })),
  offset: t.Optional(t.Numeric({ minimum: 0, multipleOf: 1 })),
});
const dateQuery = t.Object({ date: t.Optional(dateKey) });

export type MealItemBody = Static<typeof itemBody>;
export type MealCreateBody = Static<typeof createBody>;
export type MealUpdateBody = Static<typeof updateBody>;
export type MealItemUpdateBody = Static<typeof updateItemBody>;
export type MealListQuery = Static<typeof listQuery>;

const mealModels = new Elysia().model({
  "meals.dateQuery": dateQuery,
  "meals.listQuery": listQuery,
  "meals.createBody": createBody,
  "meals.updateBody": updateBody,
  "meals.itemBody": itemBody,
  "meals.updateItemBody": updateItemBody,
});

export const meals = new Elysia({
  prefix: "/meals",
  detail: { tags: ["Meals"] },
})
  .use(authGuard)
  .use(mealModels)
  .get("/summary", ({ user, query }) => Meals.dailySummary(user.id, query.date), {
    auth: true,
    query: "meals.dateQuery",
    detail: {
      summary: "Daily nutrition summary",
      description:
        "Aggregates every logged meal for the date and compares it against the resolved targets.",
    },
  })
  .get("/", ({ user, query }) => Meals.list(user.id, query), {
    auth: true,
    query: "meals.listQuery",
    detail: {
      summary: "List meal logs",
      description:
        "Newest first. Filter by date, or page through the whole history with limit & offset.",
    },
  })
  .post("/", ({ user, body }) => Meals.create(user.id, body), {
    auth: true,
    body: "meals.createBody",
    detail: {
      summary: "Log a meal with its items",
      description: "Inserts the meal log and all of its items in a single atomic D1 batch.",
    },
  })
  .get("/:mealId", ({ user, params }) => Meals.byId(user.id, params.mealId), {
    auth: true,
    detail: { summary: "Get a meal log with items and totals" },
  })
  .patch("/:mealId", ({ user, params, body }) => Meals.update(user.id, params.mealId, body), {
    auth: true,
    body: "meals.updateBody",
    detail: { summary: "Update meal log metadata" },
  })
  .delete("/:mealId", ({ user, params }) => Meals.remove(user.id, params.mealId), {
    auth: true,
    detail: { summary: "Delete a meal log and its items" },
  })
  .post("/:mealId/items", ({ user, params, body }) => Meals.addItem(user.id, params.mealId, body), {
    auth: true,
    body: "meals.itemBody",
    detail: { summary: "Append an item to an existing meal log" },
  })
  .patch(
    "/:mealId/items/:itemId",
    ({ user, params, body }) => Meals.updateItem(user.id, params.mealId, params.itemId, body),
    {
      auth: true,
      body: "meals.updateItemBody",
      detail: {
        summary: "Correct a meal item",
        description: "Used by the portion-correction and food-replacement flows.",
      },
    },
  )
  .delete(
    "/:mealId/items/:itemId",
    ({ user, params }) => Meals.removeItem(user.id, params.mealId, params.itemId),
    {
      auth: true,
      detail: {
        summary: "Remove a meal item",
        description: "Removing the last remaining item deletes the parent meal log.",
      },
    },
  );
