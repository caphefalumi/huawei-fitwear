import { describe, expect, it } from "bun:test"

import { Foods } from "../../src/modules/foods/service"
import { withWorkerBindings } from "../../src/worker/bindings"
import { createTestDatabase } from "../helpers/test-db"

const rice = {
  id: "usda-fdc-2708403",
  name: "Rice, cooked",
  servingUnit: "g",
  glyph: "carrot",
  caloriesPer100: 129,
  proteinPer100G: 2.67,
  carbsPer100G: 28,
  fatPer100G: 0.28,
}

function searchBinding(text = JSON.stringify(rice)) {
  const searches: AiSearchSearchRequest[] = []
  const instance = {
    search: async (request: AiSearchSearchRequest) => {
      searches.push(request)
      return { chunks: [{ item: { key: `${rice.id}.txt` }, text }] }
    },
    items: {
      list: async ({ key }: { key: string }) => ({
        result: key === `${rice.id}.txt` ? [{ id: "item-id", key }] : [],
      }),
      get: (id: string) => ({
        download: async () => {
          expect(id).toBe("item-id")
          return { body: new Blob([text]).stream(), size: text.length }
        },
      }),
    },
  }
  const namespace = {
    get: (name: string) => {
      expect(name).toBe("vooc")
      return instance
    },
  } as unknown as AiSearchNamespace
  return { namespace, searches }
}

describe("food catalog search", () => {
  it("merges exact catalog nutrients with existing D1 foods and resolves portions", async () => {
    const { d1 } = createTestDatabase()
    await d1.exec("DELETE FROM foods WHERE name LIKE '%rice%'")
    await d1.exec("INSERT INTO foods VALUES ('existing-rice', 'A rice', 'g', 'carrot', 1, 2, 3, 4)")
    const { namespace, searches } = searchBinding()
    await withWorkerBindings({ AI_SEARCH: namespace }, async () => {
      const result = await Foods.search({ q: "rice", limit: 2 }, d1)
      expect(result.foods).toEqual([
        {
          id: "existing-rice",
          name: "A rice",
          servingUnit: "g",
          glyph: "carrot",
          caloriesPer100: 1,
          proteinPer100G: 2,
          carbsPer100G: 3,
          fatPer100G: 4,
        },
        rice,
      ])
      expect(result.count).toBe(2)
      expect(await Foods.byId(rice.id, d1)).toEqual(rice)
      expect((await Foods.estimatePortion(rice.id, 200, d1)).nutrition).toEqual({
        caloriesKcal: 258,
        proteinG: 5.3,
        carbsG: 56,
        fatG: 0.6,
      })
      expect(await Foods.byId("existing-rice", d1)).toMatchObject({ caloriesPer100: 1 })
    })
    expect(searches[0]).toMatchObject({
      query: "rice",
      ai_search_options: { retrieval: { return_on_failure: false } },
    })
  })

  it("browses existing records without requiring AI Search", async () => {
    const { d1 } = createTestDatabase()
    await d1.exec("INSERT INTO foods VALUES ('existing', 'A food', 'g', 'carrot', 1, 2, 3, 4)")
    const result = await Foods.search({ limit: 1 }, d1)
    expect(result.foods[0].id).toBe("existing")
    expect(result.count).toBe(1)
  })

  it("rejects malformed catalog data and search failures instead of inventing nutrition", async () => {
    const { d1 } = createTestDatabase()
    const { namespace } = searchBinding(JSON.stringify({ ...rice, fatPer100G: null }))
    await withWorkerBindings({ AI_SEARCH: namespace }, async () => {
      await expect(Foods.search({ q: "rice" }, d1)).rejects.toThrow("Invalid food catalog item")
      await expect(Foods.byId(rice.id, d1)).rejects.toThrow("Invalid food catalog item")
    })
    const failing = {
      get: () => ({
        search: async () => {
          throw new Error("search unavailable")
        },
      }),
    } as unknown as AiSearchNamespace
    await withWorkerBindings({ AI_SEARCH: failing }, async () => {
      await expect(Foods.search({ q: "rice" }, d1)).rejects.toThrow("search unavailable")
    })
    await expect(Foods.search({ q: "rice" }, d1)).rejects.toThrow(
      "AI_SEARCH namespace binding is required",
    )
  })
})
