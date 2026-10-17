<!--
  Title: Querying Body Temperature Data
  Catalog: huaweihealth-Guides
  Document ID: query-temperature-data-0000002342676390
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-temperature-data-0000002342676390
-->
# Querying Body Temperature Data

A wearable provides the body temperature measurement capability. After a user measures their body temperature, industry apps can call the corresponding API to query the body temperature data recorded on the wearable.

Environmental factors may affect the accuracy of body temperature measurement. The measurement results are for reference only and should not be used for medical diagnosis.

> **Note:** To successfully retrieve body temperature data, it is recommended that body temperature measurement be performed at least once within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of body temperature data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query body temperature data. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct body temperature data query parameters.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.TEMPERATURE,
      startTime: 1736777580,
      endTime: 1736778180
    };

    // Call the queryHistoryData method of the Device object to query body temperature data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned body temperature data if the query is successful.
      console.info(`Succeeded in querying temperature data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query temperature data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying body temperature data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must not exceed 24 hours. If the query succeeds, the API returns IndustryService.[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)[] when body temperature data exists, or an empty array **[]** when no body temperature data is available. If the query fails, the API throws **BusinessError**. Example of the body temperature data returned if the query is successful: 
```cpp
[{
    "startTime": 1736777580,
    "endTime": 1736777580,
    "type": "temperature",
    "fields": {
        "skinTemperature": "33.4",
        "bodyTemperature": "37.2"
    }
},...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the body temperature data. |
| skinTemperature | number | °C | Skin temperature. |
| bodyTemperature | number | °C | Core body temperature. |
 > **Note:** Core body temperature query is not supported in versions for use outside the Chinese mainland.
