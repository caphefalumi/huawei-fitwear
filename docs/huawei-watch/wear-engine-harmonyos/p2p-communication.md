<!--
  Title: App-to-App Message Communications
  Catalog: harmonyos-guides
  Document ID: p2p_communication
  Updated: 2026-10-14 09:34:23
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/p2p_communication
-->
# App-to-App Message Communications

This API is used to establish the communications channel between your phone app and wearable app, to receive and send packet messages and files customized by your apps. This makes the interaction between the phone app and its wearable counterpart a full-fledged reality, providing the distributed scenarios and experience for your users. For example, a phone app sends an audio file to the wearable app, to play music on the wearable app; the phone app sends a pause command, to pause the music playback on the wearable device.

Before sending or receiving P2P messages, apply for the basic device information permission on HUAWEI Developers by referring to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply). Otherwise, the API calling will fail.

> **Note:** Before using this feature, ensure that the wearable device supports the app installation capability (by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection#selecting-the-target-device-supporting-certain-device-capabilities)) and the app has been installed on the wearable device (by referring to [Wearable App Development](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/watch-dev-0000001119195134)). Both the phone app and wearable app must be launched. If the phone app is launched while the wearable app is not, the phone app can launch the wearable app through [startRemoteApp](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#startremoteapp).

#### Checking Whether the Wearable App Has Been Installed

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [isRemoteAppInstalled](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#isremoteappinstalled) method to check whether the specified app has been installed. 
```typescript
// Define the device-side app bundle name as remoteBundleName.
let remoteBundleName: string = '';

// Step 3: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 4: Check whether the specified app has been installed on the device.
p2pClient.isRemoteAppInstalled(targetDevice.randomId, remoteBundleName).then((isInstall) => {
  console.info(`Succeeded in checking remote app install, result is ${isInstall}.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to check remote app install. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Obtaining the Wearable App's Version Number

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [getRemoteAppVersion](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getremoteappversion) method to obtain the app version number of a specified device. 
```typescript
// Define the device-side app bundle name as remoteBundleName.
let remoteBundleName: string = '';

// Step 3: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 4: Obtain the app version number of a specified device.
p2pClient.getRemoteAppVersion(targetDevice.randomId, remoteBundleName).then((version) => {
  console.info(`Succeeded in getting remote app version, version is ${version}.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to check get remote app version. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Launching the Device-side App with the Phone-side App

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

Before sending a P2P message, you can use the [startRemoteApp](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#startremoteapp) method to launch the device-side app.

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [startRemoteApp](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#startremoteapp) method to specify the device-side app bundle name to be launched. The default value of [transformLocalBundleName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#startremoteapp) is **false**. If **true** is passed, Wear Engine will convert the local bundle name and fingerprint to match those stored on the cloud for compatible apps. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply). 
```typescript
// Define the device-side app bundle name as remoteBundleName.
let remoteBundleName: string = '';

// Step 3: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());
  
// Step 4: Launch the specified device-side app (transformLocalBundleName defaults to false).
p2pClient.startRemoteApp(targetDevice.randomId, remoteBundleName).then((p2pResult) => {
  console.info(`Succeeded in starting remote app, result is ${p2pResult.code}.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to start remote app. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Sending P2P Messages or Files to Your Wearable App

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

The maximum size of a message is 4096 bytes. If the size of a message exceeds the limit, the message can be divided into several packets or files (with each no larger than 100 MB) for sending.

If the phone app is able to send messages and files, the wearable app need to support receiving these messages and files.

## Sending P2P Messages

To use the utility class to construct the message body, import the required module first.

```typescript
import { util } from '@kit.ArkTS';
```

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Construct the device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [P2pMessage](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pmessage) to be sent.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [sendMessage](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#sendmessage) method to send short messages from your phone app to the wearable app. Register a listener for the wearable device, and the wearable app will be able to receive messages from the phone. 
```typescript
// Step 3: Construct device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  // Set the device-side app information, including the bundle name and fingerprint.
  bundleName: '',
  fingerprint: ''
}
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
  // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
}

// Set the message content to be sent, with a maximum length of 4096 bytes.
let messageContent: string = 'this is message';

//Step 4: Construct the message structure.
let textEncoder: util.TextEncoder = new util.TextEncoder;
let message: wearEngine.P2pMessage = {
  content: textEncoder.encodeInto(messageContent)
}

// Step 5: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 6: Send the message.
p2pClient.sendMessage(targetDevice.randomId, appParam, message).then((p2pResult) => {
  console.info(`Succeeded in sending message, result is ${p2pResult.code}.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to send message. Code is ${error.code}, message is ${error.message}.`);
})
```

## Sending Files

Import the module below before you open the file descriptor.

```typescript
import { fileIo } from '@kit.CoreFileKit';
```

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Construct the device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [P2pFile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pfile) to be sent based on **filePath**.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [transferFile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#transferfile) method and send a file using your phone app to the wearable app. 
```typescript
// Step 3: Construct device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  // Set the device-side app information, including the bundle name and fingerprint.
  bundleName: '',
  fingerprint: ''
}
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
  // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
}

// Step 4: Construct the file to be sent.
let p2pfile: wearEngine.P2pFile = {
  // Set the file path to be sent, which should not contain '..'.
  file: fileIo.openSync('')
}

// Step 5: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 6: Send the specified file to the device.
p2pClient.transferFile(targetDevice.randomId, appParam, p2pfile, (error: BusinessError, p2pResult: wearEngine.P2pResult) => {
  // Callback processing logic.
  if (error) {
    console.error(`Failed to transfer file. Code is ${error.code}, message is ${error.message}.`);
    return;
  }
  if (p2pResult.code) {
    if (p2pResult.code === wearEngine.P2pResultCode.COMMUNICATION_SUCCESS) {
      console.info(`Succeeded in transferring file, the result is ${p2pResult.code}.`);
    } else {
      console.info(`Failed to transfer file, the error code is ${p2pResult.code}.`);
      return;
    }
  }
  if (p2pResult.progress) {
    console.info(`Succeeded in transferring file, the progress is ${p2pResult.progress}.`);
  }
});

fileIo.close(p2pfile.file);
```

## Canceling the File Sending Task

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Construct the device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [P2pFile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pfile) file to be canceled for sending based on **filePath**.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [cancelFileTransfer](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#cancelfiletransfer) method to cancel the file transfer from your phone app to the wearable app. 
```typescript
// Step 3: Construct device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  // Set the device-side app information, including the bundle name and fingerprint.
  bundleName: '',
  fingerprint: ''
}
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
  // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
}

// Step 4: Construct the file to be sent.
let p2pfile: wearEngine.P2pFile = {
  // Set the file path to be sent, which should not contain '..'.
  file: fileIo.openSync('')
}

// Step 5: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Send the specified file to the device.
p2pClient.transferFile(targetDevice.randomId, appParam, p2pfile, () => {
  // Execution logic of the callback function.
})

// Step 6: Cancel the file sending.
p2pClient.cancelFileTransfer(targetDevice.randomId, appParam, p2pfile).then((p2pResult) => {
  if (p2pResult.code === wearEngine.P2pResultCode.COMMUNICATION_SUCCESS) {
    console.info(`Succeeded in cancelling transfer file, the result is ${p2pResult.code}.`);
  }
}).catch((error: BusinessError) => {
  console.error(`Failed to cancel transfer file. Code is ${error.code}, message is ${error.message}.`);
})

fileIo.close(p2pfile.file);
```

#### Subscribing to and Receiving Messages Sent by the Wearable App

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Construct the device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-base#callback) function for message receiving from the device.
- Call the [registerMessageReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#registermessagereceiver) method to subscribe to message receiving events. 
```typescript
// Step 3: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 4: Construct device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  bundleName: '',
  fingerprint: ''
}
// Define the device-side app parameter class as appParam.
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
  // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
}

// Step 5: Construct a callback function.
let callback = (p2pMessage: wearEngine.P2pMessage) => {
  console.info(`Succeeded in receiving message, the message is ${p2pMessage.content}.`);
}

// Step 6: Subscribe to message receiving events.
p2pClient.registerMessageReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in registering message receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to register message receiver. Code is ${error.code}, message is ${error.message}.`);
})
```

- Call the [unregisterMessageReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#unregistermessagereceiver) method for the phone app to cancel message reception from the wearable app. The callback object passed should be the one used during subscription. 
```typescript
p2pClient.unregisterMessageReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in unregistering message receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to unregister message receiver. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Subscribing to and Receiving Files Sent by the Wearable App

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Construct the device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-base#callback) function for file receiving from the peer device.
- Call the [registerFileReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#registerfilereceiver) method to subscribe to file receiving events. 
```typescript
// Step 3: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 4: Construct device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  bundleName: '',
  fingerprint: ''
}
// Define the device-side app parameter class as appParam.
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
  // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
}

// Step 5: Construct a callback function.
let callback = (p2pMessage: wearEngine.P2pFile) => {
  console.info(`Succeeded in receiving file.`);
}

// Step 6: Subscribe to file receiving events.
p2pClient.registerFileReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in registering file receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to register file receiver. Code is ${error.code}, message is ${error.message}.`);
})
```

- Call the [unregisterFileReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#unregisterfilereceiver) method for the phone app to cancel receiving files from the wearable app. The callback object passed should be the one used during subscription. 
```typescript
p2pClient.unregisterFileReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in unregistering file receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to unregister file receiver. Code is ${error.code}, message is ${error.message}.`);
})
```
