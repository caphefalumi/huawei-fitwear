<!--
  Title: Querying PPG-based Pulse Wave Arrhythmia Data
  Catalog: huaweihealth-Guides
  Document ID: query-arrhythmia-ppg-data-0000002526499308
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-arrhythmia-ppg-data-0000002526499308
-->
# Querying PPG-based Pulse Wave Arrhythmia Data

This section describes how to query PPG-based pulse wave arrhythmia data based on the raw pulse wave arrhythmia data query feature supported by a wearable. After a user completes a pulse wave arrhythmia measurement, industry apps can call the corresponding API to query the PPG-based pulse wave arrhythmia data recorded on the wearable.

> **Note:** Before querying the PPG-based pulse wave arrhythmia data from a wearable, ensure that the pulse wave arrhythmia analysis function is activated in the Huawei Health app. To activate it, go to **Devices** > *Connected device* > **Pulse wave arrhythmia analysis**, tap **Agree** to go to the next screen, and tap **ACTIVATE** on the top. To successfully retrieve PPG-based pulse wave arrhythmia data, it is recommended that pulse wave arrhythmia analysis be performed at least once within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of PPG-based pulse wave arrhythmia data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query PPG-based pulse wave arrhythmia data. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for querying PPG-based pulse wave arrhythmia data.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.ARRHYTHMIA_PPG,
      startTime: 1736586113,
      endTime: 1736585902
    };

    // Call the queryHistoryData method of the Device object to query PPG-based pulse wave arrhythmia data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned PPG-based pulse wave arrhythmia data if the query is successful.
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
 > **Note:** Parameter requirements of the API for querying PPG-based pulse wave arrhythmia data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when PPG-based pulse wave arrhythmia data exists, or an empty array **[]** when no PPG-based pulse wave arrhythmia data is available. If the query fails, the API throws **BusinessError**. Example of the PPG-based pulse wave arrhythmia data returned if the query is successful: 
```cpp
[{
    "startTime": 1736586113,
    "endTime": 1736586113,
    "type": "arrhythmiaPpg",
    "fields": {
    "waveClass": "060601010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "rriArray": "5005D002D002D002D002A802D002D002A802F802F802D002F802200320032003F802F802480348037003F80248034803480370032003F802480348032003D002F802F802D002F802D002A802A802A802A802A802D002D002F802F802F802A802F802A802A802D002A802D002F802700398039803C00398030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009B01FB55D86D",
    "rriArrayLen": 60,
    "firstValley": 1
    }
},...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| waveClass | number[] | - | Waveform type. |
| rriArray | number[] | - | Peak point information (peak-to-peak distance). |
| rriArrayLen | number | - | Length of peak point information in **rriArray**. |
| firstValley | number | - | Index of the first peak point. |
