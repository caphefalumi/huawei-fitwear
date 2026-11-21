# Profile tab overhaul plan

## Goal

Make Profile a settings hub: find health details, training preferences, integrations, or account controls without scanning one long form. Keep current data models and editing behavior.

## Structure

| Section | Rows and behavior |
| --- | --- |
| Identity | Name and email at the top; separate edit action only for editable fields. |
| Health & goals | Weight, height, birthdate, sex, daily activity, goal and target weight. Show a value or `Not set`; retain short native edit sheets. |
| Training & recovery | Workout frequency, duration, emphasis, experience, training weights, exercise preferences, and injuries. Keep existing dedicated routes for multi-step edits. |
| Connected devices | Watch setup and health integrations. Show connection status only when backed by live state; otherwise show `Manage connection`. |
| Account & privacy | Data export/import and account deletion under Account data; separate sign-out action. Put approved policy links here as well as on sign-up. |
| Developer options | Keep behind the existing developer-mode gate, outside the primary groups. |

## Delivery

1. Benchmark the Profile → edit → save and Profile → device setup journeys using Appllama flow and screen search when access is available. Compare grouped rows, edit-sheet behavior, and error recovery; do not copy visual assets.
2. Reorganize existing rows without changing settings data or routes. Use the app's semantic colors, native-style groups, readable values, and consistent disclosure indicators.
3. Make edit states explicit: pending, saved, failed with retry, and unsaved changes on dismiss. Keep errors scoped to the affected setting; distinguish loading, not set, and offline when the data source can tell them apart.
4. Verify on iOS and Android: light/dark, large text, VoiceOver/TalkBack, safe areas, keyboard, native Back, failed save, and returning from nested screens. Record the edit and device journeys to inspect transition and scroll behavior.

## Acceptance

- All existing settings and account actions remain reachable; common edits take one tap from Profile.
- Rows announce label, value, and action. Switches announce state. Text remains readable at the largest supported system size.
- A failed save preserves the draft; returning from a child screen restores the user's place.
- No invented device state, duplicate action labels, or new dependencies just to group rows.
