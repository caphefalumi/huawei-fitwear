<!--
  Title: Querying the Device Battery Level
  Catalog: huaweihealth-Guides
  Document ID: query-battery-level-0000002624668861
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-battery-level-0000002624668861
-->
# Querying the Device Battery Level

This section describes how to query the current battery level of a wearable.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section178854115210) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the device battery level. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryStatus method of the Device object to query the device battery level.
        let batteryLevel = try await device.queryStatus(type: .batteryLevel)

        // The device battery level is successfully queried.
        print("Succeeded in querying batteryLevel, batteryLevel: \(batteryLevel)")
    } catch let err as IndustryError {
        // Failed to query the device battery level.
        print("Failed to query batteryLevel, code: \(err.code), message: \(err.message)")
    }
}
```
 
| Value | Description |
| --- | --- |
| Integer ranging from 1 to 100 | Current device battery level. |
