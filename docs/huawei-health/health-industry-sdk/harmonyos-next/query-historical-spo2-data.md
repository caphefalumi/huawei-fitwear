<!--
  Title: Querying Historical SpO2 Data
  Catalog: huaweihealth-Guides
  Document ID: query-historical-spo2-data-0000002342516594
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-historical-spo2-data-0000002342516594
-->
# Querying Historical SpO2 Data

A wearable provides the SpO2 measurement capability. After a user measures their SpO2, industry apps can call the corresponding API to query the SpO2 data recorded on the wearable.

> **Note:** The SpO2 data returned by this API includes the SpO2 data manually measured by the user and the SpO2 data automatically measured by the wearable after automatic SpO2 measurement is enabled. To successfully retrieve SpO2 data, it is recommended that SpO2 measurement be performed at least once within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of historical SpO2 data is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying historical heart rate data, for querying daily activity data, or for querying daily activity status. You must wait for the previous query task to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query SpO2 data. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct data query parameters.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.SPO2,
      startTime: 1736521200,
      endTime: 1736547600
    }
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Process the query result.
      console.info(`Succeeded in querying SPO2 data, result is ${data}.`);
    }).catch((error: BusinessError) => {
      // Process the query exception.
      console.info(`Failed to query SPO2 data. Code is ${error.code}, message is ${error.message}.`);
    })
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying historical SpO2 data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns IndustryService.[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)[] when historical SpO2 data exists, or an empty array **[]** when no historical SpO2 data is available. If the query fails, the API throws **BusinessError**. Example of the historical SpO2 data returned if the query is successful: 
```cpp
[
    {
        "startTime": 1740366420,
        "endTime": 1740366480,
        "type": "spo2",
        "fields": {
            "spo2": 99
        }
    },
    {
        "startTime": 1740366480,
        "endTime": 1740366540,
        "type": "spo2",
        "fields": {
            "spo2": 98
        }
    },
    ...
]
```
 
| Parameter | Value | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the historical SpO2 data. |
| spo2 | number | % | SpO2. For example, the value **99** indicates that the SpO2 is 99%. |
