<!--
  Title: Subscribing to Daily Health Data Updates
  Catalog: huaweihealth-Guides
  Document ID: subscribe-daily-health-data-update-0000002624668879
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-daily-health-data-update-0000002624668879
-->
# Subscribing to Daily Health Data Updates

This section describes how to subscribe to and unsubscribe from daily health data update events on a wearable. Following a successful subscription, the wearable reports a daily health data update event when detecting that the conditions for updating daily health data are met. After unsubscription, the wearable no longer reports daily health data update events.

> **Note:** A data update event is reported upon the first standing status change each hour. A data update event is reported and the statistical values of the four conditions are reset to 0 when the wearable detects that any of the following conditions is met: The step count reaches 500. The distance reaches 1000 meters. The activity duration reaches 1 hour. The calories burned reaches 100 kcal.

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section484944212315) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to subscribe to daily health data updates. 
```cpp
// Import the required module.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the subscribeEvent method of the Device object to subscribe to daily health data updates.
        let uuid = try await device.subscribeEvent(type: .fitnessUpdateEvent) { eventData in
            print("Event report. Event: \(eventData.event), status: \(eventData.status)")
        }

        // The daily health data updates are successfully subscribed to.
        print("Succeeded in subscribing fitnessUpdateEvent")
    } catch let err as IndustryError {
        // The daily health data update subscription fails.
        print("Failed to subscribe fitnessUpdateEvent. Code: \(err.code), message: \(err.message)")
    }
}
```

- Process the daily health data updates in the **(EventData -> Void)** closure. For a daily health data update, **eventData** contains the event type (specified by **event**) and event status (specified by **status**). 
```cpp
eventData example:
{
    event: "fitnessUpdateEvent",
    status: 9
}
```
 
| Field | Value | Description |
| --- | --- | --- |
| status | 9 | Indicates that the daily health data is updated. |

- Call the [unsubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section686172218408) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to unsubscribe from daily health data updates. 
```cpp
Task {
    do {
        // Call the unsubscribeEvent method of the Device object to unsubscribe from daily health data updates.
        try await device.unsubscribeEvent(type: .fitnessUpdateEvent, subscribeId: uuid)

        // The daily health data update unsubscription is successful.
        print("Succeeded in unsubscribing fitnessUpdateEvent")
    } catch let err as IndustryError {
        // The daily health data update unsubscription fails.
        print("Failed to unsubscribe fitnessUpdateEvent. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** The UUID passed for unsubscription must be the same as that returned upon a successful subscription.
