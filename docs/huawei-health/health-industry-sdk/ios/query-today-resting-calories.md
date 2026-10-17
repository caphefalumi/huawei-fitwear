<!--
  Title: Querying the Resting Calorie Consumption of the Current Day
  Catalog: huaweihealth-Guides
  Document ID: query-today-resting-calories-0000002624668877
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-today-resting-calories-0000002624668877
-->
# Querying the Resting Calorie Consumption of the Current Day

This section describes how industry apps use the corresponding capability to query the resting calorie consumption data of the current day recorded on a wearable.

> **Note:** To query the resting calorie consumption data from a wearable, the Stay Fit app needs to be started first. This API returns the **resting calorie consumption value of the current day** starting at 00:00:00 and ending at the query time (including post-workout resting calorie consumption data if a workout occurs). It is normal that the **resting calorie consumption value of the current day** returned by this API differs from the value displayed in the Stay Fit app on the wearable by 1–2 kcal.

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryTodaySummation](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1516318916132) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the resting calorie consumption of the current day. 
```cpp
// Import the required module.
import IndustrySDK

Task {
    do {
        let device = try IndustryService.getDeviceManager().getDevice()
        let data = try await device.queryTodaySummation(
            type: .todayRestingCalories
        )
        print("Succeeded in querying today resting calories, data is \(data)")
    } catch let err as IndustryError {
        print("Failed to query today resting calories. Code: \(err.code), message: \(err.message)")
    }
}
```
 If the query is successful, the current day's resting calorie consumption data of the int type is returned. If the query fails, [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612) is thrown. 
| Type | Unit | Description |
| --- | --- | --- |
| Int | kcal | Resting calorie consumption of the current day. |
