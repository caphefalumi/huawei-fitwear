<!--
  Title: Message.Builder
  Catalog: connectivity-References
  Document ID: message_builder-0000001059850659
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/message_builder-0000001059850659
-->
# Message.Builder

| java.lang.Object \|---com.huawei.wearengine.p2p.Message.Builder 
```
public static class Message.Builder
extends java.lang.Object
```
 |
| --- |

It is the building class in **Message**.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) | [build](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659#EN-US_TOPIC_0000001920110429__build--)() Indicates the builder for **Message**. |
| [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) | [setDescription](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659#EN-US_TOPIC_0000001920110429__setDescription-java_lang_String-)(java.lang.String description) Sets description. |
| [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) | [setPayload](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659#EN-US_TOPIC_0000001920110429__setPayload-byte:A-)(byte[] sourceData) Sets the data to be transmitted. |
| [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) | [setPayload](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659#EN-US_TOPIC_0000001920110429__setPayload-java_io_File-)(java.io.File sourceFile) Sets the file to be transferred. |

#### Constructor Detail

## Builder

public Builder()

**Since:**

API level 0 (SDK 5.0.0.301)

#### Method Detail

## setPayload

public [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) setPayload(byte[] sourceData)

It is used to set the data to be transmitted.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| sourceData | Data to be transmitted. |

**Returns:**

Built object in **Message**.

**Since:**

API level 0 (SDK 5.0.0.301)

## setPayload

public [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) setPayload(java.io.File sourceFile)

It is used to set the files to be transferred.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| sourceFile | File to be transferred. |

**Returns:**

Built object in **Message**.

**Since:**

API level 0 (SDK 5.0.0.301)

## setDescription

public [Message.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/message_builder-0000001059850659) setDescription(java.lang.String description)

It is used to set the description of a file.

This API takes effect only when a file is being sent and does not need to be called when a message is being sent. Even if **Description** has been set for sending a message, the value of Description cannot be obtained using **getDescription** when the message is being sent.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| description | Description to be set. |

**Returns:**

Built object in **Message**.

**Since:**

API level 0 (SDK 5.0.0.301)

## build

public [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) build()

It indicates the builder for **Message**.

**Returns:**

Message

**Since:**

API level 0 (SDK 5.0.0.301)
