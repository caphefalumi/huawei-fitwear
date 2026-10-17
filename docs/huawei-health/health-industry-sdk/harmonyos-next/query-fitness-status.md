<!--
  Title: Querying the Daily Activity Status
  Catalog: huaweihealth-Guides
  Document ID: query-fitness-status-0000002376514429
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-fitness-status-0000002376514429
-->
# Querying the Daily Activity Status

This section describes how to query the daily activity status from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity status and the corresponding activity duration recorded on the wearable.

> **Note:** Concurrent query of the daily activity status is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying historical heart rate data, historical SpO2 data, or daily activity data. You must wait for the previous query task to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the daily activity status. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for the query.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.FITNESS_STATUS,
      startTime: 1736521200,
      endTime: 1736547600
    }
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Process the query result.
      console.info(`Succeeded in querying FITNESS_STATUS data, result is ${data}.`);
    }).catch((error: BusinessError) => {
      // Process the query exception.
      console.info(`Failed to query FITNESS_STATUS data, code: ${error.code}, message: ${error.message}.`);
    })
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying the daily activity status: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when daily activity status data exists, or an empty array **[]** when no daily activity status data is available. If the query fails, the API throws **BusinessError**. 
```cpp
// Returned data example:
[
    {
        "startTime": 1740367260,
        "endTime": 1740367320,
        "type": "fitnessStatus",
        "fields": {
            "statusType": 3,
            "duration": 1
        }
    },
    ...
]
```
 > **Note:** In the returned daily activity status data, **startTime** indicates the start time of a status, and **endTime** is calculated as **startTime** plus **Duration**. 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains daily activity status data. |
| statusType | number | - | Activity status type. For details, please refer to [Daily Activity Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/daily-activity-status-enumeration-0000002372186769). |
| duration | number | Minute | Duration of the activity status. |
