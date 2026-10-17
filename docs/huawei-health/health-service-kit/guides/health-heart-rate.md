<!--
  Title: Heart Rate
  Catalog: harmonyos-guides
  Document ID: health-heart-rate
  Updated: 2026-10-14 09:30:02
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-heart-rate
-->
# Heart Rate

#### Dynamic Heart Rate

Dynamic heart rates of a user within a period of time.

- Constant in the HarmonyOS SDK: [samplePointHelper.heartRate.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-5)

## OAuth Scope

To apply for the required scopes, go to **Health data** > **Heart rate** on the Console of HUAWEI Developers.

## Sampling Details

**Fields**

Field definition: [samplePointHelper.heartRate.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-5)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| bpm | Heart rate. | number | Yes | Beats/min | [0, ∞) |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | Hourly | Watches, bands, and so on |

## Sampling Statistics

**Aggregation metrics**

- Field definition: [samplePointHelper.heartRate.AggregateFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#aggregatefields-3)

| **Field** | Description | Aggregation Metric | **Type** | Unit |
| --- | --- | --- | --- | --- |
| bpm | Heart rate. | max \| min \| last | number | Beats/min |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) | Hourly | Watches, bands, and so on |

#### Resting Heart Rate

This data type refers to the resting heart rate of a user at a certain time point when the user is awake and resting.

Constant in the HarmonyOS SDK: [samplePointHelper.restingHeartRate.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-8)

## OAuth Scope

To apply for the required scopes, go to **Health data** > **Heart rate** on the Console of HUAWEI Developers.

## Sampling Details

**Fields**

Field definition: [samplePointHelper.restingHeartRate.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-8)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| restBpm | Resting Heart Rate | number | Yes | Beats/min | [0, ∞) |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | Hourly | Watches, bands, and so on |

## Sampling Statistics

**Aggregation metrics**

Field definition: [samplePointHelper.restingHeartRate.AggregateFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#aggregatefields-4)

| **Field** | Description | Aggregation Metric | **Type** | Unit |
| --- | --- | --- | --- | --- |
| restBpm | Resting heart rate. | last | number | Beats/min |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) | Hourly | Watches, bands, and so on |
