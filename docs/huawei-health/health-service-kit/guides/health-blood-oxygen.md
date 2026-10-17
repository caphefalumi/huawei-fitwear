<!--
  Title: SpO2
  Catalog: harmonyos-guides
  Document ID: health-blood-oxygen
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-blood-oxygen
-->
# SpO2

This data refers to a user's instantaneous SpO2 level. Each piece of data records the SpO2 level at a certain time point. Data records cannot overlap. The start time of the next data record must be later than or equal to the end time of the previous data record.

- Constant in the HarmonyOS SDK: [samplePointHelper.bloodOxygenSaturation.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant)

#### OAuth Scope

To apply for the required scopes, go to **Health data** > **SpO2** on the Console of HUAWEI Developers.

#### Sample Details

## Fields

- Field definition: [samplePointHelper.bloodOxygenSaturation.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| spo2 | SpO2. | number | Yes | % | (0, 100] |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | Hourly | Some watches, bands, and so on |

#### Sample Statistics

**Aggregation metrics**

Field definition: [samplePointHelper.bloodOxygenSaturation.AggregateFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#aggregatefields)

| **Field** | Description | Aggregation Metric | **Type** | Unit |
| --- | --- | --- | --- | --- |
| spo2 | SpO2. | avg \| max \| min \| last | number | % |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) | Hourly | Some watches, bands, and so on |
