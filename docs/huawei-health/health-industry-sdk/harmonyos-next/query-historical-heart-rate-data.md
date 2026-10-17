<!--
  Title: Querying Historical Heart Rate Data
  Catalog: huaweihealth-Guides
  Document ID: query-historical-heart-rate-data-0000002376394509
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-historical-heart-rate-data-0000002376394509
-->
# Querying Historical Heart Rate Data

This section describes how to query heart rate data based on the heart rate measurement capability of wearables. After a user measures their heart rate, industry apps can call the corresponding API to query the heart rate data recorded on the wearable.

> **Note:** Before obtaining the heart rate data from the wearable, enable continuous heart rate monitoring. For details, please refer to [Setting and Querying the Continuous Heart Rate Monitoring Mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-heart-rate-monitoring-mode-0000002342516586). Concurrent query of historical heart rate data is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying historical SpO2 data, for querying daily activity data, or for querying daily activity status. You must wait for the previous query task to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query historical heart rate data. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct data query parameters.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.HEART_RATE,
      startTime: 1736521200,
      endTime: 1736547600
    }
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Process the query result.
      console.info(`Succeeded in querying HEART_RATE data, result is ${data}.`);
    }).catch((error: BusinessError) => {
      // Process the query exception.
      console.info(`Failed to query HEART_RATE data. Code is ${error.code}, message is ${error.message}.`);
    })
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying historical heart rate data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when historical heart rate data exists, or an empty array **[]** when no historical heart rate data is available. If the query fails, the API throws **BusinessError**. Example of the historical heart rate data returned if the query is successful: 
```cpp
[
    {
        "startTime": 1740366420,
        "endTime": 1740366480,
        "type": "heartRate",
        "fields": {
            "heartRate": 83,
            "restingHeartRate": 0
        }
    },
    {
        "startTime": 1740366480,
        "endTime": 1740366540,
        "type": "heartRate",
        "fields": {
            "heartRate": 66,
            "restingHeartRate": 60
        }
    },
    ...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the historical heart rate data. |
| heartRate | number | beats/min | Heart rate. |
| restingHeartRate | number | beats/min | Resting heart rate. |
