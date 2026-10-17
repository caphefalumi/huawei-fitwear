<!--
  Title: SamplePoint
  Catalog: HMSCore-References-V5
  Document ID: samplepoint_class-0000001050164515-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/samplepoint_class-0000001050164515-V5
-->
# SamplePoint

| Class Info |
| --- |
| public class SamplePoint implements Parcelable Sampling point class, which presents the sampled data of a specific type collected by a specific data collector at a given time or within a time range. It stores the values of each dimension of the data type at the given time (or within the time range) and the start time and end time of the sampling operation. The sampling modes of sampling points are classified into instantaneous sampling and continuous sampling based on the definition of data types. When setting the sampling point time, you are advised to call **setSamplingTime()** for instantaneous sampling data and **setTimeInterval()** for continuous sampling data (make sure to set a valid time duration). The **setSamplingTime()** API cannot be used when creating the continuous sampling point. Otherwise, the creation will fail. This API can be used to update the end time of a created continuous sampling point. After the API is called, only the end time will be updated. |

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [SamplePoint.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/samplepoint_builder-0000001050162562-V5) Builder for **SamplePoint**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| static Builder | [builder](#EN-US_TOPIC_0000001053367048__section2114101924214)(DataCollector dataCollector) Constructs a builder. |
| static SamplePoint | [create](#EN-US_TOPIC_0000001053367048__section127541304455)(DataCollector dataCollector) Builds a sampling point. |
| final void | [checkIntervalValidity](#EN-US_TOPIC_0000001053367048__section1901147184711)() Checks the duration validity. |
| DataCollector | [getDataCollector](#EN-US_TOPIC_0000001053367048__section1536872884113)() Obtains the data collector of the sampling point. |
| DataType | [getDataType](#EN-US_TOPIC_0000001053367048__section1498318218331)() Obtains the data type of the sampling point. |
| long | [getEndTime](#EN-US_TOPIC_0000001053367048__section1754919498423)(TimeUnit timeUnit) Obtains the end timestamp of the sampling point. |
| Value | [getFieldValue](#EN-US_TOPIC_0000001053367048__section4441181104413)(Field field) Obtains the attribute value. |
| Map<String, Value> | [getFieldValues](#EN-US_TOPIC_0000001053367048__section1739419510440)() Obtains the values of all attributes. |
| long | [getId](#EN-US_TOPIC_0000001053367048__section1115713558466)() Obtains the ID of the sampling point. |
| long | [getInsertionTime](#EN-US_TOPIC_0000001053367048__section718912415473)(TimeUnit timeUnit) Obtains the insertion time. |
| final DataCollector | [getNullableRawCollector](#EN-US_TOPIC_0000001053367048__section114951711204820)() Obtains the raw data collector of the sampling point. If it is not set, null will be returned. |
| final DataCollector | [getRawDataCollector](#EN-US_TOPIC_0000001053367048__section16506253205119)() Obtains the raw data collector of the sampling point. |
| long | [getSamplingTime](#EN-US_TOPIC_0000001053367048__section72162115318)(TimeUnit timeUnit) Obtains the timestamp of the sampling point. |
| long | [getStartTime](#EN-US_TOPIC_0000001053367048__section68413952016)(TimeUnit timeUnit) Obtains the start timestamp of the sampling point. |
| boolean | [isMerged](#EN-US_TOPIC_0000001053367048__section16021139334)() Indicates whether data is aggregated. |
| void | [setId](#EN-US_TOPIC_0000001053367048__section14661115368)(long id) Sets the ID of the sampling point. |
| void | [setInsertionTime](#EN-US_TOPIC_0000001053367048__section617111183712)(long insertTime, TimeUnit timeUnit) Sets the data insertion time. |
| final SamplePoint | [setSamplingTime](#EN-US_TOPIC_0000001053367048__section1945814166435)(long sampleTime, TimeUnit timeUnit) Sets the sampling timestamp of instantaneous data. |
| final SamplePoint | [setTimeInterval](#EN-US_TOPIC_0000001053367048__section21152263313)(long start, long end, TimeUnit timeUnit) Sets the sampling timestamp of data within an interval. |
| String | [getMetadata](#EN-US_TOPIC_0000001053367048__section15738181917273)() Obtains the metadata from **SamplePoint**. |
| void | [setMetadata](#EN-US_TOPIC_0000001053367048__section285742222711)(String metadata) Obtains the metadata from **SamplePoint**. |

#### Public Methods

## builder(DataCollector dataCollector)

| Method |
| --- |
| public static Builder builder(DataCollector dataCollector) Creates an internal builder object for the data sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector. |

**Returns**

| Type | Description |
| --- | --- |
| SamplePoint.Builder | Internal builder object for the data sampling point. |

## create(DataCollector dataCollector)

| Method |
| --- |
| public SamplePoint create(DataCollector dataCollector) Builds a sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector. |

**Returns**

| Type | Description |
| --- | --- |
| SamplePoint | Sampling point. |

## checkIntervalValidity()

| Method |
| --- |
| public void checkIntervalValidity() Rules for verifying the interval validity: • The start time and end time must not be 0. • The start time must not be later than the end time. • The time span must not exceed 3 days. • For the continuous data types, the start time must be earlier than the end time. • The time span for collecting total or aggregation data must not exceed 366 days. • For a data type that can't be identified (customized data type), conditions 1, 2, and 3 must be met. |

## getDataCollector()

| Method |
| --- |
| public DataCollector getDataCollector() Obtains the data collector of the sampling point. |

**Returns**

| Type | Description |
| --- | --- |
| DataCollector | Data collector. |

## getDataType()

| Method |
| --- |
| public DataType getDataType() Obtains the data type of the sampling point. |

**Returns**

| Type | Description |
| --- | --- |
| DataType | Data type. |

## getEndTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getEndTime(TimeUnit timeUnit) Obtains the end timestamp of the sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | End time. |

## getFieldValue(Field field)

| Method |
| --- |
| public Value getFieldValue(Field field) Obtains the attribute value. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |

**Returns**

| Type | Description |
| --- | --- |
| Value | Attribute value. |

## getFieldValues()

| Method |
| --- |
| public Map<String, Value> getFieldValues() Obtains the values of all attributes. |

**Returns**

| Type | Description |
| --- | --- |
| Map<String, Value> | Values of all attributes. |

## getId()

| Method |
| --- |
| public long getId() Obtains the ID of the sampling point. |

**Returns**

| Type | Description |
| --- | --- |
| long | ID of the sampling point. |

## getInsertionTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getInsertionTime(TimeUnit timeUnit) Obtains the insertion time. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Insertion time. |

## getNullableRawCollector()

| Method |
| --- |
| public DataCollector getNullableRawCollector() Obtains the raw data collector of the sampling point. If it is not set, null will be returned. |

**Returns**

| Type | Description |
| --- | --- |
| DataCollector | Data collector. |

## getRawDataCollector()

| Method |
| --- |
| public DataCollector getRawDataCollector() Obtains the raw data collector of the sampling point. |

**Returns**

| Type | Description |
| --- | --- |
| DataCollector | Data collector. |

## getSamplingTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getSamplingTime(TimeUnit timeUnit) Obtains the timestamp of the sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Timestamp. |

## getStartTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getStartTime(TimeUnit timeUnit) Obtains the start timestamp of the sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Start time. |

## isMerged()

| Method |
| --- |
| public boolean isMerged() Indicates whether data is aggregated. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether data is aggregated. |

## setId()

| Method |
| --- |
| public void setId(long id) Sets the ID of the sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| id | ID of the sampling point. |

## setInsertionTime(long insertTime, TimeUnit timeUnit)

| Method |
| --- |
| public void setInsertionTime(long insertTime, TimeUnit timeUnit) Sets the data insertion time. |

**Parameters**

| Name | Description |
| --- | --- |
| insertTime | Data insertion time. |
| timeUnit | Time unit. |

## setSamplingTime(long sampleTime, TimeUnit timeUnit)

| Method |
| --- |
| public final SamplePoint setSamplingTime(long sampleTime, TimeUnit timeUnit) Sets the sampling timestamp of instantaneous data. |

**Parameters**

| Name | Description |
| --- | --- |
| sampleTime | Timestamp. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| SamplePoint | Sampling point. |

## setTimeInterval(long start, long end, TimeUnit timeUnit)

| Method |
| --- |
| public final SamplePoint setTimeInterval(long start, long end, TimeUnit timeUnit) Sets the sampling timestamp of data within an interval. |

**Parameters**

| Name | Description |
| --- | --- |
| start | Start time. |
| end | End time. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| SamplePoint | Sampling point. |

## getMetadata()

| Method |
| --- |
| public String getMetadata() Obtains the metadata from **SamplePoint**. |

**Returns**

| Type | Description |
| --- | --- |
| String | Metadata. |

## setMetadata(String metadata)

| Method |
| --- |
| public void setMetadata(String metadata) Sets the metadata in **SamplePoint**. |

**Parameters**

| Name | Description |
| --- | --- |
| metadata | Metadata, which can be **null**, an empty string, or a string of 1 to 10000 characters. |
