<!--
  Title: SampleSet
  Catalog: HMSCore-References-V5
  Document ID: sampleset_class-0000001050164521-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sampleset_class-0000001050164521-V5
-->
# SampleSet

| Class Info |
| --- |
| public class SampleSet implements Parcelable The sampling dataset class represents the container for storing sampling points. The sampling points stored in a sampling dataset must be from the same data collector (but their raw data collectors can be different). This class is usually used to insert or read sampling data in batches. |

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [SampleSet.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sampleset_builder-0000001050162568-V5) Builder for **SampleSet**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| void | [addSample](#EN-US_TOPIC_0000001053328343__section11221242183310)(SamplePoint samplePoint) Adds a sampling point to the sampling dataset. |
| final void | [addSampleList](#EN-US_TOPIC_0000001053328343__section8252042123310)(Iterable<SamplePoint> samplePoints) Adds a list of sampling points to the sampling dataset. |
| void | [addSampleNoCheckLegality](#EN-US_TOPIC_0000001053328343__section1263121720285)(SamplePoint samplePoint) Adds a sampling point to the sampling dataset (without checking whether the sampling point is valid). |
| static Builder | [builder](#EN-US_TOPIC_0000001053328343__section09421624554)(DataCollector dataCollector) Constructor for the **SampleSet** builder. |
| static SampleSet | [create](#EN-US_TOPIC_0000001053328343__section137127151667)(DataCollector dataCollector) Creates a new sampling dataset by specifying the data collector. |
| SamplePoint | [createSamplePoint](#EN-US_TOPIC_0000001053328343__section3392148275)() Creates an empty sampling point for the data collector of the sampling dataset. |
| DataCollector | [getDataCollector](#EN-US_TOPIC_0000001053328343__section123324223313)() Obtains the data collector of the sampling dataset. |
| DataType | [getDataType](#EN-US_TOPIC_0000001053328343__section19361242193315)() Obtains the data type of the sampling dataset. |
| List<SamplePoint> | [getSamplePoints](#EN-US_TOPIC_0000001053328343__section14307102732315)() Obtains the sampling point list of the sampling dataset. |
| boolean | [isEmpty](#EN-US_TOPIC_0000001053328343__section37917228243)() Checks whether the attribute is empty. |

#### Public Methods

## addSample(SamplePoint samplePoint)

| Method |
| --- |
| public void addSample(SamplePoint samplePoint) Adds a sampling point to the sampling dataset. |

**Parameters**

| Name | Description |
| --- | --- |
| samplePoint | Sampling point. |

## addSampleList(Iterable<SamplePoint> samplePoints)

| Method |
| --- |
| public final void addSampleList(Iterable<SamplePoint> samplePoints) Adds a list of sampling points to the sampling dataset. |

**Parameters**

| Name | Description |
| --- | --- |
| samplePoints | Iterative sampling dataset. |

## addSampleNoCheckLegality(SamplePoint samplePoint)

| Method |
| --- |
| public void addSampleNoCheckLegality(SamplePoint samplePoint) Adds a sampling point to the sampling dataset (without checking whether the sampling point is valid). |

**Parameters**

| Name | Description |
| --- | --- |
| samplePoint | Sampling point. |

## builder(DataCollector dataCollector)

| Method |
| --- |
| public static Builder builder(DataCollector dataCollector) Constructor for the **SampleSet** builder. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## create(DataCollector dataCollector)

| Method |
| --- |
| public static SampleSet create(DataCollector dataCollector) Creates a new sampling dataset by specifying the data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector. |

**Returns**

| Type | Description |
| --- | --- |
| SampleSet | Sampling dataset. |

## createSamplePoint()

| Method |
| --- |
| public SamplePoint createSamplePoint() Creates an empty sampling point for the data collector of the sampling dataset. |

**Returns**

| Type | Description |
| --- | --- |
| SamplePoint | Sampling point. |

## getDataCollector()

| Method |
| --- |
| public DataCollector getDataCollector() Obtains the data collector of the sampling dataset. |

**Returns**

| Type | Description |
| --- | --- |
| DataCollector | Data collector. |

## getDataType()

| Method |
| --- |
| public DataType getDataType() Obtains the data type of the sampling dataset. |

**Returns**

| Type | Description |
| --- | --- |
| DataType | Data type. |

## getSamplePoints()

| Method |
| --- |
| public List<SamplePoint> getSamplePoints() Obtains the sampling point list in the sampling dataset. |

**Returns**

| Type | Description |
| --- | --- |
| List<SamplePoint> | List of sampling points. |

## isEmpty()

| Method |
| --- |
| public boolean isEmpty() Checks whether the sampling dataset is empty. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether the sampling dataset is empty. |
