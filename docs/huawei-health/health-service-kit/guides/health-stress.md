<!--
  Title: Stress
  Catalog: harmonyos-guides
  Document ID: health-stress
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-stress
-->
# Stress

This data record captures the user's stress level at a specific moment, with each entry representing the stress state at that timestamp.

- Constant in the HarmonyOS SDK: [samplePointHelper.stress.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-10)

#### OAuth Scope

To apply for the required scopes, go to **Health data** > **Stress** on the Console of HUAWEI Developers.

#### Sample Details

## Fields

- Field definition: [samplePointHelper.stress.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-10)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| stressScore | Stress score. | number | Yes | - | [1, 99] |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | Hourly | Watches, bands, and so on |

#### Sample Statistics

**Aggregation metrics**

- Field definition: [samplePointHelper.stress.AggregateFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#aggregatefields-6)

| **Field** | Description | Aggregation Metric | **Type** | Unit |
| --- | --- | --- | --- | --- |
| stressScore | Stress score. | avg \| max \| min \| last \| count | number | - |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) | Hourly | Watches, bands, and so on |
