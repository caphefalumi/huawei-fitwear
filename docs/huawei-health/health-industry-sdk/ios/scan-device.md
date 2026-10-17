<!--
  Title: Scanning Wearables
  Catalog: huaweihealth-Guides
  Document ID: scan-device-0000002624668851
  Updated: 2026-08-05 02:10:13
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/scan-device-0000002624668851
-->
# Scanning Wearables

Scan for nearby industry wearables. After the scanning starts, the scanning API reports the discovered devices in real time. The scanning automatically ends after 10 seconds.

> **Note:** Before scanning, you need to obtain the Bluetooth and location permissions on the mobile device where the app runs. Please refer to [Adding Permissions](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-permission-0000002594109484) for how to dynamically apply for these permissions. If you are using a smart wearable that is already connected by another app, you need to go to **Settings** > **Bluetooth** on the iPhone, find the device, tap the **i** icon on the right, and select **Forget This Device**. Only then can the device be discovered by the industry app.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section232815255518) method of the [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) object to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object.
- Call the [scanDevice](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section3753115173613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object to initiate device scanning. 
```cpp
import IndustrySDK

let deviceManager = IndustryService.getDeviceManager()
Task {
    do {
        // Construct the scan filter parameter.
        let scanFilter = ScanFilter(type: .noFiltering, matcher: "")
        // Call the scanning API to start scanning.
        try await deviceManager.scanDevice(scanFilter: scanFilter) { device in
            print("Device found: \(device.name)")
            print("Device ID: \(device.deviceId)")
            print("RSSI: \(device.bluetoothRssi ?? 0)")
            print("Connection state: \(device.connectionState)")
        }
    } catch {
        print("Scan failed: \(error)")
    }
}
```

- Call the [stopScanDevice](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section659482174214) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object to stop device scanning. 
```cpp
deviceManager.stopScanDevice()
print("Stopped scanning device")
```
