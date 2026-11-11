import { CATALOG, type CatalogExercise, type MuscleGroup } from "./catalog"

/** The six muscle groups with their body icons, in display order. */
export const MUSCLE_GROUPS: readonly { group: MuscleGroup; icon: number }[] = [
  { group: "Chest", icon: require("@/assets/images/recovery/body-chest.svg") },
  { group: "Back", icon: require("@/assets/images/recovery/body-back.svg") },
  { group: "Shoulders", icon: require("@/assets/images/recovery/body-shoulders.svg") },
  { group: "Arms", icon: require("@/assets/images/recovery/body-arms.svg") },
  { group: "Legs", icon: require("@/assets/images/recovery/body-legs.svg") },
  { group: "Core", icon: require("@/assets/images/recovery/body-core.svg") },
]

export const EQUIPMENT_LABELS: Record<CatalogExercise["equipment"], string> = {
  barbell: "Barbell",
  dumbbell: "Dumbbells",
  cable: "Cable",
  machine: "Machine",
  bodyweight: "Body weight",
}

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** Muscle group from a route param such as "chest", falling back to Chest. */
export const groupFromParam = (param?: string): MuscleGroup =>
  MUSCLE_GROUPS.find(({ group }) => group.toLowerCase() === param?.toLowerCase())?.group ?? "Chest"

export const exercisesIn = (group: MuscleGroup) =>
  CATALOG.filter((exercise) => exercise.group === group)
