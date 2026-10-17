<!--
  Title: Querying Health Glance Reports
  Catalog: huaweihealth-Guides
  Document ID: query-health-glance-report-data-0000002557659127
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-health-glance-report-data-0000002557659127
-->
# Querying Health Glance Reports

This section describes how to query Health Glance reports from a wearable providing the Health Glance capability. After a user wears a wearable and completes measurement in the Health Glance app, industry apps can call the corresponding API to query the Health Glance report data generated on the wearable.

The user's personal information (such as gender, date of birth, height, and weight) may affect the accuracy of some measurement results. It is recommended that you call the [API for setting basic user information](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-user-basic-info-0000002376394493) in advance.

> **Note:** To successfully retrieve Health Glance report data, it is recommended that relevant measurement be performed in the Health Glance app at least once within the query time frame. Otherwise, the wearable may return empty data.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query Health Glance report data. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for querying Health Glance report data.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.HEALTH_GLANCE_REPORT,
      startTime: 1773126000,
      endTime: 1773129600
    };

    // Call the queryHistoryData method of the Device object to query Health Glance report data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned Health Glance report data if the query is successful.
      console.info(`Succeeded in querying healthGlanceReport data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query healthGlanceReport data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying Health Glance report data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must not exceed 24 hours. If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when Health Glance report data exists, or an empty array **[]** when no Health Glance report data is available. If the query fails, the API throws **BusinessError**. Example of the Health Glance report data returned if the query is successful: 
```cpp
[
  {
    "startTime": 1772273075,
    "endTime": 1772273075,
    "type": "healthGlanceReport",
    "fields": {
      "averageHeartRate": 97,
      "hrv": 300,
      "hrvTimestamp": 0,
      "bloodOxygen": 98,
      "skinTemperature": 33.5,
      "stress": 55,
      "emotionStatus": 100,
      "emotionTimestamp": 0,
      "heartType": 0,
      "heartResult": 1,
      "arrhythmiaTotal": 0,
      "arrhythmiaRule": 0,
      "arrhythmiaAfPrem": 0,
      "arrhythmiaAfAtrial": 0,
      "sleepApneaGrade": 0,
      "sleepApneaTimestamp": 0,
      "systolicPressure": 65535,
      "diastolicPressure": 65535,
      "bpHeartRate": 0
    }
  }
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the Health Glance report data. |
| averageHeartRate | number | Beats/min | Average heart rate. |
| hrv | number | Millisecond | HRV. The value range is [0, 300]. The value **300** indicates an invalid value. |
| hrvTimestamp | number | Second | HRV data generation timestamp. The default value is **0**. |
| bloodOxygen | number | Percentage (%) | SpO2. The value **255** indicates an invalid value. |
| bodyTemperature | number | °C | Body temperature. The value **65535** indicates an invalid value. |
| skinTemperature | number | °C | Skin temperature. The value **65535** indicates an invalid value. |
| stress | number | - | Stress. The value **255** indicates an invalid value. |
| emotionStatus | number | - | Emotional state. The value range is [0, 100]. • **1**: negative emotions, such as unpleasant • **2**: neutral emotions, such as calm • **3**: positive emotions, such as pleasant • **100**: invalid value |
| emotionTimestamp | number | Second | Emotion data generation timestamp. The default value is **0**. |
| heartType | number | - | Heart rhythm type. • **0**: EGC • **1**: pulse wave |
| heartResult | number | - | Heart rhythm measurement result. When **heartType** is **0**: • **1**: sinus rhythm • **2**: atrial premature beats • **4**: ventricular premature beats • **8**: AFib When **heartType** is **1**: • **1**: no abnormality detected • **2**: suspected premature beats • **3**: suspected AFib |
| arrhythmiaTotal | number | - | Total number of pulse wave arrhythmia detections. The default value is **0**. |
| arrhythmiaRule | number | - | Number of pulse wave arrhythmia detections with no abnormality detected. The default value is **0**. |
| arrhythmiaAfPrem | number | - | Number of pulse wave arrhythmia detections with a result of suspected premature beats. The default value is **0**. |
| arrhythmiaAfAtrial | number | - | Number of pulse wave arrhythmia detections with a result of suspected AFib. The default value is **0**. |
| sleepApneaGrade | number | - | Sleep apnea detection result. • **1**: normal • **2**: suspected low risk • **3**: suspected medium risk • **4**: suspected high risk |
| sleepApneaTimestamp | number | Second | Sleep apnea detection timestamp. The default value is **0**. |
| systolicPressure | number | mmHg | Systolic pressure. The value **65535** indicates an invalid value. |
| diastolicPressure | number | mmHg | Diastolic pressure. The value **65535** indicates an invalid value. |
| bpHeartRate | number | Beats/min | Pulse recorded during blood pressure measurement. |
