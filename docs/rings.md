# Progress rings — what each one means

From Project A scope (**Nutrition Analytics**: kcal / protein / carbs / fat; glance target = calories remaining + protein deficit) plus the live-execution rings used in the app. Icons and layout rules for agents: [`AGENTS.md`](../AGENTS.md) → Progress rings.

## Concentric nutrition dial (Home hero + watch nutrition page)

Outer → inner. Each ring is **consumed / daily target** (progress can exceed 1.0 = over target).

| Ring | Measures | Icon | Role at a glance |
| --- | --- | --- | --- |
| **Calories** (outer, thickest) | Energy intake vs calorie target | `fire` | Primary. Center readout is **kcal left** (target − consumed). |
| **Protein** | Protein grams vs protein target | `arm-flex` | Secondary glance signal; callout also shows **protein deficit (g left)**. |
| **Carbs** | Carbohydrate grams vs carbs target | `grain` | Supporting macro balance. |
| **Fat** | Fat grams vs fat target | `water` | Supporting macro balance. |

Status under the dial (On Track / Almost There / Over Target) is derived from calorie adherence, not from icons alone.

On concentric dials, each ring’s icon sits in a **fixed bead at that ring’s 12 o’clock start**. It does **not** move with the arc tip.

## Other rings in the app

| Ring | Measures | Icon | Where |
| --- | --- | --- | --- |
| **Workout progress** | Sets (or reps) completed of planned | `dumbbell` → `check` at 100% | Home workout card, Active Workout, watch workout glance |
| **Rest timer** | Seconds left of the rest interval | `timer-outline` | Active Workout rest screen |

These come from **Live Execution** (set completion + haptic rest), not from the nutrition extraction list.

## Huawei Watch Activity Glance Dial (`HuaweiGlanceDial`)

The smartwatch preview and Home live watch toggle support the 3-ring open activity dial (`HuaweiGlanceDial.tsx`):
- **Outer Ring (Red / `#FF4D30`)**: Energy expenditure / calories burned. Arc starts at 222° and sweeps clockwise up to 248° maximum, stopping at ~110° to leave the bottom-right quadrant completely open.
- **Middle Ring (Yellow / `#FFD200`)**: Active exercise minutes / workout sessions. Anchored with a running figure icon bead (`🏃`) at 222°.
- **Inner Ring (Cyan Blue / `#00A3FF`)**: Stand / active hours. Anchored with a standing figure icon bead (`🧍`) at 222°.
- **Stacked Color Readout**: Centered cleanly within the inner radius corridor at bottom-right (`[hours (cyan), workouts (yellow), calories (coral)]`), guaranteeing that the red arc never clips or overlaps high numbers (e.g. `1537`).

## Do not confuse

- Center **flame + number** on the nutrition dial = calories remaining (hero metric), not a fifth telemetry channel.
- Macro **bars** (`MacroBar`) show the same P/C/F targets as the rings; bars are not a different data model.
- Apple-style Activity rings (Move / Exercise / Stand) are available via the `HuaweiGlanceDial` companion glance mode alongside our core nutrition macro + workout/rest dials.
