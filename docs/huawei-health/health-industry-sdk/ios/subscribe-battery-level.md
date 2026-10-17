<!--
  Title: Subscribing to the Device Battery Level
  Catalog: huaweihealth-Guides
  Document ID: subscribe-battery-level-0000002594109498
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-battery-level-0000002594109498
-->
# Subscribing to the Device Battery Level

This section describes how to subscribe to and unsubscribe from the battery level of a wearable. Following a successful subscription, the current battery level is returned when the battery level of a wearable decreases. After unsubscription, the battery level is no longer returned.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section484944212315) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to subscribe to the device battery level. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the subscribeEvent method of the Device object to subscribe to the device battery level.
        let uuid = try await device.subscribeEvent(type: .batteryLevelChangedEvent) { eventData in
            print("Event report. Event: \(eventData.event), status: \(eventData.status)")
        }

        // The device battery level is successfully subscribed to.
        print("Succeeded in subscribing batteryLevelChangedEvent")
    } catch let err as IndustryError {
        // Failed to subscribe to the device battery level.
        print("Failed to subscribe batteryLevelChangedEvent. Code: \(err.code), message: \(err.message)")
    }
}
```

- Process the device battery level in the (**EventData -> Void**) closure. For a decreased device battery level, **eventData** contains the event type (specified by **event**) and current battery level (specified by **status**) of the device. 
```cpp
eventData example:
{
    event: "batteryLevelChangedEvent",
    status: 50
}
```
 
| Field | Value | Description |
| --- | --- | --- |
| status | 1~99 | Current device battery level. |

- Call the [unsubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section686172218408) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to unsubscribe from the device battery level. 
```cpp
Task {
    do {
        // Call the unsubscribeEvent method of the Device object to unsubscribe from the device battery level.
        try await device.unsubscribeEvent(type: .batteryLevelChangedEvent, subscribeId: uuid)

        // The device battery level is successfully unsubscribed from.
        print("Succeeded in unsubscribing batteryLevelChangedEvent")
    } catch let err as IndustryError {
        // Failed to unsubscribe from the device battery level.
        print("Failed to unsubscribe batteryLevelChangedEvent. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** The UUID passed for unsubscription must be the same as that returned upon a successful subscription.
