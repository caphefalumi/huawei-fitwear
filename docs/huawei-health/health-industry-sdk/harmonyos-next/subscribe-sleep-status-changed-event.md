<!--
  Title: Subscribing to the Sleep Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-sleep-status-changed-event-0000002376514417
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-sleep-status-changed-event-0000002376514417
-->
# Subscribing to the Sleep Status

This section describes how to subscribe to and unsubscribe from wearable user sleep status. Following a successful subscription, the current sleep status is reported when the wearable user's sleep status changes. After unsubscription, the sleep status is no longer reported.

> **Note:** The sleep status can be reported when the wearable is in AOD mode.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.

- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section141971612182616) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to the sleep status. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Sleep status callback.
    let callback: Callback<IndustryService.EventData> = (eventData: IndustryService.EventData) => {
      console.info(`report event: ${JSON.stringify(eventData)}.`);
    }
    // Call the subscribeEvent method of the Device object to subscribe to the sleep status.
    device.subscribeEvent(IndustryService.EventType.SLEEP_STATUS_CHANGED_EVENT, callback).then(() => {
      // The sleep status subscription is successful.
      console.info(`Succeeded in subscribing sleepStatusChangedEvent.`);
    }).catch((err: BusinessError) => {
      // The sleep status subscription fails.
      console.error(`Failed to subscribe sleepStatusChangedEvent. Code is ${err.code}, message is ${err.message}.`);
    })
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Process the sleep status change information in Callback<IndustryService.[EventData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7634104243910)>. For a sleep status change, **eventData** contains the event type (specified by **event**) and sleep status type (specified by **status**). 
```cpp
eventData example:
{
  event: 'sleepStatusChangedEvent',
  status: 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| status | 0 | Entering light sleep (LIGHT_SLEEP_STATUS). |
| 1 | Entering deep sleep (DEEP_SLEEP_STATUS). |  |
| 2 | Entering awake state (AWAKE_STATUS). |  |
| 3 | Entering normal sleep (ASLEEP_STATUS). |  |
| 4 | Entering awake state (OTHER_SLEEP_STATUS). |  |
| 5 | Suspected sleep onset (SUSPECTED_SLEEP). |  |

- Call the [unSubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section29691015152720) method to unsubscribe from the sleep status. 
```cpp
// Call the unSubscribeEvent method of the Device object to unsubscribe from the sleep status. Note: The callback object used here must be the same as the previous sleep status callback object.
device.unSubscribeEvent(IndustryService.EventType.SLEEP_STATUS_CHANGED_EVENT, callback).then(() => {
  // The sleep status unsubscription is successful.
  console.info(`Succeeded in unsubscribing sleepStatusChangedEvent.`);
}).catch((err: BusinessError) => {
  // The sleep status unsubscription fails.
  console.error(`Failed to unsubscribe sleepStatusChangedEvent. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
