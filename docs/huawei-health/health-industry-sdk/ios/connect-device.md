<!--
  Title: Connecting to a Wearable
  Catalog: huaweihealth-Guides
  Document ID: connect-device-0000002624549015
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/connect-device-0000002624549015
-->
# Connecting to a Wearable

Connect to a wearable.

> **Note:** When a new device is connected, if an existing device is connected, the existing device will be automatically disconnected. If you switch to a different account in the industry app and the wearable has not been restored to its factory settings, a dialog box will be displayed on the wearable when you try to connect the industry app to the wearable. The wearable can only be added after it is restored to its factory settings. After the restoration, go to **Settings** > **Bluetooth**, find the device, tap the **i** icon on the right, and select **Forget This Device**.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section232815255518) method of the [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) object to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object.
- Call the [scanDevice](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section3753115173613) API to obtain the list of wearables or call the [getDeviceList](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1275193634915) method to obtain the list of wearables connected to the system, and select the device to be operated from the device list.
- Call the [connect](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section10173244192617) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to connect to the device. 
```cpp
import IndustrySDK

let deviceManager = IndustryService.getDeviceManager()
Task {
    do {
        // Construct the scan filter parameter.
        let scanFilter = ScanFilter(type: .noFiltering, matcher: "")
        try await deviceManager.scanDevice(scanFilter: scanFilter) { device in
            // Connect to a specified device.
            try await device.connect()
        }
    } catch let err as IndustryError {
        print("Failed to scan device. Code: \(err.code), message: \(err.message)")
    }
}
```
