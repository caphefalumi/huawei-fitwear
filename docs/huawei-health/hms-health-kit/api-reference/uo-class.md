<!--
  Title: UpdateOptions
  Catalog: HMSCore-References-V5
  Document ID: uo_class-0000001050091272-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/uo_class-0000001050091272-V5
-->
# UpdateOptions

| Class Info |
| --- |
| public class UpdateOptions extends EnhanceParcelable Request parameter class for updating data for a specified period of time to the Health platform. |

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [UpdateOptions.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/uo_builder-0000001050093233-V5) Builder for **UpdateOptions**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| final long | [getEndTime](#EN-US_TOPIC_0000001053487083__section11357812193720)() Obtains the end time of the request for updating data. |
| long | [getEndTime](#EN-US_TOPIC_0000001053487083__section1165816378509)(TimeUnit timeUnit) Returns the end time of the request for updating data in the specified time unit. |
| SampleSet | [getSampleSet](#EN-US_TOPIC_0000001053487083__section724623012571)() Obtains the sampling dataset for the data update request. |
| final long | [getStartTime](#EN-US_TOPIC_0000001053487083__section1438891785116)() Obtains the start time of the request for updating data. |
| long | [getStartTime](#EN-US_TOPIC_0000001053487083__section1770165715527)(TimeUnit timeUnit) Returns the start time of the request for updating data in the specified time unit. |

#### Public Methods

## getEndTime()

| Method |
| --- |
| public final long getEndTime() Obtains the end time of the request for updating data. |

**Return****s**

| Type | Description |
| --- | --- |
| long | End time of the request for updating data. |

## getEndTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getEndTime(TimeUnit timeUnit) Obtains the end time of the request for updating data in the specified time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Returns**

| Type | Description |
| --- | --- |
| long | End time of the request for updating data. |

## getSampleSet()

| Method |
| --- |
| public SampleSet getSampleSet() Obtains the sampling dataset for the data update request. |

**Return****s**

| Type | Description |
| --- | --- |
| SampleSet | Sampling dataset for the data update request. |

## getStartTime()

| Method |
| --- |
| public final long getStartTime() Obtains the start time of the request for updating data. |

**Return****s**

| Type | Description |
| --- | --- |
| long | Start time of the request for updating data. |

## getStartTime(TimeUnit timeUnit)

| Method |
| --- |
| public long getStartTime(TimeUnit timeUnit) Obtains the start time of the request for updating data in the specified time unit. |

**Parameters**

| Name | Description |
| --- | --- |
| timeUnit | Time unit. |

**Return****s**

| Type | Description |
| --- | --- |
| long | Start time of the request for updating data. |
