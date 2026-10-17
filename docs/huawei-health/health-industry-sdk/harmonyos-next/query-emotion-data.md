<!--
  Title: Querying Emotion Data
  Catalog: huaweihealth-Guides
  Document ID: query-emotion-data-0000002557579167
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-emotion-data-0000002557579167
-->
# Querying Emotion Data

This section describes how to query the emotion data from a wearable. After a user assesses their emotions with a wearable, industry apps can call the corresponding API to query the emotion data recorded on the wearable.

> **Note:** To successfully obtain emotion data from a wearable, enable automatic emotion/stress test first. For details, please refer to [Setting and Querying the Automatic Emotion/Stress Test Switch State](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-emotion-switch-0000002526499302). To successfully retrieve emotion data, it is recommended that the wearable be worn for more than 30 minutes within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of emotion data is not supported. You must wait for the previous query to complete before initiating a new one.

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
    // Construct data query parameters.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.EMOTION,
      startTime: 1736580274,
      endTime: 1736580330
    };

    // Call the queryHistoryData method of the Device object to query emotion data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned emotion data if the query is successful.
      console.info(`Succeeded in querying emotion data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query emotion data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying emotion data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must be between 1 minute and 24 hours. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when emotion data exists, or an empty array **[]** when no emotion data is available. If the query fails, the API throws **BusinessError**. Example of the historical emotion data returned if the query is successful: 
```cpp
[{
    "startTime": 1736580274,
    "endTime": 1736580330,
    "type": "emotion",
    "fields": {
	"emotionStatus": 2,
	"valenceCharacter": 59.87324142456055,
	"arousalCharacter": 9.810883522033691,
    }
},
{
    "startTime": 1736580154,
    "endTime": 1736580210,
    "type": "emotion",
    "fields": {
	"emotionStatus": 1,
	"valenceCharacter": 54.87324142456055,
	"arousalCharacter": 7.810883522033691,
    }
},...
]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the emotion data. |
| emotionStatus | number | - | Emotion value. • **1**: negative emotions, such as unpleasant • **2**: neutral emotions, such as calm • **3**: positive emotions, such as pleasant |
| valenceCharacter | number | - | Valence feature, representing the valence dimension of human emotions. A lower value indicates a more negative emotion, and a higher value indicates a more positive emotion. The valid value range is [0, 100]. |
| arousalCharacter | number | - | Arousal feature, representing the physiological activation level of a person. A larger value indicates greater activation. The valid value range is [0, 100]. |
