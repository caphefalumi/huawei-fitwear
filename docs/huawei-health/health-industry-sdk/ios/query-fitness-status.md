<!--
  Title: Querying Daily Activity Status
  Catalog: huaweihealth-Guides
  Document ID: query-fitness-status-0000002594109514
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-fitness-status-0000002594109514
-->
# Querying Daily Activity Status

This section describes how to query the daily activity status from a wearable. After a user engages in daily activities when wearing a wearable, industry apps can call the corresponding API to query the daily activity status and the corresponding activity duration recorded on the wearable.

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the daily activity status. 
```cpp
// Import the required module.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryHistoryData method of the Device object to query the daily activity status.
        let data = try await device.queryHistoryData(
            type: .fitnessStatus,
            startTime: 1778461200,
            endTime: 1778464800
        )

        // Output the daily activity status if the query is successful.
        print("Succeeded in querying fitness status, data is \(data)")
    } catch let err as IndustryError {
        // Output error information if the query fails.
        print("Failed to query fitness status. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying the daily activity status: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when daily activity status data exists, or an empty array **[]** when no daily activity status data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of daily activity status data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778461860,
        endTime: 1778461920,
        type: .fitnessStatus,
        fields: [
            "statusType": 1,
            "duration": 1
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| statusType | Int | - | Daily activity status. For details, please refer to [Daily Activity Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/daily-activity-status-enumeration-0000002372186769). |
| duration | Int | Minute | Duration of the activity status. |
