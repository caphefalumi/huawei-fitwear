<!--
  Title: Diving
  Catalog: harmonyos-guides
  Document ID: health-diving
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-diving
-->
# Diving

#### Freediving

## Types of Freediving Records

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.diving.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-8) | Freediving. | Selected professional watches |

## Associated Statistical Data

- Field definition: [exerciseSequenceHelper.diving.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-7)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| divingFeature | Freediving feature. | [DivingFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#divingfeature) | Yes |
| location | Location statistics. | [LocationSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#locationsummary) | No |
| divingDepth | Diving depth statistics. | [DivingDepthSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#divingdepthsummary) | No |
| waterTemperature | Water temperature statistics. | [WaterTemperatureSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#watertemperaturesummary) | No |

## Associated Detailed Data

- Field definition: [exerciseSequenceHelper.diving.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-7)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| divingDepth | Diving depth details. | [DivingDepth](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#divingdepth)[] | No |
| waterTemperature | Water temperature details. | [WaterTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#watertemperature)[] | No |

#### Scuba Diving

## Types of Scuba Diving Records

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.scubaDiving.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-23) | Scuba diving. | Selected professional watches |

## Associated Statistical Data

- Field definition: [exerciseSequenceHelper.scubaDiving.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-22)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| scubaDivingFeature | Scuba diving feature. | [ScubaDivingFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#scubadivingfeature) | Yes |
| location | Location statistics. | [LocationSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#locationsummary) | No |
| divingDepth | Diving depth statistics. | [DivingDepthSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#divingdepthsummary) | No |
| waterTemperature | Water temperature statistics. | [WaterTemperatureSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#watertemperaturesummary) | No |

## Associated Detailed Data

- Field definition: [exerciseSequenceHelper.scubaDiving.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-22)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| divingDepth | Diving depth details. | [DivingDepth](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#divingdepth)[] | No |
| waterTemperature | Water temperature details. | [WaterTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#watertemperature)[] | No |
