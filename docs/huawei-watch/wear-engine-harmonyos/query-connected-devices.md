<!--
  Title: Querying Connected Wearables
  Catalog: harmonyos-guides
  Document ID: query_connected_devices
  Updated: 2026-10-14 09:34:17
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices
-->
# Querying Connected Wearables

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

Wear Engine Kit provides the API for querying the list of connected wearables (which are connected to the phone-side HUAWEI Health app and support Wear Engine Kit).

You are advised to implement this API before calling other APIs of Wear Engine Kit.

- The app calls the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetdeviceclient) method of [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#deviceclient) object.
- Call the [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices) method to query the list of connected wearables. 
```typescript
// Before using Wear Engine Kit, import wearEngine and related modules.
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

// Step 1: Obtain the DeviceClient object.
// this.getUIContext().getHostContext() indicates the Context object of the app.
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
// Create a list to store the returned wearables.
let deviceList: wearEngine.Device[] = [];

// Step 2: Call the getConnectedDevices method to query whether the user has a connected wearable.
deviceClient.getConnectedDevices().then(devices => {
  // Process the returned device list.
  deviceList = devices;
  console.info(`Succeeded in getting deviceList, deviceList number is ${deviceList.length}`);
}).catch((error: BusinessError) => {
  // Process the exception captured if the API call fails.
  console.error(`Failed to get deviceList. Code is ${error.code}, message is ${error.message}`);
});
```
