# Huawei Smartwatch App Development

Smartwatches running HarmonyOS (e.g., HUAWEI WATCH series) feature compact circular or rounded-square displays, touch + crown hardware inputs, and close pairing with companion smartphones.

## 1. Screen Specifications & Circular UI Layout
* **Viewport & Breakpoints**:
  * Target the `xs` horizontal breakpoint (`< 320vp`) and design for circular display geometry (typically `466 x 466 px` or `480 x 480 px` at ~`326–352 PPI`).
  * Keep primary interactive targets and text within the **inscribed safe area** so corners and edges are not clipped by the circular bezel.
* **Information Density & Typography**:
  * Limit each screen to **1 primary task or 1–3 key data points**.
  * Use high-contrast dark backgrounds (`#000000`) to maximize legibility outdoors and conserve AMOLED power.
  * Use arc-aligned lists (`ArcList` / `Swiper`) and large touch targets (`>= 48vp`) to prevent mis-taps during movement.

## 2. Signature Smartwatch Interactions
* **Rotating Crown (`onDigitalCrown`)**:
  * Bind crown rotation events to scroll lists, adjust volume/brightness, scrub timers, or zoom views with subtle haptic feedback.
  * Support crown press actions for quick return to the watch face or primary action confirmation.
* **Wrist & One-Handed Gestures**:
  * Support wrist-raise wake transitions (`onPageShow` / `onPageHide`) and system back-swipe gestures without placing custom horizontal swipe controls too close to the left screen edge.
* **Phone–Watch Cross-Device Continuity**:
  * Use **Distributed Data Object**, **Distributed KVStore**, or **Wear Engine** to sync authentication tokens, workout sessions, and notifications seamlessly with the companion phone app.
  * Offload complex text input, account login, and heavy media downloads to the paired smartphone, opening a companion page on the phone when needed.