<!--
  Title: Querying the Resting Calorie Consumption of the Current Day
  Catalog: huaweihealth-Guides
  Document ID: query-today-resting-calories-0000002557841549
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-today-resting-calories-0000002557841549
-->
# Querying the Resting Calorie Consumption of the Current Day

This section describes how industry apps use the corresponding capability to query the resting calorie consumption data of the current day recorded on a wearable.

> **Note:** To query the resting calorie data from a wearable, the Stay Fit app needs to be started first. This API returns the **resting calorie consumption value of the current day** starting at 00:00:00 and ending at the query time (including post-workout resting calorie data if a workout occurs). It is normal that the **resting calorie consumption value of the current day** returned by this API differs from the value displayed in the Stay Fit app on the wearable by 1–2 kcal. Concurrent query of resting calorie data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryTodaySummation](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section102431619008) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the resting calorie consumption data of the current day. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    device.queryTodaySummation(IndustryService.DataType.BASAL_METABOLISM).then((data: IndustryService.HistoryData[]) => {
      // Process the query result.
      console.info(`Succeeded in querying todaySummation data, result is ${data}.`);
    }).catch((error: BusinessError) => {
      // Process the query exception.
      console.info(`Failed to query todaySummation data, code: ${error.code}, message: ${error.message}.`);
    })
  })
  .catch((error: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${error.code}, message is ${error.message}.`);
  });
```
 If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when resting calorie consumption data of the current day exists, or an empty array **[]** when no resting calorie consumption data of the current day is available. If the query fails, the API throws **BusinessError**. Example of resting calorie data returned if the query is successful: 
```cpp
[{
    "startTime": 1773158400,
    "endTime": 1773210701,
    "type": "basalMetabolism",
    "fields": {
        "todayRestingCalories": 1102
    }
},...]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains resting calorie data. |
| todayRestingCalories | number | kcal | Resting calories burned on the current day. |
