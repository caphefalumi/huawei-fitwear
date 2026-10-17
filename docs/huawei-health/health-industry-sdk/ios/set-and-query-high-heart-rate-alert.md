<!--
  Title: Setting and Querying the High Heart Rate Alert
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-high-heart-rate-alert-0000002624668865
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-high-heart-rate-alert-0000002624668865
-->
# Setting and Querying the High Heart Rate Alert

This section describes how to set and query the high heart rate alert switch state and alert threshold (unit: beats/min) for non-workout states on a wearable. After the alert switch is enabled, the wearable will generate a high heart rate alert when detecting that the heart rate is higher than the alert threshold for 10 consecutive minutes. After the alert switch is disabled, no high heart rate alert will be generated. For a wearable that is connected for the first time, the high heart rate alert switch is disabled by default.

> **Note:** To enable the high heart rate alert, you need to enable the continuous heart rate monitoring mode first. For details, please refer to [Setting and Querying the Continuous Heart Rate Monitoring Mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-heart-rate-monitoring-mode-0000002594269408). If the high heart rate alert is disabled but the alert threshold is set, the alert threshold will not be verified. In the query response, the high heart rate alert switch state is **false** and the alert threshold is the configured value. If the alert is disabled and the threshold is not set, the switch state is **false** and the threshold is **nil** in the query response.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setAlertSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section89289364016) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the high heart rate alert switch state and alert threshold. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Construct the parameters for setting the high heart rate alert switch state and alert threshold.
        let alertSetting = AlertSetting(switchValue: true, threshold: 120)

        // Call the setAlertSwitch method of the Device object to set the high heart rate alert switch state and alert threshold.
        try await device.setAlertSwitch(type: .highHeartRateAlert, alertSwitchValue: alertSetting)

        // The high heart rate alert switch state and alert threshold are set successfully.
        print("Succeeded in setting highHeartRateAlert")
    } catch let err as IndustryError {
        // Failed to set the high heart rate alert switch state and alert threshold.
        print("Failed to set highHeartRateAlert. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getAlertSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section17401123111313) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the high heart rate alert switch state and alert threshold. 
```cpp
Task {
    do {
        // Call the getAlertSwitch method of the Device object to query the high heart rate alert switch state and alert threshold.
        let alertSetting = try await device.getAlertSwitch(type: .highHeartRateAlert)

        // The high heart rate alert switch state and alert threshold are queried successfully.
        print("Succeeded in getting highHeartRateAlert, switchValue: \(alertSetting.switchValue), threshold: \(String(describing: alertSetting.threshold))")
    } catch let err as IndustryError {
        // Failed to query the high heart rate alert switch state and alert threshold.
        print("Failed to get highHeartRateAlert. Code: \(err.code), message: \(err.message)")
    }
}
```
