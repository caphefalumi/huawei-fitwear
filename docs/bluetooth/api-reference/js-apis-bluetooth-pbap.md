<!--
  Title: @ohos.bluetooth.pbap (Bluetooth PBAP Module)
  Catalog: harmonyos-references
  Document ID: js-apis-bluetooth-pbap
  Updated: 2026-10-14 09:43:06
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-pbap
-->
# @ohos.bluetooth.pbap (Bluetooth PBAP Module)

This module implements phone book access capabilities based on the [Phone Book Access Profile (PBAP)](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#pbap). It allows you to create a [PSE](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#pse) server instance and obtain the connection status of the Bluetooth phonebook service between devices. This module is applicable to scenarios where the local device functions as a PSE to provide phonebook access services for external devices. It helps you quickly implement Bluetooth phonebook sharing and connection management.

> **Note:** The initial APIs of this module are supported since API version 11. Newly added APIs will be marked with a superscript to indicate their earliest API version.

#### Modules to Import

```javascript
import { pbap } from '@kit.ConnectivityKit';
```

#### BaseProfile

type BaseProfile = baseProfile.BaseProfile

**BaseProfile** class, which provides public capabilities such as obtaining the connection status and listening for connection status changes.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Type | Description |
| --- | --- |
| [baseProfile.BaseProfile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofile) | **BaseProfile** API definition. |

#### pbap.createPbapServerProfile

createPbapServerProfile(): PbapServerProfile

Creates a [PSE](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#pse) instance. Through this instance, you can use the local device as the PSE and implement functions such as obtaining the phone book service connection status between the local device and other devices. Typical use scenarios include the Bluetooth car kit accessing the phone book of a mobile phone and cross-device contacts synchronization, where the local device needs to function as the phone book server.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| PbapServerProfile | PSE instance. - The **PbapServerProfile** class is inherited from [BaseProfile](#baseprofile). Therefore, you can use the APIs in its parent class. - The counterpart of the PSE role is the [PCE](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#pce) role. |

**Error codes**

For details about the error codes, see [Bluetooth Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-bluetoothmanager).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';

try {
    let pbapServerProfile = pbap.createPbapServerProfile();
    console.info('pbapServer success');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```
