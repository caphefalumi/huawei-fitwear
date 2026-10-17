<!--
  Title: Body Temperature
  Catalog: harmonyos-guides
  Document ID: health-body-temperature
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-body-temperature
-->
# Body Temperature

#### Body Temperature

Body temperature data of a user within a short period of time.

Constant in the HarmonyOS SDK: [samplePointHelper.bodyTemperature.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-2)

## OAuth Scope

To apply for the required scopes, go to **Health data** > **Body temperature** on the Console of HUAWEI Developers.

## Sampling Details

**Fields**

- Field definition: [samplePointHelper.bodyTemperature.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-2)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| bodyTemperature | Body temperature. | number | Yes | Celsius (°C) | [34, 42] |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | In minutes | Selected watches |

## Sampling Statistics

**Aggregation metrics**

Field definition: [samplePointHelper.bodyTemperature.AggregateFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#aggregatefields-1)

| **Field** | Description | Aggregation Metric | **Type** | Unit |
| --- | --- | --- | --- | --- |
| bodyTemperature | Body temperature. | avg \| max \| min \| count | number | Celsius (°C) |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) | In minutes | Selected watches |

#### Skin Temperature

Skin temperature data of a user within a short period of time.

- Constant in the HarmonyOS SDK: [samplePointHelper.skinTemperature.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-9)

## OAuth Scope

To apply for the required scopes, go to **Health data** > **Body temperature** on the Console of HUAWEI Developers.

## Sampling Details

**Fields**

- Field definition: [samplePointHelper.skinTemperature.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-9)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| skinTemperature | Skin temperature. | number | Yes | Celsius (°C) | [20, 42] |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | In minutes | Selected watches |

## Sampling Statistics

**Aggregation metrics**

Field definition: [samplePointHelper.skinTemperature.AggregateFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#aggregatefields-5)

| **Field** | Description | Aggregation Metric | **Type** | Unit |
| --- | --- | --- | --- | --- |
| skinTemperature | Skin temperature. | avg \| max \| min \| count | number | Celsius (°C) |

**Data Openness**

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) | In minutes | Selected watches |
