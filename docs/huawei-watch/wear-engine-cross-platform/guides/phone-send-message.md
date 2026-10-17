<!--
  Title: App-to-App Message Communications
  Catalog: connectivity-Guides
  Document ID: phone-send-message-0000001051059209
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/phone-send-message-0000001051059209
-->
**
# App-to-App Message Communications

This API is used to establish the communications channel between your phone app and wearable app, to receive and send packet messages and files customized by your app. This makes the interaction between the phone app and its wearable counterpart a full-fledged reality, providing the distributed scenarios and experience for your users. For example, a phone app sends an audio file to the wearable app, to play music on the wearable app; the phone app sends a pause command, to pause the music playback and the like on the wearable device.

Before sending or receiving messages, apply for the [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) permission from the user on the phone (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/requesting-user-authorization-0000001050819181)), otherwise you may not be able to call the corresponding API.

> **Note:** Before using this function, ensure that you have your app installed on the wearable device. (Refer to the [lite wearable app development guide](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V3/lite-wearable-overview-0000001197577411-V3) or [wearable app development guid](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V3/wearable-overview-0000001052065839-V3).) The phone app and wearable app must be launched at the same time. If the phone app is launched while the wearable app is not, the phone app can launch the latter by using the ping method. In this case, if you want to send a message to the wearable app immediately, it is recommended that you send a message to the phone app after the wearable app initialization is complete, and wait until the phone app receives the message before performing the next step.

#### Checking Whether the App Has Been Installed on the Wearable Device

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.

- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) object.
- Call the [isAppInstalled](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#section12211338104010) method to check whether the specified app has been installed. 
```cpp
// Step 2: Obtain the P2P communication object.
P2pClient p2pClient = HiWear.getP2pClient(this);
// Specify the wearable app bundle name (bundleName).
String devicePkgName = "com.*.*";

// Step 3: Check whether your app has been installed on the wearable device.
if (connectedDevice != null && connectedDevice.isConnected()) {
    p2pClient.isAppInstalled(connectedDevice, devicePkgName)
        .addOnSuccessListener(new OnSuccessListener<Boolean>() {
            @Override
            public void onSuccess(Boolean isAppInstalled) {
                // The related logic to check whether the installation task of the app on the specified device is successfully executed.
                // true: installed, false: uninstalled
            }
        })
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                // The related logic to check whether the installation task of the app on the specified device fails to be executed.
            }
        });
}
```

#### Obtaining the Version Number of the App on the Wearable Device

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.

- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) object.
- Call the [getAppVersion](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#section1545919591033) method to obtain the app version number of a specified device. 
```cpp
// Step 2: Obtain the P2P communication object.
P2pClient p2pClient = HiWear.getP2pClient(this);
// Specify the wearable app bundle name (bundleName).
String devicePkgName = "com.*.*";

// Step 3: Obtain the version number of your app on the wearable device.
if (connectedDevice != null && connectedDevice.isConnected()) {
    p2pClient.getAppVersion(connectedDevice, devicePkgName)
        .addOnSuccessListener(new OnSuccessListener<Integer>() {
            @Override
            public void onSuccess(Integer versionCode) {
// The logic used when the task of obtaining the app version number on the device is successfully executed.
                // -1: The app has not been installed.
            }
        })
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
// The logic used when the task of obtaining the app version number on the device fails to be executed.
            }
        });
}
```

#### Checking Whether the Wearable App is Running

Before sending a P2P message, you can use the ping method to check whether your phone app can communicate with the wearable app.

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerPkgName-java_lang_String-) method and specify the bundle name (bundleName) of your wearable app to be communicated with using the ping method. (This step is optional. If the bundle name is not specified, the bundle name of your phone app will be used by default.)
- Call the [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__ping-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_PingCallback-) method to check whether your wearable app is connected. > **Note:** Ensure that the wearable device is connected to the Huawei Health app. Users can query the connection status on the Devices screen in the Huawei Health app. You can call the [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--) method to query whether the wearable device is connected ( true : connected; false : not connected) and remind the user to re-connect the device. 
```cpp
// Step 2: Obtain the P2P communication object.
P2pClient p2pClient = HiWear.getP2pClient(this);

// Step 3: Set the bundle name (bundleName) of your wearable app to be communicated with.
String peerPkgName = "com.*.*";
p2pClient.setPeerPkgName(peerPkgName);

// Step 4: Check whether your wearable app is running.
if (connectedDevice != null && connectedDevice.isConnected()) {
    p2pClient.ping(connectedDevice, new PingCallback() {
        @Override
        public void onPingResult(int errCode) {
            // Result of communicating with the peer device using the ping method.
// If the errCode value is 200, your app has not been installed on the wearable device. If the errCode value is 201, your app has been installed but not started on the wearable device. If the errCode value is 202, your app has been started on the wearable device.
        }
    }).addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void successVoid) {
            // Related processing logic for your app after the ping method is successfully executed.
        }
    }).addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Related processing logic for your app after the ping method fails.
        }
    });
}
```
 > **Note:** There are two processes for calling the [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__ping-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_PingCallback-) method. One is the process in which the phone sends instructions to the wearable device, and the other is the process in which the device sends responses to the phone. The [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__ping-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_PingCallback-) method is called in Task mode. The OnSuccessListener and OnFailureListener parameters return whether the ping method works. This is a process in which the phone sends instructions to the wearable device. If OnSuccessListener is called back, it indicates that the ping method works. If OnFailureListener is called back, it indicates that the ping method fails. The [PingCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/pingcallback-0000001060938728) API of the [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__ping-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_PingCallback-) method is used by the wearable device to reply to the phone.

