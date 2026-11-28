import { ageOn, approx, bodyComposition, cunBae } from "@/features/home/utils/body-composition"

const now = new Date(2026, 10, 27)
const profile = {
  weightKg: 71.5,
  heightCm: 175,
  sex: "Male" as const,
  birthDate: "1996-11-27",
}

test("age counts whole years and waits for the birthday", () => {
  expect(ageOn("1996-11-27", now)).toBe(30)
  expect(ageOn("1996-11-28", now)).toBe(29)
  expect(ageOn("2027-01-01", now)).toBeNull()
  expect(ageOn("27/11/1996", now)).toBeNull()
  expect(ageOn(null, now)).toBeNull()
})

test("CUN-BAE matches a worked example", () => {
  const bmi = 71.5 / 1.75 ** 2
  expect(cunBae(bmi, 30, 0)).toBeCloseTo(19.4, 1)
  expect(cunBae(bmi, 30, 1)).toBeCloseTo(31.6, 1)
})

test("estimates whole-number body fat and lean mass from the profile", () => {
  expect(bodyComposition(profile, now)).toEqual({
    status: "ready",
    bodyFat: { low: 19, high: 19 },
    leanKg: { low: 58, high: 58 },
  })
})

test("gives a range when sex is not given", () => {
  const result = bodyComposition({ ...profile, sex: "Rather not say" }, now)
  expect(result).toEqual({
    status: "ready",
    bodyFat: { low: 19, high: 32 },
    leanKg: { low: 49, high: 58 },
  })
  if (result.status === "ready") {
    expect(approx(result.bodyFat, "%")).toBe("~19-32%")
    expect(approx(result.leanKg, " kg")).toBe("~49-58 kg")
  }
  expect(approx({ low: 19, high: 19 }, "%")).toBe("~19%")
})

test("names missing profile fields and refuses inputs outside the formula", () => {
  expect(
    bodyComposition({ weightKg: null, heightCm: null, sex: null, birthDate: null }, now),
  ).toEqual({ status: "incomplete", missing: ["Sex / gender", "Birthdate", "Height", "Weight"] })
  expect(bodyComposition({ ...profile, birthDate: "2010-01-01" }, now).status).toBe("unavailable")
  expect(bodyComposition({ ...profile, weightKg: 40 }, now).status).toBe("unavailable")
})
