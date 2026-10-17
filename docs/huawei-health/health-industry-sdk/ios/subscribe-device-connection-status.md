<!--
  Title: Subscribing to the Device Connection Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-device-connection-status-0000002594109488
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-device-connection-status-0000002594109488
-->
# Subscribing to the Device Connection Status

Monitor the connection status of paired wearables only after subscribing to the device connection status.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section232815255518) method of the [IndustryService](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977) object to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object.
- Call the [subscribeConnectionStateChange](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section12792205320017) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object to subscribe to the device connection status. 
```cpp
// Import required modules.
import IndustrySDK

// Call the getDeviceManager method of the IndustryService object to obtain the DeviceManager object.
let deviceManager = IndustryService.getDeviceManager()

// Call the subscribeConnectionStateChange method of the DeviceManager object to subscribe to the device connection status.
let uuid = deviceManager.subscribeConnectionStateChange { state in
    print("deviceId: \(state.deviceId), connectionState: \(state.connectionState)")
}

// The device connection status is successfully subscribed to.
print("Succeeded in subscribing connection state")
```

- Call the [unsubscribeConnectionStateChange](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section888811301641) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section162022615492) object to unsubscribe from the device connection status. 
```cpp
// Call the unsubscribeConnectionStateChange method of the DeviceManager object to unsubscribe from the device connection status.
deviceManager.unsubscribeConnectionStateChange(subscribeId: uuid)

// The device connection status is successfully unsubscribed from.
print("Succeeded in unsubscribing connection state")
```
 > **Note:** The UUID passed for unsubscription must be the same as that returned upon a successful subscription.
