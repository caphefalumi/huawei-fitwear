import assert from "node:assert/strict";

const baseURL = (process.env.SMOKE_API_URL ?? "http://127.0.0.1:8788").replace(/\/$/, "");
const email = `smoke_${crypto.randomUUID()}@fitwear.dev`;
let token: string | undefined;
let otherToken: string | undefined;
let mealId: string | undefined;
let workoutId: string | undefined;
const today = new Date().toISOString().slice(0, 10);

async function request(path: string, method = "GET", body?: unknown, bearer = token) {
  return fetch(baseURL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function json(path: string, method = "GET", body?: unknown, bearer = token) {
  const response = await request(path, method, body, bearer);
  const text = await response.text();
  assert.equal(response.status, 200, `${method} ${path}: ${response.status} ${text}`);
  return JSON.parse(text);
}

try {
  const account = await json("/auth/sign-up", "POST", {
    email,
    password: "WorkerSmoke123!",
    name: "Worker Smoke",
    birthDate: "1994-04-12",
  });
  token = account.session.token;
  const profile = await json("/auth/update-user", "PUT", { heightCm: 175, weeklySessions: 4 });
  assert.equal(profile.weeklySessions, 4);
  await json("/health/weight", "PUT", { weightKg: 73.2, date: today });
  assert.equal((await json("/user/me")).currentWeightKg, 73.2);
  await json("/health/recovery", "PUT", {
    area: "Right shoulder",
    restDays: 2,
    lightDays: 3,
    startDate: today,
  });
  assert.equal((await json("/health/recovery")).recovery.area, "Right shoulder");
  await json("/targets", "PUT", {
    date: today,
    calorieTargetKcal: 2100,
    proteinTargetG: 140,
    carbsTargetG: 250,
    fatTargetG: 60,
  });
  const photo = await Bun.file(
    new URL("../../mobile/assets/images/meals/meal-photo.png", import.meta.url),
  ).bytes();
  const image = { data: Buffer.from(photo).toString("base64"), mimeType: "image/png" };
  const meal = await json("/meals", "POST", {
    mealType: "lunch",
    targetDate: today,
    image,
    items: [
      {
        foodName: "Rice",
        estimatedWeightG: 200,
        caloriesKcal: 260,
        proteinG: 5,
        carbsG: 57,
        fatG: 1,
        servingUnit: "g",
      },
    ],
  });
  mealId = meal.id;
  assert.equal(
    (await json(`/meals/${mealId}/photo`)).imageUrl,
    `data:image/png;base64,${image.data}`,
  );
  assert.equal((await json(`/meals/summary?date=${today}`)).remaining.caloriesKcal, 1840);
  const corrected = await json(`/meals/${mealId}/items/${meal.items[0].id}`, "PATCH", {
    correctedWeightG: 150,
    caloriesKcal: 195,
  });
  assert.equal(corrected.totals.caloriesKcal, 195);

  const exercise = (await json("/exercises?q=Bench")).exercises[0];
  const workout = await json("/workouts", "POST", {
    sessionTitle: "Chest smoke",
    workoutSplit: "Chest",
  });
  workoutId = workout.id;
  await json(`/workouts/${workoutId}/sets`, "POST", {
    exerciseId: exercise.id,
    weightKg: 40,
    userConfirmedReps: 10,
  });
  await json(`/workouts/${workoutId}/complete`, "POST", {});
  const stats = await json("/workouts/stats");
  assert.equal(stats.sessionCount, 1);
  assert.equal(stats.totalVolumeKg, 400);

  const other = await json(
    "/auth/sign-up",
    "POST",
    { email: `other_${email}`, password: "WorkerSmoke123!" },
    undefined,
  );
  otherToken = other.session.token;
  assert.equal((await request(`/meals/${mealId}/photo`, "GET", undefined, otherToken)).status, 404);
  assert.equal((await request(`/workouts/${workoutId}`, "GET", undefined, otherToken)).status, 404);
  if (process.env.SMOKE_ANALYZE === "1") {
    const analysis = await json("/meals/analyze", "POST", {
      image: image.data,
      mimeType: image.mimeType,
      description: "Lunch on a plate. Estimate ingredients and portions for review.",
    });
    assert.ok(
      analysis.items.some((item: { foodName: string }) =>
        /rice|chicken|vegetable|broccoli|food|beef/i.test(item.foodName),
      ),
      "Expected food recognition in the meal fixture",
    );
    console.log("Workers AI recognition:", JSON.stringify(analysis));
  }
  console.log(
    `Worker smoke passed: auth, profile, targets, meals, private R2 photo, weight, recovery, workouts, isolation at ${baseURL}`,
  );
} finally {
  if (mealId) await json(`/meals/${mealId}`, "DELETE");
  if (workoutId) await json(`/workouts/${workoutId}`, "DELETE");
  if (token) {
    await json("/health/recovery", "DELETE");
    await json(`/targets?date=${today}`, "DELETE");
    await json("/auth/sign-out", "POST");
    assert.equal((await request("/user/me")).status, 401);
  }
  if (otherToken) await json("/auth/sign-out", "POST", undefined, otherToken);
  console.log(`Smoke accounts (sessions revoked): ${email}, other_${email}`);
}
