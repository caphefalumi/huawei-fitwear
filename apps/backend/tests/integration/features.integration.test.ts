import { beforeEach, describe, expect, it } from "bun:test"
import { app, setTestDatabaseBinding } from "../helpers/test-app"
import { createTestDatabase } from "../helpers/test-db"
import { createTestKv } from "../helpers/test-kv"
import { Meals } from "../../src/modules/meals/service"

let d1: D1Database
const request = (path: string, token?: string, method = "GET", body?: unknown) =>
  app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
  )
async function account(email = "features@fitwear.dev") {
  const response = await request("/auth/sign-up", undefined, "POST", {
    email,
    password: "Password123!",
    name: "Feature Tester",
  })
  expect(response.status).toBe(200)
  return response.json() as Promise<{ user: { id: string }; session: { token: string } }>
}
const foodItem = {
  foodName: "Rice",
  estimatedWeightG: 100,
  caloriesKcal: 130,
  proteinG: 2.7,
  carbsG: 28,
  fatG: 0.3,
}

describe("Persistent feature APIs", () => {
  beforeEach(() => {
    ;({ d1 } = createTestDatabase())
    setTestDatabaseBinding({ DB: d1, fitwear_kv: createTestKv() })
  })

  it("protects every private feature route", async () => {
    for (const path of [
      "/meals",
      "/meals/summary",
      "/targets",
      "/health/weights",
      "/health/recovery",
      "/workouts",
      "/workouts/stats",
    ]) {
      expect((await request(path)).status).toBe(401)
    }
    for (const [path, method, body] of [
      ["/health/weight", "PUT", { weightKg: 70 }],
      [
        "/health/recovery",
        "PUT",
        { area: "Knee", restDays: 1, lightDays: 2, startDate: "2026-01-01" },
      ],
      ["/workouts", "POST", { sessionTitle: "Chest", workoutSplit: "Chest" }],
    ] as const)
      expect((await request(path, undefined, method, body)).status).toBe(401)
  })

  it("applies actual migrations and serves the complete seeded catalogue with guides", async () => {
    const { session } = await account()
    const response = await request("/exercises?limit=200", session.token)
    const { exercises } = await response.json()
    expect(exercises.length).toBeGreaterThanOrEqual(29)
    expect(
      exercises.find((exercise: { id: string }) => exercise.id === "bench-press").cues.length,
    ).toBeGreaterThan(0)
    expect(
      exercises.find((exercise: { id: string }) => exercise.id === "plank").repetitionUnit,
    ).toBe("seconds")
    expect(
      exercises.some((exercise: { muscleGroup: string }) => exercise.muscleGroup === "Shoulders"),
    ).toBe(true)
    const { foods } = await (await request("/foods?q=rice", session.token)).json()
    expect(foods.length).toBeGreaterThan(0)
    expect(foods.every((food: { caloriesPer100: number }) => food.caloriesPer100 > 0)).toBe(true)
    const page = await (await request("/exercises?limit=1&offset=1", session.token)).json()
    expect(page.exercises[0].id).toBe(exercises[1].id)
    expect(page.count).toBe(exercises.length)
  })

  it("persists meal correction, isolates items and deletes the last item", async () => {
    const own = await account()
    const other = await account("other@fitwear.dev")
    const created = await request("/meals", own.session.token, "POST", {
      mealType: "lunch",
      targetDate: "2026-01-10",
      items: [{ ...foodItem, servingUnit: "ml" }],
    })
    expect(created.status).toBe(200)
    const meal = await created.json()
    expect((await request(`/meals/${meal.id}`, other.session.token)).status).toBe(404)
    expect(
      (
        await request(`/meals/${meal.id}/items/${meal.items[0].id}`, other.session.token, "PATCH", {
          caloriesKcal: 999,
        })
      ).status,
    ).toBe(404)
    const corrected = await (
      await request(`/meals/${meal.id}/items/${meal.items[0].id}`, own.session.token, "PATCH", {
        correctedWeightG: 150,
        caloriesKcal: 195,
      })
    ).json()
    expect(corrected.totals.caloriesKcal).toBe(195)
    const restored = await (await request(`/meals/${meal.id}`, own.session.token)).json()
    expect(restored.items[0].correctedWeightG).toBe(150)
    expect(restored.items[0].servingUnit).toBe("ml")
    const summary = await (
      await request("/meals/summary?date=2026-01-10", own.session.token)
    ).json()
    expect(summary.consumed.caloriesKcal).toBe(195)
    expect(summary.mealCount).toBe(1)
    expect((await request(`/meals/${meal.id}`, other.session.token, "DELETE")).status).toBe(404)
    expect(
      (await request(`/meals/${meal.id}/items/${meal.items[0].id}`, own.session.token, "DELETE"))
        .status,
    ).toBe(200)
    expect((await request(`/meals/${meal.id}`, own.session.token)).status).toBe(404)
  })

  it("summarizes more than one hundred meals without silently truncating", async () => {
    const own = await account()
    for (let i = 0; i < 101; i++)
      await Meals.create(
        own.user.id,
        { mealType: "snack", targetDate: "2026-01-10", items: [foodItem] },
        d1,
      )
    const summary = await (
      await request("/meals/summary?date=2026-01-10", own.session.token)
    ).json()
    expect(summary.mealCount).toBe(101)
    expect(summary.consumed.caloriesKcal).toBe(13130)
    const other = await account("other-summary@fitwear.dev")
    expect(
      (await (await request("/meals/summary?date=2026-01-10", other.session.token)).json())
        .mealCount,
    ).toBe(0)
  })

  it("upserts daily weight and keeps profile synchronized to the newest date, not the latest edit", async () => {
    const own = await account()
    const token = own.session.token
    await request("/health/weight", token, "PUT", { date: "2026-01-02", weightKg: 72 })
    await request("/health/weight", token, "PUT", { date: "2026-01-01", weightKg: 74 })
    await request("/health/weight", token, "PUT", { date: "2026-01-01", weightKg: 73 })
    const { weights } = await (
      await request("/health/weights?from=2026-01-01&to=2026-01-02", token)
    ).json()
    expect(weights.map((row: { weightKg: number }) => row.weightKg)).toEqual([73, 72])
    expect((await (await request("/user/me", token)).json()).currentWeightKg).toBe(72)
    const other = await account("other-weight@fitwear.dev")
    expect((await (await request("/health/weights", other.session.token)).json()).weights).toEqual(
      [],
    )
    expect(
      (await request("/health/weight", token, "PUT", { date: "2026-02-30", weightKg: 70 })).status,
    ).toBe(400)
    expect((await request("/health/weights?from=2026-02-01&to=2026-01-01", token)).status).toBe(400)
    expect((await request("/health/weight", token, "PUT", { weightKg: -1 })).status).toBe(422)
  })

  it("persists a single recovery plan per user and deletes only the caller plan", async () => {
    const own = await account()
    const other = await account("other-recovery@fitwear.dev")
    const body = {
      area: "Right knee",
      note: "Avoid impact",
      restDays: 3,
      lightDays: 4,
      startDate: "2026-01-01",
    }
    const first = await (await request("/health/recovery", own.session.token, "PUT", body)).json()
    const updated = await (
      await request("/health/recovery", own.session.token, "PUT", { ...body, restDays: 2 })
    ).json()
    expect(updated.recovery.id).toBe(first.recovery.id)
    expect(updated.recovery.restDays).toBe(2)
    expect(
      (await (await request("/health/recovery", other.session.token)).json()).recovery,
    ).toBeNull()
    await request("/health/recovery", other.session.token, "DELETE")
    expect(
      (await (await request("/health/recovery", own.session.token)).json()).recovery.note,
    ).toBe("Avoid impact")
    await request("/health/recovery", own.session.token, "DELETE")
    expect(
      (await (await request("/health/recovery", own.session.token)).json()).recovery,
    ).toBeNull()
  })

  it("persists set CRUD, prevents cross-user access and aggregates completed workouts only", async () => {
    const own = await account()
    const other = await account("other-workouts@fitwear.dev")
    const token = own.session.token
    const workout = await (
      await request("/workouts", token, "POST", {
        sessionTitle: "Chest",
        workoutSplit: "Chest",
        startedAt: "2026-01-10T10:00:00Z",
      })
    ).json()
    const path = `/workouts/${workout.id}`
    const created = await (
      await request(`${path}/sets`, token, "POST", {
        exerciseId: "bench-press",
        weightKg: 30,
        userConfirmedReps: 10,
      })
    ).json()
    expect(created.sets[0].setIndex).toBe(1)
    expect(created.sets[0].exercise.name).toBe("Bench press")
    const setPath = `${path}/sets/${created.sets[0].id}`
    for (const [suffix, method, body] of [
      ["", "GET", undefined],
      ["", "DELETE", undefined],
      ["/complete", "POST", {}],
      ["/sets", "POST", { exerciseId: "bench-press", weightKg: 10, userConfirmedReps: 1 }],
      [`/sets/${created.sets[0].id}`, "PATCH", { weightKg: 100 }],
      [`/sets/${created.sets[0].id}`, "DELETE", undefined],
    ] as const)
      expect((await request(path + suffix, other.session.token, method, body)).status).toBe(404)
    expect(
      (
        await request(`${path}/sets`, token, "POST", {
          exerciseId: "bench-press",
          setIndex: 1,
          weightKg: 30,
          userConfirmedReps: 10,
        })
      ).status,
    ).toBe(409)
    expect(
      (
        await request(`${path}/sets`, token, "POST", {
          exerciseId: "not-a-real-exercise",
          weightKg: 30,
          userConfirmedReps: 10,
        })
      ).status,
    ).toBe(404)
    await request(setPath, token, "PATCH", { weightKg: 32.5, userConfirmedReps: 12 })
    expect((await (await request("/workouts/stats", token)).json()).sessionCount).toBe(0)
    expect(
      (await request(`${path}/complete`, token, "POST", { completedAt: "2026-01-10T09:00:00Z" }))
        .status,
    ).toBe(400)
    expect(
      (
        await request(`${path}/complete`, token, "POST", {
          avgHeartRateBpm: 150,
          maxHeartRateBpm: 100,
        })
      ).status,
    ).toBe(400)
    const completed = await (
      await request(`${path}/complete`, token, "POST", {
        completedAt: "2026-01-10T10:30:00Z",
        avgHeartRateBpm: 120,
        maxHeartRateBpm: 155,
      })
    ).json()
    const repeated = await (await request(`${path}/complete`, token, "POST", {})).json()
    expect(repeated.completedAt).toBe(completed.completedAt)
    const stats = await (
      await request("/workouts/stats?from=2026-01-10&to=2026-01-10", token)
    ).json()
    expect(stats).toMatchObject({
      sessionCount: 1,
      totalSets: 1,
      totalReps: 12,
      totalVolumeKg: 390,
      totalDurationSeconds: 1800,
    })
    expect(stats.byDate[0].date).toBe("2026-01-10")
    expect((await (await request("/workouts/stats", other.session.token)).json()).totalSets).toBe(0)
    await request(`${path}/sets`, token, "POST", {
      exerciseId: "plank",
      weightKg: 0,
      userConfirmedReps: 40,
    })
    const timed = await (await request("/workouts/stats", token)).json()
    expect(timed.totalSets).toBe(2)
    expect(timed.totalReps).toBe(12)
    await request(setPath, token, "DELETE")
    expect((await (await request("/workouts/stats", token)).json()).totalVolumeKg).toBe(0)
    await request(path, token, "DELETE")
    expect((await request(path, token)).status).toBe(404)
    expect((await (await request("/workouts", token)).json()).sessions).toEqual([])
    expect(
      (await d1.prepare("SELECT count(*) AS count FROM workout_sets").first<{ count: number }>())
        ?.count,
    ).toBe(0)
  })
})
