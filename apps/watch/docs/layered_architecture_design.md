# Layered Architecture Design for Huawei Smartwatches

HarmonyOS smart wearable apps rely on a unified codebase structured into three distinct layers to enable **one-time development for multi-device deployment** while keeping watch-specific UX clean, scalable, and maintainable.

## 1. Product Customization Layer (`products`)
* **Purpose**: Handles device-specific entry points, smartwatch UI layouts, resources, and hardware interaction logic.
* **Smartwatch Implementation**:
  * Create a dedicated watch target directory (e.g., `products/wearable`) that compiles into a standalone **entry HAP** (`entry-wearable.hap`).
  * Isolate circular-screen layouts, watch-specific navigation flows, and rotating crown handlers here without polluting phone or tablet targets.
* **Dependency Rule**: Can depend downward on `features` and `common`, and must never be depended upon by sibling product modules.

## 2. Basic Feature Layer (`features`)
* **Purpose**: Encapsulates cohesive, reusable business features (e.g., workout tracking, heart-rate monitoring, media playback, notifications).
* **Smartwatch Implementation**:
  * Design modules with **high cohesion and low coupling** so core state machines and service logic are shared across devices, while UI views adapt to the `xs` wearable breakpoint.
  * Compiles into **HAR** (static) or **HSP** (dynamic) libraries—or feature HAPs when exposing independent `ExtensionAbility` components like watch face cards/tiles.

## 3. Common Capability Layer (`common`)
* **Purpose**: Houses foundational cross-device utilities shared across all layers.
* **Smartwatch Implementation**:
  * Include distributed communication wrappers (`DSoftBus` / phone-watch data sync), sensor data parsers, local storage helpers, network clients, and lightweight UI primitives.
  * Compiles into one or more **HAR/HSP** packages and only flows downward (never importing from `features` or `products`).