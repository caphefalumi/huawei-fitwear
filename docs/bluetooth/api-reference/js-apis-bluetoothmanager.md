<!--
  Title: @ohos.bluetoothManager (Bluetooth)
  Catalog: harmonyos-references
  Document ID: js-apis-bluetoothmanager
  Updated: 2026-10-14 09:42:10
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager
-->
# @ohos.bluetoothManager (Bluetooth)

The **Bluetooth** module provides classic Bluetooth capabilities and [Bluetooth Low Energy (BLE)](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#ble) scan and advertising.

> **Note:** The initial APIs of this module are supported since API version 9. Newly added APIs will be marked with a superscript to indicate their earliest API version. The APIs provided by this module are no longer maintained since API version 10. You are advised to use profile APIs of [@ohos.bluetooth.ble (Bluetooth BLE Module)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble).

#### Modules to Import

```javascript
import { bluetoothManager } from '@kit.ConnectivityKit';
```

#### bluetoothManager.enableBluetooth(deprecated)

enableBluetooth(): void

Enables Bluetooth.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [access.enableBluetooth](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessenablebluetooth) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    bluetoothManager.enableBluetooth();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.disableBluetooth(deprecated)

disableBluetooth(): void

Disables Bluetooth.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [access.disableBluetooth](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessdisablebluetooth) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    bluetoothManager.disableBluetooth();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ", errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getLocalName(deprecated)

getLocalName(): string

Obtains the name of the local Bluetooth device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.getLocalName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiongetlocalname) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| string | Name of the local Bluetooth device obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let localName: string = bluetoothManager.getLocalName();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getState(deprecated)

getState(): BluetoothState

Obtains the Bluetooth state.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [access.getState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessgetstate) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [BluetoothState](#bluetoothstatedeprecated) | Bluetooth state obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let state: bluetoothManager.BluetoothState = bluetoothManager.getState();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getBtConnectionState(deprecated)

getBtConnectionState(): ProfileConnectionState

Obtains the local profile connection status.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.getProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiongetprofileconnectionstate) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstatedeprecated) | Profile connection state obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let connectionState: bluetoothManager.ProfileConnectionState = bluetoothManager.getBtConnectionState();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.setLocalName(deprecated)

setLocalName(name: string): void

Sets the name of the local Bluetooth device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.setLocalName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionsetlocalnamedeprecated) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string | Yes | Bluetooth device name to set. It cannot exceed 248 bytes. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    bluetoothManager.setLocalName('device_name');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.pairDevice(deprecated)

pairDevice(deviceId: string): void

Initiates Bluetooth pairing.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.pairDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionpairdevice) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device to pair, for example, XX:XX:XX:XX:XX:XX. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    // The address can be scanned.
    bluetoothManager.pairDevice("XX:XX:XX:XX:XX:XX");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getProfileConnectionState(deprecated)

getProfileConnectionState(profileId: ProfileId): ProfileConnectionState

Obtains the connection status of the specified profile.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.getProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiongetprofileconnectionstate) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| profileId | ProfileId | Yes | ID of the profile to obtain, for example, **PROFILE_A2DP_SOURCE**. |

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstatedeprecated) | Profile connection state obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let result: bluetoothManager.ProfileConnectionState = bluetoothManager.getProfileConnectionState(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getRemoteDeviceName(deprecated)

getRemoteDeviceName(deviceId: string): string

Obtains the name of the remote Bluetooth device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.getRemoteDeviceName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiongetremotedevicename) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| string | Device name (a string) obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let remoteDeviceName: string = bluetoothManager.getRemoteDeviceName("XX:XX:XX:XX:XX:XX");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getRemoteDeviceClass(deprecated)

getRemoteDeviceClass(deviceId: string): DeviceClass

Obtains the class of the remote Bluetooth device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.getRemoteDeviceClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiongetremotedeviceclass) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| [DeviceClass](#deviceclassdeprecated) | Class of the remote device obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let remoteDeviceClass: bluetoothManager.DeviceClass  = bluetoothManager.getRemoteDeviceClass("XX:XX:XX:XX:XX:XX");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getPairedDevices(deprecated)

getPairedDevices(): Array<string>

Obtains the paired devices.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.getPairedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiongetpaireddevices) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of the paired Bluetooth devices. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let devices: Array<string> = bluetoothManager.getPairedDevices();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.setBluetoothScanMode(deprecated)

setBluetoothScanMode(mode: ScanMode, duration: number): void

Sets the Bluetooth scan mode so that the device can be discovered by a remote device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.setBluetoothScanMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionsetbluetoothscanmode) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| mode | [ScanMode](#scanmodedeprecated) | Yes | Bluetooth scan mode to set. |
| duration | number | Yes | Duration (in ms) in which the device can be discovered. The value **0** indicates unlimited time. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    // The device can be discovered and connected only when the discoverable and connectable mode is used.
    bluetoothManager.setBluetoothScanMode(bluetoothManager.ScanMode.SCAN_MODE_CONNECTABLE_GENERAL_DISCOVERABLE, 100);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.getBluetoothScanMode(deprecated)

getBluetoothScanMode(): ScanMode

Obtains the Bluetooth scan mode.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.getBluetoothScanMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiongetbluetoothscanmode) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [ScanMode](#scanmodedeprecated) | Bluetooth scan mode to set. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let scanMode: bluetoothManager.ScanMode = bluetoothManager.getBluetoothScanMode();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.startBluetoothDiscovery(deprecated)

startBluetoothDiscovery(): void

Starts Bluetooth scan to discover remote devices.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.startBluetoothDiscovery](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionstartbluetoothdiscovery) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let deviceId: Array<string>;
function onReceiveEvent(data: Array<string>) {
    deviceId = data;
}
try {
    bluetoothManager.on('bluetoothDeviceFind', onReceiveEvent);
    bluetoothManager.startBluetoothDiscovery();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.stopBluetoothDiscovery(deprecated)

stopBluetoothDiscovery(): void

Stops Bluetooth scan.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.stopBluetoothDiscovery](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionstopbluetoothdiscovery) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    bluetoothManager.stopBluetoothDiscovery();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.setDevicePairingConfirmation(deprecated)

setDevicePairingConfirmation(device: string, accept: boolean): void

