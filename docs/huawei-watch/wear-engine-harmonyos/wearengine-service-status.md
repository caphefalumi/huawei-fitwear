<!--
  Title: Managing the Connection Status Between Your App and Wear Engine Kit
  Catalog: harmonyos-guides
  Document ID: wearengine_service_status
  Updated: 2026-10-14 09:34:25
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_service_status
-->
# Managing the Connection Status Between Your App and Wear Engine Kit

#### Monitoring the Connection Status Between Your App and Wear Engine Kit

If the HUAWEI Health app stops running in the background (for example, due to high power consumption), your app may disconnect from Wear Engine Kit. If you cannot determine whether your app has been disconnected from Wear Engine Kit, you can use this feature to know the app's connection status. The prerequisite is that you have subscribed to connection status monitoring for Wear Engine Kit before the disconnection occurs.

- Before using Wear Engine Kit, import **wearEngine** and related modules. 
```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';
```

- Construct a callback function to be executed when disconnection occurs. 
```typescript
let callback = () => {
  console.info(`The service destruction event`);
};
```

- Call the [on](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearengineon) method of [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to subscribe to the disconnection event between your app and Wear Engine Kit. 
```typescript
try {
  wearEngine.on('serviceDie', callback);
  console.info(`Succeeded in subscribing the service destruction event.`);
} catch (error) {
  const err: BusinessError = error as BusinessError;
  console.error(`Failed to subscribe the service destruction event. Code is ${err.code}, message is ${err.message}`);
};
```

- Call the [off](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearengineoff) method of [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to unsubscribe from the disconnection event between your app and Wear Engine Kit. The same callback object used during subscription must be passed. 
```typescript
try {
  wearEngine.off('serviceDie', callback);
  console.info(`Succeeded in unsubscribing the service destruction event.`);
} catch (error) {
  const err: BusinessError = error as BusinessError;
  console.error(`Failed to unsubscribe the service destruction event. Code is ${err.code}, message is ${err.message}`);
};
```

#### Disconnecting Your App from Wear Engine Kit

Once the connection is lost, Wear Engine Kit resources will be released, and features such as device status monitoring, message receiving, and file receiving will become unavailable. The callback function for subscribing to the server disconnection event will not be executed, and the previously registered callback functions will be cleared. To reconnect them, call any API.

- Before using Wear Engine Kit, import **wearEngine** and related modules. 
```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';
```

- Call the [destroy](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginedestroy) method of [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to disconnect your app from Wear Engine Kit. 
```typescript
wearEngine.destroy().then(() => {
  console.info(`Succeeded in destroying wear engine channel`);
}).catch((error: BusinessError) => {
  console.error(`Failed to destroy wear engine channel. Code is ${error.code}, message is ${error.message}`);
});
```
