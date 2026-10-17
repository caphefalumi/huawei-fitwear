<!--
  Title: DataCollectorsOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: datacollectorsoptions_builder-0000001050434235-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectorsoptions_builder-0000001050434235-V5
-->
# DataCollectorsOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for **DataCollectorsOptions**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053367052__section1161718529259)() Default constructor, which is used to create a **DataCollectorsOptions.Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| DataCollectorsOptions | [build](#EN-US_TOPIC_0000001053367052__section7752146183716)() Completes the building and returns the instance. |
| DataCollectorsOptions.Builder | [setDataCollectorTypes](#EN-US_TOPIC_0000001053367052__section1637218324371)(int... dataCollectorTypes) Sets the type of the data collector. |
| DataCollectorsOptions.Builder | [setDataTypes](#EN-US_TOPIC_0000001053367052__section10659144695715)(DataType... dataTypes) Sets the data type. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Default constructor, which is used to create a **DataCollectorsOptions.Builder** object. |

#### Public Methods

## build()

| Method |
| --- |
| public DataCollectorsOptions build() Completes the building and returns the instance. |

**Return****s**

| Type | Description |
| --- | --- |
| DataCollectorsOptions | **DataCollectorsOptions** object. |

## setDataCollectorTypes(int... dataCollectorTypes)

| Method |
| --- |
| public DataCollectorsOptions.Builder setDataCollectorTypes(int... dataCollectorTypes) Sets the type of the data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollectorTypes | Data collectors with a variable quantity. |

**Return****s**

| Type | Description |
| --- | --- |
| DataCollectorsOptions.Builder | **DataCollectorsOptions.Builder** object. |

## setDataTypes(DataType... dataTypes)

| Method |
| --- |
| public DataCollectorsOptions.Builder setDataTypes(DataType... dataTypes) Sets the data type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataTypes | **DataType** with a variable quantity. |

**Return****s**

| Type | Description |
| --- | --- |
| DataCollectorsOptions.Builder | **DataCollectorsOptions.Builder** object. |
