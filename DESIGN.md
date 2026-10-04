# Fitwear Design System: Kinetic Dual-Engine

A luxury sport and clinical-performance design system engineered for high-velocity nutrition intelligence across mobile companion screens and AMOLED wearables.

The system is organized around two complementary visual themes:
- **Kinetic Obsidian (Dark / OLED):** Ultra-minimalist dark ergonomics, true `#000000` pitch blacks, high-chroma luminescent rings, and tabular telemetry engineered for sub-200ms glanceability during workouts.
- **Kinetic Pure Light (Light / Porcelain):** Clinical-luxury health-tech aesthetic with high-luminance porcelain cards, clean whitespace, and ambient jewel-toned accents for daytime clarity.

---

## 1. Theme Token Specifications

### 1.1 Kinetic Obsidian (Dark Theme Specification)

```yaml
---
name: Kinetic Obsidian
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#bbcac0'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#85948b'
  outline-variant: '#3c4a42'
  surface-tint: '#45dfa4'
  primary: '#5af0b3'
  on-primary: '#003825'
  primary-container: '#34d399'
  on-primary-container: '#00563b'
  inverse-primary: '#006c4b'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#ffd16d'
  on-tertiary: '#402d00'
  tertiary-container: '#ecb210'
  on-tertiary-container: '#614700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#68fcbf'
  primary-fixed-dim: '#45dfa4'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-watch:
    fontFamily: Sora
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  metric-tabular:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-micro:
    fontFamily: Hanken Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-wearable: 0.5rem
  margin: 1.25rem
  margin-wearable: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
---
```

---

### 1.2 Kinetic Pure Light (Light Theme Specification)

```yaml
---
name: Kinetic Pure Light
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#bc0b3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff697b'
  on-tertiary-container: '#6c001d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 3.5rem
    fontWeight: '600'
    lineHeight: 4rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Outfit
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Outfit
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  metric-num:
    fontFamily: Outfit
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---
```

---

## 2. Cross-Theme Telemetry Mapping

Nutritional telemetry uses dedicated chromatic channels calibrated for immediate identification across both themes:

| Telemetry Channel | Kinetic Obsidian (Dark / AMOLED) | Kinetic Pure Light (Light / Clinical) | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Calories / Core Energy** | `#34D399` (Electric Mint) / `#10B981` | `#10B981` (Emerald Green) | Caloric equilibrium, positive adherence |
| **Protein Metric** | `#38BDF8` (Electric Cyan) / `#06B6D4` | `#0EA5E9` (Electric Cyan) / `#0284C7` | Lean tissue recovery, structural nutrition |
| **Carbohydrates** | `#FBBF24` (Amber Gold) / `#F59E0B` | `#F59E0B` (Warm Amber) | Glycogen replenishment, energy output |
| **Lipids / Dietary Fat** | `#FB7185` (Coral Flame) / `#F43F5E` | `#F43F5E` (Coral Flame) / `#E11D48` | Essential fatty acids, density thresholds |
| **Primary Background** | `#000000` (OLED True Black) | `#F8FAFC` / `#FAF8FF` (Porcelain Cool Base) | Base screen canvas |
| **Surface Substrates** | `#121214`, `#1B1B1D`, `#201F21` | `#FFFFFF`, `#F2F3FF`, `#EAEDFF` | Card tiles, container modules |
| **Structural Borders** | `1px solid #27272A` | `1px solid #E2E8F0` | Razor-sharp information containment |
| **Primary Text** | `#FFFFFF` / `#E5E1E4` | `#0F172A` / `#131B2E` | Numbers, key headings (16:1 contrast) |
| **Supporting Text** | `#94A3B8` / `#BBCAC0` | `#334155` / `#64748B` | Units, time labels, category descriptors |

---

## 3. Brand & Visual Identity

### 3.1 Kinetic Obsidian (Dark)
Engineered for AMOLED wearables and dark mobile environments. True pitch-black surfaces (`#000000`) eliminate OLED battery waste and minimize screen bezel borders. High-chroma luminescent rings and crisp metrics project crucial nutritional feedback in split-second glances. The system fuses futuristic digital telemetry with refined, soft-radius tactile cards.

