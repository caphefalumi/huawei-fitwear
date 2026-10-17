<!--
  Title: Peer
  Catalog: connectivity-References
  Document ID: peer-0000001060460922
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/peer-0000001060460922
-->
# Peer

| java.lang.Object \|---com.huawei.wearengine.p2p.Peer 
```
public class Peer
extends java.lang.Object
```
 |
| --- |

Message object of the device that needs to be communicated with.

Message objects of the device include the device object, fingerprint information, and package name.

#### Nested Class Summary

| Modifier and Type | Class and Description |
| --- | --- |
| static class | [Peer.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641) Building class in Peer. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) | [getDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922#EN-US_TOPIC_0000001873951342__getDevice--)() Obtains the Peer device object. |
| java.lang.String | [getFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922#EN-US_TOPIC_0000001873951342__getFingerPrint--)() Obtains the Peer fingerprint information. |
| java.lang.String | [getPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922#EN-US_TOPIC_0000001873951342__getPkgName--)() Obtains the Peer package name. |

#### Method Detail

## getDevice

public [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) getDevice()

It is used to obtain the Peer device object.

**Returns:**

Peer device object.

**Since:**

API level 0 (SDK 5.0.0.301)

## getFingerPrint

public java.lang.String getFingerPrint()

It is used to obtain the Peer fingerprint information.

**Returns:**

It is the Peer fingerprint information.

**Since:**

API level 0 (SDK 5.0.0.301)

## getPkgName

public java.lang.String getPkgName()

It is used to obtain the Peer package name.

**Returns:**

Peer package name.

**Since:**

API level 0 (SDK 5.0.0.301)
