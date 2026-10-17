<!--
  Title: @ohos.bluetooth.hfp (Bluetooth HFP Module)
  Catalog: harmonyos-references
  Document ID: js-apis-bluetooth-hfp
  Updated: 2026-10-14 09:43:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-hfp
-->
# @ohos.bluetooth.hfp (Bluetooth HFP Module)

This module provides the Bluetooth call audio capability based on the [Hands-Free Profile (HFP)](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hfp), such as creating [HFP AG](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hfp-ag) and [HF](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hf) instances and obtaining the call audio connection status. This module is applicable to scenarios where Bluetooth call audio connection management and call audio connection status monitoring need to be implemented.

> **Note:** The initial APIs of this module are supported since API version 10. Newly added APIs will be marked with a superscript to indicate their earliest API version.

#### Modules to Import

```javascript
import { hfp } from '@kit.ConnectivityKit';
```

#### BaseProfile

type BaseProfile = baseProfile.BaseProfile

**BaseProfile** class, which provides public capabilities such as obtaining the connection status and listening for connection status changes.

**System capability**: SystemCapability.Communication.Bluetooth.Core

| Type | Description |
| --- | --- |
| [baseProfile.BaseProfile](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-baseprofile#baseprofile) | **BaseProfile** API definition. |

#### hfp.createHfpAgProfile

createHfpAgProfile(): HandsFreeAudioGatewayProfile

Creates an [HFP AG](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hfp-ag) instance. Through this instance, you can use the local device as the HFP AG and implement functions such as obtaining the Bluetooth call audio connection status. Typical use scenarios include the Bluetooth call function of the in-vehicle infotainment (IVI) system. The local device functions as the audio gateway (AG) to manage the call audio route.

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Return value**

| Type | Description |
| --- | --- |
| [HandsFreeAudioGatewayProfile](#handsfreeaudiogatewayprofile) | HFP AG instance, which can be used to obtain the Bluetooth call audio connection status with other devices. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 401 | Invalid parameter. Possible causes: 1. Mandatory parameters are left unspecified. 2. Incorrect parameter types. 3. Parameter verification failed. |
| 801 | Capability not supported. |

**Example**

```javascript
import { BusinessError } from '@kit.BasicServicesKit';

try {
    let hfpAgProfile = hfp.createHfpAgProfile();
    console.info('hfpAg success');
} catch (err) {
    console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
}
```

#### hfp.createHfpHfProfile

createHfpHfProfile(): HandsFreeHfProfile

Creates an [HF](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hf) instance. Through this instance, you can use the local device as the HF and implement functions such as obtaining the Bluetooth call audio connection status. Typical use scenarios include the hands-free call function of Bluetooth earphones and the in-vehicle hands-free call system. The local device functions as the hands-free (HF) role to receive and process call audio.

**Since:** 26.0.0

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.

**Return value**

| Type | Description |
| --- | --- |
| [HandsFreeHfProfile](#handsfreehfprofile) | HF instance, which can be used to obtain the Bluetooth call audio connection status with other devices. |

**Error codes**

For details about the error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| 801 | Capability not supported. |

**Example**

```javascript
try {
    let hfProfile = hfp.createHfpHfProfile();
    console.info('hf success');
} catch (err) {
    console.error(`errCode: ${err.code}, errMessage: ${err.message}`);
}
```

#### HandsFreeAudioGatewayProfile

Represents the [HFP AG](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hfp-ag) role in Bluetooth call audio.

- The **HandsFreeAudioGatewayProfile** class is inherited from [BaseProfile](#baseprofile). Therefore, you can use the APIs in its parent class.
- Before using the APIs of this class, you need to construct an HFP AG instance by calling [createHfpAgProfile](#hfpcreatehfpagprofile).
- The counterpart of the HFP AG role is the [HF](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hf) role.

**System capability**: SystemCapability.Communication.Bluetooth.Core

#### HandsFreeHfProfile

Represents the [HF](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hf) role in Bluetooth call audio.

- This class is inherited from [BaseProfile](#baseprofile). Therefore, you can use the APIs in its parent class.
- Before using the APIs of this class, you need to construct an instance of this class by calling [createHfpHfProfile](#hfpcreatehfphfprofile).
- The counterpart of the HF role is the [HFP AG](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/terminology#hfp-ag) role.

**Since:** 26.0.0

**System capability**: SystemCapability.Communication.Bluetooth.Core

**Model restriction**: This API can be used only in the stage model.
