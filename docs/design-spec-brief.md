# VoocHealth — Design Specification Brief

> **Who this is for:** a design AI or designer producing a formal design specification for the VoocHealth product.
> **What it is:** a complete, evidence-based export of the current product surface — purpose, users, navigation, every screen, tokens, components, motion, accessibility, copy, data models, and assets — plus the places where the existing implementation is inconsistent so the new spec can resolve them deliberately rather than copy bugs.
> **Source of truth:** the live Expo app in `apps/mobile` (SDK 57, Expo Router, React Native 0.8x, Reanimated). Everything described here is drawn from the code, not from marketing material. Where a value is hardcoded demo data, it is called out.

---

## 1. Product

**VoocHealth** is a dual-device fitness and nutrition companion.

- **Phone app (Expo / React Native):** the primary UI — meal capture and nutrition tracking, workout plans, progress, profile, and health-data sync.
- **Smartwatch (HarmonyOS ArkTS):** sensor sampling (IMU, heart rate), on-wrist workout UI, haptics.
- **Backend (Elysia on Cloudflare Workers, Drizzle + D1):** auth, health profile, meals, AI meal analysis.

The organising idea is **"one calm dashboard for eating and training"**: warm, paper-like surfaces, a single oxblood accent, sparse chrome, generous whitespace, and numbers presented plainly with honest caveats about what is estimated.

### Value propositions (as expressed in the UI)

1. Log a meal by photograph; correct the AI's guesses rather than typing everything.
2. Follow a weekly plan that adapts to recovery, and browse any muscle group.
3. See weight, nutrition, and recovery in one place without gamification.
4. Keep health data private; explain exactly what leaves the device and when.

### Product principles observed in the interface

| Principle | How it shows up |
|---|---|
| Calm over dense | One hero number per card, 24px screen gutters, few dividers, no badges-within-badges |
| Estimates are labelled | "estimates, not medical advice", "IF READY · not cleared medically", "Personal-scale estimates, not a diagnosis" |
| Privacy is explicit | Capture screen states the photo is uploaded only on Analyze; account-data screen explains storage |
| Correct, don't restart | Meal flow lets you edit/delete/replace individual items and shows "CURRENT ITEM · NOT REPLACED YET" |
| Recovery is first-class | Rest / light days adjust routines and are surfaced on Home, Plan, and Profile |
| Touch-first, thumb-reachable | 48dp minimum targets, primary actions at the bottom, floating center capture button |

---

## 2. Users

### Primary persona — "Sam", 25–40, goal-driven but time-poor
- Trains 2–5×/week, wants fat loss with muscle maintenance.
- Tracks food inconsistently because manual entry is tedious; will photograph a plate.
- Wants to know "what do I have left today?" in under three seconds.
- Uses an Android phone and a Huawei watch.
- Cares that health data is not shared.

### Secondary personas
- **Returning-from-injury / cycle-aware user:** needs the plan to back off and to control period-recovery visibility.
- **Beginner:** needs exercise guidance and an explicit prescription (sets × reps) before starting.
- **Data editor:** wants to fix a wrong weight, height, sex, or macro without re-onboarding.

### Jobs to be done
- "Tell me what I can still eat today."
- "Log this meal with as few taps as possible, and let me fix what the AI got wrong."
- "Tell me what to do at the gym today, and adjust it if I'm recovering."
- "Show me whether my weight is moving."
- "Let me control what health data is stored and delete it."

---

## 3. Platform scope and constraints

| Surface | Stack | Design implications |
|---|---|---|
| Mobile | Expo SDK 57, Expo Router, React Native, Reanimated, `expo-image`, SVG icons | Portrait only; safe-area aware; native modal sheets; reduced-motion honoured; 48dp targets |
| Watch | HarmonyOS NEXT, ArkTS | Tiny screen, glanceable, haptic confirmation; not covered by this brief beyond parity notes |
| Backend | Elysia + D1 | No UI; determines loading/error/empty states |

**Hard constraints to preserve**
- Portrait orientation only (`app.json` → `orientation: "portrait"`).
- Light-first visual design; `userInterfaceStyle: "automatic"` is declared but the implementation is effectively light-only (see §15).
- Content max width 800 on large/web layouts; phone content is full-bleed.
- Bottom tab bar is custom-drawn, not the platform default.

---

## 4. Voice and tone

- **Sentence case** almost everywhere ("Capture Meal" is the lone Title Case exception). Buttons: "Analyze photo", "Enter meal manually", "Save set", "Finish workout".
- **Direct, second person, no exclamation.** "Your meal stays unchanged until you confirm."
- **Honest about uncertainty.** Estimates are labelled at the point of display, not buried in a settings page.
- **Short labels, explanatory microcopy.** Titles ≤ 3 words; supporting lines 11–13px.
- **No emoji** in product copy. The one glyph used as UI is "✕" for dismissing a banner.
- **Errors are actionable and non-blaming.** "No food was identified. Try another photo or enter items manually." "Photo analysis is unavailable. You can enter nutrition manually."
- **Never implies medical authority.** Always "estimates", "not medical advice", "not cleared medically", "personal-scale estimates, not a diagnosis".

### Copy patterns to reuse

| Pattern | Examples |
|---|---|
| Screen title | `Today`, `Nutrition`, `Progress`, `Meals`, `Workout plan`, `Profile` |
| Eyebrow above title | `My plan` |
| Subtitle | `Your logged meals`, `Capture food or drinks.`, `fat loss & muscle maintenance` |
| Section heading | `Nutrition`, `Progress`, `Today`, `Upcoming`, `Browse muscle groups`, `Profile overview`, `Refine your plan`, `Account` |
| Section action | `6 groups`, `Oct 9`, routine name |
| Primary CTA | `Analyze photo`, `Start workout`, `Save set`, `Sign In` |
| Secondary CTA | `Enter meal manually`, `Upload from library`, `Create account` |
| Footnote | `Demo personal targets · estimates, not medical advice.` |
| Destructive confirm | `Cancel and delete workout`, `Delete account`, `Delete item` |
| Empty state | `No meals match “…” .`, `No matching foods.`, `No database match` |

