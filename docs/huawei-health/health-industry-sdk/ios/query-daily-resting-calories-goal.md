<!--
  Title: Querying the Daily Resting Calorie Consumption Target
  Catalog: huaweihealth-Guides
  Document ID: query-daily-resting-calories-goal-0000002594269418
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-daily-resting-calories-goal-0000002594269418
-->
# Querying the Daily Resting Calorie Consumption Target

This section describes how to query the daily resting calorie consumption target data. A wearable provides the weight management capability, encompassing features like calorie deficit assessment, calorie burning monitoring, and calorie intake recording. Industry apps can use this capability to query the daily resting calorie consumption target data recorded on the wearable.

> **Note:** Before using this API, the Stay Fit app needs to be started on the wearable. If the app is not opened, the wearable will not generate any related data. Resting calorie data is generated daily starting at 00:00:00. Therefore, the query start time must be 00:00:00. This API returns the **daily resting calorie consumption target** (including post-workout resting calorie data if a workout occurs).

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the daily resting calorie consumption target. 
```cpp
// Import the required module.
import IndustrySDK

Task {
    do {
        let device = try IndustryService.shared().getDeviceManager().getDevice()
        let data = try await device.queryHistoryData(
            type: .dailyRestingCaloriesGoal,
            startTime: 1778428800,
            endTime: 1778463000
        )
        print("Succeeded in querying daily resting calories goal, data is \(data)")
    } catch let err as IndustryError {
        print("Failed to query daily resting calories goal. Code: \(err.code), message: \(err.message)")
    }
}
```
 If the query is successful, the daily resting calorie consumption target of the int type is returned. If the query fails, [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612) is thrown. > **Note:** Parameter requirements of the API for querying daily resting calorie consumption target: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). 
| Type | Unit | Description |
| --- | --- | --- |
| Int | kcal | Resting calorie consumption target. |
