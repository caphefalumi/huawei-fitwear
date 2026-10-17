<!--
  Title: healthModels (Health and Fitness Data Models)
  Catalog: harmonyos-references
  Document ID: health-api-healthmodels
  Updated: 2026-10-14 09:35:50
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels
-->
# healthModels (Health and Fitness Data Models)

This module provides health and fitness data models.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { healthStore } from '@kit.HealthServiceKit';
```

> **Note:** This module is a sub-module of **healthStore** and needs to be used in **healthStore.healthModels** mode.

#### Adventures

type Adventures = healthStore.ExerciseSequence<healthFields.AdventuresSummary, healthFields.AdventuresDetail>

Data model for expedition records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.AdventuresSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#adventuressummary), [healthFields.AdventuresDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#adventuresdetail)> | Data model for expedition records. |

#### Basketball

type Basketball = healthStore.ExerciseSequence<healthFields.BasketballSummary, healthFields.BasketballDetail>

Data model for basketball records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.BasketballSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#basketballsummary), [healthFields.BasketballDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#basketballdetail)> | Data model for basketball records. |

#### Biathlon

type Biathlon = healthStore.ExerciseSequence<healthFields.BiathlonSummary, healthFields.BiathlonDetail>

Data model for biathlon records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.BiathlonSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#biathlonsummary), [healthFields.BiathlonDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#biathlondetail)> | Data model for biathlon records. |

#### BloodOxygenSaturation

type BloodOxygenSaturation = healthStore.SamplePoint<healthFields.BloodOxygenSaturation>

Data model for SpO2 sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.BloodOxygenSaturation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bloodoxygensaturation)> | Data model for SpO2 sampling. |

#### BloodOxygenSaturationAggregateRequest

type BloodOxygenSaturationAggregateRequest = healthStore.AggregateRequest<healthFields.BloodOxygenSaturationAggregation>

Model for requesting aggregation of SpO2 sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)<[healthFields.BloodOxygenSaturationAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bloodoxygensaturationaggregation)> | Model for requesting aggregation of SpO2 sampling data. |

#### BloodOxygenSaturationAggregateResult

type BloodOxygenSaturationAggregateResult = healthStore.AggregateResult<healthFields.BloodOxygenSaturationAggregation>

Data model for SpO2 aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)<[healthFields.BloodOxygenSaturationAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bloodoxygensaturationaggregation)> | Data model for SpO2 aggregation results. |

#### BloodPressure

type BloodPressure = healthStore.SamplePoint<healthFields.BloodPressure>

Data model for blood pressure sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.BloodPressure](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bloodpressure)> | Data model for blood pressure sampling. |

#### Bmx

type Bmx = Cycling

Data model for BMX cycling records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Cycling](#cycling) | Data model for BMX cycling records. |

#### BodyTemperature

type BodyTemperature = healthStore.SamplePoint<healthFields.BodyTemperature>

Data model for body temperature sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.BodyTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bodytemperature)> | Data model for body temperature sampling. |

#### BodyTemperatureAggregateRequest

type BodyTemperatureAggregateRequest = healthStore.AggregateRequest<healthFields.BodyTemperatureAggregation>

Model for requesting aggregation of body temperature sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)<[healthFields.BodyTemperatureAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bodytemperatureaggregation)> | Model for requesting aggregation of body temperature sampling data. |

#### BodyTemperatureAggregateResult

type BodyTemperatureAggregateResult = healthStore.AggregateResult<healthFields.BodyTemperatureAggregation>

Data model for body temperature aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)<[healthFields.BodyTemperatureAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bodytemperatureaggregation)> | Data model for body temperature aggregation results. |

#### BreathHoldingTest

type BreathHoldingTest = healthStore.ExerciseSequence<healthFields.BreathHoldingTestSummary, healthFields.BreathHoldingTestDetail>

Data model for apnea test records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.BreathHoldingTestSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#breathholdingtestsummary), [healthFields.BreathHoldingTestDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#breathholdingtestdetail)> | Data model for apnea test records. |

#### BreathHoldingTrain

type BreathHoldingTrain = healthStore.ExerciseSequence<healthFields.BreathHoldingTrainSummary, healthFields.BreathHoldingTrainDetail>

Data model for apnea training records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.BreathHoldingTrainSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#breathholdingtrainsummary), [healthFields.BreathHoldingTrainDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#breathholdingtraindetail)> | Data model for apnea training records. |

#### Cycling

type Cycling = healthStore.ExerciseSequence<healthFields.CyclingSummary, healthFields.CyclingDetail>

Data model for outdoor cycling records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.CyclingSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cyclingsummary), [healthFields.CyclingDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cyclingdetail)> | Data model for outdoor cycling records. |

#### DailyActivities

type DailyActivities = healthStore.SamplePoint<healthFields.DailyActivities>

Data model for daily activity sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.DailyActivities](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#dailyactivities)> | Data model for daily activity sampling. |

#### DailyActivitiesAggregateRequest

type DailyActivitiesAggregateRequest = healthStore.AggregateRequest<healthFields.DailyActivitiesAggregation>

Model for requesting aggregation of daily activity sampling data.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)<[healthFields.DailyActivitiesAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#dailyactivitiesaggregation)> | Model for requesting aggregation of daily activity sampling data. |

#### DailyActivitiesAggregateResult

type DailyActivitiesAggregateResult = healthStore.AggregateResult<healthFields.DailyActivitiesAggregation>

Data model for daily activity aggregation results.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)<[healthFields.DailyActivitiesAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#dailyactivitiesaggregation)> | Data model for daily activity aggregation results. |

#### Diving

type Diving = healthStore.ExerciseSequence<healthFields.DivingSummary, healthFields.DivingDetail>

Data model for freediving records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.DivingSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#divingsummary), [healthFields.DivingDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#divingdetail)> | Data model for freediving records. |

#### Elliptical

type Elliptical = healthStore.ExerciseSequence<healthFields.EllipticalSummary, healthFields.EllipticalDetail>

Data model for elliptical workout records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.EllipticalSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#ellipticalsummary), [healthFields.EllipticalDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#ellipticaldetail)> | Data model for elliptical workout records. |

#### Emotion

type Emotion = healthStore.SamplePoint<healthFields.Emotion>

Data model for emotion sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.Emotion](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#emotion)> | Data model for emotion sampling. |

#### GolfCourseModel

type GolfCourseModel = healthStore.ExerciseSequence<healthFields.GolfCourseModelSummary, healthFields.GolfCourseModelDetail>

Data model for golf (course mode) records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.GolfCourseModelSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#golfcoursemodelsummary), [healthFields.GolfCourseModelDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#golfcoursemodeldetail)> | Data model for golf (course mode) records. |

#### GolfPractice

type GolfPractice = healthStore.ExerciseSequence<healthFields.GolfPracticeSummary, healthFields.GolfPracticeDetail>

Data model for golf (driving range mode) records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.GolfPracticeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#golfpracticesummary), [healthFields.GolfPracticeDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#golfpracticedetail)> | Data model for golf (driving range mode) records. |

#### HeartRate

type HeartRate = healthStore.SamplePoint<healthFields.HeartRate>

Data model for dynamic heart rate sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.HeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#heartrate)> | Data model for dynamic heart rate sampling. |

#### HeartRateAggregateRequest

type HeartRateAggregateRequest = healthStore.AggregateRequest<healthFields.HeartRateAggregation>

Model for requesting aggregation of dynamic heart rate sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)<[healthFields.HeartRateAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#heartrateaggregation)> | Model for requesting aggregation of dynamic heart rate sampling data. |

#### HeartRateAggregateResult

type HeartRateAggregateResult = healthStore.AggregateResult<healthFields.HeartRateAggregation>

Data model for dynamic heart rate aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)<[healthFields.HeartRateAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#heartrateaggregation)> | Data model for dynamic heart rate aggregation results. |

#### HeartRateVariability

type HeartRateVariability = healthStore.SamplePoint<healthFields.HeartRateVariability>

Data model for heart rate variability sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.HeartRateVariability](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#heartratevariability)> | Data model for heart rate variability sampling. |

#### Height

type Height = healthStore.SamplePoint<healthFields.Height>

Data model for height sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.Height](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#height)> | Data model for height sampling. |

#### Hiking

type Hiking = Walking

Data model for hiking records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Walking](#walking) | Data model for hiking records. |

#### IndoorCycling

type IndoorCycling = Cycling

Data model for indoor cycling records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Cycling](#cycling) | Data model for indoor cycling records. |

#### IndoorRunning

type IndoorRunning = Running

Data model for indoor running records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Running](#running) | Data model for indoor running records. |

#### IndoorWalking

type IndoorWalking = Walking

Data model for indoor walking records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Walking](#walking) | Data model for indoor walking records. |

#### JumpingRope

type JumpingRope = healthStore.ExerciseSequence<healthFields.JumpingRopeSummary, healthFields.JumpingRopeDetail>

Data model for rope jumping records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.JumpingRopeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#jumpingropesummary), [healthFields.JumpingRopeDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#jumpingropedetail)> | Data model for rope jumping records. |

#### MenstrualCycle

type MenstrualCycle = healthStore.HealthSequence<healthFields.MenstrualCycle, healthFields.MenstrualCycleDetail>

Data model for menstrual cycle records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)<[healthFields.MenstrualCycle](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#menstrualcycle), [healthFields.MenstrualCycleDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#menstrualcycledetail)> | Data model for menstrual cycle records. |

#### MountainHike

type MountainHike = healthStore.ExerciseSequence<healthFields.MountainHikeSummary, healthFields.MountainHikeDetail>

Data model for mountain hike records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.MountainHikeSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#mountainhikesummary), [healthFields.MountainHikeDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#mountainhikedetail)> | Data model for mountain hike records. |

#### OpenWaterSwim

type OpenWaterSwim = healthStore.ExerciseSequence<healthFields.OpenWaterSwimSummary, healthFields.OpenWaterSwimDetail>

Data model for open water swimming records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.OpenWaterSwimSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#openwaterswimsummary), [healthFields.OpenWaterSwimDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#openwaterswimdetail)> | Data model for open water swimming records. |

#### PoolSwim

type PoolSwim = healthStore.ExerciseSequence<healthFields.PoolSwimSummary, healthFields.PoolSwimDetail>

Data model for pool swimming records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.PoolSwimSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#poolswimsummary), [healthFields.PoolSwimDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#poolswimdetail)> | Data model for pool swimming records. |

#### RestingHeartRate

type RestingHeartRate = healthStore.SamplePoint<healthFields.RestingHeartRate>

Data model for resting heart rate sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.RestingHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#restingheartrate)> | Data model for resting heart rate sampling. |

#### RestingHeartRateAggregateRequest

type RestingHeartRateAggregateRequest = healthStore.AggregateRequest<healthFields.RestingHeartRateAggregation>

Model for requesting aggregation of resting heart rate sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)<[healthFields.RestingHeartRateAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#restingheartrateaggregation)> | Model for requesting aggregation of resting heart rate sampling data. |

#### RestingHeartRateAggregateResult

type RestingHeartRateAggregateResult = healthStore.AggregateResult<healthFields.RestingHeartRateAggregation>

Data model for resting heart rate aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)<[healthFields.RestingHeartRateAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#restingheartrateaggregation)> | Data model for resting heart rate aggregation results. |

#### Rower

type Rower = healthStore.ExerciseSequence<healthFields.RowerSummary, healthFields.RowerDetail>

Data model for rower workout records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.RowerSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#rowersummary), [healthFields.RowerDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#rowerdetail)> | Data model for rower workout records. |

#### Rowing

type Rowing = healthStore.ExerciseSequence<healthFields.RowingSummary, healthFields.RowingDetail>

Data model for rowing records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.RowingSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#rowingsummary), [healthFields.RowingDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#rowingdetail)> | Data model for rowing records. |

#### Running

type Running = healthStore.ExerciseSequence<healthFields.RunningSummary, healthFields.RunningDetail>

Data model for outdoor running records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.RunningSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#runningsummary), [healthFields.RunningDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#runningdetail)> | Data model for outdoor running records. |

#### ScubaDiving

type ScubaDiving = healthStore.ExerciseSequence<healthFields.ScubaDivingSummary, healthFields.ScubaDivingDetail>

Data model for scuba diving records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.ScubaDivingSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#scubadivingsummary), [healthFields.ScubaDivingDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#scubadivingdetail)> | Data model for scuba diving records. |

#### Skiing

type Skiing = healthStore.ExerciseSequence<healthFields.SkiingSummary, healthFields.SkiingDetail>

Data model for skiing records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.SkiingSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skiingsummary), [healthFields.SkiingDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skiingdetail)> | Data model for skiing records. |

#### SkinTemperature

type SkinTemperature = healthStore.SamplePoint<healthFields.SkinTemperature>

Data model for skin temperature sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.SkinTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skintemperature)> | Data model for skin temperature sampling. |

#### SkinTemperatureAggregateRequest

type SkinTemperatureAggregateRequest = healthStore.AggregateRequest<healthFields.SkinTemperatureAggregation>

Model for requesting aggregation of skin temperature sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)<[healthFields.SkinTemperatureAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skintemperatureaggregation)> | Model for requesting aggregation of skin temperature sampling data. |

#### SkinTemperatureAggregateResult

type SkinTemperatureAggregateResult = healthStore.AggregateResult<healthFields.SkinTemperatureAggregation>

Data model for skin temperature aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)<[healthFields.SkinTemperatureAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skintemperatureaggregation)> | Data model for skin temperature aggregation results. |

#### Sled

type Sled = healthStore.ExerciseSequence<healthFields.SledSummary, healthFields.SledDetail>

Data model for sledding records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.SledSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sledsummary), [healthFields.SledDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleddetail)> | Data model for sledding records. |

#### SleepNapRecord

type SleepNapRecord = healthStore.HealthSequence<healthFields.SleepNap, healthFields.SleepDetail>

Data model for nap records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)<[healthFields.SleepNap](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepnap), [healthFields.SleepDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepdetail)> | Data model for nap records. |

#### SleepRecord

type SleepRecord = healthStore.HealthSequence<healthFields.Sleep, healthFields.SleepDetail>

Data model for nighttime sleep records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)<[healthFields.Sleep](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleep), [healthFields.SleepDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepdetail)> | Data model for nighttime sleep records. |

#### Snowboarding

type Snowboarding = healthStore.ExerciseSequence<healthFields.SnowboardingSummary, healthFields.SnowboardingDetail>

Data model for snowboarding records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.SnowboardingSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#snowboardingsummary), [healthFields.SnowboardingDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#snowboardingdetail)> | Data model for snowboarding records. |

#### Spinning

type Spinning = Cycling

Data model for spinning records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Cycling](#cycling) | Data model for spinning records. |

#### Sports

type Sports = healthStore.ExerciseSequence<healthFields.SportsSummary, healthFields.SportsDetail>

Data model for general workout records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.SportsSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sportssummary), [healthFields.SportsDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sportsdetail)> | Data model for general workout records. |

#### Stress

type Stress = healthStore.SamplePoint<healthFields.Stress>

Data model for stress sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.Stress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stress)> | Data model for stress sampling. |

#### StressAggregateRequest

type StressAggregateRequest = healthStore.AggregateRequest<healthFields.StressAggregation>

Model for requesting aggregation of stress sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)<[healthFields.StressAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stressaggregation)> | Model for requesting aggregation of stress sampling data. |

#### StressAggregateResult

type StressAggregateResult = healthStore.AggregateResult<healthFields.StressAggregation>

Data model for stress aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)<[healthFields.StressAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stressaggregation)> | Data model for stress aggregation results. |

#### TrailRunning

type TrailRunning = Running

Data model for trail running records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Running](#running) | Data model for trail running records. |

#### Walking

type Walking = healthStore.ExerciseSequence<healthFields.WalkingSummary, healthFields.WalkingDetail>

Data model for outdoor walking records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)<[healthFields.WalkingSummary](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#walkingsummary), [healthFields.WalkingDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#walkingdetail)> | Data model for outdoor walking records. |

#### Weight

type Weight = healthStore.SamplePoint<healthFields.Weight>

Data model for weight sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthStore.SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)<[healthFields.Weight](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#weight)> | Data model for weight sampling. |
