<!--
  Title: Subscribing to Fall Events
  Catalog: huaweihealth-Guides
  Document ID: subscribe-fall-detect-event-0000002376394537
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-fall-detect-event-0000002376394537
-->
# Subscribing to Fall Events

This section describes how to subscribe to and unsubscribe from fall events of a wearable. Following a successful subscription, the wearable reports a fall event when determining that a fall has occurred. After unsubscription, fall events are no longer reported.

> **Note:** Fall events can be reported when the wearable is in AOD mode.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.

- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section141971612182616) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to fall events. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError, Callback } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Fall event callback.
    let callback: Callback<IndustryService.EventData> = (eventData: IndustryService.EventData) => {
      // Process the fall event.
      console.info(`report fallDetectedEvent: ${JSON.stringify(eventData)}`);
    };
    // Call the subscribeEvent method of the Device object to subscribe to fall events.
    device.subscribeEvent(IndustryService.EventType.FALL_DETECTED_EVENT, callback).then(() => {
      // The fall event subscription is successful.
      console.info('Succeeded in subscribing fallDetectedEvent.');
    }).catch((err: BusinessError) => {
      // The fall event subscription fails.
      console.error(`Failed to subscribe fallDetectedEvent. Code is ${err.code}, message is ${err.message}.`);
    });
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Process fall event information in Callback<IndustryService.[EventData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7634104243910)>. For a fall event, **eventData** contains the event type (specified by **event**) and event status (specified by **status**). 
```cpp
eventData example:
{
  event: 'fallDetectedEvent',
  status: 10
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| status | 10 | Indicates that a fall event occurs. |

- Call the [unSubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section29691015152720) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to unsubscribe from fall events when necessary. 
```cpp
// Call the unSubscribeEvent method of the Device object to unsubscribe from fall events. Note: The callback object used here must be the same as the fall event subscription callback object.
device.unSubscribeEvent(IndustryService.EventType.FALL_DETECTED_EVENT, callback).then(() => {
  // The fall event unsubscription is successful.
  console.info('Succeeded in unsubscribing fallDetectedEvent.');
}).catch((err: BusinessError) => {
  // The fall event unsubscription fails.
  console.error(`Failed to unsubscribe fallDetectedEvent. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
