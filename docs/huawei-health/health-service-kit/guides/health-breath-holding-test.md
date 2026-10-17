<!--
  Title: Apnea Testing in Diving
  Catalog: harmonyos-guides
  Document ID: health-breath-holding-test
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-breath-holding-test
-->
# Apnea Testing in Diving

The following table lists the types of apnea testing records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.breathHoldingTest.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-5) | Apnea testing in diving. | Selected professional watches and bands |

#### Associated Statistical Data

Field definition: [exerciseSequenceHelper.breathHoldingTest.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-4)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| breathHoldingTestFeature | Diving apnea test feature. | [BreathHoldingTestFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#breathholdingtestfeature) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |

#### Associated Detailed Data

Field definition: [exerciseSequenceHelper.breathHoldingTest.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-4)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
