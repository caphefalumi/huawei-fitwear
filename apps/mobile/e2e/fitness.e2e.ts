import { test, expect } from "@playwright/test";

test("register, log food, reload persisted data, sign out and sign back in", async ({ page }) => {
  const email = `mobile_${crypto.randomUUID()}@fitwear.dev`;
  const password = "FitnessTest123!";
  await page.goto("/");
  await page.getByRole("link", { name: "Create account" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Mobile E2E");
  await page.getByLabel("Email", { exact: true }).filter({ visible: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).filter({ visible: true }).fill(password);
  await page.getByLabel("Date of birth", { exact: true }).fill("1994-04-12");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText("Today", { exact: true })).toBeVisible();

  await page.goto("/meal");
  await page.getByText("+ Add item", { exact: true }).click();
  await page.getByPlaceholder("Search food", { exact: true }).fill("White rice, cooked");
  await expect(page.getByText("White rice, cooked", { exact: true })).toBeVisible();
  await page.getByText("Select", { exact: true }).click();
  await page.getByText("Add Item", { exact: true }).click();
  await expect(page.getByText("White rice, cooked", { exact: true })).toBeVisible();
  await page.getByText("Log Meal", { exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  await page.goto("/meals");
  await expect(page.getByText("Lunch", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByText("Lunch", { exact: true }).click();
  await expect(page.getByText("White rice, cooked", { exact: true })).toBeVisible();

  await page.goto("/profile");
  await page.getByText("Sign out", { exact: true }).click();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await page.goto("/meals");
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  await page.goto("/meals");
  await page.getByText("Lunch", { exact: true }).click();
  await expect(page.getByText("White rice, cooked", { exact: true })).toBeVisible();

  await page.goto("/profile");
  await page.getByText("Weight", { exact: true }).click();
  await page.getByLabel("Weight in kilograms").fill("73.2");
  await page.getByText("Save update", { exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByText("73.2 kg", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("73.2 kg", { exact: true })).toBeVisible();
  await page.getByText("Recovery plan", { exact: true }).click();
  await page.getByText("Right shoulder", { exact: true }).click();
  await page.getByLabel("Rest days", { exact: true }).fill("2");
  await page.getByLabel("Light days", { exact: true }).fill("3");
  await page.getByText("Save recovery plan", { exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.reload();
  await expect(page.getByText("Right shoulder", { exact: true })).toBeVisible();

  await page.goto("/chest-plan?group=Chest");
  const createdWorkout = page.waitForResponse(
    (response) => response.url().endsWith("/workouts") && response.request().method() === "POST",
  );
  const loadedWorkout = page.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      /\/workouts\/[^/]+$/.test(new URL(response.url()).pathname),
  );
  await page.getByText("Start workout", { exact: true }).click();
  const workout = await (await createdWorkout).json();
  await loadedWorkout;
  await expect(page.getByText("Loading saved sets…")).toBeHidden();
  await page.getByText("Log set · Bench press", { exact: true }).click();
  await expect(page.getByLabel("Weight in kilograms")).toBeVisible();
  await page.getByLabel("Weight in kilograms").fill("40");
  await page.getByLabel("Completed reps").fill("10");
  await page.getByText("Save set", { exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByText("40 kg × 10 reps", { exact: true })).toBeVisible();
  await page.getByText("Finish workout", { exact: true }).click();
  await expect(page.getByText(/Started .*Finished /)).toBeVisible();
  await page.goto(`/chest-plan?sessionId=${workout.id}`);
  await expect(page.getByText("40 kg × 10 reps", { exact: true })).toBeVisible();
  await expect(page.getByText(/Started .*Finished /)).toBeVisible();
  await page.goto("/progress");
  await expect(page.getByText("73.2 kg", { exact: true })).toBeVisible();
  await expect(page.getByText(/1 completed session/)).toBeVisible();
});

test("invalid credentials remain on the login screen with an actionable error", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Email", { exact: true }).fill("absent@fitwear.dev");
  await page.getByLabel("Password", { exact: true }).fill("WrongPassword123!");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(/email or password/i);
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Forgot password?", exact: true }).click();
  await expect(page.getByText("Enter your account email.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Send reset code", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("If an account exists for that email");
});

test("reset page rejects an invalid reset code with safe copy", async ({ page }) => {
  await page.goto("http://127.0.0.1:8787/auth/reset-password");
  await page.getByLabel("Email").fill("absent@fitwear.dev");
  await page.getByLabel("Reset code").fill("12345678");
  await page.getByLabel("New password").fill("ReplacementPassword123!");
  await page.getByRole("button", { name: "Save new password", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("This reset code is invalid or expired.");
});
