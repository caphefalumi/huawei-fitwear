<!--
  Title: Querying the Device Charging Status
  Catalog: huaweihealth-Guides
  Document ID: query-charge-status-0000002594269404
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-charge-status-0000002594269404
-->
# Querying the Device Charging Status

This section describes how to query the charging status of a wearable.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section178854115210) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the device charging status. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryStatus method of the Device object to query the device charging status.
        let chargeStatus = try await device.queryStatus(type: .chargeStatus)

        // The device charging status is successfully queried.
        print("Succeeded in querying chargeStatus, chargeStatus: \(chargeStatus)")
    } catch let err as IndustryError {
        // Failed to query the device charging status.
        print("Failed to query chargeStatus, code: \(err.code), message: \(err.message)")
    }
}
```
 
| Value | Description |
| --- | --- |
| 1 | Charging started. |
| 2 | Charging stopped. |
| 3 | Fully charged. |