Sets the device pairing confirmation.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.setDevicePairingConfirmation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionsetdevicepairingconfirmation) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH and ohos.permission.MANAGE_BLUETOOTH (available only for system applications)

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |
| accept | boolean | Yes | Whether to accept the pairing request. The value **true** means to accept the pairing request, and the value **false** means the opposite. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// Subscribe to the pinRequired event and configure the pairing confirmation after receiving a pairing request from the remote device.
function onReceivePinRequiredEvent(data: bluetoothManager.PinRequiredParam) { // data is the input parameter for the pairing request.
    console.info('pin required  = '+ JSON.stringify(data));
    bluetoothManager.setDevicePairingConfirmation(data.deviceId, true);
}
try {
    bluetoothManager.on("pinRequired", onReceivePinRequiredEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.on('bluetoothDeviceFind')(deprecated)

on(type: 'bluetoothDeviceFind', callback: Callback<Array<string>>): void

Subscribes to the Bluetooth device discovery events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.on('bluetoothDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiononbluetoothdevicefind) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bluetoothDeviceFind**, which indicates an event of discovering a Bluetooth device. |
| callback | Callback<Array<string>> | Yes | Callback used to return the discovered devices. You need to implement this callback. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: Array<string>) { // data is an array of Bluetooth device addresses.
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('bluetoothDeviceFind', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.off('bluetoothDeviceFind')(deprecated)

off(type: 'bluetoothDeviceFind', callback?: Callback<Array<string>>): void

Unsubscribes from the Bluetooth device discovery events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.off('bluetoothDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionoffbluetoothdevicefind) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bluetoothDeviceFind**, which indicates an event of discovering a Bluetooth device. |
| callback | Callback<Array<string>> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: Array<string>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('bluetoothDeviceFind', onReceiveEvent);
    bluetoothManager.off('bluetoothDeviceFind', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.on('pinRequired')(deprecated)

on(type: 'pinRequired', callback: Callback<PinRequiredParam>): void

Subscribes to the pairing request events of the remote Bluetooth device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.on('pinRequired')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiononpinrequired) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **pinRequired**, which indicates a pairing request event. |
| callback | Callback<[PinRequiredParam](#pinrequiredparamdeprecated)> | Yes | Callback used to return the pairing request. You need to implement this callback. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.PinRequiredParam) { // data is the pairing request parameter.
    console.info('pin required = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('pinRequired', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.off('pinRequired')(deprecated)

off(type: 'pinRequired', callback?: Callback<PinRequiredParam>): void

Unsubscribes from the pairing request events of the remote Bluetooth device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.off('pinRequired')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionoffpinrequired) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **pinRequired**, which indicates a pairing request event. |
| callback | Callback<[PinRequiredParam](#pinrequiredparamdeprecated)> | No | Callback to unregister. The input parameter is the pairing request parameter. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.PinRequiredParam) {
    console.info('pin required = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('pinRequired', onReceiveEvent);
    bluetoothManager.off('pinRequired', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.on('bondStateChange')(deprecated)

on(type: 'bondStateChange', callback: Callback<BondStateParam>): void

Subscribes to the Bluetooth pairing state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.on('bondStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectiononbondstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bondStateChange**, which indicates a Bluetooth pairing state change event. |
| callback | Callback<[BondStateParam](#bondstateparamdeprecated)> | Yes | Callback used to return the pairing state. You need to implement this callback. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.BondStateParam) { // data, as the input parameter of the callback, indicates the pairing state.
    console.info('pair state = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('bondStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.off('bondStateChange')(deprecated)

off(type: 'bondStateChange', callback?: Callback<BondStateParam>): void

Unsubscribes from the Bluetooth pairing state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.off('bondStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#connectionoffbondstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bondStateChange**, which indicates a Bluetooth pairing state change event. |
| callback | Callback<[BondStateParam](#bondstateparamdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.BondStateParam) {
    console.info('bond state = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('bondStateChange', onReceiveEvent);
    bluetoothManager.off('bondStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.on('stateChange')(deprecated)

on(type: 'stateChange', callback: Callback<BluetoothState>): void

Subscribes to Bluetooth state events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [access.on('stateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessonstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **stateChange**, which indicates a Bluetooth state change event. |
| callback | Callback<[BluetoothState](#bluetoothstatedeprecated)> | Yes | Callback used to return the Bluetooth connection state. You need to implement this callback. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.BluetoothState) {
    console.info('bluetooth state = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('stateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.off('stateChange')(deprecated)

off(type: 'stateChange', callback?: Callback<BluetoothState>): void

Unsubscribes from Bluetooth state events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [access.off('stateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessoffstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **stateChange**, which indicates a Bluetooth state change event. |
| callback | Callback<[BluetoothState](#bluetoothstatedeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.BluetoothState) {
    console.info('bluetooth state = '+ JSON.stringify(data));
}
try {
    bluetoothManager.on('stateChange', onReceiveEvent);
    bluetoothManager.off('stateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### bluetoothManager.sppListen(deprecated)

sppListen(name: string, option: SppOption, callback: AsyncCallback<number>): void

Creates a server listening socket.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.sppListen](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketspplisten) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string | Yes | Name of the service. |
| option | [SppOption](#sppoptiondeprecated) | Yes | Serial port profile (SPP) listening configuration. |
| callback | AsyncCallback<number> | Yes | Callback used to return the server socket ID. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let serverNumber = -1;
function serverSocket(code: BusinessError, number: number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth serverSocket Number: ${number}`);
    serverNumber = number;
  }
}

let sppOption: bluetoothManager.SppOption = {uuid: '00001810-0000-1000-8000-00805F9B34FB', secure: false, type: 0};
try {
    bluetoothManager.sppListen('server1', sppOption, serverSocket);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.sppAccept(deprecated)

sppAccept(serverSocket: number, callback: AsyncCallback<number>): void

Listens for a connection to be made to this socket from the client and accepts it.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.sppAccept](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketsppaccept) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serverSocket | number | Yes | Server socket ID. |
| callback | AsyncCallback<number> | Yes | Callback used to return the client socket ID. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let serverNumber = -1;
function serverSocket(code: BusinessError, number: number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth serverSocket Number: ${number}`);
    serverNumber = number;
  }
}
let clientNumber = -1;
function acceptClientSocket(code: BusinessError, number: number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth clientSocket Number: ${number}`);
    // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the server.
    clientNumber = number;
  }
}
try {
    bluetoothManager.sppAccept(serverNumber, acceptClientSocket);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.sppConnect(deprecated)

sppConnect(device: string, option: SppOption, callback: AsyncCallback<number>): void

Initiates an SPP connection to a remote device from the client.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.sppConnect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketsppconnect) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |
| option | [SppOption](#sppoptiondeprecated) | Yes | Configuration for connecting to the SPP client. |
| callback | AsyncCallback<number> | Yes | Callback used to return the client socket ID. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';

let clientNumber = -1;
function clientSocket(code: BusinessError, number: number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
let sppOption: bluetoothManager.SppOption = {uuid: '00001810-0000-1000-8000-00805F9B34FB', secure: false, type: 0};
try {
    bluetoothManager.sppConnect('XX:XX:XX:XX:XX:XX', sppOption, clientSocket);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.sppCloseServerSocket(deprecated)

sppCloseServerSocket(socket: number): void

Closes the listening socket of the server.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.sppCloseServerSocket](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketsppcloseserversocket) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| socket | number | Yes | ID of the listening socket on the server. The ID is obtained by **sppListen**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let serverNumber = -1;
function serverSocket(code: BusinessError, number: number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth serverSocket Number: ${number}`);
    serverNumber = number;
  }
}
try {
    bluetoothManager.sppCloseServerSocket(serverNumber);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.sppCloseClientSocket(deprecated)

sppCloseClientSocket(socket: number): void

Closes the client socket.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.sppCloseClientSocket](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketsppcloseclientsocket) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| socket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code: BusinessError, number: number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
try {
    bluetoothManager.sppCloseClientSocket(clientNumber);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.sppWrite(deprecated)

sppWrite(clientSocket: number, data: ArrayBuffer): void

Writes data to the remote device through the socket.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.sppWrite](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketsppwrite) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientSocket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |
| data | ArrayBuffer | Yes | Data to write. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2901054 | IO error. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code: BusinessError, number: number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
let arrayBuffer = new ArrayBuffer(8);
let data = new Uint8Array(arrayBuffer);
data[0] = 123;
try {
    bluetoothManager.sppWrite(clientNumber, arrayBuffer);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.on('sppRead')(deprecated)

on(type: 'sppRead', clientSocket: number, callback: Callback<ArrayBuffer>): void

Subscribes to the SPP read request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.on('sppRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketonsppread) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **sppRead**, which indicates an SPP read request event. |
| clientSocket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |
| callback | Callback<ArrayBuffer> | Yes | Callback used to return the data read. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2901054 | IO error. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code: BusinessError, number: number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
function dataRead(dataBuffer: ArrayBuffer) {
  let data = new Uint8Array(dataBuffer);
  console.info(`bluetooth data is: ${data[0]}`);
}
try {
    bluetoothManager.on('sppRead', clientNumber, dataRead);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.off('sppRead')(deprecated)

off(type: 'sppRead', clientSocket: number, callback?: Callback<ArrayBuffer>): void

Unsubscribes from the SPP read request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.off('sppRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#socketoffsppread) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **sppRead**, which indicates an SPP read request event. |
| clientSocket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |
| callback | Callback<ArrayBuffer> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code: BusinessError, number: number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
try {
    bluetoothManager.off('sppRead', clientNumber);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### bluetoothManager.getProfileInstance(deprecated)

getProfileInstance(profileId: ProfileId): A2dpSourceProfile | HandsFreeAudioGatewayProfile | HidHostProfile | PanProfile

Obtains a profile instance. API version 9 is added with **HidHostProfile** and **PanProfile**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| profileId | [ProfileId](#profileiddeprecated) | Yes | ID of the profile to obtain, for example, **PROFILE_A2DP_SOURCE**. |

**Return value**

| Type | Description |
| --- | --- |
| [A2dpSourceProfile](#a2dpsourceprofile) \| [HandsFreeAudioGatewayProfile](#handsfreeaudiogatewayprofiledeprecated) \| [HidHostProfile](#hidhostprofiledeprecated) \| [PanProfile](#panprofile) | Profile instance obtained, which can be **A2dpSourceProfile**, **HandsFreeAudioGatewayProfile**, **HidHostProfile**, or **PanProfile**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let hidHost: bluetoothManager.HidHostProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_HID_HOST);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### BLE

Provides APIs for operating and managing Bluetooth.

## createGattServer(deprecated)

createGattServer(): GattServer

Creates a **GattServer** instance.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.createGattServer](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blecreategattserver) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [GattServer](#gattserver) | **GattServer** instance created. Before using an API of this class, you must create a **GattSever** instance. |

**Example**

```javascript
let gattServer: bluetoothManager.GattServer  = bluetoothManager.BLE.createGattServer();
```

## createGattClientDevice(deprecated)

createGattClientDevice(deviceId: string): GattClientDevice

Creates a **GattClientDevice** instance.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.createGattClientDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blecreategattclientdevice) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| [GattClientDevice](#gattclientdevice) | **GattClientDevice** instance created. Before using an API of the client, you must create a **GattClientDevice** instance. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let device: bluetoothManager.GattClientDevice = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## getConnectedBLEDevices(deprecated)

getConnectedBLEDevices(): Array<string>

Obtains the BLE devices connected to this device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.getConnectedBLEDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blegetconnectedbledevices) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of the BLE devices connected to this device. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let result: Array<string>  = bluetoothManager.BLE.getConnectedBLEDevices();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## startBLEScan(deprecated)

startBLEScan(filters: Array<ScanFilter>, options?: ScanOptions): void

Starts a BLE scan.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.startBLEScan](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blestartblescan) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| filters | Array<[ScanFilter](#scanfilterdeprecated)> | Yes | Criteria for filtering the scan result. Set this parameter to **null** if you do not want to filter the scan result. |
| options | [ScanOptions](#scanoptionsdeprecated) | No | Scan options. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: Array<bluetoothManager.ScanResult>) {
    console.info('BLE scan device find result = '+ JSON.stringify(data));
}
try {
    bluetoothManager.BLE.on("BLEDeviceFind", onReceiveEvent);
    let scanfilter: bluetoothManager.ScanFilter = {
        deviceId:"XX:XX:XX:XX:XX:XX",
        name:"test",
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb"
    };
    let scanoptions: bluetoothManager.ScanOptions = {
        interval: 500,
        dutyMode: bluetoothManager.ScanDuty.SCAN_MODE_LOW_POWER,
        matchMode: bluetoothManager.MatchMode.MATCH_MODE_AGGRESSIVE,
    }
    bluetoothManager.BLE.startBLEScan([scanfilter], scanoptions);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## stopBLEScan(deprecated)

stopBLEScan(): void

Stops the BLE scan.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.stopBLEScan](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blestopblescan) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    bluetoothManager.BLE.stopBLEScan();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('BLEDeviceFind')(deprecated)

on(type: 'BLEDeviceFind', callback: Callback<Array<ScanResult>>): void

Subscribe to the BLE device discovery events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.on('BLEDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#bleonbledevicefind) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEDeviceFind**, which indicates an event of discovering a BLE device. |
| callback | Callback<Array<[ScanResult](#scanresultdeprecated)>> | Yes | Callback used to return the discovered devices. You need to implement this callback. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: Array<bluetoothManager.ScanResult>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
try {
    bluetoothManager.BLE.on('BLEDeviceFind', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('BLEDeviceFind')(deprecated)

off(type: 'BLEDeviceFind', callback?: Callback<Array<ScanResult>>): void

Unsubscribes from the BLE device discovery events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.off('BLEDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#bleoffbledevicefind) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEDeviceFind**, which indicates an event of discovering a BLE device. |
| callback | Callback<Array<[ScanResult](#scanresultdeprecated)>> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: Array<bluetoothManager.ScanResult>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
try {
    bluetoothManager.BLE.on('BLEDeviceFind', onReceiveEvent);
    bluetoothManager.BLE.off('BLEDeviceFind', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### BaseProfile

Provides the profile base class.

## getConnectionDevices(deprecated)

getConnectionDevices(): Array<string>

Obtains the connected devices.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofilegetconnecteddevices) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of the connected devices. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let a2dpSrc: bluetoothManager.A2dpSourceProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE) as bluetoothManager.A2dpSourceProfile;
    let retArray: Array<string> = a2dpSrc.getConnectionDevices();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## getDeviceState(deprecated)

getDeviceState(device: string): ProfileConnectionState

Obtains the connection state of the profile.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.getConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofilegetconnectionstate) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstatedeprecated) | Profile connection state obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let a2dpSrc: bluetoothManager.A2dpSourceProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE) as bluetoothManager.A2dpSourceProfile;
    let ret: bluetoothManager.ProfileConnectionState = a2dpSrc.getDeviceState('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### A2dpSourceProfile

Before using an API of **A2dpSourceProfile**, you need to create an instance of this class by using **getProfile()**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [a2dp.A2dpSourceProfile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-a2dp#a2dpsourceprofile) instead.

## connect(deprecated)

connect(device: string): void

Sets up an Advanced Audio Distribution Profile (A2DP) connection.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. The substitute API is available only for system applications.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let a2dpSrc: bluetoothManager.A2dpSourceProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE) as bluetoothManager.A2dpSourceProfile;
    a2dpSrc.connect('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## disconnect(deprecated)

disconnect(device: string): void

Disconnects an A2DP connection.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. The substitute API is available only for system applications.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let a2dpSrc: bluetoothManager.A2dpSourceProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE) as bluetoothManager.A2dpSourceProfile;
    a2dpSrc.disconnect('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('connectionStateChange')(deprecated)

on(type: 'connectionStateChange', callback: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Subscribes to the A2DP connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.on('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileonconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | Yes | Callback used to return the A2DP connection state. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('a2dp state = '+ JSON.stringify(data));
}
try {
let a2dpSrc: bluetoothManager.A2dpSourceProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE) as bluetoothManager.A2dpSourceProfile;
a2dpSrc.on('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## off('connectionStateChange')(deprecated)

off(type: 'connectionStateChange', callback?: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Unsubscribes from the A2DP connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.off('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileoffconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | No | Callback to unregister. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('a2dp state = '+ JSON.stringify(data));
}
try {
let a2dpSrc: bluetoothManager.A2dpSourceProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE) as bluetoothManager.A2dpSourceProfile;
a2dpSrc.on('connectionStateChange', onReceiveEvent);
a2dpSrc.off('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getPlayingState(deprecated)

getPlayingState(device: string): PlayingState

Obtains the playing state of a device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [getPlayingState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-a2dp#getplayingstate) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| [PlayingState](#playingstatedeprecated) | Playing state of the remote device obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let a2dpSrc: bluetoothManager.A2dpSourceProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_A2DP_SOURCE) as bluetoothManager.A2dpSourceProfile;
    let state: bluetoothManager.PlayingState  = a2dpSrc.getPlayingState('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### HandsFreeAudioGatewayProfile(deprecated)

Before using an API of **HandsFreeAudioGatewayProfile**, you need to create an instance of this class by using **getProfile()**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [hfp.HandsFreeAudioGatewayProfile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-hfp#handsfreeaudiogatewayprofile) instead.

## connect(deprecated)

connect(device: string): void

Sets up a Hands-free Profile (HFP) connection of a device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. The substitute API is available only for system applications.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let hfpAg: bluetoothManager.HandsFreeAudioGatewayProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_HANDS_FREE_AUDIO_GATEWAY) as bluetoothManager.HandsFreeAudioGatewayProfile;
    hfpAg.connect('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## disconnect(deprecated)

disconnect(device: string): void

Disconnects the HFP connection of a device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. The substitute API is available only for system applications.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let hfpAg: bluetoothManager.HandsFreeAudioGatewayProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_HANDS_FREE_AUDIO_GATEWAY) as bluetoothManager.HandsFreeAudioGatewayProfile;
    hfpAg.disconnect('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('connectionStateChange')(deprecated)

on(type: 'connectionStateChange', callback: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Subscribes to the HFP connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.on('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileonconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | Yes | Callback used to return the HFP connection state. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('hfp state = '+ JSON.stringify(data));
}
try {
let hfpAg: bluetoothManager.HandsFreeAudioGatewayProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_HANDS_FREE_AUDIO_GATEWAY) as
  bluetoothManager.HandsFreeAudioGatewayProfile;
hfpAg.on('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('connectionStateChange')(deprecated)

off(type: 'connectionStateChange', callback?: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Unsubscribes from the HFP connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.off('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileoffconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | No | Callback to unregister. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| **Example** |  |
          
```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('hfp state = '+ JSON.stringify(data));
}
try {
let hfpAg: bluetoothManager.HandsFreeAudioGatewayProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_HANDS_FREE_AUDIO_GATEWAY) as
  bluetoothManager.HandsFreeAudioGatewayProfile;
hfpAg.on('connectionStateChange', onReceiveEvent);
hfpAg.off('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### HidHostProfile(deprecated)

Before using an API of **HidHostProfile**, you need to create an instance of this class by using **getProfile()**.

## on('connectionStateChange')(deprecated)

on(type: 'connectionStateChange', callback: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Subscribes to the HidHost connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.on('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileonconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | Yes | Callback used to return the HidHost connection state. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('hidHost state = '+ JSON.stringify(data));
}
try {
let hidHost: bluetoothManager.HidHostProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_HID_HOST) as bluetoothManager.HidHostProfile;
hidHost.on('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('connectionStateChange')(deprecated)

off(type: 'connectionStateChange', callback?: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Unsubscribes from the HidHost connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.off('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileoffconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | No | Callback to unregister. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('hidHost state = '+ JSON.stringify(data));
}
try {
let hidHost: bluetoothManager.HidHostProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_HID_HOST) as bluetoothManager.HidHostProfile;
hidHost.on('connectionStateChange', onReceiveEvent);
hidHost.off('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### PanProfile

Before using an API of **PanProfile**, you need to create an instance of this class by using **getProfile()**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [pan.createPanProfile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-pan#pancreatepanprofile) instead.

## on('connectionStateChange')(deprecated)

on(type: 'connectionStateChange', callback: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Subscribes to the PAN connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.on('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileonconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | Yes | Callback used to return the PAN connection state. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('pan state = '+ JSON.stringify(data));
}
try {
let panProfile: bluetoothManager.PanProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_PAN_NETWORK) as bluetoothManager.PanProfile;
panProfile.on('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('connectionStateChange')(deprecated)

off(type: 'connectionStateChange', callback?: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Unsubscribes from the PAN connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.off('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofileoffconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | No | Callback to unregister. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function onReceiveEvent(data: bluetoothManager.StateChangeParam) {
    console.info('pan state = '+ JSON.stringify(data));
}
try {
let panProfile: bluetoothManager.PanProfile = bluetoothManager.getProfileInstance(bluetoothManager.ProfileId.PROFILE_PAN_NETWORK) as bluetoothManager.PanProfile;
panProfile.on('connectionStateChange', onReceiveEvent);
panProfile.off('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### GattServer

Implements the Generic Attribute Profile (GATT) server. Before using an API of this class, you need to create a **GattServer** instance using **createGattServer()**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#gattserver) instead.

## startAdvertising(deprecated)

startAdvertising(setting: AdvertiseSetting, advData: AdvertiseData, advResponse?: AdvertiseData): void

Starts BLE advertising.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.startAdvertising](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blestartadvertising) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| setting | [AdvertiseSetting](#advertisesettingdeprecated) | Yes | Advertising settings. |
| advData | [AdvertiseData](#advertisedatadeprecated) | Yes | Advertising data. |
| advResponse | [AdvertiseData](#advertisedatadeprecated) | No | Advertising response. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let manufactureValueBuffer = new Uint8Array(4);
manufactureValueBuffer[0] = 1;
manufactureValueBuffer[1] = 2;
manufactureValueBuffer[2] = 3;
manufactureValueBuffer[3] = 4;

let serviceValueBuffer = new Uint8Array(4);
serviceValueBuffer[0] = 4;
serviceValueBuffer[1] = 6;
serviceValueBuffer[2] = 7;
serviceValueBuffer[3] = 8;
console.info('manufactureValueBuffer = '+ JSON.stringify(manufactureValueBuffer));
console.info('serviceValueBuffer = '+ JSON.stringify(serviceValueBuffer));
let gattServer = bluetoothManager.BLE.createGattServer();
try {
    let setting: bluetoothManager.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
    };
    let manufactureDataUnit: bluetoothManager.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: bluetoothManager.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: bluetoothManager.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
    };
    let advResponse: bluetoothManager.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
    };
    gattServer.startAdvertising(setting, advData ,advResponse);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## stopAdvertising(deprecated)

stopAdvertising(): void

Stops BLE advertising.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.stopAdvertising](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blestopadvertising) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let server = bluetoothManager.BLE.createGattServer();
try {
    server.stopAdvertising();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## addService(deprecated)

addService(service: GattService): void

Adds a service to this GATT server.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#addService](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#addservice) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| service | [GattService](#gattservicedeprecated) | Yes | Service to add. Settings related to BLE advertising. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// Create descriptors.
let descriptors: Array<bluetoothManager.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(8);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;

// Create characteristics.
let characteristics: Array<bluetoothManager.BLECharacteristic> = [];
let arrayBufferC = new ArrayBuffer(8);
let cccV = new Uint8Array(arrayBufferC);
cccV[0] = 1;
let characteristic: bluetoothManager.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
let characteristicN: bluetoothManager.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001821-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
characteristics[0] = characteristic;

// Create a gattService instance.
let gattService: bluetoothManager.GattService = {serviceUuid:'00001810-0000-1000-8000-00805F9B34FB', isPrimary: true, characteristics:characteristics, includeServices:[]};

let gattServer  = bluetoothManager.BLE.createGattServer();
try {
    gattServer.addService(gattService);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## removeService(deprecated)

removeService(serviceUuid: string): void

Removes a service from this GATT server.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#removeService](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#removeservice) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serviceUuid | string | Yes | Universally unique identifier (UUID) of the service to remove, for example, **00001810-0000-1000-8000-00805F9B34FB**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900004 | Profile not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let server = bluetoothManager.BLE.createGattServer();
try {
    server.removeService('00001810-0000-1000-8000-00805F9B34FB');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## close(deprecated)

close(): void

Closes this GATT server to unregister it from the protocol stack. After this method is called, this [GattServer](#gattserver) cannot be used.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#close](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#close) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let server = bluetoothManager.BLE.createGattServer();
try {
    server.close();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## notifyCharacteristicChanged(deprecated)

notifyCharacteristicChanged(deviceId: string, notifyCharacteristic: NotifyCharacteristic): void

Notifies the connected client device when a characteristic value changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#notifyCharacteristicChanged](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#notifycharacteristicchanged) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the client that receives notifications, for example, XX:XX:XX:XX:XX:XX. |
| notifyCharacteristic | [NotifyCharacteristic](#notifycharacteristicdeprecated) | Yes | New characteristic value. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// Create descriptors.
let descriptors: Array<bluetoothManager.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(8);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;
let arrayBufferC = new ArrayBuffer(8);
let characteristic: bluetoothManager.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
let notifyCharacteristic: bluetoothManager.NotifyCharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001821-0000-1000-8000-00805F9B34FB', characteristicValue: characteristic.characteristicValue, confirm: false};
let server = bluetoothManager.BLE.createGattServer();
try {
    server.notifyCharacteristicChanged('XX:XX:XX:XX:XX:XX', notifyCharacteristic);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## sendResponse(deprecated)

sendResponse(serverResponse: ServerResponse): void

Sends a response to a read or write request from the GATT client.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#sendResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#sendresponse) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serverResponse | [ServerResponse](#serverresponsedeprecated) | Yes | Response returned by the GATT server. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
/* send response */
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
cccValue[0] = 1;
let serverResponse: bluetoothManager.ServerResponse = {
    deviceId: 'XX:XX:XX:XX:XX:XX',
    transId: 0,
    status: 0,
    offset: 0,
    value: arrayBufferCCC,
};

let gattServer = bluetoothManager.BLE.createGattServer();
try {
    gattServer.sendResponse(serverResponse);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('characteristicRead')(deprecated)

on(type: 'characteristicRead', callback: Callback<CharacteristicReadRequest>): void

Subscribes to the characteristic read request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#on('characteristicRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#oncharacteristicread) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicRead**, which indicates a characteristic read request event. |
| callback | Callback<[CharacteristicReadRequest](#characteristicreadrequestdeprecated)> | Yes | Callback used to return a characteristic read request event from the GATT client. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
cccValue[0] = 1;
function ReadCharacteristicReq(characteristicReadRequest: bluetoothManager.CharacteristicReadRequest) {
    let deviceId: string = characteristicReadRequest.deviceId;
    let transId: number = characteristicReadRequest.transId;
    let offset: number = characteristicReadRequest.offset;
    let characteristicUuid: string = characteristicReadRequest.characteristicUuid;

    let serverResponse: bluetoothManager.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferCCC};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
    }
}

let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.on("characteristicRead", ReadCharacteristicReq);
```

## off('characteristicRead')(deprecated)

off(type: 'characteristicRead', callback?: Callback<CharacteristicReadRequest>): void

Unsubscribes from the characteristic read request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#off('characteristicRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#offcharacteristicread) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicRead**, which indicates a characteristic read request event. |
| callback | Callback<[CharacteristicReadRequest](#characteristicreadrequestdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.off("characteristicRead");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('characteristicWrite')(deprecated)

on(type: 'characteristicWrite', callback: Callback<CharacteristicWriteRequest>): void

Subscribes to the characteristic write request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#on('characteristicWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#oncharacteristicwrite) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicWrite**, which indicates a characteristic write request event. |
| callback | Callback<[CharacteristicWriteRequest](#characteristicwriterequestdeprecated)> | Yes | Callback used to return a characteristic write request from the GATT client. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
function WriteCharacteristicReq(characteristicWriteRequest: bluetoothManager.CharacteristicWriteRequest) {
    let deviceId: string = characteristicWriteRequest.deviceId;
    let transId: number = characteristicWriteRequest.transId;
    let offset: number = characteristicWriteRequest.offset;
    let isPrep: boolean = characteristicWriteRequest.isPrep;
    let needRsp: boolean = characteristicWriteRequest.needRsp;
    let value: Uint8Array =  new Uint8Array(characteristicWriteRequest.value);
    let characteristicUuid: string = characteristicWriteRequest.characteristicUuid;

    cccValue[0] = value[0];
    let serverResponse: bluetoothManager.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferCCC};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}

let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.on("characteristicWrite", WriteCharacteristicReq);
```

## off('characteristicWrite')(deprecated)

off(type: 'characteristicWrite', callback?: Callback<CharacteristicWriteRequest>): void

Unsubscribes from the characteristic write request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#off('characteristicWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#offcharacteristicwrite) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicWrite**, which indicates a characteristic write request event. |
| callback | Callback<[CharacteristicWriteRequest](#characteristicwriterequestdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.off("characteristicWrite");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('descriptorRead')(deprecated)

on(type: 'descriptorRead', callback: Callback<DescriptorReadRequest>): void

Subscribes to the descriptor read request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#on('descriptorRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#ondescriptorread) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorRead**, which indicates a descriptor read request event. |
| callback | Callback<[DescriptorReadRequest](#descriptorreadrequestdeprecated)> | Yes | Callback used to return a characteristic read request event from the GATT client. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let arrayBufferDesc = new ArrayBuffer(8);
let descValue = new Uint8Array(arrayBufferDesc);
descValue[0] = 1;
function ReadDescriptorReq(descriptorReadRequest: bluetoothManager.DescriptorReadRequest) {
    let deviceId: string = descriptorReadRequest.deviceId;
    let transId: number = descriptorReadRequest.transId;
    let offset: number = descriptorReadRequest.offset;
    let descriptorUuid: string = descriptorReadRequest.descriptorUuid;

    let serverResponse: bluetoothManager.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferDesc};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}

let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.on("descriptorRead", ReadDescriptorReq);
```

## off('descriptorRead')(deprecated)

off(type: 'descriptorRead', callback?: Callback<DescriptorReadRequest>): void

Unsubscribes from the descriptor read request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#off('descriptorRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#offdescriptorread) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorRead**, which indicates a descriptor read request event. |
| callback | Callback<[DescriptorReadRequest](#descriptorreadrequestdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.off("descriptorRead");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('descriptorWrite')(deprecated)

on(type: 'descriptorWrite', callback: Callback<DescriptorWriteRequest>): void

Subscribes to the descriptor write request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#on('descriptorWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#ondescriptorwrite) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorWrite**, which indicates a descriptor write request event. |
| callback | Callback<[DescriptorWriteRequest](#descriptorwriterequestdeprecated)> | Yes | Callback used to return a characteristic write request from the GATT client. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let arrayBufferDesc = new ArrayBuffer(8);
let descValue = new Uint8Array(arrayBufferDesc);
function WriteDescriptorReq(descriptorWriteRequest: bluetoothManager.DescriptorWriteRequest) {
    let deviceId: string = descriptorWriteRequest.deviceId;
    let transId: number = descriptorWriteRequest.transId;
    let offset: number = descriptorWriteRequest.offset;
    let isPrep: boolean = descriptorWriteRequest.isPrep;
    let needRsp: boolean = descriptorWriteRequest.needRsp;
    let value: Uint8Array = new Uint8Array(descriptorWriteRequest.value);
    let descriptorUuid: string = descriptorWriteRequest.descriptorUuid;

    descValue[0] = value[0];
    let serverResponse: bluetoothManager.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferDesc};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}

let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.on("descriptorWrite", WriteDescriptorReq);
```

## off('descriptorWrite')(deprecated)

off(type: 'descriptorWrite', callback?: Callback<DescriptorWriteRequest>): void

Unsubscribes from the descriptor write request events.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#off('descriptorWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#offdescriptorwrite) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorWrite**, which indicates a descriptor write request event. |
| callback | Callback<[DescriptorWriteRequest](#descriptorwriterequestdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.off("descriptorWrite");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('connectStateChange')(deprecated)

on(type: 'connectStateChange', callback: Callback<BLEConnectChangedState>): void

Subscribes to the BLE connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#on('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#onconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | Yes | Callback used to return the BLE connection state. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function Connected(BLEConnectChangedState: bluetoothManager.BLEConnectChangedState) {
  let deviceId: string = BLEConnectChangedState.deviceId;
  let status: bluetoothManager.ProfileConnectionState  = BLEConnectChangedState.state;
}
try {
let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.on("connectStateChange", Connected);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('connectStateChange')(deprecated)

off(type: 'connectStateChange', callback?: Callback<BLEConnectChangedState>): void

Unsubscribes from the BLE connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattServer#off('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#offconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
let gattServer = bluetoothManager.BLE.createGattServer();
gattServer.off("connectStateChange");
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### GattClientDevice

Implements the GATT client. Before using an API of this class, you must create a **GattClientDevice** instance using **createGattClientDevice(deviceId: string)**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#gattclientdevice) instead.

## connect(deprecated)

connect(): void

Initiates a connection to the remote BLE device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#connect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#connect) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.connect();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## disconnect(deprecated)

disconnect(): void

Disconnects from the remote BLE device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#disconnect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#disconnect) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.disconnect();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## close(deprecated)

close(): void

Closes this GATT client to unregister it from the protocol stack. After this method is called, this [GattClientDevice](#gattclientdevice) instance cannot be used.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#close](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#close) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.close();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## getServices(deprecated)

getServices(callback: AsyncCallback<Array<GattService>>): void

Obtains all services of the remote BLE device on the client.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#getServices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#getservices) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<Array<[GattService](#gattservicedeprecated)>> | Yes | Callback used to return the services obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
// Callback mode.
function getServices(code: BusinessError, gattServices: Array<bluetoothManager.GattService>) {
  if (code.code == 0) {
      let services: Array<bluetoothManager.GattService> = gattServices;
      console.info(`bluetooth code is ${code.code}`);
      console.info(`bluetooth services size is ${services.length}`);

      for (let i = 0; i < services.length; i++) {
        console.info(`bluetooth serviceUuid is ${services[i].serviceUuid}`);
      }
  }
}

try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.connect();
    device.getServices(getServices);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## getServices(deprecated)

getServices(): Promise<Array<GattService>>

Obtains all services of the remote BLE device on the client. This API uses a promise to return the result.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#getServices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#getservices-1) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Promise<Array<[GattService](#gattservicedeprecated)>> | Promise used to return the services obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// Promise
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.connect();
    device.getServices().then(result => {
        console.info("getServices successfully:" + JSON.stringify(result));
    });
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## readCharacteristicValue(deprecated)

readCharacteristicValue(characteristic: BLECharacteristic, callback: AsyncCallback<BLECharacteristic>): void

Reads the characteristic value of the specific service of the remote BLE device. This API uses an asynchronous callback to return the result.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#readCharacteristicValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#readcharacteristicvalue) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | Characteristic value to read. |
| callback | AsyncCallback<[BLECharacteristic](#blecharacteristicdeprecated)> | Yes | Callback used to return the characteristic value read. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2901000 | Read forbidden. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
function readCcc(code: BusinessError, BLECharacteristic: bluetoothManager.BLECharacteristic) {
    if (code.code != 0) {
        return;
    }
    console.info(`bluetooth characteristic uuid: ${BLECharacteristic.characteristicUuid}`);
    let value = new Uint8Array(BLECharacteristic.characteristicValue);
    console.info(`value length: ${value.length}`);
}

let descriptors: Array<bluetoothManager.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: bluetoothManager.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    characteristicValue: bufferCCC, descriptors:descriptors};

try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readCharacteristicValue(characteristic, readCcc);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## readCharacteristicValue(deprecated)

readCharacteristicValue(characteristic: BLECharacteristic): Promise<BLECharacteristic>

Reads the characteristic value of the specific service of the remote BLE device. This API uses an asynchronous callback to return the result.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#readCharacteristicValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#readcharacteristicvalue-1) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | Characteristic value to read. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<[BLECharacteristic](#blecharacteristicdeprecated)> | Promise used to return the characteristic value read. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2901000 | Read forbidden. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let descriptors: Array<bluetoothManager.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: bluetoothManager.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    characteristicValue: bufferCCC, descriptors:descriptors};

try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readCharacteristicValue(characteristic);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## readDescriptorValue(deprecated)

readDescriptorValue(descriptor: BLEDescriptor, callback: AsyncCallback<BLEDescriptor>): void

Reads the descriptor contained in the specific characteristic of the remote BLE device on the client. This API uses an asynchronous callback to return the result.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#readDescriptorValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#readdescriptorvalue) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptordeprecated) | Yes | Descriptor to read. |
| callback | AsyncCallback<[BLEDescriptor](#bledescriptordeprecated)> | Yes | Callback used to return the descriptor read. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2901000 | Read forbidden. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
function readDesc(code: BusinessError, BLEDescriptor: bluetoothManager.BLEDescriptor) {
    if (code.code != 0) {
        return;
    }
    console.info(`bluetooth descriptor uuid: ${BLEDescriptor.descriptorUuid}`);
    let value = new Uint8Array(BLEDescriptor.descriptorValue);
}

let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB',
    descriptorValue: bufferDesc
};
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readDescriptorValue(descriptor, readDesc);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## readDescriptorValue(deprecated)

readDescriptorValue(descriptor: BLEDescriptor): Promise<BLEDescriptor>

Reads the descriptor contained in the specific characteristic of the remote BLE device on the client. This API uses a promise to return the result.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#readDescriptorValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#readdescriptorvalue-1) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptordeprecated) | Yes | Descriptor to read. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<[BLEDescriptor](#bledescriptordeprecated)> | Promise used to return the descriptor read. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2901000 | Read forbidden. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB',
    descriptorValue: bufferDesc
};
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readDescriptorValue(descriptor);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## writeCharacteristicValue(deprecated)

writeCharacteristicValue(characteristic: BLECharacteristic): void

Writes a characteristic value to the remote BLE device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#writeCharacteristicValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#writecharacteristicvalue) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | Binary value and other parameters of the BLE device characteristic. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2901001 | Write forbidden. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let descriptors: Array<bluetoothManager.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: bluetoothManager.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    characteristicValue: bufferCCC, descriptors:descriptors};
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.writeCharacteristicValue(characteristic);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## writeDescriptorValue(deprecated)

writeDescriptorValue(descriptor: BLEDescriptor): void

Writes binary data to the specific descriptor of the remote BLE device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#writeDescriptorValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#writedescriptorvalue) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptordeprecated) | Yes | Binary value and other parameters of the BLE device descriptor. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2901001 | Write forbidden. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 22;
let descriptor: bluetoothManager.BLEDescriptor = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB',
    descriptorValue: bufferDesc
};
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.writeDescriptorValue(descriptor);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## setBLEMtuSize(deprecated)

setBLEMtuSize(mtu: number): void

Sets the maximum transmission unit (MTU) that can be transmitted between the GATT client and its remote BLE device. This API can be used only after a connection is set up by calling [connect](#connectdeprecated-1).

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#setBLEMtuSize](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#setblemtusize) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| mtu | number | Yes | MTU to set, which ranges from 22 to 512 bytes. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.setBLEMtuSize(128);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## setNotifyCharacteristicChanged(deprecated)

setNotifyCharacteristicChanged(characteristic: BLECharacteristic, enable: boolean): void

Sets the function of notifying the GATT client when the characteristic value of the remote BLE device changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#setCharacteristicChangeNotification](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#setcharacteristicchangenotification) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | BLE characteristic to listen for. |
| enable | boolean | Yes | Whether to enable the notify function. The value **true** means to enable the notify function, and the value **false** means the opposite. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// Create descriptors.
let descriptors: Array<bluetoothManager.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor: bluetoothManager.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: bluetoothManager.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    characteristicValue: bufferCCC, descriptors:descriptors};
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.setNotifyCharacteristicChanged(characteristic, false);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('BLECharacteristicChange')(deprecated)

on(type: 'BLECharacteristicChange', callback: Callback<BLECharacteristic>): void

Subscribes to the BLE characteristic changes. The client can receive a notification from the server only after the **setNotifyCharacteristicChanged** method is called.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#on('BLECharacteristicChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#onblecharacteristicchange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLECharacteristicChange**, which indicates a characteristic value change event. |
| callback | Callback<[BLECharacteristic](#blecharacteristicdeprecated)> | Yes | Callback used to return the characteristic value changes. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
function CharacteristicChange(characteristicChangeReq: ble.BLECharacteristic) {
    let serviceUuid: string = characteristicChangeReq.serviceUuid;
    let characteristicUuid: string = characteristicChangeReq.characteristicUuid;
    let value: Uint8Array = new Uint8Array(characteristicChangeReq.characteristicValue);
}
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.on('BLECharacteristicChange', CharacteristicChange);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('BLECharacteristicChange')(deprecated)

off(type: 'BLECharacteristicChange', callback?: Callback<BLECharacteristic>): void

Unsubscribes from the BLE characteristic changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#off('BLECharacteristicChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#offblecharacteristicchange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLECharacteristicChange**, which indicates a characteristic value change event. |
| callback | Callback<[BLECharacteristic](#blecharacteristicdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.off('BLECharacteristicChange');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('BLEConnectionStateChange')(deprecated)

on(type: 'BLEConnectionStateChange', callback: Callback<BLEConnectChangedState>): void

Subscribes to the BLE connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#on('BLEConnectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#onbleconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEConnectionStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | Yes | Callback used to return the BLE connection state. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
function ConnectStateChanged(state: bluetoothManager.BLEConnectChangedState) {
    console.info('bluetooth connect state changed');
    let connectState: bluetoothManager.ProfileConnectionState = state.state;
}
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.on('BLEConnectionStateChange', ConnectStateChanged);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('BLEConnectionStateChange')(deprecated)

off(type: 'BLEConnectionStateChange', callback?: Callback<BLEConnectChangedState>): void

Unsubscribes from the BLE connection state changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#off('BLEConnectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#offbleconnectionstatechange) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEConnectionStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for the specified **type**. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
try {
    let device = bluetoothManager.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.off('BLEConnectionStateChange');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## getDeviceName(deprecated)

getDeviceName(callback: AsyncCallback<string>): void

Obtains the name of the remote BLE device on the client.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#getDeviceName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#getdevicename) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<string> | Yes | Callback used to return the remote BLE device name obtained. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// callback
try {
    let gattClient = bluetoothManager.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
    gattClient.connect();
    let deviceName = gattClient.getDeviceName((err, data)=> {
        console.info('device name err ' + JSON.stringify(err));
        console.info('device name' + JSON.stringify(data));
    })
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## getDeviceName(deprecated)

getDeviceName(): Promise<string>

Obtains the name of the remote BLE device on the client. This API uses a promise to return the result.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#getDeviceName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#getdevicename-1) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Promise<string> | Promise used to return the remote BLE device name. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// promise
try {
    let gattClient = bluetoothManager.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
    gattClient.connect();
    let deviceName = gattClient.getDeviceName().then((data) => {
        console.info('device name' + JSON.stringify(data));
    })
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## getRssiValue(deprecated)

getRssiValue(callback: AsyncCallback<number>): void

Obtains the received signal strength indication (RSSI) of the remote BLE device on the client. This API can be used only after a connection is set up by calling [connect](#connectdeprecated-1).

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#getRssiValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#getrssivalue) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<number> | Yes | Callback used to return the RSSI, in dBm. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// callback
try {
    let gattClient = bluetoothManager.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
    gattClient.connect();
    let rssi = gattClient.getRssiValue((err: BusinessError, data: number)=> {
        console.info('rssi err ' + JSON.stringify(err));
        console.info('rssi value' + JSON.stringify(data));
    })
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## getRssiValue(deprecated)

getRssiValue(): Promise<number>

Obtains the RSSI of the remote BLE device on the client. This API uses a promise to return the result. It can be used only after a connection is set up by calling [connect](#connectdeprecated-1).

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattClientDevice#getRssiValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#getrssivalue-1) instead.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Promise<number> | Promise used to return the RSSI, in dBm. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// promise
try {
    let gattClient = bluetoothManager.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
    let rssi = gattClient.getRssiValue().then((data: number) => {
        console.info('rssi' + JSON.stringify(data));
    })
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### ScanMode(deprecated)

Enumerates the scan modes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.ScanMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#scanmode) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| SCAN_MODE_NONE | 0 | No scan mode. |
| SCAN_MODE_CONNECTABLE | 1 | Connectable mode. |
| SCAN_MODE_GENERAL_DISCOVERABLE | 2 | General discoverable mode. |
| SCAN_MODE_LIMITED_DISCOVERABLE | 3 | Limited discoverable mode. |
| SCAN_MODE_CONNECTABLE_GENERAL_DISCOVERABLE | 4 | General connectable and discoverable mode. |
| SCAN_MODE_CONNECTABLE_LIMITED_DISCOVERABLE | 5 | Limited connectable and discoverable mode. |

#### BondState(deprecated)

Enumerates the pairing states.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.BondState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bondstate) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| BOND_STATE_INVALID | 0 | Invalid pairing. |
| BOND_STATE_BONDING | 1 | Pairing. |
| BOND_STATE_BONDED | 2 | Paired. |

#### SppOption(deprecated)

Defines the SPP configuration parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.SppOption](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#sppoptions) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| uuid | string | No | No | Service UUID of the socket link type. |
| secure | boolean | No | No | Whether it is a secure channel. |
| type | [SppType](#spptypedeprecated) | No | No | Type of the SPP link. |

#### SppType(deprecated)

Enumerates the SPP link types.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [socket.SppType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket#spptype) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| SPP_RFCOMM | 0 | Radio frequency communication (RFCOMM) link type. |

#### GattService(deprecated)

Defines the GATT service API parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.GattService](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#gattservice) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| isPrimary | boolean | No | No | Whether the service is a primary service. The value **true** means a primary service. |
| characteristics | Array<[BLECharacteristic](#blecharacteristicdeprecated)> | No | No | List of characteristics of the service. |
| includeServices | Array<[GattService](#gattservicedeprecated)> | No | Yes | Services on which the service depends. |

#### BLECharacteristic(deprecated)

Defines the characteristic API parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.BLECharacteristic](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#blecharacteristic) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| characteristicValue | ArrayBuffer | No | No | Binary value of the characteristic. |
| descriptors | Array<[BLEDescriptor](#bledescriptordeprecated)> | No | No | List of descriptors of the characteristic. |

#### BLEDescriptor(deprecated)

Defines the descriptor API parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.BLEDescriptor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#bledescriptor) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| descriptorUuid | string | No | No | UUID of the descriptor, for example, **00002902-0000-1000-8000-00805f9b34fb**. |
| descriptorValue | ArrayBuffer | No | No | Binary value of the descriptor. |

#### NotifyCharacteristic(deprecated)

Defines the parameters in the notifications sent when the server characteristic value changes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.NotifyCharacteristic](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#notifycharacteristic) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| characteristicValue | ArrayBuffer | No | No | Binary value of the characteristic. |
| confirm | boolean | No | No | Whether the notification needs to be confirmed by the remote end. For a notification, set it to **true**. In this case, the remote end must confirm the receipt of the notification. For an indication, set it to **false**. In this case, the remote end does not need to confirm the receipt of the notification. |

#### CharacteristicReadRequest(deprecated)

Defines the parameters of the **CharacteristicReadReq** event received by the server.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.CharacteristicReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#characteristicreadrequest) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device that sends the **CharacteristicReadReq** event, for example, XX:XX:XX:XX:XX:XX. |
| transId | number | No | No | Transmission ID of the read request. The response returned by the server must use the same transmission ID. |
| offset | number | No | No | Start position from which the characteristic value is read. For example, **k** means to read from the kth byte. The response returned by the server must use the same offset. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |

#### CharacteristicWriteRequest(deprecated)

Defines the parameters of the **CharacteristicWriteReq** event received by the server.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.CharacteristicWriteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#characteristicwriterequest) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device that sends the **CharacteristicWriteReq** event, for example, XX:XX:XX:XX:XX:XX. |
| transId | number | No | No | Transmission ID of the write request. The response returned by the server must use the same transmission ID. |
| offset | number | No | No | Start position for writing the characteristic value. For example, **k** means to write from the kth byte. The response returned by the server must use the same offset. |
| isPrep | boolean | No | No | Whether the write request is executed immediately. The value **true** means to execute the write request immediately. |
| needRsp | boolean | No | No | Whether to send a response to the GATT client. The value **true** means to send a response. |
| value | ArrayBuffer | No | No | Binary value of the descriptor to write. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |

#### DescriptorReadRequest(deprecated)

Defines the parameters of the **DescriptorReadReq** event received by the server.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.DescriptorReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#descriptorreadrequest) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device that sends the **DescriptorReadReq** event, for example, XX:XX:XX:XX:XX:XX. |
| transId | number | No | No | Transmission ID of the read request. The response returned by the server must use the same transmission ID. |
| offset | number | No | No | Start position from which the descriptor is read. For example, **k** means to read from the kth byte. The response returned by the server must use the same offset. |
| descriptorUuid | string | No | No | UUID of the descriptor, for example, **00002902-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |

#### DescriptorWriteRequest(deprecated)

Defines the parameters of the **DescriptorWriteReq** event received by the server.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.DescriptorWriteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#descriptorwriterequest) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device that sends the **DescriptorWriteReq** event, for example, XX:XX:XX:XX:XX:XX. |
| transId | number | No | No | Transmission ID of the write request. The response returned by the server must use the same transmission ID. |
| offset | number | No | No | Start position for writing the descriptor. For example, **k** means to write from the kth byte. The response returned by the server must use the same offset. |
| isPrep | boolean | No | No | Whether the write request is executed immediately. |
| needRsp | boolean | No | No | Whether to send a response to the GATT client. |
| value | ArrayBuffer | No | No | Binary value of the descriptor to write. |
| descriptorUuid | string | No | No | UUID of the descriptor, for example, **00002902-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |

#### ServerResponse(deprecated)

Defines the parameters of the server's response to the GATT client's read/write request.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.ServerResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#serverresponse) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |
| transId | number | No | No | Transmission ID of the request. The value must be the same as the ID carried in the read/write request received. |
| status | number | No | No | Response state. Set this parameter to **0**, which indicates a normal response. |
| offset | number | No | No | Start read/write position. The value must be the same as the offset carried in the read/write request. |
| value | ArrayBuffer | No | No | Binary data in the response. |

#### BLEConnectChangedState(deprecated)

Defines the parameters of **BLEConnectChangedState**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [BLEConnectionChangeState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#bleconnectionchangestate) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |
| state | [ProfileConnectionState](#profileconnectionstatedeprecated) | No | No | BLE connection state. |

#### ProfileConnectionState(deprecated)

Enumerates the profile connection states.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [constant.ProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| STATE_DISCONNECTED | 0 | Disconnected. |
| STATE_CONNECTING | 1 | Connecting. |
| STATE_CONNECTED | 2 | Connected. |
| STATE_DISCONNECTING | 3 | Disconnecting. |

#### ScanFilter(deprecated)

Defines the scan filter parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.ScanFilter](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#scanfilter) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | Yes | Address of the BLE device to filter, for example, XX:XX:XX:XX:XX:XX. |
| name | string | No | Yes | Name of the BLE device to filter. |
| serviceUuid | string | No | Yes | Service UUID of the device to filter, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| serviceUuidMask | string | No | Yes | Service UUID mask of the device to filter, for example, **FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF**. |
| serviceSolicitationUuid | string | No | Yes | Service solicitation UUID of the device to filter, for example, **00001888-0000-1000-8000-00805F9B34FB**. |
| serviceSolicitationUuidMask | string | No | Yes | Service solicitation UUID mask of the device to filter, for example, **FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF**. |
| serviceData | ArrayBuffer | No | Yes | Service data of the device to filter, for example, **[0x90, 0x00, 0xF1, 0xF2]**. |
| serviceDataMask | ArrayBuffer | No | Yes | Service data mask of the device to filter, for example, **[0xFF,0xFF,0xFF,0xFF]**. |
| manufactureId | number | No | Yes | Manufacturer ID of the device to filter, for example, **0x0006**. |
| manufactureData | ArrayBuffer | No | Yes | Manufacturer data of the device to filter, for example, **[0x1F,0x2F,0x3F]**. |
| manufactureDataMask | ArrayBuffer | No | Yes | Manufacturer data mask of the device to filter, for example, **[0xFF, 0xFF, 0xFF]**. |

#### ScanOptions(deprecated)

Defines the scan configuration parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.ScanOptions](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#scanoptions) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| interval | number | No | Yes | Delay in reporting the scan result. The default value is **0**. |
| dutyMode | [ScanDuty](#scandutydeprecated) | No | Yes | Scan duty. The default value is SCAN_MODE_LOW_POWER. |
| matchMode | [MatchMode](#matchmodedeprecated) | No | Yes | Hardware filtering match mode. The default value is **MATCH_MODE_AGGRESSIVE**. |

#### ScanDuty(deprecated)

Enumerates the scan modes.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.ScanDuty](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#scanduty) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| SCAN_MODE_LOW_POWER | 0 | Low-power mode, which is the default value. |
| SCAN_MODE_BALANCED | 1 | Balanced mode. |
| SCAN_MODE_LOW_LATENCY | 2 | Low-latency mode. |

#### MatchMode(deprecated)

Enumerates the hardware match modes of BLE scan filters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.MatchMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#matchmode) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| MATCH_MODE_AGGRESSIVE | 1 | Hardware reports the scan result with a lower threshold of signal strength and few number of matches in a duration. This is the default value. |
| MATCH_MODE_STICKY | 2 | Hardware reports the scan result with a higher threshold of signal strength and sightings. |

#### ScanResult(deprecated)

Defines the scan result.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.ScanResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#scanresult) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the device discovered, for example, XX:XX:XX:XX:XX:XX. |
| rssi | number | No | No | RSSI of the device. |
| data | ArrayBuffer | No | No | Advertisement packets sent by the device. |

#### BluetoothState(deprecated)

Enumerates the Bluetooth states.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [access.BluetoothState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#bluetoothstate) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| STATE_OFF | 0 | Bluetooth is turned off. |
| STATE_TURNING_ON | 1 | Bluetooth is being turned on. |
| STATE_ON | 2 | Bluetooth is turned on. |
| STATE_TURNING_OFF | 3 | Bluetooth is being turned off. |
| STATE_BLE_TURNING_ON | 4 | The LE-only mode is being turned on for Bluetooth. |
| STATE_BLE_ON | 5 | Bluetooth is in LE-only mode. |
| STATE_BLE_TURNING_OFF | 6 | The LE-only mode is being turned off for Bluetooth. |

#### AdvertiseSetting(deprecated)

Defines the BLE advertising parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.AdvertiseSetting](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#advertisesetting) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| interval | number | No | Yes | Interval for BLE advertising. The minimum value is **32** slots (20 ms). The maximum value is **16384** slots. The default value is **1600** slots (1s). |
| txPower | number | No | Yes | Transmit power, in dBm. The value range is –127 to 1. The default value is **-7**. |
| connectable | boolean | No | Yes | Whether the advertisement is connectable. The default value is **true**. |

#### AdvertiseData(deprecated)

Defines the content of a BLE advertisement packet.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.AdvertiseData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#advertisedata) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuids | Array<string> | No | No | List of service UUIDs to broadcast. |
| manufactureData | Array<[ManufactureData](#manufacturedatadeprecated)> | No | No | List of manufacturers to broadcast. |
| serviceData | Array<[ServiceData](#servicedatadeprecated)> | No | No | List of service data to broadcast. |

#### ManufactureData(deprecated)

Defines the content of a BLE advertisement packet.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.ManufactureData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#manufacturedata) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| manufactureId | number | No | No | Manufacturer ID allocated by the Bluetooth SIG. |
| manufactureValue | ArrayBuffer | No | No | Manufacturer data. |

#### ServiceData(deprecated)

Defines the service data contained in an advertisement packet.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [ble.ServiceData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble#servicedata) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | Service UUID. |
| serviceValue | ArrayBuffer | No | No | Service data. |

#### PinRequiredParam(deprecated)

Defines the pairing request parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.PinRequiredParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#pinrequiredparam) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | ID of the device to pair. |
| pinCode | string | No | No | Key for the device pairing. |

#### BondStateParam(deprecated)

Defines the pairing state parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.BondStateParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bondstateparam) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | ID of the device to pair. |
| state | BondState | No | No | State of the device. |

#### StateChangeParam(deprecated)

Defines the profile state change parameters.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [baseProfile.StateChangeParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#statechangeparam) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of a Bluetooth device. |
| state | [ProfileConnectionState](#profileconnectionstatedeprecated) | No | No | Profile connection state of the device. |

#### DeviceClass(deprecated)

Defines the class of a Bluetooth device.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [connection.DeviceClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#deviceclass) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| majorClass | [MajorClass](#majorclassdeprecated) | No | No | Major classes of Bluetooth devices. |
| majorMinorClass | [MajorMinorClass](#majorminorclassdeprecated) | No | No | Major and minor classes of Bluetooth devices. |
| classOfDevice | number | No | No | Class of the device. |

#### MajorClass(deprecated)

Enumerates the major classes of Bluetooth devices.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [constant.MajorClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#majorclass) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| MAJOR_MISC | 0x0000 | Miscellaneous device. |
| MAJOR_COMPUTER | 0x0100 | Computer. |
| MAJOR_PHONE | 0x0200 | Mobile phone. |
| MAJOR_NETWORKING | 0x0300 | Network device. |
| MAJOR_AUDIO_VIDEO | 0x0400 | Audio or video device. |
| MAJOR_PERIPHERAL | 0x0500 | Peripheral device. |
| MAJOR_IMAGING | 0x0600 | Imaging device. |
| MAJOR_WEARABLE | 0x0700 | Wearable device. |
| MAJOR_TOY | 0x0800 | Toy. |
| MAJOR_HEALTH | 0x0900 | Health device. |
| MAJOR_UNCATEGORIZED | 0x1F00 | Unclassified device. |

#### MajorMinorClass(deprecated)

Enumerates the major and minor classes of Bluetooth devices.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [constant.MajorMinorClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#majorminorclass) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| COMPUTER_UNCATEGORIZED | 0x0100 | Unclassified computer. |
| COMPUTER_DESKTOP | 0x0104 | Desktop computer. |
| COMPUTER_SERVER | 0x0108 | Server. |
| COMPUTER_LAPTOP | 0x010C | Laptop. |
| COMPUTER_HANDHELD_PC_PDA | 0x0110 | Hand-held computer. |
| COMPUTER_PALM_SIZE_PC_PDA | 0x0114 | Palmtop computer. |
| COMPUTER_WEARABLE | 0x0118 | Wearable computer. |
| COMPUTER_TABLET | 0x011C | Tablet. |
| PHONE_UNCATEGORIZED | 0x0200 | Unclassified mobile phone. |
| PHONE_CELLULAR | 0x0204 | Portable phone. |
| PHONE_CORDLESS | 0x0208 | Cordless phone. |
| PHONE_SMART | 0x020C | Smartphone. |
| PHONE_MODEM_OR_GATEWAY | 0x0210 | Modem or gateway phone. |
| PHONE_ISDN | 0x0214 | ISDN phone. |
| NETWORK_FULLY_AVAILABLE | 0x0300 | Device with network fully available. |
| NETWORK_1_TO_17_UTILIZED | 0x0320 | Device used on network 1 to 17. |
| NETWORK_17_TO_33_UTILIZED | 0x0340 | Device used on network 17 to 33. |
| NETWORK_33_TO_50_UTILIZED | 0x0360 | Device used on network 33 to 50. |
| NETWORK_60_TO_67_UTILIZED | 0x0380 | Device used on network 60 to 67. |
| NETWORK_67_TO_83_UTILIZED | 0x03A0 | Device used on network 67 to 83. |
| NETWORK_83_TO_99_UTILIZED | 0x03C0 | Device used on network 83 to 99. |
| NETWORK_NO_SERVICE | 0x03E0 | Device without network service |
| AUDIO_VIDEO_UNCATEGORIZED | 0x0400 | Unclassified audio or video device. |
| AUDIO_VIDEO_WEARABLE_HEADSET | 0x0404 | Wearable audio or video headset. |
| AUDIO_VIDEO_HANDSFREE | 0x0408 | Hands-free audio or video device. |
| AUDIO_VIDEO_MICROPHONE | 0x0410 | Audio or video microphone. |
| AUDIO_VIDEO_LOUDSPEAKER | 0x0414 | Audio or video loudspeaker. |
| AUDIO_VIDEO_HEADPHONES | 0x0418 | Audio or video headphones. |
| AUDIO_VIDEO_PORTABLE_AUDIO | 0x041C | Portable audio or video device. |
| AUDIO_VIDEO_CAR_AUDIO | 0x0420 | In-vehicle audio or video device. |
| AUDIO_VIDEO_SET_TOP_BOX | 0x0424 | Audio or video STB device. |
| AUDIO_VIDEO_HIFI_AUDIO | 0x0428 | High-fidelity speaker device. |
| AUDIO_VIDEO_VCR | 0x042C | Video cassette recording (VCR) device. |
| AUDIO_VIDEO_VIDEO_CAMERA | 0x0430 | Camera. |
| AUDIO_VIDEO_CAMCORDER | 0x0434 | Camcorder |
| AUDIO_VIDEO_VIDEO_MONITOR | 0x0438 | Audio or video monitor. |
| AUDIO_VIDEO_VIDEO_DISPLAY_AND_LOUDSPEAKER | 0x043C | Video display or loudspeaker. |
| AUDIO_VIDEO_VIDEO_CONFERENCING | 0x0440 | Video conferencing device. |
| AUDIO_VIDEO_VIDEO_GAMING_TOY | 0x0448 | Audio or video gaming toy. |
| PERIPHERAL_NON_KEYBOARD_NON_POINTING | 0x0500 | Non-keyboard or non-pointing peripheral device. |
| PERIPHERAL_KEYBOARD | 0x0540 | Keyboard device. |
| PERIPHERAL_POINTING_DEVICE | 0x0580 | Pointing peripheral device. |
| PERIPHERAL_KEYBOARD_POINTING | 0x05C0 | Keyboard pointing device. |
| PERIPHERAL_UNCATEGORIZED | 0x0500 | Unclassified peripheral device. |
| PERIPHERAL_JOYSTICK | 0x0504 | Peripheral joystick. |
| PERIPHERAL_GAMEPAD | 0x0508 | Peripheral game pad |
| PERIPHERAL_REMOTE_CONTROL | 0x05C0 | Peripheral remote control device |
| PERIPHERAL_SENSING_DEVICE | 0x0510 | Peripheral sensing device. |
| PERIPHERAL_DIGITIZER_TABLET | 0x0514 | Peripheral digitizer tablet. |
| PERIPHERAL_CARD_READER | 0x0518 | Peripheral card reader. |
| PERIPHERAL_DIGITAL_PEN | 0x051C | Peripheral digital pen. |
| PERIPHERAL_SCANNER_RFID | 0x0520 | Peripheral RFID scanner. |
| PERIPHERAL_GESTURAL_INPUT | 0x0522 | Gesture input device. |
| IMAGING_UNCATEGORIZED | 0x0600 | Unclassified imaging device. |
| IMAGING_DISPLAY | 0x0610 | Imaging display device. |
| IMAGING_CAMERA | 0x0620 | Imaging camera device. |
| IMAGING_SCANNER | 0x0640 | Imaging scanner. |
| IMAGING_PRINTER | 0x0680 | Imaging printer. |
| WEARABLE_UNCATEGORIZED | 0x0700 | Unclassified wearable device. |
| WEARABLE_WRIST_WATCH | 0x0704 | Smart watch. |
| WEARABLE_PAGER | 0x0708 | Wearable pager. |
| WEARABLE_JACKET | 0x070C | Smart jacket. |
| WEARABLE_HELMET | 0x0710 | Wearable helmet. |
| WEARABLE_GLASSES | 0x0714 | Wearable glasses. |
| TOY_UNCATEGORIZED | 0x0800 | Unclassified toy. |
| TOY_ROBOT | 0x0804 | Toy robot. |
| TOY_VEHICLE | 0x0808 | Toy vehicle. |
| TOY_DOLL_ACTION_FIGURE | 0x080C | Humanoid toy doll. |
| TOY_CONTROLLER | 0x0810 | Toy controller. |
| TOY_GAME | 0x0814 | Toy gaming device. |
| HEALTH_UNCATEGORIZED | 0x0900 | Unclassified health devices. |
| HEALTH_BLOOD_PRESSURE | 0x0904 | Blood pressure device. |
| HEALTH_THERMOMETER | 0x0908 | Thermometer |
| HEALTH_WEIGHING | 0x090C | Body scale. |
| HEALTH_GLUCOSE | 0x0910 | Blood glucose monitor. |
| HEALTH_PULSE_OXIMETER | 0x0914 | Pulse oximeter. |
| HEALTH_PULSE_RATE | 0x0918 | Heart rate monitor. |
| HEALTH_DATA_DISPLAY | 0x091C | Health data display. |
| HEALTH_STEP_COUNTER | 0x0920 | Step counter. |
| HEALTH_BODY_COMPOSITION_ANALYZER | 0x0924 | Body composition analyzer. |
| HEALTH_PEAK_FLOW_MONITOR | 0x0928 | Peak flow monitor. |
| HEALTH_MEDICATION_MONITOR | 0x092C | Medication monitor. |
| HEALTH_KNEE_PROSTHESIS | 0x0930 | Prosthetic knee. |
| HEALTH_ANKLE_PROSTHESIS | 0x0934 | Prosthetic ankle. |
| HEALTH_GENERIC_HEALTH_MANAGER | 0x0938 | Generic health management device. |
| HEALTH_PERSONAL_MOBILITY_DEVICE | 0x093C | Personal mobility device. |

#### PlayingState(deprecated)

Enumerates the A2DP playing states.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [a2dp.PlayingState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-a2dp#playingstate) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| STATE_NOT_PLAYING | 0 | Not playing. |
| STATE_PLAYING | 1 | Playing. |

#### ProfileId(deprecated)

Enumerates the Bluetooth profiles. API version 9 is added with **PROFILE_HID_HOST** and **PROFILE_PAN_NETWORK**.

> **Note:** This API is supported since API version 9 and deprecated since API version 10. You are advised to use [constant.ProfileId](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileid) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| PROFILE_A2DP_SOURCE | 1 | A2DP profile. |
| PROFILE_HANDS_FREE_AUDIO_GATEWAY | 4 | HFP profile. |
| PROFILE_HID_HOST | 6 | Human Interface Device (HID) profile. |
| PROFILE_PAN_NETWORK | 7 | PAN profile. |
