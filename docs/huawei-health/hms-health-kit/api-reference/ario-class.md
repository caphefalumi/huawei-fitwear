<!--
  Title: ActivityRecordInsertOptions
  Catalog: HMSCore-References-V5
  Document ID: ario_class-0000001050091110-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/ario_class-0000001050091110-V5
-->
# ActivityRecordInsertOptions

| Class Info |
| --- |
| public class ActivityRecordInsertOptions extends EnhanceParcelable Request parameter class for inserting an activity record, including the associated sampling dataset and sampling points to the platform. |
  The sample code for inserting an activity record is as follows:
```cpp
Java
ActivityRecord activityRecord = new ActivityRecord.Builder()
    .setName("AddActivityRecord")
    .setDesc("This is ActivityRecord add test!")
    .setId("MyAddActivityRecordId")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .build();
ActivityRecordInsertOptions insertOption = new ActivityRecordInsertOptions.Builder()
    .setActivityRecord(activityRecord)
    .build();
```
 
```cpp
Kotlin
val activityRecord = ActivityRecord.Builder()
    .setName("AddActivityRecord")
    .setDesc("This is ActivityRecord add test!")
    .setId("MyAddActivityRecordId")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .build()
val insertRequest = ActivityRecordInsertOptions.Builder().setActivityRecord(activityRecord).build()
```

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [ActivityRecordInsertOptions.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/ario_builder-0000001050093071-V5) Builder for **ActivityRecordInsertOptions**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| ActivityRecord | [getActivityRecord](#EN-US_TOPIC_0000001053248369__section15502141217423)() Obtains the activity record to be inserted. |
| List<SamplePoint> | [getPolymerizedSamplePoints](#EN-US_TOPIC_0000001053248369__section15171102535119)() Obtains the sampling points to be inserted. |
| List<SampleSet> | [getSampleSets](#EN-US_TOPIC_0000001053248369__section201761725145114)() Obtains the sampling datasets to be inserted. |

#### Public Methods

## getActivityRecord()

| Method |
| --- |
| public ActivityRecord getActivityRecord() Obtains the activity record to be inserted. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecord | Activity record to be inserted. |

## getPolymerizedSamplePoints()

| Method |
| --- |
| public final List<SamplePoint> getPolymerizedSamplePoints() Obtains the grouped sampling points to be inserted. |

**Return****s**

| Type | Description |
| --- | --- |
| List<SamplePoint> | List of sampling points to be inserted. |

## getSampleSets()

| Method |
| --- |
| public final List<SampleSet> getSampleSets() Obtains the sampling datasets to be inserted. |

**Return****s**

| Type | Description |
| --- | --- |
| List<SampleSet> | List of sampling datasets to be inserted. |
