<!--
  Title: Elliptical Machine
  Catalog: harmonyos-guides
  Document ID: health-elliptical
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-elliptical
-->
# Elliptical Machine

The following table lists the types of workout records on an elliptical machine.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.elliptical.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-9) | Elliptical machine. | Bands and watches |

#### Associated Statistical Data

Field definition: [exerciseSequenceHelper.elliptical.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-8)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | No |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| speed | Speed statistics. | [SpeedSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speedsummary) | No |
| step | Step count statistics. | [StepSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stepsummary) | No |
| cadence | Cadence statistics. | [CadenceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cadencesummary) | No |
| resistance | Resistance statistics. | [ResistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#resistancesummary) | No |
| pedalingCadence | Pedaling cadence statistics. | [PedalingCadenceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#pedalingcadencesummary) | No |
| power | Power statistics. | [PowerSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#powersummary) | No |

#### Associated Detailed Data

Field definition: [exerciseSequenceHelper.elliptical.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-8)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| pedalingCadence | Pedaling cadence details. | [PedalingCadence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#pedalingcadence)[] | No |
| power | Power details. | [Power](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#power)[] | No |
| cadence | Cadence details. | [Cadence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cadence)[] | No |
