<!--
  Title: Querying the Daily Resting Calorie Consumption Target
  Catalog: huaweihealth-Guides
  Document ID: query-basal-metabolism-0000002526641704
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-basal-metabolism-0000002526641704
-->
# Querying the Daily Resting Calorie Consumption Target

This section describes how industry apps query daily resting calorie consumption target data based on the weight management capability of a wearable, encompassing functions like calorie deficit assessment, calorie consumption monitoring, and calorie intake recording.

> **Note:** To query the resting calorie data from a wearable, the Stay Fit app needs to be started first. Resting calorie data is generated daily starting at 00:00:00. Therefore, the query start time must be 00:00:00. This API returns the **daily resting calorie consumption target** (including post-workout resting calorie data if a workout occurs). Concurrent query of resting calorie data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the daily resting calorie consumption target. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for querying resting calorie data.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.BASAL_METABOLISM,
      startTime: 1736524800,
      endTime: 1736527800
    };

    // Call the queryHistoryData method of the Device object to query resting calorie data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned resting calorie data if the query is successful.
      console.info(`Succeeded in querying basalMetabolism data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query basalMetabolism data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying resting calorie data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when resting calorie data exists, or an empty array **[]** when no resting calorie data is available. If the query fails, the API throws **BusinessError**. Example of resting calorie data returned if the query is successful: 
```cpp
[{
    "startTime": 1736524800,
    "endTime": 1736524800,
    "type": "basalMetabolism",
    "fields": {
        "basalMetabolism": 1872
    }
},...]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains resting calorie data. |
| basalMetabolism | number | kcal | Resting calories. |
