<!--
  Title: Querying Daily Activity Data
  Catalog: huaweihealth-Guides
  Document ID: query-fitness-data-0000002376394533
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-fitness-data-0000002376394533
-->
# Querying Daily Activity Data

This section describes how to query daily activity data from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity data recorded on the wearable.

> **Note:** Concurrent query of daily activity data is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying historical heart rate data, historical SpO2 data, or daily activity status. You must wait for the previous query task to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query daily activity data. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for the query.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.FITNESS,
      startTime: 1736521200,
      endTime: 1736547600
    }
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Process the query result.
      console.info(`Succeeded in querying FITNESS data, result is ${data}.`);
    }).catch((error: BusinessError) => {
      // Process the query exception.
      console.info(`Failed to query FITNESS data, code: ${error.code}, message: ${error.message}.`);
    })
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying daily activity data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when daily activity data exists, or an empty array **[]** when no daily activity data is available. If the query fails, the API throws **BusinessError**. 
```cpp
// Returned data example:
[
    {
        "startTime": 1740367260,
        "endTime": 1740367320,
        "type": "fitness",
        "fields": {
            "step": 100,
            "calorie": 1000,
            "distance": 10,
            "exerciseIntensity": 0,
            "height": 36
        }
    },
    ...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains daily activity data. |
| step | number | - | Step count. |
| calorie | number | cal | Calories burned. |
| distance | number | Meter | Distance. |
| exerciseIntensity | number | - | Exercise intensity. For details, please refer to [Table 2](#EN-US_TOPIC_0000002678004327__table6363121693315). |
| height | number | Decimeter | Height. |
 
| Parameter | Value | Description |
| --- | --- | --- |
| exerciseIntensity | 0 | Unspecified or low intensity. Note: This value is returned if the workout intensity is not specified. |
| 1 | Moderate-to-high intensity. |  |
