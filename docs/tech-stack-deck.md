# Tech stack deck — English (full capture)

Transcription of *tech-stack-deck-en.pptx*: three slides plus speaker notes. This is the decision record for **two apps + one shared backend**, and for **where compute runs** for nutrition analytics and IMU rep counting.

---

## Slide 1 — Tech Stack

**Title:** Tech Stack  
**Subtitle:** Two apps, one shared backend

| Piece | Technology | Role |
| --- | --- | --- |
| Mobile app | **React Native** | Phone companion (Android & iOS) |
| Watch OS app | **ArkTS** | Huawei watch |
| Backend | **Firebase** | Shared backend |

**Speaker notes:**

> Two apps: the mobile app is built with React Native, the watch app uses ArkTS for Huawei watch OS, and both share a Firebase backend.

Aligns with master-doc “General Decisions” (React Native, ArkTS, Firebase).

---

## Slide 2 — Nutrition Analytics (edge vs cloud)

**Title:** Nutrition Analytics

| Option | Status |
| --- | --- |
| **Edge compute on mobile** | **Selected** |
| Cloud compute | Not selected |

**Why edge compute (slide body):**

- No API costs  
- Fast real-time analysis  
- Works without Wi‑Fi  
- Fits mass production and real user use cases  

**Trade-off (slide body):**

- Lower accuracy than cloud, which has no infrastructure limits  

**Speaker notes:**

> Two options: edge compute on mobile or cloud compute. We chose edge because it has no API costs, gives fast real-time analysis, and works without Wi‑Fi. It fits mass production and real user use cases. Trade-off: accuracy is lower than cloud, since cloud has no infrastructure restrictions.

Aligns with master-doc plan: nutrition analytics on **mobile edge**.

---

## Slide 3 — IMU rep counting (mobile edge vs watch edge)

**Title:** IMU Rep Counting

| Option | Status |
| --- | --- |
| Edge compute on mobile | Not selected |
| **Edge compute on watch** | **Selected** |

**Why the watch (slide body):**

- Counts reps even if Bluetooth drops  
- Notifies when the workout ends (**use case 3**)  
- Industry standard: Apple Watch, Samsung Galaxy Watch, Pixel Watch  

**Speaker notes:**

> Two options: edge compute on mobile or on the watch. We chose the watch because it fits use case 3, notifying the user when the workout is done. If Bluetooth drops, the phone loses the rep count and cannot notify. It is also the industry standard, used by Apple Watch, Samsung Galaxy Watch and Pixel Watch.

Aligns with master-doc: IMU auto-counting and haptic rest on the watch; 100% edge on watch.

---

## Implications for this repo

| Concern | Decision from this deck |
| --- | --- |
| Codebases | Separate mobile (RN) and watch (ArkTS); shared Firebase backend concept |
| Food / nutrient inference | Prefer on-device mobile compute; do not assume always-online cloud APIs |
| Rep counting / rest haptics | Prefer on-watch logic; phone may sync later, but must not be required mid-set if BT drops |

Open items that this deck does **not** define (see master doc backlog): Huawei Health Kit feasibility evidence; exact Bluetooth payload / protocol design.
