<!--
  Title: Querying the Device Wearing Status
  Catalog: huaweihealth-Guides
  Document ID: query-wear-status-0000002594109496
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-wear-status-0000002594109496
-->
# Querying the Device Wearing Status

This section describes how to query the wearing status of a wearable.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section178854115210) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the device wearing status. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryStatus method of the Device object to query the device wearing status.
        let wearStatus = try await device.queryStatus(type: .wearStatus)

        // The device wearing status is successfully queried.
        print("Succeeded in querying wearStatus, wearStatus: \(wearStatus)")
    } catch let err as IndustryError {
        // Failed to query the device wearing status.
        print("Failed to query wearStatus, code: \(err.code), message: \(err.message)")
    }
}
```
 
| Value | Description |
| --- | --- |
| 1 | Worn. |
| 2 | Not worn. |
