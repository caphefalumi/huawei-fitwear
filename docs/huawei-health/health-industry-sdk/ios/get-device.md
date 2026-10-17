<!--
  Title: Obtaining Connected Devices
  Catalog: huaweihealth-Guides
  Document ID: get-device-0000002594269394
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-device-0000002594269394
-->
# Obtaining Connected Devices

Obtain the currently connected devices.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section232815255518) method of the [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) object to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object.
- Call the [getDevice](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section0108184124418) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object to obtain the currently connected wearables. 
```cpp
import IndustrySDK

let deviceManager = IndustryService.getDeviceManager()
do {
    // Obtain connected devices.
    let device = try deviceManager.getDevice()
    print("Device ID: \(device.deviceId)")
    print("Device name: \(device.name)")
    print("Connection state: \(device.connectionState)")
} catch let err as IndustryError {
    print("Failed to get device. Code: \(err.code), message: \(err.message)")
}
```
