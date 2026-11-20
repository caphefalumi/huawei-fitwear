import { describe, expect, it } from "bun:test"

import vietnameseFoods from "../../data/vietnamese-usda.json"
import { Foods, normalizeFoodSearch } from "../../src/modules/foods/service"
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

describe("food search normalization", () => {
  it("ignores Vietnamese accents, case, and the stroke in đ", () => {
    expect(normalizeFoodSearch("ĐẬU ĐỎ")).toBe("dau do")
    expect(normalizeFoodSearch("Ca\u0300 Phe\u0302")).toBe("ca phe")
    expect(normalizeFoodSearch("THỊT GÀ")).toBe("thit ga")
  })
})

describe("food catalog search", () => {
  it("finds Vietnamese names, aliases, and English names using USDA nutrients", async () => {
    const entry = vietnameseFoods.find((food) => food.fdc_id === 2346406)
    expect(entry).toBeDefined()
    if (!entry) throw new Error("Cucumber is missing from the Vietnamese food overlay")

    const food = { ...rice, id: `usda-fdc-${entry.fdc_id}` }
    const requestedKeys: string[] = []
    const namespace = {
      get: () => ({
        search: async () => ({ chunks: [] }),
        items: {
          list: async ({ key }: { key: string }) => {
            requestedKeys.push(key)
            return { result: key === `${food.id}.txt` ? [{ id: "item-id", key }] : [] }
          },
          get: () => ({
            download: async () => {
              const text = JSON.stringify(food)
              return { body: new Blob([text]).stream(), size: text.length }
            },
          }),
        },
      }),
    } as unknown as AiSearchNamespace
    const { d1 } = createTestDatabase()
    await withWorkerBindings({ AI_SEARCH: namespace }, async () => {
      for (const name of [entry.name_vi, entry.aliases_vi[0], entry.name_en]) {
        for (const query of [name.toUpperCase(), normalizeFoodSearch(name).toUpperCase()]) {
          const result = await Foods.search({ q: query, limit: 100 }, d1)
          expect(result.foods).toContainEqual(food)
          expect(result.count).toBe(result.foods.length)
        }
      }
      const strokeQuery = await Foods.search({ q: "ĐƯA LEO", limit: 100 }, d1)
      expect(strokeQuery.foods).toContainEqual(food)
    })
    expect(requestedKeys).toContain(`${food.id}.txt`)
  })
  it("keeps other results when an overlay item lookup fails", async () => {
    const { d1 } = createTestDatabase()
    const namespace = {
      get: () => ({
        search: async () => ({
          chunks: [{ item: { key: `${rice.id}.txt` }, text: JSON.stringify(rice) }],
        }),
        items: {
          list: async () => {
            throw new Error("item unavailable")
          },
        },
      }),
    } as unknown as AiSearchNamespace
    await withWorkerBindings({ AI_SEARCH: namespace }, async () => {
      const result = await Foods.search({ q: "dua leo" }, d1)
      expect(result.foods).toContainEqual(rice)
    })
  })
  it("limits overlay lookups to the requested result limit", async () => {
    const { d1 } = createTestDatabase()
    const requestedKeys: string[] = []
    const namespace = {
      get: () => ({
        search: async () => ({ chunks: [] }),
        items: {
          list: async ({ key }: { key: string }) => {
            requestedKeys.push(key)
            return { result: [] }
          },
        },
      }),
    } as unknown as AiSearchNamespace
    await withWorkerBindings({ AI_SEARCH: namespace }, async () => {
      await Foods.search({ q: "d", limit: 2 }, d1)
    })
    expect(requestedKeys).toHaveLength(2)
  })

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
