<!--
  Title: Querying Sleep Data
  Catalog: huaweihealth-Guides
  Document ID: query-sleep-data-0000002624668871
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-sleep-data-0000002624668871
-->
# Querying Sleep Data

This section describes how to query sleep data. Wearables can monitor sleep and breathing data in real time. When a user falls asleep (nighttime sleep or nap) while wearing a wearable, industry apps can call the corresponding API to query recorded sleep data.

> **Note:** To collect sleep data, ensure that TruSleep has been enabled on the wearable through the API for [setting the TruSleep switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-trusleep-switch-0000002594109506) and the wearable has sleep data. To ensure proper sleep data collection, it is recommended that the wearable be worn and the sleep duration be longer than three hours (excluding naps). Otherwise, the wearable may return empty data.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query sleep data. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        let device = try IndustryService.getDeviceManager().getDevice()
        let data = try await device.queryHistoryData(
            type: .sleep,
            startTime: 1778428800,
            endTime: 1778463000
        )
        print("Succeeded in querying sleep, data is \(data)")
    } catch let err as IndustryError {
        print("Failed to query sleep. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying sleep data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when sleep data exists, or an empty array **[]** when no sleep data is available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the sleep data returned if the query is successful: 
```cpp
[
    {
        startTime: 1736521200,
        endTime: 1736547600,
        type: .sleep,
        fields: [
            "fallAsleepTime": 1736521200,
            "wakeupTime": 1736547600,
            "sleepScore": 80,
            "sleepEfficiency": 0,
            "deepSleepPart": 0,
            "snoreFreq": 0,
            "avgHeartrate": 61,
            "minHearrateBaseline": -1,
            "maxHeartrateBaseline": -1,
            "heartrateDayToBaseline": 4,
            "avgOxygenSaturation": 97,
            "minOxygenSaturationBaseline": -1,
            "maxOxygenSaturationBaseline": -1,
            "oxygenSaturationDayToBaseline": 4,
            "avgBreathrate": 14,
            "minBreathrateBaseline": -1,
            "maxBreathrateBaseline": -1,
            "breathrateDayToBaseline": 4,
            "avgHrv": 62,
            "minHrvBaseline": -1,
            "maxHrvBaseline": -1,
            "hrvDayToBaseline": 4,
            "detailData": [
                [
                    "startTime": 1736521200,
                    "duration": 20,
                    "sleepState": 2
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
| fallAsleepTime | Int | Second | Fall-asleep time. |
| wakeupTime | Int | Second | Wake-up time. |
| sleepScore | Int | - | Sleep score, ranging from 0 to 100. |
| sleepEfficiency | Int | - | Sleep efficiency. |
| deepSleepPart | Int | - | Deep sleep continuity score. |
| snoreFreq | Int | - | Snoring frequency. |
| minHeartrate | Int | Beats/min | Minimum heart rate. |
| maxHeartrate | Int | Beats/min | Maximum heart rate. |
| minOxygenSaturation | Int | Percentage (%) | Minimum SpO2. |
| maxOxygenSaturation | Int | Percentage (%) | Maximum SpO2. |
| minBreathrate | Int | Beats/min | Minimum respiratory rate. |
| maxBreathrate | Int | Beats/min | Maximum respiratory rate. |
| avgHeartrate | Int | Beats/min | Average heart rate. |
| minHeartrateBaseline | Int | Beats/min | Lower limit of baseline heart rate. |
| maxHeartrateBaseline | Int | Beats/min | Upper limit of baseline heart rate. |
| heartrateDayToBaseline | Int | - | Number of days of wear required to evaluate the baseline heart rate. |
| avgOxygenSaturation | Int | Percentage (%) | Average SpO2. |
| minOxygenSaturationBaseline | Int | Percentage (%) | Lower limit of baseline SpO2. |
| maxOxygenSaturationBaseline | Int | Percentage (%) | Upper limit of baseline SpO2. |
| oxygenSaturationDayToBaseline | Int | - | Number of days of wear required to evaluate the baseline SpO2. |
| avgBreathrate | Int | Beats/min | Average respiratory rate. |
| minBreathrateBaseline | Int | Beats/min | Lower limit of baseline respiratory rate. |
| maxBreathrateBaseline | Int | Beats/min | Upper limit of baseline respiratory rate. |
| breathrateDayToBaseline | Int | - | Number of days of wear required to evaluate the baseline respiratory rate. |
| avgHrv | Int | Millisecond | Average HRV. |
| minHrvBaseline | Int | Millisecond | Lower limit of baseline HRV. |
| maxHrvBaseline | Int | Millisecond | Upper limit of baseline HRV. |
| hrvDayToBaseline | Int | - | Number of days of wear required to evaluate the baseline HRV. |
| detailData | [[String: Any]] | - | Sleep status details. |
| startTime | Int | Second | Sleep start time. |
| duration | Int | Minute | Sleep duration. |
| sleepState | Int | - | Sleep status. For details, please refer to [Sleep Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sleep-status-enumeration-0000002372106937). |
