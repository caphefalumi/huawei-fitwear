# Codemagic mobile build pipeline

Builds `apps/mobile` (Expo SDK 57 + `react-native-ble-plx`) into installable **APK** and **IPA**. Native modules require `expo prebuild` — Expo Go is not used in CI.

Config file: [`codemagic.yaml`](../../codemagic.yaml) at the repo root.

## Workflows

| Workflow ID | Product | Trigger |
|-------------|---------|---------|
| `mobile-android-apk` | Debug APK | push / PR to `main` |
| `mobile-ios-ipa` | Development IPA (or unsigned `.ipa` if signing missing) | push / PR to `main` |

## Pipeline diagram

```mermaid
flowchart TB
  subgraph trigger [Trigger]
    Push["push / PR → main"]
  end

  subgraph shared [Shared steps]
    Bun["Install Bun"]
    Deps["bun install"]
    Tsc["bunx tsc --noEmit\napps/mobile"]
  end

  subgraph android [mobile-android-apk]
    PreA["expo prebuild --platform android"]
    Sdk["Write android/local.properties"]
    Grad["./gradlew assembleDebug"]
    Apk["Artifact: *.apk"]
  end

  subgraph ios [mobile-ios-ipa]
    PreI["expo prebuild --platform ios"]
    Pods["pod install"]
    Sign{"Codemagic\nsigning present?"}
    IpaSigned["xcode-project build-ipa"]
    IpaUnsigned["xcodebuild CODE_SIGNING_ALLOWED=NO\n+ zip Payload → .ipa"]
    Ipa["Artifact: *.ipa"]
  end

  Push --> Bun
  Bun --> Deps --> Tsc
  Tsc --> PreA --> Sdk --> Grad --> Apk
  Tsc --> PreI --> Pods --> Sign
  Sign -->|yes| IpaSigned --> Ipa
  Sign -->|no| IpaUnsigned --> Ipa
```

## Why this shape

1. **Bun** matches the monorepo package manager.
2. **Typecheck** fails the build before native compile.
3. **`expo prebuild`** generates `android/` / `ios/` with the ble-plx Expo config plugin (permissions + native code).
4. **Android** ships a **debug APK** by default (no keystore required). Upload a keystore in Codemagic to add a release workflow later.
5. **iOS** uses Codemagic code signing when certificates are configured; otherwise CI still verifies an unsigned compile packaged as `.ipa`.

## Codemagic setup checklist

1. Connect the GitHub repo `caphefalumi/huawei-fitwear`.
2. Ensure `codemagic.yaml` is detected at the repository root.
3. **iOS**: Team → Code signing → add Apple cert + profile for `com.fitwear.mobile`.
4. **Android release** (optional): add keystore env vars, then switch Gradle to `assembleRelease` / `bundleRelease`.
5. Run `Mobile Android APK` and `Mobile iOS IPA` on `main`.

## Local equivalents

```bash
# Android APK
cd apps/mobile
bunx expo prebuild --platform android --clean
cd android && ./gradlew assembleDebug

# iOS (macOS)
cd apps/mobile
bunx expo prebuild --platform ios --clean
cd ios && pod install
xcodebuild -workspace mobile.xcworkspace -scheme mobile -configuration Debug
```

## EAS alternative

[`apps/mobile/eas.json`](../../apps/mobile/eas.json) remains available for Expo Application Services builds. Codemagic is the primary CI path defined in this repo.
