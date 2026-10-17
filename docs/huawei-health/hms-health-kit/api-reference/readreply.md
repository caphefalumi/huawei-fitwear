<!--
  Title: ReadReply
  Catalog: HMSCore-References-V5
  Document ID: readreply-0000001050093471-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/readreply-0000001050093471-V5
-->
# ReadReply

| Class Info |
| --- |
| public class ReadReply extends Reply<ReadDetailResult> Data reading response class. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [ReadReply](#EN-US_TOPIC_0000001053847038__section56061246172716)() Constructor for **ReadReply**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| List<Group> | [getGroups](#EN-US_TOPIC_0000001053847038__section98006118419)() Returns all data groups. |
| SampleSet | [getSampleSet](#EN-US_TOPIC_0000001053847038__section245417341437)(DataCollector dataCollector) Returns the corresponding sampling dataset of the specified data collector. |
| SampleSet | [getSampleSet](#EN-US_TOPIC_0000001053847038__section11608154617274)(DataType dataType) Returns the corresponding sampling dataset of the specified data type. |
| List<SampleSet> | [getSampleSets](#EN-US_TOPIC_0000001053847038__section106162046102710)() Returns all sampling datasets. |
| Status | [getStatus](#EN-US_TOPIC_0000001053847038__section462016463276)() Returns the status information of the **ReadReply** object. |

#### Public Constructors

## ReadReply()

| Constructor |
| --- |
| public ReadReply() Constructor for **ReadReply**. |

#### Public Methods

## getGroups()

| Method |
| --- |
| public List<Group> getGroups() Returns all data groups. |

**Return****s**

| Type | Description |
| --- | --- |
| List<Group> | All data groups. |

## getSampleSet(DataCollector dataCollector)

| Method |
| --- |
| public SampleSet getSampleSet(DataCollector dataCollector) Returns the corresponding sampling dataset of the specified data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector for which the sampling dataset is to be obtained. |

**Return****s**

| Type | Description |
| --- | --- |
| SampleSet | Corresponding sampling dataset of the specified data collector. |

## getSampleSet(DataType dataType)

| Method |
| --- |
| public SampleSet getSampleSet(DataType dataType) Returns the corresponding sampling dataset of the specified data type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type for which the sampling dataset is to be obtained. |

**Return****s**

| Type | Description |
| --- | --- |
| SampleSet | Corresponding sampling dataset of the specified data type. |

## getSampleSets()

| Method |
| --- |
| public List<SampleSet> getSampleSets() Returns all sampling datasets. |

**Return****s**

| Type | Description |
| --- | --- |
| List<SampleSet> | Returns all sampling datasets. |

## getStatus()

| Method |
| --- |
| public Status getStatus() Returns the status information of the **ReadReply** object. |

**Return****s**

| Type | Description |
| --- | --- |
| Status | Status information of the **ReadReply** object, such as **Status.SUCCESS** or **Status.FAILURE**. |
