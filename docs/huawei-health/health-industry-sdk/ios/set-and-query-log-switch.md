<!--
  Title: Setting and Querying the Log Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-log-switch-0000002624549041
  Updated: 2026-08-05 02:10:13
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-log-switch-0000002624549041
-->
# Setting and Querying the Log Switch State

This section describes how to set and query the log switch state of the Health Industry SDK. After the log switch is enabled, the SDK logs are automatically written to the local log file. After it is disabled, the SDK logs will not be written to the log file.

> **Note:** The log switch of the Health Industry SDK is enabled by default.

- Import the required module.
- Call the [setLogSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section108536311993) method of [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) to set the log switch state. 
```cpp
import IndustrySDK

Task {
    do {
        // Call the setLogSwitch method to set the log switch state.
        try await IndustryService.setLogSwitch(logSwitchValue: true)

        // The log switch state is set successfully.
        print("Succeeded in setting log switch")
    } catch let err as IndustryError {
        // Failed to set the log switch state.
        print("Failed to set log switch. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getLogSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section137838559133) method of [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) to query the log switch state. 
```cpp
Task {
    do {
        // Call the getLogSwitch method to query the log switch state.
        let switchValue = try await IndustryService.getLogSwitch()

        // The log switch state is queried successfully.
        print("Succeeded in getting log switch, switchValue: \(switchValue)")
    } catch let err as IndustryError {
        // Failed to query the log switch state.
        print("Failed to get log switch. Code: \(err.code), message: \(err.message)")
    }
}
```
