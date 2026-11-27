import { test } from "@e2e-dev/mobile"
import { credentials, expect } from "e2e"

import {
  DEDICATED_ACCOUNT,
  type Ui,
  byId,
  byText,
  enter,
  field,
  hideKeyboard,
  launchClean,
  maybeVisible,
  openSignIn,
  scrollTo,
  setOffline,
  skipHealthConnectOffer,
  typeInto,
  waitHidden,
  waitVisible,
} from "./support"

type BirthDate = { year: string; month: string; day: string }

/**
 * Type each date field separately. A full field auto-advances focus to the next
 * one, so fill's read-back would check the wrong field; type as a person would.
 */
async function enterBirthDate({ device, screen }: Ui, date: BirthDate) {
  await typeInto(byId(screen, "sign-up-dob-year"), date.year)
  await typeInto(byId(screen, "sign-up-dob-month"), date.month)
  await typeInto(byId(screen, "sign-up-dob-day"), date.day)
  await hideKeyboard(device)
}

async function submitSignUp(screen: Ui["screen"]) {
  await scrollTo(screen, byId(screen, "sign-up-submit"), "down")
  await byId(screen, "sign-up-submit").tap()
}

/** A fresh sign-up form with name and email filled; blank fields keep no prior date. */
async function freshSignUp(ui: Ui) {
  const { device, screen } = ui
  await launchClean(ui)
  await openSignIn(screen)
  await byText(screen, "Sign up").tap()
  await waitVisible(byText(screen, "Create account"), 10000)
  await field(screen, "Your username").fill("E2E Member")
  await enter(device, field(screen, "Your email"), "e2e.member@fitwear.dev")
}

async function expectSignUpError(screen: Ui["screen"], message: string) {
  await scrollTo(screen, byText(screen, message), "up")
  await expect(byText(screen, message)).toBeVisible()
}

