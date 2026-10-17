<!--
  Title: Subscribing to Daily Activity Data Updates
  Catalog: huaweihealth-Guides
  Document ID: subscribe-fitness-update-event-0000002342516614
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-fitness-update-event-0000002342516614
-->
# Subscribing to Daily Activity Data Updates

This section describes how to subscribe to and unsubscribe from daily activity data update events on a wearable. Following a successful subscription, the wearable reports a daily activity data update event when detecting that the conditions for updating daily activity data are met. After unsubscription, the wearable no longer reports daily activity data update events.

> **Note:** **Data update events are reported only when the screen is on.** A data update event is reported upon the first standing status change each hour. A data update event is reported and the statistical values of the four conditions are reset to 0 when the wearable detects that any of the following conditions is met: The step count reaches 500. The distance reaches 1000 meters. The activity duration reaches 1 hour. The calories burned reaches 100 kcal.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section141971612182616) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to daily activity data updates. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError, Callback } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Daily activity data update event callback.
    let callback: Callback<IndustryService.EventData> = (eventData: IndustryService.EventData) => {
      // Process the daily activity data update event.
      console.info(`report fitnessUpdateEvent: ${JSON.stringify(eventData)}`);
    };
    // Call the subscribeEvent method of the Device object to subscribe to daily activity data updates.
    device.subscribeEvent(IndustryService.EventType.FITNESS_UPDATE_EVENT, callback).then(() => {
      // The daily activity data update subscription is successful.
      console.info('Succeeded in subscribing fitnessUpdateEvent.');
    }).catch((err: BusinessError) => {
      // The daily activity data update subscription fails.
      console.error(`Failed to subscribe fitnessUpdateEvent. Code is ${err.code}, message is ${err.message}.`);
    });
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Process the daily activity data update in **Callback<IndustryService.**[EventData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7634104243910)**>**. For a daily activity data update, **eventData** contains the event type (specified by **event**) and event status (specified by **status**). 
```cpp
eventData example:
{
  event: 'fitnessUpdateEvent',
  status: 10
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| status | 10 | Indicates that the daily activity data is updated. |

- Call the [unSubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section29691015152720) method to unsubscribe from daily activity data update events when necessary. 
```cpp
// Call the unSubscribeEvent method to unsubscribe from daily activity data update events.
// Note: The callback object used here must be the same as that used for activity data update event subscription.
device.unSubscribeEvent(IndustryService.EventType.FITNESS_UPDATE_EVENT, callback).then(() => {
  // The daily activity data update unsubscription is successful.
  console.info('Succeeded in unsubscribing fitnessUpdateEvent.');
}).catch((err: BusinessError) => {
  // The daily activity data update unsubscription fails.
  console.error(`Failed to unsubscribe fitnessUpdateEvent. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
