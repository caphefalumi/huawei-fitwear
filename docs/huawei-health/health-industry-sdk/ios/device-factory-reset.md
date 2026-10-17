<!--
  Title: Restoring a Wearable to Factory Settings
  Catalog: huaweihealth-Guides
  Document ID: device-factory-reset-0000002594109500
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/device-factory-reset-0000002594109500
-->
# Restoring a Wearable to Factory Settings

This section describes how to restore a device to factory settings. This operation will clear the settings and fitness and health data on the device.

> **Note:** After a wearable is restored to factory settings (not through an industry app), delete the wearable from the industry app and add it again. After a factory reset, all data on the wearable is cleared, which will severely affect the use of SDKs.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [factoryReset](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section13462134914918) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to restore the device to factory settings. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the factoryReset method of the Device object to restore the device to factory settings.
        try await device.factoryReset(mode: .resetDevice)
     
        // The device is successfully restored to factory settings.
        print("Succeeded in factory reset")
    } catch let err as IndustryError {
        // Failed to restore the device to factory settings.
        print("Failed to factory reset. Code: \(err.code), message: \(err.message)")
    }
}
```
