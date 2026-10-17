<!--
  Title: ActivityRecord
  Catalog: HMSCore-References-V5
  Document ID: activityrecord_class-0000001050161730-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecord_class-0000001050161730-V5
-->
# ActivityRecord

| Class Info |
| --- |
| public class ActivityRecord implements SafeParcelable Activity record class, which records the basic information about an activity of the user. For example, for an outdoor running activity, information including the start time, end time, activity record name, identifier, description, activity type (as defined in [HiHealthActivities](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthactivities-0000001050089540-V5)), and activity duration will be recorded. |

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [ActivityRecord.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecord_builder-0000001050163685-V5) Builder for **ActivityRecord**. |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final String | [EXTRA_ACTIVITY_RECORD](#EN-US_TOPIC_0000001053607039__section1471322525015) **ActivityRecord** object contained in additional information. |
| static final String | [MIME_TYPE_PREFIX](#EN-US_TOPIC_0000001053607039__section368492012719) General prefix of an activity record. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [ActivityRecord](#EN-US_TOPIC_0000001053607039__section20687420122719)(long startTimeMillis, long endTimeMillis, String name, String id, String desc, int activityTypeId, Long activeTimeMillis, AppInfo appInfo, ActivitySummary activitySummary, String timeZone, List<SampleSetDetail> details) Constructor for **ActivityRecord**. |
| [ActivityRecord](#EN-US_TOPIC_0000001053607039__section17666959172020)(long startTimeMillis, long endTimeMillis, String name, String id, String desc, int activityTypeId, Long activeTimeMillis, AppInfo appInfo, ActivitySummary activitySummary, String timeZone, List<SampleSetDetail> details, String metadata) Constructor for **ActivityRecord**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| String | [getActivityType](#EN-US_TOPIC_0000001053607039__section1897815177191)() Obtains the activity type associated with the activity record. Returns **unknown** if no return value is set. |
| String | [getAppDetailsUrl](#EN-US_TOPIC_0000001053607039__section176618572206)() Obtains the detailed URL of the app related to the activity record. |
| String | [getAppDomainName](#EN-US_TOPIC_0000001053607039__section20675550192215)() Obtains the domain name related to the activity record. |
| AppInfo | [getAppInfo](#EN-US_TOPIC_0000001053607039__section194720013403)() Obtains the app information related to the activity record. |
| String | [getAppVersion](#EN-US_TOPIC_0000001053607039__section19578106192410)() Obtains the version of the app that has added the activity record. |
| String | [getDesc](#EN-US_TOPIC_0000001053607039__section17911624254)() Obtains the description of the activity record. |
| long | [getDurationTime](#EN-US_TOPIC_0000001053607039__section98814462259)(TimeUnit timeUnit) Obtains the duration of the activity record based on the passed time unit. |
| long | [getEndTime](#EN-US_TOPIC_0000001053607039__section756304514262)(TimeUnit timeUnit) Obtains the end time of the activity record based on the passed time unit. |
| String | [getId](#EN-US_TOPIC_0000001053607039__section52241829182712)() Obtains the identifier of the activity record. |
| static String | [getMimeType](#EN-US_TOPIC_0000001053607039__section6748142015278)(String type) Obtains the MIME type of the activity record that describes a particular activity. |
| String | [getName](#EN-US_TOPIC_0000001053607039__section775972092715)() Obtains the name of the activity record. |
| String | [getPackageName](#EN-US_TOPIC_0000001053607039__section1261642512286)() Obtains the package name of the app that has added the activity record. |
| long | [getStartTime](#EN-US_TOPIC_0000001053607039__section77706209278)(TimeUnit timeUnit) Obtains the start time of the activity record based on the passed time unit. |
| ActivitySummary | [getActivitySummary](#EN-US_TOPIC_0000001053607039__section6736125061219)() Obtains the activity summary. |
| String | [getTimeZone](#EN-US_TOPIC_0000001053607039__section23701615141)() Obtains the time zone. |
| boolean | [hasDurationTime](#EN-US_TOPIC_0000001053607039__section108861620112712)() Indicates whether the activity record has durations. |
| long | [getActiveTime](#EN-US_TOPIC_0000001053607039__section46489316374)(TimeUnit timeUnit) Obtains the active time of the activity record based on the passed time unit. |
| String | [getMetadata](#EN-US_TOPIC_0000001053607039__section182041510115111)() Obtains the metadata of the activity record. |
| boolean | [isKeepGoing](#EN-US_TOPIC_0000001053607039__section1356823583015)() Indicates whether an activity record is in progress. |

#### Public Fields

## EXTRA_ACTIVITY_RECORD

| Field |
| --- |
| public static final String EXTRA_ACTIVITY_RECORD **ActivityRecord** object contained in additional information. Constant value: **vnd.huawei.hihealth.activityRecord** |

## MIME_TYPE_PREFIX

| Field |
| --- |
| public static final String MIME_TYPE_PREFIX General prefix of an activity record. Constant value: **vnd.huawei.hihealth.mimeType/** |

#### Public Constructors

## ActivityRecord(long startTimeMillis, long endTimeMillis, String name, String id, String desc, int activityTypeId, Long activeTimeMillis, AppInfo appInfo, ActivitySummary activitySummary, String timeZone, List<SampleSetDetail> details)

| Constructor |
| --- |
| public ActivityRecord(long startTimeMillis, long endTimeMillis, String name, String id, String desc, int activityTypeId, Long activeTimeMillis, AppInfo appInfo, ActivitySummary activitySummary, String timeZone, List<SampleSetDetail> details) Constructor for **ActivityRecord**. |

**Parameters**

| Name | Description |
| --- | --- |
| startTimeMillis | Start time. |
| endTimeMillis | End time. |
| name | Name of the activity record. |
| id | Identifier of the activity record. |
| desc | Description of the activity record. |
| activityTypeId | Activity type corresponding to the activity record. |
| activeTimeMillis | Activity duration. |
| appInfo | Information about the app related to the activity record. |
| activitySummary | Activity summary. |
| timeZone | Time zone. |
| details | Detailed sampling dataset in the activity record. |

## ActivityRecord(long startTimeMillis, long endTimeMillis, String name, String id, String desc, int activityTypeId, Long activeTimeMillis, AppInfo appInfo, ActivitySummary activitySummary, String timeZone, List<SampleSetDetail> details, String metadata)

| Constructor |
| --- |
| public ActivityRecord(long startTimeMillis, long endTimeMillis, String name, String id, String desc, int activityTypeId, Long activeTimeMillis, AppInfo appInfo, ActivitySummary activitySummary, String timeZone, List<SampleSetDetail> details, String metadata) Constructor for **ActivityRecord**. |

**Parameters**

| Name | Description |
| --- | --- |
| startTimeMillis | Start time. |
| endTimeMillis | End time. |
| name | Name of the activity record. |
| id | Identifier of the activity record. |
| desc | Description of the activity record. |
| activityTypeId | Activity type corresponding to the activity record. |
| activeTimeMillis | Activity duration. |
| appInfo | Information about the app related to the activity record. |
| activitySummary | Activity summary. |
| timeZone | Time zone. |
| details | Detailed sampling dataset in the activity record. |
| metadata | Metadata in the activity record. |

#### Public Methods

## getActivityType()

| Method |
| --- |
| public String getActivityType() Obtains the activity type associated with the activity record. Returns **unknown** is no return value is set. |

**Returns**

| Type | Description |
| --- | --- |
| String | Activity type associated with the activity record. |

## getAppDetailsUrl()

| Method |
| --- |
| public String getAppDetailsUrl() Obtains the detailed URL of the app related to the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| String | Detailed URL of the app. |

## getAppDomainName()

| Method |
| --- |
| public String getAppDomainName() Obtains the domain name of the app. |

**Returns**

| Type | Description |
| --- | --- |
| String | Domain name. |

## getAppInfo()

| Method |
| --- |
| public AppInfo getAppInfo() Obtains the app information related to the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| AppInfo | App information. |

## getAppVersion()

| Method |
| --- |
| public String getAppVersion() Obtains the version of the app that has added the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| String | App version. |

## getDesc()

| Method |
| --- |
| public String getDesc() Obtains the description of the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| String | Description of the activity record. |

## getDurationTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getDurationTime(TimeUnit timeUnit) Obtains the duration of the activity record based on the passed time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Activity duration. |

## getEndTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getEndTime(TimeUnit timeUnit) Obtains the end time of the activity record based on the passed time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | End time. |

## getId()

| Method |
| --- |
| public String getId() Obtains the identifier of the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| String | Identifier of the activity record. |

## getMimeType(String type)

| Method |
| --- |
| public static String getMimeType(String type) Obtains the MIME type of the activity record that describes a particular activity. |

**Parameters**

| Name | Description |
| --- | --- |
| type | Type. |

**Returns**

| Type | Description |
| --- | --- |
| String | MIME type of the activity record that describes a particular activity. |

## getName()

| Method |
| --- |
| public String getName() Obtains the name of the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| String | Name of the activity record. |

## getPackageName()

| Method |
| --- |
| public String getPackageName() Obtains the package name of the app that has added the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| String | Package name of the app. |

## getStartTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getStartTime(TimeUnit timeUnit) Obtains the start time of the activity record based on the passed time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Start time. |

## getActivitySummary()

| Method |
| --- |
| public ActivitySummary getActivitySummary() Obtains the activity summary. |

**Returns**

| Type | Description |
| --- | --- |
| ActivitySummary | Activity summary. |

## getTimeZone()

| Method |
| --- |
| public String getTimeZone() Obtains the time zone. |

**Returns**

| Type | Description |
| --- | --- |
| String | Time zone. |

## hasDurationTime()

| Method |
| --- |
| public boolean hasDurationTime() Indicates whether the activity record has durations. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether the activity record has durations. |

## getActiveTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getActiveTime(TimeUnit timeUnit) Obtains the active time of the activity record based on the passed time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Active time of an activity record. |

## getMetadata()

| Method |
| --- |
| public String getMetadata() Obtains the metadata of the activity record. |

**Returns**

| Type | Description |
| --- | --- |
| String | Metadata in the activity record. |

## isKeepGoing()

| Method |
| --- |
| public boolean isKeepGoing() Indicates whether an activity record is in progress. If the activity record has ended, the value **false** will be returned. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether an activity record is in progress. |
