import { routineForGroup, routinesFor } from "@/features/workout/routines";
import type { Exercise } from "@/features/workout/workout-store";
import type { RecoveryPlan } from "@/features/health/health-store";

function exercise(
  id: string,
  muscleGroup: string,
  defaultSets = 3,
  defaultReps = 10,
  repetitionUnit: Exercise["repetitionUnit"] = "reps",
): Exercise {
  return {
    id,
    name: id,
    muscleGroup,
    equipment: "bodyweight",
    cadenceAnimationUrl: null,
    cues: [],
    defaultSets,
    defaultReps,
    repetitionUnit,
  };
}

const catalog = [
  exercise("press", "Chest"),
  exercise("fly", "Chest", 2, 12),
  exercise("row", "Back"),
  exercise("plank", "Core", 3, 40, "seconds"),
  exercise("walk", "Recovery", 1, 15, "minutes"),
];

test("does not create fallback exercises or plans when the catalog is missing", () => {
  expect(routineForGroup("Chest", [])).toBeNull();
  expect(routineForGroup("Shoulders", catalog)).toBeNull();
  expect(routinesFor(null, [])).toEqual({ today: null, next: null });
});

test("matches catalog groups case-insensitively and totals backend prescriptions", () => {
  const routine = routineForGroup("cHeSt", catalog);
  expect(routine?.name).toBe("Chest");
  expect(routine?.sets).toBe(5);
  expect(routine?.exercises.map((entry) => entry.id)).toEqual(["press", "fly"]);
  expect(routine?.exercises[1].prescription).toBe("2 × 12 reps");
  expect(routine).not.toHaveProperty("minutes");
  expect(catalog[0]).not.toHaveProperty("prescription");
  expect(routine?.exercises[0]).not.toHaveProperty("load");
});

test("keeps timed exercise units instead of describing durations as reps", () => {
  expect(routineForGroup("Core", catalog)?.exercises[0].prescription).toBe("3 × 40 seconds");
  expect(routineForGroup("Recovery", catalog)?.exercises[0].prescription).toBe("1 × 15 minutes");
});

test("uses catalog plans without inventing an account schedule or medical clearance", () => {
  const normal = routinesFor(null, catalog);
  expect(normal.today?.name).toBe("Chest");
  expect(normal.next?.name).toBe("Back");
  const recovery: RecoveryPlan = {
    area: "Right knee",
    note: "",
    restDays: 2,
    lightDays: 3,
    startDate: "2026-11-01",
    start: "Nov 1",
    returnDate: "Nov 6",
  };
  const recovering = routinesFor(recovery, catalog);
  expect(recovering.today?.name).toBe("Recovery");
  expect(recovering.next?.name).toBe("Core");
  expect(recovering).not.toHaveProperty("adjustedFor");
});
