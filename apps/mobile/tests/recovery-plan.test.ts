import {
  affects,
  createInjury,
  injuryEffect,
  injuryTitle,
  isActive,
  PERIOD_AREA,
  phaseOn,
  UNWELL_AREA,
  useInjuries,
} from "@/features/recovery"

jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/auth/auth-hooks", () => ({ useAuth: jest.fn() }))

beforeEach(() => useInjuries.setState({ injuries: [] }))

const start = "2026-11-08"

test("severity sets the exclude and light phases", () => {
  expect(createInjury("Knee", "Mild", start)).toEqual({
    area: "Knee",
    startDate: start,
    excludeDays: 0,
    lightDays: 7,
    permanent: null,
  })
  expect(createInjury("Knee", "Moderate", start)).toMatchObject({ excludeDays: 3, lightDays: 7 })
  expect(createInjury("Knee", "Severe", start)).toMatchObject({ excludeDays: 7, lightDays: 14 })
})

test("recovery runs exclude, then light, then back to normal", () => {
  const knee = createInjury("Knee", "Moderate", start)
  expect(phaseOn(knee, "2026-11-07")).toBeNull()
  expect(phaseOn(knee, "2026-11-10")).toBe("exclude")
  expect(phaseOn(knee, "2026-11-11")).toBe("light")
  expect(phaseOn(knee, "2026-11-17")).toBe("light")
  expect(isActive(knee, "2026-11-18")).toBe(false)
  expect(phaseOn({ ...knee, permanent: "light" }, "2030-01-01")).toBe("light")
  expect(phaseOn({ ...knee, permanent: "exclude" }, "2030-01-01")).toBe("exclude")
})

test("period follows how the user feels; unwell is light for three", () => {
  expect(createInjury(PERIOD_AREA, "Okay, just go easier", start)).toMatchObject({
    excludeDays: 0,
    lightDays: 3,
  })
  const rough = createInjury(PERIOD_AREA, "Rough", start)
  expect(phaseOn(rough, "2026-11-09")).toBe("exclude")
  expect(phaseOn(rough, "2026-11-10")).toBe("light")
  expect(isActive(rough, "2026-11-13")).toBe(false)
  expect(createInjury(PERIOD_AREA, undefined, start)).toMatchObject({
    excludeDays: 1,
    lightDays: 3,
  })
  expect(createInjury(UNWELL_AREA, "Severe", start)).toMatchObject({ excludeDays: 0, lightDays: 3 })
})

test("areas match exercises by joint or muscle tag", () => {
  const curl = { joints: ["hip", "knee"], muscles: ["hamstrings"] }
  expect(affects("Hamstring", curl)).toBe(true)
  expect(affects("Knee", curl)).toBe(true)
  expect(affects("Calf", curl)).toBe(false)
  expect(affects(UNWELL_AREA, curl)).toBe(true)
})

test("describes what changes in the plan today", () => {
  const knee = createInjury("Knee", "Moderate", start)
  expect(injuryEffect(knee, start)).toBe(
    "Knee exercises are removed from your plan until Nov 10, then 3 → 2 sets until Nov 17",
  )
  expect(injuryEffect(knee, "2026-11-12")).toBe("Knee exercises: 3 → 2 sets until Nov 17")
  expect(injuryEffect({ ...knee, permanent: "exclude" }, start)).toBe(
    "Knee exercises are removed from your plan",
  )
  expect(injuryEffect(createInjury(PERIOD_AREA, "Tired or crampy", start), start)).toBe(
    "Rest today, then all exercises 3 → 2 sets until Nov 11",
  )
  expect(injuryEffect(createInjury(PERIOD_AREA, "Rough", start), start)).toBe(
    "Rest until Nov 9, then all exercises 3 → 2 sets until Nov 12",
  )
  expect(injuryEffect(createInjury(UNWELL_AREA, "Mild", start), start)).toBe(
    "All exercises: 3 → 2 sets until Nov 10",
  )
  expect(injuryTitle([knee])).toBe("Knee recovery")
  expect(injuryTitle([knee, createInjury("Calf")])).toBe("2 injuries")
})

test("adds each area once and removes it again", () => {
  const { add, remove } = useInjuries.getState()
  add("Wrist")
  add("Wrist")
  expect(useInjuries.getState().injuries.map((injury) => injury.area)).toEqual(["Wrist"])
  remove("Wrist")
  expect(useInjuries.getState().injuries).toEqual([])
})
