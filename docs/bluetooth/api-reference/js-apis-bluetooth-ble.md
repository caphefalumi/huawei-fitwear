<!--
  Title: @ohos.bluetooth.ble (Bluetooth BLE Module)
  Catalog: harmonyos-references
  Document ID: js-apis-bluetooth-ble
  Updated: 2026-10-14 09:42:46
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble
-->
# @ohos.bluetooth.ble (Bluetooth BLE Module)

The **ble** module provides [Bluetooth Low Energy (BLE)](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#ble) capabilities, including BLE scan, BLE advertising, and [Generic Attribute Profile (GATT)](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#gatt)-based connection and data transmission.

> **Note:** The initial APIs of this module are supported since API version 10. Newly added APIs will be marked with a superscript to indicate their earliest API version. You can use [util.generateRandomUUID](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-util#utilgeneraterandomuuid9) to generate a [UUID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#uuid) wherever necessary.

#### Modules to Import

```javascript
import { ble } from '@kit.ConnectivityKit';
```

#### ProfileConnectionState

type ProfileConnectionState = constant.ProfileConnectionState

Defines the profile connection status of the Bluetooth device.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Type | Description |
| --- | --- |
| [constant.ProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate) | Profile connection status of the Bluetooth device. |

#### BluetoothAddress23+

type BluetoothAddress = common.BluetoothAddress

Defines the address information of a Bluetooth device, including the address and address type.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Type | Description |
| --- | --- |
| [common.BluetoothAddress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-common#bluetoothaddress) | Address information of the Bluetooth device. |

#### BluetoothTransport

type BluetoothTransport = connection.BluetoothTransport

Represents the transport type of the remote device.

**Since:** 26.0.0

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Atomic service API**: This API can be used in atomic services since API version 26.0.0.

**Model restriction**: This API can be used only in the stage model.

| Type | Description |
| --- | --- |
| [connection.BluetoothTransport](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bluetoothtransport) | Transport type of the remote device. |

#### ble.createGattServer

createGattServer(): GattServer

Creates a [GattServer](#gattserver) instance, which represents the server in a GATT connection.

- You can use this instance to operate the server, for example, call [addService](#addservice) to add a server and use [notifyCharacteristicChanged](#notifycharacteristicchanged) report characteristic changes.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| [GattServer](#gattserver) | **GattServer** instance created. |

**Example**

```javascript
let gattServer: ble.GattServer = ble.createGattServer();
console.info('gatt success');
```

#### ble.createGattClientDevice

createGattClientDevice(deviceId: string): GattClientDevice

Creates a [GattClientDevice](#gattclientdevice) instance, which represents the client in a GATT connection.

- This API supports only the BLE transport type. To customize the [BluetoothTransport](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bluetoothtransport) type, use [createGattClientDevice](#blecreategattclientdevice-1).
- You can use this instance to operate the client, for example, call [connect](#connect) to initiate a connection to the peer device and call [getServices](#getservices) to obtain all service capabilities supported by the peer device.
- This API requires the device address of the server. You can obtain the device address of the server by calling [ble.startBLEScan](#blestartblescan) or [startScan](#startscan15) of [BleScanner](#blescanner15). Ensure that the BLE advertising of the server is enabled.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the peer device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| [GattClientDevice](#gattclientdevice) | **GattClientDevice** instance. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.createGattClientDevice

createGattClientDevice(deviceId: string, setting: GattSetting): GattClientDevice

Creates a [GattClientDevice](#gattclientdevice) instance, which represents the client in a GATT connection. You can use [GattSetting](#gattsetting) to set GATT connection parameters.

- You can use this instance to operate the client, for example, call [connect](#connect) to initiate a connection to the peer device and call [getServices](#getservices) to obtain all service capabilities supported by the peer device.
- This API requires the device address of the server. You can obtain the device address of the server by calling [ble.startBLEScan](#blestartblescan) or [startScan](#startscan15) of [BleScanner](#blescanner15). Ensure that the BLE advertising of the server is enabled.
- When setting the transport type of the connection using [GattSetting](#gattsetting), if the [BluetoothTransport](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bluetoothtransport) type of the device is unknown, the default value is [TRANSPORT_LE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bluetoothtransport). However, the value cannot be set to [TRANSPORT_UNKNOWN](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bluetoothtransport) (unknown device transport type). Otherwise, the [GattClientDevice](#gattclientdevice) instance cannot be created.

**Since:** 26.0.0

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Atomic service API**: This API can be used in atomic services since API version 26.0.0.

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | MAC address of the peer device, for example, "XX:XX:XX:XX:XX:XX". |
| setting | [GattSetting](#gattsetting) | Yes | GATT connection settings. |

**Return value**

| Type | Description |
| --- | --- |
| [GattClientDevice](#gattclientdevice) | **GattClientDevice** instance created. Before using a method of the client, you must create a **GattClientDevice** instance. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 801 | Capability not supported. Failed to call the API because the short-range chip is not inserted on the 2in1 device. |

**Example**

```javascript
import { connection } from '@kit.ConnectivityKit';
try {
    let setting: ble.GattSetting = {
        autoConnect: true,
        transport: connection.BluetoothTransport.TRANSPORT_LE
    };
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX', setting);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.getConnectedBLEDevices

getConnectedBLEDevices(): Array<string>

Obtains the BLE devices that have been connected to the local device via GATT.

- It is recommended that this API be used on the server. If this API is used on the client, the returned device address is empty.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of BLE devices that have been connected to the local device via GATT. For security purposes, the device addresses obtained are virtual MAC addresses. - The virtual address remains unchanged after a device is paired successfully. - If Bluetooth is disabled and then enabled again, the virtual address will change immediately. - If the pairing is canceled, the Bluetooth subsystem will determine when to change the address based on the actual usage of the address. If the address is being used by another application, the address will not change immediately. - To persistently save the addresses, call [access.addPersistentDeviceId](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessaddpersistentdeviceid16). |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
try {
    let result: Array<string> = ble.getConnectedBLEDevices();
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.getConnectedBLEDevices21+

getConnectedBLEDevices(profile: BleProfile): Array<string>

Obtains the BLE devices that have been connected to the local device via GATT according to the specified profile type.

- If the local device is specified as the client, the addresses of all servers that are connected to the local device are returned.
- If the local device is specified as the server, the addresses of all clients that are connected to the local device are returned.
- If the local device is specified as both the client and server, the addresses of all clients and servers that are connected to the local device are returned.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API versions 21 to 24: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| profile | [BleProfile](#bleprofile21) | Yes | Profile type of the local device, which indicates the communication role of the device in the GATT link. - GATT_CLIENT indicates that the local device is specified as the client, and all peer devices that are connected to the local device via GATT are servers. |

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | Addresses of BLE devices that have been connected to the local device via GATT. For security purposes, the device addresses obtained are virtual MAC addresses. - The virtual address remains unchanged after a device is paired successfully. - If a device is unpaired or Bluetooth is disabled, the virtual address will change after the device is paired again. - To persistently save the addresses, call [access.addPersistentDeviceId](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessaddpersistentdeviceid16). |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
try {
    let result: Array<string> = ble.getConnectedBLEDevices(ble.BleProfile.GATT_CLIENT);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.startBLEScan

startBLEScan(filters: Array<ScanFilter>, options?: ScanOptions): void

Starts BLE scanning.

- You can obtain the scan result through the callback of [ble.on('BLEDeviceFind')](#bleonbledevicefind). Only BLE devices can be discovered. You can call [ble.stopBLEScan](#blestopblescan) to stop the BLE scan.
- This API supports only single-channel scans. That is, the application can call this API only once at a time. Before calling this API again, you need to call [ble.stopBLEScan](#blestopblescan) to stop the previous scan.
- To use multi-channel scans, call [BleScanner](#blescanner15).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| filters | Array<[ScanFilter](#scanfilter)> | Yes | Rules for filtering the scan result. Devices that meet the filtering rules will be retained. If this parameter is set to **null**, all discoverable BLE devices nearby will be scanned. However, this method is not recommended as it may pick up unexpected devices and increase power consumption. |
| options | [ScanOptions](#scanoptions) | No | Scan options. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

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
import { common } from '@kit.ConnectivityKit';
function onReceiveEvent(data: Array<ble.ScanResult>) {
    console.info('BLE scan device find result = '+ JSON.stringify(data));
}
try {
    ble.on("BLEDeviceFind", onReceiveEvent);
    let addressInfo : common.BluetoothAddress = {
        address:"XX:XX:XX:XX:XX:XX",
        addressType:common.BluetoothAddressType.REAL,
        rawAddressType:common.BluetoothRawAddressType.PUBLIC
    }
    let scanFilter: ble.ScanFilter = {
        deviceId:"XX:XX:XX:XX:XX:XX",
        address:addressInfo, // When address is used, deviceId does not need to be set repeatedly.
        name:"test",
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb"
    };
    let scanOptions: ble.ScanOptions = {
    interval: 500,
    dutyMode: ble.ScanDuty.SCAN_MODE_LOW_POWER,
    matchMode: ble.MatchMode.MATCH_MODE_AGGRESSIVE
    }
    ble.startBLEScan([scanFilter],scanOptions);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.stopBLEScan

stopBLEScan(): void

Stops BLE scanning.

- You can call [ble.startBLEScan](#blestartblescan) to stop the BLE scan.
- Call this API to stop the scanning if BLE device scanning is no longer needed.
- Scan results will not be reported after this API is called. You need to start a BLE device scan again for device discovery.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
try {
    ble.stopBLEScan();
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.startAdvertising

startAdvertising(setting: AdvertiseSetting, advData: AdvertiseData, advResponse?: AdvertiseData): void

Starts sending BLE advertising packets.

- Call [ble.stopAdvertising](#blestopadvertising) if the application no longer needs to send BLE advertising packets.
- This API works in synchronous mode. It cannot be used with [ble.stopAdvertising](#blestopadvertising11) of API version 11.

**Required permissions**:

- API version 23 and later: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME)
- API version 10 to 22: ohos.permission.ACCESS_BLUETOOTH
- When the application uses the **advertiseName** field in [AdvertiseData](#advertisedata), you need to apply for [ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/restricted-permissions#ohospermissionmanage_bluetooth_advertiser_name).

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| setting | [AdvertiseSetting](#advertisesetting) | Yes | Settings related to BLE advertising. |
| advData | [AdvertiseData](#advertisedata) | Yes | BLE advertising data. |
| advResponse | [AdvertiseData](#advertisedata) | No | BLE advertising response. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900010 | The number of advertising resources reaches the upper limit. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2902054 | The length of the advertising data exceeds the upper limit. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
        advertiseName:"testName" // You need to apply for the ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME permission.
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
        advertiseName:"testName" // You need to apply for the ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME permission.
    };
    ble.startAdvertising(setting, advData ,advResponse);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.stopAdvertising

stopAdvertising(): void

Stops sending BLE advertising packets.

- This API works for BLE advertising initiated by [ble.startAdvertising](#blestartadvertising).
- This API cannot be used with [ble.startAdvertising](#blestartadvertising11) of API version 11.
- Call this API if the application no longer needs to send BLE advertising packets.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
try {
    ble.stopAdvertising();
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.startAdvertising11+

startAdvertising(advertisingParams: AdvertisingParams, callback: AsyncCallback<number>): void

Starts sending BLE advertising packets for the first time. This API uses an asynchronous callback to return the result.

- After this API is called, the Bluetooth subsystem allocates related resources and returns the advertising ID using an asynchronous callback.
- If the advertising duration is specified, advertising will stop after the duration elapses, but the allocated advertising resources will remain. You can call [ble.enableAdvertising](#bleenableadvertising11) to enable advertising again.
- Since API version 15, you can call this API multiple times to establish multiple advertising channels, each being identified by a unique ID.
- Call [ble.stopAdvertising](#blestopadvertising11) (supported since API version 11) if advertising is no longer needed. Do not use this API with [ble.stopAdvertising](#blestopadvertising) (supported since API version 10).

**Required permissions**:

- API version 23 and later: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME)
- API version 11 to 22: ohos.permission.ACCESS_BLUETOOTH
- When the application uses the **advertiseName** field in [AdvertiseData](#advertisedata), you need to apply for [ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/restricted-permissions#ohospermissionmanage_bluetooth_advertiser_name).

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingParams | [AdvertisingParams](#advertisingparams11) | Yes | Parameters for starting BLE advertising. |
| callback | AsyncCallback<number> | Yes | Callback used to return the advertisement ID. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900010 | The number of advertising resources reaches the upper limit. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2902054 | The length of the advertising data exceeds the upper limit. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
        advertiseName:"testName" // You need to apply for the ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME permission.
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
        advertiseName:"testName" // You need to apply for the ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME permission.
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 0
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams, (err, outAdvHandle) => {
        if (err) {
            return;
        } else {
            advHandle = outAdvHandle;
            console.info("advHandle: " + advHandle);
        }
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.startAdvertising11+

startAdvertising(advertisingParams: AdvertisingParams): Promise<number>

Starts sending BLE advertising packets for the first time. This API uses a promise to return the result.

- After this API is called, the Bluetooth subsystem allocates related resources and returns the advertising ID using a promise.
- If the advertising duration is specified, advertising will stop after the duration elapses, but the allocated advertising resources will remain. You can call [ble.enableAdvertising](#bleenableadvertising11) to enable advertising again.
- Since API version 15, you can call this API multiple times to establish multiple advertising channels, each being identified by a unique ID.
- Call [ble.stopAdvertising](#blestopadvertising11-1) (supported since API version 11) if advertising is no longer needed. Do not use this API with [ble.stopAdvertising](#blestopadvertising) (supported since API version 10).

**Required permissions**:

- API version 23 and later: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME)
- API version 11 to 22: ohos.permission.ACCESS_BLUETOOTH
- When the application uses the **advertiseName** field in [AdvertiseData](#advertisedata), you need to apply for [ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/restricted-permissions#ohospermissionmanage_bluetooth_advertiser_name).

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingParams | [AdvertisingParams](#advertisingparams11) | Yes | Parameters for starting BLE advertising. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<number> | Promise used to return the BLE advertisement ID. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900010 | The number of advertising resources reaches the upper limit. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2902054 | The length of the advertising data exceeds the upper limit. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
        advertiseName:"testName" // You need to apply for the ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME permission.
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit],
        advertiseName:"testName" // You need to apply for the ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME permission.
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 0
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams)
        .then(outAdvHandle => {
            advHandle = outAdvHandle;
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.enableAdvertising11+

enableAdvertising(advertisingEnableParams: AdvertisingEnableParams, callback: AsyncCallback<void>): void

Enables BLE advertising based on the specified **advertisingId**. This API uses an asynchronous callback to return the result.

- The advertising resource corresponding to **advertisingId** in [AdvertisingEnableParams](#advertisingenableparams11) has been allocated when [ble.startAdvertising](#blestartadvertising11) is called to start BLE for the first time.
- If the advertising duration is specified in [ble.startAdvertising](#blestartadvertising11), advertising will stop after the duration elapses. You can call this API to enable advertising again.
- If advertising is disabled by calling [ble.disableAdvertising](#bledisableadvertising11), you can call this API to enable advertising again.
- You can obtain the operation result through the callback of [ble.on('advertisingStateChange')](#bleonadvertisingstatechange11).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingEnableParams | [AdvertisingEnableParams](#advertisingenableparams11) | Yes | Parameters for temporarily enabling BLE advertising. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2902055 | Invalid advertising id. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 300
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams, (err, outAdvHandle) => {
        if (err) {
            return;
        } else {
            advHandle = outAdvHandle;
            console.info("advHandle: " + advHandle);
        }
    });

    let advertisingEnableParams: ble.AdvertisingEnableParams = {
        advertisingId: advHandle,
        duration: 0
    }

    // after 3s, advertising disabled, then enable the advertising
    ble.enableAdvertising(advertisingEnableParams, (err) => {
        if (err) {
            return;
        }
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.enableAdvertising11+

enableAdvertising(advertisingEnableParams: AdvertisingEnableParams): Promise<void>

Enables BLE advertising based on the specified **advertisingId**. This API uses a promise to return the result.

- The advertising resource corresponding to **advertisingId** in [AdvertisingEnableParams](#advertisingenableparams11) has been allocated when [ble.startAdvertising](#blestartadvertising11) is called to start BLE for the first time.
- If the advertising duration is specified in [ble.startAdvertising](#blestartadvertising11), advertising will stop after the duration elapses. You can call this API to enable advertising again.
- If advertising is disabled by calling [ble.disableAdvertising](#bledisableadvertising11), you can call this API to enable advertising again.
- You can obtain the operation result through the callback of [ble.on('advertisingStateChange')](#bleonadvertisingstatechange11).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingEnableParams | [AdvertisingEnableParams](#advertisingenableparams11) | Yes | Parameters for temporarily enabling BLE advertising. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise used to return the result. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2902055 | Invalid advertising id. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 300
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams, (err, outAdvHandle) => {
        if (err) {
            return;
        } else {
            advHandle = outAdvHandle;
            console.info("advHandle: " + advHandle);
        }
    });

    let advertisingEnableParams: ble.AdvertisingEnableParams = {
        advertisingId: advHandle,
        duration: 0
    }

    // after 3s, advertising disabled, then enable the advertising
    ble.enableAdvertising(advertisingEnableParams)
        .then(() => {
            console.info("enable success");
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.disableAdvertising11+

disableAdvertising(advertisingDisableParams: AdvertisingDisableParams, callback: AsyncCallback<void>): void

Disables BLE advertising based on the specified **advertisingId**. This API uses an asynchronous callback to return the result.

- After this API is called, advertising will stop, but the allocated advertising resources will remain. You can call [ble.enableAdvertising](#bleenableadvertising11) to enable advertising again.
- The advertising resource corresponding to **advertisingId** in [AdvertisingDisableParams](#advertisingdisableparams11) has been allocated when [ble.startAdvertising](#blestartadvertising11) is called to start BLE for the first time.
- You can obtain the operation result through the callback of [ble.on('advertisingStateChange')](#bleonadvertisingstatechange11).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingDisableParams | [AdvertisingDisableParams](#advertisingdisableparams11) | Yes | Parameters for temporarily disabling BLE advertising. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2902055 | Invalid advertising id. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 0
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams, (err, outAdvHandle) => {
        if (err) {
            return;
        } else {
            advHandle = outAdvHandle;
            console.info("advHandle: " + advHandle);
        }
    });

    let advertisingDisableParams: ble.AdvertisingDisableParams = {
        advertisingId: advHandle
    }
    ble.disableAdvertising(advertisingDisableParams, (err) => {
        if (err) {
            return;
        }
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.disableAdvertising11+

disableAdvertising(advertisingDisableParams: AdvertisingDisableParams): Promise<void>

Disables BLE advertising based on the specified **advertisingId**. This API uses a promise to return the result.

- After this API is called, advertising will stop, but the allocated advertising resources will remain. You can call [ble.enableAdvertising](#bleenableadvertising11) to enable advertising again.
- The advertising resource corresponding to **advertisingId** in [AdvertisingDisableParams](#advertisingdisableparams11) has been allocated when [ble.startAdvertising](#blestartadvertising11) is called to start BLE for the first time.
- You can obtain the operation result through the callback of [ble.on('advertisingStateChange')](#bleonadvertisingstatechange11).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingDisableParams | [AdvertisingDisableParams](#advertisingdisableparams11) | Yes | Parameters for temporarily disabling BLE advertising. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise used to return the result. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2902055 | Invalid advertising id. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 0
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams, (err, outAdvHandle) => {
        if (err) {
            return;
        } else {
            advHandle = outAdvHandle;
            console.info("advHandle: " + advHandle);
        }
    });

    let advertisingDisableParams: ble.AdvertisingDisableParams = {
        advertisingId: advHandle
    }
    ble.disableAdvertising(advertisingDisableParams)
        .then(() => {
            console.info("enable success");
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.stopAdvertising11+

stopAdvertising(advertisingId: number, callback: AsyncCallback<void>): void

Stops sending BLE advertising packets. This API uses an asynchronous callback to return the result.

- If this API is used with [ble.startAdvertising](#blestartadvertising11) (supported since API version 11), the requested advertising resources will be released.
- The **advertisingId** allocated when [ble.startAdvertising](#blestartadvertising11) is called to start advertising for the first time will also become invalid.
- This API cannot be used with [ble.startAdvertising](#blestartadvertising) (supported since API version 10).
- You can obtain the operation result through the callback of [ble.on('advertisingStateChange')](#bleonadvertisingstatechange11).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingId | number | Yes | ID of the advertisement to stop. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2902055 | Invalid advertising id. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 0
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams, (err, outAdvHandle) => {
        if (err) {
            return;
        } else {
            advHandle = outAdvHandle;
            console.info("advHandle: " + advHandle);
        }
    });

    ble.stopAdvertising(advHandle, (err) => {
        if (err) {
            return;
        }
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.stopAdvertising11+

stopAdvertising(advertisingId: number): Promise<void>

Stops sending BLE advertising packets. This API uses a promise to return the result.

- If this API is used with [ble.startAdvertising](#blestartadvertising11) (supported since API version 11), the requested advertising resources will be released.
- The **advertisingId** allocated when [ble.startAdvertising](#blestartadvertising11) is called to start advertising for the first time will also become invalid.
- This API cannot be used with [ble.startAdvertising](#blestartadvertising) (supported since API version 10).
- You can obtain the operation result through the callback of [ble.on('advertisingStateChange')](#bleonadvertisingstatechange11).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| advertisingId | number | Yes | ID of the advertisement to stop. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise used to return the result. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2902055 | Invalid advertising id. Applicable versions: 20+ |

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
try {
    let setting: ble.AdvertiseSetting = {
        interval:150,
        txPower:0,
        connectable:true,
        isExtended:false
    };
    let manufactureDataUnit: ble.ManufactureData = {
        manufactureId:4567,
        manufactureValue:manufactureValueBuffer.buffer
    };
    let serviceDataUnit: ble.ServiceData = {
        serviceUuid:"00001888-0000-1000-8000-00805f9b34fb",
        serviceValue:serviceValueBuffer.buffer
    };
    let advData: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advResponse: ble.AdvertiseData = {
        serviceUuids:["00001888-0000-1000-8000-00805f9b34fb"],
        manufactureData:[manufactureDataUnit],
        serviceData:[serviceDataUnit]
    };
    let advertisingParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: advResponse,
        duration: 0
    }
    let advHandle = 0xFF;
    ble.startAdvertising(advertisingParams, (err, outAdvHandle) => {
        if (err) {
            return;
        } else {
            advHandle = outAdvHandle;
            console.info("advHandle: " + advHandle);
        }
    });

    ble.stopAdvertising(advHandle)
        .then(() => {
            console.info("enable success");
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.on('advertisingStateChange')11+

on(type: 'advertisingStateChange', callback: Callback<AdvertisingStateChangeInfo>): void

Subscribes to BLE advertising status. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **advertisingStateChange** indicates an advertising state change event. This event is triggered if the advertising state changes when [ble.startAdvertising](#blestartadvertising11), [ble.stopAdvertising](#blestopadvertising11), [ble.enableAdvertising](#bleenableadvertising11) or [ble.disableAdvertising](#bledisableadvertising11) is called. |
| callback | Callback<[AdvertisingStateChangeInfo](#advertisingstatechangeinfo11)> | Yes | Callback used to return the advertising state change event. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function onReceiveEvent(data: ble.AdvertisingStateChangeInfo) {
    console.info('bluetooth advertising state = ' + JSON.stringify(data));
}
try {
    ble.on('advertisingStateChange', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### ble.off('advertisingStateChange')11+

off(type: 'advertisingStateChange', callback?: Callback<AdvertisingStateChangeInfo>): void

Unsubscribes from BLE advertising status. No BLE advertising state change events will be received when BLE advertising is stopped or started.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **advertisingStateChange** indicates an advertising state change event. |
| callback | Callback<[AdvertisingStateChangeInfo](#advertisingstatechangeinfo11)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [ble.on('advertisingStateChange')](#bleonadvertisingstatechange11). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function onReceiveEvent(data: ble.AdvertisingStateChangeInfo) {
    console.info('bluetooth advertising state = ' + JSON.stringify(data));
}
try {
    ble.on('advertisingStateChange', onReceiveEvent);
    ble.off('advertisingStateChange', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### ble.on('BLEDeviceFind')

on(type: 'BLEDeviceFind', callback: Callback<Array<ScanResult>>): void

Subscribes to BLE scan result reporting events. This API uses an asynchronous callback to return the result.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEDeviceFind** indicates a scan result reporting event. This event is triggered if a BLE device is discovered when [ble.startBLEScan](#blestartblescan) is called. |
| callback | Callback<Array<[ScanResult](#scanresult)>> | Yes | Callback used to return the set of scan results. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 10 to 24 |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function onReceiveEvent(data: Array<ble.ScanResult>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
try {
    ble.on('BLEDeviceFind', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### ble.off('BLEDeviceFind')

off(type: 'BLEDeviceFind', callback?: Callback<Array<ScanResult>>): void

Unsubscribes from BLE scan result reporting events.

- After [ble.stopBLEScan](#blestopblescan) is called to stop the BLE scan, call this API to unsubscribe from scan result reporting events if device discovery is no longer needed.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEDeviceFind** indicates a scan result reporting event. |
| callback | Callback<Array<[ScanResult](#scanresult)>> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [ble.on('BLEDeviceFind')](#bleonbledevicefind). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function onReceiveEvent(data: Array<ble.ScanResult>) {
    console.info('bluetooth device find = '+ JSON.stringify(data));
}
try {
    ble.on('BLEDeviceFind', onReceiveEvent);
    ble.off('BLEDeviceFind', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### GattServer

Represents a GATT server.

- You can use [ble.createGattServer](#blecreategattserver) to create a server instance.
- You can use this instance to operate the server, for example, call [addService](#addservice) to add a server and use [notifyCharacteristicChanged](#notifycharacteristicchanged) report characteristic changes.
- You can use [on('connectionStateChange')](#onconnectionstatechange) to subscribe to connection state change events and obtain the address of the client that initiates the connection.

## addService

addService(service: GattService): void

Adds a service to this GATT server. This operation registers the service with the Bluetooth subsystem to indicate the capabilities supported by the server.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| service | [GattService](#gattservice) | Yes | Service data, which indicates the functions supported by the server. For example, **00001800-0000-1000-8000-00805f9b34fb** indicates the general access service, and **00001801-0000-1000-8000-00805f9b34fb** indicates the general characteristic service. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

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
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// Create descriptors.
let descriptors: Array<ble.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(2);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;

// Create characteristics.
let characteristics: Array<ble.BLECharacteristic> = [];
let arrayBufferC = new ArrayBuffer(8);
let cccV = new Uint8Array(arrayBufferC);
cccV[0] = 1;
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
characteristics[0] = characteristic;

// Create a gattService instance.
let gattService: ble.GattService = {serviceUuid:'00001810-0000-1000-8000-00805F9B34FB', isPrimary: true, characteristics:characteristics, includeServices:[]};

try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.addService(gattService);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## removeService

removeService(serviceUuid: string): void

Removes a service from the server.

- The service has been added by calling [addService](#addservice).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serviceUuid | string | Yes | UUID of the service to be deleted, for example, 00001810-0000-1000-8000-00805F9B34FB. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

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
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let server: ble.GattServer = ble.createGattServer();
try {
    server.removeService('00001810-0000-1000-8000-00805F9B34FB');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## removeAllServices

removeAllServices(): void

Removes all services from the server.

**Since:** 26.0.0

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 26.0.0.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. Failed to call the API because the short-range chip is not inserted on the 2in1 device. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
let server: ble.GattServer = ble.createGattServer();
try {
    server.removeAllServices();
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## getService22+

getService(serviceUuid: string): GattService

Obtains the service capabilities of a specified server.

- Valid values can be returned only after the service has been added by calling [addService](#addservice).
- You can use [ble.createGattServer](#blecreategattserver) to create multiple [GattServer](#gattserver) instances. This method can only obtain the services that have been added to the current instance. It cannot obtain other instances created by the current application or services that have been added to instances created by other applications.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serviceUuid | string | Yes | UUID of the service to be obtained, for example, 00001810-0000-1000-8000-00805F9B34FB. |

**Return value**

| Type | Description |
| --- | --- |
| [GattService](#gattservice) | Specified GATT service. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2901008 | Gatt service is not found. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let server: ble.GattServer = ble.createGattServer();
try {
    // Before calling the getService API, you need to use the addService API to add the service.
    let service: ble.GattService = server.getService('00001810-0000-1000-8000-00805F9B34FB');
    console.info('characteristics size is: ' + service.characteristics.length);
    for (let i = 0; i < service.characteristics.length; i++) {
        console.info('characterUuid is: ' + service.characteristics[i].characteristicUuid);
    }
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getServices22+

getServices(): GattService[]

Obtains the service capabilities that have been added to the local end on the server.

- You can use [ble.createGattServer](#blecreategattserver) to create multiple [GattServer](#gattserver) instances. This method can only obtain the services that have been added to the current instance. It cannot obtain other instances created by the current application or services that have been added to instances created by other applications.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| [GattService](#gattservice)[] | Service capabilities that have been added to the server. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let server: ble.GattServer = ble.createGattServer();
try {
    let services: ble.GattService[] = server.getServices();
    console.info('services size is: ' + services.length);
    for (let i = 0; i < services.length; i++) {
        console.info('serviceUuid is: ' + services[i].serviceUuid);
    }
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## close

close(): void

Closes the server instance. The instance created by calling [ble.createGattServer](#blecreategattserver) is unavailable after being closed.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let server: ble.GattServer = ble.createGattServer();
try {
    server.close();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## connect

connect(deviceId: string, autoConnect?: boolean): void

The caller acts as a GATT client and initiates a connection to a remote BLE device. The **autoConnect** parameter specifies whether to directly connect to the remote device or automatically reconnect to the remote device when it is available.

- To enable automatic reconnection when the remote device is available (that is, **[autoConnect](#gattsetting)** is set to **true**), ensure that the client calls **[createGattClientDevice](#blecreategattclientdevice-1)** to initiate a connection and sets **[autoConnect](#gattsetting)** to **true**.
- The server can use [on('BLEConnectionStateChange')](#onbleconnectionstatechange) to subscribe to connection state change events.
- The server can call [disconnect](#disconnect) to disconnect.

**Since:** 26.0.0

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Atomic service API**: This API can be used in atomic services since API version 26.0.0.

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | MAC address of the peer device, for example, "XX:XX:XX:XX:XX:XX". |
| autoConnect | boolean | No | Whether to directly connect to the remote device or automatically connect when the remote device is available. The value **true** indicates that the remote device is automatically connected when it is available, and the value **false** indicates that the remote device is directly connected. The default value is **false**. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. Failed to call the API because the short-range chip is not inserted on the 2in1 device. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    let deviceId: string = 'XX:XX:XX:XX:XX:XX';
    let autoConnect: boolean = true;
    gattServer.connect(deviceId, autoConnect);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## disconnect

disconnect(deviceId: string): void

The caller acts as a GATT client to disconnect from a remote device or stop an ongoing connection.

You can use [on('BLEConnectionStateChange')](#onbleconnectionstatechange) to subscribe to connection state change events.

**Since:** 26.0.0

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Atomic service API**: This API can be used in atomic services since API version 26.0.0.

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | MAC address of the peer device, for example, "XX:XX:XX:XX:XX:XX". |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. Failed to call the API because the short-range chip is not inserted on the 2in1 device. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    let deviceId: string = 'XX:XX:XX:XX:XX:XX';
    gattServer.disconnect(deviceId);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## notifyCharacteristicChanged

notifyCharacteristicChanged(deviceId: string, notifyCharacteristic: NotifyCharacteristic, callback: AsyncCallback<void>): void

Sends a characteristic change notification or indication from the server to the client. This API uses an asynchronous callback to return the result.

- You are advised to enable the notification or indication function for the Client Characteristic Configuration descriptor (UUID: 00002902-0000-1000-8000-00805f9b34fb) of the characteristic.
- According to the Bluetooth protocol, the data length of the Client Characteristic Configuration descriptor is 2 bytes. Bit 0 and bit 1 indicate whether notification and indication are enabled, respectively. For example, **bit 0 = 1** indicates that notification is enabled.
- This API is called when the properties of a GATT characteristic change.
- By default, the data length of **characteristicValue** in [notifyCharacteristic](#notifycharacteristic) is limited to (MTU – 3) bytes. The MTU size can be obtained from the [on('BLEMtuChange')](#onblemtuchange) callback.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Client address, for example, XX:XX:XX:XX:XX:XX. |
| notifyCharacteristic | [NotifyCharacteristic](#notifycharacteristic) | Yes | Characteristic object. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**; otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

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
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let arrayBufferC = new ArrayBuffer(8);
let notifyCharacter: ble.NotifyCharacteristic = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    characteristicValue: arrayBufferC,
    confirm: true
};
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.notifyCharacteristicChanged('XX:XX:XX:XX:XX:XX', notifyCharacter, (err: BusinessError) => {
        if (err) {
            console.error('notifyCharacteristicChanged callback failed');
        } else {
            console.info('notifyCharacteristicChanged callback successful');
        }
    });
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## notifyCharacteristicChanged

notifyCharacteristicChanged(deviceId: string, notifyCharacteristic: NotifyCharacteristic): Promise<void>

Sends a characteristic change event from the server to the client. This API uses a promise to return the result.

- You are advised to enable notification or indication for the Client Characteristic Configuration descriptor of the characteristic.
- According to the Bluetooth protocol, the data length of the Client Characteristic Configuration descriptor is 2 bytes. Bit 0 and bit 1 indicate whether notification and indication are enabled, respectively. For example, **bit 0 = 1** indicates that notification is enabled.
- This API is called when the properties of a GATT characteristic change.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Client address, for example, XX:XX:XX:XX:XX:XX. |
| notifyCharacteristic | [NotifyCharacteristic](#notifycharacteristic) | Yes | Characteristic object. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

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
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let arrayBufferC = new ArrayBuffer(8);
let notifyCharacter: ble.NotifyCharacteristic = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    characteristicValue: arrayBufferC,
    confirm: true
};
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.notifyCharacteristicChanged('XX:XX:XX:XX:XX:XX', notifyCharacter).then(() => {
        console.info('notifyCharacteristicChanged promise successful');
    });
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## sendResponse

sendResponse(serverResponse: ServerResponse): void

Sends a response to a client request. This helps to prevent a connection from being disconnected due to a timeout.

A client request is received through the following APIs:

- [on('characteristicRead')](#oncharacteristicread)
- [on('characteristicWrite')](#oncharacteristicwrite) (Whether a response is needed is determined based on **needRsp** in [CharacteristicWriteRequest](#characteristicwriterequest)).
- [on('descriptorRead')](#ondescriptorread)
- [on('descriptorWrite')](#ondescriptorwrite) (Whether a response is needed is determined by **needRsp** in [DescriptorWriteRequest](#descriptorwriterequest)).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| serverResponse | [ServerResponse](#serverresponse) | Yes | Response returned by the GATT server. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

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
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
/* send response */
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
cccValue[0] = 1;
let serverResponse: ble.ServerResponse = {
    deviceId: 'XX:XX:XX:XX:XX:XX',
    transId: 0,
    status: 0,
    offset: 0,
    value: arrayBufferCCC
};
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.sendResponse(serverResponse);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## on('characteristicRead')

on(type: 'characteristicRead', callback: Callback<CharacteristicReadRequest>): void

Subscribes to characteristic read request events of the client. After receiving the event, the server needs to call [sendResponse](#sendresponse) to send a response to the client. This API uses an asynchronous callback to return the result.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **characteristicRead** indicates a characteristic read request event. This event is triggered when the server receives a characteristic read request from the client. |
| callback | Callback<[CharacteristicReadRequest](#characteristicreadrequest)> | Yes | Callback used to return the read request event. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 10 to 24 |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
cccValue[0] = 1;
let gattServer: ble.GattServer = ble.createGattServer();
function ReadCharacteristicReq(characteristicReadRequest: ble.CharacteristicReadRequest) {
    let deviceId: string = characteristicReadRequest.deviceId;
    let transId: number = characteristicReadRequest.transId;
    let offset: number = characteristicReadRequest.offset;
    let characteristicUuid: string = characteristicReadRequest.characteristicUuid;

    let serverResponse: ble.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferCCC};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}
gattServer.on('characteristicRead', ReadCharacteristicReq);
```

## off('characteristicRead')

off(type: 'characteristicRead', callback?: Callback<CharacteristicReadRequest>): void

Unsubscribes from characteristic read request events.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **characteristicRead** indicates a characteristic read request event. |
| callback | Callback<[CharacteristicReadRequest](#characteristicreadrequest)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('characteristicRead')](#oncharacteristicread). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.off('characteristicRead');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('characteristicWrite')

on(type: 'characteristicWrite', callback: Callback<CharacteristicWriteRequest>): void

Subscribes to characteristic write request events of the client. After receiving such an event, the server determines whether to call [sendResponse](#sendresponse) to send a response to the client based on the **needRsp** in [CharacteristicWriteRequest](#characteristicwriterequest).

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **characteristicWrite** indicates a characteristic write request event. This event is triggered when the server receives a characteristic write request from the client. |
| callback | Callback<[CharacteristicWriteRequest](#characteristicwriterequest)> | Yes | Callback used to return the write request event. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 10 to 24 |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let arrayBufferCCC = new ArrayBuffer(8);
let cccValue = new Uint8Array(arrayBufferCCC);
let gattServer: ble.GattServer = ble.createGattServer();
function WriteCharacteristicReq(characteristicWriteRequest: ble.CharacteristicWriteRequest) {
    let deviceId: string = characteristicWriteRequest.deviceId;
    let transId: number = characteristicWriteRequest.transId;
    let offset: number = characteristicWriteRequest.offset;
    let isPrepared: boolean = characteristicWriteRequest.isPrepared;
    let needRsp: boolean = characteristicWriteRequest.needRsp;
    let value: Uint8Array =  new Uint8Array(characteristicWriteRequest.value);
    let characteristicUuid: string = characteristicWriteRequest.characteristicUuid;

    cccValue[0] = value[0];
    let serverResponse: ble.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferCCC};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}
gattServer.on('characteristicWrite', WriteCharacteristicReq);
```

## off('characteristicWrite')

off(type: 'characteristicWrite', callback?: Callback<CharacteristicWriteRequest>): void

Unsubscribes from characteristic write request events.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **characteristicWrite** indicates a characteristic write request event. |
| callback | Callback<[CharacteristicWriteRequest](#characteristicwriterequest)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('characteristicWrite')](#oncharacteristicwrite). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.off('characteristicWrite');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('descriptorRead')

on(type: 'descriptorRead', callback: Callback<DescriptorReadRequest>): void

Subscribes to descriptor read request events of the client. After receiving the event, the server needs to call [sendResponse](#sendresponse) to send a response to the client.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **descriptorRead** indicates a descriptor read request event. This event is triggered when the server receives a descriptor read request from the client. |
| callback | Callback<[DescriptorReadRequest](#descriptorreadrequest)> | Yes | Callback used to return the read request event. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 10 to 24 |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let arrayBufferDesc = new ArrayBuffer(8);
let descValue = new Uint8Array(arrayBufferDesc);
descValue[0] = 1;
let gattServer: ble.GattServer = ble.createGattServer();
function ReadDescriptorReq(descriptorReadRequest: ble.DescriptorReadRequest) {
    let deviceId: string = descriptorReadRequest.deviceId;
    let transId: number = descriptorReadRequest.transId;
    let offset: number = descriptorReadRequest.offset;
    let descriptorUuid: string = descriptorReadRequest.descriptorUuid;

    let serverResponse: ble.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferDesc};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}
gattServer.on('descriptorRead', ReadDescriptorReq);
```

## off('descriptorRead')

off(type: 'descriptorRead', callback?: Callback<DescriptorReadRequest>): void

Unsubscribes from descriptor read request events.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **descriptorRead** indicates a descriptor read request event. |
| callback | Callback<[DescriptorReadRequest](#descriptorreadrequest)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('descriptorRead')](#ondescriptorread). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.off('descriptorRead');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('descriptorWrite')

on(type: 'descriptorWrite', callback: Callback<DescriptorWriteRequest>): void

Subscribes to descriptor write request events of the client. After receiving such an event, the server determines whether to call [sendResponse](#sendresponse) to send a response to the client based on the **needRsp** in [DescriptorWriteRequest](#descriptorwriterequest).

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **descriptorWrite** indicates a descriptor write request event. This event is triggered when the server receives a descriptor write request from the client. |
| callback | Callback<[DescriptorWriteRequest](#descriptorwriterequest)> | Yes | Callback used to return the write request event. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 10 to 24 |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let arrayBufferDesc = new ArrayBuffer(8);
let descValue = new Uint8Array(arrayBufferDesc);
let gattServer: ble.GattServer = ble.createGattServer();
function WriteDescriptorReq(descriptorWriteRequest: ble.DescriptorWriteRequest) {
    let deviceId: string = descriptorWriteRequest.deviceId;
    let transId: number = descriptorWriteRequest.transId;
    let offset: number = descriptorWriteRequest.offset;
    let isPrepared: boolean = descriptorWriteRequest.isPrepared;
    let needRsp: boolean = descriptorWriteRequest.needRsp;
    let value: Uint8Array = new Uint8Array(descriptorWriteRequest.value);
    let descriptorUuid: string = descriptorWriteRequest.descriptorUuid;

    descValue[0] = value[0];
    let serverResponse: ble.ServerResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value:arrayBufferDesc};

    try {
        gattServer.sendResponse(serverResponse);
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}
gattServer.on('descriptorWrite', WriteDescriptorReq);
```

## off('descriptorWrite')

off(type: 'descriptorWrite', callback?: Callback<DescriptorWriteRequest>): void

Unsubscribes from descriptor write request events.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **descriptorWrite** indicates a descriptor write request event. |
| callback | Callback<[DescriptorWriteRequest](#descriptorwriterequest)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('descriptorWrite')](#ondescriptorwrite). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
let gattServer: ble.GattServer = ble.createGattServer();
gattServer.off('descriptorWrite');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('connectionStateChange')

on(type: 'connectionStateChange', callback: Callback<BLEConnectionChangeState>): void

Subscribes to GATT profile connection state change events on the server. This API uses an asynchronous callback to return the result.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **connectionStateChange** indicates a connection state change event. This event is triggered when the GATT connection state changes. For example, the connection status may change when a connection request or disconnection request is received. |
| callback | Callback<[BLEConnectionChangeState](#bleconnectionchangestate)> | Yes | Callback used to return the GATT connection state change event. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 10 to 24 |
| 801 | Capability not supported. |

**Example**

```javascript
import { constant } from '@kit.ConnectivityKit';
import { BusinessError } from '@kit.BasicServicesKit';
let connected = (bleConnectionChangeState: ble.BLEConnectionChangeState) => {
    let deviceId: string = bleConnectionChangeState.deviceId;
    let status: constant.ProfileConnectionState = bleConnectionChangeState.state;
}
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.on('connectionStateChange', connected);
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## off('connectionStateChange')

off(type: 'connectionStateChange', callback?: Callback<BLEConnectionChangeState>): void

Unsubscribes from GATT profile connection state change events on the server.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **connectionStateChange** indicates a connection state change event. |
| callback | Callback<[BLEConnectionChangeState](#bleconnectionchangestate)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('connectionStateChange')](#onconnectionstatechange). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.off('connectionStateChange');
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

## on('BLEMtuChange')

on(type: 'BLEMtuChange', callback: Callback<number>): void

Subscribes to MTU change events on the server. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEMtuChange** indicates an MTU change event. This event is triggered when the client initiates an MTU negotiation request. |
| callback | Callback<number> | Yes | Callback used to return the negotiated MTU, in bytes. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.on('BLEMtuChange', (mtu: number) => {
    console.info('BLEMtuChange, mtu: ' + mtu);
    });
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## off('BLEMtuChange')

off(type: 'BLEMtuChange', callback?: Callback<number>): void

Unsubscribes from MTU change events on the server.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEMtuChange** indicates an MTU change event. |
| callback | Callback<number> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('BLEMtuChange')](#onblemtuchange). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let gattServer: ble.GattServer = ble.createGattServer();
    gattServer.off('BLEMtuChange');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getConnectedState22+

getConnectedState(deviceId: string): ProfileConnectionState

Obtains the current connection status with the client device.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the peer Bluetooth device whose connection status is to be queried. Example: XX:XX:XX:XX:XX:XX |

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstate) | Profile connection status of the Bluetooth device. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let gattServer: ble.GattServer = ble.createGattServer();
let deviceId: string = 'XX:XX:XX:XX:XX:XX';
try {
    let result: ble.ProfileConnectionState = gattServer.getConnectedState(deviceId);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## readPhy23+

readPhy(deviceId: string): Promise<PhyValue>

Obtains the physical channel type of the link between the server and a specified device. This API uses a promise to return the result.

- This method can be called only after the client initiates a connection and the connection is successful.
- **deviceId** indicates the Bluetooth device address on the client, which can be obtained from the [on('connectionStateChange')](#onconnectionstatechange) callback subscribed to on the server.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Bluetooth device address on the client that needs to transmit data. Example: XX:XX:XX:XX:XX:XX |

**Return value**

| Type | Description |
| --- | --- |
| Promise<[PhyValue](#phyvalue23)> | Promise used to return the physical channel type of the link between the server and a specified device. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. |

**Example**

```javascript
let gattServer: ble.GattServer = ble.createGattServer();
let deviceId: string = 'XX:XX:XX:XX:XX:XX';
try {
    gattServer.readPhy(deviceId).then((phyValue:ble.PhyValue) => {
        console.info(`txPhy: ${phyValue.txPhy}, rxPhy: ${phyValue.rxPhy}`);
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## setPhy23+

setPhy(deviceId: string, phyValue: PhyValue): Promise<void>

Sets the physical channel type of the link between the server and a specified device. This API uses a promise to return the result.

- This method can be called only after the client initiates a connection and the connection is successful.
- After the server calls **setPhy** to set the physical channel type of the link between the server and a specified device, the underlying layer will perform negotiation and produce the physical channel type supported by both the server and device based on the capabilities of the device. For example, if the server supports and sets [BLE_PHY_2M](#blephy23), but the device supports only [BLE_PHY_1M](#blephy23), the final type remains [BLE_PHY_1M](#blephy23).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Bluetooth device address on the client that needs to transmit data. Example: XX:XX:XX:XX:XX:XX |
| phyValue | [PhyValue](#phyvalue23) | Yes | Physical channel type of the link. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. |

**Example**

```javascript
let gattServer: ble.GattServer = ble.createGattServer();
let deviceId: string = 'XX:XX:XX:XX:XX:XX';
try {
    let phyValue:ble.PhyValue = {
        txPhy: ble.BlePhy.BLE_PHY_1M,
        rxPhy: ble.BlePhy.BLE_PHY_1M
    };
    gattServer.setPhy(deviceId,phyValue);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## onBlePhyUpdate23+

onBlePhyUpdate(callback: Callback<PhyValue>): void

Subscribes to physical channel type change events. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | Callback<[PhyValue](#phyvalue23)> | Yes | Callback used to return the latest physical channel type. If such events are subscribed to, after the server calls [setPhy](#setphy23) or the device changes the current physical channel type, the callback containing the latest physical channel type will be received. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
function BlePhyCallback(data:ble.PhyValue) {
    console.info(`txPhy: ${data.txPhy}, rxPhy: ${data.rxPhy}`);
}
let gattServer: ble.GattServer = ble.createGattServer();
try {
    gattServer.onBlePhyUpdate(BlePhyCallback);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## offBlePhyUpdate23+

offBlePhyUpdate(callback?: Callback<PhyValue>): void

Unsubscribes from physical channel type change events. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | Callback<[PhyValue](#phyvalue23)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [onBlePhyUpdate](#onblephyupdate23). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
function BlePhyCallback(data:ble.PhyValue) {
    console.info(`txPhy: ${data.txPhy}, rxPhy: ${data.rxPhy}`);
}
let gattServer: ble.GattServer = ble.createGattServer();
try {
    gattServer.offBlePhyUpdate(BlePhyCallback);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### GattClientDevice

Represents a GATT client class. It provides APIs for connecting to and transmitting data with the server.

- Before using the APIs of this class, you need to call [createGattClientDevice](#blecreategattclientdevice) to construct a GATT client instance.
- You can create multiple instances of this class to manage multiple GATT connections.

## connect

connect(): void

Initiates a GATT connection to the server.

- The address of the peer device has been specified by the **deviceId** in [createGattClientDevice](#blecreategattclientdevice).
- The client can use [on('BLEConnectionStateChange')](#onbleconnectionstatechange) to subscribe to connection state change events.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.connect();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## disconnect

disconnect(): void

Disconnects the GATT connection from the server.

- The client can use [on('BLEConnectionStateChange')](#onbleconnectionstatechange) to subscribe to connection state change events.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.disconnect();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## close

close(): void

Closes a client instance. The instance created by calling [GattClientDevice](#gattclientdevice) is unavailable after being closed.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.close();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getDeviceName

getDeviceName(callback: AsyncCallback<string>): void

Obtains the device name of the server. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<string> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**, and **data** is the device name of the server. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { ble, constant } from '@kit.ConnectivityKit';
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let gattClient: ble.GattClientDevice = ble.createGattClientDevice("11:22:33:44:55:66");
function ConnectStateChanged(state: ble.BLEConnectionChangeState) {
    console.info('bluetooth connect state changed');
    let connectState: ble.ProfileConnectionState = state.state;
    if (connectState == constant.ProfileConnectionState.STATE_CONNECTED) {
        gattClient.getDeviceName((err: BusinessError, data: string)=> {
            console.info('device name err ' + JSON.stringify(err));
            console.info('device name' + JSON.stringify(data));
        })
    }
}
// callback
try {
    gattClient.connect();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getDeviceName

getDeviceName(): Promise<string>

Obtains the name of the peer BLE device. This API uses a promise to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| Promise<string> | Promise used to return the device name. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { ble, constant } from '@kit.ConnectivityKit';
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let gattClient: ble.GattClientDevice = ble.createGattClientDevice("11:22:33:44:55:66");
gattClient.on('BLEConnectionStateChange', ConnectStateChanged);
function ConnectStateChanged(state: ble.BLEConnectionChangeState) {
    console.info('bluetooth connect state changed');
    let connectState: ble.ProfileConnectionState = state.state;
    if (connectState == constant.ProfileConnectionState.STATE_CONNECTED) {
        gattClient.getDeviceName().then((data: string) => {
            console.info('device name' + JSON.stringify(data));
        })
    }
}
// promise
try {
    gattClient.connect();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getServices

getServices(callback: AsyncCallback<Array<GattService>>): void

Obtains the list of services supported by the server. This API uses an asynchronous callback to return the result.

Before invoking characteristic or descriptor read and write APIs, call this API to obtain the services supported by the server and ensure that the services include the characteristics or descriptors to be operated. The related APIs include:

- [readCharacteristicValue](#readcharacteristicvalue)
- [readDescriptorValue](#readdescriptorvalue)
- [writeCharacteristicValue](#writecharacteristicvalue)
- [writeDescriptorValue](#writedescriptorvalue)
- [setCharacteristicChangeNotification](#setcharacteristicchangenotification)
- [setCharacteristicChangeIndication](#setcharacteristicchangeindication)

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<Array<[GattService](#gattservice)>> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**, and **data** is the list of services supported by the server. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { ble, constant } from '@kit.ConnectivityKit';
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// Callback mode.
let getServices = (code: BusinessError, gattServices: Array<ble.GattService>) => {
    if (code && code.code != 0) {
        console.info('bluetooth code is ' + code.code);
        return;
    }
    let services: Array<ble.GattService> = gattServices;
    console.info('bluetooth services size is ', services.length);
    for (let i = 0; i < services.length; i++) {
        console.info('bluetooth serviceUuid is ' + services[i].serviceUuid);
    }
}
let device: ble.GattClientDevice = ble.createGattClientDevice("11:22:33:44:55:66");
function ConnectStateChanged(state: ble.BLEConnectionChangeState) {
    console.info('bluetooth connect state changed');
    let connectState: ble.ProfileConnectionState = state.state;
    if (connectState == constant.ProfileConnectionState.STATE_CONNECTED) {
        device.getServices(getServices);
    }
}

try {
    device.connect();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getServices

getServices(): Promise<Array<GattService>>

Obtains all services of the peer BLE device. This API uses a promise to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| Promise<Array<[GattService](#gattservice)>> | Promise used to return the list of services supported by the server. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { ble, constant } from '@kit.ConnectivityKit';
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// Promise mode.
let device: ble.GattClientDevice = ble.createGattClientDevice("11:22:33:44:55:66");
function ConnectStateChanged(state: ble.BLEConnectionChangeState) {
    console.info('bluetooth connect state changed');
    let connectState: ble.ProfileConnectionState = state.state;
    if (connectState == constant.ProfileConnectionState.STATE_CONNECTED) {
        device.getServices().then((result: Array<ble.GattService>) => {
            console.info('getServices successfully:' + JSON.stringify(result));
        });
    }
}
try {
    device.connect();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## readCharacteristicValue

readCharacteristicValue(characteristic: BLECharacteristic, callback: AsyncCallback<BLECharacteristic>): void

Reads the value of the specified characteristic. This API uses an asynchronous callback to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included. Otherwise, the read operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- During characteristic reading, ensure that the **serviceUuid** and **characteristicUuid** in **[BLECharacteristic](#blecharacteristic)** are correct. The data length of **characteristicValue** can be customized, which does not affect the actually read characteristic value.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic to read. |
| callback | AsyncCallback<[BLECharacteristic](#blecharacteristic)> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**, and **data** is the characteristic object containing the read data. Otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901000 | Read forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function readCcc(code: BusinessError, BLECharacteristic: ble.BLECharacteristic) {
  if (code.code != 0) {
      return;
  }
  console.info('bluetooth characteristic uuid: ' + BLECharacteristic.characteristicUuid);
  let value = new Uint8Array(BLECharacteristic.characteristicValue);
  console.info('bluetooth characteristic value: ' + value[0]);
}

let descriptors: Array<ble.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
characteristicValue: bufferCCC, descriptors:descriptors};

try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readCharacteristicValue(characteristic, readCcc);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## readCharacteristicValue

readCharacteristicValue(characteristic: BLECharacteristic): Promise<BLECharacteristic>

Reads the value of the specified characteristic. This API uses a promise to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included. Otherwise, the read operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- During characteristic reading, ensure that the **serviceUuid** and **characteristicUuid** in **[BLECharacteristic](#blecharacteristic)** are correct. The data length of **characteristicValue** can be customized, which does not affect the actually read characteristic value.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic to read. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<[BLECharacteristic](#blecharacteristic)> | Promise used to return the characteristic object containing the read data. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901000 | Read forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let descriptors: Array<ble.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
characteristicValue: bufferCCC, descriptors:descriptors};

try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readCharacteristicValue(characteristic);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## readDescriptorValue

readDescriptorValue(descriptor: BLEDescriptor, callback: AsyncCallback<BLEDescriptor>): void

Reads data from the specified descriptor. This API uses an asynchronous callback to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified descriptor is included. Otherwise, the read operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- During descriptor reading, ensure that the **serviceUuid**, **characteristicUuid**, and **descriptorUuid** of **[BLEDescriptor](#bledescriptor)** are correct. The data length of **descriptorValue** can be customized, which does not affect the actually read descriptor value.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptor) | Yes | Descriptor to read. |
| callback | AsyncCallback<[BLEDescriptor](#bledescriptor)> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**, and **data** is the descriptor object containing the read data. Otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901000 | Read forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function readDesc(code: BusinessError, BLEDescriptor: ble.BLEDescriptor) {
    if (code.code != 0) {
        return;
    }
    console.info('bluetooth descriptor uuid: ' + BLEDescriptor.descriptorUuid);
    let value = new Uint8Array(BLEDescriptor.descriptorValue);
    console.info('bluetooth descriptor value: ' + value[0]);
}

let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB',
    descriptorValue: bufferDesc
};
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readDescriptorValue(descriptor, readDesc);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## readDescriptorValue

readDescriptorValue(descriptor: BLEDescriptor): Promise<BLEDescriptor>

Reads data from the specified descriptor. This API uses a promise to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified descriptor is included. Otherwise, the read operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- During descriptor reading, ensure that the **serviceUuid**, **characteristicUuid**, and **descriptorUuid** of **[BLEDescriptor](#bledescriptor)** are correct. The data length of **descriptorValue** can be customized, which does not affect the actually read descriptor value.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptor) | Yes | Descriptor to read. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<[BLEDescriptor](#bledescriptor)> | Promise used to return the descriptor object containing the read data. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901000 | Read forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB',
    descriptorValue: bufferDesc
};
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.readDescriptorValue(descriptor);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## writeCharacteristicValue

writeCharacteristicValue(characteristic: BLECharacteristic, writeType: GattWriteType, callback: AsyncCallback<void>): void

Writes a value to the specified characteristic. This API uses an asynchronous callback to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included. Otherwise, the write operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- The length of the characteristic data that can be written by an application at a time is limited to (MTU – 3) bytes. You can call the [setBLEMtuSize](#setblemtusize) API to specify the MTU size as required, and then change the length of the characteristic data that can be written by an application at a time.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic to write. |
| writeType | [GattWriteType](#gattwritetype) | Yes | Write mode. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. If the write operation is successful, **err** is **undefined**. Otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901001 | Write forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let descriptors: Array<ble.BLEDescriptor> = [];
let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  characteristicValue: bufferCCC, descriptors:descriptors};
function writeCharacteristicValueCallBack(code: BusinessError) {
    if (code != null) {
        return;
    }
    console.info('bluetooth writeCharacteristicValue success');
}
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.writeCharacteristicValue(characteristic, ble.GattWriteType.WRITE, writeCharacteristicValueCallBack);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## writeCharacteristicValue

writeCharacteristicValue(characteristic: BLECharacteristic, writeType: GattWriteType): Promise<void>

Writes a value to the specified characteristic. This API uses a promise to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included. Otherwise, the write operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- The length of the characteristic data that can be written by an application at a time is limited to (MTU – 3) bytes. You can call the [setBLEMtuSize](#setblemtusize) API to specify the MTU size as required, and then change the length of the characteristic data that can be written by an application at a time.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic to write. |
| writeType | [GattWriteType](#gattwritetype) | Yes | Write mode. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901001 | Write forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let descriptors: Array<ble.BLEDescriptor>  = [];
let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: bufferDesc};
descriptors[0] = descriptor;

let bufferCCC = new ArrayBuffer(8);
let cccV = new Uint8Array(bufferCCC);
cccV[0] = 1;
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  characteristicValue: bufferCCC, descriptors:descriptors};
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.writeCharacteristicValue(characteristic, ble.GattWriteType.WRITE);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## writeDescriptorValue

writeDescriptorValue(descriptor: BLEDescriptor, callback: AsyncCallback<void>): void

Writes data to the specified descriptor. This API uses an asynchronous callback to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified descriptor is included. Otherwise, the write operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- The length of the descriptor data that can be written by an application at a time is limited to (MTU – 3) bytes. You can call the [setBLEMtuSize](#setblemtusize) API to specify the MTU size as required, and then change the length of the descriptor that can be written by an application at a time.
- The Client Characteristic Configuration descriptor (UUID: 00002902-0000-1000-8000-00805f9b34fb) and Server Characteristic Configuration descriptor (UUID: 00002903-0000-1000-8000-00805f9b34fb) are exceptional cases. As per the Bluetooth standard, their data length is 2 bytes, and therefore the length of the content to be written must be set to 2 bytes.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptor) | Yes | Descriptor to write. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. If the write operation is successful, **err** is **undefined**. Otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901001 | Write forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB',
    descriptorValue: bufferDesc
};
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.writeDescriptorValue(descriptor, (err: BusinessError) => {
        if (err) {
            console.error('writeDescriptorValue callback failed');
        } else {
            console.info('writeDescriptorValue callback successful');
        }
    });
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## writeDescriptorValue

writeDescriptorValue(descriptor: BLEDescriptor): Promise<void>

Writes data to the specified descriptor. This API uses a promise to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified descriptor is included. Otherwise, the write operation will fail.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).
- The length of the descriptor data that can be written by an application at a time is limited to (MTU – 3) bytes. You can call the [setBLEMtuSize](#setblemtusize) API to specify the MTU size as required, and then change the length of the descriptor that can be written by an application at a time.
- The Client Characteristic Configuration descriptor (UUID: 00002902-0000-1000-8000-00805f9b34fb) and Server Characteristic Configuration descriptor (UUID: 00002903-0000-1000-8000-00805f9b34fb) are exceptional cases. As per the Bluetooth standard, their data length is 2 bytes, and therefore the length of the content to be written must be set to 2 bytes.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| descriptor | [BLEDescriptor](#bledescriptor) | Yes | Descriptor to write. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901001 | Write forbidden. |
| 2901003 | The connection is not established. Applicable versions: 20+ |
| 2901004 | The connection is congested. Applicable versions: 20+ |
| 2901005 | The connection is not encrypted. Applicable versions: 20+ |
| 2901006 | The connection is not authenticated. Applicable versions: 20+ |
| 2901007 | The connection is not authorized. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
let bufferDesc = new ArrayBuffer(2);
let descV = new Uint8Array(bufferDesc);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {
    serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
    characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
    descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB',
    descriptorValue: bufferDesc
};
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.writeDescriptorValue(descriptor).then(() => {
        console.info('writeDescriptorValue promise success');
    });
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getRssiValue

getRssiValue(callback: AsyncCallback<number>): void

Obtains the RSSI of a GATT connection. This API uses an asynchronous callback to return the result.

- You can call this API only after the GATT profile is connected by calling [connect](#connect).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | AsyncCallback<number> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**, and **data** is the obtained RSSI (unit: dBm). Otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable version: 20 to 21 |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. Applicable version: 20 and later |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// callback
try {
    let gattClient: ble.GattClientDevice = ble.createGattClientDevice("XX:XX:XX:XX:XX:XX");
    gattClient.connect();
    let rssi = gattClient.getRssiValue((err: BusinessError, data: number)=> {
        console.info('rssi err ' + JSON.stringify(err));
        console.info('rssi value' + JSON.stringify(data));
    })
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## getRssiValue

getRssiValue(): Promise<number>

Obtains the RSSI of a GATT connection. This API uses a promise to return the result.

- You can call this API only after the GATT profile is connected by calling [connect](#connect).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| Promise<number> | Promise used to return the signal strength, in dBm. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable version: 20-21 |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. Applicable version: 20 and later |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// promise
try {
    let gattClient: ble.GattClientDevice = ble.createGattClientDevice("XX:XX:XX:XX:XX:XX");
    gattClient.getRssiValue().then((data: number) => {
        console.info('rssi' + JSON.stringify(data));
    })
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## setBLEMtuSize

setBLEMtuSize(mtu: number): void

Negotiates the MTU size between the client and server. For details, see [MTU](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#mtu).

- You can call this API only after the GATT profile is connected by calling [connect](#connect).
- You can call [on('BLEMtuChange')](#onblemtuchange-1) to subscribe to the MTU negotiation result.
- If no negotiation is performed, the MTU size is 23 bytes by default.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| mtu | number | Yes | MTU to negotiate. The value range is [23, 517], in bytes. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.setBLEMtuSize(128);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## setBLEMtu

setBLEMtu(mtu: number): Promise<number>

The client negotiates the [MTU](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#mtu) (maximum transmission unit) size with the server.

- You can call this API only after the GATT profile is connected by calling [connect](#connect-1).
- Ensure that the input parameter is within the value range. Otherwise, an exception will be returned.
- If no negotiation is performed, the MTU size defaults to 23 bytes.

**Since:** 26.0.0

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 26.0.0.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| mtu | number | Yes | MTU to negotiate. The value range is [23, 517], in bytes. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<number> | Promise used to return the MTU that is successfully negotiated, in bytes. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900011 | The operation is busy. The last operation is not complete. |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. |

**Example**

```javascript
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.setBLEMtu(128).then(outMtuSize => {
        console.info('Actually set MTU:' + outMtuSize);
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## setCharacteristicChangeNotification

setCharacteristicChangeNotification(characteristic: BLECharacteristic, enable: boolean, callback: AsyncCallback<void>): void

Sets whether to enable the client to receive characteristic change notifications from the server. This API uses an asynchronous callback to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included.
- The server can send change notifications only if the specified characteristic contains the UUID (00002902-0000-1000-8000-00805f9b34fb) of the Client Characteristic Configuration descriptor.
- If **enable** is set to **true**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to enable the change notification function.
- If **enable** is set to **false**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to disable the change notification function.
- You can call [on('BLECharacteristicChange')](#onblecharacteristicchange) to subscribe to characteristic change notifications of the server.
- The client does not need to send a response when receiving a characteristic change notification from the server.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic of the server. |
| enable | boolean | Yes | Whether to enable characteristic change notification. **true** to enable; **false** otherwise. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**. Otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// Create descriptors.
let descriptors: Array<ble.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(2);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;
let arrayBufferC = new ArrayBuffer(8);
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.setCharacteristicChangeNotification(characteristic, false, (err: BusinessError) => {
        if (err) {
            console.error('notifyCharacteristicChanged callback failed');
        } else {
            console.info('notifyCharacteristicChanged callback successful');
        }
    });
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## setCharacteristicChangeNotification

setCharacteristicChangeNotification(characteristic: BLECharacteristic, enable: boolean): Promise<void>

Sets whether to enable the client to receive characteristic change notifications from the server. This API uses a promise to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included.
- The server can send change notifications only if the specified characteristic contains the UUID (00002902-0000-1000-8000-00805f9b34fb) of the Client Characteristic Configuration descriptor.
- If **enable** is set to **true**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to enable the change notification function.
- If **enable** is set to **false**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to disable the change notification function.
- You can call [on('BLECharacteristicChange')](#onblecharacteristicchange) to subscribe to characteristic change notifications of the server.
- The client does not need to send a response when receiving a characteristic change notification from the server.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic of the server. |
| enable | boolean | Yes | Whether to enable characteristic change notification. **true** to enable; **false** otherwise. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// Create descriptors.
let descriptors: Array<ble.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(2);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;
let arrayBufferC = new ArrayBuffer(8);
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
try {
  let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
  device.setCharacteristicChangeNotification(characteristic, false);
} catch (err) {
  console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## setCharacteristicChangeIndication

setCharacteristicChangeIndication(characteristic: BLECharacteristic, enable: boolean, callback: AsyncCallback<void>): void

Sets whether to enable the client to receive characteristic change indications from the server. This API uses an asynchronous callback to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included.
- The server can send change indications only if the specified characteristic contains the UUID (00002902-0000-1000-8000-00805f9b34fb) of the Client Characteristic Configuration descriptor.
- If **enable** is set to **true**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to enable the change indication function.
- If **enable** is set to **false**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to disable the change indication function.
- You can call [on('BLECharacteristicChange')](#onblecharacteristicchange) to subscribe to characteristic change indications of the server.
- When receiving a characteristic change indication from the server, the client does not need to send a response as this will be done by the Bluetooth service.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic of the server. |
| enable | boolean | Yes | Whether to enable characteristic change indication. **true** to enable; **false** otherwise. |
| callback | AsyncCallback<void> | Yes | Callback used to return the result. If the operation is successful, **err** is **undefined**. Otherwise, **err** is an error object. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable to API version 20 and later. |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. Applicable to API version 20 and later. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// Create descriptors.
let descriptors: Array<ble.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(2);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;
let arrayBufferC = new ArrayBuffer(8);
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
try {
  let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
  device.setCharacteristicChangeIndication(characteristic, false, (err: BusinessError) => {
    if (err) {
      console.error('notifyCharacteristicChanged callback failed');
    } else {
      console.info('notifyCharacteristicChanged callback successful');
    }
  });
} catch (err) {
  console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## setCharacteristicChangeIndication

setCharacteristicChangeIndication(characteristic: BLECharacteristic, enable: boolean): Promise<void>

Sets whether to enable the client to receive characteristic change indications from the server. This API uses a promise to return the result.

- You need to call [getServices](#getservices) to obtain all services supported by the server, and ensure that the UUID of the specified characteristic is included.
- The server can send change indications only if the specified characteristic contains the UUID (00002902-0000-1000-8000-00805f9b34fb) of the Client Characteristic Configuration descriptor.
- If **enable** is set to **true**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to enable the change indication function.
- If **enable** is set to **false**, the system Bluetooth service automatically writes the Client Characteristic Configuration descriptor to the server to disable the change indication function.
- You can call [on('BLECharacteristicChange')](#onblecharacteristicchange) to subscribe to characteristic change indications of the server.
- When receiving a characteristic change indication from the server, the client does not need to send a response as this will be done by the Bluetooth service.
- You can call the following APIs only after receiving an asynchronous callback: [readCharacteristicValue](#readcharacteristicvalue), [readDescriptorValue](#readdescriptorvalue), [writeCharacteristicValue](#writecharacteristicvalue), [writeDescriptorValue](#writedescriptorvalue), [setCharacteristicChangeNotification](#setcharacteristicchangenotification), and [setCharacteristicChangeIndication](#setcharacteristicchangeindication).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| characteristic | [BLECharacteristic](#blecharacteristic) | Yes | Characteristic of the server. |
| enable | boolean | Yes | Whether to enable characteristic change indication. **true** to enable; **false** otherwise. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900011 | The operation is busy. The last operation is not complete. Applicable versions: 20+ |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. Applicable versions: 20+ |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
// Create descriptors.
let descriptors: Array<ble.BLEDescriptor> = [];
let arrayBuffer = new ArrayBuffer(2);
let descV = new Uint8Array(arrayBuffer);
descV[0] = 0; // Use the Client Characteristic Configuration descriptor as an example. When bit 0 and bit 1 are both set to 0, the notification and indication functions are disabled.
let descriptor: ble.BLEDescriptor = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB',
  descriptorUuid: '00002902-0000-1000-8000-00805F9B34FB', descriptorValue: arrayBuffer};
descriptors[0] = descriptor;
let arrayBufferC = new ArrayBuffer(8);
let characteristic: ble.BLECharacteristic = {serviceUuid: '00001810-0000-1000-8000-00805F9B34FB',
  characteristicUuid: '00001820-0000-1000-8000-00805F9B34FB', characteristicValue: arrayBufferC, descriptors:descriptors};
try {
  let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
  device.setCharacteristicChangeIndication(characteristic, false);
} catch (err) {
  console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## on('BLECharacteristicChange')

on(type: 'BLECharacteristicChange', callback: Callback<BLECharacteristic>): void

Subscribes to the characteristic change events of the server. This API uses an asynchronous callback to return the result.

- You can receive characteristic change notifications or indications only after calling [setCharacteristicChangeNotification](#setcharacteristicchangenotification) or [setCharacteristicChangeIndication](#setcharacteristicchangeindication) to enable the notification or indication function.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLECharacteristicChange** indicates a characteristic change event. This event is triggered when the client receives a characteristic change notification or indication from the server. |
| callback | Callback<[BLECharacteristic](#blecharacteristic)> | Yes | Callback used to return the updated characteristic. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function CharacteristicChange(characteristicChangeReq: ble.BLECharacteristic) {
    let serviceUuid: string = characteristicChangeReq.serviceUuid;
    let characteristicUuid: string = characteristicChangeReq.characteristicUuid;
    let value: Uint8Array = new Uint8Array(characteristicChangeReq.characteristicValue);
}
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.on('BLECharacteristicChange', CharacteristicChange);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## off('BLECharacteristicChange')

off(type: 'BLECharacteristicChange', callback?: Callback<BLECharacteristic>): void

Unsubscribes from the characteristic change events of the server.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLECharacteristicChange** indicates a characteristic change event. |
| callback | Callback<[BLECharacteristic](#blecharacteristic)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('BLECharacteristicChange')](#onblecharacteristicchange). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.off('BLECharacteristicChange');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## on('BLEConnectionStateChange')

on(type: 'BLEConnectionStateChange', callback: Callback<BLEConnectionChangeState>): void

Subscribes to connection state change events of GATT profile on the client. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLECharacteristicChange** indicates a characteristic change event. This event is triggered when the GATT connection state changes. For example, the connection status may change when the client calls [connect](#connect) or [disconnect](#disconnect). |
| callback | Callback<[BLEConnectionChangeState](#bleconnectionchangestate)> | Yes | Callback used to return the GATT connection state change event. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
function ConnectStateChanged(state: ble.BLEConnectionChangeState) {
    console.info('bluetooth connect state changed');
    let connectState: ble.ProfileConnectionState = state.state;
}
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.on('BLEConnectionStateChange', ConnectStateChanged);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## off('BLEConnectionStateChange')

off(type: 'BLEConnectionStateChange', callback?: Callback<BLEConnectionChangeState>): void

Unsubscribes from connection state change events of GATT profile on the client.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEConnectionStateChange** indicates a connection state change event. |
| callback | Callback<[BLEConnectionChangeState](#bleconnectionchangestate)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('BLEConnectionStateChange')](#onbleconnectionstatechange). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.off('BLEConnectionStateChange');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## on('BLEMtuChange')

on(type: 'BLEMtuChange', callback: Callback<number>): void

Subscribes to MTU change events on the client. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEMtuChange** indicates an MTU change event. This event is triggered when the client initiates MTU negotiation by calling [setBLEMtuSize](#setblemtusize). |
| callback | Callback<number> | Yes | Callback used to return the negotiated MTU, in bytes. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    gattClient.on('BLEMtuChange', (mtu: number) => {
      console.info('BLEMtuChange, mtu: ' + mtu);
    });
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## off('BLEMtuChange')

off(type: 'BLEMtuChange', callback?: Callback<number>): void

Unsubscribes from MTU change events on the client.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEMtuChange** indicates an MTU change event. |
| callback | Callback<number> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('BLEMtuChange')](#onblemtuchange-1). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
try {
    let device: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
    device.off('BLEMtuChange');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## on('serviceChange')22+

on(type: 'serviceChange', callback: Callback<void>): void

Subscribes to service change events of the server device on the client. This API uses an asynchronous callback to return the result.

- If the client has subscribed to the event, the client will receive a service change notification when the server adds or deletes a service.
- When the client receives a service change notification, you are advised to call [getServices](#getservices) again to obtain the latest service capabilities supported by the server device.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event callback type. The supported event is "serviceChange", indicating a service change notification event. When a service is added or deleted on the server, this event is triggered to notify the client. |
| callback | Callback<void> | Yes | Notifies the client that the server service has changed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
function ServiceChangedEvent() : void {
    console.info("service has changed.");
}

let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
// Call the connect API to connect to the server device first.
try {
    gattClient.on('serviceChange', ServiceChangedEvent);
} catch (err) {
    console.error(`errCode: ${(err as BusinessError).code}, errMessage: ${(err as BusinessError).message}`);
}
```

## off('serviceChange')22+

off(type: 'serviceChange', callback?: Callback<void>): void

Unsubscribes from service change events of the server device on the client.

- After the unsubscription, if the service of the server device changes, the client does not receive the event notification.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event callback type. The supported event is "serviceChange", indicating a service change notification event. When a service is added or deleted on the server, this event is triggered to notify the client. |
| callback | Callback<void> | No | Callback function to unsubscribe from the specified service change events. If this parameter is specified, it must be the same as the passed callback in [on('serviceChange')](#onservicechange22). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
function ServiceChangedEvent() : void {
    console.info("service has changed.");
}

let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
// Call the connect API to connect to the server device first.
try {
    gattClient.off('serviceChange', ServiceChangedEvent);
} catch (err) {
    console.error(`errCode: ${(err as BusinessError).code}, errMessage: ${(err as BusinessError).message}`);
}
```

## getConnectedState22+

getConnectedState(): ProfileConnectionState

Obtains the current connection status with the server device.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](#profileconnectionstate) | Profile connection status of the Bluetooth device. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
try {
    let result: ble.ProfileConnectionState = gattClient.getConnectedState();
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## updateConnectionParam22+

updateConnectionParam(param: ConnectionParam): Promise<void>

Initiates a connection parameter update request to the peer device. After this API is successfully called, the data transmission speed with the peer device can be switched. This API uses a promise to return the result.

- You can call this API only after the GATT profile is connected by calling [connect](#connect).
- If this API is not called, the default connection parameter type is [ble.ConnectionParam.BALANCED](#connectionparam22).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| param | [ConnectionParam](#connectionparam22) | Yes | Connection parameter type. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
try {
    gattClient.updateConnectionParam(ble.ConnectionParam.LOW_POWER);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## readPhy23+

readPhy(): Promise<PhyValue>

Obtains the physical channel type of the link on the client. This API uses a promise to return the result.

- This method can be called only after the [connect](#connect) method is called to initiate a connection and the connection is successful.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| Promise<[PhyValue](#phyvalue23)> | Promise used to return the physical channel type of the link on the client. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. |

**Example**

```javascript
let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
try {
    gattClient.readPhy().then((phyValue:ble.PhyValue) => {
        console.info(`txPhy: ${phyValue.txPhy}, rxPhy: ${phyValue.rxPhy}`);
    });
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## setPhy23+

setPhy(phyValue: PhyValue): Promise<void>

Sets the physical channel type of the link on the client. This API uses a promise to return the result.

- This method can be called only after the [connect](#connect) method is called to initiate a connection and the connection is successful.
- After the client calls **setPhy** to set the physical channel type, the underlying layer will perform negotiation and produce the physical channel type supported by both the client and device based on the capabilities of the device. For example, if the server supports and sets [BLE_PHY_2M](#blephy23), but the device supports only [BLE_PHY_1M](#blephy23), the final type remains [BLE_PHY_1M](#blephy23).

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| phyValue | [PhyValue](#phyvalue23) | Yes | Physical channel type of the link. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |
| 2901003 | The connection is not established. |

**Example**

```javascript
let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
try {
    let phyValue: ble.PhyValue = {
        txPhy: ble.BlePhy.BLE_PHY_1M,
        rxPhy: ble.BlePhy.BLE_PHY_1M
    }
    gattClient.setPhy(phyValue);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## onBlePhyUpdate23+

onBlePhyUpdate(callback: Callback<PhyValue>): void

Subscribes to physical channel type change events. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | Callback<[PhyValue](#phyvalue23)> | Yes | Callback used to return the latest physical channel type. If such events are subscribed to, after the client calls [setPhy](#setphy23-1) or the device changes the current physical channel type, the callback containing the latest physical channel type will be received. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
function BlePhyCallback(data:ble.PhyValue) {
    console.info(`txPhy: ${data.txPhy}, rxPhy: ${data.rxPhy}`);
}
let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
try {
    gattClient.onBlePhyUpdate(BlePhyCallback);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

## offBlePhyUpdate23+

offBlePhyUpdate(callback?: Callback<PhyValue>): void

Unsubscribes from physical channel type change events. This API uses an asynchronous callback to return the result.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | Callback<[PhyValue](#phyvalue23)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [onBlePhyUpdate](#onblephyupdate23-1). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |

**Example**

```javascript
function BlePhyCallback(data:ble.PhyValue) {
    console.info(`txPhy: ${data.txPhy}, rxPhy: ${data.rxPhy}`);
}
let gattClient: ble.GattClientDevice = ble.createGattClientDevice('XX:XX:XX:XX:XX:XX');
try {
    gattClient.offBlePhyUpdate(BlePhyCallback);
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### ble.createBleScanner15+

createBleScanner(): BleScanner

Creates a [BleScanner](#blescanner15) instance, which can be used to initiate or stop the BLE scan.

**Atomic service API**: This API can be used in atomic services since API version 15.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| [BleScanner](#blescanner15) | **BleScanner** instance. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { ble } from '@kit.ConnectivityKit';
let bleScanner: ble.BleScanner = ble.createBleScanner();
console.info('create bleScanner success');
```

#### BleScanner15+

Represents the BLE scanner class, which provides scan-related APIs.

- Before using the APIs of this class, you need to call [createBleScanner](#blecreateblescanner15) to construct a BLE scanner instance.
- You can create multiple instances of this class to manage multiple scan processes.

## startScan15+

startScan(filters: Array<ScanFilter>, options?: ScanOptions): Promise<void>

Starts BLE scanning. This API uses a promise to return the result.

- This API can be used to scan only BLE devices.
- You can obtain the scan result through the callback of [on('BLEDeviceFind')](#onbledevicefind15).
- You can call [stopScan](#stopscan15) to stop the BLE scan.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 15.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| filters | Array<[ScanFilter](#scanfilter)> | Yes | Filter criteria for BLE advertising. Devices that meet the filter criteria will be reported. - If this parameter is set to **null**, all discoverable BLE devices nearby will be scanned. However, this method is not recommended as it may pick up unexpected devices and increase power consumption. - In geofence scan reporting mode (that is, [ScanReportMode](#scanreportmode15) is set to **FENCE_SENSITIVITY_LOW** or **FENCE_SENSITIVITY_HIGH**), this parameter cannot be set to **null**; that is, non-null filters must be passed. - Filter resources are shared by all applications. It is recommended that an application use no more than three filters. If filter resources are exhausted, the scan will fail and error code 2900009 will be returned. |
| options | [ScanOptions](#scanoptions) | No | Defines the scan configuration parameters. |

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900009 | Fails to start scan as it is out of hardware resources. |
| 2900099 | Operation failed. |
| 2902050 | Failed to start scan as Ble scan is already started by the app. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { ble } from '@kit.ConnectivityKit';
let bleScanner: ble.BleScanner = ble.createBleScanner();
function onReceiveEvent(scanReport: ble.ScanReport) {
    console.info('BLE scan device find result = '+ JSON.stringify(scanReport));
}
async function startscan() {
    try {
        bleScanner.on("BLEDeviceFind", onReceiveEvent);
        let scanFilter: ble.ScanFilter = {
            deviceId:"XX:XX:XX:XX:XX:XX",
            name:"test",
            serviceUuid:"00001888-0000-1000-8000-00805f9b34fb"
        };
        let scanOptions: ble.ScanOptions = {
            interval: 500,
            dutyMode: ble.ScanDuty.SCAN_MODE_LOW_POWER,
            matchMode: ble.MatchMode.MATCH_MODE_AGGRESSIVE,
            reportMode: ble.ScanReportMode.FENCE_SENSITIVITY_LOW
        }
        await bleScanner.startScan([scanFilter],scanOptions);
        console.info('startScan success');
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}
startscan();
```

## stopScan15+

stopScan(): Promise<void>

Stops an ongoing BLE scan. This API uses a promise to return the result.

- This API works for a scan initiated by calling [startScan](#startscan15).
- Call this API to stop the scanning if BLE device scanning is no longer needed.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 15.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 801 | Capability not supported. |
| 2900001 | Service stopped. |
| 2900003 | Bluetooth disabled. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { ble } from '@kit.ConnectivityKit';
let bleScanner: ble.BleScanner = ble.createBleScanner();
async function stopScan() {
    try {
        await bleScanner.stopScan();
        console.info('stopScan success');
    } catch (err) {
        console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
}
stopScan();
```

## on('BLEDeviceFind')15+

on(type: 'BLEDeviceFind', callback: Callback<ScanReport>): void

Subscribes to BLE scan result reporting events. This API uses an asynchronous callback to return the result.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API version 15 to 24: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 15.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEDeviceFind** indicates a scan result reporting event. This event is triggered if a BLE device is discovered when [startScan](#startscan15) is called. |
| callback | Callback<[ScanReport](#scanreport15)> | Yes | Callback used to return the set of scan results. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 15 to 24 |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { ble } from '@kit.ConnectivityKit';
function onReceiveEvent(scanReport: ble.ScanReport) {
    console.info('bluetooth device find = '+ JSON.stringify(scanReport));
}
let bleScanner: ble.BleScanner = ble.createBleScanner();
try {
    bleScanner.on('BLEDeviceFind', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

## off('BLEDeviceFind')15+

off(type: 'BLEDeviceFind', callback?: Callback<ScanReport>): void

Unsubscribes from BLE scan result reporting events.

- After [stopScan](#stopscan15) is called to stop the BLE scan, call this API to unsubscribe from scan result reporting events if device discovery is no longer needed.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**Atomic service API**: This API can be used in atomic services since API version 15.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **BLEDeviceFind** indicates a scan result reporting event. |
| callback | Callback<[ScanReport](#scanreport15)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [on('BLEDeviceFind')](#onbledevicefind15). If this parameter is not specified, all callbacks corresponding to the event type are unsubscribed. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| 2900099 | Operation failed. |

**Example**

```javascript
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { ble } from '@kit.ConnectivityKit';
function onReceiveEvent(scanReport: ble.ScanReport) {
    console.info('bluetooth device find = '+ JSON.stringify(scanReport));
}
let bleScanner: ble.BleScanner = ble.createBleScanner();
try {
    bleScanner.on('BLEDeviceFind', onReceiveEvent);
    bleScanner.off('BLEDeviceFind', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### GattService

Defines the structure of GATT service, which can contain multiple [BLECharacteristics](#blecharacteristic) and other dependent services.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | UUID of the GATT service, for example, 00001888-0000-1000-8000-00805f9b34fb. |
| isPrimary | boolean | No | No | Whether the service is a primary service. The value **true** indicates that the service is a primary service, and the value **false** indicates the opposite. |
| characteristics | Array<[BLECharacteristic](#blecharacteristic)> | No | No | Characteristics of the GATT service. |
| includeServices | Array<[GattService](#gattservice)> | No | Yes | Services on which the service depends. |

#### BLECharacteristic

Defines the structure of GATT characteristic, which is the core data unit of [GattService](#gattservice).

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | Service UUID of the characteristic, for example, 00001888-0000-1000-8000-00805f9b34fb. **Atomic service API**: This API can be used in atomic services since API version 12. |
| characteristicUuid | string | No | No | Characteristic UUID, for example, 00002a11-0000-1000-8000-00805f9b34fb. **Atomic service API**: This API can be used in atomic services since API version 12. |
| characteristicValue | ArrayBuffer | No | No | Characteristic value. **Atomic service API**: This API can be used in atomic services since API version 12. |
| descriptors | Array<[BLEDescriptor](#bledescriptor)> | No | No | Descriptors contained in the characteristic. **Atomic service API**: This API can be used in atomic services since API version 12. |
| properties | [GattProperties](#gattproperties) | No | Yes | Properties supported by the characteristic. **Atomic service API**: This API can be used in atomic services since API version 12. |
| characteristicValueHandle18+ | number | No | Yes | Unique handle of the characteristic. It can be used to distinguish characteristics if the BLE device that serves as the server provides multiple characteristics with the same UUID. **Atomic service API**: This API can be used in atomic services since API version 18. |
| permissions20+ | [GattPermissions](#gattpermissions20) | No | Yes | Permissions required for characteristic read and write operations. **Atomic service API**: This API can be used in atomic services since API version 20. |

#### BLEDescriptor

Defines the structure of GATT descriptor, which is the data unit of [BLECharacteristic](#blecharacteristic) and is used to describe the additional information and properties of the characteristic.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | Service UUID of the characteristic, for example, 00001888-0000-1000-8000-00805f9b34fb. **Atomic service API**: This API can be used in atomic services since API version 12. |
| characteristicUuid | string | No | No | Characteristic UUID of the descriptor, for example, 00002a11-0000-1000-8000-00805f9b34fb. **Atomic service API**: This API can be used in atomic services since API version 12. |
| descriptorUuid | string | No | No | Descriptor UUID, for example, 00002902-0000-1000-8000-00805f9b34fb. **Atomic service API**: This API can be used in atomic services since API version 12. |
| descriptorValue | ArrayBuffer | No | No | Descriptor value. **Atomic service API**: This API can be used in atomic services since API version 12. |
| descriptorHandle18+ | number | No | Yes | Unique handle of the descriptor. It can be used to distinguish descriptors if the BLE device that serves as the server provides multiple descriptors with the same UUID. **Atomic service API**: This API can be used in atomic services since API version 18. |
| permissions20+ | [GattPermissions](#gattpermissions20) | No | Yes | Permissions required for descriptor read and write operations. **Atomic service API**: This API can be used in atomic services since API version 20. |

#### NotifyCharacteristic

Defines the structure of characteristic notification.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | Service UUID of the characteristic, for example, 00001888-0000-1000-8000-00805f9b34fb. |
| characteristicUuid | string | No | No | Characteristic UUID, for example, 00002a11-0000-1000-8000-00805f9b34fb. |
| characteristicValue | ArrayBuffer | No | No | Characteristic value. |
| confirm | boolean | No | No | Whether confirmation is required. The value **true** indicates that confirmation is required for an indication, and the value **false** indicates that confirmation is not required for a notification. |

#### CharacteristicReadRequest

Defines the structure of characteristic read request sent from the client.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Bluetooth device address of the client. Example: XX:XX:XX:XX:XX:XX |
| transId | number | No | No | Transaction identifier of the characteristic read request. It must be the same as the **transId** in the response returned by the server. |
| offset | number | No | No | Read offset of the client. For example, **k** indicates that the read starts from the kth byte. It must be the same as the **offset** in the response returned by the server. |
| characteristicUuid | string | No | No | Characteristic UUID, for example, 00002a11-0000-1000-8000-00805f9b34fb. |
| serviceUuid | string | No | No | Service UUID of the characteristic, for example, 00001888-0000-1000-8000-00805f9b34fb. |

#### CharacteristicWriteRequest

Defines the structure of characteristic write request sent from the client.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Bluetooth device address of the client. Example: XX:XX:XX:XX:XX:XX |
| transId | number | No | No | Transaction identifier of the characteristic write request. It must be the same as the **transId** in the response returned by the server. |
| offset | number | No | No | Write offset of the client. For example, **k** indicates that the write starts from the kth byte. It must be the same as the **offset** in the response returned by the server. |
| isPrepared | boolean | No | No | Whether to respond immediately after receiving a write request from the client. The value **true** means to respond at a later time, and the value **false** means to respond immediately. |
| needRsp | boolean | No | No | Whether to respond to the client. The value **true** means to respond to the client, and the value **false** means to respond immediately. |
| value | ArrayBuffer | No | No | Characteristic value to write. |
| characteristicUuid | string | No | No | Characteristic UUID, for example, 00002a11-0000-1000-8000-00805f9b34fb. |
| serviceUuid | string | No | No | Service UUID of the characteristic, for example, 00001888-0000-1000-8000-00805f9b34fb. |

#### DescriptorReadRequest

Defines the structure of descriptor read request sent from the client.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Bluetooth device address of the client. Example: XX:XX:XX:XX:XX:XX |
| transId | number | No | No | Transaction identifier of the characteristic read request. It must be the same as the **transId** in the response returned by the server. |
| offset | number | No | No | Read offset of the client. For example, **k** indicates that the read starts from the kth byte. It must be the same as the **offset** in the response returned by the server. |
| descriptorUuid | string | No | No | Descriptor UUID, for example, 00002902-0000-1000-8000-00805f9b34fb. |
| characteristicUuid | string | No | No | Characteristic UUID of the descriptor, for example, 00002a11-0000-1000-8000-00805f9b34fb. |
| serviceUuid | string | No | No | Service UUID of the characteristic, for example, 00001888-0000-1000-8000-00805f9b34fb. |

#### DescriptorWriteRequest

Defines the structure of descriptor write request sent from the client.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Bluetooth device address of the client. Example: XX:XX:XX:XX:XX:XX |
| transId | number | No | No | Transaction identifier of the characteristic write request. It must be the same as the **transId** in the response returned by the server. |
| offset | number | No | No | Write offset of the client. For example, **k** indicates that the write starts from the kth byte. It must be the same as the **offset** in the response returned by the server. |
| isPrepared | boolean | No | No | Whether to respond immediately after receiving a write request from the client. The value **true** means to respond at a later time, and the value **false** means to respond immediately. |
| needRsp | boolean | No | No | Whether to respond to the client. The value **true** means to respond to the client, and the value **false** means to respond immediately. |
| value | ArrayBuffer | No | No | Descriptor value to write. |
| descriptorUuid | string | No | No | Descriptor UUID, for example, 00002902-0000-1000-8000-00805f9b34fb. |
| characteristicUuid | string | No | No | Characteristic UUID of the descriptor, for example, 00002a11-0000-1000-8000-00805f9b34fb. |
| serviceUuid | string | No | No | Service UUID of the characteristic, for example, 00001888-0000-1000-8000-00805f9b34fb. |

#### ServerResponse

Defines the structure of server response to a read/write request from the client.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Bluetooth device address of the client. Example: XX:XX:XX:XX:XX:XX |
| transId | number | No | No | Transaction identifier of the read/write request. It must be the same as the **transId** in the response returned by the server. |
| status | number | No | No | Response state. Set this parameter to **0**, which indicates a normal response. |
| offset | number | No | No | Read/write offset. It must be the same as the **offset** in the read/write request sent from the client. |
| value | ArrayBuffer | No | No | Response data. |

#### BLEConnectionChangeState

Defines the connection status of the GATT profile.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Peer Bluetooth device address. Example: XX:XX:XX:XX:XX:XX **Atomic service API**: This API can be used in atomic services since API version 12. |
| state | [ProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate) | No | No | Connection status of the GATT profile. **Atomic service API**: This API can be used in atomic services since API version 12. |
| reason20+ | [GattDisconnectReason](#gattdisconnectreason20) | No | Yes | Reason why the GATT connection is disconnected. This parameter is available only when the connection status is [STATE_DISCONNECTED](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate). Otherwise, the default value **undefined** is used. **Atomic service API**: This API can be used in atomic services since API version 20. |
| reasonMessage | string | No | Yes | Reason why the GATT connection is disconnected. This parameter is available only when the connection status is [STATE_DISCONNECTED](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate). Otherwise, the default value **undefined** is used. For example, if the local end proactively disconnects the connection, **0X16_LOCAL_HOST** is returned. **Since**: 26.0.0 **Atomic service API**: This API is supported in atomic services since API version 26.0.0. |

#### ScanResult

Defines the scan result to be reported upon scanning advertising packets that meet the filter criteria.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Bluetooth device address. Example: XX:XX:XX:XX:XX:XX For information security purposes, if the [actual MAC address](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-common#bluetoothaddresstype) is not configured in [ScanFilter](#scanfilter) when the application starts scanning, the device address obtained here is the [virtual MAC address](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-common#bluetoothaddresstype). - The virtual address remains unchanged after a device is paired successfully. - If Bluetooth is disabled and then enabled again, the virtual address will change immediately. - If the pairing is canceled, the Bluetooth subsystem will determine when to change the address based on the actual usage of the address. If the address is being used by another application, the address will not change immediately. - To persistently save the addresses, call [access.addPersistentDeviceId](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessaddpersistentdeviceid16). **Atomic service API**: This API can be used in atomic services since API version 12. |
| address23+ | [BluetoothAddress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-common#bluetoothaddress) | No | Yes | Bluetooth device address information, including the address and address type. |
| rssi | number | No | No | Signal strength, in dBm. **Atomic service API**: This API can be used in atomic services since API version 12. |
| data | ArrayBuffer | No | No | Raw unresolved broadcast packets sent by the discovered device. **Atomic service API**: This API can be used in atomic services since API version 12. |
| deviceName | string | No | No | Name of the discovered device, which is parsed from the data field of the raw data. The broadcast data type in the Bluetooth protocol is 0x09. **Atomic service API**: This API can be used in atomic services since API version 12. |
| connectable | boolean | No | No | Whether the discovered device is connectable. The value **true** indicates that the discovered device is connectable, and the value **false** indicates the opposite. **Atomic service API**: This API can be used in atomic services since API version 12. |
| advertiseFlags22+ | number | No | Yes | Broadcast flag of the discovered device, which is parsed from the data field of the raw data. The broadcast data type in the Bluetooth protocol is 0x01. If the broadcast packet carries the flag, this field has a value. Otherwise, the content is undefined. **Atomic service API**: This API can be used in atomic services since API version 22. |
| manufacturerDataMap22+ | Map<number, Uint8Array> | No | Yes | Collection of the discovered device manufacturer data, which is parsed from the data field of the raw data. The broadcast data type in the Bluetooth protocol is 0xFF. If the broadcast packet carries the device manufacturer data, this field has a value. Otherwise, the content is undefined. - The key of the map indicates the manufacturer ID, and the value indicates the specific content of the corresponding manufacturer data. **Atomic service API**: This API can be used in atomic services since API version 22. |
| serviceDataMap22+ | Map<string, Uint8Array> | No | Yes | Collection of the discovered device service data, which is parsed from the data field of the raw data. The broadcast data type in the Bluetooth protocol is 0x16. If the broadcast packet carries the device service data, this field has a value. Otherwise, the content is undefined. - The key of the map indicates the service UUID, and the value indicates the specific content of the corresponding UUID service. **Atomic service API**: This API can be used in atomic services since API version 22. |
| serviceUuids22+ | string[] | No | Yes | Collection of the discovered device service UUError Codes, which is parsed from the data field of the raw data. The broadcast data type of a 16-bit UUID is 0x03, that of a 32-bit UUID is 0x05, and that of a 128-bit UUID is 0x07. If the broadcast packet carries the device service UUID, this field has a value. Otherwise, the content is undefined. **Atomic service API**: This API can be used in atomic services since API version 22. |
| txPowerLevel22+ | number | No | Yes | Broadcast transmit power of the discovered device, which is parsed from the data field of the raw data. The broadcast data type in the Bluetooth protocol is 0x0A. If the broadcast packet carries the broadcast transmit power of the device, this field has a value. Otherwise, the content is undefined. **Atomic service API**: This API can be used in atomic services since API version 22. |
| advertisingDataMap22+ | Map<number, Uint8Array> | No | Yes | Broadcast data set of the discovered device, which is parsed from the data field of the raw data. - The key of the map indicates the broadcast data type, and the value indicates the content of the corresponding data type. For example, in the advertisingDataMap field, the value corresponding to the key 0x0A indicates the txPowerLevel value. - If the broadcast packet carries any broadcast data content, this field has a value. Otherwise, the content is undefined. **Atomic service API**: This API can be used in atomic services since API version 22. |

#### AdvertiseSetting

Defines the BLE advertising parameters.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| interval | number | No | Yes | Advertising interval. The value range is [32, 16777215], in slots. One slot represents 0.625 ms. The default value is **1600**. The maximum value is **16384** for traditional advertising. **Atomic service API**: This API can be used in atomic services since API version 12. |
| txPower | number | No | Yes | Transmit power. The value range is [–127, 1], in dBm. The default value is **–7**. Considering performance and power consumption, the recommended parameter values are as follows: **1** for high level, **-7** for medium level, and **-15** for low level. **Atomic service API**: This API can be used in atomic services since API version 12. |
| connectable | boolean | No | Yes | Whether the advertising is connectable. The value **true** indicates that the advertising is connectable, and the value false indicates the opposite. The default value is **true**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| isExtended | boolean | No | Yes | Whether to use extended advertising. The value **false** indicates legacy advertising, with a maximum packet length of 31 bytes; **true** indicates extended advertising, with the maximum packet length determined by the Bluetooth chip capability. The default value is **false**. **Since:** 26.0.0 **Atomic service API:** This API is supported in atomic services since API version 26.0.0. **Model constraint:** This API can be used only in the stage model. |

#### AdvertiseData

Defines the BLE advertising packet data, which can also be used in the response to a scan request. Both traditional advertising and extended advertising are supported. The maximum length of a traditional advertising packet is 31 bytes, and the maximum length of an extended advertising packet is determined by the Bluetooth chip capability. The advertising will fail if the maximum length is exceeded.

- In the traditional advertising mode, when all parameters are included (especially the advertising name, which is set by **includeDeviceName** or **advertiseName**), pay attention to the length of advertising packets.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuids | Array<string> | No | No | Service UUID. **Atomic service API**: This API can be used in atomic services since API version 12. |
| manufactureData | Array<[ManufactureData](#manufacturedata)> | No | No | Manufacturer data. **Atomic service API**: This API can be used in atomic services since API version 12. |
| serviceData | Array<[ServiceData](#servicedata)> | No | No | Service data. **Atomic service API**: This API can be used in atomic services since API version 12. |
| includeDeviceName | boolean | No | Yes | Whether to include the device name as the advertising name. The value **true** means to include the Bluetooth device name, and the value **false** means the opposite. The default value is **false**. If the application needs to customize an advertising name, **advertiseName** can be used. This parameter cannot be used with **advertiseName**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| includeTxPower18+ | boolean | No | Yes | Whether to include the transmit power. The value **true** means to include the transmit power, and the value **false** means the opposite. The default value is **false**. This parameter occupies three bytes. **Atomic service API**: This API can be used in atomic services since API version 18. |
| advertiseName23+ | string | No | Yes | Custom advertising name. This parameter cannot be used with **includeDeviceName**. **Required permissions**: [ohos.permission.MANAGE_BLUETOOTH_ADVERTISER_NAME](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/restricted-permissions#ohospermissionmanage_bluetooth_advertiser_name) **Atomic service API**: This API can be used in atomic services since API version 23. |

#### AdvertisingParams11+

Defines the parameters for initial BLE advertising.

According to the Bluetooth protocol, in extended advertising mode (that is, when [isExtended](#advertisesetting) is set to **true**), the advertising parameter [connectable](#advertisesetting) and the advertising response packet [advResponse](#blestartadvertising) cannot coexist. That is, if [connectable](#advertisesetting) is set to **true**, [advResponse](#blestartadvertising) must be empty; if [connectable](#advertisesetting) is set to **false**, [advResponse](#blestartadvertising) cannot be empty.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| advertisingSettings11+ | [AdvertiseSetting](#advertisesetting) | No | No | Advertising settings. |
| advertisingData11+ | [AdvertiseData](#advertisedata) | No | No | Advertising data. |
| advertisingResponse11+ | [AdvertiseData](#advertisedata) | No | Yes | Advertising response. |
| duration11+ | number | No | Yes | Advertising duration. The value range is [1, 65535], in 10 ms. If this parameter is not specified or set to **0**, advertising packets are sent continuously. |

#### AdvertisingEnableParams11+

Defines the parameters for enabling BLE advertising.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| advertisingId | number | No | No | Advertising ID. |
| duration | number | No | Yes | Advertising duration. The value range is [1, 65535], in 10 ms. If this parameter is not specified or set to **0**, advertising packets are sent continuously. |

#### AdvertisingDisableParams11+

Defines the parameters for disabling BLE advertising.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| advertisingId | number | No | No | Advertising ID. |

#### AdvertisingStateChangeInfo11+

Defines the BLE advertising status information.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| advertisingId | number | No | No | Advertising ID. It is assigned in initial advertising and is used to identify subsequent advertising operations. |
| state | [AdvertisingState](#advertisingstate11) | No | No | BLE advertising status. |

#### ManufactureData

Defines the manufacturer data in the BLE advertising packet data.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| manufactureId | number | No | No | Manufacturer ID allocated by the Bluetooth Special Interest Group (SIG). |
| manufactureValue | ArrayBuffer | No | No | Manufacturer data. |

#### ServiceData

Represents the service data in the BLE advertising packet data.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| serviceUuid | string | No | No | Service UUID. |
| serviceValue | ArrayBuffer | No | No | Service data. |

#### ScanFilter

Defines the scan filters for BLE advertising packet data. Only advertising packets that meet the filter criteria are reported.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | Yes | BLE device address. Example: XX:XX:XX:XX:XX:XX **Atomic service API**: This API can be used in atomic services since API version 12. |
| address23+ | [BluetoothAddress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-common#bluetoothaddress) | No | Yes | BLE device address and address type. Compared with **deviceId**, this parameter can be used to specify both the BLE device address and address type to filter BLE advertising packets. If both this parameter and **deviceId** are specified, only this parameter takes effect. |
| name | string | No | Yes | BLE device name. **Atomic service API**: This API can be used in atomic services since API version 12. |
| serviceUuid | string | No | Yes | Service UUID. This parameter is usually carried in the broadcast packets of a peripheral device, indicating the service UUID supported by the peripheral device. for example, 00001888-0000-1000-8000-00805f9b34fb. **Atomic service API**: This API can be used in atomic services since API version 12. |
| serviceUuidMask | string | No | Yes | Service UUID mask. This parameter can be used with **serviceUuid** to filter specific service UUError Codes. Example: FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF **Atomic service API**: This API can be used in atomic services since API version 12. |
| serviceSolicitationUuid | string | No | Yes | Service solicitation UUID. This parameter is usually carried in the broadcast packets of a central device, indicating the UUID of the service that the central device wants to search for. Example: 00001888-0000-1000-8000-00805F9B34FB **Atomic service API**: This API can be used in atomic services since API version 12. |
| serviceSolicitationUuidMask | string | No | Yes | Service solicitation UUID mask. This parameter can be used with **serviceSolicitationUuid** to filter specific service solicitation UUError Codes. Example: FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF **Atomic service API**: This API can be used in atomic services since API version 12. |
| serviceData | ArrayBuffer | No | Yes | Service data, for example, [0x90,0x00,0xF1,0xF2]. **Atomic service API**: This API can be used in atomic services since API version 12. |
| serviceDataMask | ArrayBuffer | No | Yes | Service data mask. This parameter can be used with **serviceData** to filter specific service data. Example: [0xFF,0xFF,0xFF,0xFF] **Atomic service API**: This API can be used in atomic services since API version 12. |
| manufactureId | number | No | Yes | Manufacturer ID, for example, 0x0006. **Atomic service API**: This API can be used in atomic services since API version 12. |
| manufactureData | ArrayBuffer | No | Yes | Manufacturer data. This parameter can be used with **manufactureId** to filter specific manufacturers. Example: [0x1F,0x2F,0x3F] **Atomic service API**: This API can be used in atomic services since API version 12. |
| manufactureDataMask | ArrayBuffer | No | Yes | Manufacturer data mask. This parameter can be used with **manufactureData** to filter specific manufacturer data. Example: [0xFF,0xFF,0xFF] **Atomic service API**: This API can be used in atomic services since API version 12. |
| rssiThreshold23+ | number | No | Yes | RSSI threshold. The value range can be [–128, 127] according to the Bluetooth protocol. You are advised to set a value in the range of [–90, 127]. **Atomic service API**: This API can be used in atomic services since API version 23. |

#### ScanOptions

Defines the scan options.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| interval | number | No | Yes | Delay for reporting the scan result, in ms. The default value is **0**. This parameter is used together with [ScanReportMode](#scanreportmode15). - This parameter does not take effect in normal and geofence scan reporting modes. The advertising packets that meet the filtering criteria are reported immediately. - This parameter takes effect in batch scan reporting mode. The advertising packets that meet the filtering criteria are stored in the cache queue and reported after the specified delay. If this parameter is not set or its value is in the range of [0, 5000), the Bluetooth subsystem sets the delay to **5000** by default. If the number of advertising packets that meet the filtering criteria exceeds the hardware's cache capability within the specified delay, the Bluetooth subsystem reports the scan result in advance. **Atomic service API**: This API can be used in atomic services since API version 12. |
| dutyMode | [ScanDuty](#scanduty) | No | Yes | Scan mode. The default value is **SCAN_MODE_LOW_POWER**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| matchMode | [MatchMode](#matchmode) | No | Yes | Hardware match mode. The default value is **MATCH_MODE_AGGRESSIVE**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| phyType12+ | [PhyType](#phytype12) | No | Yes | Physical channel type. The default value is **PHY_LE_1M**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| reportMode15+ | [ScanReportMode](#scanreportmode15) | No | Yes | Reporting mode. The default value is **NORMAL**. **Atomic service API**: This API can be used in atomic services since API version 15. |
| isExtended | boolean | No | Yes | Whether to use extended scanning. The value **false** indicates legacy scanning, and **true** indicates extended scanning. The default value is **false**. **Since:** 26.0.0 **Atomic service API:** Since API version 26.0.0, this API is supported in atomic services. **Model constraint:** This API can be used only in the stage model. |

#### GattProperties

Describes the properties supported by a GATT characteristic. The properties determine how the characteristic and its descriptors are used and accessed.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| write | boolean | No | Yes | Whether the write operation is supported. The value **true** indicates that the write operation is supported and a response is required, and the value **false** indicates that the write operation is not supported. The default value is **true**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| writeNoResponse | boolean | No | Yes | Whether the write operation is supported. The value **true** indicates that the write operation is supported without requiring a response, and the value **false** indicates that the write operation is not supported. The default value is **true**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| read | boolean | No | Yes | Whether the read operation is supported. **true** if supported; **false** otherwise. The default value is **true**. **Atomic service API**: This API can be used in atomic services since API version 12. |
| notify | boolean | No | Yes | Whether the notification operation is supported. The value **true** indicates that the notification operation is supported without requiring a confirmation response, and the value **false** indicates the notification operation is not supported. false **Atomic service API**: This API can be used in atomic services since API version 12. |
| indicate | boolean | No | Yes | Whether the indication operation is supported. The value **true** indicates that the indication operation is supported with requiring a confirmation response, and the value **false** indicates the indication operation is not supported. false **Atomic service API**: This API can be used in atomic services since API version 12. |
| broadcast20+ | boolean | No | Yes | Whether the characteristic can be sent by the server in advertising packets. The value **true** indicates that the characteristic can be sent by the server as [ServiceData](#servicedata) in advertising packets, and the value **false** indicates the opposite. false **Atomic service API**: This API can be used in atomic services since API version 20. |
| authenticatedSignedWrite20+ | boolean | No | Yes | Whether the characteristic can be written with a signature. The value **true** indicates that the characteristic can be written with a signature, and the value **false** indicates the opposite. Set this parameter to **true** if you want to replace the encryption process with signature verification. Ensure that **writeSigned** or **writeSignedMitm** in [GattPermissions](#gattpermissions20) is also set to **true**. Otherwise, this parameter does not take effect. false **Atomic service API**: This API can be used in atomic services since API version 20. |
| extendedProperties20+ | boolean | No | Yes | Whether the characteristic has extended attributes. The value **true** indicates that the characteristic has extended attributes, and the value **false** indicates the opposite. false **Atomic service API**: This API can be used in atomic services since API version 20. |

#### GattPermissions20+

Defines the permissions required for GATT characteristic or descriptor read/write operations.

**Atomic service API**: This API can be used in atomic services since API version 20.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| read | boolean | No | Yes | Whether reading characteristics or descriptors is allowed. **true** to enable, **false** otherwise. The default value is **true**. |
| readEncrypted | boolean | No | Yes | Whether the characteristic or descriptor needs to be encrypted before being read. The value **true** indicates that the characteristic or descriptor needs to be encrypted before being read, and the value **false** indicates the opposite. The default value is **false**. |
| readEncryptedMitm | boolean | No | Yes | Whether the characteristic or descriptor to be read needs to be encrypted to prevent man-in-the-middle (MITM) attacks. Enabling encryption helps to prevent data from being tampered with by a third party. The value **true** means to enable encryption, and the value **false** indicates the opposite. The default value is **false**. |
| write | boolean | No | Yes | Whether writing characteristics or descriptors is allowed. **true** to enable, **false** otherwise. The default value is **true**. |
| writeEncrypted | boolean | No | Yes | Whether the characteristic or descriptor needs to be encrypted before being written. The value **true** indicates that the characteristic or descriptor needs to be encrypted before being written, and the value **false** indicates the opposite. The default value is **false**. |
| writeEncryptedMitm | boolean | No | Yes | Whether the characteristic or descriptor to be written needs to be encrypted to prevent MITM attacks. The value **true** means to enable encryption, and the value **false** indicates the opposite. The default value is **false**. |
| writeSigned | boolean | No | Yes | Whether the characteristic or descriptor needs to be signed before being written. The value **true** means to enable encryption, and the value **false** indicates the opposite. The default value is **false**. |
| writeSignedMitm | boolean | No | Yes | Whether the characteristic or descriptor to be written needs to be signed to prevent MITM attacks. The value **true** means to enable encryption, and the value **false** indicates the opposite. The default value is **false**. |

#### PhyValue23+

Enumerates the physical channel types of the link.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| txPhy | [BlePhy](#blephy23) | No | No | Type of the physical channel on the sender. |
| rxPhy | [BlePhy](#blephy23) | No | No | Type of the physical channel on the receiver. |
| phyMode | [CodedPhyMode](#codedphymode23) | No | Yes | Encoding mode of the physical channel whose type is [BLE_PHY_CODED](#blephy23). The default value is **0**, indicating that no specific encoding mode is specified and the Bluetooth subsystem determines the encoding mode. |

#### GattWriteType

Enumerates GATT characteristic write modes.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| WRITE | 1 | The peer Bluetooth device needs to send a confirmation after the write operation is complete. |
| WRITE_NO_RESPONSE | 2 | The peer Bluetooth device does not need to send a confirmation after the write operation is complete. |

#### ScanDuty

Enumerates scan modes.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| SCAN_MODE_LOW_POWER | 0 | Low-power mode, which features lower power consumption but lower performance. |
| SCAN_MODE_BALANCED | 1 | Balanced mode, which features balanced performance and power consumption. |
| SCAN_MODE_LOW_LATENCY | 2 | Low-latency mode, which features high performance but high power consumption. |

#### MatchMode

Enumerates the hardware match modes of BLE scan filters.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| MATCH_MODE_AGGRESSIVE | 1 | Reports advertising packets only if their signal strength is relatively low or they are transmitted sparsely within a short period of time. |
| MATCH_MODE_STICKY | 2 | Reports advertising packets only if their signal strength is high or they are transmitted intensively within a short period of time. |

#### AdvertisingState11+

Enumerates BLE advertising states.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| STARTED11+ | 1 | After [startAdvertising](#blestartadvertising11) is called, advertising is successfully started and related resources are allocated. |
| ENABLED11+ | 2 | After [enableAdvertising](#bleenableadvertising11) is called, advertising is enabled successfully. |
| DISABLED11+ | 3 | After [disableAdvertising](#bledisableadvertising11) is called, advertising is disabled successfully. |
| STOPPED11+ | 4 | After [stopAdvertising](#blestopadvertising11) is called, advertising is disabled successfully and the resources allocated during initial advertising are released. |

#### PhyType12+

Enumerates the physical channels that are used to receive BLE advertising packets.

**Atomic service API**: This API can be used in atomic services since API version 12.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| PHY_LE_1M12+ | 1 | 1M PHY type. |
| PHY_LE_ALL_SUPPORTED12+ | 255 | All supported PHY types. |

#### ScanReport15+

Defines the scan report.

**Atomic service API**: This API can be used in atomic services since API version 15.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| reportType | [ScanReportType](#scanreporttype15) | No | No | Type of the scan report. |
| scanResult | Array<[ScanResult](#scanresult)> | No | No | Scan result to be reported upon scanning advertising packets that meet the filter criteria. |

#### ScanReportType15+

Enumerates scan report types.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| ON_FOUND | 1 | Triggers reporting when BLE advertising packets that meet the filter criteria are found. It applies to both the conventional and geofence reporting modes. **Atomic service API**: This API can be used in atomic services since API version 15. |
| ON_LOST | 2 | Triggers reporting when no BLE advertising packets that meet the filter criteria are found. It applies only to the geofence reporting mode. **Atomic service API**: This API can be used in atomic services since API version 15. |
| ON_BATCH19+ | 3 | Triggers reporting when BLE advertising packets that meet the filter criteria are found. The reporting interval is the value of **interval** in [ScanOptions](#scanoptions). **Atomic service API**: This API can be used in atomic services since API version 19. |

#### GattDisconnectReason20+

Enumerates the reasons of GATT disconnection.

**Atomic service API**: This API can be used in atomic services since API version 20.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| CONN_TIMEOUT | 1 | The connection times out. |
| CONN_TERMINATE_PEER_USER | 2 | The peer device proactively closes the connection. |
| CONN_TERMINATE_LOCAL_HOST | 3 | The local device proactively closes the connection. |
| CONN_UNKNOWN | 4 | Unknown reason. |

#### BleProfile21+

Enumerates the profile types of the local device.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| GATT | 1 | The local device serves as both the client and server in the GATT link. |
| GATT_CLIENT | 2 | The local device serves as the client in the GATT link. |
| GATT_SERVER | 3 | The local device serves as the server in the GATT link. |

#### ScanReportMode15+

Enumerates scan result reporting modes.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| NORMAL | 1 | Conventional reporting mode. The BLE advertising packets that meet the filter criteria are reported immediately after being scanned. **Atomic service API**: This API can be used in atomic services since API version 15. |
| BATCH19+ | 2 | Batch scan reporting mode. - This mode reduces the frequency at which scan results are reported, enabling the system to remain in sleep mode for extended periods and thus reducing the overall power consumption of the device. - In this mode, the BLE advertising packets that meet the filtering criteria are not reported immediately. Instead, they are reported after being cached for a period of time (specified by **interval** in [ScanOptions](#scanoptions)). **Atomic service API**: This API can be used in atomic services since API version 19. |
| FENCE_SENSITIVITY_LOW18+ | 10 | Low-sensitivity geofence reporting mode. - In this mode, advertising packets are reported only when the device enters or leaves the geofence. - This mode is applicable when the signal strength is relatively high and advertising packets are transmitted densely within a short period of time. - When advertising packets are detected for the first time, the device enters the geofence and reporting is triggered once. - If no advertising packets are detected within the specified period of time, the device leaves the geofence and reporting is triggered once. **Atomic service API**: This API can be used in atomic services since API version 18. |
| FENCE_SENSITIVITY_HIGH18+ | 11 | High-sensitivity geofence reporting mode. - In this mode, advertising packets are reported only when the device enters or leaves the geofence. - This mode is applicable when the signal strength is relatively low and advertising packets are transmitted sparsely within a short period of time. - When advertising packets are detected for the first time, the device enters the geofence and reporting is triggered once. - If no advertising packets are detected within the specified period of time, the device leaves the geofence and reporting is triggered once. **Atomic service API**: This API can be used in atomic services since API version 18. |

#### ConnectionParam22+

Enumerates connection parameter types.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| LOW_POWER | 1 | Low-power mode. Data transmission is slow, but the power consumption is low. |
| BALANCED | 2 | Balanced mode. The delay and power consumption are balanced. If no connection parameter update is requested, this is the default value. |
| HIGH | 3 | High-speed mode. Data transmission is fast, but the power consumption is high. - This connection parameter should be used when a large amount of data needs to be quickly transmitted. After the transmission is complete, the BALANCED connection parameter should be requested to reduce power consumption. |

#### BlePhy23+

Enumerates the types of the physical channel of the BLE device.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| BLE_PHY_1M | 1 | 1 Mbit/s physical channel. The theoretical data rate is 1 Mbit/s. |
| BLE_PHY_2M | 2 | 2 Mbit/s physical channel. The theoretical data rate is 2 Mbit/s. |
| BLE_PHY_CODED | 3 | CODED physical channel. This channel is applicable to low-speed but wide-coverage scenarios. |

#### CodedPhyMode23+

Enumerates the coding modes for the physical channel whose type is **BLE_PHY_CODED**.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model constraint**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| BLE_PHY_CODED_S2 | 1 | Adds 1 bit of redundancy information each time 1 bit of valid data is sent. The transmission speed is fast, and the anti-interference capability is strong. This mode is suitable for medium distances (10 m to 100 m). The theoretical data rate is 500 kbit/s. |
| BLE_PHY_CODED_S8 | 2 | Adds 7 bits of redundancy information each time 1 bit of valid data is sent. The transmission speed is slow, but the anti-interference capability is stronger. This mode is suitable for long distances (100 m to 300 m). The theoretical data rate is 125 kbit/s. |

#### GattSetting

Describes the parameters of a GATT connection.

**Since:** 26.0.0

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Atomic service API**: This API can be used in atomic services since API version 26.0.0.

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| autoConnect | boolean | No | Yes | Whether to directly connect to the remote device or automatically connect to the remote device when it is available. The value **true** indicates that the remote device is automatically connected when it is available, and the value **false** indicates that the remote device is directly connected. The default value is **false**. |
| transport | [BluetoothTransport](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection#bluetoothtransport) | No | Yes | Transport type of the connection. The default value is **TRANSPORT_LE**. |
