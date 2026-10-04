---
name: AI FitWear Design System
colors:
  surface: '#effcf9'
  surface-dim: '#d0ddda'
  surface-bright: '#effcf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eaf6f3'
  surface-container: '#e4f1ee'
  surface-container-high: '#deebe8'
  surface-container-highest: '#d8e5e2'
  on-surface: '#121e1c'
  on-surface-variant: '#3e4946'
  inverse-surface: '#273331'
  inverse-on-surface: '#e7f3f1'
  outline: '#6e7a76'
  outline-variant: '#bdc9c5'
  surface-tint: '#006b5e'
  primary: '#005e53'
  on-primary: '#ffffff'
  primary-container: '#DDF3EF'
  on-primary-container: '#00302A'
  inverse-primary: '#7ad7c6'
  secondary: '#2d4fcf'
  on-secondary: '#ffffff'
  secondary-container: '#4b69ea'
  on-secondary-container: '#fffbff'
  tertiary: '#992c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c33b00'
  on-tertiary-container: '#ffe8e2'
  error: '#B3261E'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#97f3e2'
  primary-fixed-dim: '#7ad7c6'
  on-primary-fixed: '#00201b'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001355'
  on-secondary-fixed-variant: '#0736ba'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59e'
  on-tertiary-fixed: '#390b00'
  on-tertiary-fixed-variant: '#842500'
  background: '#effcf9'
  on-background: '#121e1c'
  surface-variant: '#d8e5e2'
  primary-dark: '#4FD6C4'
  on-primary-dark: '#00201B'
  primary-container-dark: '#12332E'
  on-primary-container-dark: '#BFF3EB'
  hero-bg-light: '#00796B'
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
