import { test } from "@e2e-dev/mobile"
import { expect } from "e2e"

import {
  byId,
  byText,
  closeCaptureSheet,
  launchClean,
  openSignIn,
  relaunch,
  signIn,
  waitHidden,
  waitVisible,
} from "./support"

test(
  "signs in and checks the read-only fitness screens",
  { tags: ["e2e", "fitness"] },
  async ({ app, device, screen }) => {
    const ui = { app, device, screen }

    await launchClean(ui)
    await openSignIn(screen)
    await signIn(ui)

    // Session survives an app restart.
    await relaunch(ui)

    // Check the read-only fitness surfaces without changing health data.
    await byId(screen, "tab-profile").tap()
    await waitVisible(byText(screen, "Health data"), 20000)
    await byId(screen, "tab-meals").tap()
    await waitVisible(byText(screen, "Meals history ›"), 20000)
    await byText(screen, "Capture meal").tap()
    await waitVisible(byText(screen, "Capture your meal"), 20000)
    await expect(byText(screen, "Add a ruler")).toBeVisible()
    await expect(byText(screen, "Shoot from above")).toBeVisible()
    await closeCaptureSheet(ui)
    await waitHidden(byText(screen, "Add a ruler"), 5000)

    // Use a real barcode image and the staging lookup; do not save to the diary.
    // CI pushes the photo fixture to the emulator before the run.
    await byText(screen, "Choose from library").tap()
    const photo = byText(screen, /^Photo taken on/)
    await waitVisible(photo, 15000)
    await photo.tap()
    const crop = byId(screen, /:id\/crop_image_menu_crop$/)
    await waitVisible(crop, 15000)
    await crop.tap()
    await waitVisible(byText(screen, /H[aả]o H[aả]o/iu), 30000)
    await expect(byText(screen, "Barcode 8934563138165")).toBeVisible()
    await byText(screen, "Review product").tap()
    await waitVisible(byText(screen, "Product match · Open Food Facts"), 15000)
    await device.back()
    await waitVisible(byText(screen, "Capture Meal"), 15000)

    await device.back()
    await byId(screen, "tab-workout").tap()
    await expect(byText(screen, "Workout")).toBeVisible()
  },
)
