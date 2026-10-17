<!--
  Title: Querying Connected Peer Devices
  Catalog: harmonyos-guides
  Document ID: watch_query_connected_devices
  Updated: 2026-10-14 09:33:49
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/watch_query_connected_devices
-->
# Querying Connected Peer Devices

Wear Engine provides the API for querying the list of peer devices connected to a wearable device.

You are advised to implement this API before calling other APIs of Wear Engine, and select the target device from the list of connected peer devices.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetdeviceclient) method to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#deviceclient) object.
- Call the [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices) method to query the list of connected wearable devices.
- Select the peer device to communicate with from the returned list.
- Query the operating system type of the peer device. 
```typescript
// Before using Wear Engine, import wearEngine and other related modules.
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

// Step 1: Obtain the DeviceClient object.
// this.getUIContext().getHostContext() indicates the Context object of the app.
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
// Declare the target device.
let targetDevice: wearEngine.Device;

// Step 2: Call the getConnectedDevices method to query the list of peer devices that the user has connected.
deviceClient.getConnectedDevices().then(devices => {
  console.info(`Succeeded in getting deviceList, deviceList number is ${devices.length}`);
  // Step 3: Select the device to communicate with from the list of connected devices.
  if (devices.length > 0) {
    targetDevice = devices[0];
    console.info(`Succeeded to get target device.`);
    // Step 4: Query the operating system type of the peer device.
    //
    let osCategory: wearEngine.OsCategory | undefined = targetDevice.osCategory;
    console.info(`The osCategory of target device is ${osCategory}`);
  } else {
    console.warn(`Failed to get target device. deviceList is empty.`);
  }
}).catch((error: BusinessError) => {
  // Process the exception captured if the API call fails.
  console.error(`Failed to get deviceList. Code is ${error.code}, message is ${error.message}`);
})
```
