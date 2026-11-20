import { Elysia, t, type Static } from "elysia"

import { authGuard } from "../auth/service"
import { lookupPackagedFood } from "./barcode"
import { Foods } from "./service"

const FoodModel = {
  searchQuery: t.Object({
    q: t.Optional(t.String()),
    limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
  }),

  portionQuery: t.Object({
    weightG: t.Numeric({ minimum: 0 }),
  }),
} as const

export type FoodSearchQuery = Static<typeof FoodModel.searchQuery>
export type FoodPortionQuery = Static<typeof FoodModel.portionQuery>
export const foods = new Elysia({
  prefix: "/foods",
  detail: { tags: ["Foods"] },
})
  .use(authGuard)
  .get("/", ({ query }) => Foods.search(query), {
    auth: true,
    query: FoodModel.searchQuery,
    detail: {
      summary: "Search the food catalogue",
      description:
        "Search the food catalogue; omit the query to browse existing foods alphabetically.",
    },
  })
  .get("/barcode/:barcode", ({ params }) => lookupPackagedFood(params.barcode), {
    auth: true,
    params: t.Object({ barcode: t.String({ pattern: "^(?:[0-9]{8}|[0-9]{12,14})$" }) }),
    detail: { summary: "Look up packaged food nutrition by barcode in Open Food Facts" },
  })
  .get("/:foodId", ({ params }) => Foods.byId(params.foodId), {
    auth: true,
    detail: { summary: "Get a single food entry" },
  })
  .get(
    "/:foodId/portion",
    ({ params, query }) => Foods.estimatePortion(params.foodId, query.weightG),
    {
      auth: true,
      query: FoodModel.portionQuery,
      detail: {
        summary: "Scale a food entry to a portion weight",
        description: "Returns calories and macros for the requested gram weight of the food.",
      },
    },
  )
