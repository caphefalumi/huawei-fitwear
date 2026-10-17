<!--
  Title: Querying Heart Rate Data
  Catalog: huaweihealth-Guides
  Document ID: query-heart-rate-data-0000002594109504
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-heart-rate-data-0000002594109504
-->
# Querying Heart Rate Data

This section describes how to query heart rate data from a wearable. After a user measures their heart rate, industry apps can call the corresponding API to query the heart rate data recorded on the wearable.

> **Note:** Before calling this API to query heart rate data, ensure that the [continuous heart rate monitoring mode is enabled](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-heart-rate-monitoring-mode-0000002594269408). Otherwise, empty data will be returned.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query heart rate data. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryHistoryData method of the Device object to query heart rate data.
        let data = try await device.queryHistoryData(
            type: .heartRate,
            startTime: 1778461200,
            endTime: 1778464800
        )

        // The heart rate data is successfully queried.
        print("Succeeded in querying heart rate, data is \(data)")
    } catch let err as IndustryError {
        // Failed to query the heart rate data.
        print("Failed to query heart rate. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying heart rate data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when heart rate data exists, or an empty array **[]** when no heart rate data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the heart rate data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778461980,
        endTime: 1778461980,
        type: .heartRate,
        fields: [
            "restingHeartRate": 0,
            "heartRate": 85
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| restingHeartRate | Int | Beats/min | Resting heart rate. |
| heartRate | Int | Beats/min | Heart rate. |
