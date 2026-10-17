<!--
  Title: Jump Rope
  Catalog: harmonyos-guides
  Document ID: health-jumping-rope
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-jumping-rope
-->
# Jump Rope

The following table lists the types of jump rope records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.jumpingRope.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-16) | Jump rope. | AI jump ropes and smart jump ropes |

#### Associated Statistical Data

- Field definition: [exerciseSequenceHelper.jumpingRope.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-15)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| jumpingRopeFeature | Jump rope feature. | [JumpingRopeFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#jumpingropefeature) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| skipSpeed | Speed statistics. | [SkipSpeedSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skipspeedsummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |

#### Associated Detailed Data

- Field definition: [exerciseSequenceHelper.jumpingRope.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-15)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| skipSpeed | Speed details. | [SkipSpeed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skipspeed)[] | No |
