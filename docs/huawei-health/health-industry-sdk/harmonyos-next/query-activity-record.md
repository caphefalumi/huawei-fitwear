<!--
  Title: Querying Activity Records
  Catalog: huaweihealth-Guides
  Document ID: query-activity-record-0000002526681438
  Updated: 2026-08-05 02:10:10
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-activity-record-0000002526681438
-->
# Querying Activity Records

This section describes how to query activity data recorded on a wearable by calling the corresponding API. Activity data includes active calories, exercise duration, hours active, and their corresponding goals.

> **Note:** Concurrent query of activity records is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query activity records. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for querying activity records.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.ACTIVITY_RECORD,
      startTime: 1736580274,
      endTime: 1736580330
    };

    // Call the queryHistoryData method of the Device object to query activity records.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned activity records if the query is successful.
      console.info(`Succeeded in querying activityRecord data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query activityRecord data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying activity records: Only the year, month, and date will be used for querying data because each data record returned by the wearable is the data of the whole day. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (including the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when activity records exist, or an empty array **[]** when no activity records are available. If the query fails, the API throws **BusinessError**. Example of the activity record data returned if the query is successful: 
```cpp
[{
    "startTime": 1736580274,
    "endTime": 1736580330,
    "type": "activityRecord",
    "fields": {
      "calories": 0,
      "exerciseDuration": 0,
      "standHours": 0,
      "caloriesGoal": 270000,
      "exerciseDurationGoal": 25,
      "standHoursGoal": 12
    }
},
{
    "startTime": 1736580154,
    "endTime": 1736580210,
    "type": "activityRecord",
    "fields": {
      "calories": 5623,
      "exerciseDuration": 0,
      "standHours": 2,
      "caloriesGoal": 340000,
      "exerciseDurationGoal": 30,
      "standHoursGoal": 15
    }
},...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains activity record data. |
| calories | number | cal | Active calories. |
| exerciseDuration | number | Minute | Exercise duration. |
| standHours | number | Hour | Hours active. |
| caloriesGoal | number | cal | Active calories goal. |
| exerciseDurationGoal | number | Minute | Exercise duration goal. |
| standHoursGoal | number | Hour | Goal of hours active. |
