<!--
  Title: Subscribing to Heart Rate Alerts
  Catalog: huaweihealth-Guides
  Document ID: subscribe-heart-rate-alarm-0000002624668867
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-heart-rate-alarm-0000002624668867
-->
# Subscribing to Heart Rate Alerts

This section describes how to subscribe to and unsubscribe from the heart rate alerts of a wearable. Following a successful subscription, the heart rate alert information generated on the wearable is reported. After unsubscription, heart rate alert information is no longer reported.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section484944212315) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to subscribe to heart rate alerts. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the subscribeEvent method of the Device object to subscribe to heart rate alerts.
        let uuid = try await device.subscribeEvent(type: .heartRateAlarmEvent) { eventData in
            print("Event report. Event: \(eventData.event), status: \(eventData.status)")
        }

        // The heart rate alert information is successfully subscribed to.
        print("Succeeded in subscribing heartRateAlarmEvent")
    } catch let err as IndustryError {
        // Failed to subscribe to heart rate alert information.
        print("Failed to subscribe heartRateAlarmEvent. Code: \(err.code), message: \(err.message)")
    }
}
```

- Process the heart rate alert information in the (**EventData -> Void**) closure. For a heart rate alert, **eventData** contains the event type (specified by **event**) and heart rate alert type (specified by **status**). 
```cpp
eventData example:
{
    "event": "heartRateAlarmEvent",
    "status": 1
}
```
 
| Field | Value | Description |
| --- | --- | --- |
| status | 1 | Resting heart rate too high. |
| 2 | Resting heart rate too low. |  |

- Call the [unsubscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section686172218408) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to unsubscribe from heart rate alerts. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Call the unsubscribeEvent method of the Device object to unsubscribe from heart rate alerts.
        try await device.unsubscribeEvent(type: .heartRateAlarmEvent, subscribeId: uuid)

        // The heart rate alert information is successfully unsubscribed from.
        print("Succeeded in unsubscribing heartRateAlarmEvent")
    } catch let err as IndustryError {
        // Failed to unsubscribe from heart rate alert information.
        print("Failed to unsubscribe heartRateAlarmEvent. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** The UUID passed for unsubscription must be the same as that returned upon a successful subscription.
