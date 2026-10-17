<!--
  Title: Setting and Querying the TruSleep Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-trusleep-switch-0000002594109506
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-trusleep-switch-0000002594109506
-->
# Setting and Querying the TruSleep Switch State

This section describes how to set the TruSleep switch state of a wearable. After the switch is enabled, the wearable will continuously monitor users' sleep and breathing quality in real time throughout the sleep period. After the switch is disabled, the wearable will no longer monitor sleep and breathing quality. For a wearable that is connected for the first time, the TruSleep switch is disabled by default.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setMonitorSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section125741385215) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the TruSleep switch state. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the setMonitorSwitch method of the Device object to set the TruSleep switch state.
        try await device.setMonitorSwitch(type: .TruSleepSwitch, monitorSwitchValue: true)

        // The TruSleep switch state is set successfully.
        print("Succeeded in setting TruSleepSwitch")
    } catch let err as IndustryError {
        // Failed to set the TruSleep switch state.
        print("Failed to set TruSleepSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getMonitorSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section10623588387) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the TruSleep switch state. 
```cpp
Task {
    do {
        // Call the getMonitorSwitch method of the Device object to query the TruSleep switch state.
        let switchValue = try await device.getMonitorSwitch(type: .TruSleepSwitch)

        // The TruSleep switch state is queried successfully.
        print("Succeeded in getting TruSleepSwitch, switchValue: \(switchValue)")
    } catch let err as IndustryError {
        // Failed to query the TruSleep switch state.
        print("Failed to get TruSleepSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```
