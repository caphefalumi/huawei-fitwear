<!--
  Title: Setting and Querying the Notification Push Switch
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-notification-push-switch-0000002624668857
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-notification-push-switch-0000002624668857
-->
# Setting and Querying the Notification Push Switch

This section describes how to set and query the status of the switch for pushing notifications from mobile devices (iPhones) to wearables. After the switch is enabled, the notifications received by the mobile device will be pushed to the wearable. After the switch is disabled, the notifications received by the mobile device will not be pushed to the wearable. For a wearable that is connected for the first time, the notification push switch is disabled by default.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setNotificationPushSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section990770181815) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the notification push switch status. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the setNotificationPushSwitch method of the Device object to set the notification push switch status.
        try await device.setNotificationPushSwitch(notificationPushSwitch: true)

        // The notification push switch status is set successfully.
        print("Succeeded in setting notification push switch")
    } catch let err as IndustryError {
        // Failed to set the notification push switch status.
        print("Failed to set notification push switch. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getNotificationPushSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1422183018574) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the notification push switch status. 
```cpp
Task {
    do {
        // Call the getNotificationPushSwitch method of the Device object to query the notification push switch status.
        let switchValue = try await device.getNotificationPushSwitch()

        // The notification push switch status is queried successfully.
        print("Succeeded in getting notification push switch, switchValue: \(switchValue)")
    } catch let err as IndustryError {
        // Failed to query the notification push switch status.
        print("Failed to get notification push switch. Code: \(err.code), message: \(err.message)")
    }
}
```