test(
  "shows validation, credential and offline errors",
  { tags: ["e2e", "errors"] },
  async ({ app, device, screen }) => {
    const ui = { app, device, screen }

    await launchClean(ui)
    await openSignIn(screen)

    // Empty-email reset validation stops before the request, so the dedicated
    // account is never emailed.
    await byText(screen, "Forgot password?").tap()
    await waitVisible(byText(screen, "Reset your password."), 10000)
    await hideKeyboard(device)
    await byText(screen, "Send reset code").tap()
    await expect(byText(screen, "Enter your email address.")).toBeVisible()
    await byText(screen, "Back to log in").tap()
    await waitVisible(byText(screen, "Hi, welcome back."), 10000)

    // Sign-up client validation before credential login (submit stays enabled; errors from submit()).
    await byText(screen, "Sign up").tap()
    await waitVisible(byText(screen, "Create account"), 10000)
    await byId(screen, "sign-up-submit").tap()
    await expect(byText(screen, "Enter your username.")).toBeVisible()
    await expect(byText(screen, "Enter your email address.")).toBeVisible()
    await field(screen, "Your username").fill("E2E Member")
    await field(screen, "Your email").fill("e2e.member@fitwear.dev")
    await scrollTo(screen, byId(screen, "sign-up-dob-month"), "up")
    await enterBirthDate(ui, { year: "1998", month: "03", day: "12" })
    await scrollTo(screen, byId(screen, "sign-up-password"), "down")
    await enter(device, byId(screen, "sign-up-password"), "short")
    await submitSignUp(screen)
    await expect(byText(screen, "Use at least 8 characters.")).toBeVisible()
    await scrollTo(screen, byId(screen, "sign-up-password"), "up")
    await enter(device, byId(screen, "sign-up-password"), "password123")

    // Invalid and future birth dates are rejected before the terms check.
    await scrollTo(screen, byId(screen, "sign-up-dob-year"), "up")
    await enterBirthDate(ui, { year: "1998", month: "02", day: "31" })
    await submitSignUp(screen)
    await expectSignUpError(screen, "Enter a valid date of birth.")

    await freshSignUp(ui)
    await scrollTo(screen, byId(screen, "sign-up-dob-year"), "down")
    await enterBirthDate(ui, { year: "2099", month: "01", day: "01" })
    await scrollTo(screen, byId(screen, "sign-up-password"), "down")
    await enter(device, byId(screen, "sign-up-password"), "password123")
    await submitSignUp(screen)
    await expectSignUpError(screen, "Date of birth can't be in the future.")

    await freshSignUp(ui)
    await scrollTo(screen, byId(screen, "sign-up-dob-year"), "down")
    await enterBirthDate(ui, { year: "1998", month: "03", day: "12" })
    await scrollTo(screen, byId(screen, "sign-up-password"), "down")
    await enter(device, byId(screen, "sign-up-password"), "password123")
    await submitSignUp(screen)
    await expect(
      byText(screen, "Please agree to the terms before creating an account."),
    ).toBeVisible()
    // Start the swipe on the submit button: a centre swipe lands inside the DOB
    // inputs here, and the ScrollView must receive the gesture.
    await byId(screen, "sign-up-submit").swipe({ direction: "down" })
    await scrollTo(screen, byText(screen, "Log in"), "down")
    await byText(screen, "Log in").tap()
    await waitVisible(byText(screen, "Hi, welcome back."), 10000)

    // Login validation and invalid credentials use the dedicated E2E account.
    const account = credentials.user(DEDICATED_ACCOUNT)
    const email = field(screen, "example@gmail.com")
    const password = byId(screen, "login-password")
    const submit = byId(screen, "login-submit")
    await enter(device, email, "invalid-email")
    await submit.tap()
    await expect(byText(screen, "Enter a valid email address.")).toBeVisible()
    // The placeholder is gone once the field holds a value; find it by that value.
    const typedEmail = screen
      .getByDisplayValue("invalid-email", { visible: true })
      .or(byText(screen, "invalid-email"))
      .first()
    await enter(device, typedEmail, account.username)
    await submit.tap()
    await expect(byText(screen, "Enter your password.")).toBeVisible()
    await enter(device, password, "wrong-e2e-password")
    await submit.tap()
    await expect(
      byText(screen, "We could not sign you in. Check your email and password and try again."),
    ).toBeVisible()

    // Replace the previous credential error before testing the offline failure.
    await setOffline(ui, true)
    await enter(device, password, "offline-e2e-password")
    await submit.tap()
    await waitVisible(byText(screen, "Can't connect. Check your connection and try again."), 20000)
    await setOffline(ui, false)
    await password.fill(account.password)
    await hideKeyboard(device)
    // The emulator's network can lag behind airplane mode being switched off, so a
    // first attempt may still report "Can't connect". Submit again if it does.
    let signedIn = false
    for (let attempt = 0; attempt < 4 && !signedIn; attempt += 1) {
      if (await submit.isVisible()) await submit.tap()
      await skipHealthConnectOffer(screen)
      signedIn = await maybeVisible(byText(screen, "Today"), 20000)
    }
    expect(signedIn, "signed in after the network came back").toBe(true)

    // A session the server has already validated opens offline, marked as such
    // (offline mode, #173). Reconnecting validates the token again.
    await device.closeApp()
    await device.setAirplaneMode(true)
    await app.open()
    await waitVisible(byText(screen, /^Offline mode/), 30000)
    await expect(byText(screen, "Today")).toBeVisible()
    await device.closeApp()
    await device.setAirplaneMode(false)
    await app.open()
    await waitVisible(byText(screen, "Today"), 30000)

    // Meal manual entry validation on an empty reviewed item.
    await byId(screen, "tab-meals").tap()
    await waitVisible(byText(screen, "Capture meal"), 20000)
    await byText(screen, "Capture meal").tap()
    await waitVisible(byText(screen, "Capture your meal"), 20000)
    await byText(screen, "Close Capture your meal").tap()
    await byText(screen, "Enter meal manually").tap()
    await waitVisible(byText(screen, "Log Meal"), 20000)
    await byText(screen, "+ Add item").tap()
    await waitVisible(byText(screen, "Enter nutrition manually"), 20000)
    await byText(screen, "Enter nutrition manually").tap()
    await waitVisible(byText(screen, "Add item"), 20000)
    await byText(screen, "Add item").tap()
    await expect(
      byText(screen, "Enter a name, positive amount and all nutrition values (zero is allowed)."),
    ).toBeVisible()

    // Offline meal save fails without losing the draft; retry persists it. The daily
    // kcal value is unique so the history assertion proves the retried write.
    await scrollTo(screen, field(screen, "Food or drink name"), "up")
    await field(screen, "Food or drink name").fill("E2E Offline Meal")
    await enter(device, field(screen, "Amount, g"), "100")
    for (const [label, value] of [
      ["Energy, kcal", "9876"],
      ["Protein, g", "1"],
      ["Carbs, g", "1"],
      ["Fat, g", "1"],
    ] as const) {
      await scrollTo(screen, field(screen, label), "down")
      await enter(device, field(screen, label), value)
    }
    await scrollTo(screen, byText(screen, "Add item"), "down")
    await byText(screen, "Add item").tap()
    await waitVisible(byText(screen, "Log Meal"), 20000)
    await setOffline(ui, true)
    await byText(screen, "Log Meal").tap()
    await screen.scrollUntilVisible(byText(screen, "Could not save your meal"), {
      direction: "up",
      timeout: 30000,
    })
    await expect(
      byText(
        screen,
        "Could not connect to save your change. Check your connection and try again. Your entries are still here.",
      ),
    ).toBeVisible()
    await device.setAirplaneMode(false)
    await byText(screen, "Try again").tap()
    await waitHidden(byText(screen, "Could not save your meal"), 30000)
    // The error clears as soon as the retry starts; the draft only empties once the
    // save resolves, so wait for the cleared list before restarting the app.
    await scrollTo(screen, byText(screen, /^No items yet/), "down")
    await app.restart()
    await waitVisible(byText(screen, "Today"), 30000)
    await byId(screen, "tab-meals").tap()
    await waitVisible(byText(screen, "Meals"), 20000)
    // The card label starts with the meal name. The week strip's day button also
    // reads the calories, so matching on calories alone taps the wrong element.
    // The first history fetch after a cold start can trail the emulator's radio
    // reconnect, so allow it longer than the default assertion timeout.
    const meal = byText(screen, /^E2E Offline Meal.*9876 kilocalories/)
    await waitVisible(meal, 60000)

    // Remove the logged meal so later flows still see the account's empty history.
    await meal.tap()
    await waitVisible(byText(screen, "Back to Meal"), 10000)
    await byText(screen, "Delete").tap()
    await waitHidden(meal, 30000)
    await device.closeApp()
  },
)
