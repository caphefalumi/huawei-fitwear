<!--
  Title: Subscribing to Heart Rate Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-heart-rate-data-0000002342516598
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-heart-rate-data-0000002342516598
-->
# Subscribing to Heart Rate Data

This section describes how to subscribe to and unsubscribe from wearable users' heart rate data. Following a successful subscription, the wearable starts reporting current heart rate data. After unsubscription, the heart rate data is no longer reported.

> **Note:** When a user removes their wearable, the wearable reports **255**. When a wearable is picked up, it automatically starts heart rate measurement. If the wearable detects that it is not being worn or it is worn incorrectly, it reports **255**. When a wearable is put back on after being removed, it reports the most recent valid heart rate data. In smart heart rate monitoring mode, heart rate data is reported every 10 minutes if the wearable detects low, low-to-moderate, or moderate activity intensity levels. If the continuous heart rate monitoring mode is enabled, a wearable reports the heart rate data every 5 seconds. **Following a subscription to heart rate data on a wearable, no data is reported when the wearable is in AOD mode, and the data is reported only when the screen is on.**

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.

- Call the [subscribeRealTimeData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section049515146113) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to heart rate data. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError, Callback } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Heart rate data callback parameter.
    let callback: Callback<IndustryService.RealTimeData> = (realTimeData: IndustryService.RealTimeData) => {
      console.info(`report heartRate: ${JSON.stringify(realTimeData)}`);
    };
    // Call the subscribeRealTimeData method of the Device object to subscribe to heart rate data.
    device.subscribeRealTimeData(IndustryService.RealTimeDataType.HEART_RATE, callback).then(() => {
      // The heart rate data subscription is successful.
      console.info('Succeeded in subscribing heartRate.');
    }).catch((err: BusinessError) => {
      // The heart rate data subscription fails.
      console.error(`Failed to subscribe heartRate. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Process heart rate data from the wearable in Callback<IndustryService.[RealTimeData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section12262172612114)>. **realTimeData** contains the heart rate data generated in the wearable. 
```cpp
realTimeData example:
{
    "time": 1739411852,
    "errorCode": 0,
    "type": "heartRate",
    "fields": {
        "heartRate": 86
    }
}
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | Record<string, object \| string \| number> | - | Object that contains real-time data. |
| heartRate | number | bpm | Current heart rate. The value **255** indicates an invalid value. |

- Call the [unSubscribeRealTimeData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1638711819219) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to unsubscribe from the heart rate data. 
```cpp
// Call the unSubscribeRealTimeData method to unsubscribe from the heart rate data.
// Note: The callback object used here must be the same as that used for heart rate data subscription.
device.unSubscribeRealTimeData(IndustryService.RealTimeDataType.HEART_RATE, callback).then(() => {
  // The heart rate data unsubscription is successful.
  console.info('Succeeded in unsubscribing heartRate.');
}).catch((err: BusinessError) => {
  // The heart rate data unsubscription fails.
  console.error(`Failed to unsubscribe heartRate. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
