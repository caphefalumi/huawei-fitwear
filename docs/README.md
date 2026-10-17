# Huawei Developer Documentation Reference

Complete local mirror of official Huawei Developer documentation for **Huawei Watch**, **Bluetooth (Connectivity Kit)**, and **Huawei Health**, crawled from `developer.huawei.com` (`harmonyos-guides`, `harmonyos-references`, `connectivity-Guides`, `connectivity-References`, `HMSCore-Guides-V5`, `HMSCore-References-V5`, and `huaweihealth-Guides`).

- **Total Crawled Documents**: **1123** Markdown files (plus 4 index `README.md` files)

---

## Directory Overview

| Domain | Path | Files | Scope |
| :--- | :--- | ---: | :--- |
| **1. Huawei Watch** | [`docs/huawei-watch/`](huawei-watch/README.md) | **261** | HarmonyOS Wear Engine Kit, Cross-Platform Wear Engine (Android/iOS/Watch), Circular Watch ArkUI Components (`ArcList`, `ArcSwiper`, `ArcButton`, `ArcSlider`, `ArcScrollBar`, `ArcAlphabetIndexer`), and Sensor Service Kit (`@ohos.sensor`, `@ohos.vibrator`) |
| **2. Bluetooth** | [`docs/bluetooth/`](bluetooth/README.md) | **42** | HarmonyOS Connectivity Kit: BLE Advertising/Scanning, GATT Client/Server, Bluetooth Classic Discovery/Pairing, SPP Socket transmission, Bluetooth Profiles (A2DP, HFP, HID, PAN, PBAP, MAP), Converged Short-Range (`partnerAgent`), C APIs, and Error Codes |
| **3. Huawei Health** | [`docs/huawei-health/`](huawei-health/README.md) | **820** | HarmonyOS Health Service Kit (`healthStore`, `healthService`, Activity Rings, Workouts, Health/Sample Points), HMS Core Health Kit (Android & Cloud REST APIs), and Huawei Health Industry Wearable SDK (HarmonyOS 5+, Android, iOS direct wearable BLE & real-time IMU/PPG/HR streaming) |

---

## Quick Links for Fitwear Architecture

### Huawei Watch & Wear Engine (`docs/huawei-watch/`)
- [About Wear Engine Service](huawei-watch/wear-engine-harmonyos/we-business-introduction.md)
- [Phone-Side App-to-App P2P Messaging (HarmonyOS)](huawei-watch/wear-engine-harmonyos/p2p-communication.md)
- [Wearable-Side App-to-App P2P Messaging (HarmonyOS)](huawei-watch/wear-engine-harmonyos/watch-p2p-communication.md)
- [Obtaining Wearable Sensor Data via Wear Engine](huawei-watch/wear-engine-harmonyos/device-sensor.md)
- [`@kit.WearEngine` Full ArkTS API Reference](huawei-watch/wear-engine-harmonyos/wearengine-api.md)
- [Android Phone P2P Messaging with Watch](huawei-watch/wear-engine-cross-platform/guides/phone-send-message.md)
- [iOS Phone P2P Messaging with Watch](huawei-watch/wear-engine-cross-platform/guides/phone-send-message-ios.md)
- [Creating Circular Watch Lists (`ArcList`)](huawei-watch/circular-ui-components/arkts-layout-development-create-arclist.md)
- [Circular Watch `ArcButton` Guide](huawei-watch/circular-ui-components/arkts-advanced-components-arcbutton.md)
- [Watch IMU & Biometric Sensor Development (ArkTS)](huawei-watch/sensors-and-vibrator/sensor-guidelines.md)
- [`@ohos.sensor` Full API Reference](huawei-watch/sensors-and-vibrator/js-apis-sensor.md)
- [Watch Haptics / Vibrator Development (ArkTS)](huawei-watch/sensors-and-vibrator/vibrator-guidelines.md)

### Bluetooth & BLE GATT (`docs/bluetooth/`)
- [Bluetooth Overview](bluetooth/guides/bluetooth-overview.md)
- [BLE Scanning and Advertising Guide](bluetooth/guides/ble-development-guide.md)
- [GATT Client & Server Connection and Data Transmission Guide](bluetooth/guides/gatt-development-guide.md)
- [SPP Socket Connection and Data Transmission Guide](bluetooth/guides/spp-development-guide.md)
- [`@ohos.bluetooth.ble` API Reference](bluetooth/api-reference/js-apis-bluetooth-ble.md)
- [`@ohos.bluetooth.access` API Reference](bluetooth/api-reference/js-apis-bluetooth-access.md)
- [`@ohos.bluetooth.connection` API Reference](bluetooth/api-reference/js-apis-bluetooth-connection.md)
- [`@ohos.bluetooth.socket` API Reference](bluetooth/api-reference/js-apis-bluetooth-socket.md)
- [Bluetooth Error Codes](bluetooth/api-reference/errorcode-bluetoothmanager.md)

### Huawei Health (`docs/huawei-health/`)
- [HarmonyOS Health Service Kit Overview](huawei-health/health-service-kit/guides/health-service-kit-ability.md)
- [Developing Wearable Health & Fitness Apps](huawei-health/health-service-kit/guides/health-wearable-app-dev.md)
- [Reading Real-Time Activity Rings Data (Wearable)](huawei-health/health-service-kit/guides/health-wearable-three-ring-read.md)
- [Managing Workout Linkage (Lite Wearable)](huawei-health/health-service-kit/guides/health-litewearable-sport-linkage-manage.md)
- [`healthStore` Full ArkTS API Reference](huawei-health/health-service-kit/api-reference/health-api-healthstore.md)
- [`healthService` Full ArkTS API Reference](huawei-health/health-service-kit/api-reference/health-api-healthservice.md)
- [HMS Core Health Kit — Data Openness of Huawei Wear and Health Apps](huawei-health/hms-health-kit/guides/read-sport-health-datatype.md)
- [Health Industry SDK — Subscribing to Real-Time ACC Data (Android)](huawei-health/health-industry-sdk/android/subscribe-realtime-acc-data.md)
- [Health Industry SDK — Subscribing to Real-Time GYRO Data (Android)](huawei-health/health-industry-sdk/android/subscribe-realtime-gyro-data.md)
- [Health Industry SDK — Subscribing to Real-Time Heart Rate (Android)](huawei-health/health-industry-sdk/android/subscribe-realtime-heart-rate-data.md)
- [Health Industry SDK — Setting Workout Linkage (Android)](huawei-health/health-industry-sdk/android/set-workout-control.md)
