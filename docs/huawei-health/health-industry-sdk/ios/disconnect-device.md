<!--
  Title: Disconnecting a Device
  Catalog: huaweihealth-Guides
  Document ID: disconnect-device-0000002594269396
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/disconnect-device-0000002594269396
-->
# Disconnecting a Device

Disconnect from a Bluetooth-connected wearable.

- After the device is disconnected, it enters the disconnected status. The industry app can monitor the device status change by registering a connection status listener.
- After the device is disconnected, it is still in the paired device list of the phone's Bluetooth system. You can call the [connect](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section10173244192617) method to reconnect to the device.
- Disconnecting a device only disconnects the Bluetooth connection. The local settings configured by the user will not be deleted.

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [disconnect](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section3165124083114) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to disconnect the device. 
```cpp
import IndustrySDK

Task {
    do {
        try await device.disconnect()
        print("Succeeded in disconnecting device")
    } catch let err as IndustryError {
        print("Failed to disconnect device. Code: \(err.code), message: \(err.message)")
    }
}
```
