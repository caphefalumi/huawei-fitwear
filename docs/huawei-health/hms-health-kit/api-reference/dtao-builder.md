<!--
  Title: DataTypeAddOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: dtao_builder-0000001050091164-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/dtao_builder-0000001050091164-V5
-->
# DataTypeAddOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for creating a **DataTypeAddOptions** instance. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053328347__section1161718529259)() Default constructor, which is used to create a **DataTypeAddOptions.Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| DataTypeAddOptions.Builder | [addField](#EN-US_TOPIC_0000001053328347__section19161151411536)(Field field) Adds a field to the data type to be created. |
| DataTypeAddOptions.Builder | [addField](#EN-US_TOPIC_0000001053328347__section131653143536)(String name, int format) Adds a customized field to the data type to be created. |
| DataTypeAddOptions | [build](#EN-US_TOPIC_0000001053328347__section18658104110547)() Completes the building and returns the instance. |
| DataTypeAddOptions.Builder | [setName](#EN-US_TOPIC_0000001053328347__section8536203110548)(String name) Sets the name of the data type to be created. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Default constructor, which is used to create a **DataTypeAddOptions.Builder** object. |

#### Public Methods

## addField(Field field)

| Method |
| --- |
| public DataTypeAddOptions.Builder addField(Field field) Adds a field to the data type to be created. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Field to be added. |

**Return****s**

| Type | Description |
| --- | --- |
| DataTypeAddOptions.Builder | **DataTypeAddOptions.Builder** object. |

## addField(String name, int format)

| Method |
| --- |
| public DataTypeAddOptions.Builder addField(String name, int format) Adds a customized field to the data type to be created. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name of the customized field. |
| format | Data format of the customized field. |

**Return****s**

| Type | Description |
| --- | --- |
| DataTypeAddOptions.Builder | **DataTypeAddOptions.Builder** object. |

## build()

| Method |
| --- |
| public DataTypeAddOptions build() Verifies the parameters, completes the build, and returns the instance. |

**Return****s**

| Type | Description |
| --- | --- |
| DataTypeAddOptions | **DataTypeAddOptions** object. |

## setName(String name)

| Method |
| --- |
| public DataTypeAddOptions.Builder setName(String name) Sets the name of the data type to be created. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name of the data type. |

**Return****s**

| Type | Description |
| --- | --- |
| DataTypeAddOptions.Builder | **DataTypeAddOptions.Builder** object. |
