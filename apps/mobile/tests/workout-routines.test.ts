import { recoveryPhase, routineForGroup, routinesFor } from "@/features/workout/routines";
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
  exercise("squat", "Legs"),
  exercise("curl", "Arms", 3, 12),
];
const kneeRecovery: RecoveryPlan = {
  area: "Right knee",
  note: "",
  restDays: 2,
  lightDays: 3,
  startDate: "2026-11-01",
  start: "Nov 1",
  returnDate: "Nov 6",
};

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
});

test("uses normal routines without a recovery plan", () => {
  const normal = routinesFor(null, catalog);
  expect(normal.today?.name).toBe("Chest");
  expect(normal.next?.name).toBe("Back");
});

test("recovery phases follow rest days, rehab days, then normal training", () => {
  const day = (date: number) => new Date(2026, 10, date, 9);
  expect(recoveryPhase(kneeRecovery, day(1))).toBe("rest");
  expect(recoveryPhase(kneeRecovery, day(3))).toBe("light");
  expect(recoveryPhase(kneeRecovery, day(6))).toBe("normal");
  expect(routinesFor(kneeRecovery, catalog, day(7)).today?.name).toBe("Chest");
});

test("rest days train only unaffected groups and never the injured area", () => {
  const { today, next, avoid, rest } = routinesFor(kneeRecovery, catalog, new Date(2026, 10, 2));
  expect(avoid).toEqual(["Legs"]);
  expect(today?.name).toBe("Chest");
  expect(next?.name).toBe("Back");
  expect(rest).toBeUndefined();
  const shoulder = { ...kneeRecovery, area: "Right shoulder" };
  expect(routinesFor(shoulder, catalog, new Date(2026, 10, 2)).today?.name).toBe("Legs");
});

test("period recovery has nothing safe to train on rest days", () => {
  const period = { ...kneeRecovery, area: "In period" };
  expect(routinesFor(period, catalog, new Date(2026, 10, 2))).toMatchObject({
    today: null,
    next: null,
    rest: true,
  });
});

test("rehab days train the affected group at a third of the sets", () => {
  const { today, next } = routinesFor(kneeRecovery, catalog, new Date(2026, 10, 4));
  expect(today?.name).toBe("Recovery");
  expect(today?.exercises.map((entry) => entry.id)).toEqual(["squat"]);
  expect(today?.exercises[0].prescription).toBe("1 × 10 reps · easy effort");
  expect(next?.name).toBe("Chest");
  expect(routineForGroup("Recovery", catalog)).toBeNull();
  const all = routinesFor({ ...kneeRecovery, area: "In period" }, catalog, new Date(2026, 10, 4));
  expect(all.today?.exercises.map((entry) => entry.id)).toEqual(["press", "row", "curl", "squat"]);
});
