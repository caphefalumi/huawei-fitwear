<!--
  Title: Querying Available Wearable Devices
  Catalog: connectivity-Guides
  Document ID: check-availabla-dev-ios-0000001921237861
  Updated: 2025-10-13 02:54:14
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/check-availabla-dev-ios-0000001921237861
-->
# Querying Available Wearable Devices

Wear Engine can provide the API for querying whether users have available wearable devices for use (wearable devices that support Wear Engine capabilities). Before obtaining the device list, apply for the [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) permission from the user on the phone (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/request-user-authorization-ios-0000001920933293)), otherwise you may fail to obtain the device list.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section81891233142218) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [WESDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesdeviceclient-0000001897479342) object.
- Call [getCommonDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesdeviceclient-class-0000001937982749#section16552950197) to query the list of available wearable devices. 
```cpp
HiWear.getDeviceClient().getCommonDevices { status, deviceArr in
    if status != .WESErrorCodeSuccess {
        // Fails to obtain the device list. Error code: status.rawValue
        return
    }
    guard let deviceArr else {
        // The device list is null.
        return
    }
    guard deviceArr.first != nil else {
        //The first device in the obtained list is null.
        return
    }
    var deviceString = ""
    var tag = 0
    for device in deviceArr {
        let deviceDescription :String = device.description
        deviceString.append("device<\(tag)>:\(deviceDescription),\n")
        tag += 1
    }
    //The obtained device list is deviceString.
}
```

> **Note:** The wearable device list will be cached when you [apply for wearable device permissions from the user](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/request-user-authorization-ios-0000001920933293#section738754382). If the wearable device information changes, you need to call the API for [applying for wearable device permissions](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/request-user-authorization-ios-0000001920933293#section738754382) again to refresh the cache. The wearable device list returned by the API includes watches both connected to and disconnected from the Huawei Health app, but not any watches that do not support the Wear Engine SDK for iOS. If the wearable device list returned by the API is empty, it could be due to incompatibility with the Wear Engine SDK for iOS on the user's watches.

#### Connecting to a Device

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section81891233142218) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [WESDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesdeviceclient-0000001897479342) object.
- Call [connect](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesdeviceclient-class-0000001937982749#section161612521497) to connect to a specified device. 
```cpp
let deviceClient: WESDeviceClient = HiWear.getDeviceClient()
// currentDevice indicates the wearable device queries by the API above.
deviceClient.connect(currentDevice) { status, connectStatus in
    if status != .WESErrorCodeSuccess {
        // Connection to the wearable device fails.
    }
    if status == .WESErrorCodeSuccess {
        // Connection to the wearable device is successful.
    }
}
```

#### Checking the Device Connection Status

After the device is successfully connected, call **getCurrentDevices** to obtain the currently connected device. You are advised to use the device obtained here as the parameter when calling other APIs.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section81891233142218) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [WESDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesdeviceclient-0000001897479342) object.
- Call the [getCurrentDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesdeviceclient-class-0000001937982749#section6464173116407) method to obtain the paired device. 
```cpp
let currentDevice = HiWear.getDeviceClient().getCurrentDevices()
let deviceConnected = currentDevice?.connectState == .stateConnected ? "Connected" : "Not connected"
```

#### Subscribing to the Connection Status

- Obtain the paired device.
- Call the [getMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section7710184710415) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [WESMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesmonitorclient-0000001897319434) object.
- Call [subscribeStatus](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesmonitorclient-class-0000001898103114#section16552950197) to subscribe to changes to the device connection status. 
```cpp
let device = HiWear.getDeviceClient().getCurrentDevices() 
HiWear.getMonitorClient().subscribeStatus(of: device) { status, connectStatus in 
    if status.rawValue == 0 && connectStatus.rawValue == 0 {
        // Subscription successful.
    } else {
        //The connection status is connectStatus.rawValue.
    } 
}
```

#### Unsubscribing from the Connection Status

- Obtain the paired device.
- Call the [getMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section7710184710415) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [WESMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesmonitorclient-0000001897319434) object.
- Call [unsubscribeStatus](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesmonitorclient-class-0000001898103114#section161612521497) to unsubscribe from changes to the device connection status. 
```cpp
let device = HiWear.getDeviceClient().getCurrentDevices()
HiWear.getMonitorClient().unsubscribeStatus(of: device) { 
    status, connectStatus in
    // Unsubscription successful.
}
```
