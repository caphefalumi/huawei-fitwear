<!--
  Title: Peer.Builder
  Catalog: connectivity-References
  Document ID: peer_builder-0000001059290641
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/peer_builder-0000001059290641
-->
# Peer.Builder

| java.lang.Object \|---com.huawei.wearengine.p2p.Peer.Builder 
```
public static class Peer.Builder
extends java.lang.Object
```
 |
| --- |

It is the internal building class in Peer.

#### Constructor Summary

| Constructor and Description |
| --- |
| [Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641#EN-US_TOPIC_0000001873951334__Builder--)() |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| [Peer](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922) | [build](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641#EN-US_TOPIC_0000001873951334__build--)() Indicates the **Peer** constructor. |
| [Peer.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641) | [setDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641#EN-US_TOPIC_0000001873951334__setDevice-com_huawei_wearengine_device_Device-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device) Sets a device object. |
| [Peer.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641) | [setFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641#EN-US_TOPIC_0000001873951334__setFingerPrint-java_lang_String-)(java.lang.String fingerPrint) Sets fingerprint information. |
| [Peer.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641) | [setPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641#EN-US_TOPIC_0000001873951334__setPkgName-java_lang_String-)(java.lang.String pkgName) Sets package name information. |

#### Constructor Detail

## Builder

public Builder()

**Since:**

API level 0 (SDK 5.0.0.301)

#### Method Detail

## setDevice

public [Peer.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641) setDevice([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device)

It is used to set a device object.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object. |

**Returns:**

Building class in Peer.

**Since:**

API level 0 (SDK 5.0.0.301)

## setFingerPrint

public [Peer.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641) setFingerPrint(java.lang.String fingerPrint)

It is used to set fingerprint information.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| fingerPrint | Fingerprint information. |

**Returns:**

Building class in Peer.

**Since:**

API level 0 (SDK 5.0.0.301)

## setPkgName

public [Peer.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer_builder-0000001059290641) setPkgName(java.lang.String pkgName)

It is used to set the package name information.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| pkgName | Package name information. |

**Returns:**

Building class in Peer.

**Since:**

API level 0 (SDK 5.0.0.301)

## build

public [Peer](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922) build()

It is the **Peer** constructor.

**Returns:**

Peer object.

**Since:**

API level 0 (SDK 5.0.0.301)
