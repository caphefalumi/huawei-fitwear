<!--
  Title: HiHealthOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: hihealthoptions_builder-0000001050091503-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthoptions_builder-0000001050091503-V5
-->
# HiHealthOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for **HiHealthOptions**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| final HiHealthOptions.Builder | [addDataType](#EN-US_TOPIC_0000001052927055__section134958386811)(DataType datatype) Adds a data type. |
| final HiHealthOptions.Builder | [addDataType](#EN-US_TOPIC_0000001052927055__section1149863810813)(DataType datatype, int accessType) Adds a data type and read/write permissions for it. |
| final HiHealthOptions | [build](#EN-US_TOPIC_0000001052927055__section3501638080)() Completes the building and returns the instance. |

#### Public Methods

## addDataType(DataType datatype)

| Method |
| --- |
| public final HiHealthOptions.Builder addDataType(DataType datatype) Adds a data type. |

**Parameters**

| Name | Description |
| --- | --- |
| datatype | Data type that you need to access. |

**Return****s**

| Type | Description |
| --- | --- |
| HiHealthOptions.Builder | **HiHealthOptions.Builder** object. |

## addDataType(DataType datatype, int accessType)

| Method |
| --- |
| public final HiHealthOptions.Builder addDataType(DataType datatype, int accessType) Adds the data type and access type. |

**Parameters**

| Name | Description |
| --- | --- |
| datatype | Data type that you need to access. |
| accessType | Access type. |

**Return****s**

| Type | Description |
| --- | --- |
| HiHealthOptions.Builder | **HiHealthOptions.Builder** object. |

## build()

| Method |
| --- |
| public final HiHealthOptions build() Completes the building and returns the instance. |

**Return****s**

| Type | Description |
| --- | --- |
| HiHealthOptions | **HiHealthOptions** instance. |
