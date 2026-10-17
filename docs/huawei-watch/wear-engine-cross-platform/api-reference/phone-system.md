<!--
  Title: Phone System Information
  Catalog: connectivity-References
  Document ID: phone-system-0000001237277153
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/phone-system-0000001237277153
-->
# Phone System Information

#### Modules to Import

```cpp
import {PeerDeviceClient} from "../wearengine.js"
```

#### PeerDeviceClient.getPeerDevice(Object)

It is used to obtain the phone system information.

- Input parameter 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [peerDeviceCallback](#EN-US_TOPIC_0000001874111010__li11790175314127) | Object | Yes | Callback of phone system information. |
 peerDeviceCallback 
| **Value** | **Type** | **Description** |
| --- | --- | --- |
| onSuccess | Function | Callback used when the phone system information is successfully obtained. |
| onFailure | Function | Callback used when the phone system information fails to be obtained. |
 **onSuccess** return value 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [data](#EN-US_TOPIC_0000001874111010__table131052711159) | Object | Yes | Obtains the return value of obtaining the phone system information. |
 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [peerDevice](#EN-US_TOPIC_0000001874111010__table131182721511) | Object | Yes | The phone system information object. |
| errorCode | int | Yes | Error code. |
 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| mOsType | int | Yes | Phone system type. **1** indicates Android or HarmonyOS and **2** indicates iOS. |

- **onFailure** return value 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| [data](#EN-US_TOPIC_0000001874111010__table24631451194016) | Object | Yes | Obtains the return value of obtaining the phone system information. |
 
| **Parameter** | **Type** | **Mandatory** | **Description** |
| --- | --- | --- | --- |
| errorCode | int | Yes | Error code. |
