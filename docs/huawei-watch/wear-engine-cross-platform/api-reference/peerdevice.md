<!--
  Title: PeerDevice
  Catalog: connectivity-References
  Document ID: peerdevice-0000001237467975
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/peerdevice-0000001237467975
-->
# PeerDevice

| java.lang.Object \|---com.huawei.watch.kit.hiwear.peerdevice.PeerDevice 
```
public class PeerDevice
extends java.lang.Object
```
 |
| --- |

It is used to provide phone information.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| short | [getOsType](#EN-US_TOPIC_0000001874111186__getOsType--)() Obtains the phone system type. |
   
| Methods inherited from class java.lang.Object |
| --- |
| equals, getClass, hashCode, notify, notifyAll, toString, wait, wait, wait |

#### Method Detail

## getOsType

public short getOsType()

It is used to obtain the phone system type.

**Returns:**

Phone system type. **1** indicates Android or HarmonyOS, and **2** indicates iOS.
