<!--
  Title: Deleting a Wearable
  Catalog: huaweihealth-Guides
  Document ID: delete-device-0000002594109490
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/delete-device-0000002594109490
-->
# Deleting a Wearable

Delete a paired wearable.

- If the device to be deleted is currently connected, it will be disconnected first.
- Deleting a device will clear all event subscriptions related to the device and the device-related switch settings stored locally by the SDK.
- After deleting a device, you can reconnect to it in either of the following ways: After a device is deleted, it is still in the list of paired devices in the Bluetooth system of your phone. Call the [getDeviceList](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1275193634915) method to obtain the list of connected devices and then select the device required for connection.
- To rescan for a device, you need to ignore the device in the Bluetooth settings of your phone.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section232815255518) method of the [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) object to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object.
- Call the [deleteDevice](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section12179115195011) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object to delete a device. 
```cpp
import IndustrySDK

let deviceManager = IndustryService.getDeviceManager()
Task {
    do {
        try await deviceManager.deleteDevice(deviceId: "ABC123")
        print("Succeeded in deleting device")
    } catch let err as IndustryError {
        print("Failed to delete device. Code: \(err.code), message: \(err.message)")
    }
}
```
