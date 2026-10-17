<!--
  Title: Querying Pulse Wave Arrhythmia Analysis Data
  Catalog: huaweihealth-Guides
  Document ID: query-arrhythmia-data-0000002376394513
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-arrhythmia-data-0000002376394513
-->
# Querying Pulse Wave Arrhythmia Analysis Data

This section describes how to query pulse wave arrhythmia analysis data from a wearable. After a user completes a pulse wave arrhythmia analysis, industry apps can call the corresponding API to query pulse wave arrhythmia analysis data recorded on the wearable.

> **Note:** Before querying the pulse wave arrhythmia analysis data from a wearable, ensure that the pulse wave arrhythmia analysis function is enabled in the Huawei Health app. To enable it, go to **Devices** > *Connected device* > **Pulse wave arrhythmia analysis**, tap **Agree** to go to the next screen, and tap **ACTIVATE** on the top. To successfully retrieve pulse wave arrhythmia analysis data, it is recommended that pulse wave arrhythmia analysis be performed at least once within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of pulse wave arrhythmia analysis data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query pulse wave arrhythmia analysis data. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for querying pulse wave arrhythmia analysis data.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.ARRHYTHMIA,
      startTime: 1736586113,
      endTime: 1736585902
    };

    // Call the queryHistoryData method of the Device object to query pulse wave arrhythmia analysis data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned pulse wave arrhythmia analysis data if the query is successful.
      console.info(`Succeeded in querying arrhythmia data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query arrhythmia data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying pulse wave arrhythmia analysis data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when pulse wave arrhythmia analysis data exists, or an empty array **[]** when no pulse wave arrhythmia analysis data is available. If the query fails, the API throws **BusinessError**. Example of the pulse wave arrhythmia analysis data returned if the query is successful: 
```cpp
[{
    "startTime": 1736586113,
    "endTime": 1736586113,
    "type": "arrhythmia",
    "fields": {
        "saveTime": 1736586113,
        "measureType": 1,
        "ppgIrregularHeartbeat": 2
    }
},
{
    "startTime": 1736585902,
    "endTime": 1736585902,
    "type": "arrhythmia",
    "fields": {
        "saveTime": 1736585902,
        "measureType": 1,
        "ppgIrregularHeartbeat": 4
    }
},...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains pulse wave arrhythmia analysis data. |
| saveTime | number | Second | Time when pulse wave arrhythmia analysis data is saved, in UTC timestamp format. |
| measureType | number | - | Measurement type. • **0**: automatic measurement • **1**: active measurement |
| ppgIrregularHeartbeat | number | - | Pulse wave arrhythmia analysis result. • **1**: no abnormality detected • **2**: suspected premature beats • **3**: suspected atrial fibrillation (AFib) • **4**: irregular heart rhythm - potential AFib risk • **5**: irregular heart rhythm - potential premature beats risk |
