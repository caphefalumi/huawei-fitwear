import { PERIOD_AREA, type RecoveryPlan } from "@/features/health/health-store";
import { GROUP_ROUTINES, routinesFor } from "@/features/workout/routines";

const kneeRecovery: RecoveryPlan = {
  area: "Right knee",
  note: "",
  restDays: 2,
  lightDays: 3,
  startDate: "2026-11-01",
  start: "Nov 1",
  returnDate: "Nov 6",
};

test("returns chest then back without a recovery plan", () => {
  expect(routinesFor(null)).toEqual({
    today: GROUP_ROUTINES.chest,
    next: GROUP_ROUTINES.back,
    adjustedFor: null,
  });
});

test("uses seated back routine and arms when right knee is recovering", () => {
  expect(routinesFor(kneeRecovery)).toEqual({
    today: expect.objectContaining({ name: "Back · seated machines" }),
    next: GROUP_ROUTINES.arms,
    adjustedFor: "right knee",
  });
});

test("uses seated chest routine and arms for lower-back recovery", () => {
  expect(routinesFor({ ...kneeRecovery, area: "Lower back" })).toEqual({
    today: expect.objectContaining({ name: "Chest · seated & supported" }),
    next: GROUP_ROUTINES.arms,
    adjustedFor: "lower back",
  });
});

test("uses light movement routine during period recovery", () => {
  expect(routinesFor({ ...kneeRecovery, area: PERIOD_AREA })).toEqual({
    today: expect.objectContaining({ name: "Light movement" }),
    next: expect.objectContaining({ name: "Full body · light" }),
    adjustedFor: PERIOD_AREA.toLowerCase(),
  });
});
