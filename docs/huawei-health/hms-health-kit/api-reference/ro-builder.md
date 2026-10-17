<!--
  Title: ReadOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: ro_builder-0000001050093179-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/ro_builder-0000001050093179-V5
-->
# ReadOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for **ReadOptions**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053248373__section1161718529259)() Default constructor, which is used to create a **ReadOptions.Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| ReadOptions | [build](#EN-US_TOPIC_0000001053248373__section156141058104619)() Completes the building and returns the instance. |
| ReadOptions.Builder | [groupByTime](#EN-US_TOPIC_0000001053248373__section93417911486)(int duration, TimeUnit timeUnit) Sets the group type to **groupByTime** and sets the duration for each group. |
| ReadOptions.Builder | [polymerize](#EN-US_TOPIC_0000001053248373__section453834554812)(DataCollector dataCollector, DataType outputDataType) Adds a new data collector to the grouped data and sets the type of the grouped data to be returned. |
| ReadOptions.Builder | [polymerize](#EN-US_TOPIC_0000001053248373__section162441425144916)(DataType inputDataType, DataType outputDataType) Adds a new data type to the grouped data and sets the type of the grouped data to be returned. |
| ReadOptions.Builder | [read](#EN-US_TOPIC_0000001053248373__section2072825054913)(DataCollector dataCollector) Adds a data collector for reading data. |
| ReadOptions.Builder | [read](#EN-US_TOPIC_0000001053248373__section20883103345015)(DataType dataType) Adds a data type for reading data. |
| ReadOptions.Builder | [setPageSize](#EN-US_TOPIC_0000001053248373__section673394205510)(int size) Sets the maximum number of pages for the paginated query results. |
| ReadOptions.Builder | [setTimeRange](#EN-US_TOPIC_0000001053248373__section265332215514)(long startTime, long endTime, TimeUnit timeUnit) Sets the time range for reading data. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Default constructor, which is used to create a **ReadOptions.Builder** object. |

#### Public Methods

## build()

| Method |
| --- |
| public ReadOptions build() Verifies the parameters, completes the build, and returns the request. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions | **ReadOptions** object. |

## groupByTime(int duration, TimeUnit timeUnit)

| Method |
| --- |
| public ReadOptions.Builder groupByTime(int duration, TimeUnit timeUnit) Sets the group type to **groupByTime** and sets the duration for each group. |

**Parameters**

| Name | Description |
| --- | --- |
| duration | Duration. |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions.Builder | **ReadOptions.Builder** object. |

## polymerize(DataCollector dataCollector, DataType outputDataType)

| Method |
| --- |
| public ReadOptions.Builder polymerize(DataCollector dataCollector, DataType outputDataType) Adds a new data collector to the grouped data and sets the type of the grouped data to be returned. |
  **Parameters** 
| Parameter name | Parameter desc |
| --- | --- |
| dataCollector | Data collector added. |
| outputDataType | Type of the grouped data to be returned. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions.Builder | **ReadOptions.Builder** object. |

## polymerize(DataType inputDataType, DataType outputDataType)

| Method |
| --- |
| public ReadOptions.Builder polymerize(DataType inputDataType, DataType outputDataType) Adds a new data type to the grouped data and sets the type of the grouped data to be returned. |

**Parameters**

| Name | Description |
| --- | --- |
| inputDataType | Type of data to be grouped. |
| outputDataType | Type of the grouped data to be returned. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions.Builder | **ReadOptions.Builder** object. |

## read(DataCollector dataCollector)

| Method |
| --- |
| public ReadOptions.Builder read(DataCollector dataCollector) Adds a data collector for reading data. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector for data reading. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions.Builder | **ReadOptions.Builder** object. |

## read(DataType dataType)

| Method |
| --- |
| public ReadOptions.Builder read(DataType dataType) Adds a data type for reading data. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type for reading data. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions.Builder | **ReadOptions.Builder** object. |

## setPageSize(int size)

| Method |
| --- |
| public ReadOptions.Builder setPageSize(int size) Sets the maximum number of pages for the paginated query results. |

**Parameters**

| Name | Description |
| --- | --- |
| size | Upper number limit. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions.Builder | **ReadOptions.Builder** object. |

## setTimeRange(long startTime, long endTime, TimeUnit timeUnit)

| Method |
| --- |
| public ReadOptions.Builder setTimeRange(long startTime, long endTime, TimeUnit timeUnit) Sets the time range for reading data in the specified time unit. |

> **Note:** 1. The start time and end time must be later than the UNIX timestamp corresponding to 00:00 on January 1, 2014. 2. The end time must be later than the start time.

**Parameters**

| Name | Description |
| --- | --- |
| startTime | Start time. |
| endTime | End time. |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| ReadOptions.Builder | **ReadOptions.Builder** object. |
