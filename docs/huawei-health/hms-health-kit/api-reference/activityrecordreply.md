<!--
  Title: ActivityRecordReply
  Catalog: HMSCore-References-V5
  Document ID: activityrecordreply-0000001050093245-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecordreply-0000001050093245-V5
-->
# ActivityRecordReply

| Class Info |
| --- |
| public class ActivityRecordReply extends Reply<ActivityRecordResult> Response class for reading the **ActivityRecord** result. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [ActivityRecordReply](#EN-US_TOPIC_0000001053208318__section123551513142512)() Constructor for **ActivityRecordReply**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| List<ActivityRecord> | [getActivityRecords](#EN-US_TOPIC_0000001053208318__section435761318257)() Returns all activity records found. |
| List<SampleSet> | [getSampleSet](#EN-US_TOPIC_0000001053208318__section49823412013)(ActivityRecord activityRecord) Returns the sampling dataset of the specified activity record. |
| List<SampleSet> | [getSampleSet](#EN-US_TOPIC_0000001053208318__section3359181392517)(ActivityRecord activityRecord, DataType dataType) Returns all sampling datasets of the specified activity record and data type. |
| Status | [getStatus](#EN-US_TOPIC_0000001053208318__section163651913192510)() Returns the status information of the **ActivityRecordReply** object. |

#### Public Constructors

## ActivityRecordReply()

| Constructor |
| --- |
| public ActivityRecordReply() Constructor for **ActivityRecordReply**. |

#### Public Methods

## getActivityRecords()

| Method |
| --- |
| public List<ActivityRecord> getActivityRecords() Returns all activity records found. |

**Return****s**

| Type | Description |
| --- | --- |
| List<ActivityRecord> | All activity records. |

## getSampleSet(ActivityRecord activityRecord)

| Method |
| --- |
| public List<SampleSet> getSampleSet(ActivityRecord activityRecord) Returns the sampling dataset of the specified activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecord | Activity record. |

**Returns**

| Type | Description |
| --- | --- |
| List<SampleSet> | Returns the sampling dataset of the specified activity record. |

## getSampleSet(ActivityRecord activityRecord, DataType dataType)

| Method |
| --- |
| public List<SampleSet> getSampleSet(ActivityRecord activityRecord, DataType dataType) Returns all sampling datasets of the specified activity record and data type. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecord | Activity record. |
| dataType | Data type. |

**Return****s**

| Type | Description |
| --- | --- |
| List<SampleSet> | Sampling datasets of the specified activity record and data type. |

## getStatus()

| Method |
| --- |
| public Status getStatus() Returns the status information of the **ActivityRecordReply** object. |

**Return****s**

| Type | Description |
| --- | --- |
| Status | Status information of the **ActivityRecordReply** object, such as **Status.SUCCESS** or **Status.FAILURE**. |
