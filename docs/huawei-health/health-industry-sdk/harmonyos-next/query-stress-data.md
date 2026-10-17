<!--
  Title: Querying Stress Data
  Catalog: huaweihealth-Guides
  Document ID: query-stress-data-0000002376514405
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-stress-data-0000002376514405
-->
# Querying Stress Data

This section describes how to query the stress data from a wearable. After a user tests their stress, industry apps can call the corresponding API to query the stress data recorded on the wearable.

> **Note:** To successfully obtain stress data from a wearable, enable automatic emotion/stress test first. For details, please refer to [Setting and Querying the Automatic Emotion/Stress Test Switch State](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-emotion-switch-0000002526499302). To successfully retrieve stress data, it is recommended that the wearable be worn for more than 30 minutes within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of stress data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query stress data. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct stress data query parameters.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.STRESS,
      startTime: 1736580274,
      endTime: 1736580330
    };

    // Call the queryHistoryData method of the Device object to query stress data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned stress data if the query is successful.
      console.info(`Succeeded in querying stress data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query stress data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying stress data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when stress data exists, or an empty array **[]** when no stress data is available. If the query fails, the API throws **BusinessError**. Example of the stress data returned if the query is successful: 
```cpp
[{
    "startTime": 1736580274,
    "endTime": 1736580330,
    "type": "stress",
    "fields": {
        "stressScore": 56,
        "stressGrade": 2
    }
},
{
    "startTime": 1736580154,
    "endTime": 1736580210,
    "type": "stress",
    "fields": {
        "stressScore": 55,
        "stressGrade": 2
    }
},...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the stress data. |
| stressScore | number | - | Stress score. • 80–99: high • 60–79: medium • 30–59: normal • 1–29: relaxed |
| stressGrade | number | - | Stress level. • **4**: high • **3**: medium • **2**: normal • **1**: relaxed |
