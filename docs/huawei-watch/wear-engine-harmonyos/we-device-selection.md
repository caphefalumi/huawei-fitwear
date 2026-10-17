<!--
  Title: Selecting a Target Device
  Catalog: harmonyos-guides
  Document ID: we-device-selection
  Updated: 2026-10-14 09:34:23
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection
-->
# Selecting a Target Device

If the list of connected devices contains more than one device, you need to select the target device as needed.

#### Selecting a Device Type

The [DeviceCategory](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#devicecategory) field in the [Device](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device) class indicates the device type, and you can use this field to select the target device.

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices based on the device type. 
```typescript
// Declare the target device.
let targetDevice: wearEngine.Device;
for (let index = 0; index < deviceList.length; index++) {
  // Select devices of the watch type.
  if (deviceList[index].category === wearEngine.DeviceCategory.WATCH) {
    targetDevice = deviceList[index];
    break;
  }
  if (index === deviceList.length - 1) {
    // An error is thrown if the target device does not exist.
    throw new Error('cannot find target device');
  }
}
// An error is thrown if targetDevice is undefined.
if (!targetDevice) {
    throw new Error('The value of targetDevice is undefined');
}
```

#### Selecting Devices Supporting Certain Capabilities

Query the capabilities supported by the obtained devices by referring to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_device_info).

## Selecting the Target Device Supporting Certain Wear Engine Capabilities

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices based on the supported Wear Engine capabilities. 
```typescript
async function fun() {
// Declare the target device.
  let targetDevice: wearEngine.Device;
  for (let index = 0; index < deviceList.length; index++) {
    // Select devices of the watch type.
    if (await device.isWearEngineCapabilitySupported(wearEngine.WearEngineCapability.MONITOR)) {
      targetDevice = deviceList[index];
      break;
    }
    if (index === deviceList.length - 1) {
    // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  }
  // An error is thrown if targetDevice is undefined.
  if (!targetDevice) {
    throw new Error('The value of targetDevice is undefined.');
  }
}
```

## Selecting the Target Device Supporting Certain Device Capabilities

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices based on the supported device capabilities. 
```typescript
async function fun() {
// Declare the target device.
  let targetDevice: wearEngine.Device;
  for (let index = 0; index < deviceList.length; index++) {
    // Select devices of the watch type.
    if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
      targetDevice = deviceList[index];
      break;
    }
    if (index === deviceList.length - 1) {
    // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  }
  // An error is thrown if targetDevice is undefined.
  if (!targetDevice) {
    throw new Error('The value of targetDevice is undefined.');
  }
}
```
