<!--
  Title: Querying Emotion Data
  Catalog: huaweihealth-Guides
  Document ID: query-emotion-data-0000002624668875
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-emotion-data-0000002624668875
-->
# Querying Emotion Data

This section describes how to query the emotional wellbeing data on a wearable. After a user assesses their emotions with a wearable, industry apps can call the corresponding API to query the emotion data recorded on the wearable.

> **Note:** Before calling this API to query emotion data, ensure that the [automatic emotion/stress test switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-emotion-auto-monitor-switch-0000002624549035) is enabled. Otherwise, empty data will be returned.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query emotion data. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        let device = try IndustryService.shared().getDeviceManager().getDevice()
        let data = try await device.queryHistoryData(
            type: .emotion,
            startTime: 1778428800,
            endTime: 1778472000
        )
        print("Succeeded in querying emotion, data is \(data)")
    } catch let err as IndustryError {
        print("Failed to query emotion. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying emotion data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when emotion data exists, or an empty array **[]** when no emotion data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the emotion data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778466633,
        endTime: 1778466633,
        type: .emotion,
        fields: [
            "emotionStatus": 2,
            "arousalCharacter": 0.4611235558986664,
            "valenceCharacter": 90.367919921875
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| emotionStatus | Int | - | Emotion status. • **1**: negative emotions, such as unpleasant • **2**: neutral emotions, such as calm • **3**: positive emotions, such as pleasant |
| arousalCharacter | Double | - | Arousal feature, representing the physiological activation level of a person. A larger value indicates greater activation. The value ranges from 0 to 100. |
| valenceCharacter | Double | - | Valence feature, representing the valence dimension of human emotions. A lower value indicates a more negative emotion, and a higher value indicates a more positive emotion. The value ranges from 0 to 100. |