### 3.2 Kinetic Pure Light (Light)
Designed for performance athletes and wellness practitioners in daylight settings. Moves past utilitarian meal trackers into architectural health-tech instruments. Pure porcelain layers, clinical whitespace, and razor-sharp contrast evoke medical-grade hardware instruments. Data points pulse with focused chromatic accents against calibrated off-white tones.

---

## 4. Typography System

- **Numeric Telemetry & Headlines:**
  - **Dark / Wearable:** **Sora** (wide geometric proportions, high-glance velocity under movement). Critical metrics must use tabular figures (`tnum`) to eliminate jitter during real-time updates.
  - **Light / Clinical:** **Outfit** (structural, architectural numerals and volumetric headings).
- **Body Copy & Operational Labels:**
  - **Both Themes:** **Hanken Grotesk** (contemporary, high x-height, open apertures for maximum micro-reading clarity).
  - **Micro-labels (10px–12px):** Uppercase with expanded tracking (`0.04em`–`0.06em`) for immediate peripheral comprehension.

---

## 5. Elevation, Depth & Shapes

### 5.1 Elevation Philosophy
- **Dark Mode Depth:** Replaces conventional diffuse drop shadows with tonal containment, luminous borders (`#27272A`), and localized neon bloom (e.g., `0px 0px 16px rgba(52, 211, 153, 0.25)`).
- **Light Mode Depth:** Surgical 1px borders (`#E2E8F0`) backed by high-diffusion atmospheric shadows (`0 1px 3px rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)`). Modals utilize glassmorphic translucent backing (`rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(12px)`).

### 5.2 Geometric Radii
- **Pills (`9999px`):** Status badges, macro chips, primary action buttons, ring caps.
- **Micro Radii (`4px`–`8px`):** Input fields, inline check-boxes, steppers.
- **Container Radii (`16px`–`32px`):** Primary nutrition tiles and modal surfaces.

---

## 6. Core Component Specifications

### 6.1 Concentric Macro & Calorie Rings
- **Visual Spec:** Core concentric SVG arcs with rounded stroke endpoints (`stroke-linecap: round`).
- **Hierarchy:** Outermost = Energy/Calories (Mint), Second = Protein (Cyan), Third = Carbs (Amber), Innermost = Fat (Coral).
- **Inactive Track:** Dark: `#1C1C1E` at 60% opacity. Light: `#F1F5F9` / `#EAEDFF`.
- **Glance Metric:** Center readout with pure white/dark slate numerals and uppercase unit descriptor.

### 6.2 Segmented Macro Progress Bars
- **Track Layout:** Horizontal stacked bars divided into macro segments separated by 2px hard gaps.
- **Labels:** Accompanying balance labels positioned beneath (target grams vs current intake).

### 6.3 Action Buttons & Pills
- **Primary:** Dark: `#34D399` filled pill with `#000000` text + ambient glow. Light: `#0EA5E9` filled pill with `#FFFFFF` text + `0 4px 12px rgba(14, 165, 233, 0.3)`.
- **Secondary:** Dark: Translucent `#1C1C1E` with 1px `#27272A` outline. Light: Pure white with 1px `#E2E8F0` border.

### 6.4 Status Badges
- **'On Track':** Dark: forest substrate (`#064E3B`) with `#34D399` text and pulsing dot. Light: 10% translucent green (`rgba(16, 185, 129, 0.1)`) with `#059669` text.
- **'Exceeded / Alert':** Dark: deep crimson (`#4C0519`) with `#FB7185` text. Light: 10% translucent coral (`rgba(244, 63, 94, 0.1)`) with `#E11D48` text.

### 6.5 Quick-Log Steppers & Inputs
- **Steppers:** Dark: `#000000` / `#121214` with `#27272A` border and oversized plus/minus tap zones. Light: `#FFFFFF` with `#E2E8F0` border and `#0EA5E9` focus ring.
