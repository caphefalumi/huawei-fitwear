<!--
  Title: DeleteOptions
  Catalog: HMSCore-References-V5
  Document ID: do_class-0000001050091172-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/do_class-0000001050091172-V5
-->
# DeleteOptions

| Class Info |
| --- |
| public class DeleteOptions extends EnhanceParcelable Request parameter class for deleting data and activity records within a specified period of time from the Health platform. An app can delete only the data and activity records added by itself. |

When constructing a **DeleteOptions** object to delete data, you must specify the time range for the data deletion, and specify a **DataType** or multiple **DataCollector**s as needed. You can also choose to delete all data. If none is specified, no data of the app will be deleted.

The sample code is as follows:

- Delete the data of a specified **DataType** (**DT_CONTINUOUS_STEPS_DELTA**).The sample code is as follows:
```cpp
Java
DeleteOptions deleteOptions = new DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .build();
```
 
```cpp
Kotlin
val deleteOptions = DeleteOptions.Builder()
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .build()
```

- Delete the data of two specified **DataType**s (**DT_CONTINUOUS_STEPS_DELTA and DT_INSTANTANEOUS_HEIGHT**).The sample code is as follows:
```cpp
Java
DeleteOptions deleteOptions = new DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT)
    .build();
```
 
```cpp
Kotlin
val deleteOptions = DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT)
    .build()
```

- Delete the data of a **DataType** (**DT_CONTINUOUS_STEPS_DELTA**) and from multiple **DataCollector**s.The sample code is as follows:
```cpp
Java
DeleteOptions deleteOptions = new DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .addDataCollector(dataCollectorSoftware)
    .addDataCollector(dataCollectorDevices)
    .build();
```
 
```cpp
Kotlin
val deleteOptions = DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .addDataCollector(dataCollectorSoftware)
    .addDataCollector(dataCollectorDevices)
    .build()
```

- Delete all data of the app.The sample code is as follows:
```cpp
Java
DeleteOptions deleteOptions = new DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .deleteAllData()
    .build();
```
 
```cpp
Kotlin
val deleteOptions = DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .deleteAllData()
    .build()
```

When constructing a **DeleteOptions** object to delete activity records, you must specify the time range for the activity records to be deleted. You can also specify one or more **ActivityRecord**s as needed, or choose to delete all **ActivityRecord**s. If not specified, no activity record will be deleted.

The sample code for constructing a **DeleteOptions** object to delete activity records is as follows:

- Delete two activity records (**activityRecordRunning** and **activityRecordSwimming**).The sample code is as follows:
```cpp
Java
DeleteOptions deleteOptions = new DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .addActivityRecord(activityRecordRunning)
    .addActivityRecord(activityRecordSwimming)
    .build();
```
 
```cpp
Kotlin
val deleteOptions = DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .addActivityRecord(activityRecordRunning)
    .addActivityRecord(activityRecordSwimming)
    .build()
```

- Delete all activity records for the app.The sample code is as follows:
```cpp
Java
DeleteOptions deleteOptions = new DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .deleteAllActivityRecords()
    .build();
```
 
```cpp
Kotlin
val deleteOptions = DeleteOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .deleteAllActivityRecords()
    .build()
```

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [DeleteOptions.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/do_builder-0000001050093133-V5) Builder for **DeleteOptions**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| boolean | [deleteAllActivityRecords](#EN-US_TOPIC_0000001053527060__section467610133315)() Indicates whether to delete all activity records. |
| boolean | [deleteAllData](#EN-US_TOPIC_0000001053527060__section2371174719315)() Indicates whether to delete all data. |
| List<ActivityRecord> | [getActivityRecords](#EN-US_TOPIC_0000001053527060__section51171431558)() Obtains the activity records to be deleted. |
| List<DataCollector> | [getDataCollectors](#EN-US_TOPIC_0000001053527060__section516719111610)() Obtains the list of data collectors whose data is to be deleted. |
| List<DataType> | [getDataTypes](#EN-US_TOPIC_0000001053527060__section25022361160)() Obtains the type of the data to be deleted. |
| long | [getEndTime](#EN-US_TOPIC_0000001053527060__section98146101279)(TimeUnit timeUnit) Obtains the end time of the data range to be deleted. |
| long | [getStartTime](#EN-US_TOPIC_0000001053527060__section19999184075311)(TimeUnit timeUnit) Obtains the start time of the data range to be deleted. |

#### Public Methods

## deleteAllActivityRecords()

| Method |
| --- |
| public boolean deleteAllActivityRecords() Indicates whether to delete all activity records. |

**Return****s**

| Type | Description |
| --- | --- |
| boolean | Whether all activity records are deleted: • **true**: yes • **false**: no |

## deleteAllData()

| Method |
| --- |
| public boolean deleteAllData() Indicates whether to delete all data. |

**Return****s**

| Type | Description |
| --- | --- |
| boolean | Whether all data are deleted: • **true**: yes • **false**: no |

## getActivityRecords()

| Method |
| --- |
| public List<ActivityRecord> getActivityRecords() Obtains the activity records to be deleted. |

**Return****s**

| Type | Description |
| --- | --- |
| List<ActivityRecord> | List of activity records to be deleted. If none has been specified, the list is empty. |

## getDataCollectors()

| Method |
| --- |
| public List<DataCollector> getDataCollectors() Obtains the list of data collectors whose data is to be deleted. |

**Return****s**

| Type | Description |
| --- | --- |
| List<DataCollector> | List of data collectors whose data is to be deleted. If none has been specified, the list is empty. |

## getDataTypes()

| Method |
| --- |
| public List<DataType> getDataTypes() Obtains the data types of the data to be deleted. |

**Return****s**

| Type | Description |
| --- | --- |
| List<DataType> | List of data types whose data is to be deleted. If none has been specified, the list is empty. |

## getEndTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getEndTime(TimeUnit timeUnit) Obtains the end time of the data range to be deleted. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Obtains the end time in a specified time unit. |

## getStartTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getStartTime(TimeUnit timeUnit) Obtains the start time of the data range to be deleted. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| long | Start time in a specified time unit. |
