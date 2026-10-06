---
name: AI FitWear Design System
colors:
  surface: '#f8fafc'
  surface-dim: '#e2e8f0'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8fafc'
  surface-container: '#f1f5f9'
  surface-container-high: '#e2e8f0'
  surface-container-highest: '#cbd5e1'
  on-surface: '#0f172a'
  on-surface-variant: '#64748b'
  inverse-surface: '#1e293b'
  inverse-on-surface: '#f8fafc'
  outline: '#94a3b8'
  outline-variant: '#cbd5e1'
  surface-tint: '#2563eb'
  primary: '#2563eb'
  on-primary: '#ffffff'
  primary-container: '#eff6ff'
  on-primary-container: '#1d4ed8'
  inverse-primary: '#93c5fd'
  secondary: '#0284c7'
  on-secondary: '#ffffff'
  secondary-container: '#e0f2fe'
  on-secondary-container: '#0369a1'
  tertiary: '#992c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c33b00'
  on-tertiary-container: '#ffe8e2'
  error: '#B3261E'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  background: '#f8fafc'
  on-background: '#0f172a'
  surface-variant: '#e2e8f0'
  primary-dark: '#3b82f6'
  on-primary-dark: '#ffffff'
  primary-container-dark: '#1e3a8a'
  on-primary-container-dark: '#dbeafe'
  hero-bg-light: '#2563eb'
  hero-bg-dark: '#12332E'
  macro-kcal: '#D9480F'
  macro-kcal-dark: '#FF8A5B'
  macro-protein: '#3B5BDB'
  macro-protein-dark: '#8CA2FF'
  macro-carbs: '#A8730A'
  macro-carbs-dark: '#F2B84B'
  macro-fat: '#9C36B5'
  macro-fat-dark: '#D58AF0'
  success: '#2E7D32'
  success-dark: '#6FD38A'
  warning: '#9A5B00'
  warning-dark: '#F2B84B'
  error-dark: '#FF8A80'
  info: '#0B6FA8'
  info-dark: '#6CC1F5'
  muscle-chest: '#C2410C'
  muscle-back: '#0F766E'
  muscle-shoulders: '#B45309'
  muscle-legs: '#4338CA'
  muscle-arms: '#BE185D'
  muscle-abs: '#4D7C0F'
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem # 8dp
  DEFAULT: 0.875rem # 14dp
  md: 0.875rem # 14dp
  lg: 1.25rem # 20dp
  xl: 1.75rem # 28dp
  full: 9999px
spacing:
  gutter: 0.75rem # 12dp
  margin: 1rem # 16dp
  space-xs: 0.25rem # 4dp
  space-sm: 0.5rem # 8dp
  space-md: 0.75rem # 12dp
  space-lg: 1rem # 16dp
  space-xl: 1.5rem # 24dp
---

# AI FitWear Design System

The design system embodies a fresh, calm, and energetic ethos crafted for beginner gym-goers seeking a frictionless fitness and nutrition journey. Acting as an encouraging personal coach rather than a sterile clinical utility or aggressive bodybuilding tracker, it strips away intimidation through clarity, ample whitespace, and friendly visual metrics.

Balancing modern utility with athletic precision, the aesthetic employs a clean corporate-modern baseline refined by subtle tactile warmth. Layouts prioritize glanceability—enabling users to consume core data (such as remaining caloric targets and workout progress) in under two seconds. Strong visual feedback loops support sweaty, high-motion gym environments with generous touch targets, distinct state badges, and an uncompromising approach to dual-theme fidelity across mobile and paired wearable ecosystems.

## Colors

The color palette centers around a distinct teal-green seed (`#00796B` in light mode, transforming to `#4FD6C4` in dark mode). Light mode employs rich, grounding saturation paired with crisp white text (`#FFFFFF`) on filled surfaces, while dark mode shifts to a luminous mint-teal fill paired with deep contrast typography (`#00201B`) to preserve legibility without glare.

### Semantic Macro Tokens
Nutrition categories are anchored to strictly dedicated hues:
- **Kcal (Flame):** `#D9480F` (Light) / `#FF8A5B` (Dark)
- **Protein (Muscle):** `#3B5BDB` (Light) / `#8CA2FF` (Dark)
- **Carbohydrates (Wheat):** `#A8730A` (Light) / `#F2B84B` (Dark)
- **Fat (Drop):** `#9C36B5` (Light) / `#D58AF0` (Dark)

Each macro color maps to a soft background track using 12% opacity in light mode and 20% in dark mode. Macro values must always be accompanied by an icon or label to ensure clarity without relying solely on color recognition.

### Theme & Contrast Rules
Neutrals feature an intentional cool-teal undertone (`#EFFCF9` page background shifting to `#0E1312` in dark mode). Dark mode avoids pure pitch-black backgrounds, using elevated tonal steps (`#161C1B` card surfaces and `#1F2625` sheet overlays) to create natural visual structure. Contrast ratios maintain a strict minimum of 4.5:1 for body copy and 3.0:1 for graphical elements and large display metrics.

## Typography

The typographic hierarchy pairs **Be Vietnam Pro** for expressive structural headings with **Inter** for versatile UI labels, continuous reading, and live data telemetry.

## Shapes & Radii

Corners scale systematically across component types:
- **Small (8dp):** Text fields, search bars, and selection chips.
- **Medium (14dp):** Standard interactive buttons, stepper controls, and segmented pickers.
- **Large (20dp):** Macro metric containers, meal photo viewports, and primary dashboard cards.
- **Extra Large (28dp):** Bottom sheet upper corners and primary dialog containers.
- **Full (9999dp):** Status chips, circular timer rings, avatars, and floating macro badges.
