<!--
  Title: Subscribing to the Device Charging Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-charge-status-0000002624668863
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-charge-status-0000002624668863
-->
# Subscribing to the Device Charging Status

This section describes how to subscribe to and unsubscribe from the charging status of a wearable. Following a successful subscription, the current charging status is returned when the charging status of a wearable changes. After unsubscription, the charging status is no longer returned.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section484944212315) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to subscribe to the device charging status. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the subscribeEvent method of the Device object to subscribe to the device charging status.
        let uuid = try await device.subscribeEvent(type: .chargeStatusChangedEvent) { eventData in
            print("Event report. Event: \(eventData.event), status: \(eventData.status)")
        }

        // The device charging status is successfully subscribed to.
        print("Succeeded in subscribing chargeStatusChangedEvent")
    } catch let err as IndustryError {
        // Failed to subscribe to the device charging status.
        print("Failed to subscribe chargeStatusChangedEvent. Code: \(err.code), message: \(err.message)")
    }
}
```

- Process the device charging status in the (**EventData -> Void**) closure. For a device charging status change, **eventData** contains the event type (specified by **event**) and device charging status (specified by **status**). 
```cpp
eventData example:
{
    event: "chargeStatusChangedEvent",
    status: 2
}
```
 
| Field | Value | Description |
| --- | --- | --- |
| status | 1 | Charging started. |
| 2 | Charging stopped. |  |
| 3 | Fully charged. |  |

- Call the [unsubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section686172218408) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to unsubscribe from the device charging status. 
```cpp
Task {
    do {
        // Call the unsubscribeEvent method of the Device object to unsubscribe from the device charging status.
        try await device.unsubscribeEvent(type: .chargeStatusChangedEvent, subscribeId: uuid)

        // The device charging status is successfully unsubscribed from.
        print("Succeeded in unsubscribing chargeStatusChangedEvent")
    } catch let err as IndustryError {
        // Failed to unsubscribe from the device charging status.
        print("Failed to unsubscribe chargeStatusChangedEvent. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** The UUID passed for unsubscription must be the same as that returned upon a successful subscription.
