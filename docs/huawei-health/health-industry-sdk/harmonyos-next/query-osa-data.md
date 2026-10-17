<!--
  Title: Querying Sleep Apnea Data
  Catalog: huaweihealth-Guides
  Document ID: query-osa-data-0000002376514409
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-osa-data-0000002376514409
-->
# Querying Sleep Apnea Data

This section describes how to query the sleep apnea data from a wearable. When a user falls asleep while wearing a wearable, industry apps can call the corresponding API to query sleep apnea data detected by the wearable.

> **Note:** Before querying sleep apnea data on a wearable, the sleep apnea detection function needs to be enabled in the Huawei Health app. To enable it, go to **Devices** > *Connected device* > **Sleep apnea**, and tap **ACTIVATE** at the bottom. To successfully obtain sleep apnea data from a wearable, ensure that the sleep apnea detection function is enabled in advance. For details, please refer to [Setting and Querying the Sleep Apnea Detection Switch State](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-osa-switch-0000002526659252). To successfully retrieve sleep apnea data, the user is advised to wear the wearable while sleeping for a duration exceeding 5 hours within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of sleep apnea data is not supported. You must wait for the previous query to complete before initiating a new one.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query sleep apnea data. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for querying sleep apnea data.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.OBSTRUCTIVE_SLEEP_APNEA,
      startTime: 1736580274,
      endTime: 1736580330
    };

    // Call the queryHistoryData method of the Device object to query sleep apnea data.
    device.queryHistoryData(queryParam).then((data: IndustryService.HistoryData[]) => {
      // Output the returned sleep apnea data if the query is successful.
      console.info(`Succeeded in querying obstructiveSleepApnea data, result is ${data}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query obstructiveSleepApnea data. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
 > **Note:** Parameter requirements of the API for querying sleep apnea data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (excluding the current day). If the query succeeds, the API returns **IndustryService.**[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)**[]** when sleep apnea data exists, or an empty array **[]** when no sleep apnea data is available. If the query fails, the API throws **BusinessError**. Example of the sleep apnea data returned if the query is successful: 
```cpp
[{
    "startTime": 1736510400,
    "endTime": 1736510400,
    "type": "obstructiveSleepApnea",
    "fields": {
        "osaLevel": 2
    }
},
{
    "startTime": 1736424000,
    "endTime": 1736424000,
    "type": "obstructiveSleepApnea",
    "fields": {
        "osaLevel": 3
    }
},...]
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | object | - | Object that contains the sleep apnea data. |
| osaLevel | number | - | Risk level. • **1**: normal • **2**: suspected low risk • **3**: suspected medium risk • **4**: suspected high risk |
