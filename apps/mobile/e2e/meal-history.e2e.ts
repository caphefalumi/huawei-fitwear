import { test } from "@e2e-dev/mobile"
import { expect } from "e2e"

import {
  byId,
  byText,
  enter,
  field,
  hideKeyboard,
  isoDay,
  launchClean,
  openSignIn,
  pause,
  relaunch,
  scrollTo,
  signIn,
  swipeRowLeft,
  waitHidden,
  waitVisible,
} from "./support"

// Critical meal journal flow: log a meal, confirm it, move it to yesterday,
// open that day from the calendar, find it by food name, then delete it with
// Undo. The CI cleanup step removes any meal this flow leaves behind.
test(
  "logs, moves, finds and deletes a meal",
  { tags: ["e2e", "meals"] },
  async ({ app, device, screen }) => {
    const ui = { app, device, screen }
    const soup = byText(screen, /^E2E Journal Soup/)

    await launchClean(ui)
    await openSignIn(screen)
    await signIn(ui)

    // Log a meal with a manually entered item.
    await byText(screen, "Capture meal").tap()
    await waitVisible(byText(screen, "Capture your meal"), 20000)
    await byText(screen, "Close Capture your meal").tap()
    await byText(screen, "Enter meal manually").tap()
    await waitVisible(byText(screen, "+ Add item"), 15000)
    await byText(screen, "+ Add item").tap()
    await byText(screen, "Enter nutrition manually").tap()
    await waitVisible(byText(screen, "Manual item"), 15000)
    await byId(screen, "input-food-or-drink-name").fill("E2E Journal Soup")
    await enter(device, byId(screen, "input-amount"), "300")
    for (const [id, value] of [
      ["input-energy", "240"],
      ["input-protein", "12"],
      ["input-carbs", "30"],
      ["input-fat", "8"],
    ] as const) {
      await scrollTo(screen, byId(screen, id), "down")
      await enter(device, byId(screen, id), value)
    }
    await scrollTo(screen, byText(screen, "Add item"), "down")
    await byText(screen, "Add item").tap()
    await waitVisible(byText(screen, "E2E Journal Soup"), 15000)
    await scrollTo(screen, byText(screen, "Log Meal"), "down")
    await byText(screen, "Log Meal").tap()

    // The save is confirmed, and View opens the saved meal.
    await waitVisible(byText(screen, "Saved E2E Journal Soup"), 20000)
    await byText(screen, "View").tap()
    await waitVisible(byText(screen, /^Meal time/), 15000)

    // Move the meal to yesterday from the meal detail.
    await byText(screen, /^Meal time/).tap()
    await waitVisible(byText(screen, "The meal moves to the day you pick."), 10000)
    await byId(screen, "meal-time-yesterday").tap()
    await byText(screen, "Save meal time").tap()
    await waitHidden(byText(screen, "The meal moves to the day you pick."), 15000)
    await device.back()

    // Today no longer lists the meal; the calendar opens yesterday.
    await byId(screen, "tab-meals").tap()
    await waitVisible(byText(screen, "Meals history ›"), 20000)
    await expect(soup).toBeHidden()
    await byText(screen, "Meals history ›").tap()
    await waitVisible(byText(screen, "Pick a day to see what you ate."), 10000)
    const yesterday = new Date(Date.now() - 86_400_000)
    if (yesterday.getMonth() !== new Date().getMonth()) {
      await byText(screen, "Previous month").tap()
    }
    await byId(screen, `calendar-day-${isoDay(yesterday)}`).tap()

    // The day view shows the meal and its total under Yesterday.
    await waitVisible(soup, 10000)
    await expect(byText(screen, "Yesterday")).toBeVisible()
    await expect(byText(screen, /^(240 \/ .* kcal|240 kcal)$/)).toBeVisible()
    await byText(screen, "Show macro breakdown").tap()
    await expect(byText(screen, /^12.*g Protein$/)).toBeVisible()
    await byText(screen, "Hide macro breakdown").tap()

    // The swipe tip can be dismissed for good.
    await byText(screen, "Dismiss tip").tap()
    await expect(byText(screen, "Swipe left on a meal to delete it.")).toBeHidden()

    // Search works across days by food name, ignoring case.
    await field(screen, "Search food").fill("e2e journal")
    await hideKeyboard(device)
    await expect(soup).toBeVisible()
    await expect(byText(screen, "1 meal")).toBeVisible()
    await byText(screen, "Clear food search").tap()

    // Swipe to delete, undo, then delete for good. Clearing the search moves
    // the row, so wait for the day view before measuring it.
    await waitVisible(byText(screen, "Meals history ›"), 10000)
    await swipeRowLeft(screen, soup)
    await byText(screen, "Delete E2E Journal Soup").tap()
    await waitVisible(byText(screen, "Meal deleted"), 5000)
    await expect(soup).toBeHidden()
    await byText(screen, "Undo").tap()
    await waitVisible(soup, 5000)
    await swipeRowLeft(screen, soup)
    await byText(screen, "Delete E2E Journal Soup").tap()
    // The app sends the DELETE when the Undo toast closes, so see the toast
    // first: waiting only for it to be hidden passes before it ever appears.
    await waitVisible(byText(screen, "Meal deleted"), 5000)
    await waitHidden(byText(screen, "Meal deleted"), 10000)
    await waitHidden(soup, 15000)
    await expect(byText(screen, /^(No meals logged on.*|No meals yet)$/)).toBeVisible()

    // The deletion reached the server: search finds nothing after a restart.
    // The app sends the DELETE only when the Undo toast closes and keeps the row
    // hidden meanwhile, so nothing on screen marks the request as done. Give it
    // time to finish; a restart right away would kill it in flight.
    await pause(5000)
    await relaunch(ui)
    await byId(screen, "tab-meals").tap()
    await waitVisible(byText(screen, "Meals history ›"), 20000)
    await field(screen, "Search food").fill("e2e journal")
    await hideKeyboard(device)
    await waitVisible(byText(screen, /^No meals match/), 15000)
  },
)
