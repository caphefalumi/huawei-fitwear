<!--
  Title: Cycling
  Catalog: harmonyos-guides
  Document ID: health-cycling
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-cycling
-->
# Cycling

The following table lists the types of cycling records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.cycling.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-7) | Outdoor cycling. | Mobile phones, watches, and bands |
| [exerciseSequenceHelper.indoorCycling.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-13) | Indoor cycling. | Indoor bicycles and bike trainers |
| [exerciseSequenceHelper.spinning.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-27) | Spin bike. | Spin bikes |
| [exerciseSequenceHelper.bmx.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-4) | BMX cycling. | Mountain bikes |

#### Associated Statistical Data

- Field definition: [exerciseSequenceHelper.cycling.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-6)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| speed | Speed statistics. | [SpeedSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speedsummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| resistance | Resistance statistics. | [ResistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#resistancesummary) | No |
| pedalingCadence | Pedaling cadence statistics. | [PedalingCadenceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#pedalingcadencesummary) | No |
| power | Power statistics. | [PowerSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#powersummary) | No |
| altitude | Altitude statistics. | [AltitudeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitudesummary) | No |
| location | Location statistics. | [LocationSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#locationsummary) | No |

#### Associated Detailed Data

- Field definition: [exerciseSequenceHelper.cycling.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-6)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| speed | Speed details. | [Speed](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#speed)[] | No |
| pedalingCadence | Pedaling cadence details. | [PedalingCadence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#pedalingcadence)[] | No |
| power | Power details. | [Power](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#power)[] | No |
| location | Location details. | [Location](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#location)[] | No |
| altitude | Altitude details. | [Altitude](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitude)[] | No |
| resistance | Resistance details. | [Resistance](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#resistance)[] | No |
