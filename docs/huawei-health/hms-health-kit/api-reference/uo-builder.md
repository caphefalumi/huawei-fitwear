<!--
  Title: UpdateOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: uo_builder-0000001050093233-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/uo_builder-0000001050093233-V5
-->
# UpdateOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for **UpdateOptions**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053727043__section1161718529259)() Constructor, which is used to create an **UpdateOptions.Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| UpdateOptions | [build](#EN-US_TOPIC_0000001053727043__section341265655519)() Completes the building and returns the instance. |
| UpdateOptions.Builder | [setSampleSet](#EN-US_TOPIC_0000001053727043__section13665104635718)(SampleSet sampleSet) Sets the sampling dataset for updating data. |
| UpdateOptions.Builder | [setTimeInterval](#EN-US_TOPIC_0000001053727043__section1921733155613)(long startTime, long endTime, TimeUnit timeUnit) Sets the time range for data update. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Constructor, which is used to create an **UpdateOptions.Builder** object. |

#### Public Methods

## build()

| Method |
| --- |
| public UpdateOptions build() Instance. |

**Return****s**

| Type | Description |
| --- | --- |
| UpdateOptions | Completes the building and returns the instance. |

## setSampleSet(SampleSet sampleSet)

| Method |
| --- |
| public UpdateOptions.Builder setSampleSet(SampleSet sampleSet) |
| Sets the sampling dataset for updating data. |

**Parameters**

| Name | Description |
| --- | --- |
| sampleSet | Sampling dataset for updating data. |

**Return****s**

| Type | Description |
| --- | --- |
| UpdateOptions.Builder | **UpdateOptions.Builder** object. |

## setTimeInterval(long startTime, long endTime, TimeUnit timeUnit)

| Method |
| --- |
| public UpdateOptions.Builder setTimeInterval(long startTime, long endTime, TimeUnit timeUnit) Sets the duration for updating. The start time must be greater than 0, and the end time must not be earlier than the start time. |

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
| UpdateOptions.Builder | **UpdateOptions.Builder** object. |
