# Modular Design for Huawei Smartwatches

Modularization splits a Huawei smartwatch application into independent functional units that minimize binary footprint, speed up cold launches on wearable SoCs, and streamline cross-device code reuse.

## 1. Module Packaging Types
* **HAP (HarmonyOS Ability Package)**: Deployable unit containing abilities (`UIAbility`, `ExtensionAbility`), resources, and configurations.
* **HAR (HarmonyOS Archive)**: Static shared library compiled directly into the consuming HAP at build time.
* **HSP (HarmonyOS Shared Package)**: Dynamic shared library loaded at runtime across multiple HAPs.

## 2. Single-HAP vs. Multi-HAP Strategy for Smartwatches
* **Single-HAP Architecture (Recommended Default)**:
  * Use a single entry HAP (`wearable`) for standard smartwatch apps with a single main window.
  * Avoids multi-HAP installation and cross-HAP IPC overhead on constrained wearable storage and memory.
* **Multi-HAP Architecture**:
  * Adopt only when the watch app requires standalone `ExtensionAbility` features—such as **Service Widgets (FormExtensionAbility)** for watch tiles—or distinct background/independent ability tasks.

## 3. Prefer HAR Over HSP on Smartwatches
* Unless your watch app explicitly requires dynamic on-demand feature delivery across multiple HAPs, package shared modules as **HARs**:
  * **Faster Startup**: Eliminates runtime dynamic library loading overhead.
  * **Smaller Footprint**: Enables build-time dead-code elimination and ArkTS compiler type-inference optimizations.
  * **Simpler Deployment**: Bundles cleanly into a single wearable package for AppGallery Connect distribution.