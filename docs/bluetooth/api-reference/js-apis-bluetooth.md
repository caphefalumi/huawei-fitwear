<!--
  Title: @ohos.bluetooth (Bluetooth)
  Catalog: harmonyos-references
  Document ID: js-apis-bluetooth
  Updated: 2026-10-14 09:41:52
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth
-->
# @ohos.bluetooth (Bluetooth)

The **Bluetooth** module provides classic Bluetooth capabilities and [Bluetooth Low Energy (BLE)](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#ble) scan and advertising.

> **Note:** The initial APIs of this module are supported since API version 7. Newly added APIs will be marked with a superscript to indicate their earliest API version. The APIs provided by this module are no longer maintained since API version 9. You are advised to use profile APIs of [@ohos.bluetooth.ble (Bluetooth BLE Module)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble).

#### Modules to Import

```javascript
import bluetooth from '@ohos.bluetooth';
```

#### bluetooth.enableBluetooth(deprecated)

enableBluetooth(): boolean

Enables Bluetooth.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.enableBluetooth](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagerenablebluetoothdeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if Bluetooth is enabled; returns **false** otherwise. |

**Example**

```javascript
let enable : boolean = bluetooth.enableBluetooth();
```

#### bluetooth.disableBluetooth(deprecated)

disableBluetooth(): boolean

Disables Bluetooth.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.disableBluetooth](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagerdisablebluetoothdeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if Bluetooth is disabled; returns **false** otherwise. |

**Example**

```javascript
let disable : boolean = bluetooth.disableBluetooth();
```

#### bluetooth.getLocalName(deprecated)

getLocalName(): string

Obtains the name of the local Bluetooth device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.getLocalName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetlocalnamedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| string | Name of the local Bluetooth device obtained. |

**Example**

```javascript
let localName : string = bluetooth.getLocalName();
```

#### bluetooth.getState(deprecated)

getState(): BluetoothState

Obtains the Bluetooth state.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.getState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetstatedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [BluetoothState](#bluetoothstatedeprecated) | Bluetooth state obtained. |

**Example**

```javascript
let state : bluetooth.BluetoothState = bluetooth.getState();
```

#### bluetooth.getBtConnectionState(deprecated)

getBtConnectionState(): ProfileConnectionState

Obtains the local profile connection state.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.getBtConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetbtconnectionstatedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstatedeprecated) | Profile connection state obtained. |

**Example**

```javascript
let connectionState : bluetooth.ProfileConnectionState = bluetooth.getBtConnectionState();
```

#### bluetooth.setLocalName(deprecated)

setLocalName(name: string): boolean

Sets the name of the local Bluetooth device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.setLocalName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersetlocalnamedeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string | Yes | Bluetooth device name to set. It cannot exceed 248 bytes. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let ret : boolean = bluetooth.setLocalName('device_name');
```

#### bluetooth.pairDevice(deprecated)

pairDevice(deviceId: string): boolean

Initiates Bluetooth pairing.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.pairDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagerpairdevicedeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device to pair, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
// The address can be scanned.
let result : boolean = bluetooth.pairDevice("XX:XX:XX:XX:XX:XX");
```

#### bluetooth.getProfileConnState(deprecated)

getProfileConnState(profileId: ProfileId): ProfileConnectionState

Obtains the connection status of the specified profile.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.getProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetprofileconnectionstatedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| profileId | ProfileId | Yes | ID of the profile to obtain, for example, **PROFILE_A2DP_SOURCE**. |

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstatedeprecated) | Profile connection state obtained. |

**Example**

```javascript
let result : bluetooth.ProfileConnectionState = bluetooth.getProfileConnState(bluetooth.ProfileId.PROFILE_A2DP_SOURCE);
```

#### bluetooth.getRemoteDeviceName(deprecated)

getRemoteDeviceName(deviceId: string): string

Obtains the name of the remote Bluetooth device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.getRemoteDeviceName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetremotedevicenamedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| string | Device name (a string) obtained. |

**Example**

```javascript
let remoteDeviceName : string = bluetooth.getRemoteDeviceName("XX:XX:XX:XX:XX:XX");
```

#### bluetooth.getRemoteDeviceClass(deprecated)

getRemoteDeviceClass(deviceId: string): DeviceClass

