<!--
  Title: Querying SpO2 Data
  Catalog: huaweihealth-Guides
  Document ID: query-spo2-data-0000002624668873
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-spo2-data-0000002624668873
-->
# Querying SpO2 Data

This section describes how to query the SpO2 data of a wearable. After a user measures their SpO2, industry apps can call the corresponding API to query the SpO2 data recorded on the wearable.

> **Note:** Before calling this API to query SpO2 data, ensure that [automatic SpO2 measurement is enabled](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-automatic-spo2-measurement-switch-0000002624549033). Otherwise, empty data will be returned.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query SpO2 data. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the queryHistoryData method of the Device object to query SpO2 data.
        let data = try await device.queryHistoryData(
            type: .spo2,
            startTime: 1778428800,
            endTime: 1778463000
        )

        // The SpO2 data is queried successfully.
        print("Succeeded in querying spo2, data is \(data)")
    } catch let err as IndustryError {
        // Failed to query the SpO2 data.
        print("Failed to query spo2. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying SpO2 data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when SpO2 data exists, or an empty array **[]** when no SpO2 data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the SpO2 data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778462820,
        endTime: 1778462820,
        type: .spo2,
        fields: [
            "spo2": 96
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| spo2 | Int | % | SpO2. For example, the value **99** indicates that the SpO2 is 99%. |
