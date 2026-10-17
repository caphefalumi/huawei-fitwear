<!--
  Title: Deleting a Certificate Path
  Catalog: huaweihealth-Guides
  Document ID: delete-cert-path-0000002624549011
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/delete-cert-path-0000002624549011
-->
# Deleting a Certificate Path

This section describes how to delete the certificate path you have set.

- Import required modules.
- Call the [deleteCertPath](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1861714117295) method of [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) to delete the certificate path. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Call the deleteCertPath method of IndustryService to delete the certificate path.
        try await IndustryService.deleteCertPath()

        // The certificate path is deleted successfully.
        print("Succeeded in deleting cert path")
    } catch let err as IndustryError {
        // Failed to delete the certificate path.
        print("Failed to delete cert path. Code: \(err.code), message: \(err.message)")
    }
}
```
