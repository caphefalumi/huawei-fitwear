import { progressBounds, progressData } from "@/features/home/progress-data";

const now = new Date(2026, 0, 3, 9);

test("uses inclusive local calendar bounds across a year boundary", () => {
  expect(progressBounds("Week", now)).toEqual({ from: "2025-12-28", to: "2026-01-03" });
});

test("filters and sorts persisted weights without inventing intermediate measurements", () => {
  const logs = [
    { loggedDate: "2026-01-03", weightKg: 71 },
    { loggedDate: "2025-12-27", weightKg: 80 },
    { loggedDate: "2025-12-28", weightKg: 72.5 },
    { loggedDate: "2026-01-04", weightKg: 70 },
  ];
  const result = progressData("Week", logs, null, now);
  expect(result.weights).toEqual([72.5, 71]);
  expect(result.dates).toEqual(["2025-12-28", "2026-01-03"]);
  expect(result.delta).toBe("-1.5 kg");
  expect(logs[0].loggedDate).toBe("2026-01-03");
});

test("does not turn missing activity data or a single weight into fake progress", () => {
  const result = progressData("Week", [{ loggedDate: "2026-01-03", weightKg: 71 }], null, now);
  expect(result.delta).toBe("Not enough logs");
  expect(result.duration).toBe("—");
  expect(result.sessionsNote).toBe("Training data unavailable");
  expect(progressData("Week", [], null, now).weights).toEqual([]);
});

test("uses completed backend statistics and preserves zero-activity days", () => {
  const result = progressData(
    "Week",
    [],
    {
      completedSessionCount: 3,
      totalDurationSeconds: 3690,
      byDate: [
        { date: "2025-12-28", sessionCount: 1 },
        { date: "2026-01-03", sessionCount: 2 },
        { date: "2025-12-27", sessionCount: 99 },
      ],
    },
    now,
  );
  expect(result.bars.map((bar) => bar.sessions)).toEqual([1, 0, 0, 0, 0, 0, 2]);
  expect(result.sessionsNote).toBe("3 completed sessions");
  expect(result.duration).toBe("1h 1m");
});

test("groups longer ranges without dropping sessions at bucket boundaries", () => {
  const result = progressData(
    "Month",
    [],
    {
      completedSessionCount: 4,
      totalDurationSeconds: 0,
      byDate: [
        { date: "2025-12-05", sessionCount: 1 },
        { date: "2025-12-13", sessionCount: 1 },
        { date: "2025-12-20", sessionCount: 1 },
        { date: "2026-01-03", sessionCount: 1 },
      ],
    },
    now,
  );
  expect(result.bars.map((bar) => bar.sessions)).toEqual([1, 1, 1, 1]);
});
