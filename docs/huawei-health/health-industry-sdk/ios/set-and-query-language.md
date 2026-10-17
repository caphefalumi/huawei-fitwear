<!--
  Title: Setting and Querying the Language
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-language-0000002624549017
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-language-0000002624549017
-->
# Setting and Querying the Language

This section describes how to set the display language of a wearable. For a wearable that is connected for the first time, the default language is the system language of the mobile device (iPhone).

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setLanguage](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section17734193313419) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the device language. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()
         
        // Call the setLanguage method of the Device object to set the device language.
        try await device.setLanguage(language: "zh-CN")

        // The device language is set successfully.
        print("Succeeded in setting language")
    } catch let err as IndustryError {
        // Failed to set the device language.
        print("Failed to set language. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getLanguage](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2669053132512) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the device language. 
```cpp
Task {    
    do {
        // Call the getLanguage method of the Device object to query the device language.
        let language = try await device.getLanguage()

        // The device language is queried successfully.
        print("Succeeded in getting language, language: \(language)")
    } catch let err as IndustryError {
        // Failed to query the device language.
        print("Failed to get language. Code: \(err.code), message: \(err.message)")
    }
}
```
