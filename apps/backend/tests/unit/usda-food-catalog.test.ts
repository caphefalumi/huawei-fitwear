import { Database } from "bun:sqlite"
import { describe, expect, it } from "bun:test"
import { readFileSync } from "node:fs"

const migration = readFileSync(
  new URL("../../scripts/usda_food_catalog.sql", import.meta.url),
  "utf8",
)

describe("USDA food catalog source", () => {
  it("preserves existing foods, imports sourced nutrients and is safe to rerun", () => {
    const db = new Database(":memory:")
    try {
      db.exec(`CREATE TABLE foods (
        id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE,
        servingUnit TEXT NOT NULL DEFAULT 'g', glyph TEXT NOT NULL DEFAULT 'carrot',
        caloriesPer100 REAL NOT NULL, proteinPer100G REAL NOT NULL,
        carbsPer100G REAL NOT NULL, fatPer100G REAL NOT NULL
      );`)
      db.exec("INSERT INTO foods VALUES ('existing', 'Milk, NFS', 'ml', 'milk', 1, 2, 3, 4)")
      db.exec(migration)

      const food = (id: string) => db.query("SELECT * FROM foods WHERE id = ?").get(id)
      expect(food("existing")).toEqual({
        id: "existing",
        name: "Milk, NFS",
        servingUnit: "ml",
        glyph: "milk",
        caloriesPer100: 1,
        proteinPer100G: 2,
        carbsPer100G: 3,
        fatPer100G: 4,
      })
      expect(food("usda-fdc-2705384")).toBeNull()
      expect(food("usda-fdc-2705383")).toBeNull() // Human milk has no nutrient values.
      expect(food("usda-fdc-1750339")).toMatchObject({
        name: "Apples, red delicious, with skin, raw",
        servingUnit: "g",
        caloriesPer100: 61.8,
        proteinPer100G: 0.188,
        carbsPer100G: 14.8,
        fatPer100G: 0.212,
      })
      expect(food("usda-fdc-2708403")).toMatchObject({
        caloriesPer100: 129,
        proteinPer100G: 2.67,
        carbsPer100G: 28,
        fatPer100G: 0.28,
      })
      expect(food("usda-fdc-171287")).toMatchObject({
        caloriesPer100: 143,
        proteinPer100G: 12.6,
        carbsPer100G: 0.72,
        fatPer100G: 9.51,
      })
      const count = db.query<{ total: number }, []>("SELECT count(*) AS total FROM foods")
      const initialCount = count.get()?.total ?? 0
      expect(initialCount).toBeGreaterThan(10000)
      db.exec(migration)
      expect(count.get()?.total).toBe(initialCount)
      expect(food("existing")).toMatchObject({ caloriesPer100: 1, servingUnit: "ml" })
    } finally {
      db.close()
    }
  })
})
