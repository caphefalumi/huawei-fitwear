<!--
  Title: Querying a Certificate Path
  Catalog: huaweihealth-Guides
  Document ID: query-cert-path-0000002594109486
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-cert-path-0000002594109486
-->
# Querying a Certificate Path

This section describes how to query the certificate path you have set.

- Import required modules.
- Call the [getCertPath](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section660165212614) method of [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) to query the certificate path. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Call the getCertPath method of IndustryService to query the certificate path.
        let path = try await IndustryService.getCertPath()

        // The certificate path is queried successfully.
        print("Succeeded in getting cert path, path: \(path)")
    } catch let err as IndustryError {
        // Failed to query the certificate path.
        print("Failed to get cert path. Code: \(err.code), message: \(err.message)")
    }
}
```
