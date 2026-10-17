<!--
  Title: Running
  Catalog: harmonyos-guides
  Document ID: health-running
  Updated: 2026-10-14 09:30:02
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-running
-->
# Running

The following table lists the types of running records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.running.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-22) | Outdoor running. | Mobile phones, watches, and bands |
| [exerciseSequenceHelper.indoorRunning.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-14) | Indoor running/Treadmill running. | Mobile phones, watches, and bands |
| [exerciseSequenceHelper.trailRunning.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-29) | Trail running. | Mobile phones, watches, and bands |

#### Associated Statistical Data

- Field definition: [exerciseSequenceHelper.running.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-21)

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
| runningForm | Running form statistics. | [RunningFormSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#runningformsummary) | No |
| runningFeature | Running feature. | [RunningFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#runningfeature) | No |

#### Associated Detailed Data

- Field definition: [exerciseSequenceHelper.running.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-21)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| cadence | Cadence details. | [Cadence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cadence)[] | No |
| runningForm | Running form details. | [RunningForm](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#runningform)[] | No |
| location | Location details. | [Location](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#location)[] | No |
| altitude | Altitude details. | [Altitude](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitude)[] | No |