---

## 5. Information architecture and navigation

### Root structure

```
Root Stack (headerShown: false)
├── (auth)  [shown only when signed out]
│   ├── index        → Welcome
│   ├── login        → Log in / reset password
│   └── sign-up      → Create account
└── (tabs)  [shown only when signed in]
    ├── home         → Today dashboard
    ├── meals        → Meal history
    ├── workout      → Workout plan
    └── profile      → Profile
    ├── capture      → Capture meal (pushed from center FAB or Meals)
    ├── meal         → Meal result / meal detail
    ├── add-item     → Database search or manual entry
    ├── review-item  → Confirm item nutrients
    ├── replace-food → Pick a replacement food
    ├── nutrition    → Nutrition detail
    ├── progress     → Progress detail
    ├── chest-plan   → Chest routine
    ├── plan         → Group plan (query: `?group=`)
    ├── exercise-guide → Technique guide
    ├── session      → Live workout
    ├── account-data → Privacy / data management
    └── ble-sync     → Developer BLE diagnostics
```

Auth guard is declarative: signed-out users are redirected to `login`; signed-in users are redirected to `home`. When auth is loading, **nothing renders** (blank frame, splash overlay remains).

### Tab bar

- **Items, left to right:** `Home`, `Meals`, **center capture (+)**, `Workout`, `Profile`.
- **Layout:** white `surface`, 1px top border `border`, height **58** + bottom safe-area inset.
- **Tab cell:** flex 1, icon **22×22**, label **11/500**.
- **Active state:** icon + label in `accent`; an animated pill behind the active non-center tab: height 44, horizontal inset 8, radius 100, fill `rgba(157,35,50,0.12)`; content opacity 0.55→1 and scale 0.96→1; label height 0→15 + 4 margin.
- **Center button:** 60×60 accent circle, 4px white border, plus made of two 22×3 / 3×22 white bars, lifted **−24** above the bar. Press: scale 0.88 (90ms) then spring back; ripple expands to 1.8× while fading from 0.45 over 450ms. Opens `/capture`.
- **Tab switching:** pill translate + width animate together over **250ms**; content over **200ms**.
- The tab bar is hidden on pushed screens (stack presentation), so all detail screens own their back control.

### Navigation patterns

| Pattern | Used by |
|---|---|
| Push with a text back link (`‹ Meals`) | Capture, Nutrition, Progress, Meal, Add item, Review item, Replace food, Chest/Group plan, Exercise guide |
| Push with no back (modal-like full screen) | Session |
| Bottom sheet over current screen | All editors (height, weight, sex, goal, frequency, activity, target weight, recovery), meal options, item edit, tutorial |
| Inline success banner | Home after weight save |
| Native alert | Period-recovery opt-in, destructive confirms |

### Journey maps (canonical paths)

**Meal logging**
`Home/Meals → (+) Capture → [photo + optional description] → Analyze → Meal result → Add item / Review item / Replace item → Save → Meals history → Meal detail`

**Manual meal**
`Capture → Enter meal manually → Meal result (empty) → Add item → Search database or manual entry → Review item → saved`

**Workout**
`Workout tab → Today's routine / muscle group → Chest plan or Group plan → Exercise guide → Start workout → Live session (sets sheet) → Finish workout → summary`

**Profile edit**
`Profile → row → bottom sheet → Save → row updates + persisted targets`

---

## 6. Global layout patterns

### Screen scaffold

```
SafeArea top
paddingTop = 12 + insets.top
paddingHorizontal = 24
content gap = 18 (Home, Capture, Workout plan) / 22 (Profile) / 14 (Meals history)
paddingBottom = 26 + insets.bottom
```

