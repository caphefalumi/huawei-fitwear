<!--
  Title: Querying the Workout Status
  Catalog: huaweihealth-Guides
  Document ID: query-exercise-status-0000002594109518
  Updated: 2026-08-05 02:10:13
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-exercise-status-0000002594109518
-->
# Querying the Workout Status

This section describes how to query the workout status. Wearables support multiple workout types. After a user starts a workout while wearing a wearable with the Workout app launched, industry apps can call the corresponding API to query the workout status of the user.

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section178854115210) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the workout status. 
```cpp
// Import the required module.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryStatus method of the Device object to query the workout status.
        let exerciseStatus = try await device.queryStatus(type: .exerciseStatus)

        // The workout status query is successful.
        print("Succeeded in querying exerciseStatus, exerciseStatus: \(exerciseStatus)")
    } catch let err as IndustryError {
        // The workout status query fails.
        print("Failed to query exerciseStatus, code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** For details about the return values for querying the workout status, please refer to [Workout Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sport-status-enumeration-0000002338268622).
