<!--
  Title: Apnea Training in Diving
  Catalog: harmonyos-guides
  Document ID: health-breath-holding-train
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-breath-holding-train
-->
# Apnea Training in Diving

The following table lists the types of apnea training records.

| **Subtype Constant** | **Description** | Data Source |
| --- | --- | --- |
| [exerciseSequenceHelper.breathHoldingTrain.EXERCISE_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant-6) | Apnea training in diving. | Selected professional watches and bands |

#### Associated Statistical Data

- Field definition: [exerciseSequenceHelper.breathHoldingTrain.SummaryFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#summaryfields-5)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| breathHoldingTrainFeature | Diving apnea training feature. | [BreathHoldingTrainFeature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#breathholdingtrainfeature) | Yes |
| exerciseHeartRate | Workout heart rate statistics. | [ExerciseHeartRateSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartratesummary) | No |

#### Associated Detailed Data

- Field definition: [exerciseSequenceHelper.breathHoldingTrain.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#detailfields-5)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| exerciseHeartRate | Workout heart rate details. | [ExerciseHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#exerciseheartrate)[] | No |
