<!--
  Title: Message
  Catalog: connectivity-References
  Document ID: message-0000001059781033
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/message-0000001059781033
-->
# Message

| java.lang.Object \|---com.huawei.wearengine.p2p.Message 
```
public class Message
extends java.lang.Object
```
 |
| --- |

It indicates the message object that communicates with the device.

#### Nested Class Summary

| Modifier and Type | Class and Description |
| --- | --- |
| static class | [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) Building class in Message. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| byte[] | [getData](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033#EN-US_TOPIC_0000001874111226__getData--)() Obtains Message data. |
| java.lang.String | [getDescription](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033#EN-US_TOPIC_0000001874111226__getDescription--)() Obtains the Message description. |
| java.io.File | [getFile](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033#EN-US_TOPIC_0000001874111226__getFile--)() Obtains the Message file. |
| int | [getType](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033#EN-US_TOPIC_0000001874111226__getType--)() Obtains the Message type. |

#### Method Detail

## getData

public byte[] getData()

It is used to obtain the Message data.

**Returns:**

Message data

**Since:**

API level 0 (SDK 5.0.0.301)

## getFile

public java.io.File getFile()

It is used to obtain the Message file.

**Returns:**

Message file

**Since:**

API level 0 (SDK 5.0.0.301)

## getDescription

public java.lang.String getDescription()

It is used to obtain the Message description.

**Returns:**

Message description

**Since:**

API level 0 (SDK 5.0.0.301)

## getType

public int getType()

It is used to obtain the message type.

**Returns:**

Message type. **0**: The default type. **1**: Data type. **2**: File type.

**Since:**

API level 0 (SDK 5.0.0.301)
