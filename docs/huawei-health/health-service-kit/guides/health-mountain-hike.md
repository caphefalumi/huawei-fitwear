<!--
  Title: Mountain Hiking
  Catalog: harmonyos-guides
  Document ID: health-mountain-hike
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-mountain-hike
-->
# Mountain Hiking

The following table lists the types of mountain hiking records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.mountainHike.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-17) | Mountain hiking. | Bands and watches |

#### Associated Statistical Data

Field definition: [exerciseSequenceHelper.mountainHike.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-16)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| step | Step count statistics. | [StepSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stepsummary) | No |
| altitude | Altitude statistics. | [AltitudeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitudesummary) | No |

#### Associated Detailed Data

Field definition: [exerciseSequenceHelper.mountainHike.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-16)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| location | Location details. | [Location](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#location)[] | No |
| altitude | Altitude details. | [Altitude](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitude)[] | No |
