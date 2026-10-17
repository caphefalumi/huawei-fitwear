<!--
  Title: SampleSet.Builder
  Catalog: HMSCore-References-V5
  Document ID: sampleset_builder-0000001050162568-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sampleset_builder-0000001050162568-V5
-->
# SampleSet.Builder

| Class Info |
| --- |
| public static class Builder Builder for SampleSet. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053048312__section5364218599)(DataCollector dataCollector) Constructor for the builder. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| Builder | [addSample](#EN-US_TOPIC_0000001053048312__section18634215336)(SamplePoint samplePoint) Adds a sampling point to the sampling dataset. |
| Builder | [addSampleList](#EN-US_TOPIC_0000001053048312__section51064214335)(Iterable<SamplePoint> samplePoints) Adds a list of sampling points to the sampling dataset. |
| SampleSet | [build](#EN-US_TOPIC_0000001053048312__section15141142183319)() Builds a sampling dataset. |

#### Public Constructors

## Builder(DataCollector dataCollector)

| Constructor |
| --- |
| public Builder(DataCollector dataCollector) Constructor for the builder. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector. |

#### Public Methods

## addSample(SamplePoint samplePoint)

| Method |
| --- |
| public Builder addSample(SamplePoint samplePoint) Adds a sampling point to the sampling dataset. |

**Parameters**

| Name | Description |
| --- | --- |
| samplePoint | Sampling point. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SampleSet.Builder** object. |

## addSampleList(Iterable<SamplePoint> samplePoints)

| Method |
| --- |
| public Builder addSampleList(Iterable<SamplePoint> samplePoints) Adds a list of sampling points to the sampling dataset. |

**Parameters**

| Name | Description |
| --- | --- |
| samplePoints | Iterative sampling dataset. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | **SampleSet.Builder** object. |

## build()

| Method |
| --- |
| public SampleSet build() Builds a sampling dataset. |

**Returns**

| Type | Description |
| --- | --- |
| SampleSet | Sampling dataset. |
