<!--
  Title: HiWearMessage
  Catalog: connectivity-References
  Document ID: hiwearmessage-0000001059835462
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/hiwearmessage-0000001059835462
-->
# HiWearMessage

java.lang.Object

|---com.huawei.watch.kit.hiwear.p2p.HiWearMessage

```
public class HiWearMessage
extends java.lang.Object
```

It is the message object sent to the phone.

It is used to encapsulate messages or files sent to the phone.

#### Nested Class Summary

| Modifier and Type | Class and Description |
| --- | --- |
| static class | [HiWearMessage.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353) Indicates the internal building class of Message. |

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static int | [MESSAGE_TYPE_DATA](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462#EN-US_TOPIC_0000001873951298__MESSAGE_TYPE_DATA) Indicates the data of the byte type. |
| static int | [MESSAGE_TYPE_FILE](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462#EN-US_TOPIC_0000001873951298__MESSAGE_TYPE_FILE) Indicates the file type. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| byte[] | [getData](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462#EN-US_TOPIC_0000001873951298__getData--)() Obtains the byte data type. |
| java.lang.String | [getDescription](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462#EN-US_TOPIC_0000001873951298__getDescription--)() Obtains the message description. |
| java.io.File | [getFile](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462#EN-US_TOPIC_0000001873951298__getFile--)() Obtains file data. |
| int | [getType](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462#EN-US_TOPIC_0000001873951298__getType--)() Obtains the message type. |
   
| Methods inherited from class java.lang.Object |
| --- |
| clone, equals, finalize, getClass, hashCode, notify, notifyAll, toString, wait, wait, wait |

#### Field Detail

## MESSAGE_TYPE_DATA

public static final int MESSAGE_TYPE_DATA

It indicates the byte data type.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001051685763#EN-US_TOPIC_0000001920110337__p668843196111755)

## MESSAGE_TYPE_FILE

public static final int MESSAGE_TYPE_FILE

It indicates the file type.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001051685763#EN-US_TOPIC_0000001920110337__p1954869889111755)

#### Method Detail

## getData

public byte[] getData()

It obtains byte data type.

**Returns:**

Byte message type.

## getFile

public java.io.File getFile()

It obtains file data.

**Returns:**

File data

## getDescription

public java.lang.String getDescription()

It obtains the message description.

**Returns:**

Message description.

## getType

public int getType()

It obtains the message type.

**Returns:**

Message type.
