<!--
  Title: Point-to-Point (P2P) Messaging
  Catalog: connectivity-References
  Document ID: point-to-point-message-0000001052164296
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/point-to-point-message-0000001052164296
-->
# Point-to-Point (P2P) Messaging

#### Modules to Import

```cpp
import { P2pClient, Message, Builder } from '../wearengine'
```

#### P2pClient.setPeerPkgName(string)

It is used to set the package name for your phone app.

- Input parameter 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| peerPkgName | string | Yes | Package name for the phone app, which is case sensitive. |

- Sample code
```cpp
// Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";

// Set the package name for your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);
```

#### P2pClient.setPeerFingerPrint(string)

It is used to set the fingerprint information of your phone app.

> **Note:** Versions earlier than 10.1.3.28 of light wearables do not support the calling of [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/point-to-point-message-0000001052164296#section115961235115919). Use **config.json** to obtain the fingerprint information of your phone app.
```cpp
// Set metaData of your phone app in the module of the config.json file. 
"metaData": {
  "customizeData": [
    {
      "name": "supportLists",
      // Consists of the package name and the fingerprint information, up to 255 characters
      "value": "com.huawei.idehelper:69178F8F5B8DF***"
      "extra": ""
    }
  ]
}
```

- Input parameter 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| fingerPrint | string | Yes | Fingerprint information of the phone app. |

- Sample code
```cpp
// Create a P2P communication object.
var p2pClient = new P2pClient();
var peerFinger = "67DFB7FD********";

// Set the package name for your phone app to be communicated with. 
p2pClient.setPeerPkgName(peerPkgName);

// Set the fingerprint information of your phone app to be communicated with.
p2pClient.setPeerFingerPrint(peerFinger);
```

#### P2pClient.ping(Object)

It is used to check whether the specified app has been installed on the phone. If the app has not been installed on the phone, result code **204** will be returned. If the app has been installed on the phone, result code **205** will be returned.

- Input parameter 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [pingCallback](#EN-US_TOPIC_0000001919950497__table7255189161915) | Object | Yes | Callback of the ping message. |
 pingCallback 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| onSuccess | Function | Yes | Callback function for successful API calls. |
| onFailure | Function | Yes | Callback function for failed API calls. |
| onPingResult | Function | Yes | Callback function for API call result. |

- Sample code
```cpp
// Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";

// Set the package name for your phone app to be communicated with. 
p2pClient.setPeerPkgName(peerPkgName);

// Check whether the app has been installed on the phone.
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

#### P2pClient.send(Object)

It is used to send messages or files to the phone.

- Input parameters 
| **Parameter** | **Type** | **Mandatory** | Description |
| --- | --- | --- | --- |
| [message](#EN-US_TOPIC_0000001919950497__li1868118512371) | Object | Yes | Messages sent. |
| [sendCallback](#EN-US_TOPIC_0000001919950497__table9932347151817) | Object | Yes | Callback for sending messages. |
 message 
| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| [builder](#EN-US_TOPIC_0000001919950497__li1488610273817) | Object | Yes | Object to which a message or file is sent. |
 builder (message) 
| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| text | string | Yes | Content of a message sent. |

- builder (file) 
| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| [fileObject](#EN-US_TOPIC_0000001919950497__li1383019574386) | Object | Yes | File object to be sent. |
 fileObject 
| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string | Yes | File path. For example, "internal://app/XX.png". NOTE: If the file fails to be sent and the result code is **208**, it indicates that the wearable version is too early. In this case, instruct users to update the version. |
| mode | string | No | File type. The value can be **text** or **binary**. |
| mode2 | string | No | File attribute. The value can be **R**, **W**, or **RW**. |

- sendCallback 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| onSuccess | Function | Yes | Callback function for successful API calls. |
| onFailure | Function | Yes | Callback function for failed API calls. |
| onSendResult | Function | No | Callback function called after a message is sent. |
| onSendProgress | Function | No | Callback function called when the message is being sent. |

- Sample code (sending a message)
```cpp
// Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";
var peerFinger = "67DFB7FD********";

// Set the package name for your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);

// Set the fingerprint information of the phone app.
p2pClient.setPeerFingerPrint(peerFinger);

// Build a Builder object.
var builderClient = new Builder();
var messageStr = "Hello, Wear Engine!";
builderClient.setDescription(messageStr);
// Build a Message object.
var sendMessage = new Message();
sendMessage.builder = builderClient;
// Define the callback function.
var sendCallback ={
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

- Sample code (sending a file)
```cpp
// Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";
var peerFinger = "67DFB7FD********";

// Set the package name of your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);

// Set the fingerprint information of the phone app.
p2pClient.setPeerFingerPrint(peerFinger);

// Send a message to the corresponding phone app.
// Build a Builder object.
var testFile = {
  "name" : "internal://app/testPhoto.png",  // File path. If the file fails to be sent and the result code is 208, it indicates that the wearable version is too early. In this case, instruct users to update the version.
  "mode": "",  // File type, 'text' or 'binary'
  "mode2": "", // File attribute, "R", "W", or "RW" 
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
    // Return the progress information after the send task is complete
    console.log("Progress" + count);
  },
}
if(sendMessage != null && sendCallback != null){
  p2pClient.send(sendMessage, sendCallback);
};
```

#### P2pClient.registerReceiver(Object)

It is a register receiver used to receive messages and files sent from a phone.

The received files are stored in the private directory of the app "internal://app/".

- Input parameter 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [receiver](#EN-US_TOPIC_0000001919950497__table15927111072513) | Object | Yes | Callback of registering for receiving messages. |
 receiver 
| **Value** | **Type** | **Description** |
| --- | --- | --- |
| onSuccess | Function | Callback function called when the registration is successful. |
| onFailure | Function | Callback function called when the registration fails. |
| [onReceiveMessage](#EN-US_TOPIC_0000001919950497__li1589210463420) | Function | Callback function returned when the registration is successful. |
 onReceiveMessage return value (message) 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| data | string | Yes | Content of the message sent by the phone. |

- onReceiveMessage return value (file) 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [data](#EN-US_TOPIC_0000001919950497__table0623113284316) | Object | Yes | File information sent by the phone. |
 data (file) 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| isFileType | boolean | Yes | Specifies whether the received message is a file. |
| name | string | Yes | Address and name of the received file. The format is "internal://app/file name" or "app/ace/data/app package name/file name". |

- Sample code
```cpp
// Create a P2P communication object.
var p2pClient = new P2pClient();
var peerPkgName = "com.*.*";
var peerFinger = "67DFB7FD********";

// Set the package name of your phone app to be communicated with.
p2pClient.setPeerPkgName(peerPkgName);

// Set the fingerprint information of the phone app.
p2pClient.setPeerFingerPrint(peerFinger);

// Receive a short message or file from the phone app.
// Define the receiver.
var flash = this;
var receiver = {
  onSuccess: function() {
    // Process the callback function returned when messages or files have been received from the phone during registration.
    flash.receiveMessageOK = "Succeeded in receiving the message"; 
  },
  onFailure :function() {
    // Process the callback function returned when messages or files fail to be received from the phone during registration.
    flash.receiveMessageOK = "Failed to receive the message";
  },
  onReceiveMessage: function (data) {
    if (data && data.isFileType) {
      // Process the file sent from your phone app.
      flash.receiveMessageOK = "file:"+data.name;
    } else {
      // Process the short message sent from your phone app.
      flash.receiveMessageOK = "message:"+data;
    }
  },
}
p2pClient.registerReceiver(receiver);
```

#### P2pClient.unregisterReceiver(Object)

It is used to deregister the function of receiving messages or files from the phone. You are advised to use this call during or before the onDestroy life cycle of an app to release server resources.

- Input parameter 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [receiver](#EN-US_TOPIC_0000001919950497__table131258920819) | Object | Yes | Callback for stopping receiving messages. |
 receiver 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| onSuccess | Function | Yes | Callback function called when receiving messages has been stopped. |
| onFail | Function | Yes | Callback function called when receiving messages fails to be stopped (not supported by lite wearable devices). |

- Sample code
```cpp
// Create a P2P communication object.
var p2pClient = new P2pClient();
p2pClient.unregisterReceiver({
  onSuccess:function() {
    console.log ("Succeeded in stopping receiving messages.");
  },
);
```
