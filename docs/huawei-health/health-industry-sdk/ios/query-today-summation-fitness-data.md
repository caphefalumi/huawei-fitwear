<!--
  Title: Querying the Daily Activity Summary Data of the Current Day
  Catalog: huaweihealth-Guides
  Document ID: query-today-summation-fitness-data-0000002594269420
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-today-summation-fitness-data-0000002594269420
-->
# Querying the Daily Activity Summary Data of the Current Day

This section describes how to query the daily activity summary data of the current day from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity summary data of the current day recorded on the wearable.

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryTodaySummation](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1516318916132) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the daily activity summary data of the current day. 
```cpp
// Import the required module.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryTodaySummation method of the Device object to query the daily activity summary data of the current day.
        let data = try await device.queryTodaySummation(
            type: .fitness
        )

        // Output the daily activity summary data of the current day if the query is successful.
        print("Succeeded in querying fitness, data is \(data)")
    } catch let err as IndustryError {
        // Output error information if the query fails.
        print("Failed to query fitness. Code: \(err.code), message: \(err.message)")
    }
}
```
 If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when the daily activity summary data of the current day exists, or an empty array **[]** when no daily activity summary data is available for the current day. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the current day's activity summary data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778428800,
        endTime: 1778470204,
        type: .fitness,
        fields: [
            "totalStep": 100,
            "totalCalorie": 1000,
            "totalDistance": 10,
            "totalStrengthTime": 0,
            "totalHeight": 36
        ]
    }
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| totalStep | Int | - | Current total steps. |
| totalCalorie | Int | cal | Current total active calories burned. |
| totalDistance | Int | Meter | Current total distance. |
| totalStrengthTime | Int | Minute | Total duration of activities at the moderate-to-high intensity. |
| totalHeight | Int | Meter | Current total stair climbing height. |
