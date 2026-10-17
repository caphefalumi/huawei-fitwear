<!--
  Title: Obtaining the List of Paired Devices Paired with the System via Bluetooth
  Catalog: huaweihealth-Guides
  Document ID: get-device-list-0000002624668853
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-device-list-0000002624668853
-->
# Obtaining the List of Paired Devices Paired with the System via Bluetooth

Obtain the list of industry wearables paired with the system via Bluetooth.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section232815255518) method of the [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) object to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object.
- Call the [getDeviceList](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1275193634915) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object to obtain the list of industry wearables paired with the system via Bluetooth. 
```cpp
import IndustrySDK

let deviceManager = IndustryService.getDeviceManager()

do {
    // Obtain the list of devices connected with the system via Bluetooth.
    let deviceList = try deviceManager.getDeviceList()
    for device in deviceList {
        print("Device: \(device.name), deviceId: \(device.deviceId), state: \(device.connectionState)")
    }
} catch let err as IndustryError {
    print("Failed to get device list. Code: \(err.code), message: \(err.message)")
}
```