- Background is always `background` (#FAF9F6).
- Headers are **text-led**, not app-bar-led: a 28/400 screen title, optionally preceded by a 12/500 muted eyebrow and followed by a 12–13 muted subtitle.
- Back affordance: chevron-left 18×18 + 13px accent label, gap 6, hitSlop 10.
- Right-side header action: 13/600 accent text.
- The tab bar inset is respected on tab screens; pushed screens still add bottom padding.

### Cards

| Property | Value |
|---|---|
| Fill | `surface` #FFFFFF |
| Border | 1px `border` #E7E2DC |
| Radius | 20 (home cards), 18 (recovery / capture preview), 16 (buttons, fields), 14 (small tiles) |
| Padding | 18 (standard), 14–16 (compact) |
| Internal gap | 16 (standard), 4–10 (tight stacks) |
| Shadow | **none** — depth comes from borders and fill contrast only |

### Buttons

| Variant | Height | Radius | Fill | Text |
|---|---|---|---|---|
| Primary | 52 | 14–16 | `accent` #9D2332 | 14–15/600, `onAccent` |
| Primary disabled | 52 | 14–16 | `card` #EFEBE5 | `onAccent` (low contrast — see §15) |
| Secondary | 48–52 | 14–16 | `surface` + 1px `border` | 14/600, `accent` (meals) or `text` (sheets) |
| Text action | 48 tap target | — | none | 12–13/500–600, `accent` |
| Destructive text | row height | — | none | `error`/`accent`, e.g. "Sign out", "Delete account" |

### Form fields

- Label **12/500** muted, gap 8 above the control.
- Control: `surface`, 1px `border`, radius 14, padding 14–16; text 15.
- Unit suffix 13 muted inside the field.
- 2×2 nutrient grid: cells `flexBasis: 45%`, `minWidth: 130`, gap 10.
- Search: icon 19 + input 15 + clear button 18.
- Placeholder color = `textMuted`.

### Lists and rows

- Profile rows: height **50**, 1px bottom border, label 13/600, value 14/600 + chevron 16, gap 12.
- Meal history rows: photo 56–64 square/rounded, name 14/600 one line, meta 11 muted, kcal right-aligned 13/600.
- Exercise rows: name 12 `text` left, prescription 12 muted right.
- Week strip: seven equal tiles height 58, radius 14, day 10 muted / date 14/600; active tile = accent fill with white text.

### Sheets (bottom overlays)

- Scrim `rgba(37,35,33,0.4)`.
- Sheet: white, top radius **24**, max height **86%**, padding top 24 / horizontal 24 / bottom 20 + inset, gap 14.
- Title **22/600** + close button.
- Content scrolls; bottom actions stack: primary 52 + secondary 48, gap 10.
- Keyboard: padded avoidance, dismiss on open and on close, drag-to-dismiss keyboard.
- Motion: 220ms in (ease-out cubic), 160ms out (ease-in quad), translateY 24→0 with fade.

### Empty / loading / error / offline

- **Loading:** skeleton rectangles (`border` fill, radius 7) for field values; `ActivityIndicator` inside primary buttons (`busy`).
- **Empty:** a single muted sentence; no illustration in meal history.
- **Error:** inline alert text (`accessibilityRole="alert"`) in meal flows; on Profile a one-line banner "Couldn't load your health data." + "Retry".
- **Offline:** a global `NetworkStatusBanner` is mounted above the navigator on every screen.

---

## 7. Design tokens

### 7.1 Canonical palette (the brand system — use this)

`apps/mobile/src/theme/tokens.ts` → `Palette`, re-exported as `constants/palette.ts`.

| Token | Hex | Role |
|---|---|---|
| `background` | `#FAF9F6` | App canvas, warm ivory |
| `surface` | `#FFFFFF` | Cards, sheets, fields, tab bar |
| `card` | `#EFEBE5` | Tinted blocks, tracks, disabled fills |
| `border` | `#E7E2DC` | 1px hairlines, field outlines |
| `text` | `#252321` | Primary text, near-black warm |
| `textMuted` | `#68625C` | Secondary text, labels, units, placeholders |
| `accent` | `#9D2332` | Oxblood — CTAs, active tab, links, progress |
| `accentBorder` | `#9D2232` | Nearly identical accent for borders |
| `accentTint` | `#F5E8E8` | Chips, badges, success banner, avatars |
| `previewTint` | `#F7F5F2` | Subtle preview surface |
| `onAccent` | `#FFFFFF` | Text/icons on accent |

Supporting values used ad hoc but consistently:

| Value | Use |
|---|---|
| `rgba(157,35,50,0.12)` | Active tab pill |
| `rgba(157,35,50,0.45)` | Shutter ring |
| `rgba(37,35,33,0.4)` | Sheet scrim |
| `#2B2724` | Camera preview well (dark warm) |
| `#FFFFFF` at 0.28–0.92 | Preview overlay text/borders |
| `#208AEF` | Splash background (legacy — conflicts with accent; see §15) |
| `#E6F4FE` | Android adaptive icon background |

### 7.2 Spacing

Two scales exist. The canonical one in `tokens.ts`:

| Token | px |
|---|---|
| `xs` | 4 |
| `sm` | 8 |
| `md` | 16 |
| `lg` | 24 |
| `xl` | 32 |

The legacy `constants/theme.ts` scale (still imported in places) is `half 2, one 4, two 8, three 16, four 24, five 32, six 64`. **Treat the canonical scale as authoritative and note 64 as an optional `xxl`.**

Observed rhythm: screen gutters 24; card padding 18; gaps 4, 6, 8, 10, 12, 14, 16, 18, 22; section spacing 18–22.

### 7.3 Radii

| Token | px | Use |
|---|---|---|
| `sm` | 6 | small chips |
| `md` | 12 | banners, compact blocks |
| `lg` | 16 | buttons, fields, inputs |
| `full` | 9999 | pills, avatars, dots, progress tracks |

Observed extras: 10 (badges), 14 (small tiles/buttons), 18 (recovery card, capture preview), 20 (home cards), 24 (sheet top), 100 (tab pill). Recommend formalising `xs 6 / sm 10 / md 12 / lg 14 / xl 16 / 2xl 18 / 3xl 20 / 4xl 24 / full`.

### 7.4 Elevation

No drop shadows anywhere in the consumer UI. Depth = 1px borders, white-on-ivory contrast, and scrims. Dark camera well uses fill contrast only.

### 7.5 Typography

**Family:** system UI throughout. `Fonts.sans` resolves to `system-ui` (iOS), platform default (Android), `var(--font-display)` (web). No custom font assets are shipped.

| Style | Size | Weight | Line height | Color | Where |
|---|---|---|---|---|---|
| Display | 30 | 700 | 38 | text | Welcome title |
| Screen title | 28 | 400 | — | text | Home, Nutrition, Progress, Meals, Workout plan, Profile |
| Sheet title | 22 | 600 | — | text | Bottom sheets |
| Avatar initial | 20 | 500 | — | accent | Profile |
| User name | 19 | 600 | — | text | Profile header |
| Section title | 17 | 600 | — | text | Nutrition, Progress, Profile sections |
| Card title | 16 | 600 | — | text | Routine titles |
| Button label | 14–16 | 600 | — | onAccent / text | CTAs |
| Field input | 15 | 400 | — | text | Inputs |
| Row value | 14 | 600 | — | text | Profile rows, meal name |
| Row label | 13 | 600 | — | text | Profile row labels, back links |
| Body / card copy | 13 | 400–600 | 16–18 | text / muted | Descriptions |
| Meta | 12 | 400–500 | 16 | muted | Dates, subtitles, footnotes |
| Micro | 11 | 400–600 | 16 | muted | Units, macro labels, banner text |
| Footers | 10 | 400 | — | muted | Legal/estimate notes, badge labels |

Weights used: 400, 500, 600, 700. Letter-spacing only on uppercase footnotes (0.5).

**Uppercase:** used for date eyebrows (`THU, OCT 8`), badges (`OCT 8`), and callouts (`ADJUSTED FOR …`, `IF READY · …`). Not used for buttons.

**Numerals:** hero numbers 27–28/600; units 14 muted baseline-aligned; `toLocaleString("en-US")` for calorie totals.

---

## 8. Component inventory

| Component | File | Spec |
|---|---|---|
| `Pressable` | `components/pressable.tsx` | min 48×48; pressed opacity 0.7; web hover 0.85; defaults `accessibilityRole="button"` |
| `Card` | `features/home/ui.tsx` | surface, 1px border, radius 20, padding 18, gap 16 |
| `SectionHeading` | same | 17/600 title; optional 12/500 accent action; row space-between |
| `BackHeader` | same | chevron 18 + 13 accent label, gap 6 |
| `MacroBar` | same | label 11 muted / value 11/600; 5px track radius 100 `card`; accent fill animated width 500ms |
| `Header` | `features/meals/meals-ui.tsx` | back link + optional 13/600 accent action |
| `Field` / `Box` / `ValueInput` | same | see §6 form fields |
| `SearchInput` | same | surface box, icon, clear button, 15px input |
| `PrimaryButton` / `SecondaryButton` | same | see §6 |
| `SectionTitle` | same | 17/600 + optional action |
| `NutrientGrid` | same | 2×2 Energy/Protein/Carbs/Fat editable inputs |
| `Glyph` | same | 19px food-type SVG (wheat, drumstick, carrot, droplet) |
| `Sheet` | `components/sheet.tsx` | see §6 sheets |
| `SheetField` / `SheetActions` | same | bordered field block; stacked actions |
| `CloseButton` | `components/close-button.tsx` | accessible label "Close {title}" |
| `WheelPicker` | `components/wheel-picker.tsx` | iOS-style wheel; reduced-motion aware |
| `RadioList` | `components/radio-list.tsx` | radio rows, `accessibilityRole="radio"` |
| `FetchStates` | `components/fetch-states.tsx` | loading / error / empty wrappers |
| `NetworkStatusBanner` | `components/network-status.tsx` | global offline banner |
| `HintRow` | `components/hint-row.tsx` | icon + muted hint line |
| `RecoveryStages` | `features/recovery/recovery-stages.tsx` | three-stage rest/light/return timeline |
| `NutritionRing` | `features/home/ring.tsx` | dual-arc calorie ring |
| `WeightChart` | `features/home/weight-chart.tsx` | 7-point sparkline, no axes |
| `AppTabs` | `components/app-tabs.tsx` | custom tab bar, see §5 |
| `AuthField` | `features/auth/components/auth-field.tsx` | Material-style outlined field with icon + trailing action |
| `DateOfBirthField` | same | calendar icon + formatted date |

### Icons

All product icons are **SVG** rendered via `expo-image` with `tintColor`, typically 16–24px, stroke-based, round caps, 1.5–2px stroke. Tab icons 22px; action icons 16–19px; body diagrams 26×34.

---

## 9. Motion

All animation is purposeful and short. Reduced motion is respected in sheets, login, meal swipes, and wheel pickers via `useReducedMotion`.

| Motion | Duration / curve | Notes |
|---|---|---|
| Tab pill translate/width | 250ms timing | Same frame as content |
| Tab content opacity/scale | 200ms timing | 0.55→1, 0.96→1 |
| Tab label reveal | 200ms | height 0→15, margin 0→4 |
| Center FAB press | 90ms to 0.88, spring back (damping 11, stiffness 320) | |
| FAB ripple | 450ms | scale 1→1.8, opacity 0.45→0 |
| Sheet enter | 220ms ease-out cubic | fade + translateY 24→0 |
| Sheet exit | 160ms ease-in quad | |
| Screen section entrance | `FadeInUp` 220–250ms, delays 50/60/100/120/150ms | Home, Profile, Plans, Meal history first 4 rows |
| Macro bar fill | 500ms timing | width interpolation |
| Calorie count-up | 600ms ease-out cubic | rAF loop |
| Nutrition ring sweep | 900ms | on focus |
| Splash overlay | ~500ms | logo/ring reveal |
| Press feedback | instant | opacity 0.7 |
| Error shake | 300ms | login credential failure |
| Haptics | — | error notification (iOS), Reject/Long_Press (Android), success on save |

**Rules:** no looping decorative animation; no parallax; no bounce except the FAB spring; motion never blocks input; reduced motion collapses durations to 0 for sheets and disables entrance animation where implemented.

---

## 10. Accessibility

| Concern | Implementation |
|---|---|
| Touch targets | `Pressable` enforces 48×48 minimum; `hitSlop` 10 on small icon actions |
| Roles | `header` on screen/section titles, `button` on all pressables, `radio` in radio lists, `alert` on inline errors |
| State | `accessibilityState={{ busy, disabled }}`; period toggle announces "On/Off" |
| Live regions | `accessibilityLiveRegion` on async status text |
| Modal semantics | Sheets set `accessibilityViewIsModal` and support `onAccessibilityEscape`; scrim is hidden from AT |
| Labels | Icon-only controls always have explicit labels ("Capture meal", "Clear food search", "Back to Meals", "Close {title}") |
| Dynamic type | Login listens to font scale and reflows; most other screens use fixed sizes — a gap to address |
| Contrast | Body on ivory and white-on-oxblood pass; **disabled primary buttons (white on #EFEBE5) do not** — flag |
| Reduced motion | Honoured in sheets, login, meal swipe rows, wheel picker |
| Colour alone | Active states also change scale/weight/position; sort chips add ↑/↓ arrows |
| Screen reader order | Visual order is logical; cards that navigate are single pressables with descriptive labels |

---

## 11. Screen specifications

Legend: **Purpose · Structure · Actions · States · Copy**

### 11.1 Welcome (`/`, auth index)

- **Purpose:** brand moment and entry fork.
- **Structure:** centred hero: 208×208 illustration of two concentric orbit rings (196/152, 1px `border`), a 92px white circle with a 38px oxblood plus mark, plus two dot "sparkles"; title "Explore the app" (30/700, centred, max width ~300); subtitle "Everything you need to manage your health and training, all in one place." (16/400, muted); bottom action stack.
- **Actions:** "Sign In" (primary, 54, radius 12), "Create account" (secondary outline).
- **States:** none dynamic.
- **Note:** auth surfaces use a brighter white than the rest of the app (see §15.3).

### 11.2 Log in (`/(auth)/login`)

- **Purpose:** email/password sign-in with inline password reset.
- **Structure:** scrollable form, keyboard-avoiding. Back chevron. Title "Log in" (~30/700). Outlined fields: Email (user icon), Password (lock icon, eye toggle). Inline error block. Primary "Log in". "Forgot password?" text action. Footer: "Don't have an account? Sign up".
- **Reset sub-flow (same screen):** request code → "Check your email" state → 6-digit code → new password → success → back to log in. Copy: "Having trouble? Reset your password.", "Reset password", "Back to log in", "Remembered your password?"
- **States:** idle; submitting (spinner in button, fields disabled); invalid credentials ("Incorrect email or password." + shake + error haptic); lockout after repeated failures (countdown, disabled submit); network error; success (navigate to Home).
- **Accessibility:** fields labelled, error announced, shake disabled under reduced motion, font-scale aware layout.

### 11.3 Sign up (`/(auth)/sign-up`)

- **Purpose:** create account and seed the health profile.
- **Structure:** title + subtitle; Email, Password, Name, Date of birth (calendar field), Height, Sex; terms checkbox row "I accept the terms and privacy policy."; primary "Create account"; footer "Already have an account? Log in".
- **States:** validation per field, submit busy, server error, success.
- **Notes:** height and sex feed the initial energy estimate — the UI says so ("Height contributes to your initial energy estimate.").

### 11.4 Home / Today (`/(tabs)/home`)

- **Purpose:** the daily glance — what's left to eat, what to train, how weight is trending, recovery status.
- **Structure (top to bottom, gap 18):**
  1. Top row: date eyebrow `THU, OCT 8` (12 muted) left; first name `Sam N.` (13/600 accent) right.
  2. Title `Today` (28/400).
  3. **Focus card** (surface): three one-line lines — `Today: Chest · 5 sets · ~45 min` (13/600), `1320 kcal left` (12 muted), `Watch connected` / recovery title (12 muted); then a 7-dot week strip (10px dots, gap 8; active filled accent, idle 1px border).
  4. **Success banner** (conditional, `accentTint`, radius 12, padding 14/12): check icon 14 + "Weight saved · nutrition targets updated" (12/600 accent) + ✕ dismiss.
  5. **Nutrition card** (surface, tappable → `/nutrition`): header `Nutrition` (14/600); body = 120–140px dual-arc ring (remaining kcal centred, 27/600) on the left, three `MacroBar`s (Protein 92/140g, Carbs 152/275g, Fat 38/60g) on the right, gap 20; conditional line `1,320 consumed · 840 kcal left of 2,200` (11 muted).
  6. **Progress section**: heading + card (tappable → `/progress`) with "Latest weight" 12 muted, `71.5` 27/600 + `kg` 14 muted, delta line `−1.2 kg in 4 weeks` 11 muted, a 7-point sparkline, and an optional previous-log row (thumbnail 44×20, `Previous · Oct 7`, `72.0 kg`).
  7. **Recovery row** (conditional; `card` fill, radius 12, padding 14): shield-check 21, title 12/600, `3 rest days · 2 light days` 11 muted, chevron 17. Opens `RecoverySheet`.
  8. Footnote (conditional): `Demo personal targets · estimates, not medical advice.` 10 muted, centred.
- **Actions:** tap Nutrition, Progress, Recovery; dismiss banner; navigate via tabs.
- **States:** fresh account (no weight logged) vs. weight-logged (targets update, banner, previous log); recovery on/off.
- **Data notes:** the base `1320` consumed, macro bases, `DEMO_WEIGHTS`, `WEEK_ACTIVE`, date, and name are **static demo values**; only meal logs and the health store add real data.

### 11.5 Nutrition (`/nutrition`)

- **Purpose:** full nutrition breakdown for the day.
- **Structure:** back header; title `Nutrition`; hero ring (remaining/consumed); `Remaining today`, `Consumed`, `Daily target` stat blocks; `Macronutrients` section with Protein/Carbs/Fat bars and gram values; `About these numbers` explainer card.
- **Actions:** back; likely tap-through to meals.
- **States:** no meals logged (zeros, ring empty), partial, target met/exceeded (ring full, remaining clamped at 0).
- **Copy:** "Nutrition targets use your latest profile information.", "About these numbers".

### 11.6 Progress (`/progress`)

- **Purpose:** weight trend and body-composition context.
- **Structure:** back header; title `Your progress.`; large weight value + unit; date of latest log; line chart with latest-point dot; stat blocks for `Body composition` / `Body fat` / `Muscle mass`; a "log weight" prompt.
- **Actions:** back; open weight sheet (from Profile) to log; range selection if present.
- **States:** no data (prompt "Log your weight to keep your nutrition guidance current."), single point, trend.
- **Copy:** "Personal-scale estimates, not a diagnosis.", "Weight", "Goal 70.0 kg · Updated Oct 7".

### 11.7 Meals — history (`/(tabs)/meals`)

- **Purpose:** find and reopen any logged meal.
- **Structure:** title `Meals` (28/400) + subtitle `Your logged meals`; search field (icon + "Search meals" + clear); horizontal sort chips: `Newest`, `kcal`, `Protein`, `Carbs`, `Fat` — active chip filled, with ↓/↑ direction; list of meal cards.
- **Meal card:** photo 56–64 rounded, name 14/600 one line, meta 11 muted (`Thursday, Oct 8 · 12:30`, or `… · 32 g protein` when sorting by macro), kcal right 13/600. Tap → `/meal?log={id}`.
- **States:** empty history, no search matches (`No meals match “…” .`), sorted ascending/descending.
- **Motion:** first four rows `FadeInUp` staggered 50ms.

### 11.8 Capture meal (`/capture`)

- **Purpose:** acquire a photo and optional text, then send for analysis.
- **Structure:**
  - Back header `‹ Meals`.
  - Title `Capture Meal` (28/400) + subtitle `Capture food or drinks.`
  - **Preview well:** 370 min height, `#2B2724`, radius 18, padding 44/18. Empty state: four 26px corner brackets (white 0.35), a 192px dashed circle containing a 30px utensils icon, `Place food or drink here` (12/500 white 0.92), `Top-down shot · keep steady` (10 white 0.45); a dashed ruler chip below: ruler icon 20 + `Place 15 cm ruler beside plate or cup` (11 white 0.8). Selected state: the photo, `contentFit="contain"`.
  - **Optional description** field: label 12/500 muted, multiline 84 min height, placeholder "Add ingredients, preparation, or drink details (e.g. sugar, milk, size)."
  - Privacy footnote: "Only when you tap Analyze, your selected photo and description are sent to the configured cloud model. Estimates must be reviewed; no wearable or medical measurements are inferred."
  - Inline error (alert role) appended with "Manual entry remains available."
  - Primary `Analyze photo` (disabled until a photo exists / while busy).
  - Secondary `Enter meal manually`.
  - **Shutter:** 76 ring (1px accent 0.45) with 58 accent circle; opens camera.
  - `Upload from library` row: images icon 19 + 14/600 text, 52 high.
- **Actions:** take photo, pick from library, type description, analyze, manual path, dismiss tutorial.
- **States:** no image (Analyze disabled), analyzing (busy; pickers disabled), analysis error, existing draft conflict ("Your current meal draft has items. Review or clear that draft before analyzing another meal."), no food identified.
- **First-run tutorial sheet** (on top): title `Capture your meal`; two numbered steps (28px accent-tint markers): "1 Add a ruler — Place a 15 cm ruler beside the plate or cup."; "2 Shoot from above — Keep the whole meal in frame and hold steady."; primary `Got it`.

### 11.9 Meal result / meal detail (`/meal`)

- **Purpose:** review the recognized meal, adjust items, see totals, save or update a log.
- **Structure:** back header; photo (when present) with "Loaded"/"Loading photo…" states; title (meal name or `Meal`); date/time; total kcal hero; macro summary (protein/carbs/fat); **item list** where each row shows name, portion, kcal, macros and supports swipe actions (edit / delete); option sheets per item; `Add item` action; meal-type selector (breakfast/lunch/dinner/snack); primary save/update; `Edit nutrition` path.
- **Actions:** add item, edit item, delete item, change amount, replace food, change meal type, save.
- **States:** AI draft vs. saved log; dirty/unsaved; empty (no items); saving; error; "CURRENT ITEM · NOT REPLACED YET" while replacing.
- **Copy:** "Review the name, portion, calories and macros", "Estimated total", "This item · estimated", "Your meal stays unchanged until you confirm.", "Remove this food from the meal", "Change amount", "New amount", "Previous amount".

### 11.10 Add item (`/add-item`)

- **Purpose:** add food by database search or manual nutrition entry.
- **Structure:** back header; title `Add item`; segmented choice: `Search the database` vs manual; search field `Search food` with live results (name + per-100g/per-portion kcal + macros); `No matching foods.` / `No database match`; manual mode shows `Full portion values` + `NutrientGrid` (Energy, Protein, Carbs, Fat) + portion weight; primary `Continue`.
- **Copy:** "Enter the label values for the full portion.", "Review the name, amount, and nutrients above."
- **States:** idle, searching, results, no results, manual entry, validation errors, submit busy.

### 11.11 Review item (`/review-item`)

- **Purpose:** confirm or correct one item before it enters the meal.
- **Structure:** back header; item name field; portion/amount; `NutrientGrid`; estimated flag; primary `Save`/`Continue`; `Delete item`.
- **States:** new item vs. editing existing; estimated vs. database values; validation.

### 11.12 Replace food (`/replace-food`)

- **Purpose:** swap an item for a database food while preserving the meal.
- **Structure:** back header; current item summary pinned at top with `CURRENT ITEM · NOT REPLACED YET`; search; result list with kcal/macros; primary `Select` per row; confirmation.
- **Copy:** "Select a replacement from the database.", "Choose a food first".
- **States:** searching, no match, selected, applying.

### 11.13 Workout plan (`/(tabs)/workout`)

- **Purpose:** the week's training at a glance and entry into any routine.
- **Structure (gap 18):**
  1. Eyebrow `My plan` (12/500 muted); title `Workout plan` (28/400); subtitle `4x/week · fat loss & muscle maintenance` (13 muted).
  2. **Week strip:** Mon–Sun, seven tiles 58 high, radius 14, white; day 10 muted, date 14/600; active = accent fill + white.
  3. **Recovery card** (conditional; `accentTint`, radius 18, padding 16): shield icon 24, `Recovery` 14/600, `Rest 3 days · light 2 days / Return Oct 12, if ready` 11 muted; opens sheet.
  4. **Today section:** heading `Today` + routine-name action; card with `Current routine` 16/600, summary `Chest · 5 exercises · 12 sets · 45 min` 11 muted, date badge (accent-tint, radius 10, 10/600 accent), exercise list (name 12 / prescription 12 muted), optional `ADJUSTED FOR …` 10 uppercase.
  5. **Upcoming section:** heading `Upcoming` + `Oct 9`; same card with `Next routine` and `IF READY · not cleared medically` when recovery is active.
  6. **Browse muscle groups:** heading + `6 groups`; 2×3 grid of tiles (31% width, white, radius 14, padding 12/10): body SVG 26×34 + label 13/600.
  7. Primary `View Chest plan`.
- **Actions:** open today's routine, next routine, any muscle group, recovery sheet.
- **States:** recovery off (no recovery card, no caveat), recovery on (card + caveat), adjusted routine (`adjustedFor`).
- **Copy:** `My plan`, `Workout plan`, `Today`, `Upcoming`, `Current routine`, `Next routine`, `Browse muscle groups`, `6 groups`, `IF READY · not cleared medically`.

### 11.14 Chest plan (`/chest-plan`)

- **Purpose:** a focused chest routine with hero and exercise list.
- **Structure:** back header; hero image (`chest-hero.png`) with gradient/overlay; title; meta (exercises, sets, minutes); exercise cards/rows each with name, prescription (e.g. `3 × 10`), thumbnail and chevron → exercise guide; primary `Start workout`.
- **States:** recovery-adjusted variant; loading image.

### 11.15 Group plan (`/plan?group=…`)

- **Purpose:** generic muscle-group routine (back, shoulders, arms, legs, core).
- **Structure:** same as chest plan, parameterised by group; body diagram icon; exercise list; start CTA.
- **States:** unknown group (fallback/empty), recovery-adjusted.

### 11.16 Exercise guide (`/exercise-guide`)

- **Purpose:** technique reference before or during a session.
- **Structure:** back header; exercise name; demo media (SVG bench demo / `play.svg` video affordance); `Technique guide` section of numbered cues; target muscles; prescription; `Start workout` / `Continue`.
- **States:** media loading, no guide content, reduced motion (static frame).

### 11.17 Session (`/session`)

- **Purpose:** run a workout set by set, with on-screen set logging.
- **Structure:** full-screen; header with elapsed time, exercise position (`2 of 5`), close/back with confirm; current exercise name + prescription; set list (set number, weight, reps, done state); `Log set` opens the set sheet; rest timer between sets; footer `Finish workout`.
- **Set sheet:** fields Weight (kg), Reps, optional RPE; actions `Save set`, `Delete set`, `Cancel`.
- **Finish:** summary (duration, sets, volume), `Start another workout` / done.
- **Discard confirm:** "Cancel and delete workout", "Keep workout, discard edits", "Keep workout".
- **States:** not started, in progress, resting, paused, finishing, empty (no sets).

### 11.18 Profile (`/(tabs)/profile`)

- **Purpose:** identity, body metrics, plan refinement, account and privacy.
- **Structure (gap 22):**
  1. Title `Profile` (28/400).
  2. Error banner (conditional): "Couldn't load your health data." + `Retry`.
  3. **Identity:** 60px `accentTint` avatar with initials 20/500 accent; name 19/600; email 12 muted.
  4. **Profile overview:** heading 17/600; rows height 50 with 1px dividers — `Birthdate` (static `14 Jun 1998`), `Sex / gender`, `Height`, `Weight`. Values `Not set` when missing; skeleton while loading.
  5. **Refine your plan:** `Goal / target`, `Workout frequency` (`4 sessions/week`), `Daily activity`, `Target weight`, `Recovery plan` (`None`).
  6. **Account:** `Account data`, `BLE test`, `Sign out`.
  7. **Period recovery** (only when sex = Female): full-width 52 accent button; off state label `I am in my period`; on state `My period has ended` with `accentTint` fill and accent text; turning on shows a native alert: title `Period recovery`, body "Used only to adjust your plan. You can turn it off any time.", actions `Not now` / `Turn on`.
- **Actions:** open each bottom sheet, navigate to account-data / BLE, sign out, toggle period recovery.
- **States:** loading skeletons, missing values, error banner, female-only section, dirty persistence.
- **Copy:** `Profile overview`, `Refine your plan`, `Account`, `Not set`, `None`.

### 11.19 Profile sheets (`features/profile/sheets.tsx`)

| Sheet | Control | Copy / notes |
|---|---|---|
| Height | Wheel picker, cm | "Height contributes to your initial energy estimate." |
| Weight | Wheel picker / numeric, kg, 0.1 | Saving updates nutrition targets and triggers Home banner |
| Sex | Radio list | Options include `Female`, `Male`, presumably `Other`/`Prefer not to say` |
| Goal | Radio list | Fat loss / maintenance / muscle gain variants |
| Frequency | Radio list 1–7 | Value renders `N sessions/week` |
| Activity | Radio list | Sedentary → very active |
| Target weight | Numeric kg | Compared against current weight |
| Recovery | Recovery sheet | See §11.20 |

All use: `SheetField` bordered blocks, `SheetActions` (primary save 52, secondary cancel 48), busy state on primary, validation inline.

### 11.20 Recovery sheet (`features/recovery/recovery-sheet.tsx`)

- **Purpose:** choose a recovery area and see how the plan changes.
- **Structure:** title (e.g. `Recovery`); area options (e.g. period, illness, injury, none); three-stage timeline `RecoveryStages` (rest → light → return) with day counts and tentative return date; explanatory copy; actions Save / Remove.
- **Copy:** "No recovery plan. Your workouts continue as normal.", "Tentative return · if ready", "Resume your regular plan when you're ready.", "If ready · not cleared medically".
- **States:** none selected, selected, saving, cleared.

### 11.21 Account data (`/account-data`)

- **Purpose:** privacy and data control.
- **Structure:** back header; title; sections `Account` (change email address, password), `Accuracy & personalization`, `Your health data is private`; `Delete account` destructive action; confirmation copy explaining irreversibility.
- **Actions:** change email, change password, delete account, back.
- **States:** confirmation, pending, success, error.

### 11.22 BLE test (`/ble-sync`) — developer-only

- **Purpose:** hardware diagnostics for the watch link.
- **Structure:** scan/connect controls, device list, `Live IMU Telemetry`, `Phone → Watch Message`, `Event Log` with timestamped rows.
- **Visual language:** **divergent** dark slate/blue/green/red palette (`#2563EB`, `#334155`, `#DC2626`, `#10B981`, `#38BDF8`, `#4ADE80`, `#EF4444`). This is a test harness, not consumer UI. The design spec should state that it is excluded from the consumer design language.

---

## 12. Data models (design-relevant)

### Auth user
```
id, name, email
session persisted in expo-secure-store
states: loading | signedOut | signedIn
```

### Health profile (`health-store`)
```
weightKg: number | null
heightCm: number | null
sex: "Female" | "Male" | ... | null
weightUpdated: boolean
plan: {
  goal: string
  sessions: number        // per week
  activity: string
  targetWeightKg: number | null
}
recovery: {
  area: string            // e.g. PERIOD_AREA
  restDays: number
  lightDays: number
  returnDate: string
} | null
loading, error
```

### Meals (`meals-store`)
```
MealItem {
  id, name, portion, amount, unit?
  kcal, protein, carbs, fat
  source: "database" | "ai" | "manual"
  estimated: boolean
}
MealDraft / MealLog {
  id, name, date, time
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  photoUri?, items: MealItem[]
  kcal, macros { protein, carbs, fat }
}
MealGlyph = "wheat" | "drumstick" | "carrot" | "droplet"
history: MealLog[]
derived: loggedKcal, loggedMacros
```

### Workout (`workout-store`, `routines`)
```
Routine {
  name, sets, minutes
  exercises: { name, prescription }[]
}
routinesFor(recovery) -> { today, next, adjustedFor? }
session: { startedAt, currentExercise, sets: { weightKg, reps, done }[] }
```

### Chart data
```
weights: number[]        // 7 points for the sparkline
WEEK_ACTIVE: boolean[]   // 7 activity dots
```

---

## 13. Asset inventory

All under `apps/mobile/assets/images/`.

**App / store**
`icon.png`, `splash-icon.png`, `favicon.png`, `android-icon-foreground/background/monochrome.png`, legacy Expo badges and logos.

**Auth:** `auth/logo.svg`, `calendar-days.svg`, `check.svg`, `chevron-left.svg`, `eye-off.svg`, `lock-keyhole.svg`, `user-round.svg`.

**Home / tabs:** `home/tab-house.svg`, `tab-utensils.svg`, `tab-dumbbell.svg`, `tab-user-round.svg`, `chevron-right.svg`, `check.svg`, `shield-check.svg`, `previous-log.svg`, `ring-bg.svg`, `ring-hole.svg`, `ring-center-saved.svg`, `ring-track-saved.svg`, `ring-saved.svg`, `ring-remaining.svg`, `weight-chart.svg`, `weight-chart-saved.svg`, `ios-signal.svg`.

**Meals:** `meals/utensils.svg`, `ruler.svg`, `images.svg`, `switch-camera.svg`, `search.svg`, `search-md.svg`, `search-lg.svg`, `x.svg`, `x-lg.svg`, `check.svg`, `chevron-right.svg`, `pencil.svg`, `zap-off.svg`, `wheat.svg`, `drumstick.svg`, `carrot.svg`, `droplet.svg`, `weight.svg`, `meal-photo.png`.

**Progress:** `progress/chevron-left.svg`, `weight-dot.svg`, `weight-dot-latest.svg`, `weight-line.svg`.

**Recovery:** `recovery/body-chest.svg`, `body-back.svg`, `body-shoulders.svg`, `body-arms.svg`, `body-legs.svg`, `body-core.svg`, `chevron-left.svg`, `chevron-right.svg`, `circle-x.svg`, `lock.svg`, `switch-disabled.svg`.

**Workout:** `workout/chest-hero.png`, `bench-demo.svg`, `play.svg`.

**Profile:** `profile/chevron-right.svg`.

---

## 14. What the design spec must resolve (known inconsistencies)

These are real divergences in the current app. Do not silently copy them; choose and document a resolution.

1. **Three palettes coexist.**
   - Canonical warm ivory/oxblood `Palette` — used by nearly every feature.
   - Legacy `Colors.light` / `Colors.dark` (`#000`, `#fff`, `#F0F0F3`, `#E0E1E6`, `#60646C`) — used by Expo template components and the navigation theme.
   - Auth overrides in `login-screen.tsx`: `background/surface #FFFFFF`, `text #1C1B1F`, `textMuted #49454F`, `border #79747E`, `error #B3261D`, `errorContainer #F9DEDC`, `onErrorContainer #410E0B` (Material 3-like). This yields a visibly cooler, higher-contrast auth flow.
   - BLE diagnostics uses a fourth slate/blue palette.
   **Recommendation:** declare `Palette` the single source, migrate auth to it (or formally define an "auth" sub-theme with intent), and quarantine BLE as dev-only.

2. **Dark mode is declared but not implemented.** `userInterfaceStyle: "automatic"` and `ThemeProvider` switch navigation chrome, but feature screens hardcode the light `Palette`. Either commit to a full dark token set (needs dark equivalents for background, surface, card, border, text, textMuted, accent, accentTint, previewTint) or force light mode and say so.

3. **Splash and brand disagree.** Splash background `#208AEF` (bright blue) and Android icon background `#E6F4FE` are unrelated to the oxblood `#9D2332` brand. Align or intentionally introduce a secondary brand colour.

4. **Disabled primary buttons fail contrast** (white label on `#EFEBE5`). Define a disabled token pair.

5. **Border radius drifts** across 6/10/12/14/16/18/20/24/100. Consolidate into a documented scale.

6. **Two spacing scales** (`tokens.ts` 4/8/16/24/32 vs `constants/theme.ts` 2/4/8/16/24/32/64). Pick one; keep 64 as optional.

7. **Demo data is presented as real.** Home's base calories, macro bases, weights, week activity, date, and `Sam N.` are hardcoded. The spec should define empty/first-run and real-data layouts, not just the populated demo.

8. **Typography is fixed-size** outside login. Define a dynamic-type strategy (allow font scaling, reflow rules for hero numbers and tab labels).

9. **No formal focus/hover design** beyond `Pressable` opacity for web. If web is a target, define focus rings.

10. **Sheet vs. full screen is inconsistent** for similar editing tasks. Establish a rule: single-value edits = sheet; multi-field review = full screen.

11. **Copy casing is inconsistent** (`Capture Meal` vs sentence case elsewhere). Standardise on sentence case.

12. **Color-only status in some places** (week dots, macro bars). Add shape/label redundancy.

---

## 15. Quick reference for the design AI

- **Do:** warm ivory canvas, white bordered cards, one oxblood accent, text-led headers, 24px gutters, 48dp targets, short honest copy.
- **Don't:** add shadows, gradients (except photo overlays), extra accent colours, gamified badges, or dense dashboards.
- **Numbers:** one hero number per card; units muted and smaller; always state what the number means (left, consumed, target, estimate).
- **Always:** show loading, empty, error, offline, and "not set" states; label estimates; give every icon-only control an accessible label.
- **Motion:** 150–250ms, ease-out in, ease-in out, never blocking, reduced-motion safe.
