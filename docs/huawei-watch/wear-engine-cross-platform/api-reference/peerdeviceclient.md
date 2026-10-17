<!--
  Title: PeerDeviceClient
  Catalog: connectivity-References
  Document ID: peerdeviceclient-0000001192908020
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/peerdeviceclient-0000001192908020
-->
# PeerDeviceClient

| java.lang.Object \|---com.huawei.watch.kit.hiwear.peerdevice.PeerDeviceClient 
```
public class PeerDeviceClient
extends java.lang.Object
```
 |
| --- |

It provides the API class for obtaining phone information.

#### Constructor Summary

| Constructor and Description |
| --- |
| [PeerDeviceClient](#EN-US_TOPIC_0000001873951294__PeerDeviceClient-Context-)(Context context) Indicates the **PeerDeviceClient **constructor function. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| Task<java.lang.Boolean> | [getPeerDevice](#EN-US_TOPIC_0000001873951294__getPeerDevice-com_huawei_watch_kit_hiwear_peerdevice_PeerDeviceCallback-)([PeerDeviceCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/peerdevicecallback-0000001192748042) peerDeviceCallback) Obtains phone information and returns the **PeerDevice** object using an asynchronous callback. |
   
| Methods inherited from class java.lang.Object |
| --- |
| equals, getClass, hashCode, notify, notifyAll, toString, wait, wait, wait |

#### Constructor Detail

## PeerDeviceClient

public PeerDeviceClient(Context context)

**PeerDeviceClient** constructor.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | API for app-related environment information. |

#### Method Detail

## getPeerDevice

public Task<java.lang.Boolean> getPeerDevice([PeerDeviceCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/peerdevicecallback-0000001192748042) peerDeviceCallback) throws [HiWearException](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearexception-0000001059517248)

It is used to obtain phone information and returns the **PeerDevice** object using an asynchronous callback.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| peerDeviceCallback | **PeerDevice** callback. |

**Returns:**

A task is returned. Your app can obtain the **getPeerDevice** execution result from **peerDeviceCallback**.

**Throws:**

| Throw Name | Throw Description |
| --- | --- |
| [HiWearException](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearexception-0000001059517248) | Throws an exception if the device is not connected. |
