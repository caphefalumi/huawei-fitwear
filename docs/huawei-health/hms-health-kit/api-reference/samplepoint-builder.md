<!--
  Title: SamplePoint.Builder
  Catalog: HMSCore-References-V5
  Document ID: samplepoint_builder-0000001050162562-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/samplepoint_builder-0000001050162562-V5
-->
# SamplePoint.Builder

| Class Info |
| --- |
| public static class Builder Builder for **SamplePoint**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053248367__section206819581424)(DataCollector dataCollector) Creates a **Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| SamplePoint | [build](#EN-US_TOPIC_0000001053248367__section199891654175317)() Generates and creates a sampling point. |
| Builder | [setActivityField](#EN-US_TOPIC_0000001053248367__section17940102117338)(Field field, String activity) Sets the activity type attribute value. |
| Builder | [setFieldValue](#EN-US_TOPIC_0000001053248367__section1758314193810)(Field field, double val) Sets the double-precision floating-point attribute value of a sampling point. |
| Builder | [setFieldValue](#EN-US_TOPIC_0000001053248367__section7733527578)(Field field, float val) Sets the float attribute value of a sampling point. |
| Builder | [setFieldValue](#EN-US_TOPIC_0000001053248367__section17327731087)(Field field, long val) Sets the long integer attribute value of a sampling point. |
| Builder | [setFieldValue](#EN-US_TOPIC_0000001053248367__section294452143318)(Field field, int val) Sets the integer attribute value of a sampling point. |
| Builder | [setFieldValue](#EN-US_TOPIC_0000001053248367__section11517132415811)(Field field, Map<String, Float> mapVal) Sets the mapped attribute value of a sampling point. |
| Builder | [setFieldValue](#EN-US_TOPIC_0000001053248367__section6953621133316)(Field field, String val) Sets the string attribute value of a sampling point. |
| Builder | [setId](#EN-US_TOPIC_0000001053248367__section41551641298)(long id) Sets the ID of the sampling point. |
| Builder | [setRawDataCollector](#EN-US_TOPIC_0000001053248367__section1736052431316)(DataCollector collector) Sets the raw data collector. |
| Builder | [setSamplingTime](#EN-US_TOPIC_0000001053248367__section396814213334)(long sampleTime, TimeUnit timeUnit) Sets the sampling timestamp of instantaneous data. |
| Builder | [setTimeInterval](#EN-US_TOPIC_0000001053248367__section99722218330)(long start, long end, TimeUnit timeUnit) Sets the sampling timestamp of data within an interval. |
| Builder | [setMetadata](#EN-US_TOPIC_0000001053248367__section285742222711)(String metadata) Sets the metadata. |

#### Public Constructors

## Builder(DataCollector dataCollector)

| Constructor |
| --- |
| public Builder(DataCollector dataCollector) Constructor, which is used to create a **Builder** object. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector. |

#### Public Methods

## build()

| Method |
| --- |
| public SamplePoint build() Generates and creates a sampling point. |

**Returns**

| Type | Description |
| --- | --- |
| SamplePoint | Sampling point object. |

## setActivityField(Field field, String activity)

| Method |
| --- |
| public Builder setActivityField(Field field, String activity) Sets the activity type attribute value. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |
| activity | Activity. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setFieldValue(Field field, double val)

| Method |
| --- |
| public Builder setFieldValue(Field field, double val) Sets the double-precision floating-point attribute value of a sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |
| val | Double-precision floating-point value. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setFieldValue(Field field, float val)

| Method |
| --- |
| public Builder setFieldValue(Field field, float val) Sets the float attribute value of a sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |
| val | Floating point number. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setFieldValue(Field field, long val)

| Method |
| --- |
| public Builder setFieldValue(Field field, long val) Sets the long integer attribute value of a sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |
| val | Long integer. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setFieldValue(Field field, int val)

| Method |
| --- |
| public Builder setFieldValue(Field field, int val) Sets the integer attribute value of a sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |
| val | Integer. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setFieldValue(Field field, Map<String, Float> mapVal)

| Method |
| --- |
| public Builder setFieldValue(Field field, Map<String, Float> mapVal) Sets the mapped attribute value of a sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |
| mapVal | Map. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setFieldValue(Field field, String val)

| Method |
| --- |
| public Builder setFieldValue(Field field, String val) Sets the string attribute value of a sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Data attribute. |
| val | String. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setId(long id)

| Method |
| --- |
| public Builder setId(long id) Sets the ID of the sampling point. |

**Parameters**

| Name | Description |
| --- | --- |
| id | ID of the sampling point. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setRawDataCollector(DataCollector collector)

| Method |
| --- |
| public Builder setRawDataCollector(DataCollector collector) Sets the raw data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| collector | Data collector. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setSamplingTime(long samplingTime, TimeUnit timeUnit)

| Method |
| --- |
| public Builder setSamplingTime(long samplingTime, TimeUnit timeUnit) Sets the sampling timestamp of instantaneous data. |

> **Note:** The sampling point time must be later than the UNIX timestamp corresponding to 00:00 on January 1, 2014.

**Parameters**

| Name | Description |
| --- | --- |
| samplingTime | Timestamp. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setTimeInterval(long start, long end, TimeUnit timeUnit)

| Method |
| --- |
| public Builder setTimeInterval(long start, long end, TimeUnit timeUnit) Sets the sampling timestamp of data within an interval. |

> **Note:** 1. The start time and end time must be later than the UNIX timestamp corresponding to 00:00 on January 1, 2014. 2. The end time must be later than the start time.

**Parameters**

| Name | Description |
| --- | --- |
| start | Start time. |
| end | End time. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |

## setMetadata(String metadata)

| Method |
| --- |
| public Builder setMetadata(String metadata) Sets the metadata. |

**Parameters**

| Name | Description |
| --- | --- |
| metadata | Metadata, which can be **null**, an empty string, or a string of 1 to 10000 characters. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SamplePoint.Builder** object. |
