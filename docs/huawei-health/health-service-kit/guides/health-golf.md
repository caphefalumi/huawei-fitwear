<!--
  Title: Golf
  Catalog: harmonyos-guides
  Document ID: health-golf
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-golf
-->
# Golf

#### Golf (Driving Range Mode)

## Types of Golf Records (Driving Range Mode)

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.golfPractice.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-11) | Golf (Driving Range mode). | Bands and watches |

## Associated Statistical Data

- Field definition: [exerciseSequenceHelper.golfPractice.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-10)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| golfPracticeFeature | Golf (Driving Range mode) feature. | [GolfPracticeFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#golfpracticefeature) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |

## Associated Detailed Data

Field definition: [exerciseSequenceHelper.golfPractice.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-10)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |

#### Golf (Course Mode)

## Types of Golf Records (Course Mode)

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.golfCourseModel.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-10) | Golf (Course mode). | Bands and watches |

## Associated Statistical Data

Field definition: [exerciseSequenceHelper.golfCourseModel.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-9)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| golfCourseModelFeature | Golf (Course mode) feature. | [GolfCourseModelFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#golfcoursemodelfeature) | Yes |
| calorie | Calorie statistics. | [CalorieSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#caloriesummary) | Yes |
| step | Step count statistics. | [StepSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stepsummary) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |
| distance | Distance statistics. | [DistanceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#distancesummary) | No |
| cadence | Cadence statistics. | [CadenceSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cadencesummary) | No |
| altitude | Altitude statistics. | [AltitudeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitudesummary) | No |

## Associated Detailed Data

Field definition: [exerciseSequenceHelper.golfCourseModel.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-9)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
| altitude | Altitude details. | [Altitude](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#altitude)[] | No |
