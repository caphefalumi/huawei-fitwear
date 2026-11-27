import type { Device } from "@e2e-dev/mobile"
// Shared steps for the Android E2E suite (e2e + @e2e-dev/mobile).
//
// Locators mirror the Maestro flows these tests replaced: a text match checks
// the accessible name and the visible text, and the first match wins, where
// e2e would otherwise require exactly one node.
import { credentials, expect } from "e2e"
import type { App, Locator, Screen, TextMatch } from "e2e"

export type Ui = { app: App; device: Device; screen: Screen }

export const DEDICATED_ACCOUNT = "e2e"

/** Visible text or accessibility label, first match. */
export function byText(screen: Screen, text: TextMatch): Locator {
  return screen.getByText(text, { visible: true }).first()
}

/**
 * A text box found by its placeholder or accessible name. Only text boxes: a
 * form's visible label shares the field's name and comes first in the tree,
 * and fill on that label fails.
 */
export function field(screen: Screen, text: string): Locator {
  return screen
    .getByPlaceholder(text, { visible: true })
    .or(screen.getByRole("textbox", text, { visible: true }))
    .first()
}

export function byId(screen: Screen, id: TextMatch): Locator {
  return screen.getByTestId(id, { visible: true })
}

export async function waitVisible(locator: Locator, timeout: number) {
  await expect(locator).toBeVisible({ timeout })
}

export async function waitHidden(locator: Locator, timeout: number) {
  await expect(locator).toBeHidden({ timeout })
}

/** Waits for an element that may not appear; resolves false when it does not. */
export async function maybeVisible(locator: Locator, timeout: number) {
  try {
    await locator.waitFor({ state: "visible", timeout })
    return true
  } catch {
    return false
  }
}

/** Android hides the keyboard directly; a no-op when it is already down. */
export async function hideKeyboard(device: Device) {
  await device.dismissKeyboard()
}

/** Fills an input and puts the keyboard away, as each Maestro input step did. */
export async function enter(device: Device, locator: Locator, value: string) {
  await locator.fill(value)
  await hideKeyboard(device)
}

/**
 * Focuses an input and types through the keyboard, as Maestro's tapOn +
 * inputText did. Use it where the app moves focus while typing (auto-advance),
 * which breaks fill's read-back check. The date fields select their text on
 * focus, so typing replaces it.
 */
export async function typeInto(locator: Locator, value: string) {
  await locator.pressSequentially(value)
}

/**
 * Drags from the right edge of a row to the left edge of the screen, as
 * Maestro's `swipe: direction: LEFT` did. A locator swipe only drags half of
 * the matched node, which on a short text label is too little to open a row.
 */
export async function swipeRowLeft(screen: Screen, locator: Locator) {
  const box = await locator.boundingBox()
  if (!box) throw new Error("swipeRowLeft: the row has no bounding box")
  const y = box.y + box.height / 2
  await screen.swipe({
    from: { x: box.x + box.width - 10, y },
    to: { x: 10, y },
    duration: 300,
  })
}

export async function scrollTo(screen: Screen, locator: Locator, direction: "up" | "down") {
  await screen.scrollUntilVisible(locator, { direction, timeout: 10000 })
}

const APP_ID = "com.fitwear.mobile"

/**
 * Taps the control that closes a modal sheet and waits for the sheet to go.
 * The app's sheets are modal windows; closing one can briefly hand focus to
 * the launcher, which the engine reports as a tap that left the app. That one
 * error is accepted only if the app is back in front and the sheet closed.
 */
export async function closeSheet(device: Device, control: Locator, sheet: Locator) {
  try {
    await control.tap()
  } catch (error) {
    if (!String(error).includes(`left ${APP_ID}`)) throw error
    await expect
      .poll(async () => (await device.foregroundApp()).bundleId, { timeout: 5000 })
      .toBe(APP_ID)
  }
  await waitHidden(sheet, 10000)
}

/** Closes the one-time Health Connect offer if this device shows it. */
export async function skipHealthConnectOffer({ device, screen }: Pick<Ui, "device" | "screen">) {
  const offer = byText(screen, "Connect to Health Connect")
  if (await maybeVisible(offer, 10000)) {
    await closeSheet(device, byText(screen, "Not now"), offer)
  }
}

/** Closes the capture sheet, which opens with the camera, to enter a meal by hand. */
export async function closeCaptureSheet({ device, screen }: Pick<Ui, "device" | "screen">) {
  await closeSheet(
    device,
    byText(screen, "Close Capture your meal"),
    byText(screen, "Capture your meal"),
  )
}

/**
 * Switches airplane mode while the app is open and waits for the "Offline mode"
 * banner to match. The banner pushes the screen down, so acting before it
 * settles taps whatever slid under the old position.
 */
export async function setOffline({ device, screen }: Pick<Ui, "device" | "screen">, on: boolean) {
  const banner = byText(screen, /^Offline mode/)
  if (on) {
    await device.setAirplaneMode(true)
    // A modal screen can cover the root banner, so its absence is no error.
    await maybeVisible(banner, 10000)
    return
  }
  await goOnline(device)
  // Best effort: the banner can stay while the app still treats the session
  // as offline. A step that needs the network asserts on its own result.
  await bannerGone(banner, 30000)
}

/** A fixed wait, only where the app gives nothing on screen to wait for. */
export function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function goOnline(device: Device) {
  await device.setAirplaneMode(false)
  await device.setNetwork("online")
}

async function bannerGone(banner: Locator, timeout: number) {
  try {
    await banner.waitFor({ state: "hidden", timeout })
    return true
  } catch {
    return false
  }
}

/** Fresh install state, network on, at the welcome screen. */
export async function launchClean({ app, device, screen }: Ui) {
  await goOnline(device)
  await app.clearState()
  await waitVisible(byText(screen, "Explore the app"), 30000)
}

export async function openSignIn(screen: Screen) {
  await byText(screen, "Sign in").tap()
  await waitVisible(byText(screen, "Hi, welcome back."), 20000)
}

/** Signs in with the dedicated staging account and waits for Today. */
export async function signIn({ device, screen }: Ui) {
  const account = credentials.user(DEDICATED_ACCOUNT)
  await field(screen, "example@gmail.com").fill(account.username)
  await byId(screen, "login-password").fill(account.password)
  await hideKeyboard(device)
  await byId(screen, "login-submit").tap()
  await skipHealthConnectOffer({ device, screen })
  await waitVisible(byText(screen, "Today"), 30000)
}

/** Relaunches the app without clearing its data. */
export async function relaunch({ app, screen }: Ui) {
  await app.restart()
  await waitVisible(byText(screen, "Today"), 30000)
}

/** Local calendar date as YYYY-MM-DD, the format of the calendar day test IDs. */
export function isoDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}
