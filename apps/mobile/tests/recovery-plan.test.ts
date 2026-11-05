import { createRecovery, dateKey, PERIOD_AREA, recoveryProgress } from "@/features/health"
import type { RecoveryPlan } from "@/features/health"

jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/auth/auth-hooks", () => ({ useAuth: jest.fn() }))

const plan = (restDays: number, lightDays: number): RecoveryPlan => ({
  area: "Right knee",
  note: "",
  restDays,
  lightDays,
  startDate: "2026-11-01",
  start: "Nov 1",
  returnDate: "",
})
const day = (date: number) => new Date(2026, 10, date, 9)

describe("recoveryProgress", () => {
  test("is empty before the plan starts", () => {
    expect(recoveryProgress(plan(2, 3), new Date(2026, 9, 31, 9))).toEqual([0, 0, 0])
  })

  test("fills the rest stage first, then rehab, then return", () => {
    expect(recoveryProgress(plan(2, 4), day(1))).toEqual([0, 0, 0])
    expect(recoveryProgress(plan(2, 4), day(2))).toEqual([0.5, 0, 0])
    expect(recoveryProgress(plan(2, 4), day(3))).toEqual([1, 0, 0])
    expect(recoveryProgress(plan(2, 4), day(5))).toEqual([1, 0.5, 0])
    expect(recoveryProgress(plan(2, 4), day(7))).toEqual([1, 1, 1])
  })

  test("a zero-length stage is complete once the plan has started", () => {
    expect(recoveryProgress(plan(0, 3), day(1))).toEqual([1, 0, 0])
    expect(recoveryProgress(plan(2, 0), day(3))).toEqual([1, 1, 1])
  })
})

describe("createRecovery", () => {
  test("period recovery is 3 rest and 4 light days starting today", () => {
    const period = createRecovery(PERIOD_AREA)
    expect(period).toMatchObject({
      area: PERIOD_AREA,
      restDays: 3,
      lightDays: 4,
      startDate: dateKey(),
    })
  })

  test("injury areas start with no days until the user sets them", () => {
    expect(createRecovery("Lower back")).toMatchObject({
      restDays: 0,
      lightDays: 0,
    })
  })
})
