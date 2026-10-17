<!--
  Title: @ohos.FusionConnectivity.PartnerAgentExtensionAbility (ExtensionAbility Component Supporting Device Status Notifications)
  Catalog: harmonyos-references
  Document ID: js-apis-fusionconnectivity-partneragentextensionability
  Updated: 2026-10-14 09:43:10
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragentextensionability
-->
# @ohos.FusionConnectivity.PartnerAgentExtensionAbility (ExtensionAbility Component Supporting Device Status Notifications)

As the base class of the peripheral interconnection extension capability, **PartnerAgentExtensionAbility** provides the device discovery and device offline notification features. This class needs to be inherited by the application. The **type** attribute of [extensionAbilities](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file#extensionabilities) in the module-level configuration file [module.json5](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file) must be set to **partnerAgent**.

> **Note:** The initial APIs of this module are supported since API version 23. Newly added APIs will be marked with a superscript to indicate their earliest API version. The APIs of this module can be used only in the stage model.

#### Constraints

To ensure system security and stability and prevent **PartnerAgentExtensionAbility** from abusing system resources, the system restricts its capabilities. Referencing certain modules is not supported. For details, please refer to the [Appendix](#appendix).

#### Modules to Import

```typescript
import { PartnerAgentExtensionAbility, partnerAgent } from '@kit.ConnectivityKit';
```

#### PartnerDeviceAddress

type PartnerDeviceAddress = partnerAgent.PartnerDeviceAddress

Describes the device address information.

**System capability**: SystemCapability.Communication.FusionConnectivity.Core

**Model restriction**: This API can be used only in the stage model.

| **Type** | **Description** |
| --- | --- |
| [partnerAgent.PartnerDeviceAddress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partnerdeviceaddress) | Address of the device to be interconnected. |

#### PartnerAgentExtensionAbilityDestroyReason

type PartnerAgentExtensionAbilityDestroyReason = partnerAgent.PartnerAgentExtensionAbilityDestroyReason

Describes the reason why **PartnerAgentExtensionAbility** is destroyed.

**System capability**: SystemCapability.Communication.FusionConnectivity.Core

**Model restriction**: This API can be used only in the stage model.

| **Type** | **Description** |
| --- | --- |
| [partnerAgent.PartnerAgentExtensionAbilityDestroyReason](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partneragentextensionabilitydestroyreason) | Reason why **PartnerAgentExtensionAbility** is destroyed. |

#### PartnerAgentExtensionAbility

As the base class of the peripheral interconnection extension capability, **PartnerAgentExtensionAbility** provides the device discovery and device offline notification features. This capability is inherited from [ExtensionAbility](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-app-ability-extensionability) and needs to be implemented by apps.

## Attribute

**System capability**: SystemCapability.Communication.FusionConnectivity.Core

**Model restriction**: This API can be used only in the stage model.

| **Name** | **Type** | **Read-Only** | **Optional** | **Description** |
| --- | --- | --- | --- | --- |
| context | [PartnerAgentExtensionContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragentextensioncontext) | No | No | Context of **PartnerAgentExtensionAbility**. |

## onDestroyWithReason

onDestroyWithReason(reason: PartnerAgentExtensionAbilityDestroyReason): void

Called when the peripheral interconnection extension capability is destroyed.

**System capability**: SystemCapability.Communication.FusionConnectivity.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| **Name** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| reason | [PartnerAgentExtensionAbilityDestroyReason](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partneragentextensionabilitydestroyreason) | Yes | Reason for destroying the peripheral interconnection extension capability. Different enumerated values indicate different destruction scenarios. Your app can execute the corresponding resource release or status saving logic based on the destruction reason. |

**Example**

```typescript
export default class PartnerAgentExtAbility extends PartnerAgentExtensionAbility {
  onDestroyWithReason(reason: partnerAgent.PartnerAgentExtensionAbilityDestroyReason): void {
    console.info(`onDestroyWithReason is: ${reason}`);
  }
}
```

## onDeviceDiscovered

onDeviceDiscovered(deviceAddress: PartnerDeviceAddress): void

Called when a registered device is discovered.

**System capability**: SystemCapability.Communication.FusionConnectivity.Core

**Model restriction**: This API can be used only in the stage model.

**Parameters**

| **Name** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| deviceAddress | [PartnerDeviceAddress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partnerdeviceaddress) | Yes | Address information of the device registered by the app. The app must be configured with the **bluetoothAddress** option of the **PartnerDeviceAddress** type. |

**Example**

```typescript
export default class PartnerAgentExtAbility extends PartnerAgentExtensionAbility {
  onDeviceDiscovered(deviceAddress: partnerAgent.PartnerDeviceAddress): void {
    console.info(`onDeviceDiscovered success: ${deviceAddress.bluetoothAddress}`);
  }
}
```

#### Appendix

**PartnerAgentExtensionAbility** does not support referencing the following modules.

| Kit | Module |
| --- | --- |
| Background Tasks Kit | [@ohos.backgroundTaskManager (Background Task Management)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-resourceschedule-backgroundtaskmanager) |
| Background Tasks Kit | [@ohos.resourceschedule.backgroundTaskManager (Background Task Management)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-resourceschedule-backgroundtaskmanager) |
| Camera Kit | [@ohos.multimedia.cameraPicker (Camera Picker)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-camerapicker) |
| Connectivity Kit | [@ohos.connectedTag (Active Tags)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-connectedtag) |
| Connectivity Kit | [@ohos.nfc.cardEmulation (Standard NFC Card Emulation)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-cardemulation) |
| Connectivity Kit | [@ohos.nfc.controller (Standard NFC)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nfccontroller) |
| Connectivity Kit | [@ohos.nfc.tag (Standard NFC Tags)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nfctag) |
| Connectivity Kit | [tagSession (Standard NFC Tag Session)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-tagsession) |
| Connectivity Kit | [@ohos.wifiext (WLAN Extension)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-wifiext) |
| Connectivity Kit | [@ohos.wifiManager (WLAN)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-wifimanager) |
| Connectivity Kit | [@ohos.wifiManagerExt (WLAN Extension)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-wifimanagerext) |
| Location Kit | [@ohos.geolocation (Geolocation)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-geolocation) |
| Location Kit | [@ohos.geoLocationManager (Geolocation Manager)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-geolocationmanager) |
| Media Library Kit | [@ohos.multimedia.movingphotoview (MovingPhotoView Component)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-multimedia-movingphotoview) |
| Telephony Kit | [@ohos.telephony.sim (SIM Management)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-sim) |
| Telephony Kit | [@ohos.telephony.sms (SMS)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-sms) |
