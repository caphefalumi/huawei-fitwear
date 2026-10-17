<!--
  Title: @ohos.bluetooth.baseProfile (Bluetooth baseProfile Module)
  Catalog: harmonyos-references
  Document ID: js-apis-bluetooth-baseprofile
  Updated: 2026-10-14 09:42:36
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile
-->
# @ohos.bluetooth.baseProfile (Bluetooth baseProfile Module)

This module provides the basic common methods for different Bluetooth technology protocols. It offers common capabilities such as querying the connection status, subscribing to connection status updates, and unsubscribing from connection status updates for Bluetooth [profiles](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#profile) such as [A2DP](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#a2dp), [HFP](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hfp) and [PAN](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#pan). This module is suitable for scenarios where the connection status of multiple Bluetooth profiles needs to be managed in a unified manner within an app.

> **Note:** The initial APIs of this module are supported since API version 10. Newly added APIs will be marked with a superscript to indicate their earliest API version.

#### Modules to Import

```javascript
import { baseProfile } from '@kit.ConnectivityKit';
```

#### BaseProfile

**BaseProfile** class, which provides common capabilities such as obtaining the connection status and listening for connection status changes. For example, profiles such as [A2dpSourceProfile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-a2dp#a2dpsourceprofile) and [HandsFreeAudioGatewayProfile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-hfp#handsfreeaudiogatewayprofile) are inherited from this class.

#### ProfileConnectionState

type ProfileConnectionState = constant.ProfileConnectionState

Represents the profile connection status between the local and peer Bluetooth devices.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Type | Description |
| --- | --- |
| [constant.ProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate) | Profile connection status between the local and peer Bluetooth devices. |

#### StateChangeParam

Defines the parameters for the profile connection status change between the local and peer Bluetooth devices.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Address of the peer device, for example, XX:XX:XX:XX:XX:XX. |
| state | [ProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate) | No | No | Profile connection status. |
| cause12+ | [DisconnectCause](#disconnectcause12) | No | No | Reason of profile disconnection. |
| role | [PanRole](#panrole) | No | Yes | [PAN](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#pan) role of the current peer device. This field is returned only when the PAN profile connection status changes. It does not exist in non-PAN scenarios. **Since:** 26.0.0 |

#### DisconnectCause12+

Enumerates the reasons of profile disconnection.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| USER_DISCONNECT | 0 | The user proactively disconnects the connection. |
| CONNECT_FROM_KEYBOARD | 1 | The connection request needs to be initiated from the keyboard. |
| CONNECT_FROM_MOUSE | 2 | The connection request needs to be initiated from the mouse. |
| CONNECT_FROM_CAR | 3 | The connection request needs to be initiated from the head unit. |
| TOO_MANY_CONNECTED_DEVICES | 4 | The number of connections exceeds the limit. |
| CONNECT_FAIL_INTERNAL | 5 | Internal error. |

#### PanRole

Enumerates the PAN roles.

**Since:** 26.0.0

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| ROLE_PANNAP | 0 | [NAP](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#nap) role. |
| ROLE_PANU | 1 | [PANU](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#panu) role. |

#### BaseProfile.getConnectedDevices

getConnectedDevices(): Array<string>

Obtains the list of peer devices that have connected to the profile of the local device. For example, in a Bluetooth audio playback app, you can use this method to obtain the list of connected A2DP audio devices for device display or management.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API versions 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| Array<string> | List of peer devices that have connected to the profile of the local device. For security purposes, the device addresses obtained are virtual MAC addresses. - The virtual address of a paired Bluetooth device will not change. - If Bluetooth is disabled and then enabled again, the virtual address will change immediately. - If the pairing is canceled, the Bluetooth subsystem will determine when to change the address based on the actual usage of the address. If the address is being used by another application, the address will not change immediately. - To persistently save the address, call [access.addPersistentDeviceId](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access#accessaddpersistentdeviceid16). |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal) and [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

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
import { BusinessError } from '@kit.BasicServicesKit';
import { a2dp } from '@kit.ConnectivityKit';

try {
    let a2dpSrc = a2dp.createA2dpSrcProfile(); // A2DP is used as an example.
    let retArray = a2dpSrc.getConnectedDevices();
} catch (err) {
    console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
}
```

#### BaseProfile.getConnectionState

getConnectionState(deviceId: string): ProfileConnectionState

Obtains the profile connection status between the local and peer devices. For example, in a Bluetooth app, you can use this API to determine whether a device is connected, and then decide whether to initiate data transfer or update the device connection status.

- Starting from API version 21, this API can be used to obtain the profile connection status by using the actual MAC address of the peer device.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceId | string | Yes | Address of the peer device, for example, XX:XX:XX:XX:XX:XX. |

**Return value**

| Type | Description |
| --- | --- |
| [ProfileConnectionState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-constant#profileconnectionstate) | Profile connection status. |

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
import { BusinessError } from '@kit.BasicServicesKit';
import { a2dp } from '@kit.ConnectivityKit';

try {
    let a2dpSrc = a2dp.createA2dpSrcProfile(); // A2DP is used as an example.
    let ret = a2dpSrc.getConnectionState('XX:XX:XX:XX:XX:XX');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### BaseProfile.on('connectionStateChange')

on(type: 'connectionStateChange', callback: Callback<StateChangeParam>): void

Subscribes to profile connection status change events. This API uses an asynchronous callback to return the result. For example, in a Bluetooth audio app, when the earphones are connected or disconnected, the playback screen status is updated in real time or a message is displayed to notify the user.

**Required permissions**:

- API versions 26.0.0+: ohos.permission.ACCESS_BLUETOOTH or (ohos.permission.ACCESS_BLUETOOTH and ohos.permission.GET_BLUETOOTH_PEERS_MAC)
- API versions 10 to 24: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **connectionStateChange** indicates a profile connection status change event. This event is triggered when the profile connection status changes. |
| callback | Callback<[StateChangeParam](#statechangeparam)> | Yes | Callback used to return the profile connection status. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. Applicable versions: 10 to 24 |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
import { a2dp } from '@kit.ConnectivityKit';

function onReceiveEvent(data: baseProfile.StateChangeParam) {
    console.info('a2dp state = '+ JSON.stringify(data));
}
try {
    let a2dpSrc = a2dp.createA2dpSrcProfile(); // A2DP is used as an example.
    a2dpSrc.on('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### BaseProfile.off('connectionStateChange')

off(type: 'connectionStateChange', callback?: Callback<[StateChangeParam](#statechangeparam)>): void

Disables listening for profile connection status change events.

**Required permissions**: ohos.permission.ACCESS_BLUETOOTH

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Event type. The value **connectionStateChange** indicates a profile connection status change event. |
| callback | Callback<[StateChangeParam](#statechangeparam)> | No | Callback to unregister. If this parameter is specified, it must be the same as the callback in [BaseProfile.on('connectionStateChange')](#baseprofileonconnectionstatechange). In this case, the callback is canceled. If the passed callback is different from the registered callback, the subscription cannot be canceled. If no parameter is passed, all callbacks of the specified type are unregistered. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 201 | Permission denied. |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';
import { a2dp } from '@kit.ConnectivityKit';

function onReceiveEvent(data: baseProfile.StateChangeParam) {
    console.info('a2dp state = '+ JSON.stringify(data));
}
try {
    let a2dpSrc = a2dp.createA2dpSrcProfile(); // A2DP is used as an example.
    a2dpSrc.on('connectionStateChange', onReceiveEvent);
    a2dpSrc.off('connectionStateChange', onReceiveEvent);
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```
