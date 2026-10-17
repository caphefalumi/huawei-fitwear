<!--
  Title: ActivityRecordInsertOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: ario_builder-0000001050093071-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/ario_builder-0000001050093071-V5
-->
# ActivityRecordInsertOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for **ActivityRecordInsertOptions**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053208312__section1707425339)() Constructor, which is used to create an **ActivityRecordInsertOptions.Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| ActivityRecordInsertOptions.Builder | [addPolymerizedSamplePoint](#EN-US_TOPIC_0000001053208312__section1661574755110)(SamplePoint samplePoint) Inserts a grouped sampling point into the request parameter. |
| ActivityRecordInsertOptions.Builder | [addSampleSet](#EN-US_TOPIC_0000001053208312__section13621204795110)(SampleSet sampleSet) Inserts a sampling dataset into the request parameter. |
| ActivityRecordInsertOptions | [build](#EN-US_TOPIC_0000001053208312__section72145516594)() Completes the building and returns the instance. |
| ActivityRecordInsertOptions.Builder | [setActivityRecord](#EN-US_TOPIC_0000001053208312__section19626154765116)(ActivityRecord activityRecord) Sets the activity record for the request. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Constructor, which is used to create an **ActivityRecordInsertOptions.Builder** object. |

#### Public Methods

## addPolymerizedSamplePoint(SamplePoint samplePoint)

| Method |
| --- |
| public ActivityRecordInsertOptions.Builder addPolymerizedSamplePoint(SamplePoint samplePoint) Inserts a grouped sampling point into the request parameter. |

**Parameters**

| Name | Description |
| --- | --- |
| samplePoint | Grouped sampling point to be inserted. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordInsertOptions.Builder | Builder. |

## addSampleSet(SampleSet sampleSet)

| Method |
| --- |
| public ActivityRecordInsertOptions.Builder addSampleSet(SampleSet sampleSet) Inserts a sampling dataset into the request parameter. |

**Parameters**

| Name | Description |
| --- | --- |
| sampleSet | Sampling dataset to be inserted. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordInsertOptions.Builder | Builder. |

## build()

| Method |
| --- |
| public ActivityRecordInsertOptions build() Completes the building and returns the instance. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordInsertOptions | **ActivityRecordInsertOptions** object. |

## setActivityRecord(ActivityRecord activityRecord)

| Method |
| --- |
| public ActivityRecordInsertOptions.Builder setActivityRecord(ActivityRecord activityRecord) Sets the activity record for the request. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecord | Object of the activityRecord. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordInsertOptions.Builder | Builder for **ActivityRecordInsertOptions**. |
