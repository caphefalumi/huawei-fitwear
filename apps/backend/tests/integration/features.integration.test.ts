import { beforeEach, describe, expect, it, spyOn } from "bun:test"

import { Meals } from "../../src/modules/meals/service"
import { app, setTestDatabaseBinding } from "../helpers/test-app"
import { createTestDatabase } from "../helpers/test-db"
import { createTestKv } from "../helpers/test-kv"

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

  it("keeps legacy food numeric and returns identity and partial nutrition for known barcodes", async () => {
    const { session } = await account()
    const requestProduct = (barcode: string) => request(`/foods/barcode/${barcode}`, session.token)
    const upstream = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        Response.json({
          status: 1,
          product: {
            product_name: "Orange juice",
            product_quantity_unit: "ml",
            nutriments: {
              "energy-kj_100g": 167.36,
              proteins_100g: 0.5,
              carbohydrates_100g: 9,
              fat_100g: 0,
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          status: 1,
          product: { product_name: "Bánh Quy Quasure Light Hộp 140g" },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          status: 1,
          product: {
            product_name: "Packaged snack",
            brands: "Example Brand",
            nutriments: { "energy-kcal_100g": 145, proteins_100g: null, fat_100g: 0 },
          },
        }),
      )
      .mockResolvedValueOnce(Response.json({ status: 0 }, { status: 404 }))
      .mockResolvedValueOnce(new Response(null, { status: 429 }))
    try {
      expect((await request("/foods/barcode/012345678905")).status).toBe(401)
      expect((await requestProduct("bad-code")).status).toBe(422)
      expect(upstream).not.toHaveBeenCalled()
      const result = await requestProduct("012345678905")
      expect(result.status).toBe(200)
      const complete = await result.json()
      expect(complete.food).toEqual({
        id: "off-012345678905",
        glyph: "droplet",
        name: "Orange juice",
        servingUnit: "ml",
        caloriesPer100: 40,
        proteinPer100G: 0.5,
        carbsPer100G: 9,
        fatPer100G: 0,
      })
      expect(complete.product).toEqual({
        name: "Orange juice",
        servingUnit: "ml",
        per100: { kcal: 40, protein: 0.5, carbs: 9, fat: 0 },
      })
      expect(String(upstream.mock.calls[0][0])).toContain("/product/012345678905.json")
      expect(await (await requestProduct("8934609206834")).json()).toEqual({
        food: null,
        product: { name: "Bánh Quy Quasure Light Hộp 140g", servingUnit: "g", per100: {} },
      })
      expect(String(upstream.mock.calls[1][0])).toContain("/product/8934609206834.json")
      expect(await (await requestProduct("1000000000001")).json()).toEqual({
        food: null,
        product: {
          name: "Packaged snack",
          brand: "Example Brand",
          servingUnit: "g",
          per100: { kcal: 145, fat: 0 },
        },
      })
      expect(await (await requestProduct("012345678906")).json()).toEqual({ food: null })
      expect((await requestProduct("012345678907")).status).toBe(502)
    } finally {
      upstream.mockRestore()
    }
  })

  it("limits meal analysis per authenticated user before invoking AI", async () => {
    let calls = 0
    const ai = {
      run: async () => {
        calls += 1
        return { choices: [{ message: { content: '{"items":[]}' } }] }
      },
    } as unknown as Ai
    setTestDatabaseBinding({ DB: d1, fitwear_kv: createTestKv(), AI: ai })
    const { session } = await account()
    const other = await account("other@fitwear.dev")
    const image = { image: btoa("RIFF\0\0\0\0WEBPVP8 "), mimeType: "image/webp" }
    const analyze = (token?: string) => request("/meals/analyze", token, "POST", image)

    expect((await analyze()).status).toBe(401)
    for (let i = 0; i < 10; i += 1) {
      expect((await analyze(session.token)).status).toBe(200)
    }
    const limited = await analyze(session.token)
    expect(limited.status).toBe(429)
    expect(Number(limited.headers.get("Retry-After"))).toBeGreaterThan(0)
    expect((await analyze(other.session.token)).status).toBe(200)
    expect(calls).toBe(11)
  })

  it("keeps photos private and transcribes labels independently of meal estimating", async () => {
    const objects = new Map<string, Blob>()
    const bucket = {
      async put(key: string, value: Blob | ReadableStream) {
        objects.set(key, value instanceof Blob ? value : await new Response(value).blob())
      },
      async get(key: string) {
        const blob = objects.get(key)
        return blob
          ? {
              uploaded: new Date(),
              size: blob.size,
              httpMetadata: { contentType: "image/webp" },
              body: blob.stream(),
              arrayBuffer: () => blob.arrayBuffer(),
            }
          : null
      },
    } as unknown as R2Bucket
    const aiInputs: unknown[] = []
    let aiOutput = '{"items":[]}'
    const ai = {
      run: async (_model: string, input: unknown) => {
        aiInputs.push(input)
        return { choices: [{ message: { content: aiOutput } }] }
      },
    } as unknown as Ai
    setTestDatabaseBinding({ DB: d1, fitwear_kv: createTestKv(), MEAL_IMAGES: bucket, AI: ai })
    const owner = (await account()).session.token
    const stranger = (await account("other@fitwear.dev")).session.token
    const upload = (bytes: string, type: string) => {
      const form = new FormData()
      form.append("image", new Blob([bytes], { type }), "meal.webp")
      return app.handle(
        new Request("http://localhost/meals/photos", {
          method: "POST",
          headers: { Authorization: `Bearer ${owner}` },
          body: form,
        }),
      )
    }
    expect((await upload("not WebP", "image/webp")).status).toBe(400)
    const uploaded = await upload("RIFF\0\0\0\0WEBPVP8 ", "image/webp")
    expect(uploaded.status).toBe(200)
    const { photoId } = await uploaded.json()
    expect((await request("/meals/analyze", stranger, "POST", { photoId })).status).toBe(404)
    expect((await request("/meals/analyze", owner, "POST", { photoId })).status).toBe(200)
    expect(JSON.stringify(aiInputs[0])).not.toContain("Estimated volume from LiDAR")
    expect(
      (await request("/meals/analyze", owner, "POST", { photoId, portionVolumeMl: 180 })).status,
    ).toBe(200)
    expect(JSON.stringify(aiInputs[1])).toContain("one central portion: 180 mL")
    expect(
      (await request("/meals/analyze", owner, "POST", { photoId, portionVolumeMl: -10 })).status,
    ).toBe(422)
    expect(aiInputs).toHaveLength(2)
    const label = (token?: string) => request("/meals/analyze-label", token, "POST", { photoId })
    expect((await label()).status).toBe(401)
    expect((await label(stranger)).status).toBe(404)
    expect(aiInputs).toHaveLength(2)

    aiOutput = JSON.stringify({
      name: "Drink",
      basis: { kind: "serving", unit: "ml", amount: 250 },
      nutrition: { energy: { value: 418.4, unit: "kJ" }, protein: null, carbs: 5.5, fat: 0 },
    })
    const labelResponse = await label(owner)
    expect(labelResponse.status).toBe(200)
    expect(await labelResponse.json()).toEqual({
      name: "Drink",
      basis: { kind: "serving", unit: "ml", amount: 250 },
      nutrition: { kcal: 100, protein: null, carbs: 5.5, fat: 0 },
    })
    expect(JSON.stringify(aiInputs[2])).toContain("Transcribe only")
    expect(JSON.stringify(aiInputs[2])).not.toContain("Estimate the pictured meal")

    aiOutput = JSON.stringify({
      name: null,
      basis: null,
      nutrition: { energy: { value: 200, unit: "kcal" }, protein: 1, carbs: 5, fat: 0 },
    })
    expect(await (await label(owner)).json()).toEqual({
      name: null,
      basis: null,
      nutrition: { kcal: null, protein: null, carbs: null, fat: null },
    })
    const meal = { mealType: "lunch", items: [foodItem], photoId }
    expect((await request("/meals", stranger, "POST", meal)).status).toBe(404)
    const saved = await request("/meals", owner, "POST", meal)
    expect(saved.status).toBe(200)
    const { imageUrl } = await saved.json()
    const photo = await request(imageUrl, owner)
    expect(await photo.json()).toEqual({
      imageUrl: `data:image/webp;base64,${btoa("RIFF\0\0\0\0WEBPVP8 ")}`,
    })
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

  it("moves a meal to another time and day", async () => {
    const own = await account()
    const other = await account("other-move@fitwear.dev")
    const meal = await (
      await request("/meals", own.session.token, "POST", {
        mealType: "breakfast",
        targetDate: "2026-01-10",
        loggedAt: "2026-01-10T08:00:00.000Z",
        items: [foodItem],
      })
    ).json()
    const path = `/meals/${meal.id}`

    expect(
      (await request(path, other.session.token, "PATCH", { loggedAt: "2026-01-09T07:30:00.000Z" }))
        .status,
    ).toBe(404)
    const future = new Date(Date.now() + 60 * 60_000).toISOString()
    expect((await request(path, own.session.token, "PATCH", { loggedAt: future })).status).toBe(400)
    expect(
      (
        await request(path, own.session.token, "PATCH", {
          loggedAt: "2026-01-09T07:30:00.000Z",
          targetDate: "2026-01-05",
        })
      ).status,
    ).toBe(400)

    const moved = await (
      await request(path, own.session.token, "PATCH", {
        loggedAt: "2026-01-09T07:30:00.000Z",
        targetDate: "2026-01-09",
      })
    ).json()
    expect(moved.targetDate).toBe("2026-01-09")
    expect(new Date(moved.loggedAt).toISOString()).toBe("2026-01-09T07:30:00.000Z")
    const summary = (date: string) =>
      request(`/meals/summary?date=${date}`, own.session.token).then((response) => response.json())
    expect((await summary("2026-01-10")).mealCount).toBe(0)
    expect((await summary("2026-01-09")).mealCount).toBe(1)

    // A local day one ahead of UTC is accepted for the same instant.
    const local = await request(path, own.session.token, "PATCH", {
      loggedAt: "2026-01-09T20:00:00.000Z",
      targetDate: "2026-01-10",
    })
    expect(local.status).toBe(200)
    expect((await local.json()).targetDate).toBe("2026-01-10")
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

  it("asks for a complete profile instead of guessing targets", async () => {
    const own = await account()
    const token = own.session.token

    const incomplete = await (await request("/targets", token)).json()
    expect(incomplete.profileComplete).toBe(false)
    expect(incomplete.targets).toBeNull()
    expect(incomplete.missingFields).toEqual([
      "gender",
      "birthDate",
      "heightCm",
      "currentWeightKg",
      "activityLevel",
      "fitnessGoal",
    ])

    await Meals.create(
      own.user.id,
      { mealType: "lunch", targetDate: "2026-01-10", items: [foodItem] },
      d1,
    )
    const summary = await (await request("/meals/summary?date=2026-01-10", token)).json()
    expect(summary.profileComplete).toBe(false)
    expect(summary.targets).toBeNull()
    expect(summary.remaining).toBeNull()
    expect(summary.consumed.caloriesKcal).toBe(130)
    expect(summary.mealCount).toBe(1)
  })

  it("derives rounded targets from the profile and ignores stored daily targets", async () => {
    const own = await account()
    const token = own.session.token
    const update = await request("/auth/update-user", token, "PUT", {
      gender: "male",
      birthDate: "1990-01-01",
      heightCm: 175,
      currentWeightKg: 70,
      activityLevel: "moderately_active",
      fitnessGoal: "weight_loss",
    })
    expect(update.status).toBe(200)

    const resolved = await (await request("/targets?date=2026-01-10", token)).json()
    expect(resolved.profileComplete).toBe(true)
    expect(resolved.missingFields).toEqual([])
    expect(resolved.targets.calorieTargetKcal % 10).toBe(0)
    expect(resolved.targets.proteinTargetG).toBe(140)

    // A stored override for the day must not change what the dashboard receives.
    const stored = await request("/targets", token, "PUT", {
      date: "2026-01-10",
      calorieTargetKcal: 1800,
      proteinTargetG: 100,
      carbsTargetG: 200,
      fatTargetG: 50,
    })
    expect(stored.status).toBe(200)
    expect((await (await request("/targets?date=2026-01-10", token)).json()).targets).toEqual(
      resolved.targets,
    )

    await Meals.create(
      own.user.id,
      { mealType: "lunch", targetDate: "2026-01-10", items: [foodItem] },
      d1,
    )
    const summary = await (await request("/meals/summary?date=2026-01-10", token)).json()
    expect(summary.targets).toEqual(resolved.targets)
    expect(summary.remaining.caloriesKcal).toBe(resolved.targets.calorieTargetKcal - 130)
    expect(summary.remaining.proteinG).toBe(137)
    expect(summary.targetReached).toBe(false)
  })

  it("keeps kcal steady between 5 kg steps and moves to maintenance at the target weight", async () => {
    const own = await account()
    const token = own.session.token
    await request("/auth/update-user", token, "PUT", {
      gender: "male",
      birthDate: "1990-01-01",
      heightCm: 175,
      currentWeightKg: 80,
      targetWeightKg: 70,
      activityLevel: "moderately_active",
      fitnessGoal: "weight_loss",
    })
    const kcal = async () => {
      const body = await (await request("/targets", token)).json()
      return { kcal: body.targets.calorieTargetKcal as number, reached: body.targetReached }
    }
    const log = (date: string, weightKg: number) =>
      request("/health/weight", token, "PUT", { date, weightKg })

    const start = await kcal()
    expect(start.reached).toBe(false)

    // Scale noise below 5 kg changes nothing.
    await log("2026-01-01", 78)
    expect(await kcal()).toEqual(start)

    // 5 kg down: calculated again from the new weight.
    await log("2026-01-02", 75)
    const stepped = await kcal()
    expect(stepped.kcal).toBeLessThan(start.kcal)
    expect(stepped.reached).toBe(false)

    // Target reached: the goal counts as maintenance, so kcal goes up.
    await log("2026-01-03", 70)
    const reached = await kcal()
    expect(reached.reached).toBe(true)
    expect(reached.kcal).toBeGreaterThan(start.kcal)
    const summary = await (await request("/meals/summary", token)).json()
    expect(summary.targetReached).toBe(true)

    // Setting a new target weight starts over from the current weight.
    await request("/auth/update-user", token, "PUT", { targetWeightKg: 65 })
    expect((await kcal()).reached).toBe(false)
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

  it("seeds every locally guided exercise without changing existing units", async () => {
    const ids = [
      "high-to-low-cable-fly",
      "push-up",
      "chest-supported-row",
      "barbell-squat",
      "hip-thrust",
      "seated-leg-curl",
      "leg-extension",
      "bulgarian-split-squat",
      "walking-lunge",
      "cable-glute-kickback",
      "hip-abduction-machine",
      "machine-shoulder-press",
      "overhead-rope-extension",
      "incline-dumbbell-curl",
      "cable-crunch",
      "pallof-press",
      "russian-twist",
      "hanging-leg-raise",
    ]
    for (const id of ids) {
      const exercise = await d1
        .prepare("SELECT id, repetitionUnit FROM exercises WHERE id = ?")
        .bind(id)
        .first<{ id: string; repetitionUnit: string }>()
      expect(exercise).toEqual({ id, repetitionUnit: "reps" })
    }
    expect(
      await d1
        .prepare("SELECT repetitionUnit FROM exercises WHERE id = 'plank'")
        .first<{ repetitionUnit: string }>(),
    ).toEqual({ repetitionUnit: "seconds" })
  })

  it("atomically saves completed workouts and safely retries without crossing ownership", async () => {
    const own = await account()
    const other = await account("other-atomic-workouts@fitwear.dev")
    const body = {
      id: "client-session-1",
      sessionTitle: "Chest",
      workoutSplit: "Push",
      startedAt: "2026-01-10T10:00:00Z",
      completedAt: "2026-01-10T10:30:00Z",
      avgHeartRateBpm: 120,
      maxHeartRateBpm: 150,
      sets: [
        {
          exerciseId: "bench-press",
          setIndex: 1,
          weightKg: 30,
          targetReps: 10,
          detectedReps: 8,
          userConfirmedReps: 9,
          restDurationSeconds: 90,
          avgHrBpm: 130,
        },
        { exerciseId: "push-up", setIndex: 2, weightKg: 0, userConfirmedReps: 12, isWarmup: true },
        { exerciseId: "plank", setIndex: 3, weightKg: 0, targetReps: 999, userConfirmedReps: 999 },
      ],
    }
    expect((await request("/workouts/completed", undefined, "POST", body)).status).toBe(401)
    const response = await request("/workouts/completed", own.session.token, "POST", body)
    expect(response.status).toBe(200)
    const saved = await response.json()
    expect(saved).toMatchObject({
      id: body.id,
      sessionTitle: body.sessionTitle,
      avgHeartRateBpm: 120,
      sets: [
        { ...body.sets[0], isWarmup: false, exercise: { id: "bench-press" } },
        { ...body.sets[1], targetReps: 10, exercise: { id: "push-up" } },
        { ...body.sets[2], isWarmup: false, exercise: { id: "plank" } },
      ],
    })
    const retry = await request("/workouts/completed", own.session.token, "POST", {
      ...body,
      sessionTitle: "Changed",
      sets: [],
    })
    expect(await retry.json()).toEqual(saved)
    expect((await request("/workouts/completed", other.session.token, "POST", body)).status).toBe(
      404,
    )
    expect((await (await request("/workouts", other.session.token)).json()).count).toBe(0)
    expect((await (await request("/workouts/stats", own.session.token)).json()).totalSets).toBe(3)

    for (const [patch, expected] of [
      [{ sets: [body.sets[0], body.sets[0]] }, 400],
      [{ sets: [{ ...body.sets[0], exerciseId: "missing" }] }, 404],
      [{ completedAt: "2026-01-10T09:00:00Z" }, 400],
      [{ avgHeartRateBpm: 160, maxHeartRateBpm: 100 }, 400],
    ] as const) {
      const invalid = await request("/workouts/completed", own.session.token, "POST", {
        ...body,
        ...patch,
        id: `invalid-${expected}-${Object.keys(patch)[0]}`,
      })
      expect(invalid.status).toBe(expected)
    }
    expect((await (await request("/workouts", own.session.token)).json()).count).toBe(1)

    await d1.exec(`CREATE TRIGGER fail_workout_set BEFORE INSERT ON workout_sets
      BEGIN SELECT RAISE(ABORT, 'injected set failure'); END;`)
    expect(
      (await request("/workouts/completed", own.session.token, "POST", { ...body, id: "rollback" }))
        .status,
    ).toBe(500)
    expect((await request("/workouts/rollback", own.session.token)).status).toBe(404)
    expect((await (await request("/workouts", own.session.token)).json()).count).toBe(1)
  })

  it("does not append sets when another request wins the session insert race", async () => {
    const own = await account()
    const batch = d1.batch.bind(d1)
    const spy = spyOn(d1, "batch").mockImplementationOnce(async (statements) => {
      await d1
        .prepare(`INSERT INTO workout_sessions
        (id, "userId", "sessionTitle", "workoutSplit", "startedAt", "completedAt", "createdAt")
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .bind("raced", own.user.id, "Winner", "Push", 1767261600, 1767265200, 1767265200)
        .run()
      return batch(statements)
    })
    try {
      const response = await request("/workouts/completed", own.session.token, "POST", {
        id: "raced",
        sessionTitle: "Loser",
        workoutSplit: "Push",
        startedAt: "2026-01-01T10:00:00Z",
        completedAt: "2026-01-01T11:00:00Z",
        sets: [{ exerciseId: "bench-press", setIndex: 1, weightKg: 50, userConfirmedReps: 10 }],
      })
      expect(response.status).toBe(200)
      expect(await response.json()).toMatchObject({ id: "raced", sessionTitle: "Winner", sets: [] })
    } finally {
      spy.mockRestore()
    }
  })

  it("returns only completed owned exercise history for progression", async () => {
    const own = await account()
    const other = await account("other-progression@fitwear.dev")
    const base = {
      sessionTitle: "Chest",
      workoutSplit: "Push",
      startedAt: "2026-01-01T10:00:00Z",
      completedAt: "2026-01-01T11:00:00Z",
      sets: [
        {
          exerciseId: "bench-press",
          setIndex: 1,
          weightKg: 60,
          targetReps: 10,
          userConfirmedReps: 10,
        },
      ],
    }
    for (const body of [
      { ...base, id: "older" },
      {
        ...base,
        id: "newer",
        startedAt: "2026-01-02T10:00:00Z",
        completedAt: "2026-01-02T11:00:00Z",
        sets: [
          { ...base.sets[0], weightKg: 50, userConfirmedReps: 8 },
          { ...base.sets[0], setIndex: 2, weightKg: 300, isWarmup: true },
          { ...base.sets[0], setIndex: 3, exerciseId: "push-up", isWarmup: true },
        ],
      },
    ])
      expect((await request("/workouts/completed", own.session.token, "POST", body)).status).toBe(
        200,
      )
    expect(
      (
        await request("/workouts/completed", other.session.token, "POST", {
          ...base,
          id: "other",
          sets: [{ ...base.sets[0], weightKg: 200 }],
        })
      ).status,
    ).toBe(200)
    const active = await (
      await request("/workouts", own.session.token, "POST", {
        sessionTitle: "Active",
        workoutSplit: "Push",
      })
    ).json()
    await request(`/workouts/${active.id}/sets`, own.session.token, "POST", {
      exerciseId: "bench-press",
      weightKg: 100,
      userConfirmedReps: 10,
    })
    expect((await request("/workouts/progression")).status).toBe(401)
    const result = await (await request("/workouts/progression", own.session.token)).json()
    expect(result.exercises).toEqual([
      {
        exerciseId: "bench-press",
        latestSessionId: "newer",
        completedAt: "2026-01-02T11:00:00.000Z",
        maxWeightKg: 60,
        sets: [{ setIndex: 1, weightKg: 50, targetReps: 10, userConfirmedReps: 8 }],
      },
    ])
    const excluded = await (
      await request("/workouts/progression?excludeSessionId=newer", own.session.token)
    ).json()
    expect(excluded.exercises[0]).toMatchObject({ latestSessionId: "older", maxWeightKg: 60 })
    expect(
      (await (await request("/workouts/progression", other.session.token)).json()).exercises[0],
    ).toMatchObject({ latestSessionId: "other", maxWeightKg: 200 })
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
