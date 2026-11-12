import type { NutritionSummary } from "@/features/meals"

import { nutritionView, profileFieldLabels } from "../utils/nutrition-view"

const complete: NutritionSummary = {
  targetDate: "2026-11-12",
  profileComplete: true,
  missingFields: [],
  targetReached: false,
  targets: { calorieTargetKcal: 2190, proteinTargetG: 140, carbsTargetG: 270, fatTargetG: 61 },
  consumed: { caloriesKcal: 650.4, proteinG: 42.26, carbsG: 80, fatG: 20.04 },
  remaining: { caloriesKcal: 1540, proteinG: 97.7, carbsG: 190.7, fatG: 40.8 },
  mealCount: 2,
}

test("is loading until the summary arrives", () => {
  expect(nutritionView(null)).toEqual({ status: "loading" })
  expect(nutritionView(undefined)).toEqual({ status: "loading" })
})

test("reports a complete profile with kcal left, ring progress and macro rows", () => {
  const view = nutritionView(complete)
  expect(view).toEqual({
    status: "ready",
    consumedKcal: 650,
    targetKcal: 2190,
    kcalLeft: 1540,
    progress: 650 / 2190,
    targetReached: false,
    macros: [
      { label: "Protein", value: 42, target: 140 },
      { label: "Carbs", value: 80, target: 270 },
      { label: "Fat", value: 20, target: 61 },
    ],
  })
})

test("passes on that the target weight was reached", () => {
  expect(nutritionView({ ...complete, targetReached: true })).toMatchObject({
    status: "ready",
    targetReached: true,
  })
})

test("never shows negative kcal left or a ring beyond full", () => {
  const view = nutritionView({
    ...complete,
    consumed: { caloriesKcal: 2500, proteinG: 0, carbsG: 0, fatG: 0 },
  })
  expect(view).toMatchObject({ status: "ready", kcalLeft: 0, progress: 1 })
})

test("shows only what was eaten while the profile is incomplete", () => {
  const view = nutritionView({
    ...complete,
    profileComplete: false,
    missingFields: ["heightCm", "currentWeightKg"],
    targetReached: false,
    targets: null,
    remaining: null,
  })
  expect(view).toEqual({
    status: "incomplete",
    consumedKcal: 650,
    consumed: { protein: 42, carbs: 80, fat: 20 },
    missing: ["Height", "Weight"],
  })
})

test("names every missing field as the Profile screen does", () => {
  expect(
    profileFieldLabels([
      "gender",
      "birthDate",
      "heightCm",
      "currentWeightKg",
      "activityLevel",
      "fitnessGoal",
    ]),
  ).toEqual(["Sex / gender", "Birthdate", "Height", "Weight", "Daily activity", "Goal / target"])
})
