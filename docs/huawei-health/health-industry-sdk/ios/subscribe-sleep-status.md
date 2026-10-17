<!--
  Title: Subscribing to the Sleep Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-sleep-status-0000002594269412
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-sleep-status-0000002594269412
-->
# Subscribing to the Sleep Status

This section describes how to subscribe to and unsubscribe from the wearable user sleep status. Following a successful subscription, the current sleep status is reported when the wearable user's sleep status changes. After unsubscription, the sleep status is no longer returned.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section484944212315) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to subscribe to the sleep status. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the subscribeEvent method of the Device object to subscribe to the sleep status.
        let uuid = try await device.subscribeEvent(type: .sleepStatusChangedEvent) { eventData in
            print("Event report. Event: \(eventData.event), status: \(eventData.status)")
        }

        // The sleep status is successfully subscribed to.
        print("Succeeded in subscribing sleepStatusChangedEvent")
    } catch let err as IndustryError {
        // Failed to subscribe to the sleep status.
        print("Failed to subscribe sleepStatusChangedEvent. Code: \(err.code), message: \(err.message)")
    }
}
```

- Process the sleep status in the (**EventData -> Void**) closure. For a sleep status change, **eventData** contains the event type (specified by **event**) and sleep status (specified by **status**). 
```cpp
eventData example:
{
    event: "sleepStatusChangedEvent",
    status: 1
}
```
 
| Field | Value | Description |
| --- | --- | --- |
| status | 1 | Asleep. |
| 2 | Awake. |  |

- Call the [unsubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section686172218408) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to unsubscribe from the sleep status. 
```cpp
Task {
    do {
        // Call the unsubscribeEvent method of the Device object to unsubscribe from the sleep status.
        try await device.unsubscribeEvent(type: .sleepStatusChangedEvent, subscribeId: uuid)

        // The sleep status is successfully unsubscribed from.
        print("Succeeded in unsubscribing sleepStatusChangedEvent")
    } catch let err as IndustryError {
        // Failed to unsubscribe from the sleep status.
        print("Failed to unsubscribe sleepStatusChangedEvent. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** The UUID passed for unsubscription must be the same as that returned upon a successful subscription.
