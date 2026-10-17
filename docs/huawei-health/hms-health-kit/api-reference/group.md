<!--
  Title: Group
  Catalog: HMSCore-References-V5
  Document ID: group-0000001050090312-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/group-0000001050090312-V5
-->
# Group

| Class Info |
| --- |
| public class Group implements Parcelable Grouped data class, which represents a data group obtained by the user when querying the grouped data. For example, the user can query the grouped weight data collected within a period of time to learn about the maximum, minimum, and average body weight over this period of time. Currently, data can be grouped by time, activity record, activity type, or activity fragment. |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final int | [TYPE_TIME](#EN-US_TOPIC_0000001053527054__section10362168163018) Groups data by time. |
| static final int | [TYPE_INTERVALS](#EN-US_TOPIC_0000001053527054__section15369188123013) Groups data by interval. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Group](#EN-US_TOPIC_0000001053527054__section123711988303)(long startTime, long endTime, ActivityRecord activityRecord, int activityType, List<SampleSet> sampleSets, int groupType, boolean hasMoreSample) Constructor for **Group**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| String | [getActivity](#EN-US_TOPIC_0000001053527054__section73952819305)() Obtains the activity. |
| ActivityRecord | [getActivityRecord](#EN-US_TOPIC_0000001053527054__section183062304168)() Returns the activity record if data is grouped by activity record. Otherwise, null is returned. |
| final int | [getActivityType](#EN-US_TOPIC_0000001053527054__section478419782414)() Obtains the activity type. |
| long | [getEndTime](#EN-US_TOPIC_0000001053527054__section179353208172)(TimeUnit timeUnit) Obtains the end time. |
| int | [getGroupType](#EN-US_TOPIC_0000001053527054__section5706185810172)() Returns the group type. |
| static String | [getGroupTypeString](#EN-US_TOPIC_0000001053527054__section518918371915)(int groupType) Obtains the name of the group type. |
| SampleSet | [getSampleSet](#EN-US_TOPIC_0000001053527054__section2038718715205)(DataType dataType) Returns the sampling dataset based on data type within the grouping time duration. |
| List<SampleSet> | [getSampleSets](#EN-US_TOPIC_0000001053527054__section23989883018)() Returns the list of sampling datasets within the grouping time duration. |
| long | [getStartTime](#EN-US_TOPIC_0000001053527054__section772815114211)(TimeUnit timeUnit) Obtains the start time. |
| final boolean | [hasMoreSample](#EN-US_TOPIC_0000001053527054__section431194442216)() Checks whether the server has more data. |
| final boolean | [hasSameSample](#EN-US_TOPIC_0000001053527054__section1251737132716)(Group group) Checks whether the group has the same structure. |

#### Public Fields

## TYPE_TIME

| Field |
| --- |
| public static final int TYPE_TIME Type constant, requesting data to be grouped by time. Constant value: **1** |

## TYPE_INTERVALS

| Field |
| --- |
| public static final int TYPE_INTERVALS Type constant, requesting data to be grouped by interval. Constant value: **5** |

#### Public Constructors

## public Group(long startTime, long endTime, ActivityRecord activityRecord, int activityType, List<SampleSet> sampleSets, int groupType, boolean hasMoreSample)

| Constructor |
| --- |
| public Group(long startTime, long endTime, ActivityRecord activityRecord, int activityType, List<SampleSet> sampleSets, int groupType, boolean hasMoreSample) Constructor for **Group**. |

**Parameters**

| Name | Description |
| --- | --- |
| startTime | Start time. |
| endTime | End time. |
| activityRecord | Activity record. |
| activityType | Activity type. |
| sampleSets | Sampling datasets. |
| groupType | Group type. |
| hasMoreSample | Whether there is more data. |

#### Public Methods

## getActivity()

| Method |
| --- |
| public String getActivity() Obtains the activity. |

**Returns**

| Type | Description |
| --- | --- |
| String | Activity type as a string. |

## getActivityRecord()

| Method |
| --- |
| public ActivityRecord getActivityRecord() Returns the activity record if data is grouped by activity record. Otherwise, null is returned. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecord | Activity record. |

## getActivityType()

| Method |
| --- |
| public final int getActivityType() Obtains the activity type. |

**Returns**

| Type | Description |
| --- | --- |
| int | Activity type. |

## getEndTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getEndTime(TimeUnit timeUnit) Returns the end time. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | End time. |

## getGroupType()

| Method |
| --- |
| public int getGroupType() Returns the group type. |

**Returns**

| Type | Description |
| --- | --- |
| int | Group type. |

## getGroupTypeString(int groupType)

| Method |
| --- |
| public static String getGroupTypeString(int groupType) Obtains the name of the group type. |

**Parameters**

| Name | Description |
| --- | --- |
| groupType | Group type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Name of the group type. |

## getSampleSet(DataType dataType)

| Method |
| --- |
| public SampleSet getSampleSet(DataType dataType) Returns the sampling dataset based on data type within the grouping time duration. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type. |

**Returns**

| Type | Description |
| --- | --- |
| SampleSet | Sampling dataset. |

## getSampleSets()

| Method |
| --- |
| public List<SampleSet> getSampleSets() Returns the list of sampling datasets within the grouping time duration. |

**Returns**

| Type | Description |
| --- | --- |
| List<SampleSet> | List of sampling datasets. |

## getStartTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getStartTime(TimeUnit timeUnit) Returns the start time. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | Start time. |

## hasMoreSample()

| Method |
| --- |
| public final boolean hasMoreSample() Checks whether the server has more data. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether the server has more data. |

## hasSameSample(Group group)

| Method |
| --- |
| public final boolean hasSameSample(Group group) Checks whether the group has the same structure. |

**Parameters**

| Name | Description |
| --- | --- |
| group | Grouped data class. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether the group has the same structure. |
