<!--
  Title: Querying Stress Data
  Catalog: huaweihealth-Guides
  Document ID: query-stress-data-0000002594269416
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-stress-data-0000002594269416
-->
# Querying Stress Data

This section describes how to query the stress data from a wearable. After a user tests their stress, industry apps can call the corresponding API to query the stress data recorded on the wearable.

> **Note:** Before calling this API to query stress data, ensure that the [automatic emotion/stress test switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-emotion-auto-monitor-switch-0000002624549035) is enabled. Otherwise, empty data will be returned.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query stress data. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        let device = try IndustryService.shared().getDeviceManager().getDevice()
        let data = try await device.queryHistoryData(
            type: .stress,
            startTime: 1778428800,
            endTime: 1778464800
        )
        print("Succeeded in querying stress, data is \(data)")
    } catch let err as IndustryError {
        print("Failed to query stress. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying stress data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when stress data exists, or an empty array **[]** when no stress data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the stress data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778463459,
        endTime: 1778463515,
        type: .stress,
        fields: [
            "duration": 56.0,
            "grade": 2,
            "score": 48
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| duration | TimeInterval | Second | Stress sampling duration. |
| grade | Int | - | Stress level. • **1**: relaxed • **2**: normal • **3**: medium • **4**: high |
| score | Int | - | Stress score. • 80–99: high • 60–79: medium • 30–59: normal • 1–29: relaxed |
