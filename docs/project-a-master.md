# Project A MASTER DOC (full capture)

Structured transcription of *Project A MASTER DOC.docx*. Section order follows the document. Unfilled cells are marked **(blank in source)**.

---

## Pending / ops board

Header note (VI): *Việc nào đang pending sẽ xem ở đây* — pending work is tracked here.

| Field | Value |
| --- | --- |
| Next meeting | 1 Oct, 19:30 |
| Estimated time | 30 minutes |

### Next actions

| Owner | Action |
| --- | --- |
| **Toàn** | Research + propose a **glanceable nutrition dashboard on the phone**. Expectation: on the **watch**, the dashboard should let the user **see their nutrition status at a glance**. |
| **Nam + Hiếu** | **(blank in source)** |
| **Khánh** | How do we measure success? How do we ensure our measurements / decisions are trustworthy? |

### Backlog

1. Feasibility of **Huawei Health Kit** to sync Huawei Watch ↔ Android & iOS. Needs evidence.
2. How does **Bluetooth** communication send data? (open question)

---

## Team

| Track | Members |
| --- | --- |
| Soft | Toàn, Thịnh, Khánh |
| AI | Nam, Hiếu |

Working split (stated later in the doc):

- **Software** decides what enters the UI/UX.
- **AI** delivers the model / method.

---

## Scope of work

### In-scope functional modules

Matrix from the master doc (MobileOS App vs WatchOS App):

| Functional module | MobileOS App | WatchOS App |
| --- | --- | --- |
| **Nutrition Analytics** | AI nutrient extraction: **Kcal**, **Protein**, **Carbs**, **Fat** | Glanceable nutrition dashboard showing **remaining calories** and **protein deficit** target |
| **Plan Generation** | Body parameters input (BMR/TDEE); goal selection; **6-muscle-group** schedule builder | Sync active plan; training entries: **New Cycle**, **Continue Old Cycle** |
| **Action Guidance** | Comprehensive video library with text explanations & form cues for beginners | Short-loop micro-animations on the wrist for rapid form checks |
| **Live Execution** (Hiếu) | Global progress trends, weight volume history, body composition analytics | IMU motion auto-counting (**8–12 reps**), auto set completion & **haptic rest timer** |

### General decisions (stack & compute)

| Decision | Choice | Rationale (as written) |
| --- | --- | --- |
| Mobile framework | **React Native** (Android & iOS) | Fast development, large community, easy BLE/camera libraries |
| Watch framework | **ArkTS** (WatchOS / Huawei) | Must-do; no other option |
| Database | **Firebase** | Prefer deployment speed + built-in realtime sync |
| Nutrition analytics compute | **Edge on mobile** (planned) | Lower API cost; fast realtime analysis; works without Wi‑Fi |
| IMU rep counting | **100% edge on watch** | Low latency; industry-standard (e.g. Apple Watch); does not depend on Wi‑Fi during training |

### Deliverables of Project A

**(blank / “?” in source)** — not defined in the master doc yet.

### Functional module approach

| Module | Approach |
| --- | --- |
| Nutritional Analytics | **(blank in source)** — stack/compute decided above; method detail TBD |
| Plan Generation | Rule-based with suggestions |
| Action Guidance | UI/UX-based; need to understand user persona |
| Live Execution | Tiny optimized model |

### Out of scope (presentation / process)

Listed under “Out of Scope” / presentation hygiene in the master doc (not product-module exclusions):

- Presentation
- References for every item (paper, journal, conference)
- Page number
- Team member name
- Client (contact who?)
- Agenda
- Q&A behavior: ask; don’t over-explain
- Bigger text size, less text per slide

Phases / sprints: noted as *Các phases / Sprint sẽ chia ở đây* — to be split here later.

---

## Milestones

| # | Milestone | Checkpoint |
| --- | --- | --- |
| **M0** | Scope Clarification & Proposal | End of **27 Sep** |
| **M1** | Technical Proposal and Presentation | End of **03 Oct** |
| **M2** | **AI:** Dataset ready and methodology proposals for feature engineering, body metric assessment, automated workout planner. **Software:** Sending and syncing simple data Mobile ↔ Huawei Watch; proposals for mobile and watch UI/UX design | End of **10 Oct** |
| **M3** | **PoC — AI + Data:** PoC for mobile AI food image recognition + how-to for body metric assessment and automated workout planner. **Software:** PoC for software following the Technical Proposal | End of **24 Oct** |
| **M4** | **?** | **?** |

---

## Function requirements

Category / Area / Must / Nice-to-have / Not in Scope table exists with **Mobile** and **Watch** category rows, but **all requirement cells are blank in the source**. Do not invent must/nice/out rows from this document alone.

---

## Actions and alignment logs

Pointer in source: *Actions and Alignment Logs: Click Here* (external link not embedded as URL in the extracted XML).

### Draft task board

| Member | Tasks | Definition of Done | Expected deadline | Done? |
| --- | --- | --- | --- | --- |
| Hiếu | **(blank)** | | | |
| Nam | **(blank)** | | | |
| Thịnh | Client introduction; pain point and needs; project outcomes (what to solve?) | **(blank)** | **(blank)** | **(blank)** |
| Toàn | **(blank)** | | | |
| Khánh | **(blank)** | | | |

Note: Toàn’s next action (glanceable nutrition dashboard) appears in the ops board above, not yet copied into this draft task table.
