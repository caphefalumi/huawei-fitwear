<!--
  Title: Setting and Querying the Unit System
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-unit-0000002594269398
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-unit-0000002594269398
-->
# Setting and Querying the Unit System

This section describes how to set and query the unit system of fitness data on a wearable device. During workout, the wearable displays fitness data according to the set unit system. (For example, if outdoor running is started on the wearable, the distance unit will be shown as km when the unit system is set to metric, and as mi when the unit system is set to imperial.) For a wearable that is connected for the first time, the default unit system is the system unit system of the mobile device (iPhone).

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setUnit](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section16609135823814) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set the device unit system. 
```cpp
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Call the setUnit method of the Device object to set the device unit system.
        try await device.setUnit(unit: .metric)

        // The device unit system is set successfully.
        print("Succeeded in setting unit")
    } catch let err as IndustryError {
        // Failed to set the device unit system.
        print("Failed to set unit. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getUnit](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section13655903016) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query the device unit system. 
```cpp
Task {
    do {
        // Call the getUnit method of the Device object to query the device unit system.
        let unit = try await device.getUnit()

        // The device unit system is queried successfully.
        print("Succeeded in getting unit, unit: \(unit)")
    } catch let err as IndustryError {
        // Failed to query the device unit system.
        print("Failed to get unit. Code: \(err.code), message: \(err.message)")
    }
}
```
