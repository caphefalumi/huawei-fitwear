<!--
  Title: ReadOptions
  Catalog: HMSCore-References-V5
  Document ID: ro_class-0000001050091216-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/ro_class-0000001050091216-V5
-->
# ReadOptions

| Class Info |
| --- |
| public class ReadOptions extends EnhanceParcelable Request class for reading data. The request can be used to specify the type of data to be read and grouped parameters. The read request requires the setting of a time range and allows data to be read in detail or summary mode. |

When constructing a **ReadOptions** object to read detailed data, you must specify the time range for the data, and specify one or more **DataType**s or **DataCollector**s as needed.

The sample code for constructing a **ReadOptions** object to read detailed data is as follows:

- Read the detailed data of a specified **DataType** (**DT_CONTINUOUS_STEPS_DELTA**).The sample code is as follows:
```cpp
Java
ReadOptions readOptions = new ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .read(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .build();
```
 
```cpp
Kotlin
val readOptions = ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .read(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .build()
```

- Read the detailed data of two specified **DataType**s (**DT_CONTINUOUS_STEPS_DELTA and DT_INSTANTANEOUS_HEIGHT**).The sample code is as follows:
```cpp
Java
ReadOptions readOptions = new ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .read(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .read(DataType.DT_INSTANTANEOUS_HEIGHT)
    .build();
```
 
```cpp
Kotlin
val readOptions = ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .read(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .read(DataType.DT_INSTANTANEOUS_HEIGHT)
    .build()
```

- Read the detailed data from the specified **DataCollector**.The sample code is as follows:
```cpp
Java
ReadOptions readOptions = new ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .read(dataCollectorDevices)
    .build();
```
 
```cpp
Kotlin
val readOptions = ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .read(dataCollectorDevices)
    .build()
```

Read summary data by specifying the time range, summary mode, and grouping mode. These three options are mandatory.
The sample code for building **ReadOptions** to read summary data is as follows:
```cpp
Java
ReadOptions readOptions = new ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .polymerize(DataType.DT_CONTINUOUS_STEPS_DELTA, DataType.DT_CONTINUOUS_STEPS_TOTAL)
    .groupByTime(1, TimeUnit.HOURS)
    .build();
```
 
```cpp
Kotlin
val readOptions = ReadOptions.Builder()
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .polymerize(DataType.DT_CONTINUOUS_STEPS_DELTA, DataType.DT_CONTINUOUS_STEPS_TOTAL)
    .groupByTime(1, TimeUnit.HOURS)
    .build()
```

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [ReadOptions.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/ro_builder-0000001050093179-V5) Builder for **ReadOptions**. |

#### Constant Summary

| Type | Name | Description |
| --- | --- | --- |
| int | [NO_LIMIT](#EN-US_TOPIC_0000001053367054__section187461217165519) | Indicates that there is no limit for the returned data amount. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| DataCollector | [getActivityDataCollector](#EN-US_TOPIC_0000001053367054__section7744641112519)() Obtains the activity-related data collector. |
| List<DataCollector> | [getDataCollectors](#EN-US_TOPIC_0000001053367054__section17740109162610)() Obtains the data collectors for data reading. |
| List<DataType> | [getDataTypes](#EN-US_TOPIC_0000001053367054__section49809426277)() Obtains the data types for data reading. |
| long | [getEndTime](#EN-US_TOPIC_0000001053367054__section475332019283)(TimeUnit timeUnit) Obtains the end time of the data read range. |
| long | [getGroupPeriod](#EN-US_TOPIC_0000001053367054__section118594717287)(TimeUnit timeUnit) Obtains the duration for grouping. |
| int | [getGroupType](#EN-US_TOPIC_0000001053367054__section142592242911)() Obtains the group type. |
| int | [getPageSize](#EN-US_TOPIC_0000001053367054__section1621516618308)() Obtains the maximum number of pages for the paginated query results. |
| List<DataCollector> | [getPolymerizedDataCollectors](#EN-US_TOPIC_0000001053367054__section108148319312)() Obtains the grouped data collectors. |
| List<DataType> | [getPolymerizedDataTypes](#EN-US_TOPIC_0000001053367054__section189241136113113)() Obtains the grouped data types. |
| long | [getStartTime](#EN-US_TOPIC_0000001053367054__section12748117135513)(TimeUnit timeUnit) Obtains the start time of the data read range. |

#### Constants

## NO_LIMIT

| Constant |
| --- |
| public static final int NO_LIMIT Indicates that the returned results are not paginated. Constant value: **0** |

#### Public Methods

## getActivityDataCollector()

| Method |
| --- |
| public DataCollector getActivityDataCollector() Obtains the activity-related data collector. |

**Return****s**

| Type | Description |
| --- | --- |
| DataCollector | Activity-related data collector. |

## getDataCollectors()

| Method |
| --- |
| public List<DataCollector> getDataCollectors() Obtains the data collectors for data reading. |

**Return****s**

| Type | Description |
| --- | --- |
| List<DataCollector> | Data collectors for data reading. |

## getDataTypes()

| Method |
| --- |
| public List<DataType> getDataTypes() Obtains the data types for data reading. |

**Return****s**

| Type | Description |
| --- | --- |
| List<DataType> | Data types for data reading. |

## getEndTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getEndTime(TimeUnit timeUnit) Obtains the end time of the data read range. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| long | End time in a specified time unit. |

## getGroupPeriod(TimeUnit timeUnit)

| Method |
| --- |
| public long getGroupPeriod(TimeUnit timeUnit) Obtains the duration for grouping. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| long | Duration for grouping. |

## getGroupType()

| Method |
| --- |
| public int getGroupType() Obtains the group type. |

**Return****s**

| Type | Description |
| --- | --- |
| int | Group type. |

## getPageSize()

| Method |
| --- |
| public int getPageSize() Obtains the maximum number of pages for the paginated query results. |

**Return****s**

| Type | Description |
| --- | --- |
| int | Maximum number of pages for the paginated query results. |

## getPolymerizedDataCollectors()

| Method |
| --- |
| public List<DataCollector> getPolymerizedDataCollectors() Obtains the grouped data collectors. |

**Return****s**

| Type | Description |
| --- | --- |
| List<DataCollector> | Grouped data collectors. |

## getPolymerizedDataTypes()

| Method |
| --- |
| public List<DataType> getPolymerizedDataTypes() Obtains the grouped data types. |

**Returns**

| Type | Description |
| --- | --- |
| List<DataType> | Grouped data types. |

## getStartTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getStartTime(TimeUnit timeUnit) Obtains the start time of the data read range. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| long | Start time in a specified time unit. |
