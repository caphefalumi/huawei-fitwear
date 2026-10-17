<!--
  Title: Setting and Querying the Automatic SpO2 Measurement Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-automatic-spo2-measurement-switch-0000002624549033
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-automatic-spo2-measurement-switch-0000002624549033
-->
# Setting and Querying the Automatic SpO2 Measurement Switch State

This section describes how to set and query the automatic SpO2 measurement switch state. After the switch is enabled, the wearable will automatically measure SpO2 every 10 minutes while the user is stationary. After the switch is disabled, the wearable will stop automatic SpO2 measurement. For a wearable that is connected for the first time, the automatic SpO2 measurement switch is disabled by default.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setMonitorSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section125741385215) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the automatic SpO2 measurement switch state. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the setMonitorSwitch method of the Device object to set the automatic SpO2 measurement switch state.
        try await device.setMonitorSwitch(type: .automaticSpO2MeasurementSwitch, monitorSwitchValue: true)

        // The automatic SpO2 measurement switch state is set successfully.
        print("Succeeded in setting automaticSpO2MeasurementSwitch")
    } catch let err as IndustryError {
       // Failed to set the automatic SpO2 measurement switch state.
        print("Failed to set automaticSpO2MeasurementSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getMonitorSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section10623588387) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the automatic SpO2 measurement switch state. 
```cpp
Task {
    do {
        // Call the getMonitorSwitch method of the Device object to query the automatic SpO2 measurement switch state.
        let switchValue = try await device.getMonitorSwitch(type: .automaticSpO2MeasurementSwitch)

        // The automatic SpO2 measurement switch state is successfully queried.
        print("Succeeded in getting automaticSpO2MeasurementSwitch, switchValue: \(switchValue)")
     } catch let err as IndustryError {
        // Failed to query the automatic SpO2 measurement switch state.
        print("Failed to get automaticSpO2MeasurementSwitch. Code: \(err.code), message: \(err.message)")
    }
}
```
