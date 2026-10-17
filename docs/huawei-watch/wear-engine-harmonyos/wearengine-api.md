<!--
  Title: wearEngine (Wearable Capabilities)
  Catalog: harmonyos-references
  Document ID: wearengine_api
  Updated: 2026-10-14 09:42:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api
-->
# wearEngine (Wearable Capabilities)

This module provides the interaction capability between phones and wearable devices. Apps can call APIs provided by this module to:

- Obtain the list of connected devices and exchange messages and files with a peer device.
- Query the status of a wearable device, send template-based notifications to a wearable device, and receive sensor data for a wearable device.

> **Note:** For the system capability SystemCapability.Health.WearEngine, use [canIUse()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-syscap#caniuse) to check whether the current device supports this system capability and the corresponding APIs.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { wearEngine } from '@kit.WearEngine';
```

#### wearEngine.getAuthClient

getAuthClient(context: common.Context): AuthClient

Obtains the client for authorization management.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| context | [common.Context](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-context#context) | Yes | Context, which must contain the **connectServiceExtensionAbility** method (for example, [UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1)). |

**Returns:**

| Type | Description |
| --- | --- |
| [AuthClient](#authclient) | Authorization management client, which stores methods related to the authorization module. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';

let authClient: wearEngine.AuthClient = wearEngine.getAuthClient(this.getUIContext().getHostContext());
console.info(`Succeeded in getting auth client`);
```

#### AuthClient

Authorization management client class, which is returned by [wearEngine.getAuthClient](#wearenginegetauthclient).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## requestAuthorization

requestAuthorization(request: AuthorizationRequest): Promise<AuthorizationResponse>

Requests authorization from a phone user, and returns the permissions granted by the user. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it is not supported.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| request | [AuthorizationRequest](#authorizationrequest) | Yes | Permission request class. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[AuthorizationResponse](#authorizationresponse)> | Promise used to return the authorization response class. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let authClient: wearEngine.AuthClient = wearEngine.getAuthClient(this.getUIContext().getHostContext());

let request: wearEngine.AuthorizationRequest = {
  permissions: [wearEngine.Permission.USER_STATUS]
}

// Request authorization from a phone user, and return the permissions granted by the user. This API uses a promise to return the result.
authClient.requestAuthorization(request).then(result => {
  console.info(`Succeeded in requesting authorize, authorized permissions is ${result.permissions}`);
}).catch((error: BusinessError) => {
  console.error(`Failed to request authorize. Code is ${error.code}, message is ${error.message}`);
})
```

## getAuthorization

getAuthorization(): Promise<AuthorizationResponse>

Obtains the permissions granted by a user. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it is not supported.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[AuthorizationResponse](#authorizationresponse)> | Promise used to return the authorization response class. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine).

| Error Code | Error Message |
| --- | --- |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let authClient: wearEngine.AuthClient = wearEngine.getAuthClient(this.getUIContext().getHostContext());

// Obtain the permissions granted by a user. This API uses a promise to return the result.
authClient.getAuthorization().then(result => {
  console.info(`Succeeded in getting authorized permissions, authorized permissions is ${result.permissions}`);
}).catch((error: BusinessError) => {
  console.error(`Failed to get authorized permissions. Code is ${error.code}, message is ${error.message}`);
})
```

#### AuthorizationBase

Base class for the input and output of the permission control module.

**System capability:** SystemCapability.Health.WearEngine

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| permissions | [Permission](#permission)[] | No | No | Array of permission enums. |

#### Permission

Permission enums.

**System capability:** SystemCapability.Health.WearEngine

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| USER_STATUS | 2 | Permission to obtain the user status. For example, the wearing status of a wearable. |
| MOTION_SENSOR | 3 | Permission to obtain the motion sensor data of the peer device. For example, acceleration sensor data. |
| HEALTH_SENSOR | 4 | Permission to obtain the human body sensor data of the peer device. For example, heart rate sensor data. |
| DEVICE_IDENTIFIER | 6 | Permission to obtain the SN of the connected wearable device. |

#### AuthorizationRequest

Permission request class, which inherits from [AuthorizationBase](#authorizationbase).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

#### AuthorizationResponse

Permission response class, which inherits from [AuthorizationBase](#authorizationbase).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

#### wearEngine.getDeviceClient

getDeviceClient(context: common.Context): DeviceClient

Obtains the client of the Device module.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| context | [common.Context](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-context#context) | Yes | Context, which must contain the **connectServiceExtensionAbility** method (for example, [UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1)). |

**Returns:**

| Type | Description |
| --- | --- |
| [DeviceClient](#deviceclient) | Device client, which stores methods related to the Device module. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
console.info(`Succeeded in getting device client.`);
```

#### DeviceClient

Device client class, which is returned by [wearEngine.getDeviceClient](#wearenginegetdeviceclient).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## getConnectedDevices

getConnectedDevices(): Promise<Device[]>

Obtains the connected devices that support Wear Engine capabilities. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[Device](#device)[]> | Promise used to return the device list. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine).

| Error Code | Error Message |
| --- | --- |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
deviceClient.getConnectedDevices().then((devices) => {
  console.info(`Succeeded in getting devices, devices number is ${devices.length}.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to get devices. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Device

Wearable device information class, which is returned by [getConnectedDevices](#getconnecteddevices).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## Attributes

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| randomId | string | No | No | Random and unique device identifier, which is automatically generated each time the device is linked. |
| category | [DeviceCategory](#devicecategory) | No | Yes | Device type. |
| name | string | No | Yes | Device name. |
| softwareVersion | string | No | Yes | Software version of a wearable. |
| model | string | No | Yes | Device model. |
| isSmartWatch | boolean | No | Yes | Indicates whether the device is a smart watch. **true**: yes; **false**: no. |
| osCategory | [OsCategory](#oscategory) | No | Yes | Operating system type of the device. **Since:** 5.1.0(18) |

## isWearEngineCapabilitySupported

isWearEngineCapabilitySupported(capability: WearEngineCapability): Promise<boolean>

Queries whether the connected wearable device returned by [getConnectedDevices](#getconnecteddevices) supports the specified [WearEngineCapability](#wearenginecapability). This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| capability | [WearEngineCapability](#wearenginecapability) | Yes | Specified Wear Engine capability. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<boolean> | Promise used to return whether the specified capability is supported. **true**: yes; **false**: no. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    device.isWearEngineCapabilitySupported(wearEngine.WearEngineCapability.P2P_COMMUNICATION)
      .then((isSupportP2P) => {
        console.info(`Succeeded in checking p2p capability, result is ${isSupportP2P}`);
      }).catch((error: BusinessError) => {
      console.error(`Failed to check p2p capability. Code is ${error.code}, message is${error.message}`);
    })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is${error.message}`);
}
```

## isDeviceCapabilitySupported

isDeviceCapabilitySupported(capability: DeviceCapability): Promise<boolean>

Queries whether the connected wearable device returned by [getConnectedDevices](#getconnecteddevices) supports the specified [DeviceCapability](#devicecapability). This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| capability | [DeviceCapability](#devicecapability) | Yes | Specified device capability. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<boolean> | Promise used to return whether the specified capability is supported. **true**: yes; **false**: no. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();
  
  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.CBT_I).then((isSupportCBTI) => {
      console.info(`Succeeded in checking CBTI capability, result is ${isSupportCBTI}`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to check CBTI capability. Code is ${error.code}, message is ${error.message}`);
    })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## getSerialNumber

getSerialNumber(): Promise<string>

Queries the SN of the connected wearable device returned by [getConnectedDevices](#getconnecteddevices). This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Returns:**

| Type | Description |
| --- | --- |
| Promise<string> | Promise used to return the device SN. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 801 | Capability not supported. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    device.getSerialNumber().then((sn) => {
      console.info(`Succeeded in getting device SN, result is ${sn}`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to get device SN. Code is ${error.code}, message is ${error.message}`);
    })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

#### WearEngineCapability

Wear Engine capability enums.

**System capability:** SystemCapability.Health.WearEngine

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| P2P_COMMUNICATION | 1 | Peer-to-peer (P2P) capability. |
| MONITOR | 2 | Monitor capability. |
| NOTIFICATION | 3 | Notify capability. |
| SENSOR | 4 | Sensor capability. |

#### DeviceCapability

Device capability enums.

**System capability:** SystemCapability.Health.WearEngine

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| APP_INSTALLATION | 14 | App installation capability. |
| CBT_I | 128 | Digital Cognitive Behavioral Therapy for Insomnia (CBT-I) capability. |

#### DeviceCategory

Device type enums.

**System capability:** SystemCapability.Health.WearEngine

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| DEFAULT | 1 | Phone or tablet. |
| WATCH | 2 | Watch. |
| BAND | 3 | Band. |
| OTHER_DEVICES | 255 | Other device types. |

#### OsCategory

Device operating system type enums.

**System capability:** SystemCapability.Health.WearEngine

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.1.0(18)

| Name | Value | Description |
| --- | --- | --- |
| HARMONYOS | 1 | HarmonyOS |
| IOS | 2 | IOS |
| OTHER_OS | 255 | Other types. |

#### wearEngine.getMonitorClient

getMonitorClient(context: common.Context): MonitorClient

Obtains the client of the Monitor module.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences**: For version 6.0.2(22) and earlier versions, this API is supported on phones and tablets. On other devices, it returns error code 801. For version 6.1.0(23) and later versions, this API is supported on phones, tablets, and wearables.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| context | [common.Context](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-context#context) | Yes | Context, which must contain the **connectServiceExtensionAbility** method (for example, [UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1)). |

**Returns:**

| Type | Description |
| --- | --- |
| [MonitorClient](#monitorclient) | Monitor client, which stores methods related to the Monitor module. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';

let monitorClient: wearEngine.MonitorClient = wearEngine.getMonitorClient(this.getUIContext().getHostContext());
console.info(`Succeeded in getting monitor client.`);
```

#### MonitorClient

Monitor client class, which is returned by [wearEngine.getMonitorClient](#wearenginegetmonitorclient).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## queryStatus

queryStatus(deviceRandomId: string, item: MonitorItem): Promise<MonitorData>

Queries the specified status of a specific device. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** For version 6.0.2(22) and earlier versions, this API is supported on phones and tablets. On other devices, it is not supported. For version 6.1.0(23) and later versions, this API is supported on phones and tablets. On other devices, it returns error code 801.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device involved in the query. |
| item | [MonitorItem](#monitoritem) | Yes | Device state enum, which specifies the status to be queried. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[MonitorData](#monitordata)> | Promise used to return the query result. For details about each returned status, please refer to [MonitorItem](#monitoritem). |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | The wearable device does not support the capabilities. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let monitorClient: wearEngine.MonitorClient = wearEngine.getMonitorClient(this.getUIContext().getHostContext());
try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    monitorClient.queryStatus(device.randomId, wearEngine.MonitorItem.WEAR_STATUS).then((result) => {
      console.info(`Succeeded in querying wear status, result is ${result.code}.`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to query wear status. Code is ${error.code}, message is ${error.message}.`);
    })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## subscribeEvent

subscribeEvent(deviceRandomId: string, type: MonitorEvent, callback: Callback<MonitorEventData>): Promise<void>

Subscribes to the change event of a specific device's specified status. This API uses a callback to return the change event asynchronously, and uses a promise to return the subscription result asynchronously.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** For version 6.0.2(22) and earlier versions, this API is supported on phones and tablets. On other devices, it is not supported. For version 6.1.0(23) and later versions, this API is supported on phones and tablets. On wearables, you can subscribe to device connection status change events. If you subscribe to other events, error code 801 will be returned.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| type | [MonitorEvent](#monitorevent) | Yes | Device state enum, which specifies the device status that you subscribe to. |
| callback | Callback<[MonitorEventData](#monitoreventdata)> | Yes | Callback used to return the information after the device status changes. It is executed after the status changes. You are advised to ensure that the lifecycle of the callback is extended to the time when the listener is canceled. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | In Wearable, when subscribing to events other than changes in device connection status, this error code is returned. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008500012](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500012-too-many-callbacks) | Too many callbacks of the same type. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let monitorClient: wearEngine.MonitorClient = wearEngine.getMonitorClient(this.getUIContext().getHostContext());

try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    let callback = (monitorEventData: wearEngine.MonitorEventData) => {
      console.info(`Succeeded in listening change of ${monitorEventData.event}, the new status is ${monitorEventData.data}.`);
    }
    monitorClient.subscribeEvent(device.randomId, wearEngine.MonitorEvent.EVENT_WEAR_STATUS_CHANGED, callback)
      .then(() => {
        console.info(`Succeeded in subscribing wear status.`);
      })
      .catch((error: BusinessError) => {
        console.error(`Failed to subscribe wear status. Code is ${error.code}, message is ${error.message}.`);
      })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## unsubscribeEvent

unsubscribeEvent(deviceRandomId: string, type: MonitorEvent, callback: Callback<MonitorEventData>): Promise<void>

Unsubscribes from the change event of a specific device's specified status. This API uses a promise to return the unsubscription result asynchronously.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** For version 6.0.2(22) and earlier versions, this API is supported on phones and tablets. On other devices, it is not supported. For version 6.1.0(23) and later versions, this API is supported on phones and tablets. On wearables, this API can be used to unsubscribe from device connection status change events. If this API is used to unsubscribe from other events, error code 801 will be returned.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which is used to specify the device to be unsubscribed from. |
| type | [MonitorEvent](#monitorevent) | Yes | Device state enum, which specifies the device status that you unsubscribe from. |
| callback | Callback<[MonitorEventData](#monitoreventdata)> | Yes | Callback used to return the information after the device status changes. The callback must be the same as the one passed for calling [subscribeEvent](#subscribeevent). |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | In Wearable, when unsubscribing to events other than changes in device connection status, this error code is returned. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let monitorClient: wearEngine.MonitorClient = wearEngine.getMonitorClient(this.getUIContext().getHostContext());

try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    // The callback function for deregistration must be the same as that for registration.
    let callback = (monitorEventData: wearEngine.MonitorEventData) => {
      console.info(`Succeeded in listening change of ${monitorEventData.event}, the new status is ${monitorEventData.data}.`);
    }

    // Create a subscription task to be deleted.
    monitorClient.subscribeEvent(device.randomId, wearEngine.MonitorEvent.EVENT_WEAR_STATUS_CHANGED, callback)
      .then(() => {
        console.info(`Succeeded in subscribing wear status`);

        // Delete the subscription task you have created.
        monitorClient.unsubscribeEvent(device.randomId, wearEngine.MonitorEvent.EVENT_WEAR_STATUS_CHANGED, callback)
          .then(() => {
            console.info(`Succeeded in unsubscribing wear status`);
          })
          .catch((error: BusinessError) => {
            console.error(`Failed to unsubscribe wear status. Code is ${error.code}, message is ${error.message}.`);
          })
      })
      .catch((error: BusinessError) => {
        console.error(`Failed to subscribe wear status. Code is ${error.code}, message is ${error.message}.`);
      })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is${error.message}`);
}
```

#### MonitorItem

Enumeration class of device status.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| WEAR_STATUS | wearStatus | Wearing status. Return value: **1**: The wearable is worn. **2**: The wearable is not worn. |
| POWER_STATUS | powerStatus | Battery level. Return value: ranges from 0 to 100, indicating the remaining battery level. |
| CHARGE_STATUS | chargeStatus | Charging status. Return value: **1**: The device is being charged. **2**: The device is not being charged. **3**: The device has been fully charged. |
| AVAILABLE_STORAGE_SPACE | availableStorageSpace | Available storage space. The return value indicates the available space for a user (KB). |
| POWER_MODE | powerMode | Power mode. Return value: **-1**: The device does not differentiate between power modes. **0**: smart mode **1**: ultra-long battery life mode |
| SPORT_STATUS | sportStatus | Workout status. Return value: **3**: The workout starts. **4**: The workout is paused. **5**: The workout is in progress. **6**: The workout ends. **Since:** 6.1.1(24) |

#### MonitorEvent

Enumeration class of device status change events.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| EVENT_CONNECTION_STATUS_CHANGED | connectionStatus | Device connection status. Return value: **2**: connected; **3**: disconnected; **5**: unlinked |
| EVENT_BATTERY_LEVEL_DROPPED | lowPower | Decreased device battery level. Return value: ranges from 0 to 100, indicating the remaining battery level. |
| EVENT_WEAR_STATUS_CHANGED | wearStatus | Device wearing status. Return value: **1**: worn; **2**: not worn. |
| EVENT_HEART_RATE_ALARM | heartRateAlarm | Heart rate alarm. Return value: **1**: resting heart rate too high; **2**: resting heart rate too low; **3**: workout heart rate too high; **4**: workout heart rate too low. |
| EVENT_CHARGE_STATUS_CHANGED | chargeStatus | Charging status. Return value: **1**: charging started; **2**: charging ended; **3**: charging completed. |
| EVENT_POWER_MODE_CHANGED | powerMode | Power mode switchover. Return value: **0**: to Smart mode; **1**: to Ultra-long Battery Life mode. |

#### MonitorData

Returns the device status information as the return value of [queryStatus](#querystatus) and the input parameter for the callback of [subscribeEvent](#subscribeevent).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| code | number | No | No | For details about the return value, please refer to [MonitorItem](#monitoritem) if you call [queryStatus](#querystatus) to query the device status. For details about the return value, please refer to [MonitorEvent](#monitorevent) if you call [subscribeEvent](#subscribeevent) to subscribe to the event. |
| data | string | No | Yes | Extended field. |

#### MonitorEventData

Passes the updated device status to the callback function as an input parameter, when the event you subscribe to by calling [subscribeEvent](#subscribeevent) is triggered.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| event | [MonitorEvent](#monitorevent) | No | No | Enum of subscription events registered in the callback function. |
| data | [MonitorData](#monitordata) | No | No | Updated device status. |

#### wearEngine.getP2pClient

getP2pClient(context: common.Context): P2pClient

Obtains the client of the P2P module.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| context | [common.Context](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-context#context) | Yes | Context, which must contain the **connectServiceExtensionAbility** method (for example, [UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1)). |

**Returns:**

| Type | Description |
| --- | --- |
| [P2pClient](#p2pclient) | P2P client, which stores methods related to the P2P module. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';

let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());
console.info(`Succeeded in getting p2p client.`);
```

#### P2pClient

P2P client class, which is returned by [wearEngine.getP2pClient](#wearenginegetp2pclient).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## isRemoteAppInstalled

isRemoteAppInstalled(deviceRandomId: string, remoteBundleName: string): Promise<boolean>

Checks whether a specified app has been installed on the wearable device. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| remoteBundleName | string | Yes | Name of the device-side app to be queried. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<boolean> | Promise used to return the result indicating whether a specified app is installed on the device. **true**: installed; **false**: not installed. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Define the device-side app bundle name as remoteBundleName.
        let remoteBundleName: string = '';

        p2pClient.isRemoteAppInstalled(device.randomId, remoteBundleName).then((isInstall) => {
          console.info(`Succeeded in checking remote app install, result is ${isInstall}.`);
        }).catch((error: BusinessError) => {
          console.error(`Failed to check remote app install. Code is ${error.code}, message is ${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## getRemoteAppVersion

getRemoteAppVersion(deviceRandomId: string, remoteBundleName: string): Promise<number>

Obtains the version number of a specified app on the wearable device. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences**: For version 6.1.0(23) and earlier versions, this API is supported on phones and tablets. On other devices, it returns error code 801. For version 6.1.1(24) and later versions, this API is supported on phones, tablets, and wearables.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| remoteBundleName | string | Yes | Name of the device-side app whose version number is to be queried. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<number> | Promise used to return the version number of the device-side app. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Define the device-side app bundle name as remoteBundleName.
        let remoteBundleName: string = '';

        p2pClient.getRemoteAppVersion(device.randomId, remoteBundleName).then((version) => {
          console.info(`Succeeded in getting remote app version, version is ${version}.`);
        }).catch((error: BusinessError) => {
          console.error(`Failed to check get remote app version. Code is ${error.code}, message is${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is${error.message}`);
}
```

## startRemoteApp

startRemoteApp(deviceRandomId: string, remoteBundleName: string, transformLocalBundleName?: boolean): Promise<P2pResult>

Starts a specified app on the wearable device. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| remoteBundleName | string | Yes | Name of the device-side app to be started. |
| transformLocalBundleName | boolean | No | Indicates whether to convert the local bundle name and fingerprint to match those stored on the cloud for compatible apps. The default value is **false**. **true**: yes; **false**: no. For details about how to set an app to a compatible one, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply). |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[P2pResult](#p2presult)> | Promise used to return the P2P communication result. The **code** field in the attributes indicates the result of starting the app. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Define the device-side app bundle name as remoteBundleName.
        let remoteBundleName: string = '';

        // The default value of transformLocalBundleName is false.
        p2pClient.startRemoteApp(device.randomId, remoteBundleName).then((p2pResult) => {
          console.info(`Succeeded in starting remote app, result is ${p2pResult.code}.`);
        }).catch((error: BusinessError) => {
          console.error(`Failed to start remote app. Code is ${error.code}, message is${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is${error.message}`);
}
```

## startRemoteApp

startRemoteApp(deviceRandomId: string, remoteApp: AppInfo, startConfig: StartConfig): Promise<P2pResult>

Starts a specified app on the peer device. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API can be called on wearables. It can start the [DISTRIBUTED_SERVICE](#entrytype) component on phones running HarmonyOS 5.0 or later, the [SERVICE](#entrytype) component on phones running HarmonyOS 3.1 or 4.0, and the [SERVICE](#entrytype) component on Android devices. It does not respond on other systems or devices.

**Since:** 6.1.1(24)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| remoteApp | [AppInfo](#appinfo) | Yes | Information about the peer device's app to be started. |
| startConfig | [StartConfig](#startconfig) | Yes | Configuration parameters of the peer device's app to be started. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[P2pResult](#p2presult)> | Promise used to return the [P2pResult](#p2presult) object. The **code** field in the attributes indicates the message sending result. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 801 | Capability not supported. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one has the capability required.)
    let device: wearEngine.Device = devices[0];
    // Set the device-side app information, including the bundle name and fingerprint.
    let remoteApp: wearEngine.AppInfo = {
      bundleName: 'example_bundleName',
      fingerprint: 'example_fingerprint'
    };

    // Set the type of the component that starts the app on the peer device.
    let startConfig: wearEngine.StartConfig = {
      entryType: wearEngine.EntryType.DISTRIBUTED_SERVICE,
      entryName: 'example_entryName'
    };

    p2pClient.startRemoteApp(device.randomId, remoteApp, startConfig).then((p2pResult) => {
      console.info(`Succeeded in starting remote app, result is ${p2pResult.code}.`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to start remote app. Code is ${error.code}, message is${error.message}.`);
    })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is${error.message}`);
}
```

## sendMessage

sendMessage(deviceRandomId: string, appParam: P2pAppParam, message: P2pMessage): Promise<P2pResult>

Sends messages to a specified app on the peer device. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Parameters of a specified device-side app. |
| message | [P2pMessage](#p2pmessage) | Yes | Message content to be transferred, in bytes. The value range is [1, 4096). |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[P2pResult](#p2presult)> | Promise used to return the [P2pResult](#p2presult) object. The **code** field in the attributes indicates the message sending result. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';
import { util } from '@kit.ArkTS';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
        }
        // Set the message to be sent.
        let messageContent: string = 'this is message';
        let textEncoder: util.TextEncoder = new util.TextEncoder;
        let message: wearEngine.P2pMessage = {
          content: textEncoder.encodeInto(messageContent)
        }

        p2pClient.sendMessage(device.randomId, appParam, message).then((p2pResult) => {
          console.info(`Succeeded in sending message, result is ${p2pResult.code}.`);
        }).catch((error: BusinessError) => {
          console.error(`Failed to send message. Code is ${error.code}, message is ${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## transferFile

transferFile(deviceRandomId: string, appParam: P2pAppParam, file: P2pFile, callback: AsyncCallback<P2pResult>): void

Sends a file to a specified app on the peer device. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Parameters of a specified device-side app. |
| file | [P2pFile](#p2pfile) | Yes | File to be transferred. |
| callback | AsyncCallback<[P2pResult](#p2presult)> | Yes | Callback used to return the P2P communication result. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008500011](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500011-invalid-file) | File is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';
import { fileIo } from '@kit.CoreFileKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
        }
        // Set the file to be sent.
        let p2pFile: wearEngine.P2pFile = {
          file: fileIo.openSync('')
        }

        p2pClient.transferFile(device.randomId, appParam, p2pFile,
          (error: BusinessError, p2pResult: wearEngine.P2pResult) => {
            // Callback processing logic.
            if (error) {
              console.error(`Failed to transfer file. Code is ${error.code}, message is ${error.message}.`);
              return;
            }
            if (p2pResult.code) {
              if (p2pResult.code === wearEngine.P2pResultCode.COMMUNICATION_SUCCESS) {
                console.info(`Succeeded in transfering file, the result is ${p2pResult.code}.`);
              }
              console.info(`Failed to transfer file, the error code is ${p2pResult.code}.`);
            }
            if (p2pResult.progress) {
              console.info(`Succeeded in transfering file, the progress is ${p2pResult.progress}.`);
            }
          })
        fileIo.close(p2pFile.file);
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## cancelFileTransfer

cancelFileTransfer(deviceRandomId: string, appParam: P2pAppParam, file: P2pFile): Promise<P2pResult>

Cancels file transfer to a specified app on the peer device. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Parameters of a specified device-side app. |
| file | [P2pFile](#p2pfile) | Yes | File to be transferred. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[P2pResult](#p2presult)> | Promise used to return the P2P communication result. The **code** field in the attribute indicates the result of canceling file sending. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008500011](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500011-invalid-file) | File is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';
import { fileIo } from '@kit.CoreFileKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
        }
        // Set information about the file to be sent.
        let p2pFile: wearEngine.P2pFile = {
          file: fileIo.openSync('')
        }

        p2pClient.transferFile(device.randomId, appParam, p2pFile, () => {
          // Execution logic of the callback function.
        })

        p2pClient.cancelFileTransfer(device.randomId, appParam, p2pFile).then((p2pResult) => {
          if (p2pResult.code === wearEngine.P2pResultCode.COMMUNICATION_SUCCESS) {
            console.info(`Succeeded in cancelling transfer file, the result is ${p2pResult.code}.`);
          }
        }).catch((error: BusinessError) => {
          console.error(`Failed to cancel transfer file. Code is ${error.code}, message is ${error.message}.`);
        })
        fileIo.close(p2pFile.file);
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## registerMessageReceiver

registerMessageReceiver(deviceRandomId: string, appParam: P2pAppParam, callback: Callback<P2pMessage>): Promise<void>

Subscribes to the event that an app on the peer device sends a message to the local device. This API uses a callback to return the event asynchronously when the local device receives the message sent by the app on the peer device, and uses a promise to return the subscription result asynchronously.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Device-side app parameters. |
| callback | Callback<[P2pMessage](#p2pmessage)> | Yes | Callback used to return the message sent by the app on the peer device. It is executed after the message sent by a device-side app is received. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008500012](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500012-too-many-callbacks) | Too many callbacks of the same type. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name is not converted.
        }
        // Set information about the file to be sent.
        let callback = (p2pMessage: wearEngine.P2pMessage) => {
          console.info(`Succeeded in receiving message, the message is ${p2pMessage.content}.`);
        }

        p2pClient.registerMessageReceiver(device.randomId, appParam, callback).then(() => {
          console.info(`Succeeded in registering message receiver.`);
        }).catch((error: BusinessError) => {
          console.error(`Failed to register message receiver. Code is ${error.code}, message is ${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## registerFileReceiver

registerFileReceiver(deviceRandomId: string, appParam: P2pAppParam, callback: Callback<P2pFile>): Promise<void>

Subscribes to the event that the peer device sends a file to the local device. This API uses a callback to return the event asynchronously when the local device receives the file sent by the peer device, and uses a promise to return the subscription result asynchronously.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Device-side app parameters. |
| callback | Callback<[P2pFile](#p2pfile)> | Yes | Callback used to return the file sent by the app on the peer device. It is executed after the file sent by a device-side app is received. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008500012](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500012-too-many-callbacks) | Too many callbacks of the same type. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
        }
        // Set information about the file to be sent.
        let callback = (p2pMessage: wearEngine.P2pFile) => {
          console.info(`Succeeded in receiving file.`);
        }

        p2pClient.registerFileReceiver(device.randomId, appParam, callback).then(() => {
          console.info(`Succeeded in registering file receiver.`);
        }).catch((error: BusinessError) => {
          console.error(`Failed to register file receiver. Code is ${error.code}, message is ${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## registerFileReceiverWithProgress

registerFileReceiverWithProgress(deviceRandomId: string, appParam: P2pAppParam, callback: Callback<P2pFile>): Promise<void>

Subscribes to the event that the peer device sends a file and the file transfer progress to the local device. This API uses a callback to return the event asynchronously when the local device receives the file and file transfer progress sent by the peer device, and uses a promise to return the subscription result asynchronously.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** For version 6.1.1 (24) and earlier versions, phones and tablets are supported by this API, while phones, tablets, and wearables are supported by the system capability to which this API belongs. Due to hardware capability restrictions, this API cannot be used on wearables. For version 26.0.0 and later versions, the device types (phones, tablets, and wearables) supported by this API are the same as those supported by the system capability to which this API belongs.

**Since:** 6.1.1(24)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Device-side app parameters. |
| callback | Callback<[P2pFile](#p2pfile)> | Yes | Callback used to return the file sent by the app on the peer device. It is executed after the file or transfer progress sent by the app on the device is received. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008500012](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500012-too-many-callbacks) | Too many callbacks of the same type. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
        }
        // Set information about the file to be sent and the transfer progress.
        let callback = (p2pMessage: wearEngine.P2pFile) => {
          if (!p2pMessage.file) {
            console.info(`progress is ${p2pMessage.progress}`);
          } else {
            console.info(`Succeeded in receiving file.`);
          }
        }

        p2pClient.registerFileReceiverWithProgress(device.randomId, appParam, callback).then(() => {
          console.info(`Succeeded in registering file receiver.`);
        }).catch((error: BusinessError) => {
          console.error(`Failed to register file receiver. Code is ${error.code}, message is ${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## unregisterMessageReceiver

unregisterMessageReceiver(deviceRandomId: string, appParam: P2pAppParam, callback: Callback<P2pMessage>): Promise<void>

Unsubscribes from the event that an app on the peer device sends a message to the local device. This API uses a promise to return the unsubscription result asynchronously.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Device-side app parameters. |
| callback | Callback<[P2pMessage](#p2pmessage)> | Yes | Callback used to return the message sent by the app on the peer device. The callback function must be the same as that used for subscription. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
        }
        // Set information about the file to be sent.
        let callback = (p2pMessage: wearEngine.P2pMessage) => {
          console.info(`Succeeded in receiving message, the message is ${p2pMessage.content}.`);
        }

        p2pClient.registerMessageReceiver(device.randomId, appParam, callback).then(() => {
          console.info(`Succeeded in registering message receiver.`);

          p2pClient.unregisterMessageReceiver(device.randomId, appParam, callback).then(() => {
            console.info(`Succeeded in unregistering message receiver.`);
          }).catch((error: BusinessError) => {
            console.error(`Failed to unregister message receiver. Code is ${error.code}, message is ${error.message}.`);
          })
        }).catch((error: BusinessError) => {
          console.error(`Failed to register message receiver. Code is ${error.code}, message is ${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## unregisterFileReceiver

unregisterFileReceiver(deviceRandomId: string, appParam: P2pAppParam, callback: Callback<P2pFile>): Promise<void>

Unsubscribes from the event that an app on the peer device sends a file to the local device. This API uses a promise to return the unsubscription result asynchronously.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| appParam | [P2pAppParam](#p2pappparam) | Yes | Device-side app parameters. |
| callback | Callback<[P2pFile](#p2pfile)> | Yes | Callback used to return the file sent by the app on the peer device. The callback function must be the same as that used for subscription. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());
let p2pClient: wearEngine.P2pClient = wearEngine.getP2pClient(this.getUIContext().getHostContext());

try {
  let deviceList: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  deviceList.forEach(async (device, idx) => {
    try {
      // Select the device that supports app installation.
      if (await device.isDeviceCapabilitySupported(wearEngine.DeviceCapability.APP_INSTALLATION)) {
        // Set the device-side app information, including the bundle name and fingerprint.
        // Obtain the bundle name and fingerprint from HUAWEI Developers.
        let appInfo: wearEngine.AppInfo = {
          bundleName: '',
          fingerprint: ''
        }
        // Define the device-side app parameter class as appParam.
        let appParam: wearEngine.P2pAppParam = {
          remoteApp: appInfo
          // The default value of transformLocalAppInfo is false, indicating that the bundle name and fingerprint are not converted.
        }
        // Set information about the file to be sent.
        let callback = (p2pMessage: wearEngine.P2pFile) => {
          console.info(`Succeeded in receiving file.`);
        }

        p2pClient.registerFileReceiver(device.randomId, appParam, callback).then(() => {
          console.info(`Succeeded in registering file receiver.`);

          p2pClient.unregisterFileReceiver(device.randomId, appParam, callback).then(() => {
            console.info(`Succeeded in unregistering file receiver.`);
          }).catch((error: BusinessError) => {
            console.error(`Failed to unregister file receiver. Code is ${error.code}, message is ${error.message}.`);
          })
        }).catch((error: BusinessError) => {
          console.error(`Failed to register file receiver. Code is ${error.code}, message is ${error.message}.`);
        })
      }
    } catch (error) {
      console.error(`Failed to check device capability. Code is ${error.code}, message is ${error.message}.`);
    }

    if (idx === deviceList.length - 1) {
      // An error is thrown if the target device does not exist.
      throw new Error('cannot find target device');
    }
  })
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

#### AppInfo

Device-side app information class.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| bundleName | string | No | No | App name. |
| fingerprint | string | No | No | [App fingerprint: Unique ID for identifying an app.](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_faq-9) |

#### P2pResultCode

Stores the return value enums of P2P communication.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| REMOTE_APP_NOT_INSTALLED | 200 | The app is not installed on the device. |
| REMOTE_APP_NOT_RUNNING | 201 | The app is not running on the device. |
| REMOTE_APP_RUNNING | 202 | The app is running on the device. |
| UNKNOWN_ERROR | 203 | Unknown error. |
| COMMUNICATION_FAILURE | 206 | The communication with the device-side app fails. |
| COMMUNICATION_SUCCESS | 207 | The communication with the device-side app is successful. |

#### P2pResult

Stores the P2P communication result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| code | number | No | Yes | Used to return the P2P communication result except file transfer. For details about the return value, please refer to [P2pResultCode](#p2presultcode). |
| progress | number | No | Yes | Only used to report the file transfer progress. The return value ranges from 0 to 100. |

#### P2pMessage

Message class sent from the local device app to the peer device app.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| content | Uint8Array | No | No | Content of the message to be transferred, in Uint8Array (binary byte array) format. |

#### P2pFile

File class sent from the app on the local device to the app on the peer device.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| file | [fs.File](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-file-fs#file) | No | No | File object. |
| progress | number | No | Yes | File transfer progress. **Since:** 6.1.1(24) |

#### P2pAppParam

Device-side app parameter class that can be used during P2P communication.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| remoteApp | [AppInfo](#appinfo) | No | No | Device-side app information class. |
| transformLocalAppInfo | boolean | No | Yes | Indicates whether to convert the local bundle name and fingerprint to match those stored on the cloud for compatible apps. The default value is **false**. **true**: yes; **false**: no. For details about how to set an app to a compatible one, please refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply). |

#### StartConfig

Configuration parameters of the peer device's app to be started.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 6.1.1(24)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| entryType | [EntryType](#entrytype) | No | No | Type of the component of peer device's app to be started. |
| entryName | string | No | Yes | Name of the component of the peer device's app to be started. |

#### EntryType

Type of the component of the peer device's app to be started.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 6.1.1(24)

| Name | Value | Description |
| --- | --- | --- |
| DISTRIBUTED_SERVICE | DistributedService | Distributed service component. Set this value when you need to start a distributed service component. |
| SERVICE | Service | Service component. Set this value when you need to start a service. |
| UI | UI | UI component. Set this value when you need to start a UI component. |

#### wearEngine.getNotifyClient

getNotifyClient(context: common.Context): NotifyClient

Obtains the client of the Notify module.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| context | [common.Context](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-context#context) | Yes | Context, which must contain the **connectServiceExtensionAbility** method (for example, [UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1)). |

**Returns:**

| Type | Description |
| --- | --- |
| [NotifyClient](#notifyclient) | Template-based notification client, which stores the methods for sending template-based notifications. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';

let notifyClient: wearEngine.NotifyClient = wearEngine.getNotifyClient(this.getUIContext().getHostContext());
console.info(`Succeeded in getting notify client`);
```

#### NotifyClient

Notify client class, which is returned by [wearEngine.getNotifyClient](#wearenginegetnotifyclient).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## notify

notify(deviceRandomId: string, options: NotificationOptions): Promise<void>

Sends a template-based notification to a wearable device, and returns the sending result. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it is not supported.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device involved in the query. |
| options | [NotificationOptions](#notificationoptions) | Yes | Parameter class for the configuration of template-based notifications. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let notifyClient: wearEngine.NotifyClient = wearEngine.getNotifyClient(this.getUIContext().getHostContext());
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());

try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    let button1: wearEngine.NotificationButton = {
      buttonId: wearEngine.ButtonId.FIRST_BUTTON,
      content: 'button_1'
    }
    let type1Notification: wearEngine.Notification = {
      type: wearEngine.NotificationType.NOTIFICATION_WITH_ONE_BUTTON,
      bundleName: 'bundleName',
      title: 'title',
      text: 'text',
      buttons: [button1]
    }
    let options: wearEngine.NotificationOptions = {
      notification: type1Notification,
      onAction: (feedback: wearEngine.NotificationFeedback) => {
        console.info(`one button notify get feedback is ${feedback.action ? feedback.action : feedback.errorCode}`);
      }
    }

    notifyClient.notify(device.randomId, options).then(result => {
      console.info(`Succeeded in sending notification.`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to send notification. Code is ${error.code}, message is ${error.message}`);
    })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

#### NotificationOptions

Parameter class for the configuration of template-based notifications.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## Attributes

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| notification | [Notification](#notification) | No | No | Parameter class for template-based notifications. |

## onAction

onAction(feedback: NotificationFeedback): void

Callback function executed after an action is performed on the notification received on the device.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it is not supported.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| feedback | [NotificationFeedback](#notificationfeedback) | Yes | Feedback class for the action performed on the notification received on the device. |

#### Notification

Parameter class for template-based notifications.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| type | [NotificationType](#notificationtype) | No | No | Notification template type. |
| bundleName | string | No | No | Bundle name of the app that sends the notification. |
| title | string | No | No | Notification title, in bytes. The value range is [1, 28). |
| text | string | No | No | Notification content, in bytes. The value range is [1, 400). |
| buttons | [NotificationButton](#notificationbutton)[] | No | Yes | Notification button information class. This parameter is empty by default. |

#### NotificationType

Template type enum class for template-based notifications.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| NOTIFICATION_WITHOUT_BUTTONS | 50 | Notification without a button. |
| NOTIFICATION_WITH_ONE_BUTTON | 51 | Notification with a button. |
| NOTIFICATION_WITH_TWO_BUTTONS | 52 | Notification with two buttons. |
| NOTIFICATION_WITH_THREE_BUTTONS | 53 | Notification with three buttons. |

#### NotificationButton

Notification button information class.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| buttonId | [ButtonId](#buttonid) | No | No | Button ID enum. |
| content | string | No | No | Text on the button, in bytes. The value range is [1, 12). |

#### ButtonId

Button ID enum class for template-based notifications.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| FIRST_BUTTON | firstButton | ID of the first button. |
| SECOND_BUTTON | secondButton | ID of the second button. |
| THIRD_BUTTON | thirdButton | ID of the third button. |

#### NotificationFeedback

Feedback class for the action performed on the notification received on the device.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| action | [NotificationAction](#notificationaction) | No | Yes | Feedback enum class for the action performed on the notification received on the device. |
| errorCode | number | No | Yes | Error code. For details, please refer to [NotificationErrorCode](#notificationerrorcode). |

#### NotificationAction

Feedback enum class for the action performed on the notification received on the device.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| NOTIFICATION_SWITCHED_TO_BACKGROUND | 0 | The user presses the Home button to exit or turn off the screen, and the notification switches to the background. |
| NOTIFICATION_DELETED | 1 | The notification is deleted by the user. |
| FIRST_BUTTON_CLICKED | 2 | The user taps the first button in the notification. |
| SECOND_BUTTON_CLICKED | 3 | The user taps the second button in the notification. |
| THIRD_BUTTON_CLICKED | 4 | The user taps the third button in the notification. |

#### NotificationErrorCode

Error enum class for device-side notifications.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| INTERNAL_ERROR | 255 | An internal error occurs in Wear Engine. [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible. |

#### wearEngine.getSensorClient

getSensorClient(context: common.Context): SensorClient

Obtains the client of the Sensor module.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it returns error code 801.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| context | [common.Context](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-context#context) | Yes | Context, which must contain the **connectServiceExtensionAbility** method (for example, [UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1)). |

**Returns:**

| Type | Description |
| --- | --- |
| [SensorClient](#sensorclient) | Sensor client, which stores methods related to the Sensor module. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| 801 | Capability not supported. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';

let sensorClient: wearEngine.SensorClient = wearEngine.getSensorClient(this.getUIContext().getHostContext());
console.info(`Succeeded in getting sensor client`);
```

#### SensorClient

Sensor client class, which is returned by [wearEngine.getSensorClient](#wearenginegetsensorclient).

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

## getSensorList

getSensorList(deviceRandomId: string): Promise<Sensor[]>

Obtains the list of available sensors on the device. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it is not supported.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[Sensor](#sensor)[]> | Promise used to return the list of available sensors on the device. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let sensorClient: wearEngine.SensorClient = wearEngine.getSensorClient(this.getUIContext().getHostContext());
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());

try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one is the target device.)
    let device: wearEngine.Device = devices[0];

    sensorClient.getSensorList(device.randomId).then((sensorList) => {
      console.info(`Succeeded in getting sensor list, result is ${sensorList}`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to get sensor list. Code is ${error.code}, message is ${error.message}`);
    })
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## subscribeSensor

subscribeSensor(deviceRandomId: string, type: SensorType, callback: Callback<SensorResult>): Promise<void>

Subscribes to data reported by a specified sensor and returns a message indicating whether the subscription is successful. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it is not supported.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which specifies the device to be subscribed to. |
| type | [SensorType](#sensortype) | Yes | Sensor type, which specifies the sensor to be subscribed to. |
| callback | Callback<[SensorResult](#sensorresult)> | Yes | Callback used to return the result reported by the sensor. It is used to process the data reported by the sensor. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008500012](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500012-too-many-callbacks) | Too many callbacks of the same type. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let sensorClient: wearEngine.SensorClient = wearEngine.getSensorClient(this.getUIContext().getHostContext());
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());

try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one has the capability required.)
    let device: wearEngine.Device = devices[0];
    try {
      let sensorList: wearEngine.Sensor[] = await sensorClient.getSensorList(device.randomId);
      sensorList.forEach((sensor) => {
        if (sensor.type === wearEngine.SensorType.ACCELEROMETER) {
          let callback = (sensorResult: wearEngine.SensorResult) => {
            console.info(`Succeeded in getting sensor result, result is ${sensorResult}`);
          }
          // Subscribe to data reported by the acceleration sensor.
          sensorClient.subscribeSensor(device.randomId, wearEngine.SensorType.ACCELEROMETER, callback).then(() => {
            console.info(`Succeeded in subscribing sensor data.`);
          }).catch((error: BusinessError) => {
            console.error(`Failed to subscribe sensor data. Code is ${error.code}, message is ${error.message}`);
          })
        }
      })
    } catch (error) {
      console.error(`Failed to get sensor list. Code is ${error.code}, message is ${error.message}`);
    }
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

## unsubscribeSensor

unsubscribeSensor(deviceRandomId: string, type: SensorType, callback: Callback<SensorResult>): Promise<void>

Unsubscribes from data reported by a specified sensor and returns a message indicating whether the unsubscription is successful. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.WearEngine

**Device behavior differences:** This API is supported on phones and tablets. On other devices, it is not supported.

**Model restriction:** This API can be used only in the stage model.

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| deviceRandomId | string | Yes | Random identifier of a [device](#device), which is used to specify the device to be unsubscribed from. |
| type | [SensorType](#sensortype) | Yes | Sensor type, which specifies the sensor to be unsubscribed from. |
| callback | Callback<[SensorResult](#sensorresult)> | Yes | Callback used to return the result reported by the sensor. The callback function must be the same as that used for subscription. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| [1008500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500001-network-error) | Network error. The network is unavailable. |
| [1008500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500002-no-linked-device) | No device is bound. |
| [1008500003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500003-device-not-connected) | Device disconnected. |
| [1008500004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500004-wear-engine-service-not-applied-for) | App has not applied for the Wear Engine service. |
| [1008500005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500005-user-authorization-not-granted) | The HUAWEI ID is not authorized. |
| [1008500006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500006-privacy-statement-not-agreed-to) | User privacy is not agreed. |
| [1008500007](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500007-capability-not-supported-on-the-wearable-device) | The device capability is not supported. |
| [1008500008](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500008-account-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1008500009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500009-account-error) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1008500010](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500010-invalid-device-id) | Device ID is invalid. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let sensorClient: wearEngine.SensorClient = wearEngine.getSensorClient(this.getUIContext().getHostContext());
let deviceClient: wearEngine.DeviceClient = wearEngine.getDeviceClient(this.getUIContext().getHostContext());

try {
  let devices: wearEngine.Device[] = await deviceClient.getConnectedDevices();

  if (devices.length > 0) {
    // Select the target device from the obtained device list and define it as device. (Assume that there are connected devices in the array and the first one has the capability required.)
    let device: wearEngine.Device = devices[0];
    try {
      let sensorList: wearEngine.Sensor[] = await sensorClient.getSensorList(device.randomId);
      sensorList.forEach((sensor) => {
        if (sensor.type === wearEngine.SensorType.ACCELEROMETER) {
          let callback = (sensorResult: wearEngine.SensorResult) => {
            console.info(`Succeeded in getting sensor result, result is ${sensorResult}`);
          }
          // Subscribe to data reported by the acceleration sensor.
          sensorClient.subscribeSensor(device.randomId, wearEngine.SensorType.ACCELEROMETER, callback)
            .then(() => {
              console.info(`Succeeded in subscribing sensor data.`);

              // Cancel the data reporting from the acceleration sensor. Note that the callback function must be the same as the one used for subscription.
              sensorClient.unsubscribeSensor(device.randomId, wearEngine.SensorType.ACCELEROMETER, callback)
                .then(() => {
                  console.info(`Succeeded in unsubscribing sensor data.`);
                })
                .catch((error: BusinessError) => {
                  console.error(`Failed to unsubscribe sensor data. Code is ${error.code}, message is ${error.message}`);
                })
            })
            .catch((error: BusinessError) => {
              console.error(`Failed to subscribe sensor data. Code is ${error.code}, message is ${error.message}`);
            })
        }
      })
    } catch (error) {
      console.error(`Failed to get sensor list. Code is ${error.code}, message is ${error.message}`);
    }
  }
} catch (error) {
  console.error(`Failed to get connected devices. Code is ${error.code}, message is ${error.message}`);
}
```

#### SensorType

Sensor type.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| ELECTROCARDIOGRAPHY | 0 | Electrocardiograph (ECG) sensor. |
| PHOTOPLETHYSMOGRAPHY | 1 | Photoplethysmogram (PPG) sensor. |
| ACCELEROMETER | 2 | Acceleration sensor. |
| GYROSCOPE | 3 | Gyroscope sensor. |
| MAGNETIC_FIELD | 4 | Magnetometer sensor. |
| HEART_RATE | 6 | Heart rate sensor. |

#### Sensor

Sensor information class.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| name | string | No | No | Sensor name. |
| id | number | No | No | Sensor ID. |
| type | [SensorType](#sensortype) | No | No | Sensor type. |
| accuracy | number | No | Yes | Sampling period of the sensor, in milliseconds. |
| resolution | number | No | Yes | Sensor resolution. Currently, this parameter is used only as the return value of the **Sensor** object. |
| isUtcTimestampSupported | boolean | No | No | Indicates whether the sensor supports the Coordinated Universal Time (UTC) timestamp. **true**: yes; **false**: no. |

#### SensorData

Sensor reporting data class.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| sensorType | [SensorType](#sensortype) | No | No | Sensor type. |
| data | number[] | No | No | For details about the data content, format, and meaning, please refer to [Sensor Data Format and Sample of Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/device_sensor#sensor-data-format-and-sample-of-wearable-devices). |
| channel | number | No | Yes | Sensor channel ID, which is an integer greater than 0. |
| timestamp | number | No | Yes | Timing timestamp, in milliseconds. |
| utcTimestamp | number | No | Yes | UTC timestamp, in milliseconds. |

#### SensorErrorCode

Error enum class for error reporting by the sensor on the device.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Value | Description |
| --- | --- | --- |
| DEVICE_NOT_BEING_WORN | 300 | The device is not worn. |
| DEVICE_LEAD_OFF | 301 | The device lead is disconnected. |
| SENSOR_TURNED_OFF_MANUALLY | 302 | The sensor is manually disabled. |
| SENSOR_OCCUPIED | 303 | The sensor is occupied. |
| SENSOR_NOT_SUPPORTED | 304 | The sensor is not supported. |

#### SensorResult

Sensor reporting result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| data | [SensorData](#sensordata)[] | No | Yes | Data reported by the sensor. |
| errorCode | number | No | Yes | Error code. For details, please refer to [SensorErrorCode](#sensorerrorcode). |

#### On/Off Subscription Event

## wearEngine.on

on(type: 'serviceDie', callback: Callback<void>): void

Subscribes to the server destruction event. This API uses an asynchronous callback to return the result. If you call [wearEngine.destroy](#wearenginedestroy) to destroy the server, the callback will not be triggered.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Type of the event to listen for. Only **serviceDie** is supported, indicating the server destruction event. |
| callback | Callback<void> | Yes | Callback that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| [1008500012](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008500012-too-many-callbacks) | Too many callbacks of the same type. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let callback = () => {
  console.info(`The service destruction event`);
}
try {
  wearEngine.on('serviceDie', callback);
  console.info(`Succeeded in subscribing the service destruction event.`);
} catch (error) {
  const err: BusinessError = error as BusinessError;
  console.error(`Failed to subscribe the service destruction event. Code is ${err.code}, message is ${err.message}.`);
}
```

## wearEngine.off

off(type: 'serviceDie', callback?: Callback<void>): void

Unsubscribes from the server destruction event. This API uses an asynchronous callback to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| type | string | Yes | Type of the event to listen for. Only **serviceDie** is supported, indicating the server destruction event. |
| callback | Callback<void> | No | Callback that returns no value. The callback function must be the same as that used for subscription. If this parameter is left blank, all previous subscriptions will be canceled. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| Error Code | Error Message |
| --- | --- |
| 401 | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

let callback = () => {
  console.info(`The service destruction event`);
}
wearEngine.on('serviceDie', callback);

try {
  wearEngine.off('serviceDie', callback);
  console.info(`Succeeded in unsubscribing the service destruction event.`);
} catch (error) {
  const err: BusinessError = error as BusinessError;
  console.error(`Failed to unsubscribe the service destruction event. Code is ${err.code}, message is ${err.message}.`);
}
```

#### wearEngine.destroy

destroy(): Promise<void>

Proactively destroys the server. This API uses a promise to return the result.

**Model restriction:** This API can be used only in the stage model.

**System capability:** SystemCapability.Health.WearEngine

**Since:** 5.0.0(12)

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Wear Engine ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine).

| Error Code | Error Message |
| --- | --- |
| [1008509999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine#section1008509999-internal-error) | Internal error. |

**Example:**

```typescript
import { wearEngine } from '@kit.WearEngine';
import { BusinessError } from '@kit.BasicServicesKit';

wearEngine.destroy().then(() => {
  console.info(`Succeeded in destroying wear engine channel.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to destroy wear engine channel. Code is ${error.code}, message is ${error.message}.`);
})
```
