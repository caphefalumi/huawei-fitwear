<!--
  Title: Querying Historical Sleep Data
  Catalog: huaweihealth-Guides
  Document ID: query-historical-sleep-data-0000002342676394
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-historical-sleep-data-0000002342676394
-->
# Querying Historical Sleep Data

This section describes how to query sleep data based on the capability of monitoring sleep and breathing quality data in real time provided by wearables. When a user falls asleep (nighttime sleep or nap) while wearing a wearable, industry apps can call the corresponding API to query sleep data recorded on the wearable.

> **Note:** To successfully retrieve sleep data, the TruSleep switch must be enabled. Before querying sleep data, ensure that the TruSleep switch has been enabled through the API for [setting the TruSleep switch state](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-trusleep-switch-0000002376514397) and that the user has sleep sessions. To ensure proper sleep data collection, it is recommended that the wearable be worn during sleep and the sleep duration be longer than three hours (excluding naps). Otherwise, the wearable may return empty data. Concurrent query of sleep data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query historical sleep data. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for querying sleep data.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.SLEEP,
      startTime: 1736521200,
      endTime: 1736547600
    };

    // Call the queryHistoryData method of the Device object to query historical sleep data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned sleep data if the query is successful.
      console.info(`Succeeded in querying sleep data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query sleep data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying historical sleep data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when historical sleep data exists, or an empty array **[]** when no historical sleep data is available. If the query fails, the API throws **BusinessError**. Example of the historical sleep data returned if the query is successful: 
```cpp
[{
    "startTime": 1736521200,
    "endTime": 1736547600,
    "type": "sleep",
    "fields": {
        "fallAsleepTime": 1736521200,
        "wakeupTime": 1736547600,
        "sleepScore": 80,
        "sleepEfficiency": 0,
        "deepSleepPart": 0,
        "snoreFreq": 0,
        "avgHeartRate": 61,
        "minHearRateBaseline": -1,
        "maxHeartRateBaseline": -1,
        "heartRateDayToBaseline": 4,
        "avgOxygenSaturation": 97,
        "minOxygenSaturationBaseline": -1,
        "maxOxygenSaturationBaseline": -1,
        "oxygenSaturationDayToBaseline": 4,
        "avgBreathRate": 14,
        "minBreathRateBaseline": -1,
        "maxBreathRateBaseline": -1,
        "breathRateDayToBaseline": 4,
        "avgHrv": 62,
        "minHrvBaseline": -1,
        "maxHrvBaseline": -1,
        "hrvDayToBaseline": 4,
        "sleepDetail": [{
            "startTime": 1736521200,
            "duration": 20,
            "sleepState": 2
        },...]
    }
}]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the historical sleep data. |
| fallAsleepTime | number | Second | Fall-asleep time. |
| wakeupTime | number | Second | Wake-up time. |
| sleepScore | number | - | Sleep score, ranging from 0 to 100. |
| sleepEfficiency | number | - | Sleep efficiency. |
| deepSleepPart | number | - | Deep sleep continuity score. |
| snoreFreq | number | - | Snoring frequency. |
| minHeartRate | number | Beats/min | Minimum heart rate. |
| maxHeartRate | number | Beats/min | Maximum heart rate. |
| minOxygenSaturation | number | Percentage (%) | Minimum SpO2. |
| maxOxygenSaturation | number | Percentage (%) | Maximum SpO2. |
| minBreathRate | number | Beats/min | Minimum respiratory rate. |
| maxBreathRate | number | Beats/min | Maximum respiratory rate. |
| avgHeartRate | number | Beats/min | Average heart rate. |
| minHeartRateBaseline | number | Beats/min | Lower limit of baseline heart rate. |
| maxHeartRateBaseline | number | Beats/min | Upper limit of baseline heart rate. |
| heartRateDayToBaseline | number | - | Number of days of wear required to evaluate the baseline heart rate. |
| avgOxygenSaturation | number | Percentage (%) | Average SpO2. |
| minOxygenSaturationBaseline | number | Percentage (%) | Lower limit of baseline SpO2. |
| maxOxygenSaturationBaseline | number | Percentage (%) | Upper limit of baseline SpO2. |
| oxygenSaturationDayToBaseline | number | - | Number of days of wear required to evaluate the baseline SpO2. |
| avgBreathRate | number | Beats/min | Average respiratory rate. |
| minBreathRateBaseline | number | Beats/min | Lower limit of baseline respiratory rate. |
| maxBreathRateBaseline | number | Beats/min | Upper limit of baseline respiratory rate. |
| breathRateDayToBaseline | number | - | Number of days of wear required to evaluate the baseline respiratory rate. |
| avgHrv | number | Millisecond | Average HRV. |
| minHrvBaseline | number | Millisecond | Lower limit of baseline HRV. |
| maxHrvBaseline | number | Millisecond | Upper limit of baseline HRV. |
| hrvDayToBaseline | number | - | Number of days of wear required to evaluate the baseline HRV. |
| sleepDetail | object[] | - | Sleep status details. |
| startTime | number | Second | Sleep start time. |
| duration | number | Minute | Sleep duration. |
| sleepState | number | - | Sleep status. For details, please refer to [Sleep Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sleep-status-enumeration-0000002372106937). |
