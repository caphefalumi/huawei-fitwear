<!--
  Title: Setting and Querying the Stand Reminder Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-stand-reminder-switch-0000002624549019
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-stand-reminder-switch-0000002624549019
-->
# Setting and Querying the Stand Reminder Switch State

This section describes how to set and query the stand reminder switch state of a wearable. After the switch is enabled, the wearable will generate a stand reminder if the user remains seated for one hour between 8:00 and 21:00 each day. After the switch is disabled, no stand reminder will be generated. For a wearable that is connected for the first time, the stand reminder switch is enabled by default.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setRemindSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section24381853174618) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the stand reminder switch state. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the setRemindSwitch method of the Device object to set the stand reminder switch state.
        try await device.setRemindSwitch(type: .standReminderSwitch, remindSwitchValue: true)

        // The stand reminder switch state is set successfully.
        print("Succeeded in setting standReminderSwitch")
    } catch let err as IndustryError {
        // Failed to set the stand reminder switch state.
        print("Failed to set standReminderSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getRemindSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section0593868401) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the stand reminder switch state. 
```cpp
Task {
    do {
        // Call the getRemindSwitch method of the Device object to query the stand reminder switch state.
        let switchValue = try await device.getRemindSwitch(type: .standReminderSwitch)

        // The stand reminder switch state is queried successfully.
        print("Succeeded in getting standReminderSwitch, switchValue: \(switchValue)")
    } catch let err as IndustryError {
        // Failed to query the stand reminder switch state.
        print("Failed to get standReminderSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```
