<!--
  Title: Setting a Certificate Path
  Catalog: huaweihealth-Guides
  Document ID: set-cert-path-0000002624668849
  Updated: 2026-08-05 02:10:13
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-cert-path-0000002624668849
-->
# Setting a Certificate Path

After the certificate path is set for an industry app, the app reads the certificate content and accesses the HUAWEI Enterprise Manager (HEM) authentication address to verify permissions when connecting to a device. The app can connect to and pair with the device only after the verification is successful.

> **Note:** HEM is a mobile device management solution provided for you based on the powerful platform and hardware of Huawei. You can use it to check device permissions. Test certificates have a finite validity period. After an app's test certificate is changed to a commercial certificate, remind app users to perform pairing and connection again.

- Add a certificate to **Copy Bundle Resources** on the **Build Phases** tab page of the app target.
- Import required modules.
- Call the [setCertPath](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section23791051152312) method of [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) to set the certificate path. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Call the setCertPath method of IndustryService to set the certificate path.
        try await IndustryService.setCertPath(cerPath: "XXXX")

        // The certificate path is set successfully.
        print("Succeeded in setting cert path")
    } catch let err as IndustryError {
        // Failed to set the certificate path.
        print("Failed to set cert path. Code: \(err.code), message: \(err.message)")
    }
}
```