#### Sending P2P Messages or Files to Your Wearable App

The maximum size of a message is 1 KB. If the size of a message exceeds the limit, the message can be divided into several packets or files (with each no larger than 100 MB) can be sent instead.

If the phone app is able to send messages and files, the wearable app must support receiving these messages and files:

- JS: [Receiving P2P Messages or Files from Your Phone App](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/send-message-0000001052460491#section1361217411408)
- Java: [Receiving P2P Messages or Files from Your Phone App](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/send-message-0000001052540469#section1361217411408)

## Sending P2P Messages

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) to build [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) to be sent.

- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerPkgName-java_lang_String-) method and specify the bundle name (bundleName) of your wearable app to be communicated with. (If the bundle name is not specified, the bundle name of your phone app will be used by default.)
- Call the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerFingerPrint-java_lang_String-) method to specify the signing certificate fingerprint of your wearable app to be communicated with. (Refer to [Obtaining a Signing Certificate Fingerprint on the Wearable Device](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/signature-0000001053969657).)
- Call the [send](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__send-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_Message-com_huawei_wearengine_p2p_SendCallback-) method to send short messages from your phone app to the wearable app. Use the [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) object to define messages that need to be sent by your app.
- Use the [onSendResult](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639#EN-US_TOPIC_0000001874111262__onSendResult-int-)(int resultCode) method to [return the sending result](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/errocode-0000001054450278#section394183995410) (success, fail, or other exceptions).
- Use the [onSendProgress](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639#EN-US_TOPIC_0000001874111262__onSendProgress-long-)(long progress) method to check the sending progress. 
```cpp
// Step 2: Send a message.
String messageStr = "Hello, Wear Engine!";
Message.Builder builder = new Message.Builder();
builder.setPayload(messageStr.getBytes(StandardCharsets.UTF_8));
Message sendMessage = builder.build();

// Step 3: Obtain the P2P communication object.
P2pClient p2pClient = HiWear.getP2pClient(this);

// Step 4: Specify the bundle name (bundleName) of your wearable app to be communicated with.
String peerPkgName = "com.*.*";
p2pClient.setPeerPkgName(peerPkgName);

// Step 5: Specify the signing certificate fingerprint of your wearable app to be communicated with. The maximum length of the fingerprint on the lite wearable device is 127 bits.
String peerFingerPrint = "*******";
p2pClient.setPeerFingerPrint(peerFingerPrint);

// Step 6: Send short messages from your phone app to the wearable app.
// Create the callback method.
SendCallback sendCallback = new SendCallback() {
    @Override
    public void onSendResult(int resultCode) {
// If the resultCode value is 207, the messages have been sent successfully. Other values indicate that the messages fail to be sent.
    }
    @Override
    public void onSendProgress(long progress) {
    }
};
if(connectedDevice != null && connectedDevice.isConnected() && sendMessage != null && sendCallback != null){
    p2pClient.send(connectedDevice, sendMessage, sendCallback)
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void successVoid) {
                // Related processing logic for your app after the send task is successfully executed.
            }
     })
       .addOnFailureListener(new OnFailureListener() {
           @Override
           public void onFailure(Exception e) {
               // Related processing logic for your app after the send task fails.
           }
       });
}
```

## Sending Files

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.

- Call the [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) method to create [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) for the file that needs to be sent based on the file path.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerPkgName-java_lang_String-) method and specify the bundle name (bundleName) of your wearable app to be communicated with. (If the bundle name is not specified, the bundle name of your phone app will be used by default.)
- Call the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerFingerPrint-java_lang_String-) method to specify the signing certificate fingerprint of your wearable app to be communicated with. (Refer to [Obtaining a Signing Certificate Fingerprint on the Wearable Device](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/signature-0000001053969657).)
- Call the [send](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__send-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_Message-com_huawei_wearengine_p2p_SendCallback-) method to send a file from your phone app to the wearable app. Use the [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) object to define the file that needs to be sent by your app.
- Use the [onSendResult](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639#EN-US_TOPIC_0000001874111262__onSendResult-int-)(int resultCode) method to the sending result (success, fail, or other exceptions).
- Use the [onSendProgress](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639#EN-US_TOPIC_0000001874111262__onSendProgress-long-)(long progress) method to check the sending progress.

```cpp
// Step 2: Build a message that can be used for sending files.
String filePath = ".....";
File sendFile = new File(filePath);
Message.Builder builder = new Message.Builder();
builder.setPayload(sendFile);
Message fileMessage = builder.build();

// Step 3: Obtain the P2P communication object.
P2pClient p2pClient = HiWear.getP2pClient(this);

// Step 4: Specify the bundle name (bundleName) of your wearable app to be communicated with.
String peerPkgName = "com.*.*";
p2pClient.setPeerPkgName(peerPkgName);

// Step 5: Specify the signing certificate fingerprint of your wearable app to be communicated with.
String peerFingerPrint = "*******";
p2pClient.setPeerFingerPrint(peerFingerPrint);

// Step 6: Send a file from your phone app to the wearable app.
// Create the callback functions of the sent file.
SendCallback sendCallback = new SendCallback() {
    @Override
    public void onSendResult(int resultCode) {
// If the resultCode value is 207, the messages have been sent successfully. Other values indicate that the messages fail to be sent.
    }
    @Override
    public void onSendProgress(long progress) {
    }
};
// Send the file to the peer device.
if(connectedDevice != null && connectedDevice.isConnected() && fileMessage != null && sendCallback != null){
    p2pClient.send(connectedDevice, fileMessage, sendCallback)
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void successVoid) {
                // Related processing logic for your app after the send task is successfully executed.
            }
        })
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
               // Related processing logic for your app after the send task fails.
            }
        });
}
```

> **Note:** If your phone app receives the error code 10 (ERROR_CODE_INVALID_FILE) when sending a file to your wearable app, check whether your phone app has the permission to access the file.

## Canceling the File Sending Task

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.

- Call [FileIdentification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/fileidentification_builder-0000001093318165) to build a file identifier ([FileIdentification](https://developer.huawei.com/consumer/en/doc/connectivity-References/fileidentification-0000001077679542)) for the file corresponding to the sending task that needs to be canceled, based on the filePath.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerPkgName-java_lang_String-) method and specify the bundle name (bundleName) of your wearable app to be communicated with. (If the bundle name is not specified, the bundle name of your phone app will be used by default.)
- Call the [cancelFileTransfer](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#section219165413392) method to cancel the file transfer from your phone app to the wearable app. Use the [FileIdentification](https://developer.huawei.com/consumer/en/doc/connectivity-References/fileidentification-0000001077679542) object to define the file identifier of the file corresponding to the sending task needs to be canceled.
- Use the [onCancelFileTransferResult](https://developer.huawei.com/consumer/en/doc/connectivity-References/cancelfiletransfercallback-0000001093458245#section19719193003813)(int errorCode) method to return results: success, fail, or other exceptions.

```cpp
// Step 2: Build a FileIdentification message of the file corresponding to the sending task that needs to be canceled.
String filePath = ".....";
File cancelFile = new File(filePath);
FileIdentification.Builder builder = new FileIdentification.Builder();
builder.setFile(cancelFile);
FileIdentification fileIdentification = builder.build();

// Step 3: Obtain the P2P communication object.
P2pClient p2pClient = HiWear.getP2pClient(this);

// Step 4: Specify the bundle name (bundleName) of your wearable app to be communicated with.
String peerPkgName = "com.*.*";
p2pClient.setPeerPkgName(peerPkgName);

// Step 5: Send a file from your phone app to the wearable app.
// Create the callback object of the file transfer cancellation. 
CancelFileTransferCallBack cancelFileTransferCallBack = new CancelFileTransferCallBack() {
    @Override
    public void onCancelFileTransferResult(int errCode) {
        /*
         * The common result codes are described as follows:
         * errCode:207: File sending canceled.
         * errCode:1990020004: Failed to cancel the file sending task.
         * errCode:5
         * (1) When the API for canceling file sending is called, the input parameter is null.
         * (2) The file corresponding to the sending task that needs to be canceled does not exist, the file is not being sent, or the package name of the peer device is incorrect.
         */
        Log.d(TAG, "cancel send file callBack, errCode: " + errCode);
    }
};

// Cancel sending files to the peer device.
if (connectedDevice != null && connectedDevice.isConnected() && fileIdentification != null
    && cancelFileTransferCallBack != null) {
    p2pClient.cancelFileTransfer(connectedDevice, fileIdentification, cancelFileTransferCallBack)
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void successVoid) {
                Log.d(TAG, "cancel send file submission success");
                // Related processing logic for your app after the file sending task is canceled.
            }
        })
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                Log.d(TAG, "cancel send file onFailure e: " + e.getMessage());
                // Related processing logic for your app when the file sending task fails to be canceled.
            }
        });
}
```

> **Note:** [cancelFileTransfer](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#section219165413392) can only be used for canceling ongoing file sending tasks. If the file corresponding to the sending task that needs to be canceled does not exist, the file is not being sent, or the package name of the peer device is incorrect, the result code 5 is displayed indicating that the argument is invalid.

#### Receiving P2P messages or files sent by your wearable app

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerPkgName-java_lang_String-) method and specify the bundle name (bundleName) of your wearable app to be communicated with. (If the bundle name is not specified, the bundle name of your phone app will be used by default.)
- Call the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerFingerPrint-java_lang_String-) method to specify the signing certificate fingerprint of your wearable app to be communicated with. (Refer to [Obtaining a Signing Certificate Fingerprint on the Wearable Device](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/signature-0000001053969657).)

- Call the [registerReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__registerReceiver-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_Receiver-) method to allow your phone app to receive messages or files from the wearable app. The principle behind this is to register a listener for Wear Engine. Call the [onReceiveMessage](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920#EN-US_TOPIC_0000001874111202__onReceiveMessage-com_huawei_wearengine_p2p_Message-) method to deal with messages or files sent by the wearable device. The file is saved in /data/data/{your app package}/files/WearEngine**. > **Note:** If the integrated SDK version is 5.0.0.301 or earlier, the app can only receive the P2P messages after you have called the [registerReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__registerReceiver-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_Receiver-) and [onReceiveMessage](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920#EN-US_TOPIC_0000001874111202__onReceiveMessage-com_huawei_wearengine_p2p_Message-) methods. If the integrated SDK version is 5.0.1.300 or later, the app can receive files as well. 
```cpp
// Step 2: Obtain the P2P communication object.
P2pClient p2pClient = HiWear.getP2pClient(this);

// Step 3: Specify the bundle name (bundleName) of your wearable app to be communicated with.
String peerPkgName = "com.*.*";
p2pClient.setPeerPkgName(peerPkgName);

// Step 4: Specify the signing certificate fingerprint of your wearable app to be communicated with.
String peerFingerPrint = "*******";
p2pClient.setPeerFingerPrint(peerFingerPrint);

// Step 5: Receive P2P messages or files sent by your wearable device app.
Receiver receiver = new Receiver() {
    @Override
    public void onReceiveMessage(Message message) {
        if (message.getType() == Message.MESSAGE_TYPE_DATA) {
            // Process messages sent by your wearable app.
        } else if (message.getType() == Message.MESSAGE_TYPE_FILE) {
            // Process the file sent by your wearable app.
        }
    }
};
if(connectedDevice != null && connectedDevice.isConnected()){
    HiWear.getP2pClient(this).registerReceiver(connectedDevice, receiver)
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                // Your phone app fails to receive messages or files.
            }
        })
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void successVoid) {
                // Your phone app receives messages or files.
            }
        });
}
```

- Call the [unregisterReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__unregisterReceiver-com_huawei_wearengine_p2p_Receiver-) method to cancel the reception of messages or files from your wearable app. The principle behind this is to unregister a listener for Wear Engine. 
```cpp
// Step 6: Your phone app cancels receiving the messages or files sent by the wearable app.
HiWear.getP2pClient(this).unregisterReceiver(receiver)
    .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void successVoid) {
            // Your phone app cancels the reception of messages or files.
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Your phone app fails to cancel the reception of messages or files.
        }
    });
```
