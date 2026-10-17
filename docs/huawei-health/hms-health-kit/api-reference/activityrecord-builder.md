<!--
  Title: ActivityRecord.Builder
  Catalog: HMSCore-References-V5
  Document ID: activityrecord_builder-0000001050163685-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecord_builder-0000001050163685-V5
-->
# ActivityRecord.Builder

| Class Info |
| --- |
| public static class Builder Constructs a builder for **ActivityRecord**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001052927057__section658963113404)() No-argument constructor for the builder. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| ActivityRecord | [build](#EN-US_TOPIC_0000001052927057__section59001710114012)() Builds and returns the activity record instance. |
| ActivityRecord.Builder | [setActivityTypeId](#EN-US_TOPIC_0000001052927057__section8385193854218)(String activityType) Sets the activity type associated with the activity record. |
| ActivityRecord.Builder | [setDesc](#EN-US_TOPIC_0000001052927057__section0343161234316)(String description) Sets the description of the activity record. The input parameter can be **null**, an empty string, or a string of 1 to 1000 characters. |
| ActivityRecord.Builder | [setDurationTime](#EN-US_TOPIC_0000001052927057__section1532973410431)(long time, TimeUnit timeUnit) Sets the duration of the activity record based on the passed time unit. |
| ActivityRecord.Builder | [setActiveTime](#EN-US_TOPIC_0000001052927057__section1296263995819)(long activeTime, TimeUnit timeUnit) Sets the active time of the activity record based on the passed time unit. |
| ActivityRecord.Builder | [setEndTime](#EN-US_TOPIC_0000001052927057__section64520345441)(long endTime, TimeUnit timeUnit) Sets the end time of the activity record based on the passed time unit. |
| ActivityRecord.Builder | [setId](#EN-US_TOPIC_0000001052927057__section142211817174513)(String identifier) Sets the identifier of the activity record. The input parameter can be a string of 1 to 1000 characters. |
| ActivityRecord.Builder | [setName](#EN-US_TOPIC_0000001052927057__section26989202279)(String sessionName) Sets the name of the activity record. The input parameter can be null or a string of 1 to 980 characters. |
| ActivityRecord.Builder | [setStartTime](#EN-US_TOPIC_0000001052927057__section771115205275)(long startTime, TimeUnit timeUnit) Sets the start time of the activity record based on the passed time unit. |
| ActivityRecord.Builder | [setActivitySummary](#EN-US_TOPIC_0000001052927057__section562819572226)(ActivitySummary activitySummaryParam) Sets **ActivitySummary** based on the passed object. |
| ActivityRecord.Builder | [setTimeZone](#EN-US_TOPIC_0000001052927057__section15145325112418)(String timeZone) Sets the time zone. |
| ActivityRecord.Builder | [setMetadata](#EN-US_TOPIC_0000001052927057__section184621709315)(String metadata) Sets the metadata in the activity record. |
| ActivityRecord.Builder | [setAppInfo](#EN-US_TOPIC_0000001052927057__section2497131183914)(AppInfo appInfo) Sets the app information of the activity record. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() No-argument constructor for the builder. |

#### Public Methods

## build()

| Method |
| --- |
| public ActivityRecord build() Builds and returns the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord | Activity record. |

## setActivityTypeId(String activityType)

| Method |
| --- |
| public ActivityRecord.Builder setActivityTypeId(String activityType) Sets the activity type associated with the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| activityType | Activity type. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setDesc(String description)

| Method |
| --- |
| public ActivityRecord.Builder setDesc(String description) Sets the description of the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| description | Activity description. |

**Returns**

| **Type** | **Description** |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setDurationTime(long time, TimeUnit timeUnit)

| Method |
| --- |
| public ActivityRecord.Builder setDurationTime(long time, TimeUnit timeUnit) Sets the duration of the activity record based on the passed time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| time | Activity duration. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setActiveTime(long activeTime, TimeUnit timeUnit)

| Method |
| --- |
| public ActivityRecord.Builder setActiveTime(long activeTime, TimeUnit timeUnit) Sets the active time of the activity record based on the passed time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| activeTime | Active time of the activity record. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setEndTime(long endTime, TimeUnit timeUnit)

| Method |
| --- |
| public ActivityRecord.Builder setEndTime(long endTime, TimeUnit timeUnit) Sets the end time of the activity record based on the passed time unit. If the end time is not specified, the activity record is considered as still being in progress. |

> **Note:** The end time must be later than the UNIX timestamp corresponding to 00:00 on January 1, 2014.

**Parameters**

| Name | Description |
| --- | --- |
| endTime | End time. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setId(String identifier)

| Method |
| --- |
| public ActivityRecord.Builder setId(String identifier) Sets the identifier of the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| identifier | Identifier of the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setName(String sessionName)

| Method |
| --- |
| public ActivityRecord.Builder setName(String sessionName) Sets the name of the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| sessionName | Name of the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setStartTime(long startTime, TimeUnit timeUnit)

| Method |
| --- |
| public ActivityRecord.Builder setStartTime(long startTime, TimeUnit timeUnit) Sets the start time of the activity record based on the passed time unit. |

> **Note:** The start time must be later than the UNIX timestamp corresponding to 00:00 on January 1, 2014.

**Parameters**

| Name | Description |
| --- | --- |
| startTime | Start time. |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setActivitySummary(ActivitySummary activitySummaryParam)

| Method |
| --- |
| public ActivityRecord.Builder setActivitySummary(ActivitySummary activitySummaryParam) Sets **ActivitySummary** based on the passed object. |

**Parameters**

| Name | Description |
| --- | --- |
| activitySummaryParam | Activity summary. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setTimeZone(String timeZone)

| Method |
| --- |
| public ActivityRecord.Builder setTimeZone(String timeZone) Sets the time zone. |

**Parameters**

| Name | Description |
| --- | --- |
| timeZone | Time zone. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setMetadata(String metadata)

| Method |
| --- |
| public ActivityRecord.Builder setMetadata(String metadata) Sets the metadata in the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| metadata | Metadata, which can be defined as a character string in JSON format. The value can be **null**, an empty string, or a string of 1 to 10000 characters. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |

## setAppInfo(AppInfo appInfo)

| Method |
| --- |
| public ActivityRecord.Builder setAppInfo(AppInfo appInfo) Sets the app information of the activity record. |

**Parameters**

| Name | Description |
| --- | --- |
| appInfo | App information of the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord.Builder | Builder. |
