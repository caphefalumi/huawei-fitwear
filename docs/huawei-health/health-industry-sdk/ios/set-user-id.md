<!--
  Title: Setting a User Account
  Catalog: huaweihealth-Guides
  Document ID: set-user-id-0000002624549013
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-user-id-0000002624549013
-->
# Setting a User Account

Set a user account for a paired device. If this API is not called to set a user account, the SDK generates a random user account and delivers it to the device.

- This method does not immediately deliver the user account to the device. Instead, it delivers the user account to the device when the [device is connected](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/connect-device-0000002624549015).
- When the industry SDK connects to a device with different user accounts, the device needs to be restored to factory settings first.

- Import required modules.
- Call the [setUserId](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section935819365181) method of [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) to set a user account for the paired device. 
```cpp
import IndustrySDK

Task {
    do {
        let uId = "123456"
        try await IndustryService.setUserId(userId: uId)
    } catch let err as IndustryError {
        print("Failed to set user id. Code: \(err.code), message: \(err.message)")
    }
}
```
