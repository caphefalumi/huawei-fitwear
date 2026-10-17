<!--
  Title: App-to-App Message Communications
  Catalog: harmonyos-guides
  Document ID: watch_p2p_communication
  Updated: 2026-10-14 09:34:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/watch_p2p_communication
-->
# App-to-App Message Communications

> **Note:** Before using this function, ensure that your app has been installed on the peer device. (For details, refer to [Phone App Development](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).) Both the app on the peer device and that on the wearable must be launched.

#### Checking Whether the App Has Been Installed on the Peer Device

- Select the peer device to communicate with from the list of connected devices by referring to [Querying Connected Peer Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/watch_query_connected_devices).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [isRemoteAppInstalled](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#isremoteappinstalled) method to check whether the specified app has been installed on the peer device. 
```typescript
// Define the peer-device-side app bundle name as remoteBundleName.
let remoteBundleName: string = '';

// Step 2: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 3: Check whether the specified app has been installed on the peer device.
p2pClient.isRemoteAppInstalled(targetDevice.randomId, remoteBundleName).then((isInstall) => {
  console.info(`Succeeded in checking remote app install, result is ${isInstall}.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to check remote app install. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Sending P2P Messages or Files to the Peer-Device-Side App

The maximum size of a message is 4096 bytes. If the size of a message exceeds the limit, the message can be divided into several packets or files (with each no larger than 100 MB) for sending.

If the wearable app is able to send messages and files, the peer-device-side app needs to support receiving these messages and files.

## Sending P2P Messages

- To use the utility class to construct the message body, import the required module first. 
```typescript
import { util } from '@kit.ArkTS';
```

- Select the peer device to communicate with from the list of connected devices by referring to [Querying Connected Peer Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/watch_query_connected_devices).
- Construct the peer-device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [P2pMessage](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pmessage) to be sent.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [sendMessage](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#sendmessage) method to send short messages from the wearable app to the peer-device-side app. Register a listener for the peer device, and the peer-device-side app will be able to receive messages from the wearable app. 
```typescript
// Step 2: Construct the peer-device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  // Set the peer-device-side app information, including the bundle name and fingerprint.
  bundleName: '',
  fingerprint: ''
}
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
}

// Set the message content to be sent, with a maximum length of 4096 bytes.
let messageContent: string = 'this is message';

//Step 3: Construct the message structure.
let textEncoder: util.TextEncoder = new util.TextEncoder;
let message: wearEngine.P2pMessage = {
  content: textEncoder.encodeInto(messageContent)
}

// Step 4: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 5: Send the message.
p2pClient.sendMessage(targetDevice.randomId, appParam, message).then((p2pResult) => {
  console.info(`Succeeded in sending message, result is ${p2pResult.code}.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to send message. Code is ${error.code}, message is ${error.message}.`);
})
```

## Sending Files

- file descriptor needs to be opened before a file is sent. To do so, import the module below first. 
```typescript
import { fileIo } from '@kit.CoreFileKit';
```

- Select the peer device to communicate with from the list of connected devices by referring to [Querying Connected Peer Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/watch_query_connected_devices).
- Construct the peer-device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [P2pFile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pfile) to be sent based on **filePath**.
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Call the [transferFile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#transferfile) method to send a file from the wearable app to the peer-device-side app. 
```typescript
// Step 2: Construct the peer-device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  // Set the peer-device-side app information, including the bundle name and fingerprint.
  bundleName: '',
  fingerprint: ''
}
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
}

// Step 3: Construct the file to be sent.
let p2pfile: wearEngine.P2pFile = {
  // Set the file path to be sent, which should not contain '..'.
  file: fileIo.openSync('')
}

// Step 4: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 5: Send the specified file to the peer device.
p2pClient.transferFile(targetDevice.randomId, appParam, p2pfile, (error: BusinessError, p2pResult: wearEngine.P2pResult) => {
  // Callback processing logic.
  if (error) {
    console.error(`Failed to transfer file. Code is ${error.code}, message is ${error.message}.`);
    return;
  }
  if (p2pResult.code) {
    if (p2pResult.code === wearEngine.P2pResultCode.COMMUNICATION_SUCCESS) {
      console.info(`Succeeded in transferring file, the result is ${p2pResult.code}.`);
    }
    console.info(`Failed to transfer file, the error code is ${p2pResult.code}.`);
  }
  if (p2pResult.progress) {
    console.info(`Succeeded in transfering file, the progress is ${p2pResult.progress}.`);
  }
});

fileIo.close(p2pfile.file);
```

#### Subscribing to and Receiving Messages Sent by the Peer-Device-Side App

- Select the peer device to communicate with from the list of connected devices by referring to [Querying Connected Peer Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/watch_query_connected_devices).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Construct the peer-device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-base#callback) function for message receiving from the peer device.
- Call the [registerMessageReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#registermessagereceiver) method to subscribe to message receiving events. 
```typescript
// Step 2: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 3: Construct the peer-device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  bundleName: '',
  fingerprint: ''
}
// Define the peer-device-side app parameter class as appParam.
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
}

// Step 4: Construct a callback function.
let callback = (p2pMessage: wearEngine.P2pMessage) => {
  console.info(`Succeeded in receiving message, the message is ${p2pMessage.content}.`);
}

// Step 5: Subscribe to message receiving events.
p2pClient.registerMessageReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in registering message receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to register message receiver. Code is ${error.code}, message is ${error.message}.`);
})
```

- Call the [unregisterMessageReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#unregistermessagereceiver) method for the wearable app to cancel message reception from the peer-device-side app. The callback function passed should be the one used during subscription. 
```typescript
p2pClient.unregisterMessageReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in unregistering message receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to unregister message receiver. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Subscribing to and Receiving Files Sent by the Peer-Device-Side App

- Select the peer device to communicate with from the list of connected devices by referring to [Querying Connected Peer Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/watch_query_connected_devices).
- Call the [getP2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetp2pclient) method to obtain the [P2pClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pclient) object.
- Construct the device-side app parameter [P2pAppParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#p2pappparam).
- Construct the [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-base#callback) function for file receiving from the peer device.
- Call the [registerFileReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#registerfilereceiver) method to subscribe to file receiving events. 
```typescript
// Step 2: Obtain the P2pClient object.
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

// Step 3: Construct the peer-device-side app parameters.
let appInfo: wearEngine.AppInfo = {
  bundleName: '',
  fingerprint: ''
}
// Define the peer-device-side app parameter class as appParam.
let appParam: wearEngine.P2pAppParam = {
  remoteApp: appInfo
}

// Step 4: Construct a callback function.
let callback = (p2pMessage: wearEngine.P2pFile) => {
  console.info(`Succeeded in receiving file.`);
}

// Step 5: Subscribe to file receiving events.
p2pClient.registerFileReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in registering file receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to register file receiver. Code is ${error.code}, message is ${error.message}.`);
})
```

- Call the [unregisterFileReceiver](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#unregisterfilereceiver) method for the wearable app to cancel file reception from the peer-device-side app. The callback function passed should be the one used during subscription. 
```typescript
p2pClient.unregisterFileReceiver(targetDevice.randomId, appParam, callback).then(() => {
  console.info(`Succeeded in unregistering file receiver.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to unregister file receiver. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Launching the Wearable App from the Peer-Device-Side App Using the startRemoteApp Method

If the peer-device-side app calls the **startRemoteApp** method to launch the wearable app, you need to configure the specific page to be displayed on the wearable app after it is launched.

- Create the **HiWearMainAbility.ets** file, which should be inherited from **UIAbility**. Override the **onWindowStageCreate** function to configure the page to be redirected to. 
```typescript
// Ensure to inherit UIAbility.
import hilog from '@ohos.hilog';
import UIAbility from '@ohos.app.ability.UIAbility';
import window from '@ohos.window';

/**
 * The peer-device-side app calls the startRemoteApp method to launch HiWearMainAbility of the wearable app.
 */
export default class HiWearMainAbility extends UIAbility {
  onWindowStageCreate(windowStage: window.WindowStage): void {
    hilog.info(0x0000, 'HiWearMainAbility', '%{public}s', 'Ability onWindowStageCreate');

    // Configure the page to be redirected to as XXXPage.
    windowStage.loadContent("pages/XXXPage", (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'HiWearMainAbility', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'HiWearMainAbility', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
  }
}
```

- Configure **HiWearMainAbility** in **abilities** of **module.json5**. For details, please refer to [abilities](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file#abilities). Set **name** to **HiWearMainAbility**.
- Set **srcEntry** as the path of the **HiWearMainAbility.ets** file.
- Specify **startWindowIcon** as the index of the icon resource file on the **UIAbility** startup page.
- Specify **startWindowBackground** as the index of the background color resource file on the **UIAbility** startup page. 
```typescript
"module": {
  "name": "xxxx",
  "type": "entry",
  "description": "xxxx",
  "mainElement": "xxxx",
  "deviceTypes": [],
  "pages": "xxxx",
  "abilities": [
    {
    "name": "HiWearMainAbility",
    "srcEntry": "xxxx",
    "startWindowIcon": "xxxx", // Index of the icon resource file on the UIAbility startup page.
    "startWindowBackground": "xxxx" // Index of the background color resource file on the UIAbility startup page.
  }],
  "metadata": []
  }
```

- Configure the following in **metadata** of **module.json5**: peer-device-side app bundle name, name of the ability to be started, and whether to wait for the wearable app to complete subscribing to messages or files receiving. When configuring the peer-device-side app bundle name: Set **name** to **wearEngineRemoteAppNameList** and **value** to the peer-device-side app bundle name. If there are multiple app bundle names, separate them with commas (,). The maximum size of **value** is 4 KB.
- When configuring the name of the ability to be started: Set **name** to **wearEngineUIAbilityName** and **value** to the name of the UIAbility to be started. If the parameters are not set, **HiWearMainAbility** is started by default.
- When configuring **AwaitRegisterReceiver**: Set **name** to **wearEngineAwaitRegisterReceiver** and **value** to **true** or **false**. The value **true** means to wait for the wearable app to complete subscribing to messages or files receiving, and **false** means the opposite. 
```typescript
"module": {
  "name": "xxxx",
  "type": "entry",
  "description": "xxxx",
  "mainElement": "xxxx",
  "deviceTypes": [],
  "pages": "xxxx",
  "abilities": [],
  "metadata": [ // Configure the following information:
      {
        "name": "wearEngineRemoteAppNameList",
        "value": "xxxx1,xxxx2,xxxx3"
      },
      {
        "name": "wearEngineUIAbilityName",
        "value": "xxxx"
      },
      {
        "name": "wearEngineAwaitRegisterReceiver",
        "value": "true"
      }
  ]}
```
