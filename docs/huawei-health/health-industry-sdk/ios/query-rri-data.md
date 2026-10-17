<!--
  Title: Querying R-R Interval Data
  Catalog: huaweihealth-Guides
  Document ID: query-rri-data-0000002594269410
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-rri-data-0000002594269410
-->
# Querying R-R Interval Data

This section describes how to query the R-R interval (RRI) data from a wearable. After a user wears the device for a period of time, industry apps can call the corresponding API to query the RRI data recorded on the device.

> **Note:** The RRI is measured every 10 minutes. RRI measurement requires the user to be at rest. During activity, values may not be generated.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the RRI data. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryHistoryData method of the Device object to query RRI data.
        let data = try await device.queryHistoryData(
            type: .rri,
            startTime: 1778428800,
            endTime: 1778479200
        )

        // The RRI data is queried successfully.
        print("Succeeded in querying rri, data is \(data)")
    } catch let err as IndustryError {
        // Failed to query the RRI data.
        print("Failed to query rri. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying RRI data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when RRI data exists, or an empty array **[]** when no RRI data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the RRI data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778473234,
        endTime: 1778473328,
        type: .rri,
        fields: [
            "detailData": [
                [
                    "timestamp": 1778473234000,
                     "rri": 698,
                     "sqi": 100
                ],
                ...
            ]
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| timestamp | Int64 | Millisecond | Timestamp when the RRI data is generated. |
| rri | Int | - | RRI value. |
| sqi | Int | - | RRI confidence. |
