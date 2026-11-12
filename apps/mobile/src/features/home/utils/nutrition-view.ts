import type { NutritionSummary } from "@/features/meals"

export type MacroRow = { label: "Protein" | "Carbs" | "Fat"; value: number; target: number }

export type NutritionView =
  | { status: "loading" }
  /** Profile is missing something: show what was eaten, but no target. */
  | {
      status: "incomplete"
      consumedKcal: number
      consumed: { protein: number; carbs: number; fat: number }
    }
  | {
      status: "ready"
      consumedKcal: number
      targetKcal: number
      /** Never negative: going over the target leaves 0 kcal left. */
      kcalLeft: number
      /** 0 to 1, for the ring. */
      progress: number
      /** The target weight was reached, so the target is for maintaining weight. */
      targetReached: boolean
      /** Whole grams. */
      macros: MacroRow[]
    }

/** Turns the daily summary into what the Home and Nutrition screens display. */
export function nutritionView(summary: NutritionSummary | null | undefined): NutritionView {
  if (!summary) return { status: "loading" }
  const consumedKcal = Math.round(summary.consumed.caloriesKcal)
  const { targets } = summary
  if (!summary.profileComplete || !targets) {
    return {
      status: "incomplete",
      consumedKcal,
      consumed: {
        protein: Math.round(summary.consumed.proteinG),
        carbs: Math.round(summary.consumed.carbsG),
        fat: Math.round(summary.consumed.fatG),
      },
    }
  }
  return {
    status: "ready",
    consumedKcal,
    targetKcal: targets.calorieTargetKcal,
    kcalLeft: Math.max(0, targets.calorieTargetKcal - consumedKcal),
    progress: Math.min(1, consumedKcal / targets.calorieTargetKcal),
    targetReached: summary.targetReached,
    macros: [
      {
        label: "Protein",
        value: Math.round(summary.consumed.proteinG),
        target: Math.round(targets.proteinTargetG),
      },
      {
        label: "Carbs",
        value: Math.round(summary.consumed.carbsG),
        target: Math.round(targets.carbsTargetG),
      },
      {
        label: "Fat",
        value: Math.round(summary.consumed.fatG),
        target: Math.round(targets.fatTargetG),
      },
    ],
  }
}
