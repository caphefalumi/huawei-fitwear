<!--
  Title: healthFields (Health and Fitness Data Fields)
  Catalog: harmonyos-references
  Document ID: health-api-healthfields
  Updated: 2026-10-14 09:35:48
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields
-->
# healthFields (Health and Fitness Data Fields)

This module provides a list of health and fitness data fields.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { healthStore } from '@kit.HealthServiceKit';
```

> **Note:** This module is a sub-module of **healthStore** and needs to be used in **healthStore.healthFields** mode.

#### AdventuresDetail

List of data fields about expedition details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| markPoint | [MarkPoint](#markpoint)[] | No | Yes | List of marked point details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |

#### AdventuresSummary

List of data fields about expedition statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| step | [StepSummary](#stepsummary) | No | Yes | Step statistics. If this field is not set, it is empty by default. |
| cadence | [CadenceSummary](#cadencesummary) | No | Yes | Step cadence statistics. If this field is not set, it is empty by default. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |

#### Altitude

List of data fields about altitude details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| altitude | number | No | No | Altitude. Unit: m |

#### AltitudeSummary

List of data fields about altitude statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| max | number | No | No | Maximum value. Unit: m |
| min | number | No | No | Minimum value. Unit: m |
| avg | number | No | Yes | Average value. If this field is not set, it is empty by default. Unit: m |
| totalAscent | number | No | Yes | Total ascent. If this field is not set, it is empty by default. Unit: m Value range: [0, ∞) |
| totalDescent | number | No | Yes | Total descent. If this field is not set, it is empty by default. Unit: m Value range: [0, ∞) |

#### BasketballDetail

List of data fields about basketball details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| jump | [Jump](#jump)[] | No | Yes | List of jump details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |

#### BasketballFeature

List of data fields about basketball features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| overallScore | number | No | No | Overall score. |
| burstScore | number | No | Yes | Explosive power score. If this field is not set, it is empty by default. |
| jumpScore | number | No | Yes | Hang time score. If this field is not set, it is empty by default. |
| runScore | number | No | Yes | Running score. If this field is not set, it is empty by default. |
| breakthroughScore | number | No | Yes | Dribble breakthrough score. If this field is not set, it is empty by default. |
| sportIntensityScore | number | No | Yes | Intensity score. If this field is not set, it is empty by default. |

#### BasketballSummary

List of data fields about basketball statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| basketballFeature | [BasketballFeature](#basketballfeature) | No | No | Basketball features. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| jump | [JumpSummary](#jumpsummary) | No | No | Jump statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### BiathlonDetail

List of data fields about biathlon details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |

#### BiathlonSummary

type BiathlonSummary = SportsSummary

List of data fields about biathlon statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### BloodOxygenSaturation

List of SpO2 sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| spo2 | number | No | No | SpO2. Unit: % Value range: (0, 100] |

#### BloodOxygenSaturationAggregation

List of data fields about SpO2 aggregates.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| spo2 | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'sum' \| 'count'> | No | No | SpO2 aggregate. |

#### BloodPressure

List of blood pressure sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bloodPressureSystolic | number | No | No | Systolic (top) pressure. Unit: mmHg Value range: (0, ∞) |
| bloodPressureDiastolic | number | No | No | Diastolic (bottom) pressure. Unit: mmHg Value range: (0, ∞) |
| sphygmus | number | No | Yes | Pulse. If this field is not set, it is empty by default. Unit: beats/minute Value range: (0, ∞) |
| measurementAnomalyFlag | number | No | Yes | Measurement exception event. If this field is not set, it is empty by default. Value range: (0, ∞) The options are: **1**: Normal. **2**: The device is not level with the user's heart. **3**: The user shakes slightly during the measurement. **4**: The user does not rest for 5 minutes or more before the measurement. |
| beforeMeasureActivity | number | No | Yes | Activity before measurement. If this field is not set, it is empty by default. Value range: (0, ∞) The options are: **1**: intense exercise **2**: smoking **3**: eating **4**: drinking alcohol **5**: drinking coffee **6**: no activity **7**: after getting up **8**: prepared for bed **100**: custom |

#### BodyTemperature

List of body temperature sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bodyTemperature | number | No | No | Body temperature. Unit: °C Value range: [34, 42] |

#### BodyTemperatureAggregation

List of data fields about body temperature aggregates.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bodyTemperature | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'sum' \| 'last'> | No | No | Body temperature aggregate. |

#### BreathHoldingTestDetail

type BreathHoldingTestDetail = SportsDetail

List of data fields about apnea test details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |

#### BreathHoldingTestFeature

List of data fields about apnea test features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| diaphragmTime | number | No | No | Diaphragm contraction. Unit: s |

#### BreathHoldingTestSummary

List of data fields about apnea test statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| breathHoldingTestFeature | [BreathHoldingTestFeature](#breathholdingtestfeature) | No | No | Apnea test feature statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### BreathHoldingTrainDetail

type BreathHoldingTrainDetail = SportsDetail

List of data fields about apnea training details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |

#### BreathHoldingTrainFeature

List of data fields about apnea training features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| breathTime | number | No | No | Breathing time. Unit: s |
| breathHoldingTime | number | No | No | Breath holding time. Unit: s |
| breathHoldingTrainRhythm | number | No | Yes | Number of apnea training sessions. If this field is not set, it is empty by default. Unit: integer |

#### BreathHoldingTrainSummary

List of data fields about apnea training statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| breathHoldingTrainFeature | [BreathHoldingTrainFeature](#breathholdingtrainfeature) | No | No | Apnea training feature statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### Cadence

List of data fields about step cadence details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| cadence | number | No | No | Step cadence. Unit: steps/minute Value range: [0, ∞) |

#### CadenceSummary

type CadenceSummary = QuantitySummary

List of data fields about step cadence statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: steps/minute Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: steps/minute Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Unit: steps/minute Value range: [0, ∞) |

#### CalorieSummary

List of data fields about calorie statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| totalCalories | number | No | No | Total calories. Unit: cal Value range: (0, ∞) |

#### CervicalMucus

List of cervical mucus sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| cervicalMucus | number | No | No | Cervical mucus. The options are: **0**: not selected **1**: dry **2**: sticky **3**: egg white **4**: watery **5**: creamy |

#### CyclingDetail

List of data fields about cycling details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| pedalingCadence | [PedalingCadence](#pedalingcadence)[] | No | Yes | List of pedaling cadence details. If this field is not set, it is empty by default. |
| power | [Power](#power)[] | No | Yes | List of power details. If this field is not set, it is empty by default. |
| location | [Location](#location)[] | No | Yes | List of location details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |
| resistance | [Resistance](#resistance)[] | No | Yes | List of resistance details. If this field is not set, it is empty by default. |

#### CyclingSummary

List of data fields about cycling statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| speed | [SpeedSummary](#speedsummary) | No | No | Speed statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| resistance | [ResistanceSummary](#resistancesummary) | No | Yes | Resistance statistics. If this field is not set, it is empty by default. |
| pedalingCadence | [PedalingCadenceSummary](#pedalingcadencesummary) | No | Yes | Pedaling cadence statistics. If this field is not set, it is empty by default. |
| power | [PowerSummary](#powersummary) | No | Yes | Power statistics. If this field is not set, it is empty by default. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |
| location | [LocationSummary](#locationsummary) | No | Yes | Location statistics. If this field is not set, it is empty by default. |

#### DailyActivities

List of daily activity sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| step | number | No | No | Step count. Unit: step Value range: [0, 500) |
| calorie | number | No | No | Calories. Unit: cal Value range: [0, 65536) |
| distance | number | No | No | Distance. Unit: m Value range: [0, ∞) |
| duration | number | No | Yes | Duration. If this field is not set, it is empty by default. Unit: min Options: **0** or **1** |
| status | number | No | Yes | Status (such as walking, running, cycling, and climbing). If this field is not set, it is empty by default. The options are: **2**: mountain hike **3**: cycling **4**: running **5**: walking **9**: swimming **10**: working out **13**: standing |
| isIntensity | number | No | Yes | Indicates whether an activity is of medium- and high-intensity. If this field is not set, it is empty by default. The options are: **0**: no **1**: yes |
| climbHighAltitude | number | No | Yes | Altitude difference (positive or negative). If this field is not set, it is empty by default. Unit: m |
| isStand | number | No | Yes | Indicates whether the user stands. If there is an activity record in an hour, the first minute of the hour is marked as **1**. If this field is not set, it is empty by default. The options are: **0**: no **1**: yes |

#### DailyActivitiesAggregation

List of data fields about daily activity aggregates.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| step | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'max' \| 'min' \| 'avg' \| 'last' \| 'count'> | No | No | Step aggregate. |
| calorie | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'max' \| 'min' \| 'avg' \| 'last' \| 'count'> | No | No | Calorie aggregate. |
| distance | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'max' \| 'min' \| 'avg' \| 'last' \| 'count'> | No | No | Distance aggregate. |
| climbHighAltitude | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'max' \| 'min' \| 'avg' \| 'last' \| 'count'> | No | No | Altitude difference aggregate. |
| isIntensity | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'max' \| 'min' \| 'avg' \| 'last' \| 'count'> | No | No | Medium- and high-intensity activity aggregate. |
| isStand | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'max' \| 'min' \| 'avg' \| 'last' \| 'count'> | No | No | Stand aggregate. |

#### DistanceSummary

List of data fields about distance statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| totalDistance | number | No | No | Distance statistics. Unit: m Value range: (0, ∞) |

#### DivingDepth

List of data fields about diving depth details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| depth | number | No | No | Diving depth. Unit: m |

#### DivingDepthSummary

type DivingDepthSummary = Omit<QuantitySummary, 'min'>

List of data fields about diving depth statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: m Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: m Value range: [0, ∞) |

#### DivingDetail

List of data fields about freediving details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| divingDepth | [DivingDepth](#divingdepth)[] | No | Yes | List of diving depth details. If this field is not set, it is empty by default. |
| waterTemperature | [WaterTemperature](#watertemperature)[] | No | Yes | List of water temperature details. If this field is not set, it is empty by default. |

#### DivingFeature

List of data fields about freediving features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| divingTime | number | No | No | Diving time. Unit: s |
| divingCount | number | No | No | Number of dives. |
| divingMode | number | No | No | Diving mode. The options are: **0**: freediving **1**: recreational diving **2**: technical diving **3**: gauge diving |
| maxUnderwaterTime | number | No | Yes | Maximum duration of a single dive. If this field is not set, it is empty by default. Unit: s |
| underwaterTime | number | No | Yes | Underwater time. If this field is not set, it is empty by default. Unit: s |
| noFlyTime | number | No | Yes | No-fly time. If this field is not set, it is empty by default. Unit: h |
| waterType | number | No | Yes | Water type. If this field is not set, it is empty by default. The options are: **0**: custom **1**: fresh water **2**: sea water |
| waterDensity | number | No | Yes | Water density. If this field is not set, it is empty by default. Unit: kg/L |
| maxAscentSpeed | number | No | Yes | Maximum ascent speed. If this field is not set, it is empty by default. Unit: m/s |
| maxDescentSpeed | number | No | Yes | Maximum descent speed. If this field is not set, it is empty by default. Unit: m/s |

#### DivingSummary

List of data fields about freediving statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| divingFeature | [DivingFeature](#divingfeature) | No | No | Freediving features. |
| location | [LocationSummary](#locationsummary) | No | Yes | Location statistics. If this field is not set, it is empty by default. |
| divingDepth | [DivingDepthSummary](#divingdepthsummary) | No | Yes | Diving depth statistics. If this field is not set, it is empty by default. |
| waterTemperature | [WaterTemperatureSummary](#watertemperaturesummary) | No | Yes | Water temperature statistics. If this field is not set, it is empty by default. |

#### Dysmenorrhea

List of period pain level sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| level | number | No | No | Period pain level. The options are: **0**: not selected **1**: light **2**: moderate **3**: heavy |

#### EllipticalDetail

List of data fields about workout details on the elliptical.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| pedalingCadence | [PedalingCadence](#pedalingcadence)[] | No | Yes | List of pedaling cadence details. If this field is not set, it is empty by default. |
| power | [Power](#power)[] | No | Yes | List of power details. If this field is not set, it is empty by default. |
| cadence | [Cadence[]](#cadence) | No | Yes | List of step cadence details. If this field is not set, it is empty by default. |

#### EllipticalSummary

List of data fields about workout statistics on the elliptical.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| distance | [DistanceSummary](#distancesummary) | No | Yes | Distance statistics. If this field is not set, it is empty by default. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| speed | [SpeedSummary](#speedsummary) | No | Yes | Speed statistics. If this field is not set, it is empty by default. |
| step | [StepSummary](#stepsummary) | No | Yes | Step statistics. If this field is not set, it is empty by default. |
| cadence | [CadenceSummary](#cadencesummary) | No | Yes | Step cadence statistics. If this field is not set, it is empty by default. |
| resistance | [ResistanceSummary](#resistancesummary) | No | Yes | Resistance statistics. If this field is not set, it is empty by default. |
| pedalingCadence | [PedalingCadenceSummary](#pedalingcadencesummary) | No | Yes | Pedaling cadence statistics. If this field is not set, it is empty by default. |
| power | [PowerSummary](#powersummary) | No | Yes | Power statistics. If this field is not set, it is empty by default. |

#### Emotion

List of emotion sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| emotionStatus | number | No | No | Emotion status. Value range: [0, 100) Currently, the Huawei Health app only displays the following values: **1**: unpleasant **2**: neutral **3**: pleasant |

#### ExerciseHeartRate

List of data fields about workout heart rate details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bpm | number | No | No | Workout heart rate details. Unit: beats/minute Value range: (0, 255) |

#### ExerciseHeartRateSummary

type ExerciseHeartRateSummary = QuantitySummary

List of data fields about workout heart rate statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: beats/minute Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: beats/minute Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Unit: beats/minute Value range: [0, ∞) |

#### GolfCourseModelDetail

List of data fields about golf (course mode) details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |

#### GolfCourseModelFeature

List of data fields about golf (course mode) features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| golfSwingCount | number | No | No | Total swings. |
| courseId | number | No | No | Course ID. |
| holes | number | No | No | Number of holes. |
| branchId1 | number | No | Yes | Layer ID in the first half. If this field is not set, it is empty by default. |
| branchId2 | number | No | Yes | Layer ID in the second half. If this field is not set, it is empty by default. |
| gir | number | No | Yes | Green in regulation (GIR). If this field is not set, it is empty by default. |
| doubleEagle | number | No | Yes | Albatross. If this field is not set, it is empty by default. |
| eagle | number | No | Yes | Eagle. If this field is not set, it is empty by default. |
| birdie | number | No | Yes | Birdie. If this field is not set, it is empty by default. |
| par | number | No | Yes | Par. If this field is not set, it is empty by default. |
| bogey | number | No | Yes | Bogey. If this field is not set, it is empty by default. |
| doubleBogey | number | No | Yes | Double bogeys. If this field is not set, it is empty by default. |
| putts | number | No | Yes | Total putts. If this field is not set, it is empty by default. |
| avgPutts | number | No | Yes | Average putts. If this field is not set, it is empty by default. |
| par3 | number | No | Yes | Par-3. If this field is not set, it is empty by default. |
| par4 | number | No | Yes | Par-4. If this field is not set, it is empty by default. |
| par5 | number | No | Yes | Par-5. If this field is not set, it is empty by default. |
| fairwayHits | number | No | Yes | Fairway hits. If this field is not set, it is empty by default. |
| fairwayLeft | number | No | Yes | Hooks. If this field is not set, it is empty by default. |
| fairwayRight | number | No | Yes | Slices. If this field is not set, it is empty by default. |
| avgHandicap | number | No | Yes | Average over par. If this field is not set, it is empty by default. |
| bestHandicap | number | No | Yes | Best over par. If this field is not set, it is empty by default. |
| totalHandicap | number | No | Yes | Total over par. If this field is not set, it is empty by default. |

#### GolfCourseModelSummary

List of data fields about golf (course mode) statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| golfCourseModelFeature | [GolfCourseModelFeature](#golfcoursemodelfeature) | No | No | Golf (course mode) features. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| step | [StepSummary](#stepsummary) | No | No | Step count statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| distance | [DistanceSummary](#distancesummary) | No | Yes | Distance statistics. If this field is not set, it is empty by default. |
| cadence | [CadenceSummary](#cadencesummary) | No | Yes | Step cadence statistics. If this field is not set, it is empty by default. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |

#### GolfPracticeDetail

type GolfPracticeDetail = SportsDetail

List of data fields about golf (driving range mode) details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |

#### GolfPracticeFeature

List of data fields about golf (driving range mode) features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| golfSwingCount | number | No | No | Total swings. |
| golfSwingSpeed | number | No | Yes | Average swing speed. If this field is not set, it is empty by default. Unit: cm/s |
| golfMaxSwingSpeed | number | No | Yes | Maximum swing speed. If this field is not set, it is empty by default. Unit: cm/s |
| golfSwingTempo | number | No | Yes | Average swing tempo (average backswing time/average downswing time). If this field is not set, it is empty by default. |
| golfDownSwingTime | number | No | Yes | Average downswing time. If this field is not set, it is empty by default. Unit: ms |
| golfBackSwingTime | number | No | Yes | Average backswing time. If this field is not set, it is empty by default. Unit: ms |

#### GolfPracticeSummary

List of data fields about golf (driving range mode) statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| golfPracticeFeature | [GolfPracticeFeature](#golfpracticefeature) | No | No | Golf (driving range mode) features. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### HeartRate

List of dynamic heart rate sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bpm | number | No | No | Dynamic heart rate. Unit: beats/minute Value range: [0, ∞) |

#### HeartRateAggregation

List of data fields abut dynamic heart rate aggregates.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bpm | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'avg' \| 'sum' \| 'count'> | No | No | Dynamic heart rate aggregate. |

#### HeartRateVariability

List of heart rate variability sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| heartRateVariabilityRMSSD | number | No | No | Heart rate variability. Unit: ms Value range: (0, 200] |

#### Height

List of height sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| height | number | No | No | Height. Unit: cm |

#### Jump

List of data fields about jump details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| jumpHeight | number | No | No | Jump height. Unit: m |
| passageDuration | number | No | No | Hang time. Unit: ms |

#### JumpingRopeDetail

List of data fields about rope jumping details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| skipSpeed | [SkipSpeed](#skipspeed)[] | No | Yes | List of jump speed details. If this field is not set, it is empty by default. |

#### JumpingRopeFeature

List of data fields about rope jumping features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| skipNum | number | No | No | Number of rope jumps. Value range: [0, ∞) |
| interruptions | number | No | Yes | Number of interruptions. If this field is not set, it is empty by default. Value range: [0, ∞) |
| longestStreak | number | No | Yes | Longest streak. If this field is not set, it is empty by default. Value range: [0, ∞) |
| doubleUnders | number | No | Yes | Number of double-unders. If this field is not set, it is empty by default. Value range: [0, ∞) |
| tripleUnders | number | No | Yes | Number of triple-unders. If this field is not set, it is empty by default. Value range: [0, ∞) |

#### JumpingRopeSummary

List of data fields about rope jumping statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| jumpingRopeFeature | [JumpingRopeFeature](#jumpingropefeature) | No | No | Rope jumping features. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| skipSpeed | [SkipSpeedSummary](#skipspeedsummary) | No | No | Speed statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### JumpSummary

List of data fields about jump statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| jumpTimes | number | No | No | Jump times. |
| maxJumpHeight | number | No | Yes | Maximum jump height. If this field is not set, it is empty by default. Unit: m |
| maxPassageDuration | number | No | Yes | Maximum hang time. If this field is not set, it is empty by default. Unit: ms |

#### Location

List of data fields about location details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| latitude | number | No | No | Latitude. Unit: degree Value range: [–90, 90] |
| longitude | number | No | No | Longitude. Unit: degree Value range: [–180, 180] |

#### LocationSummary

List of data fields about location statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| coordinate | string | No | No | Coordinate system. The options are: **GCJ02** **WGS84** **BD09** |
| startLat | number | No | Yes | Latitude of the start point. If this field is not set, it is empty by default. Unit: degree Value range: [–90, 90] |
| endLat | number | No | Yes | Latitude of the end point. If this field is not set, it is empty by default. Unit: degree Value range: [–90, 90] |
| startLon | number | No | Yes | Longitude of the start point. If this field is not set, it is empty by default. Unit: degree Value range: [–180, 180] |
| endLon | number | No | Yes | Longitude of the end point. If this field is not set, it is empty by default. Unit: degree Value range: [–180, 180] |

#### MarkPoint

List of marked point sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| sn | number | No | No | Serial number. |
| type | number | No | No | Type of a marked point. The options are: **0**: general **1**: start **2**: camp **3**: left **4**: right **5**: straight **6**: danger **7**: beast **8**: health care **9**: water **10**: food **11**: bridge **12**: shelter **13**: top **14**: house **254**: end **255**: automatically marked point |
| longitude | number | No | No | Longitude. Unit: degree |
| latitude | number | No | No | Latitude. Unit: degree |
| mode | number | No | No | Marking mode. The options are: **0**: automatic **1**: manual |
| color | number | No | Yes | Color. If this field is not set, it is empty by default. The options are: **0**: orange **1**: red **2**: blue **3**: yellow **4**: gray **5**: green **255**: color of automatically marked points |

#### MenstrualCycle

List of menstrual cycle data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| status | number | No | No | Status. The options are: **0**: normal **100**: normal menstrual period **101**: first day of the menstrual period **102**: last day of the menstrual period **2**: day of ovulation **300**: normal predicted period **301**: first day of the predicted menstrual period **302**: last day of the predicted menstrual period **400**: normal fertile window **401**: first day of the fertile window **402**: last day of the fertile window **403**: one-day fertile window |
| remarks | string | No | Yes | Remarks. |

#### MenstrualCycleDetail

List of data fields about menstrual cycle details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| menstrualFlow | [MenstrualFlow](#menstrualflow)[] | No | Yes | Menstrual flow sampling list. If this field is not set, it is empty by default. |
| dysmenorrhea | [Dysmenorrhea](#dysmenorrhea)[] | No | Yes | Period pain level sampling list. If this field is not set, it is empty by default. |
| physicalSymptoms | [PhysicalSymptoms](#physicalsymptoms)[] | No | Yes | Physical condition sampling list. If this field is not set, it is empty by default. |
| mood | [Mood](#mood)[] | No | Yes | Mood sampling list. If this field is not set, it is empty by default. |
| skin | [Skin](#skin)[] | No | Yes | Skin status sampling list. If this field is not set, it is empty by default. |
| sexuality | [Sexuality](#sexuality)[] | No | Yes | Sexual behavior sampling list. If this field is not set, it is empty by default. |
| ovulationTestPaper | [OvulationTestPaper](#ovulationtestpaper)[] | No | Yes | Ovulation test paper sampling list. If this field is not set, it is empty by default. |
| cervicalMucus | [CervicalMucus](#cervicalmucus)[] | No | Yes | Cervical mucus sampling list. If this field is not set, it is empty by default. |

#### MenstrualFlow

List of menstrual flow sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| volume | number | No | No | Menstrual flow. The options are: **0**: not selected **1**: light **2**: normal **3**: heavy |

#### Mood

List of mood sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| mood | string | No | No | Mood. The value is a character string separated by commas (,), for example, **1,2,3**. The options are: **0**: happy **1**: sad **2**: sensitive **3**: anxious **4**: angry **5**: excited **6**: suppressed **7**: relaxed |

#### MountainHikeDetail

List of data fields about mountain hike details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| location | [Location](#location)[] | No | Yes | List of location details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |

#### MountainHikeSummary

List of data fields about mountain hike statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| step | [StepSummary](#stepsummary) | No | Yes | Step statistics. If this field is not set, it is empty by default. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |

#### OpenWaterSwimDetail

List of data fields about open water swimming details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| location | [Location](#location)[] | No | Yes | List of location details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| swimStrokeRate | [SwimStrokeRate](#swimstrokerate)[] | No | Yes | List of stroke rate details. If this field is not set, it is empty by default. |
| swolf | [Swolf](#swolf)[] | No | Yes | List of SWOLF details. If this field is not set, it is empty by default. |

#### OpenWaterSwimFeature

List of data fields about open water swimming features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| pullTimes | number | No | No | Stroke count. |
| swimmingStroke | number | No | Yes | Main swimming stroke. If this field is not set, it is empty by default. The options are: **1**: breaststroke **2**: freestyle **3**: butterfly **4**: backstroke **5**: medley |

#### OpenWaterSwimSummary

List of data fields about open water swimming statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| openWaterSwimFeature | [OpenWaterSwimFeature](#openwaterswimfeature) | No | No | Open water swimming features. |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| swimStrokeRate | [SwimStrokeRateSummary](#swimstrokeratesummary) | No | Yes | Stroke rate statistics. If this field is not set, it is empty by default. |
| swolf | [SwolfSummary](#swolfsummary) | No | Yes | SWOLF statistics. If this field is not set, it is empty by default. |

#### OvulationTestPaper

List of ovulation test paper sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| result | number | No | No | Result. The options are: **0**: not selected **1**: negative **2**: weak positive **3**: strong positive |

#### PedalingCadence

List of data fields about pedaling cadence details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| rpm | number | No | No | Pedaling cadence details. Unit: revolutions/minute Value range: [0, ∞) |

#### PedalingCadenceSummary

type PedalingCadenceSummary = QuantitySummary

List of data fields about pedaling cadence statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: revolutions/minute Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: revolutions/minute Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Unit: revolutions/minute Value range: [0, ∞) |

#### PhysicalSymptoms

List of physical symptom sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| physicalSymptoms | string | No | No | Physical symptom. The value is a character string separated by commas (,), for example, **1,2,3**. The options are: **1**: abdominal swelling and pain **2**: fatigue **3**: vomiting **4**: lumbar back pain **6**: dizziness **7**: headache **8**: breast pain **9**: abdominal pain **10**: normal **11**: muscle cramps **12**: swollen **13**: insomnia **14**: diarrhea **15**: small abdomen pain **16**: hot flashes **17**: spotting |

#### PoolSwimDetail

List of data fields about pool swimming details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| swimStrokeRate | [SwimStrokeRate](#swimstrokerate)[] | No | Yes | List of stroke rate details. If this field is not set, it is empty by default. |
| swolf | [Swolf](#swolf)[] | No | Yes | List of SWOLF details. If this field is not set, it is empty by default. |

#### PoolSwimFeature

List of data fields about pool swimming features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| pullTimes | number | No | No | Stroke count. |
| tripTimes | number | No | No | Number of trips. |
| poolLength | number | No | Yes | Swimming pool length. If this field is not set, it is empty by default. Unit: m |
| swimmingStroke | number | No | Yes | Main swimming stroke. If this field is not set, it is empty by default. The options are: **1**: breaststroke **2**: freestyle **3**: butterfly **4**: backstroke **5**: medley |

#### PoolSwimSummary

List of data fields about pool swimming statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| poolSwimFeature | [PoolSwimFeature](#poolswimfeature) | No | No | Pool swimming features. |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| speed | [SpeedSummary](#speedsummary) | No | Yes | Speed statistics. If this field is not set, it is empty by default. |
| swimStrokeRate | [SwimStrokeRateSummary](#swimstrokeratesummary) | No | Yes | Stroke rate statistics. If this field is not set, it is empty by default. |
| swolf | [SwolfSummary](#swolfsummary) | No | Yes | SWOLF statistics. If this field is not set, it is empty by default. |

#### Power

List of data fields about power details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| power | number | No | No | Power details. Unit: W Value range: [0, ∞) |

#### PowerSummary

type PowerSummary = QuantitySummary

List of data fields about power statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: W Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: W Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Unit: W Value range: [0, ∞) |

#### QuantitySummary

List of statistical data fields in the base class.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Value range: [0, ∞) |
| max | number | No | No | Maximum value. Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Value range: [0, ∞) |

#### Resistance

List of data fields about resistance details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| resLevel | number | No | No | Resistance level. Value range: [1, 100] |

#### ResistanceSummary

List of data fields about resistance statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| resLv1LowerLimit | number | No | No | Lower limit of resistance level 1. Value range: [1, 100] |
| resLv2LowerLimit | number | No | No | Lower limit of resistance level 2. Value range: [1, 100] |
| resLv3LowerLimit | number | No | No | Lower limit of resistance level 3. Value range: [1, 100] |
| resLv4LowerLimit | number | No | No | Lower limit of resistance level 4. Value range: [1, 100] |
| resLv5LowerLimit | number | No | No | Lower limit of resistance level 5. Value range: [1, 100] |
| resLv5UpperLimit | number | No | No | Upper limit of resistance level 5. Value range: [1, 100] |
| resLv1Duration | number | No | No | Workout duration at resistance level 1. Unit: min Value range: [0, ∞) |
| resLv2Duration | number | No | No | Workout duration at resistance level 2. Unit: min Value range: [0, ∞) |
| resLv3Duration | number | No | No | Workout duration at resistance level 3. Unit: min Value range: [0, ∞) |
| resLv4Duration | number | No | No | Workout duration at resistance level 4. Unit: min Value range: [0, ∞) |
| resLv5Duration | number | No | No | Workout duration at resistance level 5. Unit: min Value range: [0, ∞) |
| maxRes | number | No | Yes | Maximum resistance level that can be set for a device. If this field is not set, it is empty by default. Value range: [1, 100] |
| minRes | number | No | Yes | Minimum resistance level that can be set for a device. If this field is not set, it is empty by default. Value range: [1, 100] |

#### RestingHeartRate

List of resting heart rate data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| restBpm | number | No | No | Resting heart rate. Unit: beats/minute Value range: [0, ∞) |

#### RestingHeartRateAggregation

List of data fields abut resting heart rate aggregates.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| restBpm | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'sum' \| 'count' \| 'max' \| 'min' \| 'avg'> | No | No | Resting heart rate aggregate. |

#### RowerDetail

List of data fields about rower workout details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| power | [Power](#power)[] | No | Yes | List of power details. If this field is not set, it is empty by default. |
| resistance | [Resistance](#resistance)[] | No | Yes | List of resistance details. If this field is not set, it is empty by default. |
| strokeRate | [StrokeRate](#strokerate)[] | No | Yes | List of stroke rate details. If this field is not set, it is empty by default. |

#### RowerFeature

type RowerFeature = RowingFeature

List of data fields about rower workout features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| strokesNum | number | No | No | Cumulative number of strokes. |

#### RowerSummary

List of data fields about rower workout statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| rowerFeature | [RowerFeature](#rowerfeature) | No | No | Rower workout features. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| distance | [DistanceSummary](#distancesummary) | No | Yes | Distance statistics. If this field is not set, it is empty by default. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| speed | [SpeedSummary](#speedsummary) | No | Yes | Speed statistics. If this field is not set, it is empty by default. |
| resistance | [ResistanceSummary](#resistancesummary) | No | Yes | Resistance statistics. If this field is not set, it is empty by default. |
| power | [PowerSummary](#powersummary) | No | Yes | Power statistics. If this field is not set, it is empty by default. |
| strokeRate | [StrokeRateSummary](#strokeratesummary) | No | Yes | Stroke rate statistics. If this field is not set, it is empty by default. |

#### RowingDetail

List of data fields about rowing details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| strokeRate | [StrokeRate](#strokerate)[] | No | Yes | List of stroke rate details. If this field is not set, it is empty by default. |

#### RowingFeature

List of data fields about rowing features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| strokesNum | number | No | No | Cumulative number of strokes. |

#### RowingSummary

List of data fields about rowing statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| rowingFeature | [RowingFeature](#rowingfeature) | No | No | Rowing features. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| distance | [DistanceSummary](#distancesummary) | No | Yes | Distance statistics. If this field is not set, it is empty by default. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| strokeRate | [StrokeRateSummary](#strokeratesummary) | No | Yes | Stroke rate statistics. If this field is not set, it is empty by default. |

#### RunningDetail

List of data fields about running details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| cadence | [Cadence](#cadence)[] | No | Yes | List of step cadence details. If this field is not set, it is empty by default. |
| runningForm | [RunningForm](#runningform)[] | No | Yes | List of running form details. If this field is not set, it is empty by default. |
| location | [Location](#location)[] | No | Yes | List of location details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |

#### RunningFeature

List of data fields about running features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avgPace | number | No | No | Average pace. Value range: [0, ∞) Unit: s/km |
| bestPace | number | No | No | Fastest pace. Value range: [0, ∞) Unit: s/km |
| paceMap | [healthStore.PaceValueType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#pacevaluetype) | No | Yes | Pace per kilometer. If this field is not set, it is empty by default. Unit: s/km Examples: **1.0**: **407.945** **2.0**: **473.98846** **2.170**: **473.98846** For the last part of distance, if it is less than one kilometer, the pace will be converted in proportion and then be stored. |
| partTimeMap | [healthStore.PaceValueType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#pacevaluetype) | No | Yes | Segment data table in the metric system (key: kilometer; value: second). If this field is not set, it is empty by default. When kilometer is used, the distance value is accurate to the fourth decimal place. The value is the time taken to cover the current distance. Examples: - **1.0**: **3.0** - **2.0**: **6.0** - **3.0**: **9.0** - **21.0975**: **7020.0** - **42.195**: **18000.0** **21.0975** and **42.195** are the distances of the half marathon and full marathon, respectively. Except for these two types of race, the decimal places for others are 0. |

#### RunningForm

List of data fields about running form details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| groundContactTime | number | No | No | Ground contact time. Unit: ms Value range: [0, 5000] |
| groundImpactAcceleration | number | No | Yes | Landing impact. If this field is not set, it is empty by default. Unit: g (gravity acceleration) Value range: [0, 50] |
| swingAngle | number | No | Yes | Swing angle. If this field is not set, it is empty by default. Unit: degree Value range: [0, 360] |
| eversionExcursion | number | No | Yes | Eversion angle. If this field is not set, it is empty by default. Unit: degree Value range: [–100, 100] |
| hangTime | number | No | Yes | Hang time. If this field is not set, it is empty by default. Unit: ms Value range: [0, 500] |
| groundHangTimeRate | number | No | Yes | Flight ratio. If this field is not set, it is empty by default. Value range: [0, 500] |
| foreFootStrikePattern | number | No | Yes | Number of forefoot strikes. If this field is not set, it is empty by default. Value range: [0, 100] |
| hindFootStrikePattern | number | No | Yes | Number of rearfoot strikes. If this field is not set, it is empty by default. Value range: [0, 100] |
| wholeFootStrikePattern | number | No | Yes | Number of full foot strikes. If this field is not set, it is empty by default. Value range: [0, 100] |
| impactPeak | number | No | Yes | Active peak. If this field is not set, it is empty by default. Unit: BW (multiples of body weight) Value range: [0, 10] |
| verticalOscillation | number | No | Yes | Vertical oscillation. If this field is not set, it is empty by default. Unit: cm Value range: [0, 25.6] |
| verticalRatio | number | No | Yes | Vertical stride ratio. If this field is not set, it is empty by default. Unit: % Value range: [0, 100] |
| gcTimeBalance | number | No | Yes | Ground contact time balance. If this field is not set, it is empty by default. Unit: % (The return value is the ground contact balance of the left foot. The value of the right foot needs to be calculated separately. The sum of the two values is 100%.) Value range: [0, 100] |

#### RunningFormSummary

List of data fields about running form statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avgGroundContactTime | number | No | No | Average ground contact time. Unit: ms Value range: [0, 5000] |
| avgGroundImpactAcceleration | number | No | Yes | Average landing impact. If this field is not set, it is empty by default. Unit: g (gravity acceleration) |
| avgSwingAngle | number | No | Yes | Average swing angle. If this field is not set, it is empty by default. Unit: degree |
| avgEversionExcursion | number | No | Yes | Average eversion angle. If this field is not set, it is empty by default. Unit: degree |
| avgHangTime | number | No | Yes | Average hang time. If this field is not set, it is empty by default. Unit: ms |
| avgGroundHangTimeRate | number | No | Yes | Average flight ratio. If this field is not set, it is empty by default. |
| foreFootStrikePattern | number | No | Yes | Number of forefoot strikes. If this field is not set, it is empty by default. |
| hindFootStrikePattern | number | No | Yes | Number of rearfoot strikes. If this field is not set, it is empty by default. |
| wholeFootStrikePattern | number | No | Yes | Number of full foot strikes. If this field is not set, it is empty by default. |
| avgImpactPeak | number | No | Yes | Average active peak. If this field is not set, it is empty by default. Unit: BW (multiples of body weight) |
| avgVerticalImpactRate | number | No | Yes | Average impact loading rate. If this field is not set, it is empty by default. Unit: BW/s |
| avgVerticalOscillation | number | No | Yes | Average vertical oscillation. If this field is not set, it is empty by default. Unit: cm |
| avgVerticalRatio | number | No | Yes | Average vertical stride ratio. If this field is not set, it is empty by default. Unit: % |
| avgGcTimeBalance | number | No | Yes | Average ground contact time balance. If this field is not set, it is empty by default. Unit: % (The return value is the ground contact balance of the left foot. The value of the right foot needs to be calculated separately. The sum of the two values is 100%.) |

#### RunningSummary

List of data fields about running statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| speed | [SpeedSummary](#speedsummary) | No | No | Speed statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| step | [StepSummary](#stepsummary) | No | Yes | Step statistics. If this field is not set, it is empty by default. |
| cadence | [CadenceSummary](#cadencesummary) | No | Yes | Step cadence statistics. If this field is not set, it is empty by default. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |
| location | [LocationSummary](#locationsummary) | No | Yes | Location statistics. If this field is not set, it is empty by default. |
| runningForm | [RunningFormSummary](#runningformsummary) | No | Yes | Running form statistics. If this field is not set, it is empty by default. |
| runningFeature | [RunningFeature](#runningfeature) | No | Yes | Running features. If this field is not set, it is empty by default. |

#### ScubaDivingDetail

List of data fields about scuba diving details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| divingDepth | [DivingDepth](#divingdepth)[] | No | Yes | List of diving depth details. If this field is not set, it is empty by default. |
| waterTemperature | [WaterTemperature](#watertemperature)[] | No | Yes | List of water temperature details. If this field is not set, it is empty by default. |

#### ScubaDivingFeature

List of data fields about scuba diving features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| divingTime | number | No | No | Diving time. Unit: s |
| divingCount | number | No | No | Number of dives. |
| divingMode | number | No | No | Diving mode. The options are: **0**: freediving **1**: recreational diving **2**: technical diving **3**: gauge diving |
| maxUnderwaterTime | number | No | Yes | Maximum duration of a single dive. If this field is not set, it is empty by default. Unit: s |
| underwaterTime | number | No | Yes | Underwater time. If this field is not set, it is empty by default. Unit: s |
| noFlyTime | number | No | Yes | No-fly time. If this field is not set, it is empty by default. Unit: h |
| cns | number | No | Yes | Central nervous system (CNS) toxicity grade. If this field is not set, it is empty by default. Grade: 1: 0%–79% 2: 80%–99% 3: ≥ 100% |
| otu | number | No | Yes | Oxygen toxicity unit (OTU). If this field is not set, it is empty by default. Grade: 1: 0–249 2: 250–299 3: ≥ 300 |
| waterType | number | No | Yes | Water type. If this field is not set, it is empty by default. The options are: **0**: custom **1**: fresh water **2**: sea water |
| waterDensity | number | No | Yes | Water density. If this field is not set, it is empty by default. Unit: kg/L |
| maxAscentSpeed | number | No | Yes | Maximum ascent speed. If this field is not set, it is empty by default. Unit: m/s |
| maxDescentSpeed | number | No | Yes | Maximum descent speed. If this field is not set, it is empty by default. Unit: m/s |

#### ScubaDivingSummary

List of data fields about scuba diving statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| scubaDivingFeature | [ScubaDivingFeature](#scubadivingfeature) | No | No | Scuba diving features. |
| location | [LocationSummary](#locationsummary) | No | Yes | Location statistics. If this field is not set, it is empty by default. |
| divingDepth | [DivingDepthSummary](#divingdepthsummary) | No | Yes | Diving depth statistics. If this field is not set, it is empty by default. |
| waterTemperature | [WaterTemperatureSummary](#watertemperaturesummary) | No | Yes | Water temperature statistics. If this field is not set, it is empty by default. |

#### Sexuality

List of sexual activity sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| sexuality | number | No | No | Sexual activity. The options are: **0**: not selected **1**: none **2**: protected **3**: unprotected |

#### SkiingDetail

type SkiingDetail = MountainHikeDetail

List of data fields about skiing details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| location | [Location](#location)[] | No | Yes | List of location details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |

#### SkiingFeature

List of data fields about skiing features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| tripTimes | number | No | No | Number of trips. |
| maxSlopePercent | number | No | Yes | Maximum slope in percentages. If this field is not set, it is empty by default. |
| maxSlopeDegree | number | No | Yes | Maximum slope. If this field is not set, it is empty by default. Unit: degree |
| totalTime | number | No | Yes | Sliding duration. If this field is not set, it is empty by default. Unit: ms |
| totalDistance | number | No | Yes | Sliding distance. If this field is not set, it is empty by default. Unit: m |

#### SkiingSummary

List of data fields about skiing statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| skiingFeature | [SkiingFeature](#skiingfeature) | No | No | Skiing features. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### Skin

List of skin status sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| skinStatus | string | No | No | Skin status. The options are: **0**: not selected **1**: good **2**: oily **4**: dry **8**: acne **16**: pimple |

#### SkinTemperature

List of data fields about skin temperature details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| skinTemperature | number | No | No | Skin temperature. Unit: °C Value range: [20, 42] |

#### SkinTemperatureAggregation

List of data fields about skin temperature aggregates.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| skinTemperature | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'sum' \| 'last'> | No | No | Skin temperature aggregate. |

#### SkipSpeed

List of data fields about rope jumping speed details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| skipSpeed | number | No | No | Rope jumping speed details. Unit: jumps/minute Value range: [0, ∞) |

#### SkipSpeedSummary

type SkipSpeedSummary = QuantitySummary

List of data fields about rope jumping speed statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: jumps/minute Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: jumps/minute Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Unit: jumps/minute Value range: [0, ∞) |

#### SledDetail

List of data fields about sledding details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |

#### SledSummary

type SledSummary = SportsSummary

List of data fields about sledding statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### Sleep

List of nighttime sleep data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| fallAsleepTime | number | No | No | Earliest fall-asleep time in segment-based sleep data. Unit: ms Value range: [0, ∞) |
| wakeupTime | number | No | No | Latest wake-up time in segment-based sleep data. Unit: ms Value range: [0, ∞) |
| duration | number | No | No | Nighttime/Normal sleep duration (excluding naps). Unit: s Value range: [0, ∞) |
| bedTime | number | No | Yes | Earliest lie-down time. If this field is not set, it is empty by default. Value range: [0, ∞) |
| risingTime | number | No | Yes | Latest get-up time. If this field is not set, it is empty by default. Value range: [0, ∞) |
| prepareSleepTime | number | No | Yes | Time when the user lies down preparing for sleep. If this field is not set, it is empty by default. Unit: ms Value range: [0, ∞) |
| shallowDuration | number | No | Yes | Light sleep duration. If this field is not set, it is empty by default. Unit: s Value range: [0, ∞) |
| deepDuration | number | No | Yes | Deep sleep duration. If this field is not set, it is empty by default. Unit: s Value range: [0, ∞) |
| dreamDuration | number | No | Yes | REM sleep duration. If this field is not set, it is empty by default. Unit: s Value range: [0, ∞) |
| wakeDuration | number | No | Yes | Waking hours. If this field is not set, it is empty by default. Unit: s Value range: [0, ∞) |
| wakeCount | number | No | Yes | Wake-up times. If this field is not set, it is empty by default. Value range: [0, ∞) |
| onBedDuration | number | No | Yes | Time in bed. If this field is not set, it is empty by default. Unit: s Value range: [0, ∞) |
| recordDuration | number | No | Yes | Sleep record duration. If this field is not set, the default value is the end time minus the start time. Unit: s Value range: [0, ∞) |
| sleepEfficiency | number | No | Yes | Sleep efficiency. If this field is not set, it is empty by default. Value range: [0, 100] |
| sleepScore | number | No | Yes | Sleep score. If this field is not set, it is empty by default. Value range: [0, 100] |
| deepSleepContinuity | number | No | Yes | Deep sleep continuity. If this field is not set, it is empty by default. Value range: [0, 100] |
| respiratoryQualityScore | number | No | Yes | Respiratory quality. If this field is not set, it is empty by default. Value range: [0, 100] |
| turnOverCount | number | No | Yes | Roll-over times. If this field is not set, it is empty by default. Value range: [0, ∞) |
| sleepEndReason | number | No | Yes | Sleep end reason. If this field is not set, it is empty by default. Value range: [0, ∞) The options are: **0**: sleep monitoring ended manually **1**: sleep monitoring ended automatically **2**: sleep monitoring interrupted **3**: sleep monitoring ended due to a low battery level |
| sleepSymptoms | string | No | Yes | Sleep symptom. If this field is not set, it is empty by default. |
| sleepType | number | No | Yes | Sleep data type. The options are: **1**: TruSleep **2**: regular sleep **3**: manually recorded **4**: recorded by phone If this field is not set, the default value **2** is used. |

#### SleepDetail

List of data fields about sleep details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| sleepSegment | [SleepSegment](#sleepsegment)[] | No | Yes | List of sleep status sampling data. If this field is not set, the default value is **7**, indicating that an entire sleep is covered. |

#### SleepNap

List of nap data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| noonDuration | number | No | No | Nap duration. Unit: s Value range: [0, ∞) |
| noonRecordDuration | number | No | Yes | Nap record duration. If this field is not set, the default value is the end time minus the start time. Unit: s Value range: [0, ∞) |

#### SleepSegment

List of sleep status sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| sleepStatus | number | No | No | Sleep status. The options are: **0**: unknown **1**: deep sleep **2**: light sleep **3**: REM sleep **4**: awake **5**: nap **6**: in bed **7**: sleeping (manually recorded) |
| endTime | number | No | No | End time. Unit: ms Value range: [0, ∞) |

#### SnowboardingDetail

type SnowboardingDetail = MountainHikeDetail

List of data fields about snowboarding details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| location | [Location](#location)[] | No | Yes | List of location details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |

#### SnowboardingFeature

type SnowboardingFeature = SkiingFeature

List of data fields about snowboarding features.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| tripTimes | number | No | No | Number of trips. |
| maxSlopePercent | number | No | Yes | Maximum slope in percentages. If this field is not set, it is empty by default. |
| maxSlopeDegree | number | No | Yes | Maximum slope. If this field is not set, it is empty by default. Unit: degree |
| totalTime | number | No | Yes | Sliding duration. If this field is not set, it is empty by default. Unit: ms |
| totalDistance | number | No | Yes | Sliding distance. If this field is not set, it is empty by default. Unit: m |

#### SnowboardingSummary

List of data fields about snowboarding statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| snowboardingFeature | [SnowboardingFeature](#snowboardingfeature) | No | No | Snowboarding features. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### Speed

List of data fields about speed details, which are inherited from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| speed | number | No | No | Speed details. Unit: m/s Value range: [0, ∞) |

#### SpeedSummary

type SpeedSummary = QuantitySummary

List of data fields about speed statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: m/s Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: m/s Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Unit: m/s Value range: [0, ∞) |

#### SportsDetail

List of data fields about general details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |

#### SportsSummary

List of data fields about general statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |

#### StepSummary

List of data fields about step statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| totalSteps | number | No | No | Total steps. Value range: (0, ∞) |

#### Stress

List of stress sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| stressScore | number | No | No | Stress score. Value range: [1, 99] |

#### StressAggregation

List of data fields about stress score aggregates.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| stressScore | Omit<[AggregateMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregatemetrics), 'sum'> | No | No | Stress score aggregate. |

#### StrokeRate

List of stroke rate sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| spm | number | No | No | Stroke rate. Unit: strokes/minute |

#### StrokeRateSummary

type StrokeRateSummary = Omit<QuantitySummary, 'min'>

List of data fields about stroke rate statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: strokes/minute Value range: [0, ∞) |
| max | number | No | No | Maximum value. Unit: strokes/minute Value range: [0, ∞) |

#### SwimStrokeRate

List of swimming stroke rate sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| spm | number | No | No | Swimming stroke rate. Unit: strokes/minute |

#### SwimStrokeRateSummary

type SwimStrokeRateSummary = Omit<QuantitySummary, 'max' | 'min'>

List of data fields about swimming stroke rate statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Unit: strokes/minute Value range: [0, ∞) |

#### Swolf

List of SWOLF sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| swolf | number | No | No | SWOLF. |

#### SwolfSummary

type SwolfSummary = QuantitySummary

List of data fields about SWOLF statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| avg | number | No | No | Average value. Value range: [0, ∞) |
| max | number | No | No | Maximum value. Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Value range: [0, ∞) |

#### WalkingDetail

List of data fields about fast walking details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | Yes | List of workout heart rate details. If this field is not set, it is empty by default. |
| speed | [Speed](#speed)[] | No | Yes | List of speed details. If this field is not set, it is empty by default. |
| cadence | [Cadence](#cadence)[] | No | Yes | List of step cadence details. If this field is not set, it is empty by default. |
| location | [Location](#location)[] | No | Yes | List of location details. If this field is not set, it is empty by default. |
| altitude | [Altitude](#altitude)[] | No | Yes | List of altitude details. If this field is not set, it is empty by default. |

#### WalkingSummary

List of data fields about fast walking statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| distance | [DistanceSummary](#distancesummary) | No | No | Distance statistics. |
| calorie | [CalorieSummary](#caloriesummary) | No | No | Calorie statistics. |
| speed | [SpeedSummary](#speedsummary) | No | No | Speed statistics. |
| exerciseHeartRate | [ExerciseHeartRateSummary](#exerciseheartratesummary) | No | Yes | Workout heart rate statistics. If this field is not set, it is empty by default. |
| step | [StepSummary](#stepsummary) | No | Yes | Step statistics. If this field is not set, it is empty by default. |
| cadence | [CadenceSummary](#cadencesummary) | No | Yes | Step cadence statistics. If this field is not set, it is empty by default. |
| altitude | [AltitudeSummary](#altitudesummary) | No | Yes | Altitude statistics. If this field is not set, it is empty by default. |
| location | [LocationSummary](#locationsummary) | No | Yes | Location statistics. If this field is not set, it is empty by default. |

#### WaterTemperature

List of water temperature sampling data fields, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| temperature | number | No | No | Temperature. Unit: °C |

#### WaterTemperatureSummary

type WaterTemperatureSummary = Omit<QuantitySummary, 'avg'>

List of data fields about water temperature statistics.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| max | number | No | No | Maximum value. Unit: °C Value range: [0, ∞) |
| min | number | No | Yes | Minimum value. If this field is not set, it is empty by default. Unit: °C Value range: [0, ∞) |

#### Weight

List of weight sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bodyWeight | number | No | No | Weight. Unit: kg Value range: [0.1, 500] |
| bmi | number | No | Yes | Body mass index (BMI). If this field is not set, it is empty by default. Unit: kg/m² Value range: [1, 200] |
| bodyFat | number | No | Yes | Body fat. If this field is not set, it is empty by default. Unit: kg Value range: [0, 500] |
| bodyFatRate | number | No | Yes | Body fat percentage. If this field is not set, it is empty by default. Unit: % Value range: [0, 100] |
| muscleMass | number | No | Yes | Muscle mass. If this field is not set, it is empty by default. Unit: kg Value range: [0.1, 150] |
| basalMetabolism | number | No | Yes | Basal metabolic rate. If this field is not set, it is empty by default. Unit: kcal/day Value range: [0, ∞) |
| moisture | number | No | Yes | Body water. If this field is not set, it is empty by default. Unit: kg Value range: [0, 500] |
| moistureRate | number | No | Yes | Body water percentage. If this field is not set, it is empty by default. Unit: % Value range: [0, 100] |
| visceralFatLevel | number | No | Yes | Visceral fat level. If this field is not set, it is empty by default. Value range: [1, 59] |
| boneSalt | number | No | Yes | Bone mineral content. If this field is not set, it is empty by default. Unit: kg Value range: [0.5, 5] |
| proteinRate | number | No | Yes | Protein rate. If this field is not set, it is empty by default. Unit: % Value range: [0, 100] |
| bodyScore | number | No | Yes | Body score. If this field is not set, it is empty by default. Unit: % Value range: [0, 100] |
| bodyAge | number | No | Yes | Body age. If this field is not set, it is empty by default. Value range: [5, 99] |
| skeletalMuscleMass | number | No | Yes | Skeletal muscle mass. If this field is not set, it is empty by default. Unit: kg Value range: [1, 150] |
| impedance | number | No | Yes | Impedance. Unit: ohm Value range: [0.1, 100000] |
