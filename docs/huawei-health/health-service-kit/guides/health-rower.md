<!--
  Title: Rowing Machine
  Catalog: harmonyos-guides
  Document ID: health-rower
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-rower
-->
# Rowing Machine

#### Rowing Machine

## Types of Workout Records on a Rowing Machine

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.rower.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-20) | Rowing machine. | Rowing machines and other professional equipment |

## Associated Statistical Data

Field definition: [exerciseSequenceHelper.rower.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-19)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| rowerFeature | Rowing machine workout feature. | [RowerFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#rowerfeature) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | No |
| speed | Speed statistics. | [SpeedSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speedsummary) | No |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| resistance | Resistance statistics. | [ResistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#resistancesummary) | No |
| power | Power statistics. | [PowerSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#powersummary) | No |
| strokeRate | Rowing stroke rate statistics. | [StrokeRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#strokeratesummary) | No |

## Associated Detailed Data

Field definition: [exerciseSequenceHelper.rower.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-19)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| power | Power details. | [Power](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#power)[] | No |
| resistance | Resistance details. | [Resistance](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#resistance)[] | No |
| strokeRate | Rowing stroke rate details. | [StrokeRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#strokerate)[] | No |

#### Rowing

## Types of Rowing Records

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.rowing.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-21) | Rowing. | Bands and watches |

## Associated Statistical Data

Field definition: [exerciseSequenceHelper.rowing.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-20)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| rowingFeature | Rowing feature. | [RowingFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#rowingfeature) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | No |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| strokeRate | Rowing stroke rate statistics. | [StrokeRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#strokeratesummary) | No |

## Associated Detailed Data

Field definition: [exerciseSequenceHelper.rowing.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-20)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| strokeRate | Rowing stroke rate details. | [StrokeRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#strokerate)[] | No |
