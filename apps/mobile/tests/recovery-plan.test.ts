import {
  createInjury,
  injuryEffect,
  injuryTitle,
  isActive,
  PERIOD_AREA,
  periodPhase,
  useInjuries,
} from "@/features/recovery"

jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/auth/auth-hooks", () => ({ useAuth: jest.fn() }))

beforeEach(() => useInjuries.setState({ injuries: [] }))

test("new injuries start light for seven days", () => {
  expect(createInjury("Knee", "2026-11-08")).toEqual({
    area: "Knee",
    mode: "light",
    startDate: "2026-11-08",
    endDate: "2026-11-15",
  })
})

test("an injury is active from its start through its end date, or forever without one", () => {
  const knee = createInjury("Knee", "2026-11-08")
  expect(isActive(knee, "2026-11-07")).toBe(false)
  expect(isActive(knee, "2026-11-15")).toBe(true)
  expect(isActive(knee, "2026-11-16")).toBe(false)
  expect(isActive({ ...knee, endDate: null }, "2030-01-01")).toBe(true)
})

test("period recovery rests four days, then trains light for three", () => {
  const period = createInjury(PERIOD_AREA, "2026-11-08")
  expect(period.endDate).toBe("2026-11-14")
  expect(periodPhase(period, "2026-11-11")).toBe("rest")
  expect(periodPhase(period, "2026-11-12")).toBe("light")
  expect(periodPhase(period, "2026-11-14")).toBe("light")
  expect(periodPhase(period, "2026-11-15")).toBeNull()
})

test("describes each injury by what changes in the plan", () => {
  const shoulder = createInjury("Shoulder")
  expect(injuryEffect(shoulder)).toBe("Shoulder exercises: 3 → 2 sets")
  expect(injuryEffect({ ...shoulder, mode: "exclude" })).toBe(
    "Shoulder exercises are removed from your plan",
  )
  expect(injuryEffect(createInjury(PERIOD_AREA))).toBe("Rest 4 days, then light 3 days")
  expect(injuryTitle([shoulder])).toBe("Shoulder recovery")
  expect(injuryTitle([shoulder, createInjury("Knee")])).toBe("2 injuries")
})

test("adds each area once and removes it again", () => {
  const { add, remove } = useInjuries.getState()
  add("Wrist")
  add("Wrist")
  expect(useInjuries.getState().injuries.map((injury) => injury.area)).toEqual(["Wrist"])
  remove("Wrist")
  expect(useInjuries.getState().injuries).toEqual([])
})
