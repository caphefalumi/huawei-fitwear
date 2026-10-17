<!--
  Title: Obtaining the Log Path
  Catalog: huaweihealth-Guides
  Document ID: get-log-path-0000002594269422
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-log-path-0000002594269422
-->
# Obtaining the Log Path

This section describes how to obtain the path where the Health Industry SDK log file is stored.

- Import the required module.
- Call the [getIndustryLog](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section16440688163) method of [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) to obtain the log path. 
```cpp
import IndustrySDK

Task {
    do {
        // Call the getIndustryLog method to obtain the log path.
        let logPath = try await IndustryService.getIndustryLog()

        // The log path is obtained successfully.
        print("Succeeded in getting log path, path: \(logPath)")
    } catch let err as IndustryError {
        // Failed to obtain the log path.
        print("Failed to get log path. Code: \(err.code), message: \(err.message)")
    }
}
```
