<!--
  Title: Subscribing to the Workout Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-exercise-type-changed-event-0000002342676402
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-exercise-type-changed-event-0000002342676402
-->
# Subscribing to the Workout Status

This section describes how to subscribe to and unsubscribe from the workout status on a wearable. Following a successful subscription, the wearable reports the workout status when entering a specified control states during a workout. After unsubscription, the workout status is no longer reported.

> **Note:** The wearable reports the workout status during control states such as prepare, exit preparation, start, pause, resume, and end. The workout status can be reported when the wearable is in AOD mode.

- Import required modules.

- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section141971612182616) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to the workout status. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError, Callback } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Workout status event callback.
    let callback: Callback<IndustryService.EventData> = (eventData: IndustryService.EventData) => {
      // Process the workout status event.
      console.info(`report exerciseTypeChangedEvent: ${JSON.stringify(eventData)}`);
    };
    // Call the subscribeEvent method of the Device object to subscribe to the workout status.
    device.subscribeEvent(IndustryService.EventType.EXERCISE_TYPE_CHANGED_EVENT, callback).then(() => {
      // The workout status subscription is successful.
      console.info('Succeeded in subscribing exerciseTypeChangedEvent.');
    }).catch((err: BusinessError) => {
      // The workout status subscription fails.
      console.error(`Failed to subscribe exerciseTypeChangedEvent. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
  // Output error information if the wearable list fails to be obtained.
  console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
});
```

- Process the workout status event in Callback<IndustryService.[EventData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7634104243910)>. For a workout status change, **eventData** contains the event type (specified by **event**) and event status (specified by **status**). 
```cpp
eventData example:
{
  event: 'exerciseTypeChangedEvent',
  status: 23
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| status | Workout status code. For details, please refer to [Workout Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sport-status-enumeration-0000002338268622). | Indicates that the user is in workout status corresponding to the workout status code. |

- Call the [unSubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section29691015152720) method to unsubscribe from the workout status when necessary. 
```cpp
// Call the unSubscribeEvent method of the Device object to unsubscribe from the workout status. Note: The callback object used here must be the same as the workout status callback object.
device.unSubscribeEvent(IndustryService.EventType.EXERCISE_TYPE_CHANGED_EVENT, callback).then(() => {
  // The unsubscription is successful.
  console.info('Succeeded in unsubscribing exerciseTypeChangedEvent.');
}).catch((err: BusinessError) => {
  // The unsubscription fails.
  console.error(`Failed to unsubscribe exerciseTypeChangedEvent. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
