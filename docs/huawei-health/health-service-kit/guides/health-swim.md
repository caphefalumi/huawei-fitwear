<!--
  Title: Swimming
  Catalog: harmonyos-guides
  Document ID: health-swim
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-swim
-->
# Swimming

#### Open Water Swimming

## Types of Open Water Swimming Records

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.openWaterSwim.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-18) | Open water swimming. | Bands and watches |

## Associated Statistical Data

- Field definition: [exerciseSequenceHelper.openWaterSwim.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-17)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| openWaterSwimFeature | Open water swimming feature. | [OpenWaterSwimFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#openwaterswimfeature) | Yes |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| swimStrokeRate | Swimming stroke rate statistics. | [SwimStrokeRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swimstrokeratesummary) | No |
| swolf | SWOLF statistics. | [SwolfSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swolfsummary) | No |

## Associated Detailed Data

Field definition: [exerciseSequenceHelper.openWaterSwim.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-17)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| location | Location details. | [Location](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#location)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| swimStrokeRate | Swimming stroke rate details. | [SwimStrokeRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swimstrokerate)[] | No |
| swolf | SWOLF details. | [Swolf](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swolf)[] | No |

#### Pool Swimming

## Types of Pool Swimming Records

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.poolSwim.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-19) | Pool swimming. | Bands and watches |

## Associated Statistical Data

Field definition: [exerciseSequenceHelper.poolSwim.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-18)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| poolSwimFeature | Pool swimming feature. | [PoolSwimFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#poolswimfeature) | Yes |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| speed | Speed statistics. | [SpeedSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speedsummary) | No |
| swimStrokeRate | Swimming stroke rate statistics. | [SwimStrokeRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swimstrokeratesummary) | No |
| swolf | SWOLF statistics. | [SwolfSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swolfsummary) | No |

## Associated Detailed Data

Field definition: [exerciseSequenceHelper.poolSwim.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-18)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| swimStrokeRate | Swimming stroke rate details. | [SwimStrokeRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swimstrokerate)[] | No |
| swolf | SWOLF details. | [Swolf](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#swolf)[] | No |
