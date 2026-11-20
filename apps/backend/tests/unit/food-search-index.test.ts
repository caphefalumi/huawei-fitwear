import { describe, expect, it } from "bun:test"

import { Foods } from "../../src/modules/foods/service"
import { createTestDatabase } from "../helpers/test-db"

describe("indexed food search", () => {
  it("finds substrings and follows inserts, updates and deletes", async () => {
    const { d1 } = createTestDatabase()
    const insert = d1.prepare(
      "INSERT INTO foods (id, name, caloriesPer100, proteinPer100G, carbsPer100G, fatPer100G) VALUES (?, ?, 1, 2, 3, 4)",
    )
    await insert.bind("index-test", "Qz dragonfruit").run()
    expect((await Foods.search({ q: "GONFR" }, d1)).foods.map((food) => food.id)).toContain(
      "index-test",
    )
    expect((await Foods.search({ q: "qz" }, d1)).foods.map((food) => food.id)).toContain(
      "index-test",
    )
    await d1
      .prepare("UPDATE foods SET name = ? WHERE id = ?")
      .bind("Golden starfruit", "index-test")
      .run()
    expect((await Foods.search({ q: "gonfruit" }, d1)).foods.map((food) => food.id)).not.toContain(
      "index-test",
    )
    expect((await Foods.search({ q: "arfruit" }, d1)).foods.map((food) => food.id)).toContain(
      "index-test",
    )
    await d1.prepare("DELETE FROM foods WHERE id = ?").bind("index-test").run()
    expect((await Foods.search({ q: "arfruit" }, d1)).foods.map((food) => food.id)).not.toContain(
      "index-test",
    )
  })
})
