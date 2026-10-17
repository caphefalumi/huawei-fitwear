<!--
  Title: Expedition
  Catalog: harmonyos-guides
  Document ID: health-adventures
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-adventures
-->
# Expedition

The following table lists the types of expedition records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.adventures.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-1) | Expedition. | Selected professional watches |

#### Associated Statistical Data

- Field definition: [exerciseSequenceHelper.adventures.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | Yes |
| step | Step count statistics. | [StepSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stepsummary) | No |
| cadence | Cadence statistics. | [CadenceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cadencesummary) | No |
| altitude | Altitude statistics. | [AltitudeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitudesummary) | No |

#### Associated Detailed Data

- Field definition: [exerciseSequenceHelper.adventures.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| markPoint | Marker sampling details. | [MarkPoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#markpoint)[] | No |
| altitude | Altitude details. | [Altitude](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitude)[] | No |