Obtains the class of the remote Bluetooth device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.getRemoteDeviceClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetremotedeviceclassdeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| [DeviceClass](#deviceclassdeprecated) | Class of the remote device obtained. |

**Example**

```javascript
let remoteDeviceClass : bluetooth.DeviceClass = bluetooth.getRemoteDeviceClass("XX:XX:XX:XX:XX:XX");
```

#### bluetooth.getPairedDevices(deprecated)

getPairedDevices(): Array<string>

Obtains the paired devices.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.getPairedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetpaireddevicesdeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of the paired Bluetooth devices. |

**Example**

```javascript
let devices : Array<string> = bluetooth.getPairedDevices();
```

#### bluetooth.setBluetoothScanMode(deprecated)

setBluetoothScanMode(mode: ScanMode, duration: number): boolean

Sets the Bluetooth scan mode so that the device can be discovered by a remote device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.setBluetoothScanMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersetbluetoothscanmodedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| mode | [ScanMode](#scanmodedeprecated) | Yes | Bluetooth scan mode to set. |
| duration | number | Yes | Duration (in ms) in which the device can be discovered. The value **0** indicates unlimited time. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
// The device can be discovered and connected only when the discoverable and connectable mode is used.
let result : boolean = bluetooth.setBluetoothScanMode(bluetooth.ScanMode
    .SCAN_MODE_CONNECTABLE_GENERAL_DISCOVERABLE, 100);
```

#### bluetooth.getBluetoothScanMode(deprecated)

getBluetoothScanMode(): ScanMode

Obtains the Bluetooth scan mode.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.getBluetoothScanMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetbluetoothscanmodedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [ScanMode](#scanmodedeprecated) | Bluetooth scan mode to set. |

**Example**

```javascript
let scanMode : bluetooth.ScanMode = bluetooth.getBluetoothScanMode();
```

#### bluetooth.startBluetoothDiscovery(deprecated)

startBluetoothDiscovery(): boolean

Starts Bluetooth scan to discover remote devices.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.startBluetoothDiscovery](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagerstartbluetoothdiscoverydeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH and ohos.permission.LOCATION

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let deviceId : Array<string>;
function onReceiveEvent(data : Array<string>) {
    deviceId = data;
}
bluetooth.on('bluetoothDeviceFind', onReceiveEvent);
let result : boolean = bluetooth.startBluetoothDiscovery();
```

#### bluetooth.stopBluetoothDiscovery(deprecated)

stopBluetoothDiscovery(): boolean

Stops Bluetooth scan.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.stopBluetoothDiscovery](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagerstopbluetoothdiscoverydeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let result : boolean = bluetooth.stopBluetoothDiscovery();
```

#### bluetooth.setDevicePairingConfirmation(deprecated)

setDevicePairingConfirmation(device: string, accept: boolean): boolean

Sets the device pairing confirmation.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.setDevicePairingConfirmation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersetdevicepairingconfirmationdeprecated) instead.

**Required permissions**: ohos.permission.MANAGE_BLUETOOTH (available only for system applications)

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |
| accept | boolean | Yes | Whether to accept the pairing request. The value **true** means to accept the pairing request, and the value **false** means the opposite. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
// Subscribe to the pinRequired event and configure the pairing confirmation after receiving a pairing request from the remote device.
function onReceivePinRequiredEvent(data : bluetooth.PinRequiredParam) { // data is the input parameter for the pairing request.
    console.info('pin required  = '+ JSON.stringify(data));
    bluetooth.setDevicePairingConfirmation(data.deviceId, true);
}
bluetooth.on("pinRequired", onReceivePinRequiredEvent);
```

#### bluetooth.on('bluetoothDeviceFind')(deprecated)

on(type: 'bluetoothDeviceFind', callback: Callback<Array<string>>): void

Subscribes to the Bluetooth device discovery events.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.on('bluetoothDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageronbluetoothdevicefinddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bluetoothDeviceFind**, which indicates an event of discovering a Bluetooth device. |
| callback | Callback<Array<string>> | Yes | Callback used to return the discovered devices. You need to implement this callback. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : Array<string>) { // data is an array of Bluetooth device addresses.
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
bluetooth.on('bluetoothDeviceFind', onReceiveEvent);
```

#### bluetooth.off('bluetoothDeviceFind')(deprecated)

off(type: 'bluetoothDeviceFind', callback?: Callback<Array<string>>): void

Unsubscribes from the Bluetooth device discovery events.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.off('bluetoothDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageroffbluetoothdevicefinddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bluetoothDeviceFind**, which indicates an event of discovering a Bluetooth device. |
| callback | Callback<Array<string>> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : Array<string>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
bluetooth.on('bluetoothDeviceFind', onReceiveEvent);
bluetooth.off('bluetoothDeviceFind', onReceiveEvent);
```

#### bluetooth.on('pinRequired')(deprecated)

on(type: 'pinRequired', callback: Callback<PinRequiredParam>): void

Subscribes to the pairing request events of the remote Bluetooth device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.on('pinRequired')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageronpinrequireddeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **pinRequired**, which indicates a pairing request event. |
| callback | Callback<[PinRequiredParam](#pinrequiredparamdeprecated)> | Yes | Callback used to return the pairing request. You need to implement this callback. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.PinRequiredParam) { // data is the pairing request parameter.
    console.info('pin required = '+ JSON.stringify(data));
}
bluetooth.on('pinRequired', onReceiveEvent);
```

#### bluetooth.off('pinRequired')(deprecated)

off(type: 'pinRequired', callback?: Callback<PinRequiredParam>): void

Unsubscribes from the pairing request events of the remote Bluetooth device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.off('pinRequired')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageroffpinrequireddeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **pinRequired**, which indicates a pairing request event. |
| callback | Callback<[PinRequiredParam](#pinrequiredparamdeprecated)> | No | Callback to unregister. The input parameter is the pairing request parameter. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.PinRequiredParam) {
    console.info('pin required = '+ JSON.stringify(data));
}
bluetooth.on('pinRequired', onReceiveEvent);
bluetooth.off('pinRequired', onReceiveEvent);
```

#### bluetooth.on('bondStateChange')(deprecated)

on(type: 'bondStateChange', callback: Callback<BondStateParam>): void

Subscribes to the Bluetooth pairing state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.on('bondStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageronbondstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bondStateChange**, which indicates a Bluetooth pairing state change event. |
| callback | Callback<[BondStateParam](#bondstateparamdeprecated)> | Yes | Callback used to return the pairing state. You need to implement this callback. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.BondStateParam) { // data, as the input parameter of the callback, indicates the pairing state.
    console.info('pair state = '+ JSON.stringify(data));
}
bluetooth.on('bondStateChange', onReceiveEvent);
```

#### bluetooth.off('bondStateChange')(deprecated)

off(type: 'bondStateChange', callback?: Callback<BondStateParam>): void

Unsubscribes from the Bluetooth pairing state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.off('bondStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageroffbondstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **bondStateChange**, which indicates a Bluetooth pairing state change event. |
| callback | Callback<[BondStateParam](#bondstateparamdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.BondStateParam) {
    console.info('bond state = '+ JSON.stringify(data));
}
bluetooth.on('bondStateChange', onReceiveEvent);
bluetooth.off('bondStateChange', onReceiveEvent);
```

#### bluetooth.on('stateChange')(deprecated)

on(type: 'stateChange', callback: Callback<BluetoothState>): void

Subscribes to the Bluetooth connection state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.on('stateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageronstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **stateChange**, which indicates a Bluetooth connection state change event. |
| callback | Callback<[BluetoothState](#bluetoothstatedeprecated)> | Yes | Callback used to return the Bluetooth connection state. You need to implement this callback. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.BluetoothState) {
    console.info('bluetooth state = '+ JSON.stringify(data));
}
bluetooth.on('stateChange', onReceiveEvent);
```

#### bluetooth.off('stateChange')(deprecated)

off(type: 'stateChange', callback?: Callback<BluetoothState>): void

Unsubscribes from the Bluetooth connection state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.off('stateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageroffstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **stateChange**, which indicates a Bluetooth connection state change event. |
| callback | Callback<[BluetoothState](#bluetoothstatedeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.BluetoothState) {
    console.info('bluetooth state = '+ JSON.stringify(data));
}
bluetooth.on('stateChange', onReceiveEvent);
bluetooth.off('stateChange', onReceiveEvent);
```

#### bluetooth.sppListen(deprecated)

sppListen(name: string, option: SppOption, callback: AsyncCallback<number>): void

Creates a server listening socket.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.sppListen](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagerspplistendeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| name | string | Yes | Name of the service. |
| option | [SppOption](#sppoptiondeprecated) | Yes | Serial port profile (SPP) listening configuration. |
| callback | AsyncCallback<number> | Yes | Callback used to return the server socket ID. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let serverNumber = -1;
function serverSocket(code : BusinessError, number : number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth serverSocket Number: ${number}`);
    serverNumber = number;
  }
}

let sppOption : bluetooth.SppOption = {uuid: '00001810-0000-1000-8000-00805F9B34FB', secure: false, type: 0};
bluetooth.sppListen('server1', sppOption, serverSocket);
```

#### bluetooth.sppAccept(deprecated)

sppAccept(serverSocket: number, callback: AsyncCallback<number>): void

Listens for a connection to be made to this socket from the client and accepts it.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.sppAccept](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersppacceptdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serverSocket | number | Yes | Server socket ID. |
| callback | AsyncCallback<number> | Yes | Callback used to return the client socket ID. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let serverNumber = -1;
function serverSocket(code : BusinessError, number : number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth serverSocket Number: ${number}`);
    serverNumber = number;
  }
}
let clientNumber = -1;
function acceptClientSocket(code : BusinessError, number : number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth clientSocket Number: ${number}`);
    // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the server.
    clientNumber = number;
  }
}
bluetooth.sppAccept(serverNumber, acceptClientSocket);
```

#### bluetooth.sppConnect(deprecated)

sppConnect(device: string, option: SppOption, callback: AsyncCallback<number>): void

Initiates an SPP connection to a remote device from the client.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.sppConnect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersppconnectdeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |
| option | [SppOption](#sppoptiondeprecated) | Yes | Configuration for connecting to the SPP client. |
| callback | AsyncCallback<number> | Yes | Callback used to return the client socket ID. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code : BusinessError, number : number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
let sppOption : bluetooth.SppOption = {uuid: '00001810-0000-1000-8000-00805F9B34FB', secure: false, type: 0};
bluetooth.sppConnect('XX:XX:XX:XX:XX:XX', sppOption, clientSocket);
```

#### bluetooth.sppCloseServerSocket(deprecated)

sppCloseServerSocket(socket: number): void

Closes the listening socket of the server.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.sppCloseServerSocket](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersppcloseserversocketdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| socket | number | Yes | ID of the listening socket on the server. The ID is obtained by **sppListen**. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let serverNumber = -1;
function serverSocket(code : BusinessError, number : number) {
  console.info(`bluetooth error code: ${code.code}`);
  if (code.code == 0) {
    console.info(`bluetooth serverSocket Number: ${number}`);
    serverNumber = number;
  }
}
bluetooth.sppCloseServerSocket(serverNumber);
```

#### bluetooth.sppCloseClientSocket(deprecated)

sppCloseClientSocket(socket: number): void

Closes the client socket.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.sppCloseClientSocket](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersppcloseclientsocketdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| socket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code : BusinessError, number : number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
bluetooth.sppCloseClientSocket(clientNumber);
```

#### bluetooth.sppWrite(deprecated)

sppWrite(clientSocket: number, data: ArrayBuffer): boolean

Writes data to the remote device through the socket.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.sppWrite](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagersppwritedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientSocket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |
| data | ArrayBuffer | Yes | Data to write. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code : BusinessError, number : number) {
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
let ret : boolean = bluetooth.sppWrite(clientNumber, arrayBuffer);
if (ret) {
  console.info('spp write successfully');
} else {
  console.error('spp write failed');
}
```

#### bluetooth.on('sppRead')(deprecated)

on(type: 'sppRead', clientSocket: number, callback: Callback<ArrayBuffer>): void

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.on('sppRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageronsppreaddeprecated) instead.

Subscribes to the SPP read request events.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **sppRead**, which indicates an SPP read request event. |
| clientSocket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |
| callback | Callback<ArrayBuffer> | Yes | Callback used to return the data read. |

**Return value**

No value is returned.

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code : BusinessError, number : number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
function dataRead(dataBuffer : ArrayBuffer) {
  let data = new Uint8Array(dataBuffer);
}
bluetooth.on('sppRead', clientNumber, dataRead);
```

#### bluetooth.off('sppRead')(deprecated)

off(type: 'sppRead', clientSocket: number, callback?: Callback<ArrayBuffer>): void

Unsubscribes from the SPP read request events.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.off('sppRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanageroffsppreaddeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **sppRead**, which indicates an SPP read request event. |
| clientSocket | number | Yes | Client socket ID, which is obtained by **sppAccept** or **sppConnect**. |
| callback | Callback<ArrayBuffer> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let clientNumber = -1;
function clientSocket(code : BusinessError, number : number) {
  if (code == null || code.code != 0) {
    return;
  }
  console.info(`bluetooth serverSocket Number: ${number}`);
  // The obtained clientNumber is used as the socket ID for subsequent read/write operations on the client.
  clientNumber = number;
}
bluetooth.off('sppRead', clientNumber);
```

#### bluetooth.getProfile(deprecated)

getProfile(profileId: ProfileId): A2dpSourceProfile | HandsFreeAudioGatewayProfile

Obtains a profile object.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.getProfileInstance](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothmanagergetprofileinstancedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| profileId | [ProfileId](#profileiddeprecated) | Yes | ID of the profile to obtain, for example, **PROFILE_A2DP_SOURCE**. |

**Return value**

| Type | Description |
| --- | --- |
| [A2dpSourceProfile](#a2dpsourceprofile) \| [HandsFreeAudioGatewayProfile](#handsfreeaudiogatewayprofile) | Profile object obtained. Only **A2dpSourceProfile** and **HandsFreeAudioGatewayProfile** are supported. |

**Example**

```javascript
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
```

#### BLE

## createGattServer(deprecated)

createGattServer(): GattServer

Creates a **GattServer** instance.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLE.createGattServer](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#creategattserverdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [GattServer](#gattserver) | **GattServer** instance created. Before using a method of the server, you must create a **GattSever** instance. |

**Example**

```javascript
let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
```

## createGattClientDevice(deprecated)

createGattClientDevice(deviceId: string): GattClientDevice

Creates a **GattClientDevice** instance.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLE.createGattClientDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#creategattclientdevicedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| [GattClientDevice](#gattclientdevice) | **GattClientDevice** instance created. Before using a method of the client, you must create a **GattClientDevice** instance. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
```

## getConnectedBLEDevices(deprecated)

getConnectedBLEDevices(): Array<string>

Obtains the BLE devices connected to this device.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLE.getConnectedBLEDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getconnectedbledevicesdeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of the BLE devices connected to this device. |

**Example**

```javascript
let result : Array<string> = bluetooth.BLE.getConnectedBLEDevices();
```

## startBLEScan(deprecated)

startBLEScan(filters: Array<ScanFilter>, options?: ScanOptions): void

Starts a BLE scan.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLE.startBLEScan](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#startblescandeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH, ohos.permission.MANAGE_BLUETOOTH (available only for system applications), and ohos.permission.LOCATION

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| filters | Array<[ScanFilter](#scanfilterdeprecated)> | Yes | Criteria for filtering the scan result. Set this parameter to **null** if you do not want to filter the scan result. |
| options | [ScanOptions](#scanoptionsdeprecated) | No | Scan options. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : Array<bluetooth.ScanResult>) {
    console.info('BLE scan device find result = '+ JSON.stringify(data));
}
bluetooth.BLE.on("BLEDeviceFind", onReceiveEvent);
let scanOptions : bluetooth.ScanOptions = {
    interval: 500,
    dutyMode: bluetooth.ScanDuty.SCAN_MODE_LOW_POWER,
    matchMode: bluetooth.MatchMode.MATCH_MODE_AGGRESSIVE,
}

let scanFilter : bluetooth.ScanFilter = {
    deviceId:"XX:XX:XX:XX:XX:XX",
    name:"test",
    serviceUuid:"00001888-0000-1000-8000-00805f9b34fb"
}
bluetooth.BLE.startBLEScan(
    [scanFilter], scanOptions
);
```

## stopBLEScan(deprecated)

stopBLEScan(): void

Stops the BLE scan.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLE.stopBLEScan](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#stopblescandeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

No value is returned.

**Example**

```javascript
bluetooth.BLE.stopBLEScan();
```

## on('BLEDeviceFind')(deprecated)

on(type: 'BLEDeviceFind', callback: Callback<Array<ScanResult>>): void

Subscribe to the BLE device discovery events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLE.on('BLEDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#onbledevicefinddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEDeviceFind**, which indicates an event of discovering a BLE device. |
| callback | Callback<Array<[ScanResult](#scanresultdeprecated)>> | Yes | Callback used to return the discovered devices. You need to implement this callback. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : Array<bluetooth.ScanResult>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
bluetooth.BLE.on('BLEDeviceFind', onReceiveEvent);
```

## off('BLEDeviceFind')(deprecated)

off(type: 'BLEDeviceFind', callback?: Callback<Array<ScanResult>>): void

Unsubscribes from the BLE device discovery events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLE.off('BLEDeviceFind')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offbledevicefinddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEDeviceFind**, which indicates an event of discovering a BLE device. |
| callback | Callback<Array<[ScanResult](#scanresultdeprecated)>> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : Array<bluetooth.ScanResult>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
bluetooth.BLE.on('BLEDeviceFind', onReceiveEvent);
bluetooth.BLE.off('BLEDeviceFind', onReceiveEvent);
```

#### BaseProfile

Provides the profile base class.

## getConnectionDevices(deprecated)

getConnectionDevices(): Array<string>

Obtains the connected devices.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.BaseProfile.getConnectionDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getconnectiondevicesdeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of the connected devices. |

**Example**

```javascript
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
let retArray : Array<string> = a2dpSrc.getConnectionDevices();
```

## getDeviceState(deprecated)

getDeviceState(device: string): ProfileConnectionState

Obtains the connection state of the profile.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.BaseProfile.getDeviceState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getdevicestatedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstatedeprecated) | Profile connection state obtained. |

**Example**

```javascript
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
let ret : bluetooth.ProfileConnectionState = a2dpSrc.getDeviceState('XX:XX:XX:XX:XX:XX');
```

#### A2dpSourceProfile

Before using a method of **A2dpSourceProfile**, you need to create an instance of this class by using the **getProfile()** method.

## connect(deprecated)

connect(device: string): boolean

Sets up an Advanced Audio Distribution Profile (A2DP) connection.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.A2dpSourceProfile.connect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#connectdeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
let ret : boolean = a2dpSrc.connect('XX:XX:XX:XX:XX:XX');
```

## disconnect(deprecated)

disconnect(device: string): boolean

Disconnects an A2DP connection.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.A2dpSourceProfile.disconnect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#disconnectdeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
let ret : boolean = a2dpSrc.disconnect('XX:XX:XX:XX:XX:XX');
```

## on('connectionStateChange')(deprecated)

on(type: 'connectionStateChange', callback: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Subscribes to the A2DP connection state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.A2dpSourceProfile.on('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#onconnectionstatechangedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | Yes | Callback used to return the A2DP connection state. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.StateChangeParam) {
    console.info('a2dp state = '+ JSON.stringify(data));
}
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
a2dpSrc.on('connectionStateChange', onReceiveEvent);
```

## off('connectionStateChange')(deprecated)

off(type: 'connectionStateChange', callback?: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Unsubscribes from the A2DP connection state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.A2dpSourceProfile.off('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offconnectionstatechangedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | No | Callback to unregister. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.StateChangeParam) {
    console.info('a2dp state = '+ JSON.stringify(data));
}
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
a2dpSrc.on('connectionStateChange', onReceiveEvent);
a2dpSrc.off('connectionStateChange', onReceiveEvent);
```

## getPlayingState(deprecated)

getPlayingState(device: string): PlayingState

Obtains the playing state of a device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.A2dpSourceProfile.getPlayingState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getplayingstatedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| [PlayingState](#playingstatedeprecated) | Playing state of the remote device obtained. |

**Example**

```javascript
let a2dpSrc : bluetooth.A2dpSourceProfile = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
let state : bluetooth.PlayingState = a2dpSrc.getPlayingState('XX:XX:XX:XX:XX:XX');
```

#### HandsFreeAudioGatewayProfile

Before using a method of **HandsFreeAudioGatewayProfile**, you need to create an instance of this class by using the **getProfile()** method.

## connect(deprecated)

connect(device: string): boolean

Sets up a Hands-free Profile (HFP) connection of a device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.HandsFreeAudioGatewayProfile.connect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#connectdeprecated-1) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let hfpAg : bluetooth.HandsFreeAudioGatewayProfile= bluetooth.getProfile(bluetooth.ProfileId
    .PROFILE_HANDS_FREE_AUDIO_GATEWAY);
let ret : boolean = hfpAg.connect('XX:XX:XX:XX:XX:XX');
```

## disconnect(deprecated)

disconnect(device: string): boolean

Disconnects the HFP connection of a device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.HandsFreeAudioGatewayProfile.disconnect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#disconnectdeprecated-1) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| device | string | Yes | Address of the target device. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let hfpAg : bluetooth.HandsFreeAudioGatewayProfile = bluetooth.getProfile(bluetooth.ProfileId
    .PROFILE_HANDS_FREE_AUDIO_GATEWAY);
let ret : boolean = hfpAg.disconnect('XX:XX:XX:XX:XX:XX');
```

## on('connectionStateChange')(deprecated)

on(type: 'connectionStateChange', callback: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Subscribes to the HFP connection state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.HandsFreeAudioGatewayProfile.on('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#onconnectionstatechangedeprecated-1) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | Yes | Callback used to return the HFP connection state. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.StateChangeParam) {
    console.info('hfp state = '+ JSON.stringify(data));
}
let hfpAg : bluetooth.HandsFreeAudioGatewayProfile= bluetooth.getProfile(bluetooth.ProfileId
    .PROFILE_HANDS_FREE_AUDIO_GATEWAY);
hfpAg.on('connectionStateChange', onReceiveEvent);
```

## off('connectionStateChange')(deprecated)

off(type: 'connectionStateChange', callback?: Callback<[StateChangeParam](#statechangeparamdeprecated)>): void

Unsubscribes from the HFP connection state changes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.HandsFreeAudioGatewayProfile.off('connectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offconnectionstatechangedeprecated-1) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectionStateChange**, which indicates a connection state change event. |
| callback | Callback<[StateChangeParam](#statechangeparamdeprecated)> | No | Callback to unregister. |

**Return value**

No value is returned.

**Example**

```javascript
function onReceiveEvent(data : bluetooth.StateChangeParam) {
    console.info('hfp state = '+ JSON.stringify(data));
}
let hfpAg : bluetooth.HandsFreeAudioGatewayProfile= bluetooth.getProfile(bluetooth.ProfileId
    .PROFILE_HANDS_FREE_AUDIO_GATEWAY);
hfpAg.on('connectionStateChange', onReceiveEvent);
hfpAg.off('connectionStateChange', onReceiveEvent);
```

#### GattServer

Implements the Generic Attribute Profile (GATT) server. Before using a method of this class, you need to create a **GattServer** instance using the **createGattServer()** method.

## startAdvertising(deprecated)

startAdvertising(setting: AdvertiseSetting, advData: AdvertiseData, advResponse?: AdvertiseData): void

Starts BLE advertising.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.startAdvertising](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#startadvertisingdeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| setting | [AdvertiseSetting](#advertisesettingdeprecated) | Yes | Settings related to BLE advertising. |
| advData | [AdvertiseData](#advertisedatadeprecated) | Yes | Content of the BLE advertisement packet. |
| advResponse | [AdvertiseData](#advertisedatadeprecated) | No | Response to the BLE scan request. |

**Return value**

No value is returned.

**Example**

```javascript
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
let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
let setting : bluetooth.AdvertiseSetting = {
    interval:150,
    txPower:60,
    connectable:true,
}

let manufactureData : bluetooth.ManufactureData = {
    manufactureId:4567,
    manufactureValue:manufactureValueBuffer.buffer
}

let serviceData : bluetooth.ServiceData = {
    serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
    serviceValue:serviceValueBuffer.buffer
}

let advData : bluetooth.AdvertiseData = {
    serviceUuids:["00001889-0000-1000-8000-00805f9b34fb"],
    manufactureData:[manufactureData],
    serviceData:[serviceData],
}

let advResponse : bluetooth.AdvertiseData = {
    serviceUuids:["00001889-0000-1000-8000-00805f9b34fb"],
    manufactureData:[manufactureData],
    serviceData:[serviceData],
}
gattServer.startAdvertising(setting, advData, advResponse);
```

## stopAdvertising(deprecated)

stopAdvertising(): void

Stops BLE advertising.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.stopAdvertising](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#stopadvertisingdeprecated) instead.

**Required permissions**: ohos.permission.DISCOVER_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

No value is returned.

**Example**

```javascript
let server : bluetooth.GattServer = bluetooth.BLE.createGattServer();
server.stopAdvertising();
```

## addService(deprecated)

addService(service: GattService): boolean

Adds a service to this GATT server.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.addService](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#addservicedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| service | [GattService](#gattservicedeprecated) | Yes | Service to add. Settings related to BLE advertising. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
// Create descriptors.
let descriptors : Array<bluetooth.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(8);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;

// Create characteristics.
let characteristics : Array<bluetooth.BLECharacteristic> = [];
let arrayBufferC = new ArrayBuffer(8);
let cccV = new Uint8Array(arrayBufferC);
cccV[0] = 1;
let characteristic : bluetooth.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
let characteristicN : bluetooth.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001821-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
characteristics[0] = characteristic;

// Create a gattService instance.
let gattService : bluetooth.GattService = {serviceUuid:'00001810-0000-1000-8000-00805F9B34FB', isPrimary: true, characteristics:characteristics, includeServices:[]};

let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
let ret : boolean = gattServer.addService(gattService);
if (ret) {
   console.info("add service successfully");
} else {
   console.error("add service failed");
}
```

## removeService(deprecated)

removeService(serviceUuid: string): boolean

Removes a service from this GATT server.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.removeService](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#removeservicedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serviceUuid | string | Yes | Universally unique identifier (UUID) of the service to remove, for example, **00001810-0000-1000-8000-00805F9B34FB**. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let server : bluetooth.GattServer = bluetooth.BLE.createGattServer();
server.removeService('00001810-0000-1000-8000-00805F9B34FB');
```

## close(deprecated)

close(): void

Closes this GATT server to unregister it from the protocol stack. The closed [GattServer](#gattserver) instance will no longer be used.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.close](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#closedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Example**

```javascript
let server : bluetooth.GattServer = bluetooth.BLE.createGattServer();
server.close();
```

## notifyCharacteristicChanged(deprecated)

notifyCharacteristicChanged(deviceId: string, notifyCharacteristic: NotifyCharacteristic): boolean

Notifies the connected client device when a characteristic value changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.notifyCharacteristicChanged](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#notifycharacteristicchangeddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the client that receives notifications, for example, XX:XX:XX:XX:XX:XX. |
| notifyCharacteristic | [NotifyCharacteristic](#notifycharacteristicdeprecated) | Yes | New characteristic value. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
// Create descriptors.
let descriptors : Array<bluetooth.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(8);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;
let arrayBufferC = new ArrayBuffer(8);
let characteristic : bluetooth.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
let notifyCharacteristic : bluetooth.NotifyCharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001821-0000-1000-8000-00805F9B34FB', characteristicValue: characteristic.characteristicValue, confirm: false};
let server : bluetooth.GattServer = bluetooth.BLE.createGattServer();
server.notifyCharacteristicChanged('XX:XX:XX:XX:XX:XX', notifyCharacteristic);
```

## sendResponse(deprecated)

sendResponse(serverResponse: ServerResponse): boolean

Sends a response to a read or write request from the GATT client.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.sendResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#sendresponsedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serverResponse | [ServerResponse](#serverresponsedeprecated) | Yes | Response returned by the GATT server. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
/* send response */
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
cccValue[0] = 1;
let serverResponse : bluetooth.ServerResponse = {
    "deviceId": "XX:XX:XX:XX:XX:XX",
    "transId": 0,
    "status": 0,
    "offset": 0,
    "value": arrayBufferCCC,
};

let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
let ret : boolean = gattServer.sendResponse(serverResponse);
if (ret) {
  console.info('bluetooth sendResponse successfully');
} else {
  console.error('bluetooth sendResponse failed');
}
```

## on('characteristicRead')(deprecated)

on(type: 'characteristicRead', callback: Callback<CharacteristicReadReq>): void

Subscribes to the characteristic read request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.on('characteristicRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#oncharacteristicreaddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicRead**, which indicates a characteristic read request event. |
| callback | Callback<[CharacteristicReadReq](#characteristicreadreqdeprecated)> | Yes | Callback used to return a characteristic read request event from the GATT client. |

**Return value**

No value is returned.

**Example**

```javascript
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
cccValue[0] = 1;
function ReadCharacteristicReq(CharacteristicReadReq : bluetooth.CharacteristicReadReq) {
  let deviceId : string = CharacteristicReadReq.deviceId;
  let transId : number = CharacteristicReadReq.transId;
  let offset : number = CharacteristicReadReq.offset;
  let characteristicUuid : string = CharacteristicReadReq.characteristicUuid;

  let serverResponse : bluetooth.ServerResponse = {deviceId: deviceId, transId: transId, status: 0,
  offset: offset, value:arrayBufferCCC};

  let ret : boolean = gattServer.sendResponse(serverResponse);
  if (ret) {
    console.info('bluetooth sendResponse successfully');
  } else {
    console.error('bluetooth sendResponse failed');
  }
}

let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.on("characteristicRead", ReadCharacteristicReq);
```

## off('characteristicRead')(deprecated)

off(type: 'characteristicRead', callback?: Callback<CharacteristicReadReq>): void

Unsubscribes from the characteristic read request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.off('characteristicRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offcharacteristicreaddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicRead**, which indicates a characteristic read request event. |
| callback | Callback<[CharacteristicReadReq](#characteristicreadreqdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.off("characteristicRead");
```

## on('characteristicWrite')(deprecated)

on(type: 'characteristicWrite', callback: Callback<CharacteristicWriteReq>): void

Subscribes to the characteristic write request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.on('characteristicWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#oncharacteristicwritedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicWrite**, which indicates a characteristic write request event. |
| callback | Callback<[CharacteristicWriteReq](#characteristicwritereqdeprecated)> | Yes | Callback used to return a characteristic write request from the GATT client. |

**Return value**

No value is returned.

**Example**

```javascript
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
function WriteCharacteristicReq(CharacteristicWriteReq : bluetooth.CharacteristicWriteReq) {
  let deviceId : string = CharacteristicWriteReq.deviceId;
  let transId : number = CharacteristicWriteReq.transId;
  let offset : number = CharacteristicWriteReq.offset;
  let isPrep : boolean = CharacteristicWriteReq.isPrep;
  let needRsp : boolean = CharacteristicWriteReq.needRsp;
  let value =  new Uint8Array(arrayBufferCCC);
  let characteristicUuid : string = CharacteristicWriteReq.characteristicUuid;

  cccValue.set(new Uint8Array(value));
  let serverResponse : bluetooth.ServerResponse = {deviceId: deviceId, transId: transId, status: 0,
  offset: offset, value:arrayBufferCCC};

  let ret : boolean = gattServer.sendResponse(serverResponse);
  if (ret) {
    console.info('bluetooth sendResponse successfully');
  } else {
    console.error('bluetooth sendResponse failed');
  }
}

let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.on("characteristicWrite", WriteCharacteristicReq);
```

## off('characteristicWrite')(deprecated)

off(type: 'characteristicWrite', callback?: Callback<CharacteristicWriteReq>): void

Unsubscribes from the characteristic write request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.off('characteristicWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offcharacteristicwritedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **characteristicWrite**, which indicates a characteristic write request event. |
| callback | Callback<[CharacteristicWriteReq](#characteristicwritereqdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.off("characteristicWrite");
```

## on('descriptorRead')(deprecated)

on(type: 'descriptorRead', callback: Callback<DescriptorReadReq>): void

Subscribes to the descriptor read request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.on('descriptorRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#ondescriptorreaddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorRead**, which indicates a descriptor read request event. |
| callback | Callback<[DescriptorReadReq](#descriptorreadreqdeprecated)> | Yes | Callback used to return a characteristic read request event from the GATT client. |

**Return value**

No value is returned.

**Example**

```javascript
let arrayBufferDesc = new ArrayBuffer(8);
let descValue = new Uint8Array(arrayBufferDesc);
descValue[0] = 1;
function ReadDescriptorReq(DescriptorReadReq : bluetooth.DescriptorReadReq) {
  let deviceId : string = DescriptorReadReq.deviceId;
  let transId : number = DescriptorReadReq.transId;
  let offset : number = DescriptorReadReq.offset;
  let descriptorUuid : string = DescriptorReadReq.descriptorUuid;

  let serverResponse : bluetooth.ServerResponse = {deviceId: deviceId, transId: transId, status: 0,
  offset: offset, value:arrayBufferDesc};

  let ret : boolean = gattServer.sendResponse(serverResponse);
  if (ret) {
    console.info('bluetooth sendResponse successfully');
  } else {
    console.error('bluetooth sendResponse failed');
  }
}

let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.on("descriptorRead", ReadDescriptorReq);
```

## off('descriptorRead')(deprecated)

off(type: 'descriptorRead', callback?: Callback<DescriptorReadReq>): void

Unsubscribes from the descriptor read request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.off('descriptorRead')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offdescriptorreaddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorRead**, which indicates a descriptor read request event. |
| callback | Callback<[DescriptorReadReq](#descriptorreadreqdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.off("descriptorRead");
```

## on('descriptorWrite')(deprecated)

on(type: 'descriptorWrite', callback: Callback<DescriptorWriteReq>): void

Subscribes to the descriptor write request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.on('descriptorWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#ondescriptorwritedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorWrite**, which indicates a descriptor write request event. |
| callback | Callback<[DescriptorWriteReq](#descriptorwritereqdeprecated)> | Yes | Callback used to return a characteristic write request from the GATT client. |

**Return value**

No value is returned.

**Example**

```javascript
let arrayBufferDesc = new ArrayBuffer(8);
let descValue = new Uint8Array(arrayBufferDesc);
function WriteDescriptorReq(DescriptorWriteReq : bluetooth.DescriptorWriteReq) {
  let deviceId : string = DescriptorWriteReq.deviceId;
  let transId : number = DescriptorWriteReq.transId;
  let offset : number = DescriptorWriteReq.offset;
  let isPrep : boolean = DescriptorWriteReq.isPrep;
  let needRsp : boolean = DescriptorWriteReq.needRsp;
  let value = new Uint8Array(arrayBufferDesc);
  let descriptorUuid : string = DescriptorWriteReq.descriptorUuid;

  descValue.set(new Uint8Array(value));
  let serverResponse : bluetooth.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferDesc};

  let ret : boolean = gattServer.sendResponse(serverResponse);
  if (ret) {
    console.info('bluetooth sendResponse successfully');
  } else {
    console.error('bluetooth sendResponse failed');
  }
}

let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.on("descriptorWrite", WriteDescriptorReq);
```

## off('descriptorWrite')(deprecated)

off(type: 'descriptorWrite', callback?: Callback<DescriptorWriteReq>): void

Unsubscribes from the descriptor write request events.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.off('descriptorWrite')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offdescriptorwritedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **descriptorWrite**, which indicates a descriptor write request event. |
| callback | Callback<[DescriptorWriteReq](#descriptorwritereqdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.off("descriptorWrite");
```

## on('connectStateChange')(deprecated)

on(type: 'connectStateChange', callback: Callback<BLEConnectChangedState>): void

Subscribes to the BLE connection state changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.on('connectStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#onconnectstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | Yes | Callback used to return the BLE connection state. |

**Return value**

No value is returned.

**Example**

```javascript
function Connected(BLEConnectChangedState : bluetooth.BLEConnectChangedState) {
  let deviceId : string = BLEConnectChangedState.deviceId;
  let status : bluetooth.ProfileConnectionState = BLEConnectChangedState.state;
}

let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.on("connectStateChange", Connected);
```

## off('connectStateChange')(deprecated)

off(type: 'connectStateChange', callback?: Callback<BLEConnectChangedState>): void

Unsubscribes from the BLE connection state changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattServer.off('connectStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offconnectstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **connectStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
let gattServer : bluetooth.GattServer = bluetooth.BLE.createGattServer();
gattServer.off("connectStateChange");
```

#### GattClientDevice

Implements the GATT client. Before using a method of this class, you must create a **GattClientDevice** instance using the **createGattClientDevice(deviceId: string)** method.

## connect(deprecated)

connect(): boolean

Initiates a connection to the remote BLE device on the client.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.connect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#connectdeprecated-1) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the connection is successful; returns **false** otherwise. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let ret : boolean = device.connect();
```

## disconnect(deprecated)

disconnect(): boolean

Disconnects from the remote BLE device.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.disconnect](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#disconnectdeprecated-2) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let ret : boolean = device.disconnect();
```

## close(deprecated)

close(): boolean

Closes this GATT client to unregister it from the protocol stack. After this method is called, this [GattClientDevice](#gattclientdevice) instance cannot be used.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.close](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#closedeprecated-1) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let ret : boolean = device.close();
```

## getServices(deprecated)

getServices(callback: AsyncCallback<Array<GattService>>): void

Obtains all services of the remote BLE device. This API uses an asynchronous callback to return the result.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.getServices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getservicesdeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<Array<[GattService](#gattservicedeprecated)>> | Yes | Callback used to return the services obtained. |

**Return value**

No value is returned.

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
// Callback mode.
function getServices(code : BusinessError, gattServices : Array<bluetooth.GattService>) {
  if (code.code == 0) {
      console.info(`bluetooth code is ${code.code}`);
      console.info(`bluetooth services size is ${gattServices.length}`);

      for (let i = 0; i < gattServices.length; i++) {
        console.info(`bluetooth serviceUuid is ${gattServices[i].serviceUuid}`);
      }
  }
}

let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.connect();
device.getServices(getServices);
```

## getServices(deprecated)

getServices(): Promise<Array<GattService>>

Obtains all services of the remote BLE device. This API uses a promise to return the result.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.getServices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getservicesdeprecated-1) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Promise<Array<[GattService](#gattservicedeprecated)>> | Promise used to return the services obtained. |

**Example**

```javascript
// Promise
let device : bluetooth.GattClientDevice= bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.connect();
device.getServices().then((result : Array<bluetooth.GattService>) => {
    console.info("getServices successfully:" + JSON.stringify(result));
});
```

## readCharacteristicValue(deprecated)

readCharacteristicValue(characteristic: BLECharacteristic, callback: AsyncCallback<BLECharacteristic>): void

Reads the characteristic value of the specific service of the remote BLE device on the client.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.readCharacteristicValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#readcharacteristicvaluedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | Characteristic value to read. |
| callback | AsyncCallback<[BLECharacteristic](#blecharacteristicdeprecated)> | Yes | Callback used to return the characteristic value read. |

**Return value**

No value is returned.

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
function readCcc(code : BusinessError, BLECharacteristic : bluetooth.BLECharacteristic) {
  if (code.code != 0) {
      return;
  }
  console.info(`bluetooth characteristic uuid: ${BLECharacteristic.characteristicUuid}`);
  let value = new Uint8Array(BLECharacteristic.characteristicValue);
}

let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let descriptors : Array<bluetooth.BLEDescriptor> = [];
let bufferDesc : ArrayBuffer = new ArrayBuffer(8);
let descV : Uint8Array = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic : bluetooth.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
characteristicValue: bufferCCC, descriptors:descriptors};

device.readCharacteristicValue(characteristic, readCcc);
```

## readCharacteristicValue(deprecated)

readCharacteristicValue(characteristic: BLECharacteristic): Promise<BLECharacteristic>

Reads the characteristic value of the specific service of the remote BLE device on the client. This API uses a promise to return the result.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.readCharacteristicValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#readcharacteristicvaluedeprecated-1) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | Characteristic value to read. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<[BLECharacteristic](#blecharacteristicdeprecated)> | Promise used to return the characteristic value read. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let descriptors : Array<bluetooth.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic : bluetooth.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
characteristicValue: bufferCCC, descriptors:descriptors};

device.readCharacteristicValue(characteristic);
```

## readDescriptorValue(deprecated)

readDescriptorValue(descriptor: BLEDescriptor, callback: AsyncCallback<BLEDescriptor>): void

Reads the descriptor contained in the specific characteristic of the remote BLE device on the client.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.readDescriptorValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#readdescriptorvaluedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptordeprecated) | Yes | Descriptor to read. |
| callback | AsyncCallback<[BLEDescriptor](#bledescriptordeprecated)> | Yes | Callback used to return the descriptor read. |

**Return value**

No value is returned.

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
function readDesc(code : BusinessError, BLEDescriptor : bluetooth.BLEDescriptor) {
  if (code.code != 0) {
      return;
  }
  console.info(`bluetooth descriptor uuid: ${BLEDescriptor.descriptorUuid}`);
  let value = new Uint8Array(BLEDescriptor.descriptorValue);
}

let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
device.readDescriptorValue(descriptor, readDesc);
```

## readDescriptorValue(deprecated)

readDescriptorValue(descriptor: BLEDescriptor): Promise<BLEDescriptor>

Reads the descriptor contained in the specific characteristic of the remote BLE device on the client. This API uses a promise to return the result.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.readDescriptorValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#readdescriptorvaluedeprecated-1) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptordeprecated) | Yes | Descriptor to read. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<[BLEDescriptor](#bledescriptordeprecated)> | Promise used to return the descriptor read. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
device.readDescriptorValue(descriptor);
```

## writeCharacteristicValue(deprecated)

writeCharacteristicValue(characteristic: BLECharacteristic): boolean

Writes a characteristic value to the remote BLE device.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.writeCharacteristicValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#writecharacteristicvaluedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | Binary value and other parameters of the BLE device characteristic. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let descriptors : Array<bluetooth.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic : bluetooth.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  characteristicValue: bufferCCC, descriptors:descriptors};
let retWriteCcc : boolean = device.writeCharacteristicValue(characteristic);
if (retWriteCcc) {
  console.info('write characteristic successfully');
} else {
  console.error('write characteristic failed');
}
```

## writeDescriptorValue(deprecated)

writeDescriptorValue(descriptor: BLEDescriptor): boolean

Writes binary data to the specific descriptor of the remote BLE device.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.writeDescriptorValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#writedescriptorvaluedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptordeprecated) | Yes | Binary value and other parameters of the BLE device descriptor. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
let bufferDesc = new ArrayBuffer(8);
let descV = new Uint8Array(bufferDesc);
descV[0] = 22;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002903-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
let retWriteDesc : boolean = device.writeDescriptorValue(descriptor);
if (retWriteDesc) {
  console.info('bluetooth write descriptor successfully');
} else {
  console.error('bluetooth write descriptor failed');
}
```

## setBLEMtuSize(deprecated)

setBLEMtuSize(mtu: number): boolean

Sets the maximum transmission unit (MTU) that can be transmitted between the GATT client and its remote BLE device. This API can be used only after a connection is set up by calling [connect](#connectdeprecated).

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.setBLEMtuSize](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#setblemtusizedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| mtu | number | Yes | MTU to set, which ranges from 22 to 512 bytes. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.setBLEMtuSize(128);
```

## setNotifyCharacteristicChanged(deprecated)

setNotifyCharacteristicChanged(characteristic: BLECharacteristic, enable: boolean): boolean

Sets the function of notifying the GATT client when the characteristic value of the remote BLE device changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.setNotifyCharacteristicChanged](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#setnotifycharacteristicchangeddeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristicdeprecated) | Yes | BLE characteristic to listen for. |
| enable | boolean | Yes | Whether to enable the notify function. The value **true** means to enable the notify function, and the value **false** means the opposite. |

**Return value**

| Type | Description |
| --- | --- |
| boolean | Returns **true** if the operation is successful; returns **false** otherwise. |

**Example**

```javascript
// Create descriptors.
let descriptors : Array<bluetooth.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(8);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 11;
let descriptor : bluetooth.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;
let arrayBufferC = new ArrayBuffer(8);
let characteristic : bluetooth.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.setNotifyCharacteristicChanged(characteristic, false);
```

## on('BLECharacteristicChange')(deprecated)

on(type: 'BLECharacteristicChange', callback: Callback<BLECharacteristic>): void

Subscribes to the BLE characteristic changes. The client can receive a notification from the server only after the **setNotifyCharacteristicChanged** method is called.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.on('BLECharacteristicChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#onblecharacteristicchangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLECharacteristicChange**, which indicates a characteristic value change event. |
| callback | Callback<[BLECharacteristic](#blecharacteristicdeprecated)> | Yes | Callback used to return the characteristic value changes. |

**Return value**

No value is returned.

**Example**

```javascript
function CharacteristicChange(CharacteristicChangeReq : bluetooth.BLECharacteristic) {
  let serviceUuid : string = CharacteristicChangeReq.serviceUuid;
  let characteristicUuid : string = CharacteristicChangeReq.characteristicUuid;
  let value = new Uint8Array(CharacteristicChangeReq.characteristicValue);
}
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.on('BLECharacteristicChange', CharacteristicChange);
```

## off('BLECharacteristicChange')(deprecated)

off(type: 'BLECharacteristicChange', callback?: Callback<BLECharacteristic>): void

Unsubscribes from the BLE characteristic changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.off('BLECharacteristicChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offblecharacteristicchangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLECharacteristicChange**, which indicates a characteristic value change event. |
| callback | Callback<[BLECharacteristic](#blecharacteristicdeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.off('BLECharacteristicChange');
```

## on('BLEConnectionStateChange')(deprecated)

on(type: 'BLEConnectionStateChange', callback: Callback<BLEConnectChangedState>): void

Subscribes to the BLE connection state changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.on('BLEConnectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#onbleconnectionstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEConnectionStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | Yes | Callback used to return the BLE connection state. |

**Return value**

No value is returned.

**Example**

```javascript
function ConnectStateChanged(state : bluetooth.BLEConnectChangedState) {
  console.info('bluetooth connect state changed');
  let connectState : bluetooth.ProfileConnectionState = state.state;
}
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.on('BLEConnectionStateChange', ConnectStateChanged);
```

## off('BLEConnectionStateChange')(deprecated)

off(type: 'BLEConnectionStateChange', callback?: Callback<BLEConnectChangedState>): void

Unsubscribes from the BLE connection state changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.off('BLEConnectionStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#offbleconnectionstatechangedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value is **BLEConnectionStateChange**, which indicates a BLE connection state change event. |
| callback | Callback<[BLEConnectChangedState](#bleconnectchangedstatedeprecated)> | No | Callback to unregister. If this parameter is not set, this API unregisters all callbacks for **type**. |

**Return value**

No value is returned.

**Example**

```javascript
let device : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice('XX:XX:XX:XX:XX:XX');
device.off('BLEConnectionStateChange');
```

## getDeviceName(deprecated)

getDeviceName(callback: AsyncCallback<string>): void

Obtains the name of the remote BLE device on the client.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.getDeviceName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getdevicenamedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<string> | Yes | Callback used to return the remote BLE device name obtained. |

**Return value**

No value is returned.

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// callback
let gattClient : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
let deviceName : void = gattClient.getDeviceName((err : BusinessError, data : string)=> {
    console.info('device name err ' + JSON.stringify(err));
    console.info('device name' + JSON.stringify(data));
})
```

## getDeviceName(deprecated)

getDeviceName(): Promise<string>

Obtains the name of the remote BLE device on the client. This API uses a promise to return the result.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.getDeviceName](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getdevicenamedeprecated-1) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Promise<string> | Promise used to return the remote BLE device name. |

**Example**

```javascript
// promise
let gattClient : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
gattClient.getDeviceName().then((data) => {
    console.info('device name' + JSON.stringify(data));
})
```

## getRssiValue(deprecated)

getRssiValue(callback: AsyncCallback<number>): void

Obtains the received signal strength indication (RSSI) of the remote BLE device on the client. This API can be used only after a connection is set up by calling [connect](#connectdeprecated).

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.getRssiValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getrssivaluedeprecated) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<number> | Yes | Callback used to return the RSSI, in dBm. |

**Return value**

No value is returned.

**Example**

```javascript
import { BusinessError } from '@ohos.base';
// callback
let gattClient : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
let ret : boolean = gattClient.connect();
gattClient.getRssiValue((err : BusinessError, data : number)=> {
    console.info('rssi err ' + JSON.stringify(err));
    console.info('rssi value' + JSON.stringify(data));
})
```

## getRssiValue(deprecated)

getRssiValue(): Promise<number>

Obtains the RSSI of the remote BLE device on the client. This API uses a promise to return the result. It can be used only after a connection is set up by calling [connect](#connectdeprecated).

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattClientDevice.getRssiValue](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#getrssivaluedeprecated-1) instead.

**Required permissions**: ohos.permission.USE_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| Promise<number> | Promise used to return the RSSI, in dBm. |

**Example**

```javascript
// promise
let gattClient : bluetooth.GattClientDevice = bluetooth.BLE.createGattClientDevice("XX:XX:XX:XX:XX:XX");
gattClient.getRssiValue().then((data : number) => {
    console.info('rssi' + JSON.stringify(data));
})
```

#### ScanMode(deprecated)

Enumerates the scan modes.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.ScanMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#scanmodedeprecated) instead.

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

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.BondState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bondstatedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| BOND_STATE_INVALID | 0 | Invalid pairing. |
| BOND_STATE_BONDING | 1 | Pairing. |
| BOND_STATE_BONDED | 2 | Paired. |

#### SppOption(deprecated)

Defines the SPP configuration parameters.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.SppOption](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#sppoptiondeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| uuid | string | No | No | Service UUID of the socket link type. |
| secure | boolean | No | No | Whether it is a secure channel. |
| type | [SppType](#spptypedeprecated) | No | No | Type of the SPP link. |

#### SppType(deprecated)

Enumerates the SPP link types.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.SppType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#spptypedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| SPP_RFCOMM | 0 | Radio frequency communication (RFCOMM) link type. |

#### GattService(deprecated)

Defines the GATT service API parameters.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.GattService](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#gattservicedeprecated).

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| isPrimary | boolean | No | No | Whether the service is a primary service. The value **true** means a primary service. |
| characteristics | Array<[BLECharacteristic](#blecharacteristicdeprecated)> | No | No | List of characteristics of the service. |
| includeServices | Array<[GattService](#gattservicedeprecated)> | No | Yes | Services on which the service depends. |

#### BLECharacteristic(deprecated)

Defines the characteristic API parameters.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLECharacteristic](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#blecharacteristicdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| characteristicValue | ArrayBuffer | No | No | Binary value of the characteristic. |
| descriptors | Array<[BLEDescriptor](#bledescriptordeprecated)> | No | No | List of descriptors of the characteristic. |

#### BLEDescriptor(deprecated)

Defines the descriptor API parameters.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLEDescriptor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bledescriptordeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| descriptorUuid | string | No | No | UUID of the descriptor, for example, **00002902-0000-1000-8000-00805f9b34fb**. |
| descriptorValue | ArrayBuffer | No | No | Binary value of the descriptor. |

#### NotifyCharacteristic(deprecated)

Defines the parameters in the notifications sent when the server characteristic value changes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.NotifyCharacteristic](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#notifycharacteristicdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| characteristicValue | ArrayBuffer | No | No | Binary value of the characteristic. |
| confirm | boolean | No | No | Whether the notification needs to be confirmed by the remote end. For a notification, set it to **true**. In this case, the remote end must confirm the receipt of the notification. For an indication, set it to **false**. In this case, the remote end does not need to confirm the receipt of the notification. |

#### CharacteristicReadReq(deprecated)

Defines the parameters of the **CharacteristicReadReq** event received by the server.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.CharacteristicReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#characteristicreadrequestdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device that sends the **CharacteristicReadReq** event, for example, XX:XX:XX:XX:XX:XX. |
| transId | number | No | No | Transmission ID of the read request. The response returned by the server must use the same transmission ID. |
| offset | number | No | No | Start position from which the characteristic value is read. For example, **k** means to read from the kth byte. The response returned by the server must use the same offset. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |

#### CharacteristicWriteReq(deprecated)

Defines the parameters of the **CharacteristicWriteReq** event received by the server.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.CharacteristicWriteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#characteristicwriterequestdeprecated) instead.

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

#### DescriptorReadReq(deprecated)

Defines the parameters of the **DescriptorReadReq** event received by the server.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.DescriptorReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#descriptorreadrequestdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device that sends the **DescriptorReadReq** event, for example, XX:XX:XX:XX:XX:XX. |
| transId | number | No | No | Transmission ID of the read request. The response returned by the server must use the same transmission ID. |
| offset | number | No | No | Start position from which the descriptor is read. For example, **k** means to read from the kth byte. The response returned by the server must use the same offset. |
| descriptorUuid | string | No | No | UUID of the descriptor, for example, **00002902-0000-1000-8000-00805f9b34fb**. |
| characteristicUuid | string | No | No | UUID of the characteristic, for example, **00002a11-0000-1000-8000-00805f9b34fb**. |
| serviceUuid | string | No | No | UUID of the service, for example, **00001888-0000-1000-8000-00805f9b34fb**. |

#### DescriptorWriteReq(deprecated)

Defines the parameters of the **DescriptorWriteReq** event received by the server.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.DescriptorWriteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#descriptorwriterequestdeprecated) instead.

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

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ServerResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#serverresponsedeprecated) instead.

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

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BLEConnectChangedState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bleconnectchangedstatedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the remote device, for example, XX:XX:XX:XX:XX:XX. |
| state | [ProfileConnectionState](#profileconnectionstatedeprecated) | No | No | BLE connection state. |

#### ProfileConnectionState(deprecated)

Enumerates the profile connection states.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#profileconnectionstatedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| STATE_DISCONNECTED | 0 | Disconnected. |
| STATE_CONNECTING | 1 | Connecting. |
| STATE_CONNECTED | 2 | Connected. |
| STATE_DISCONNECTING | 3 | Disconnecting. |

#### ScanFilter(deprecated)

Defines the scan filter parameters.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ScanFilter](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#scanfilterdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | Yes | Address of the BLE device to filter, for example, XX:XX:XX:XX:XX:XX. |
| name | string | No | Yes | Name of the BLE device to filter. |
| serviceUuid | string | No | Yes | Service UUID of the device to filter, for example, **00001888-0000-1000-8000-00805f9b34fb**. |

#### ScanOptions(deprecated)

Defines the scan configuration parameters.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ScanOptions](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#scanoptionsdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| interval | number | No | Yes | Delay in reporting the scan result. The default value is **0**. |
| dutyMode | [ScanDuty](#scandutydeprecated) | No | Yes | Scan duty. The default value is SCAN_MODE_LOW_POWER. |
| matchMode | [MatchMode](#matchmodedeprecated) | No | Yes | Hardware filtering match mode. The default value is **MATCH_MODE_AGGRESSIVE**. |

#### ScanDuty(deprecated)

Enumerates the scan modes.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ScanDuty](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#scandutydeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| SCAN_MODE_LOW_POWER | 0 | Low-power mode, which is the default value. |
| SCAN_MODE_BALANCED | 1 | Balanced mode. |
| SCAN_MODE_LOW_LATENCY | 2 | Low-latency mode. |

#### MatchMode(deprecated)

Enumerates the hardware match modes of BLE scan filters.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.MatchMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#matchmodedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| MATCH_MODE_AGGRESSIVE | 1 | Hardware reports the scan result with a lower threshold of signal strength and few number of matches in a duration. This is the default value. |
| MATCH_MODE_STICKY | 2 | Hardware reports the scan result with a higher threshold of signal strength and sightings. |

#### ScanResult(deprecated)

Defines the scan result.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ScanResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#scanresultdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the device discovered, for example, XX:XX:XX:XX:XX:XX. |
| rssi | number | No | No | RSSI of the device. |
| data | ArrayBuffer | No | No | Advertisement packets sent by the device. |

#### BluetoothState(deprecated)

Enumerates the Bluetooth states.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.BluetoothState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bluetoothstatedeprecated) instead.

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

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.AdvertiseSetting](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#advertisesettingdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| interval | number | No | Yes | Interval for BLE advertising. The minimum value is **32** slots (20 ms). The maximum value is **16384** slots. The default value is **1600** slots (1s). |
| txPower | number | No | Yes | Transmit power, in dBm. The value range is –127 to 1. The default value is **-7**. |
| connectable | boolean | No | Yes | Whether the advertisement is connectable. The default value is **true**. |

#### AdvertiseData(deprecated)

Defines the content of a BLE advertisement packet.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.AdvertiseData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#advertisedatadeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuids | Array<string> | No | No | List of service UUIDs to broadcast. |
| manufactureData | Array<[ManufactureData](#manufacturedatadeprecated)> | No | No | List of manufacturers to broadcast. |
| serviceData | Array<[ServiceData](#servicedatadeprecated)> | No | No | List of service data to broadcast. |

#### ManufactureData(deprecated)

Defines the content of a BLE advertisement packet.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ManufactureData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#manufacturedatadeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| manufactureId | number | No | No | Manufacturer ID allocated by the Bluetooth SIG. |
| manufactureValue | ArrayBuffer | No | No | Manufacturer data. |

#### ServiceData(deprecated)

Defines the service data contained in an advertisement packet.

> **Note:** This API is supported since API version 7 and deprecated since API version 9. You are advised to use [bluetoothManager.ServiceData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#servicedatadeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | Service UUID. |
| serviceValue | ArrayBuffer | No | No | Service data. |

#### PinRequiredParam(deprecated)

Defines the pairing request parameters.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.PinRequiredParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#pinrequiredparamdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | ID of the device to pair. |
| pinCode | string | No | No | Key for the device pairing. |

#### BondStateParam(deprecated)

Defines the pairing state parameters.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.BondStateParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#bondstateparamdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | ID of the device to pair. |
| state | BondState | No | No | State of the device. |

#### StateChangeParam(deprecated)

Defines the profile state change parameters.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.StateChangeParam](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#statechangeparamdeprecated).

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of a Bluetooth device. |
| state | [ProfileConnectionState](#profileconnectionstatedeprecated) | No | No | Profile connection state of the device. |

#### DeviceClass(deprecated)

Defines the class of a Bluetooth device.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.DeviceClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#deviceclassdeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| majorClass | [MajorClass](#majorclassdeprecated) | No | No | Major classes of Bluetooth devices. |
| majorMinorClass | [MajorMinorClass](#majorminorclassdeprecated) | No | No | Major and minor classes of Bluetooth devices. |
| classOfDevice | number | No | No | Class of the device. |

#### MajorClass(deprecated)

Enumerates the major classes of Bluetooth devices.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.MajorClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#majorclassdeprecated) instead.

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

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.MajorMinorClass](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#majorminorclassdeprecated) instead.

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
| HEALTH_PEAK_FLOW_MOITOR | 0x0928 | Peak flow monitor. |
| HEALTH_MEDICATION_MONITOR | 0x092C | Medication monitor. |
| HEALTH_KNEE_PROSTHESIS | 0x0930 | Prosthetic knee. |
| HEALTH_ANKLE_PROSTHESIS | 0x0934 | Prosthetic ankle. |
| HEALTH_GENERIC_HEALTH_MANAGER | 0x0938 | Generic health management device. |
| HEALTH_PERSONAL_MOBILITY_DEVICE | 0x093C | Personal mobility device. |

#### PlayingState(deprecated)

Enumerates the A2DP playing states.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.PlayingState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#playingstatedeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| STATE_NOT_PLAYING | 0 | Not playing. |
| STATE_PLAYING | 1 | Playing. |

#### ProfileId(deprecated)

Enumerates the Bluetooth profiles. API version 9 is added with **PROFILE_HID_HOST** and **PROFILE_PAN_NETWORK**.

> **Note:** This API is supported since API version 8 and deprecated since API version 9. You are advised to use [bluetoothManager.ProfileId](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetoothmanager#profileiddeprecated) instead.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Name | Value | Description |
| --- | --- | --- |
| PROFILE_A2DP_SOURCE | 1 | A2DP profile. |
| PROFILE_HANDS_FREE_AUDIO_GATEWAY | 4 | HFP profile. |
