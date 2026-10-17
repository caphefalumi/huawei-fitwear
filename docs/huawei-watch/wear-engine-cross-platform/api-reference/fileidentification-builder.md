<!--
  Title: FileIdentification.Builder
  Catalog: connectivity-References
  Document ID: fileidentification_builder-0000001093318165
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/fileidentification_builder-0000001093318165
-->
# FileIdentification.Builder

| java.lang.Object \|---com.huawei.wearengine.p2p.FileIdentification.Builder 
```
public static class FileIdentification.Builder
extends java.lang.Object
```
 |
| --- |

It is the internal building class of FileIdentification.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| FileIdentification | [Builder](#section4353244151710)() FileIdentification constructor. |
| FileIdentification.Builder | [setDescription](#section142839448193)(java.lang.String description) Sets the description. |
| FileIdentification.Builder | [setFile](#section122214284710)(File file) Sets the file whose transfer needs to be canceled. |

####

## Builder

public Builder()

**Since:**

API level 5 (SDK 5.0.1.301)

#### Method Detail

## setFile

public FileIdentification.Builder setFile(File file)

It is used to set the file whose transfer needs to be canceled.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| file | File whose transfer needs to be canceled. |

**Returns:**

Object built in FileIdentification.

**Since:**

API level 5 (SDK 5.0.1.301)

#### setDescription

public FileIdentification.Builder setDescription(java.lang.String description)

It is used to set the description of a file.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| description | Description of the file whose transfer needs to be canceled. |

**Returns:**

Object built in FileIdentification.

**Since:**

API level 5 (SDK 5.0.1.301)
