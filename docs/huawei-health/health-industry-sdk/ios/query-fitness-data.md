<!--
  Title: Querying Daily Activity Data
  Catalog: huaweihealth-Guides
  Document ID: query-fitness-data-0000002624549039
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-fitness-data-0000002624549039
-->
# Querying Daily Activity Data

This section describes how to query daily activity data from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity data recorded on the wearable.

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query daily activity data. 
```cpp
// Import the required module.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryHistoryData method of the Device object to query daily activity data.
        let data = try await device.queryHistoryData(
            type: .fitness,
            startTime: 1778461200,
            endTime: 1778464800
        )

        // Output the daily activity data if the query is successful.
        print("Succeeded in querying fitness, data is \(data)")
    } catch let err as IndustryError {
        // Output error information if the query fails.
        print("Failed to query fitness. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying daily activity data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when daily activity data exists, or an empty array **[]** when no daily activity data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of daily activity data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778462380,
        endTime: 1778462380,
        type: .fitness,
        fields: [
            "step": 100,
            "calorie": 1000,
            "distance": 10,
            "exerciseIntensity": 0,
            "height": 36
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| step | Int | - | Step count. |
| calorie | Int | cal | Calories burned. |
| distance | Int | Meter | Distance. |
| exerciseIntensity | Int | - | Exercise intensity. For details, please refer to the [exercise intensity table](#EN-US_TOPIC_0000002647924550__table132645267117). |
| height | Int | Decimeter | Height. |
 
| Field | Value | Description |
| --- | --- | --- |
| exerciseIntensity | 0 | Low intensity. |
| 1 | Moderate-to-high intensity. |  |
