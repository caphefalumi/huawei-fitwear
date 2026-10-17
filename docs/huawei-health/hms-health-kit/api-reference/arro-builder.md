<!--
  Title: ActivityRecordReadOptions.Builder
  Catalog: HMSCore-References-V5
  Document ID: arro_builder-0000001050091134-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/arro_builder-0000001050091134-V5
-->
# ActivityRecordReadOptions.Builder

| Class Info |
| --- |
| public static class Builder Builder for **ActivityRecordReadOptions**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053527058__section1707425339)() Constructor, which is used to create an **ActivityRecordInsertOptions.Builder** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| ActivityRecordReadOptions | [build](#EN-US_TOPIC_0000001053527058__section46721658101114)() Completes the building and returns the instance. |
| ActivityRecordReadOptions.Builder | [read](#EN-US_TOPIC_0000001053527058__section166541953151418)(DataCollector dataCollector) Reads the activity record data of a specified data collector. |
| ActivityRecordReadOptions.Builder | [read](#EN-US_TOPIC_0000001053527058__section147511956191619)(DataType dataType) Reads the activity record data of a specified data type. |
| ActivityRecordReadOptions.Builder | [readActivityRecordsFromAllApps](#EN-US_TOPIC_0000001053527058__section46677283174)() Reads activity records from all apps. |
| ActivityRecordReadOptions.Builder | [removeApplication](#EN-US_TOPIC_0000001053527058__section5831182712522)(String packageName) Removes the activity records of an app by specifying the app package name. |
| ActivityRecordReadOptions.Builder | [setActivityRecordId](#EN-US_TOPIC_0000001053527058__section1847142712526)(String activityRecordId) Sets the ID of the activity record. |
| ActivityRecordReadOptions.Builder | [setActivityRecordName](#EN-US_TOPIC_0000001053527058__section585032720527)(String activityRecordName) Sets the name of the activity record. |
| ActivityRecordReadOptions.Builder | [setTimeInterval](#EN-US_TOPIC_0000001053527058__section208551527185220)(long startTime, long endTime, TimeUnit timeUnit) Sets the time range for data reading. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Constructor, which is used to create an **ActivityRecordInsertOptions.Builder** object. |

#### Public Methods

## build()

| Method |
| --- |
| public ActivityRecordReadOptions build() Completes the building and returns the instance. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions | **ActivityRecordReadOptions** object. |

## read(DataCollector dataCollector)

| Method |
| --- |
| public ActivityRecordReadOptions.Builder read(DataCollector dataCollector) Reads the activity record data of a specified data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollector | Data collector. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions.Builder | **ActivityRecordReadOptions.Builder** object. |

## read(DataType dataType)

| Method |
| --- |
| public ActivityRecordReadOptions.Builder read(DataType dataType) Reads the activity record data of a specified data type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions.Builder | **ActivityRecordReadOptions.Builder** object. |

## readActivityRecordsFromAllApps()

| Method |
| --- |
| public ActivityRecordReadOptions.Builder readActivityRecordsFromAllApps() Reads activity records from all apps. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions.Builder | **ActivityRecordReadOptions.Builder** object. |

## removeApplication(String packageName)

| Method |
| --- |
| public ActivityRecordReadOptions.Builder removeApplication(String packageName) Removes the activity records of an app by specifying the app package name. |

**Parameters**

| Name | Description |
| --- | --- |
| packageName | App package name. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions.Builder | **ActivityRecordReadOptions.Builder** object. |

## setActivityRecordId(String activityRecordId)

| Method |
| --- |
| public ActivityRecordReadOptions.Builder setActivityRecordId(String activityRecordId) Sets the ID of the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecordId | ID of the activity record. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions.Builder | **ActivityRecordReadOptions.Builder** object. |

## setActivityRecordName(String activityRecordName)

| Method |
| --- |
| public ActivityRecordReadOptions.Builder setActivityRecordName(String activityRecordName) Sets the name of the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecordName | Name of the activity record. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions.Builder | **ActivityRecordReadOptions.Builder** object. |

## setTimeInterval(long startTime, long endTime, TimeUnit timeUnit)

| Method |
| --- |
| public ActivityRecordReadOptions.Builder setTimeInterval(long startTime, long endTime, TimeUnit timeUnit) Sets the time range for data reading. |

> **Note:** 1. The start time and end time must be later than the UNIX timestamp corresponding to 00:00 on January 1, 2014. 2. The end time must be later than the start time.

**Parameters**

| Name | Description |
| --- | --- |
| startTime | Start time. |
| endTime | End time. |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordReadOptions.Builder | **ActivityRecordReadOptions.Builder** object. |
