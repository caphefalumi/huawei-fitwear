<!--
  Title: FileIdentification
  Catalog: connectivity-References
  Document ID: fileidentification-0000001077679542
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/fileidentification-0000001077679542
-->
# FileIdentification

| java.lang.Object \|---com.huawei.wearengine.p2p.FileIdentification 
```
public class FileIdentification
extends java.lang.Object
```
 |
| --- |

It is a file identifier object of canceling sending files.

#### Nested Class Summary

| Modifier and Type | Class and Description |
| --- | --- |
| static class | [FileIdentification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/fileidentification_builder-0000001093318165) Internal building class of FileIdentification. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| java.lang.String | [getDescription](#section237615311315)() Obtains the description. |
| java.io.File | [getFile](#EN-US_TOPIC_0000001873951346__getFile--)() Obtains the file whose transfer needs to be canceled. |

#### Method Detail

## getFile

public java.io.File getFile()

It is used to obtain the file whose transfer needs to be canceled.

**Returns:**

File whose transfer needs to be canceled.

**Since:**

API level 5 (SDK 5.0.1.301)

## getDescription

public java.lang.String getDescription()

It is used to obtain the URI description.

**Returns:**

Description.

**Since:**

API level 5 (SDK 5.0.1.301)
