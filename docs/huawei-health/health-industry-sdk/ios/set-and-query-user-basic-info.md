<!--
  Title: Setting and Querying Basic User Information
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-user-basic-info-0000002594109492
  Updated: 2026-08-05 02:10:13
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-user-basic-info-0000002594109492
-->
# Setting and Querying Basic User Information

This section describes how to set and query basic user information of a wearable, including the date of birth, gender, height, and weight. After the basic user information is set, the wearable can provide more accurate health monitoring services.

> **Note:** If the user has not set any heart rate zone, a default heart rate zone will be set during basic user information configuration. The maximum heart rate is calculated as 220 minus the user's age. If the result is less than 100, the maximum heart rate is 100. The heart rate zone values are sequentially defined as 100%, 90%, 80%, 70%, 60%, and 50% of the maximum heart rate, with each value rounded to the nearest integer.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setUserBasicInfo](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section644231935811) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set basic user information. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Construct basic user information.
        let userBasicInfo = IndustryService.UserBasicInfo(
            dateOfBirth: "20000101",
            gender: .male,
            height: 175,
            weight: 70
        )

        // Call the setUserBasicInfo method of the Device object to set basic user information.
        try await device.setUserBasicInfo(userBasicInfo: userBasicInfo)
     
        // Basic user information is set successfully.
        print("Succeeded in setting user basic info")
    } catch let err as IndustryError {
        // Failed to set basic user information.
        print("Failed to set user basic info. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getUserBasicInfo](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1312113259293) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query basic user information. 
```cpp
Task {
    do {
        // Call the getUserBasicInfo method of the Device object to query basic user information.
        let userBasicInfo = try await device.getUserBasicInfo()

        // Basic user information is queried successfully.
        print("Succeeded in getting user basic info, dateOfBirth: \(userBasicInfo.dateOfBirth), gender: \(userBasicInfo.gender), height: \(userBasicInfo.height),   weight: \(userBasicInfo.weight)")
    } catch let err as IndustryError {
        // Failed to query basic user information.
        print("Failed to get user basic info. Code: \(err.code), message: \(err.message)")
    }
}
```
