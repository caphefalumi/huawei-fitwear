<!--
  Title: ActivityRecordReadOptions
  Catalog: HMSCore-References-V5
  Document ID: arro_class-0000001050093077-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/arro_class-0000001050093077-V5
-->
# ActivityRecordReadOptions

| Class Info |
| --- |
| public class ActivityRecordReadOptions extends EnhanceParcelable Request parameter class for reading activity records from the HUAWEI Health platform. |
  The sample code for reading activity records is as follows:
```cpp
Java
ActivityRecordReadOptions readOption = new ActivityRecordReadOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .readActivityRecordsFromAllApps()
    .read(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .build();
```
 
```cpp
Kotlin
val readRequest = ActivityRecordReadOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .readActivityRecordsFromAllApps()
    .read(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .build()
```

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [ActivityRecordReadOptions.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/arro_builder-0000001050091134-V5) Builder for **ActivityRecordReadOptions**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| String | [getActivityRecordId](#EN-US_TOPIC_0000001053048314__section2058818182717)() Obtains the ID of the activity record requesting the data. |
| String | [getActivityRecordName](#EN-US_TOPIC_0000001053048314__section196913485717)() Obtains the name of the activity record for requesting the data. |
| List<DataCollector> | [getDataCollectors](#EN-US_TOPIC_0000001053048314__section11663998521)() Obtains the data collectors to be read in the current request. |
| List<DataType> | [getDataTypes](#EN-US_TOPIC_0000001053048314__section18667189125210)() Obtains the data types to be read in the current request. |
| long | [getEndTime](#EN-US_TOPIC_0000001053048314__section1367013914520)(TimeUnit timeUnit) Obtains the end time of the data to be requested. |
| List<String> | [getRemoveApplications](#EN-US_TOPIC_0000001053048314__section1067419918527)() Obtains the package names of all removed apps. |
| long | [getStartTime](#EN-US_TOPIC_0000001053048314__section166859965213)(TimeUnit timeUnit) Obtains the start time of the data to be requested. |
| boolean | [isAllAppsSelected](#EN-US_TOPIC_0000001053048314__section6762261918)() Indicates whether the data to be read includes the activity records of all apps. |

#### Public Methods

## getActivityRecordId()

| Method |
| --- |
| public String getActivityRecordId() Obtains the ID of the activity record requesting the data. |

**Return****s**

| Type | Description |
| --- | --- |
| String | ID of the activity record requesting the data. If none has been specified, the returned result will be null. |

## getActivityRecordName()

| Method |
| --- |
| public String getActivityRecordName() Obtains the name of the activity record requesting the data. |

**Return****s**

| Type | Description |
| --- | --- |
| String | Name of the activity record requesting the data. If none has been specified, the returned result will be null. |

## getDataCollectors()

| Method |
| --- |
| public List<DataCollector> getDataCollectors() Obtains the data collectors to be read in the current request. |

**Return****s**

| Type | Description |
| --- | --- |
| List<DataCollector> | Specified data collectors. If none has been specified, the returned list will be empty. |

## getDataTypes()

| Method |
| --- |
| public List<DataType> getDataTypes() Obtains the data types to be read in the current request. |

**Return****s**

| Type | Description |
| --- | --- |
| List<DataType> | Specified data types. If none has been specified, the returned list will be empty. |

## getEndTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getEndTime(TimeUnit timeUnit) Obtains the end time of the data to be requested. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| long | End time of the data to be requested. |

## getRemoveApplications()

| Method |
| --- |
| public List<String> getRemoveApplications() Obtains the package names of all removed apps. |

**Return****s**

| Type | Description |
| --- | --- |
| List<String> | Package names of apps to be removed. If none has been specified, the returned list will be empty. |

## getStartTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getStartTime(TimeUnit timeUnit) Obtains the start time of the data to be requested. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| long | Obtains the start time. |

## isAllAppsSelected()

| Method |
| --- |
| public boolean isAllAppsSelected() Indicates whether the data to be read includes the activity records of all apps. |

**Return****s**

| Type | Description |
| --- | --- |
| boolean | Whether the data to be read includes the activity records of all apps. |
