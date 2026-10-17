<!--
  Title: Setting and Querying the Automatic Emotion/Stress Test Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-emotion-auto-monitor-switch-0000002624549035
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-emotion-auto-monitor-switch-0000002624549035
-->
# Setting and Querying the Automatic Emotion/Stress Test Switch State

This section describes how to set and query the automatic emotion/stress test switch state of a wearable. After the switch is enabled, the wearable will automatically measure the stress value, emotional status, and related features while the user is stationary. After the switch is disabled, the wearable will not automatically measure the stress value, emotion status, and related features. For a wearable that is connected for the first time, the automatic emotion/stress test switch is disabled by default.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setMonitorSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section125741385215) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the automatic emotion/stress test switch state. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the setMonitorSwitch method of the Device object to set the automatic emotion/stress test switch state.
        try await device.setMonitorSwitch(type: .emotionAutoMeasurementSwitch, monitorSwitchValue: true)

        // The automatic emotion/stress test switch state is set successfully.
        print("Succeeded in setting emotionAutoMeasurementSwitch")
    } catch let err as IndustryError {
        // Failed to set the automatic emotion/stress test switch state.
        print("Failed to set emotionAutoMeasurementSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getMonitorSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section10623588387) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the automatic emotion/stress test switch state. 
```cpp
Task {
    do {
        // Call the getMonitorSwitch method of the Device object to query the automatic emotion/stress test switch state.
        let switchValue = try await device.getMonitorSwitch(type: .emotionAutoMeasurementSwitch)

        // The automatic emotion/stress test switch state is queried successfully.
        print("Succeeded in getting emotionAutoMeasurementSwitch, switchValue: \(switchValue)")
    } catch let err as IndustryError {
        // Failed to query the automatic emotion/stress test switch state.
        print("Failed to get emotionAutoMeasurementSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```
