<!--
  Title: Subscribing to Data Updates of a Single Workout
  Catalog: huaweihealth-Guides
  Document ID: subscribe-workout-update-event-0000002376514421
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-workout-update-event-0000002376514421
-->
# Subscribing to Data Updates of a Single Workout

This section describes how to subscribe to and unsubscribe from single-workout data update events on a wearable. Following a successful subscription, the wearable reports a single-workout data update event after a single workout completes within the subscription time range. After unsubscription, single-workout data update events are no longer reported.

> **Note:** **Single-workout data update events are reported only when the screen is on, but not in AOD mode.**

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section141971612182616) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to data updates of a single workout. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError, Callback } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Callback for single-workout data update events.
    let callback: Callback<IndustryService.EventData> = (eventData: IndustryService.EventData) => {
      console.info(`report event: ${JSON.stringify(eventData)}`);
    };
    // Call the subscribeEvent method of the Device object to subscribe to data updates of a single workout.
    device.subscribeEvent(IndustryService.EventType.WORKOUT_UPDATE_EVENT, callback).then(() => {
      // The subscription to single-workout data updates is successful.
      console.info('Succeeded in subscribing workoutUpdateEvent.');
    }).catch((err: BusinessError) => {
      // The subscription to single-workout data updates fails.
      console.error(`Failed to subscribe workoutUpdateEvent. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
});
```

- Process the single-workout data update information in Callback<IndustryService.[EventData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7634104243910)>. For a single-workout data update, **eventData** contains the event type (specified by **event**) and event status (specified by **status**). 
```cpp
eventData example:
{
  event: 'workoutUpdateEvent',
  status: 10
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| status | 10 | Indicates that there is a single-workout data update. The workout types supported in reported update events are consistent with those in [Querying Data of a Single Workout](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-workout-data-0000002342516602). For details, please refer to [Single Workout Type](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/workout-type-enumeration-0000002381615405). |

- Call the [unSubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section29691015152720) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to unsubscribe from single-workout data update events when necessary. 
```cpp
// Call the unSubscribeEvent method of the Device object to unsubscribe from single-workout data update events.
// Note: The callback object used here must be the same as that used for single-workout data update subscription.
device.unSubscribeEvent(IndustryService.EventType.WORKOUT_UPDATE_EVENT, callback).then(() => {
  // The unsubscription from single-workout data updates is successful.
  console.info('Succeeded in unsubscribing workoutUpdateEvent.');
}).catch((err: BusinessError) => {
  // The unsubscription from single-workout data updates fails.
  console.error(`Failed to unsubscribe workoutUpdateEvent. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
