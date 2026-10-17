<!--
  Title: HiWearMessage.Builder
  Catalog: connectivity-References
  Document ID: hiwearmessage_builder-0000001058609353
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/hiwearmessage_builder-0000001058609353
-->
# HiWearMessage.Builder

java.lang.Object

|---com.huawei.watch.kit.hiwear.p2p.HiWearMessage.Builder

```
public static class HiWearMessage.Builder
extends java.lang.Object
```

It is the Internal building class of Message.

It is used to build message objects from the wearable device to the phone.

#### Constructor Summary

| Constructor and Description |
| --- |
| [Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353#EN-US_TOPIC_0000001874111178__Builder--)() |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| [HiWearMessage](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462) | [build](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353#EN-US_TOPIC_0000001874111178__build--)() Indicates the message constructor. |
| [HiWearMessage.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353) | [setDescription](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353#EN-US_TOPIC_0000001874111178__setDescription-java_lang_String-)(java.lang.String description) Sets message description. |
| [HiWearMessage.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353) | [setPayload](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353#EN-US_TOPIC_0000001874111178__setPayload-byte:A-)(byte[] data) Sets byte data. |
| [HiWearMessage.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353) | [setPayload](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353#EN-US_TOPIC_0000001874111178__setPayload-java_io_File-)(java.io.File file) Sets file data. |
   
| Methods inherited from class java.lang.Object |
| --- |
| clone, equals, finalize, getClass, hashCode, notify, notifyAll, toString, wait, wait, wait |

#### Constructor Detail

## Builder

public Builder()

#### Method Detail

## setPayload

public [HiWearMessage.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353) setPayload(byte[] data)

It is used to set byte data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| data | Data of the byte type. |

**Returns:**

Builder object.

## setPayload

public [HiWearMessage.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353) setPayload(java.io.File file)

It is used to set file data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| file | Data of the file type. |

**Returns:**

Builder object.

## setDescription

public [HiWearMessage.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage_builder-0000001058609353) setDescription(java.lang.String description)

It is used to set the description.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| description | Description. |

**Returns:**

Builder object.

## build

public [HiWearMessage](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearmessage-0000001059835462) build()

It indicates the Message constructor.

**Returns:**

Message message.
