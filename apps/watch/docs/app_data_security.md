# App Data Security for Huawei Smartwatch Apps

HarmonyOS protects smartwatch applications across three layers—the **OS kernel**, **DevEco Studio build toolchain**, and **AppGallery Connect (AGC) ecosystem**—requiring developers to classify data risks and secure inter-process communication.

## 1. Code & Package Hardening
* **ArkTS/TS/JS Code Obfuscation**:
  * Enable release obfuscation in DevEco Studio (`build-profile.json5`) to rename classes, methods, and properties, strip `console` debug logs, and compress bytecode without degrading runtime performance.
* **Kernel-Level App Encryption & Signing**:
  * Release builds published via AppGallery Connect are encrypted at rest and decrypted page-by-page in memory by the HarmonyOS kernel.
  * Manage debug certificates with explicit smartwatch UDIDs during development and switch to AGC release profiles before distribution.

## 2. Data Risk Classification & Graded Encryption
* **Classify Stored Data by Sensitivity**:
  * **Public / Non-Sensitive**: UI themes, cached static assets.
  * **General Personal Data**: User preferences, non-identifiable workout summaries.
  * **High-Sensitivity Data**: Health/biometric metrics, authentication tokens, payment credentials.
* **Apply HarmonyOS Graded File Encryption (`EL1`–`EL5`) & HUKS**:
  * Store sensitive health and session data under **Credential Encrypted (`EL2`)** or higher encryption levels so files remain inaccessible before the user unlocks the watch after reboot.
  * Store cryptographic keys, OAuth tokens, and symmetric secrets inside **HUKS (HarmonyOS Universal KeyStore)** rather than plain `Preferences` or hardcoded strings.

## 3. Secure Phone–Watch & Component Communication
* **Explicit `Want` Calls**:
  * Never transmit sensitive user tokens or health payloads via **implicit `Want`** intents that could be intercepted by third-party abilities.
* **Input & Peer Verification**:
  * Validate the package name and signing certificate fingerprint of the companion phone app when exchanging messages over distributed channels, and sanitize all incoming parameters against strict allowlists.