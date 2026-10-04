# Product scope (working summary)

Condensed view of [project-a-master.md](./project-a-master.md) and [tech-stack-deck.md](./tech-stack-deck.md). Prefer those for exact wording; use this for day-to-day design and coding questions.

## Problem

Glanceable nutrition + training across phone and Huawei watch. Success bar from next actions: on the watch, the user should **see nutrition status at a glance** (remaining calories + protein deficit). Phone hosts a matching glanceable dashboard.

## In-scope modules

| Module | Mobile | Watch |
| --- | --- | --- |
| **Nutrition Analytics** | AI extract kcal / protein / carbs / fat | Glance: calories remaining + protein deficit |
| **Plan Generation** | BMR/TDEE, goals, 6-muscle schedule | Sync plan; new / continue cycle |
| **Action Guidance** | Video + form cues | Wrist micro-animations |
| **Live Execution** | Progress / volume / body-comp history | IMU 8–12 reps, auto set done, haptic rest |

## Approaches

| Module | Approach |
| --- | --- |
| Plan Generation | Rule-based + suggestions |
| Action Guidance | UI/UX; persona TBD |
| Live Execution | Tiny optimized (edge) model |
| Nutritional Analytics | Method TBD in master; compute = mobile edge |

## Stack (locked)

| Layer | Choice |
| --- | --- |
| Mobile | React Native |
| Watch | ArkTS |
| Backend | Firebase |
| Nutrition compute | Edge on mobile (not cloud) |
| Rep counting | Edge on watch (not phone) |

## Team

| Track | People | Role |
| --- | --- | --- |
| Soft | Toàn, Thịnh, Khánh | What enters UI/UX |
| AI | Nam, Hiếu | Model / method |

## Still open in sources

- Project A deliverables (`?`)
- M4 milestone
- Function-requirements Must / Nice / Out matrix
- Huawei Health Kit sync evidence; Bluetooth send design
- Trust / success metrics (Khánh)
- Many draft task assignments

## Related

- Ring meanings in the UI: [rings.md](./rings.md)
- Repo layout & coding rules: [`../AGENTS.md`](../AGENTS.md)
