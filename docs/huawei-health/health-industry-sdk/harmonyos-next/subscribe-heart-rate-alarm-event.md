<!--
  Title: Subscribing to Heart Rate Alerts
  Catalog: huaweihealth-Guides
  Document ID: subscribe-heart-rate-alarm-event-0000002342676398
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-heart-rate-alarm-event-0000002342676398
-->
# Subscribing to Heart Rate Alerts

This section describes how to subscribe to and unsubscribe from resting heart rate alerts of a wearable. Following a successful subscription, the heart rate alert information generated on the wearable is reported. After unsubscription, heart rate alert information is no longer reported.

> **Note:** Heart rate alert information can be reported when the wearable is in AOD mode.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section141971612182616) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to heart rate alert information. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Heart rate alert information callback.
    let callback: Callback<IndustryService.EventData> = (eventData: IndustryService.EventData) => {
      console.info(`report event: ${JSON.stringify(eventData)}`);
    }
    // Call the subscribeEvent method of the Device object to subscribe to heart rate alert information.
    device.subscribeEvent(IndustryService.EventType.HEART_RATE_ALARM_EVENT, callback).then(() => {
      // The heart rate alert information subscription is successful.
      console.info(`Succeeded in subscribing heartRateAlarmEvent.`);
    }).catch((err: BusinessError) => {
      // The heart rate alert information subscription fails.
      console.error(`Failed to subscribe heartRateAlarmEvent. Code is ${err.code}, message is ${err.message}.`);
    })
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Process the heart rate alert information in Callback<IndustryService.[EventData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7634104243910)>. For a triggered heart rate alert, **eventData** contains the event type (specified by **event**) and heart rate alert type (specified by **status**). 
```cpp
eventData example:
{
  event: 'heartRateAlarmEvent',
  status: 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| status | 0 | The resting heart rate is too high. |
| 1 | The resting heart rate is too low. |  |

- Call the [unSubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section29691015152720) method to unsubscribe from the heart rate alert information. 
```cpp
// Call the unSubscribeEvent method of the Device object to unsubscribe from the heart rate alert information. Note: The callback object used here must be the same as the heart rate alert information callback object.
device.unSubscribeEvent(IndustryService.EventType.HEART_RATE_ALARM_EVENT, callback).then(() => {
  // The heart rate alert information unsubscription is successful.
  console.info(`Succeeded in unsubscribing heartRateAlarmEvent.`);
}).catch((err: BusinessError) => {
  // The heart rate alert information unsubscription fails.
  console.error(`Failed to unsubscribe heartRateAlarmEvent. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
