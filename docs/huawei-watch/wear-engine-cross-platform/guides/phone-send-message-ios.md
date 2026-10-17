<!--
  Title: App-to-App Message Communications
  Catalog: connectivity-Guides
  Document ID: phone-send-message-ios-0000001875158886
  Updated: 2026-05-29 06:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/phone-send-message-ios-0000001875158886
-->
# App-to-App Message Communications

This API is used to establish the communications channel between your phone app and wearable app, to receive and send packet messages and files customized by your app. This makes the interaction between the phone app and its wearable counterpart a full-fledged reality, providing the distributed scenarios and experience for your users. For example, a phone app sends an audio file to the wearable app, to play music on the wearable app; the phone app sends a pause command, to pause the music playback and the like on the wearable device.

Before sending or receiving messages, apply for the [DEVICE_MANAGER](#EN-US_TOPIC_0000001875158886__EN-US_TOPIC_0000001059433005__DEVICE_MANAGER) permission from the user on the phone (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/request-user-authorization-ios-0000001920933293)), otherwise you may not be able to call the corresponding API.

#### Checking Whether the App Has Been Installed on the Wearable Device

- Refer to [Querying Available Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861) to obtain the paired device list and select the device for communications.
- Call the [getP2PClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section124399485412) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [P2PClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) object.
- Call the [isAppInstalled](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesp2pclient-class-0000001897319430#section459201316365) method to check whether the specified app has been installed. 
```cpp
HiWear.getP2PClient().isAppInstalled(currentDevice, targetPkgName: "com.xxx" , srcPkgName: "com.yyy") { status, data in
    if (status == .WESErrorCodeSuccess) {
        let dataString :String = data ?? ""
        // The app installation status is successfully queried and is indicated by dataString.
    } else {
        // Fails to query the app installation status. Error code: status.rawValue
    }
}
```

#### Obtaining the Version Number of the App on the Wearable Device

- Refer to [Querying Available Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861) to obtain the paired device list and select the device for communications.
- Call the [getP2PClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section124399485412) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [P2PClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) object.
- Call the [getAppVersion](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesp2pclient-class-0000001897319430#section156970158362) method to obtain the app version number of a specified device. 
```cpp
HiWear.getP2PClient().getAppVersion(currentDevice, targetPkgName: "com.xxx" , srcPkgName: "com.yyy") { status, data in
    if (status == .WESErrorCodeSuccess) {
        var dataString :String = data ?? ""
        if data == "-1" {
            dataString = "Not installed"
        }
        // The app version number is successfully queried and is indicated by dataString.
    } else {
        // Fails to query the app version. Error code: status.rawValue
    }
}
```

#### Checking Whether the Wearable App is Running

Before sending a P2P message, you can use the **ping** method to check whether your phone app can communicate with the wearable app.

- Refer to [Querying Available Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861) to obtain the paired device list and select the device for communications.
- Call the [getP2PClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section124399485412) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [P2PClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesp2pclient-0000001897479334) object.
- Call the [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesp2pclient-class-0000001897319430#section229118515360) method and specify the bundle name of your wearable app to be communicated with using the **ping** method. (This step is optional. If the bundle name is not specified, the bundle name of your phone app will be used by default.)
- Call the **ping** method to check whether your wearable app is connected. 
```cpp
HiWear.getP2PClient().ping(currentDevice, srcPkgName: "com.xxx", destPkgName:
    "com.yyy") { status in
    if status == .WESErrorCodeP2PWatchAPPRunning {
        // The ping operation succeeds.
    } else {
        // The ping operation fails. Error code: status.rawValue
    }
}
```

> **Note:** For the ping API, the Wear Engine SDK for iOS only allows for using the **ping** method on the phone to start a watch-based app, but not using the **ping** method on the watch to start a phone-based app. After the watch-based app is started using the **ping** method, the app needs to register a message listener to receive messages from the phone. If you want to send a message from the phone-based app to the watch-based app immediately, it is recommended that you wait until the watch-based app is started before sending a message to the phone-based app. Ensure that the watch can receive messages properly, and then send messages from the phone.

#### Sending P2P Messages from Your Phone App

The maximum size of a message is 1 KB. If the length of a message exceeds the limit, divide the message into several packets.

If the phone app is able to send messages, the wearable app must support receiving these messages.

- JS: [Receiving P2P Messages or Files from Your Phone App](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/send-message-0000001052460491#section1361217411408)
- Java: [Receiving P2P Messages or Files from Your Phone App](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/send-message-0000001052540469#section1361217411408)

- Refer to [Querying Available Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861) to obtain the paired device list and select the device for communications.
- Create a **WESIdentityInfo** object for the message sender, and specify the phone app bundle name and fingerprint. The fingerprint is used to verify the app information on the watch side. iOS apps do not have fingerprint information. You can enter any text as the fingerprint.
- Create a **WESIdentityInfo** object for the message recipient, and specify the wearable app bundle name and fingerprint.

- Create a **WESP2PMessage** object to construct the message to be sent.
- Create a **WESP2PData** object to configure whether the message is of the TLV format.
- Call the **init** method of **TLVDataCmm** to construct data. Create a **TLVDataCmm** object and construct data in TLV format.
- Assign the data in TLV format to the message.
- Call the **getP2PClient** method in **HiWear** to obtain the **P2PClient** object. Call the **send** method to send short messages from your phone app to the wearable app. The callback parameter is used to return the message sending result.
- The **WearEngineServerErrorCode status** parameter is used to [return the sending result](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/errocode-0000001054450278#section394183995410). **WESErrorCodeCommSuccess** indicates success, and other error codes indicate failure.

```cpp
@objc func sendDataBtnAction() {
    sendDataBtn.isSelected = !sendDataBtn.isSelected
    // Model conversion.
    let srcInfo = WESIdentityInfo()
    srcInfo.mPackageName = "XXXX" // Bundle name of the source app.
    srcInfo.mFingerPrint = "YYYY" // Fingerprint of the source app.
 
    let destInfo = WESIdentityInfo();
    destInfo.mPackageName = "XXXX" // Bundle name of the target app.
    destInfo.mFingerPrint = "YYYY" // Fingerprint of the target app.
 
    let message = WESP2PMessage();
    message.type = WESP2PMessageType.data;
 
    let wesP2PData = WESP2PData()
    wesP2PData.isTLVFormat = false
 
    let unitIsOpen = "XXXX" // Transmitted data.
    let tlv = TLVDataCmm.init(0, value: unitIsOpen.data(using: .utf8))
    let tlvData = tlv?.value ?? NSMutableData()
 
    let rootCmm = TLVDataCmm(type: 0x07, withLen: Int32(tlvData.count))
    let rootCmmData = rootCmm?.tlvToData() ?? Data()
 
    let tmpPayloadData = NSMutableData.init(data: rootCmmData)
    tmpPayloadData.append(tlvData as Data)
    wesP2PData.payloadData = tmpPayloadData.copy() as? Data
    message.p2pData = wesP2PData.copy() as? WESP2PData
    HiWear.getP2PClient().send(self.currentDevice, message: message, srcInfo: srcInfo, 
        destInfo: destInfo) { status, progress in
        if status == .WESErrorCodeCommSuccess {
            // P2P transmission is successful.
        } else {
            // P2P transmission fails. Error code: status.rawValue
        }
    }
}
```

#### Receiving P2P Messages Sent from Your Wearable App

Create a listener for the P2P message sent from your wearable app.

- Refer to [Querying Available Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861) to obtain the paired device list and select the device for communications.
- Create a **WESIdentityInfo** object for the message sender, and specify the wearable app bundle name and fingerprint.
- Create a **WESIdentityInfo** object for the message recipient, and specify the phone app bundle name and fingerprint.
- Call the **getP2pClient** method in **HiWear** to obtain the **P2pClient** object, and call **registerReceiver** to register a listener. 
```cpp
let srcInfo = WESIdentityInfo()
srcInfo.mPackageName = "XXXX" // Bundle name of the source app.
srcInfo.mFingerPrint = "YYYY" // Fingerprint of the source app.
let destInfo = WESIdentityInfo()
destInfo.mPackageName = "XXXX" // Bundle name of the target app.
destInfo.mFingerPrint = "YYYY" // Fingerprint of the target app.
receiverCallback = {status, message in
    if status != .WESErrorCodeSuccess {
        // Fails to register the listener. Error code: status.rawValue
        return
    }
    if (status == .WESErrorCodeSuccess && message == nil) {
        // The listener is successfully registered. Package name: destInfo.mPackageName; fingerprint: destInfo.mFingerPrint
    }
    if (message != nil) {
        let response = message?.data
        let responseString :String = String.init(data: response ?? Data() , encoding: .utf8) ?? ""
        if (responseString.count > 0) {
            // Received P2P message: responseString
        } else {
            let string = message?.data.toHexString() ?? ""
            // Received P2P message: string
        }
    }}
HiWear.getP2PClient().registerReceiver(currentDevice, srcInfo: srcInfo, destInfo: destInfo, receiverCallback: receiverCallback)
```

#### Unregistering the Listener for P2P Messages on Wearable Devices

Unregister the listener for P2P messages.

- Refer to [Querying Available Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861) to obtain the paired device list and select the device for communications.
- Create a **WESIdentityInfo** object for the message sender, and specify the wearable app bundle name and fingerprint.
- Create a **WESIdentityInfo** object for the message recipient, and specify the phone app bundle name and fingerprint.
- Call the **getP2pClient** method in **HiWear** to obtain the **P2pClient** object, and call **unRegisterReceiver** to unregister the listener. 
```cpp
let srcInfo = WESIdentityInfo()
srcInfo.mPackageName = "XXXX" // Bundle name of the source app.
srcInfo.mFingerPrint = "YYYY" // Fingerprint of the source app.
let destInfo = WESIdentityInfo()
destInfo.mPackageName = "XXXX" // Bundle name of the target app.
destInfo.mFingerPrint = "YYYY" // Fingerprint of the target app.
HiWear.getP2PClient().unRegisterReceiver(currentDevice, srcInfo: srcInfo, destInfo: destInfo) { status, message in
    if status != .WESErrorCodeSuccess {
        // Fails to unregister the listener. Error code: status.rawValue
        return
    }
    if (status == .WESErrorCodeSuccess) {
        // The listener is successfully unregistered. Package name: destInfo.mPackageName; fingerprint: destInfo.mFingerPrint
    }
}
```

> **Note:** The iOS Wear Engine SDK only supports P2P message communications between the phone and the watch, but not file transfers.
