<!--
  Title: App-to-App Message Communications
  Catalog: connectivity-Guides
  Document ID: send-message-0000001052460491
  Updated: 2025-10-13 02:54:15
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/send-message-0000001052460491
-->
# App-to-App Message Communications

This API is used to establish the communications channel between your phone app and the wearable app, to receive and send messages and files customized by your app.

#### Checking Whether Your App Has Been Installed on the Phone

Before sending a P2P message, you can use the **ping** method to check whether your wearable app can communicate with the phone app.

- Create a **P2pClient** object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section235119350911) method and specify the package name of your phone app to be communicated with using the **ping** method.
- Call the [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section4682131185915) method of the **P2pClient** object to check whether the specified app has been installed on the phone. If the app has not been installed on the phone, result code **204** will be returned. If the app has been installed on the phone, result code **205** will be returned. 
```cpp
// Step 1: Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";

// Step 2: Set the package name of your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);

// Step 3: Check whether your app has been installed on the phone.
p2pClient.ping({
  onSuccess: function() {
    console.log('ping success.');
  },
  onFailure: function() {
    console.log('ping failed');
  },
  onPingResult: function(resultCode) {
    console.log(resultCode.data + resultCode.code);
  },
});
```

#### Sending P2P Messages or Files to Your Phone App

The maximum size of a message is 1 KB. If the size of a message exceeds the limit, the message can be divided into several packets or files (with each no larger than 4 MB) can be sent instead.

