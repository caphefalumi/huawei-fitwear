<!--
  Title: Querying Wearable Device Information
  Catalog: harmonyos-guides
  Document ID: query_device_info
  Updated: 2026-10-14 09:34:22
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_device_info
-->
# Querying Wearable Device Information

```typescript
// Before using Wear Engine, import the wearEngine and related modules.
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';
```

#### Querying Whether the Wearable Device Supports Certain Wear Engine Capabilities

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

Call the [isWearEngineCapabilitySupported](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#iswearenginecapabilitysupported) method in the [Device](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device) object to query whether the wearable device supports certain Wear Engine capabilities.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetdeviceclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#deviceclient) object. 
```typescript
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
```

- Call the [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices) method to obtain the connected device list. 
```typescript
let deviceList: wearEngine.Device[] = [];
deviceClient.getConnectedDevices().then(devices => {
  // Store the list of connected devices.
  deviceList = devices;
  console.info(`Succeeded in getting deviceList, devices number is ${deviceList.length}`);
}).catch((error: BusinessError) => {
  // Process the exception captured if the API call fails.
  console.error(`Failed to get deviceList. Code is ${error.code}, message is ${error.message}`);
})
```

- Select the target device from the device list.
- Call [isWearEngineCapabilitySupported](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#iswearenginecapabilitysupported) in the [Device](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device) object to query whether this device supports the passed Wear Engine capability (**true**: supported; **false**: not supported). The following uses the P2P capability as an example. 
```typescript
if (deviceList.length > 0) {
  // Step 3 Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
  let targetDevice: wearEngine.Device = deviceList[0];

  // Step 4 Call the method to check whether certain Wear Engine capability is supported (the P2P capability is used as an example).
  targetDevice.isWearEngineCapabilitySupported(wearEngine.WearEngineCapability.P2P_COMMUNICATION).then((isSupportP2P) => {
    console.info(`Succeeded in checking p2p capability, result is ${isSupportP2P}`);
  }).catch((error: BusinessError) => {
    console.error(`Failed to check p2p capability. Code is ${error.code}, message is ${error.message}`);
  })
}
```

#### Querying Whether the Wearable Device Supports Certain Device Capabilities

> **Note:** To call this API, you need to apply for the basic device information permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

Call the [isDeviceCapabilitySupported](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#isdevicecapabilitysupported) method in the [Device](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device) object to query whether the wearable device supports certain Device capabilities.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetdeviceclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#deviceclient) object. 
```typescript
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
```

- Call the [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices) method to obtain the connected device list. 
```typescript
let deviceList: wearEngine.Device[] = [];
deviceClient.getConnectedDevices().then(devices => {
  // Store the list of connected devices.
  deviceList = devices;
  console.info(`Succeeded in getting deviceList, devices number is ${deviceList.length}`);
}).catch((error: BusinessError) => {
  // Process the exception captured if the API call fails.
  console.error(`Failed to get deviceList. Code is ${error.code}, message is ${error.message}`);
})
```

- Select the target device from the device list.
- Call [isDeviceCapabilitySupported](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#isdevicecapabilitysupported) in the [Device](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device) object to query whether this device supports the passed device capability (**true**: supported; **false**: not supported). 
```typescript
if (deviceList.length > 0) {
  // Step 3 Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
  let targetDevice: wearEngine.Device = deviceList[0];

  // Step 4 Call the device method to query whether a certain device capability is supported (the app installation capability is used as an example).
  targetDevice.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION).then((isSupportInstall) => {
    console.info(`Succeeded in checking install app capability, result is ${isSupportInstall}`);
  }).catch((error: BusinessError) => {
    console.error(`Failed to check install app capability. Code is ${error.code}, message is ${error.message}`);
  })
}
```

#### Querying the Device SN

> **Note:** To call this API, you need to apply for the device identifier permission (restricted) on HUAWEI Developers and obtain user authorization. For details, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

Call the [getSerialNumber](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getserialnumber) method in the [Device](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device) object to query the SN of the wearable device.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetdeviceclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#deviceclient) object. 
```typescript
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
```

- Call the [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices) method to obtain the connected device list. 
```typescript
let deviceList: wearEngine.Device[] = [];
deviceClient.getConnectedDevices().then(devices => {
  // Store the list of connected devices.
  deviceList = devices;
  console.info(`Succeeded in getting deviceList, devices number is ${deviceList.length}`);
}).catch((error: BusinessError) => {
  // Process the exception captured if the API call fails.
  console.error(`Failed to get deviceList. Code is ${error.code}, message is ${error.message}`);
})
```

- Select the target device from the device list.
- Call the [getSerialNumber](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getserialnumber) method in the [Device](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device) object to query the SN of the wearable device. 
```typescript
if (deviceList.length > 0) {
  // Step 3 Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
  let targetDevice: wearEngine.Device = deviceList[0];

  //Step 4 Call the device method to query the SN.
  targetDevice.getSerialNumber().then((sn) => {
    console.info(`Succeeded in getting device SN, result is ${sn}`);
  }).catch((error: BusinessError) => {
    console.error(`Failed to get device SN. Code is ${error.code}, message is ${error.message}`);
  })
}
```
