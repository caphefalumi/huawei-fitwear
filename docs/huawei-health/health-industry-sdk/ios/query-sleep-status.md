<!--
  Title: Querying the Sleep Status
  Catalog: huaweihealth-Guides
  Document ID: query-sleep-status-0000002624549031
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-sleep-status-0000002624549031
-->
# Querying the Sleep Status

This section describes how to query the sleep status of a wearable user.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section178854115210) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the sleep status. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryStatus method of the Device object to query the sleep status.
        let sleepStatus = try await device.queryStatus(type: .sleepStatus)

        // The sleep status is queried successfully.
        print("Succeeded in querying sleepStatus, sleepStatus: \(sleepStatus)")
    } catch let err as IndustryError {
        // Failed to query the sleep status.
        print("Failed to query sleepStatus, code: \(err.code), message: \(err.message)")
    }
}
```
 
| Value | Description |
| --- | --- |
| 1 | Asleep. |
| 2 | Awake. |