If the wearable app is able to send messages and files, the phone app must support receiving these messages and files. For details, see [Receiving P2P messages or files sent by your wearable app](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209#section11891149183312) on the phone.

## Sending P2P Messages

- Create a **P2pClient** object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section235119350911) method and specify the package name of your phone app to be communicated with.
- Call the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section115961235115919) method and specify the fingerprint SHA-256 information of your phone app to be communicated with. (Refer to [Generating a Signing Certificate Fingerprint](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#3) to obtain an SHA-256 certificate fingerprint. The fingerprint information does not contain colons, and the fingerprint is one of the fingerprints registered by your phone app when applying for the HUAWEI ID Service from HUAWEI Developers, that is, one of the SHA-256 certificate fingerprints in Step 4 in [Registering a HUAWEI ID and Applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).) > **Note:** Versions earlier than HarmonyOS 2.0 of lite wearable devices do not support the calling of the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section115961235115919) method. Use **config.json** to obtain the fingerprint information of your phone app. 
```cpp
// Set metaData of your phone app in the module of the config.json file. 
"metaData": {
  "customizeData": [
    {
      "name": "supportLists",
      // The value consists of the package name and fingerprint information and can contain a maximum of 255 characters. For details about how to obtain the fingerprint information, refer to Step 3 in section "Sending Files."
      "value": "com.huawei.idehelper:69178F8F5B8DF***"
      "extra": ""
    }
  ]
}
```

- Call the [send](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section1450618291164) method in the **P2pClient** object to send short messages from your wearable app to the phone app. Create a **Builder** object to define messages that need to be sent from your app.
- Create a **Message** object and provide the **Builder** object to the **send** method. 
```cpp
// Step 1: Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";
var peerFinger = "67DFB7FD********";

// Step 2: Set the package name of your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);

// Step 3: Set the app fingerprint information on the phone.
p2pClient.setPeerFingerPrint(peerFinger);

// Step 4: Send a short message to your phone app.
// Build a Builder object.
var builderClient = new Builder();
var messageStr = "Hello, Wear Engine!";
builderClient.setDescription(messageStr);
// Build a Message object
var sendMessage = new Message();
sendMessage.builder = builderClient;
// Define the callback function.
var sendCallback = {
  onSuccess: function() {
    // Related processing logic for your app after the send task is successfully executed.
  },
  onFailure: function() {
    // Related processing logic for your app after the send task fails.
  },
  onSendResult: function(resultCode) {
    // Process the result code and information returned after the send task is complete.
    console.log(resultCode.data + resultCode.code);
  },
}
if(sendMessage != null && sendCallback != null){
  p2pClient.send(sendMessage, sendCallback);
};
```

## Sending Files

- Create a **P2pClient** object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section235119350911) method and specify the package name of your phone app to be communicated with.
- Call the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section115961235115919) method and specify the fingerprint SHA-256 information of your phone app to be communicated with. (Refer to [Generating a Signing Certificate Fingerprint](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#3) to obtain an SHA-256 certificate fingerprint. The fingerprint information does not contain colons, and the fingerprint is one of the fingerprints registered by your phone app when applying for the HUAWEI ID Service from HUAWEI Developers, that is, one of the SHA-256 certificate fingerprints in Step 4 in [Registering a HUAWEI ID and Applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).) > **Note:** Versions earlier than HarmonyOS 2.0 of lite wearable devices do not support the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section115961235115919) method. Use **config.json** to obtain the fingerprint information of your phone app. For details, refer to step 3 in [Sending P2P Messages](#section2060584113402).
- Call the [send](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section1450618291164) method of the **P2pClient** object to send files from your wearable app to the phone app. (You cannot send different files of the same type at the same time from a lite wearable device to the phone. Do not send another file before the ongoing transfer completes.) Create a **Builder** object to define files that need to be sent by your app. (The file size should be less than 4 MB).
- Create a **Message** object and provide the **Builder** object to the **send** method.

```cpp
// Step 1: Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";
var peerFinger = "67DFB7FD********";

// Step 2: Set the package name of your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);

// Step 3: Set the app fingerprint information on the phone.
p2pClient.setPeerFingerPrint(peerFinger);

// Step 4: Send a file to the phone app.
// Build a Builder object.
var testFile = {
  "name" : "internal://app/testPhoto.png",  // File path. If the file fails to be sent and the result code is 208, it indicates that the wearable version is too early. In this case, instruct users to update the version.
  "mode": "",  // File type, 'text' or 'binary'
  "mode2": "",  // File attribute, "R", "W", or "RW"
};
var builderClient = new Builder();
builderClient.setPayload(testFile);
// Build a Message object.
var sendMessage = new Message();
sendMessage.builder = builderClient;
// Define the callback function.
var sendCallback = {
  onSuccess: function() {
    // Related processing logic for your app after the send task is successfully executed.
  },
  onFailure: function() {
    // Related processing logic for your app after the send task fails.
  },
  onSendResult: function(resultCode) {
    // Process the result code and information returned after the send task is complete.
    console.log(resultCode.data + resultCode.code);
  },
  onSendProgress: function(count) {
    // Return the progress information after the send task is complete.
    console.log("Progress" + count);
  },
}
if(sendMessage != null && sendCallback != null){
  p2pClient.send(sendMessage, sendCallback);
};
```

#### Receiving P2P Messages or Files from Your Phone App

- Create a **P2pClient** object.
- Call the [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section235119350911) method and specify the package name of your phone app to be communicated with.
- Call the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section115961235115919) method and specify the fingerprint SHA-256 information of your phone app to be communicated with. (Refer to [Generating a Signing Certificate Fingerprint](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#3) to obtain an SHA-256 certificate fingerprint. The fingerprint information does not contain colons, and the fingerprint is one of the fingerprints registered by your phone app when applying for the HUAWEI ID Service from HUAWEI Developers, that is, one of the SHA-256 certificate fingerprints in Step 4 in [Registering a HUAWEI ID and Applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).) > **Note:** Versions earlier than HarmonyOS 2.0 of lite wearable devices do not support the [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section115961235115919) method. Use **config.json** to obtain the fingerprint information of your phone app. For details, refer to step 3 in [Sending P2P Messages](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/send-message-0000001052460491#section2060584113402).
- By calling the [registerReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section2682846161612) method, your wearable app can receive short messages or files from the phone app (the received files will be stored in the app's private directory **internal://app/**). The principle behind this is to register a listener for Wear Engine.
- Call the [unregisterReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section1672614593166) method to cancel the reception of messages or files sent from your phone app. The principle behind this is to unregister a listener for Wear Engine. You are advised to call the [unregisterReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section1672614593166) method in or before the **onDestroy** lifecycle of your app to release server resources. 
```cpp
// Step 1: Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";
var peerFinger = "67DFB7FD********";

// Step 2: Set the package name of your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);

// Step 3: Set the app fingerprint information on the phone.
p2pClient.setPeerFingerPrint(peerFinger);

// Step 4: Receive short messages or files from your phone app.
// Define the receiver
var flash = this;
var receiver = {
  onSuccess: function() {
    // Process the callback function returned when messages or files have been received from the phone during registration.
    flash.receiveMessageOK="Succeeded in receiving the message";
  },
  onFailure: function() {
    // Process the callback function returned when messages or files fail to be received from the phone during registration.
    flash.receiveMessageOK="Failed to receive the message";
  },
  onReceiveMessage: function (data) {
    if (data && data.isFileType) {
      // Process the file sent by your phone app.
      flash.receiveMessageOK = "file:"+data.name;
    } else {
      // Process the message sent from your phone app.
      flash.receiveMessageOK = "message:"+data;
    }
  },
}
p2pClient.registerReceiver(receiver);

// Step 5: Cancel the reception of messages or files from your phone app.
p2pClient.unregisterReceiver({
    onSuccess:function() {
console.log = ("Stopped receiving messages"); 
    },
    onFailure:function() {
console.log = ("Failed to stop receiving messages");
    }
});
```

#### Launching the App on the Wearable by Calling the Ping Method on the Phone App

If the phone app is launched while the wearable app is not, the phone app can launch the latter by using the **ping** method.

- If the **deviceType** of the wearable JS app contains **liteWearable**, the app can be installed on a lite smart wearable (sports watch), with no need for other additional configuration. Use the [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__ping-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_PingCallback-) method on the phone to start the wearable app.
- If the deviceType of the wearable app JS contains only wearable, the app can be installed only on smart wearables. In this case, you need to create a specified Page Ability to start the app. Perform the following steps:

- Create a JS Page Ability on the wearable device and name it HiWearMainAbility.java. You can right-click the project directory and choose **New** > **Ability** from the shortcut menu to create a Page Ability. Alternatively, manually compile code to create a Page Ability. Sample code: 
```cpp
public class HiWearMainAbility extends AceAbility {
    @Override
    public void onStart(Intent intent) {
        super.onStart(intent);
    }

    @Override
    public void onStop() {
        super.onStop();
    }
}
```
 > **Note:** The name of the Ability is **HiWearMainAbility.java**, which cannot be customized. The HiWearMainAbility package name must correspond to the app package name. AceAbility, not Ability, needs to be inherited.
- Declare the Ability in the **config.json** file. Set **type** to **page** and **visible** to **true**. 
```cpp
"abilities": [ 
  ...... 
  {
    ......
    "visible": true,
    "name": ".HiWearMainAbility",
    "type": "page",
    ......
  }, 
  ...... 
],
```

- After the preceding configuration is complete, use the [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__ping-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_PingCallback-) method on the phone to start the wearable app. For details, see [Checking Whether the Wearable App is Running](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209#section25081840087).
