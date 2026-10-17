<!--
  Title: Querying Daily Activity Summary Data
  Catalog: huaweihealth-Guides
  Document ID: query-fitness-summation-data-0000002342676406
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-fitness-summation-data-0000002342676406
-->
# Querying Daily Activity Summary Data

This section describes how to query the daily activity summary data of the current day from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity summary data of the current day recorded on the wearable.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryTodaySummation](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section102431619008) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the daily activity summary data of the current day. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    device.queryTodaySummation(IndustryService.DataType.FITNESS).then((data: IndustryService.HistoryData[]) => {
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
 If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when the daily activity summary data of the current day exists, or an empty array **[]** when no daily activity summary data is available for the current day. If the query fails, the API throws **BusinessError**. 
```cpp
// Returned data example:
[{
    "startTime": 1740153600,
    "endTime": 1740211889,
    "type": "fitness",
    "fields": {
        "totalStep": 1000,
        "totalCalorie": 11125683,
        "totalDistance": 0,
        "totalStrengthTime": 0,
        "totalHeight": 50
    }
}]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the daily activity summary data of the current day. |
| totalStep | number | - | Current total steps. |
| totalCalorie | number | cal | Current total active calories burned. |
| totalDistance | number | Meter | Current total distance. |
| totalStrengthTime | number | Minute | Total duration of activities at the moderate-to-high intensity. |
| totalHeight | number | Meter | Current total stair climbing height. |
