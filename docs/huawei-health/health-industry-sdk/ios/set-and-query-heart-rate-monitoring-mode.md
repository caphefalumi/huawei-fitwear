<!--
  Title: Setting and Querying the Continuous Heart Rate Monitoring Mode
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-heart-rate-monitoring-mode-0000002594269408
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-heart-rate-monitoring-mode-0000002594269408
-->
# Setting and Querying the Continuous Heart Rate Monitoring Mode

This section describes how to set and query the continuous heart rate monitoring mode for a wearable. After continuous heart rate monitoring (smart mode) is enabled, the wearable will dynamically adjust the measurement frequency based on users' workout status and provide 24-hour smart heart rate monitoring. After continuous heart rate monitoring (real-time mode) is enabled, the wearable will provide 24-hour real-time heart rate monitoring. After continuous heart rate monitoring is disabled, the wearable will not automatically measure the heart rate. For a wearable that is connected for the first time, continuous heart rate monitoring (smart mode) is enabled by default.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setContinuousHeartRateMonitoringMode](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section24816144141) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the continuous heart rate monitoring mode. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()
        let realtimeMode = 2

        // Call the setContinuousHeartRateMonitoringMode method of the Device object to set the continuous heart rate monitoring mode.
        try await device.setContinuousHeartRateMonitoringMode(continuousHeartRateMonitoringMode: realtimeMode)

        // The continuous heart rate monitoring mode is set successfully.
        print("Succeeded in setting continuousHeartRateMonitoringMode")
    } catch let err as IndustryError {
        // Failed to set the continuous heart rate monitoring mode.
        print("Failed to set continuousHeartRateMonitoringMode. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getContinuousHeartRateMonitoringMode](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section152433162212) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the continuous heart rate monitoring mode. 
```cpp
Task {
    do {
        // Call the getContinuousHeartRateMonitoringMode method of the Device object to query the continuous heart rate monitoring mode.
        let mode = try await device.getContinuousHeartRateMonitoringMode()

        // The continuous heart rate monitoring mode is queried successfully.
        print("Succeeded in getting continuousHeartRateMonitoringMode, mode: \(mode)")
    } catch let err as IndustryError {
        // Failed to query the continuous heart rate monitoring mode.
        print("Failed to get continuousHeartRateMonitoringMode. Code: \(err.code), message: \(err.message)")
    }
}
```
