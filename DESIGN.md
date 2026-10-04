---
name: AI FitWear Titanium Monochrome System
colors:
  surface: '#F6F7FA'
  surface-dim: '#E5E8EE'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#F1F3F6'
  surface-container: '#ECEEF2'
  surface-container-high: '#E2E5EB'
  surface-container-highest: '#CBD1DC'
  on-surface: '#0F1115'
  on-surface-variant: '#4A505C'
  inverse-surface: '#15151A'
  inverse-on-surface: '#F6F7FA'
  outline: '#717886'
  outline-variant: '#CBD1DC'
  surface-tint: '#0F1115'
  primary: '#0F1115'
  on-primary: '#FFFFFF'
  primary-container: '#E5E8EE'
  on-primary-container: '#0F1115'
  inverse-primary: '#FFFFFF'
  secondary: '#0284C7'
  on-secondary: '#FFFFFF'
  secondary-container: '#E0F2FE'
  on-secondary-container: '#0369A1'
  tertiary: '#D97706'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#FEF3C7'
  on-tertiary-container: '#92400E'
  error: '#DC2626'
  on-error: '#FFFFFF'
  error-container: '#FEE2E2'
  on-error-container: '#991B1B'
  primary-fixed: '#262630'
  primary-fixed-dim: '#1C1C24'
  on-primary-fixed: '#FFFFFF'
  on-primary-fixed-variant: '#A0A0AB'
  secondary-fixed: '#E0F2FE'
  secondary-fixed-dim: '#BAE6FD'
  on-secondary-fixed: '#0C4A6E'
  on-secondary-fixed-variant: '#0284C7'
  tertiary-fixed: '#FEF3C7'
  tertiary-fixed-dim: '#FDE68A'
  on-tertiary-fixed: '#78350F'
  on-tertiary-fixed-variant: '#D97706'
  background: '#F6F7FA'
  on-background: '#0F1115'
  surface-variant: '#ECEEF2'
  primary-dark: '#FFFFFF'
  on-primary-dark: '#0D0D10'
  primary-container-dark: '#22222C'
  on-primary-container-dark: '#FFFFFF'
  hero-bg-light: '#0F1115'
  hero-bg-dark: '#15151A'
  macro-kcal: '#EA580C'
  macro-kcal-dark: '#FF7A45'
  macro-protein: '#2563EB'
  macro-protein-dark: '#60A5FA'
  macro-carbs: '#D97706'
  macro-carbs-dark: '#FBBF24'
  macro-fat: '#9333EA'
  macro-fat-dark: '#C084FC'
  success: '#059669'
  success-dark: '#34D399'
  warning: '#D97706'
  warning-dark: '#FBBF24'
  error-dark: '#FF6B6B'
  info: '#0284C7'
  info-dark: '#38BDF8'
  muscle-chest: '#EA580C'
  muscle-back: '#0284C7'
  muscle-shoulders: '#D97706'
  muscle-legs: '#4F46E5'
  muscle-arms: '#9333EA'
  muscle-abs: '#059669'
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
