<!--
  Title: Setting and Querying the Raise-to-Wake Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-raise-to-wake-switch-0000002594109494
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-raise-to-wake-switch-0000002594109494
-->
# Setting and Querying the Raise-to-Wake Switch State

This section describes how to set and query the raise-to-wake switch state of a wearable. After the switch is enabled, the wearable will automatically wake the screen when the user raises their wrist. After the switch is disabled, the wearable will not automatically wake the screen when the user raises their wrist. For a wearable that is connected for the first time, the raise-to-wake switch is enabled by default.

After the SDK sets the raise-to-wake switch state, it stores the switch state locally. When querying the switch state, the SDK reads the switch state from the local storage. If the user changes the raise-to-wake switch state in the system settings of the wearable, the SDK will return an incorrect query result.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setRemindSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section24381853174618) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the raise-to-wake switch state. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the setRemindSwitch method of the Device object to set the raise-to-wake switch state.
        try await device.setRemindSwitch(type: .raiseToWakeSwitch, remindSwitchValue: true)

        // The raise-to-wake switch state is set successfully.
        print("Succeeded in setting raiseToWakeSwitch")
    } catch let err as IndustryError {
        // Failed to set the raise-to-wake switch state.
        print("Failed to set raiseToWakeSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getRemindSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section0593868401) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the raise-to-wake switch state. 
```cpp
Task {
    do {
        // Call the getRemindSwitch method of the Device object to query the raise-to-wake switch state.
        let switchValue = try await device.getRemindSwitch(type: .raiseToWakeSwitch)

        // The raise-to-wake switch state is queried successfully.
        print("Succeeded in getting raiseToWakeSwitch, switchValue: \(switchValue)")
    } catch let err as IndustryError {
        // Failed to query the raise-to-wake switch state.
        print("Failed to get raiseToWakeSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```
