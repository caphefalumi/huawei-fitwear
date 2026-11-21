import { describe, expect, it } from "bun:test"

import { Foods, normalizeFoodSearch } from "../../src/modules/foods/service"
import { createTestDatabase } from "../helpers/test-db"

const seed = await Bun.file(new URL("../../scripts/usda_food_catalog.sql", import.meta.url)).text()

async function createCatalog() {
  const { d1 } = createTestDatabase()
  await d1.exec(seed)
  return d1
}

describe("food search normalization", () => {
  it("ignores Vietnamese accents, case, and the stroke in đ", () => {
    expect(normalizeFoodSearch("ĐẬU ĐỎ")).toBe("dau do")
    expect(normalizeFoodSearch("Ca\u0300 Phe\u0302")).toBe("ca phe")
    expect(normalizeFoodSearch("THỊT GÀ")).toBe("thit ga")
  })
})

describe("D1 food catalog search", () => {
  it("finds Vietnamese names, regional aliases, and English names without AI Search", async () => {
    const d1 = await createCatalog()
    for (const [query, displayName] of [
      ["ga nuong", "Gà nướng không rõ phần và tình trạng da"],
      ["THƠM", "Dứa sống"],
      ["heo", "Thịt lợn xay sống"],
      ["ĐƯA LEO", "Dưa chuột còn vỏ sống"],
    ]) {
      const result = await Foods.search({ q: query, limit: 100 }, d1)
      expect(result.foods.map((food) => food.name)).toContain(displayName!)
    }
    const result = await Foods.search({ q: "cucumber", limit: 5 }, d1)
    expect(result.foods.map((food) => food.id)).toContain("usda-fdc-2346406")
  })

  it("preserves existing foods and resolves USDA search results by stable ID", async () => {
    const d1 = await createCatalog()
    await d1.exec("INSERT INTO foods VALUES ('custom', 'House rice', 'g', 'carrot', 1, 2, 3, 4)")
    expect((await Foods.search({ q: "house rice" }, d1)).foods[0]?.id).toBe("custom")
    const result = await Foods.search({ q: "com trang", limit: 100 }, d1)
    const rice = result.foods.find((food) => food.id === "usda-fdc-2708403")
    expect(rice).toBeDefined()
    expect(await Foods.byId("usda-fdc-2708403", d1)).toEqual(rice!)
    const portion = await Foods.estimatePortion("usda-fdc-2708403", 200, d1)
    expect(portion.nutrition.caloriesKcal).toBe(rice!.caloriesPer100 * 2)
  })

  it("limits broad searches and treats SQL wildcard characters literally", async () => {
    const d1 = await createCatalog()
    expect((await Foods.search({ q: "a", limit: 2 }, d1)).foods).toHaveLength(2)
    expect((await Foods.search({ q: "_%" }, d1)).foods).toEqual([])
  })
})
