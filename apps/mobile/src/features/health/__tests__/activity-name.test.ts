// The health barrel pulls in native storage; the helper only needs the hooks module's constants.
jest.mock("@/features/auth", () => ({}))
jest.mock("@/lib/api/client", () => ({}))

import { ACTIVITIES, activityName } from "@/features/health/hooks/health-hooks"

test("keeps only the activity level for narrow rows", () => {
  expect(Object.values(ACTIVITIES).map(activityName)).toEqual([
    "Sedentary",
    "Light",
    "Moderate",
    "Heavy",
    "Athlete",
  ])
  expect(activityName("Moderate")).toBe("Moderate")
})
