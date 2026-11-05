import { describe, expect, it } from "bun:test"

import { parseMealAnalysis } from "../../src/modules/meals/analysis"

describe("Meal analysis result validation", () => {
  it("preserves portion nutrition and uncertainty for user review", () => {
    const item = {
      foodName: "Rice",
      estimatedWeightG: 200,
      caloriesKcal: 260,
      proteinG: 5,
      carbsG: 57,
      fatG: 1,
      aiConfidence: 0.65,
    }
    expect(parseMealAnalysis("```json\n" + JSON.stringify({ items: [item] }) + "\n```")).toEqual({
      items: [item],
    })
  })
  it("accepts no detected food instead of manufacturing a meal", () => {
    expect(parseMealAnalysis('{"items":[]}')).toEqual({ items: [] })
  })
  it.each([
    "not json",
    '{"items":[{"foodName":"Rice"}]}',
    '{"items":[{"foodName":"Rice","estimatedWeightG":200,"caloriesKcal":-10,"proteinG":5,"carbsG":57,"fatG":1}]}',
    '{"items":[],"aiConfidenceOverall":2}',
  ])("rejects unusable provider output: %s", (text) => {
    expect(() => parseMealAnalysis(text)).toThrow()
  })
})
