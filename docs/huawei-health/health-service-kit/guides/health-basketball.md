<!--
  Title: Basketball
  Catalog: harmonyos-guides
  Document ID: health-basketball
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-basketball
-->
# Basketball

The following table lists the types of basketball playing records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.basketball.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-2) | Basketball. | Smart bands supporting basketball workout tracking. |

#### Associated Statistical Data

- Field definition: [exerciseSequenceHelper.basketball.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-1)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| basketballFeature | Basketball features. | [BasketballFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#basketballfeature) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| jump | Jump statistics. | [JumpSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#jumpsummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |

#### Associated Detailed Data

- Field definition: [exerciseSequenceHelper.basketball.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-1)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| jump | Jump details. | [Jump](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#jump)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
