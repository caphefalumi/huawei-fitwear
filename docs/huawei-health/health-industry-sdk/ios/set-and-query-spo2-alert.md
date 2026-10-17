<!--
  Title: Setting and Querying the Abnormal SpO2 Alert
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-spo2-alert-0000002594269414
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-spo2-alert-0000002594269414
-->
# Setting and Querying the Abnormal SpO2 Alert

This section describes how to set and query the abnormal SpO2 alert switch state and alert threshold (in percentage). After the alert switch is enabled, the wearable will generate an abnormal SpO2 alert when detecting that the SpO2 value is lower than the alert threshold for three consecutive times. After the alert switch is disabled, no abnormal SpO2 alert will be generated. For a wearable that is connected for the first time, the abnormal SpO2 alert switch is disabled by default.

> **Note:** If you want to enable the abnormal SpO2 alert, automatic SpO2 measurement needs to be enabled first. For details, please refer to [Setting and Querying the Automatic SpO2 Measurement Switch State](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-automatic-spo2-measurement-switch-0000002624549033). If the abnormal SpO2 alert switch is disabled but the alert threshold is set, SpO2 values are not checked against the alarm threshold. In the query response, the abnormal SpO2 alert switch state is **false** and the alert threshold is the configured value. If the alert switch is disabled and the threshold is not set, the switch state is **false** and the threshold is **nil** in the query response.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setAlertSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section89289364016) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the abnormal SpO2 alert switch state and alert threshold. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Construct the parameters for setting the abnormal blood oxygen alert switch state and alert threshold.
        let alertSetting = AlertSetting(switchValue: true, threshold: 90)

        // Call the setAlertSwitch method of the Device object to set the abnormal blood oxygen alert switch state and alert threshold.
        try await device.setAlertSwitch(type: .spO2Alert, alertSwitchValue: alertSetting)

        // The abnormal SpO2 alert switch state and alert threshold are set successfully.
        print("Succeeded in setting spO2Alert")
    } catch let err as IndustryError {
        // Failed to set the abnormal SpO2 alert switch state and alert threshold.
        print("Failed to set spO2Alert. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getAlertSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section17401123111313) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the abnormal SpO2 alert switch state and alert threshold. 
```cpp
Task {
    do {
        // Call the getAlertSwitch method of the Device object to query the abnormal SpO2 alert switch state and alert threshold.
        let alertSetting = try await device.getAlertSwitch(type: .spO2Alert)

        // The abnormal SpO2 alert switch state and alert threshold are queried successfully.
        print("Succeeded in getting spO2Alert, switchValue: \(alertSetting.switchValue), threshold: \ (String(describing: alertSetting.threshold))")
    } catch let err as IndustryError {
        // Failed to query the abnormal SpO2 alert switch state and alert threshold.
        print("Failed to get spO2Alert. Code: \(err.code), message: \(err.message)")
    }
}
```
