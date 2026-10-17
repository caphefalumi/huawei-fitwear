<!--
  Title: Walking
  Catalog: harmonyos-guides
  Document ID: health-walking
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-walking
-->
# Walking

The following table lists the types of walking records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.walking.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-30) | Outdoor walking. | Mobile phones, watches, and bands |
| [exerciseSequenceHelper.indoorWalking.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-15) | Indoor walking. | Air walkers |
| [exerciseSequenceHelper.hiking.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-12) | Hiking. | Mobile phones, watches, and bands |

#### Associated Statistical Data

- Field definition: [exerciseSequenceHelper.walking.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-29)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| speed | Speed statistics. | [SpeedSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speedsummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| step | Step count statistics. | [StepSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stepsummary) | No |
| cadence | Cadence statistics. | [CadenceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cadencesummary) | No |
| altitude | Altitude statistics. | [AltitudeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitudesummary) | No |
| location | Location statistics. | [LocationSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#locationsummary) | No |

#### Associated Detailed Data

- Field definition: [exerciseSequenceHelper.walking.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-29)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| cadence | Cadence details. | [Cadence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cadence)[] | No |
| location | Location details. | [Location](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#location)[] | No |
| altitude | Altitude details. | [Altitude](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitude)[] | No |
