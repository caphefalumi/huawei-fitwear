<!--
  Title: DeleteOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: do_builder-0000001050093133-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/do_builder-0000001050093133-V5
-->
# DeleteOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for creating a **DeleteOptions** instance. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053687048__section1161718529259)() Default constructor, which is used to create a **DeleteOptions.Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| DeleteOptions.Builder | [addActivityRecord](#EN-US_TOPIC_0000001053687048__section3592164612128)(ActivityRecord activityRecord) Adds an activity record for data deletion. |
| DeleteOptions.Builder | [addDataCollector](#EN-US_TOPIC_0000001053687048__section1087118105410)(DataCollector dataCollector) Adds a data collector for data deletion. |
| DeleteOptions.Builder | [addDataType](#EN-US_TOPIC_0000001053687048__section48759111547)(DataType dataType) Adds a data type for data deletion. |
| DeleteOptions | [build](#EN-US_TOPIC_0000001053687048__section17663123713132)() Completes the building and returns the instance. |
| DeleteOptions.Builder | [deleteAllActivityRecords](#EN-US_TOPIC_0000001053687048__section860465511138)() Deletes all activity records. |
| DeleteOptions.Builder | [deleteAllData](#EN-US_TOPIC_0000001053687048__section0885191115417)() Deletes all data. |
| DeleteOptions.Builder | [setTimeInterval](#EN-US_TOPIC_0000001053687048__section45341610131510)(long startTime, long endTime, TimeUnit timeUnit) Sets the start time and end time for data deletion. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Default constructor, which is used to create a **DeleteOptions.Builder** object. |

#### Public Methods

## addActivityRecord(ActivityRecord activityRecord)

| Method |
| --- |
| public DeleteOptions.Builder addActivityRecord(ActivityRecord activityRecord) Adds a specified activity record for data deletion. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecord | Activity record for data deletion. |

**Return****s**

| Type | Description |
| --- | --- |
| DeleteOptions.Builder | **DeleteOptions.Builder** object. |

## addDataCollector(DataCollector dataCollector)

| Method |
| --- |
| public DeleteOptions.Builder addDataCollector(DataCollector dataCollector) Adds a specified data collector for data deletion. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector for data deletion. |

**Return****s**

| Type | Description |
| --- | --- |
| DeleteOptions.Builder | **DeleteOptions.Builder** object. |

## addDataType(DataType dataType)

| Method |
| --- |
| public DeleteOptions.Builder addDataType(DataType dataType) Adds a specified data type for data deletion. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type for data deletion. |

**Returns**

| Type | Description |
| --- | --- |
| DeleteOptions.Builder | **DeleteOptions.Builder** object. |

## build()

| Method |
| --- |
| public DeleteOptions build() Verifies the parameters, completes the build, and returns the request. |

**Return****s**

| Type | Description |
| --- | --- |
| DeleteOptions | **DeleteOptions** object. |

## deleteAllActivityRecords()

| Method |
| --- |
| public DeleteOptions.Builder deleteAllActivityRecords() Deletes all activity records. |

**Returns**

| Type | Description |
| --- | --- |
| DeleteOptions.Builder | **DeleteOptions.Builder** object. |

## deleteAllData()

| Method |
| --- |
| public DeleteOptions.Builder deleteAllData() Deletes all data. |

**Return****s**

| Type | Description |
| --- | --- |
| DeleteOptions.Builder | **DeleteOptions.Builder** object. |

## setTimeInterval(long startTime, long endTime, TimeUnit timeUnit)

| Method |
| --- |
| public DeleteOptions.Builder setTimeInterval(long startTime, long endTime, TimeUnit timeUnit) Sets the start time and end time for data to be deleted. The start time must be greater than 0, and the end time must not be earlier than the start time. |

**Parameters**

| Name | Description |
| --- | --- |
| startTime | Start time. |
| endTime | End time. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| DeleteOptions.Builder | **DeleteOptions.Builder** object. |
