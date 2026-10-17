<!--
  Title: healthFields (Health and Fitness Data Fields) (Lite)
  Catalog: harmonyos-references
  Document ID: health-api-healthfields-lite
  Updated: 2026-10-14 09:35:53
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields-lite
-->
# healthFields (Health and Fitness Data Fields) (Lite)

This module provides a list of health and fitness data fields.

**Since:** 6.1.1(24)

#### Modules to Import

```javascript
import healthStore from '@hms.health.store';
```

> **Note:** This module is a sub-module of **healthStore** and needs to be used in **healthStore.healthFields** mode.

#### Altitude

List of data fields about altitude details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| altitude | number | No | No | Altitude. Unit: m |

#### ExerciseHeartRate

List of data fields about workout heart rate details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bpm | number | No | No | Workout heart rate details. Unit: beats/minute Value range: (0, 255) |

#### Speed

List of data fields about speed details, which inherits from [healthStore.SequencePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#sequencepoint).

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| speed | number | No | No | Speed details. Unit: m/s Value range: [0, ∞) |

#### GroupSummary

List of data fields about strength training group details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| trainingWeight | number[] | Yes | Training weight. The maximum length of the array is 10. |
| groupCount | number[] | Yes | Number of training groups. The maximum array length is 10. |
| groupTime | number[] | Yes | Training duration of each group. The maximum length of the array is 10. |

#### ActionSummary

List of data fields about strength training action details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| actionName | string | Yes | Action name. The value can contain a maximum of 50 bytes. |
| groupRestingTime | number | Yes | Rest time between groups. |
| actionTimes | number | No | Number of current training action groups. The default value is **0**. The value range is [0, 10]. |
| trainingVolume | number | No | Total training weight. The default value is **0**. |
| weightUnit | 'kg' \| 'lbs' | No | Training weight unit. The default value is **kg**. |
| groups | [GroupSummary](#groupsummary)[] | Yes | Details about the number of training groups. |

#### BadmintonDetail

List of data fields about badminton details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | List of workout heart rate details. If this field is not set, it is empty by default. |

#### BadmintonSummary

List of data fields about badminton statistics.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| startTime | number | Yes | Workout start time, which is a Unix timestamp in milliseconds. |
| totalTime | number | Yes | Total workout duration, in seconds. |
| targetDuration | number | No | Target workout duration, in seconds. The default value is **0**. |
| avgHeartRate | number | No | Average heart rate during the entire workout, in bpm. The default value is **0**. |
| maxHeartRate | number | No | Maximum heart rate during the workout, in bpm. The default value is **0**. |
| mHeartrateZoneType | number | No | Heart rate zone type. The value **0** indicates the maximum heart rate zone, and the value **1** indicates the heart rate reserve zone. The default value is **0**. |
| startHeartRate | number | No | Heart rate when heart rate measurement starts, in bpm. The default value is **0**. |
| endHeartRate | number | No | Heart rate when heart rate measurement ends, in bpm. The default value is **0**. |
| loadPeakLevel | number | No | Peak level of the workout load. A higher level indicates a better workout effect. The default value is **0**. |
| aerobicTrainingStress | number | No | Aerobic training stress, which quantifies the aerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| anaerobicTrainingStress | number | No | Anaerobic training stress, which quantifies the anaerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| recoveryTime | number | No | Estimated recovery time, in hours. The default value is **0**. |
| totalCalories | number | Yes | Total calories burned during the workout, including basal metabolism and activity consumption. The unit is cal. The value range is (0, ∞). |
| activeCalorie | number | Yes | Calories burned during the workout, excluding basal metabolism. The unit is cal. The value range is (0, ∞). |
| avgShotSpeed | number | No | Average shot speed, in km/h. The value range is [0, 500]. The default value is **0**. |
| maxShotSpeed | number | No | Maximum shot speed, in km/h. The value range is [0, 500]. The default value is **0**. |
| shots | number | No | Total number of shots. The value range is [0, 20000]. The default value is **0**. |
| maxContinuousRally | number | No | Maximum number of consecutive rallies. The value range is [0, 10000]. The default value is **0**. |
| forehandStroke | number | No | Number of forehand shots. The value range is [0, 10000]. The default value is **0**. |
| backhandStroke | number | No | Number of backhand shots. The value range is [0, 10000]. The default value is **0**. |
| overhandStroke | number | No | Number of overhead shots, such as serves and smashes. The value range is [0, 10000]. The default value is **0**. |
| underhandStroke | number | No | Number of underhand shots, such as lifts and drops. The value range is [0, 10000]. The default value is **0**. |
| smash | number | No | Number of smashes. The value range is [0, 10000]. The default value is **0**. |
| highClear | number | No | Number of clears. The value range is [0, 10000]. The default value is **0**. |

#### SoccerDetail

List of data fields about soccer details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | List of workout heart rate details. If this field is not set, it is empty by default. |

#### SoccerSummary

List of data fields about soccer statistics.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| startTime | number | Yes | Workout start time, which is a Unix timestamp in milliseconds. |
| totalTime | number | Yes | Total workout duration, in seconds. |
| targetDuration | number | No | Target workout duration, in seconds. The default value is **0**. |
| avgHeartRate | number | No | Average heart rate during the entire workout, in bpm. The default value is **0**. |
| maxHeartRate | number | No | Maximum heart rate during the workout, in bpm. The default value is **0**. |
| mHeartrateZoneType | number | No | Heart rate zone type. The value **0** indicates the maximum heart rate zone, and the value **1** indicates the heart rate reserve zone. The default value is **0**. |
| startHeartRate | number | No | Heart rate when heart rate measurement starts, in bpm. The default value is **0**. |
| endHeartRate | number | No | Heart rate when heart rate measurement ends, in bpm. The default value is **0**. |
| loadPeakLevel | number | No | Peak level of the workout load. A higher level indicates a better workout effect. The default value is **0**. |
| aerobicTrainingStress | number | No | Aerobic training stress, which quantifies the aerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| anaerobicTrainingStress | number | No | Anaerobic training stress, which quantifies the anaerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| recoveryTime | number | No | Estimated recovery time, in hours. The default value is **0**. |
| totalCalories | number | Yes | Total calories burned during the workout, including basal metabolism and activity consumption. The unit is cal. The value range is (0, ∞). |
| activeCalorie | number | Yes | Calories burned during the workout, excluding basal metabolism. The unit is cal. The value range is (0, ∞). |
| goalsTimes | number | No | Number of goals. The value range is [0, 10000]. The default value is **0**. |
| assistsTimes | number | No | Number of assists. The value range is [0, 10000]. The default value is **0**. |

#### StrengthTrainingSummary

List of data fields about strength training statistics.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| startTime | number | Yes | Workout start time, which is a Unix timestamp in milliseconds. |
| totalTime | number | Yes | Total workout duration, in seconds. |
| targetDuration | number | No | Target workout duration, in seconds. The default value is **0**. |
| avgHeartRate | number | No | Average heart rate during the entire workout, in bpm. The default value is **0**. |
| maxHeartRate | number | No | Maximum heart rate during the workout, in bpm. The default value is **0**. |
| mHeartrateZoneType | number | No | Heart rate zone type. The value **0** indicates the maximum heart rate zone, and the value **1** indicates the heart rate reserve zone. The default value is **0**. |
| startHeartRate | number | No | Heart rate when heart rate measurement starts, in bpm. The default value is **0**. |
| endHeartRate | number | No | Heart rate when heart rate measurement ends, in bpm. The default value is **0**. |
| loadPeakLevel | number | No | Peak level of the workout load. A higher level indicates a better workout effect. The default value is **0**. |
| aerobicTrainingStress | number | No | Aerobic training stress, which quantifies the aerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| anaerobicTrainingStress | number | No | Anaerobic training stress, which quantifies the anaerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| recoveryTime | number | No | Estimated recovery time, in hours. The default value is **0**. |
| totalCalories | number | Yes | Total calories burned during the workout, including basal metabolism and activity consumption. The unit is cal. The value range is (0, ∞). |
| activeCalorie | number | Yes | Calories burned during the workout, excluding basal metabolism. The unit is cal. The value range is (0, ∞). |
| actionCount | number | No | Number of actions. The default value is **0**. |
| totalTrainingVolume | number | No | Total training capacity, in kg. The default value is **0**. |
| actionGroups | number | No | Total number of groups. The default value is **0**. |
| rpe | number | No | Subjective fatigue level. A larger value indicates a higher fatigue level. The value range is [1, 10]. The default value is **0**. |
| actions | [healthFields.ActionSummary](#actionsummary)[] | No | Number of action type groups. This field is empty by default. |

#### StrengthTrainingDetail

List of data fields about strength training record details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| heartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | List of workout heart rate details. If this field is not set, it is empty by default. |

#### TennisSummary

List of data fields about tennis statistics.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| startTime | number | Yes | Workout start time, which is a Unix timestamp in milliseconds. |
| totalTime | number | Yes | Total workout duration, in seconds. |
| targetDuration | number | No | Target workout duration, in seconds. The default value is **0**. |
| avgHeartRate | number | No | Average heart rate during the entire workout, in bpm. The default value is **0**. |
| maxHeartRate | number | No | Maximum heart rate during the workout, in bpm. The default value is **0**. |
| mHeartrateZoneType | number | No | Heart rate zone type. The value **0** indicates the maximum heart rate zone, and the value **1** indicates the heart rate reserve zone. The default value is **0**. |
| startHeartRate | number | No | Heart rate when heart rate measurement starts, in bpm. The default value is **0**. |
| endHeartRate | number | No | Heart rate when heart rate measurement ends, in bpm. The default value is **0**. |
| loadPeakLevel | number | No | Peak level of the workout load. A higher level indicates a better workout effect. The default value is **0**. |
| aerobicTrainingStress | number | No | Aerobic training stress, which quantifies the aerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| anaerobicTrainingStress | number | No | Anaerobic training stress, which quantifies the anaerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| recoveryTime | number | No | Estimated recovery time, in hours. The default value is **0**. |
| totalCalories | number | Yes | Total calories burned during the workout, including basal metabolism and activity consumption. The unit is cal. The value range is (0, ∞). |
| activeCalorie | number | Yes | Calories burned during the workout, excluding basal metabolism. The unit is cal. The value range is (0, ∞). |
| forehand | number | No | Total number of forehand shots. The default value is **0**. |
| backhand | number | No | Total number of backhand shots. The default value is **0**. |
| swingTimes | number | Yes | Total number of swings (including all forehand serves, forehand shots, and backhand shots). |
| maxContinuousRally | number | Yes | Maximum number of consecutive shots. |

#### TennisDetail

List of data fields about tennis details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | List of workout heart rate details. If this field is not set, it is empty by default. |

#### StairClimbSummary

List of data fields about stair climbing statistics.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| startTime | number | Yes | Workout start time, which is a Unix timestamp in milliseconds. |
| totalTime | number | Yes | Total workout duration, in seconds. |
| targetDuration | number | No | Target workout duration, in seconds. The default value is **0**. |
| avgHeartRate | number | No | Average heart rate during the entire workout, in bpm. The default value is **0**. |
| maxHeartRate | number | No | Maximum heart rate during the workout, in bpm. The default value is **0**. |
| mHeartrateZoneType | number | No | Heart rate zone type. The value **0** indicates the maximum heart rate zone, and the value **1** indicates the heart rate reserve zone. The default value is **0**. |
| startHeartRate | number | No | Heart rate when heart rate measurement starts, in bpm. The default value is **0**. |
| endHeartRate | number | No | Heart rate when heart rate measurement ends, in bpm. The default value is **0**. |
| loadPeakLevel | number | No | Peak level of the workout load. A higher level indicates a better workout effect. The default value is **0**. |
| aerobicTrainingStress | number | No | Aerobic training stress, which quantifies the aerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| anaerobicTrainingStress | number | No | Anaerobic training stress, which quantifies the anaerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| recoveryTime | number | No | Estimated recovery time, in hours. The default value is **0**. |
| totalCalories | number | Yes | Total calories burned during the workout, including basal metabolism and activity consumption. The unit is cal. The value range is (0, ∞). |
| activeCalorie | number | Yes | Calories burned during the workout, excluding basal metabolism. The unit is cal. The value range is (0, ∞). |
| totalSteps | number | Yes | Total step count. |
| elevationGain | number | Yes | Total elevation gain. |
| floors | number | No | Number of floors climbed. The default value is **0**. |
| avgFloorSpeed | number | Yes | Average number of floors per minute. |

#### StairClimbDetail

List of data fields about stair climbing details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | List of workout heart rate details. If this field is not set, it is empty by default. |

#### PickleBallSummary

List of data fields about pickleball statistics.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| startTime | number | Yes | Workout start time, which is a Unix timestamp in milliseconds. |
| totalTime | number | Yes | Total workout duration, in seconds. |
| targetDuration | number | No | Target workout duration, in seconds. The default value is **0**. |
| avgHeartRate | number | No | Average heart rate during the entire workout, in bpm. The default value is **0**. |
| maxHeartRate | number | No | Maximum heart rate during the workout, in bpm. The default value is **0**. |
| mHeartrateZoneType | number | No | Heart rate zone type. The value **0** indicates the maximum heart rate zone, and the value **1** indicates the heart rate reserve zone. The default value is **0**. |
| startHeartRate | number | No | Heart rate when heart rate measurement starts, in bpm. The default value is **0**. |
| endHeartRate | number | No | Heart rate when heart rate measurement ends, in bpm. The default value is **0**. |
| loadPeakLevel | number | No | Peak level of the workout load. A higher level indicates a better workout effect. The default value is **0**. |
| aerobicTrainingStress | number | No | Aerobic training stress, which quantifies the aerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| anaerobicTrainingStress | number | No | Anaerobic training stress, which quantifies the anaerobic exercise load. The value range is [0.0, 5.0]. The default value is **0**. |
| recoveryTime | number | No | Estimated recovery time, in hours. The default value is **0**. |
| totalCalories | number | Yes | Total calories burned during the workout, including basal metabolism and activity consumption. The unit is cal. The value range is (0, ∞). |
| activeCalorie | number | Yes | Calories burned during the workout, excluding basal metabolism. The unit is cal. The value range is (0, ∞). |
| forehand | number | No | Total number of forehand shots. The default value is **0**. |
| backhand | number | No | Total number of backhand shots. The default value is **0**. |
| swingTimes | number | No | Total number of swings (including all forehand serves, forehand shots, and backhand shots). The default value is **0**. |
| maxContinuousRally | number | No | Maximum number of consecutive shots. The default value is **0**. |

#### PickleBallDetail

List of data fields about pickleball details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseHeartRate | [ExerciseHeartRate](#exerciseheartrate)[] | No | List of workout heart rate details. If this field is not set, it is empty by default. |
