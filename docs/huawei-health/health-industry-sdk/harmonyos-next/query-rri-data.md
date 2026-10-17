<!--
  Title: Querying R-R Interval Data
  Catalog: huaweihealth-Guides
  Document ID: query-rri-data-0000002557601347
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-rri-data-0000002557601347
-->
# Querying R-R Interval Data

This section describes how to query the R-R interval (RRI) data from a wearable. After a user wears the device for a period of time, industry apps can call the corresponding API to query the RRI data recorded on the device.

> **Note:** The RRI is measured every 10 minutes. RRI measurement requires the user to be at rest. During activity, values may not be generated. Concurrent query of historical RRI data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query historical RRI data. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct data query parameters.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.RRI,
      startTime: 1736521200,
      endTime: 1736547600
    }
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Process the query result.
      console.info(`Succeeded in querying RRI data, result is ${data}.`);
    }).catch((error: BusinessError) => {
      // Process the query exception.
      console.info(`Failed to query RRI data. Code is ${error.code}, message is ${error.message}.`);
    })
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying historical RRI data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when historical RRI data exists, or an empty array **[]** when no historical RRI data is available. If the query fails, the API throws **BusinessError**. Example of the historical RRI data returned if the query is successful: 
```cpp
[
    {
        "startTime": 1772268695000,
        "endTime": 1772268695726,
        "type": "rri",
        "fields": [
            {
                "time": 1772268695000,
                "rriNum": 726,
                "sqiNum": 100
            },
            {
                "time": 1772268695726,
                "rriNum": 781,
                "sqiNum": 100
            }
            ...
        ]
    },
    {
        "startTime": 1772268695000,
        "endTime": 1772268695726,
        "type": "rri",
        "fields": [
            {
                "time": 1772268695000,
                "rriNum": 726,
                "sqiNum": 100
            },
            {
                "time": 1772268695726,
                "rriNum": 781,
                "sqiNum": 100
            }
            ...
        ]
    },
    ...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| time | number | - | Timestamp when the RRI data is generated. |
| rriNum | number | - | RRI value. |
| sqiNum | number | - | Confidence. |
