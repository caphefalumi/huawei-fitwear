<!--
  Title: healthService (Health and Fitness Linking Services)
  Catalog: harmonyos-references
  Document ID: health-api-healthservice
  Updated: 2026-10-14 09:35:38
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice
-->
# healthService (Health and Fitness Linking Services)

This module provides health and fitness linking services.

**Description**

For the system capability SystemCapability.Health.HealthService, use [canIUse()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-syscap#caniuse) to check whether the current device supports this system capability and the corresponding APIs.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { healthService } from '@kit.HealthServiceKit';
```

#### SampleEvent

Linkage control event.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| eventId | number | No | No | Event ID. |
| eventLevel | number | No | No | Event level. The value range is [0, 255]. |
| eventData | string | No | No | Information carried in an event. |
| srcPkgName | string | No | Yes | Package name of the event sender. If this parameter is not set, it is empty by default. |
| destPkgName | string | No | Yes | Package name of the event receiver. If this parameter is not set, it is empty by default. |

#### SampleReal

SampleReal<K extends Record<string, [healthStore.HealthValueType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthvaluetype)> = Record<string, [healthStore.HealthValueType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthvaluetype)>>

Linkage real-time workout data.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataType | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | No | No | Real-time fused data type. |
| time | number | No | No | Generation time of real-time fused data. The value is a Unix timestamp, in milliseconds. |
| fields | Pick<K, keyof K> | No | No | Real-time fused data field. |
| deviceUniqueId | string | No | Yes | Real-time fused data source. If this parameter is not set, it is empty by default. |

#### workout

Provides real-time health and fitness data.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## ActivityReport

Real-time Activity rings data.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| steps | number | No | No | Step count. |
| stepsGoal | number | No | Yes | Step count goal. If this parameter is not set, the default goal displayed in the Huawei Health app cannot be read. |
| activeCalories | number | No | No | Active calories. Unit: cal |
| activeCaloriesGoal | number | No | Yes | Activity calorie goal. The default value is the default goal displayed in the Huawei Health app. Unit: cal |
| exercise | number | No | No | Workout duration. Unit: min |
| exerciseGoal | number | No | Yes | Workout duration goal. The default value is the default goal displayed in the Huawei Health app. Unit: min |
| activeHours | number | No | No | Number of active hours. If you are physically active for more than one minute during an hour, this hour will be counted as an active hour. |
| activeHoursGoal | number | No | Yes | Target number of active hours. If you are physically active for more than one minute during an hour, this hour will be counted as an active hour. The default value is the default target displayed in the Huawei Health app. |

## ConfigType

type ConfigType = number | string | boolean

Linkage configuration item type.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| number | The value can be any number. |
| string | The value can be any string. |
| boolean | The value can be **true** or **false**. The specific meaning varies depending on the actual situation. |

## DeviceState

Linkage device status.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Device ID. |
| state | number | No | No | Device status. |
| deviceName | string | No | Yes | Device name. If this parameter is not set, it is empty by default. |

## Goal

Linkage workout goal.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| type | number | No | No | Goal type. For details about the value, please refer to [TargetType](#targettype). |
| value | number | No | No | Goal value. |

## LinkageType

Linkage type.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| COURSE_LINK | 0 | Course linkage. |
| ACTIVITY_LINK | 1 | Workout linkage. |

## StartCode

Result code when the linking service is enabled.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| SUCCESS | 0 | The linking service is enabled successfully. |
| WORKOUT_WORKING | 1 | The linking service is started. |
| NO_SUPPORTED_DEVICE | 2 | No device supports the linking service. |
| DEVICE_BUSY | 3 | The linkage device is busy. |

## StartResult

Result of enabling the linking service.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| startCode | [StartCode](#startcode) | No | No | Result code when the linking service is enabled. |
| deviceState | [DeviceState](#devicestate)[] | No | No | Linkage device status. |

## SportInfo

Workout status information.

**System capability:** SystemCapability.Health.HealthService

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| sportType | number | No | No | Workout type. For details, please refer to the subdata type ID in [Workout Record Type Constants](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper). |
| sportState | [SportState](#sportstate) | No | No | Workout status. |

## SportState

Workout status type.

**System capability:** SystemCapability.Health.HealthService

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| IDLE | 0 | Initialized. |
| READY | 1 | Ready. |
| RUNNING | 2 | During the workout. |
| PAUSED | 3 | Paused. |
| STOPPED | 4 | Stopped. |

## TargetType

Linkage goal type.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| NONE | 0 | No goal. |
| DISTANCE | 1 | Distance. |
| CALORIE | 2 | Calories. |
| TIME | 3 | Duration. |
| SKIPPING_TIMES | 4 | Jump times. |

## WorkoutConfig

Linkage configuration item.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| linkageType | [LinkageType](#linkagetype) | No | No | Linkage type. |
| sportType | number | No | No | Workout type. For details, please refer to the subdata type ID in [Workout Record Type Constants](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper). |
| activityGoals | [Goal](#goal)[] | No | Yes | Linkage workout goal. If this parameter is not set, it is empty by default. |
| extensionConfig | Record<string, [ConfigType](#configtype)> | No | Yes | Extended configuration item. If this parameter is not set, it is empty by default. |

## workout.config

config(workoutConfig: WorkoutConfig): Promise<void>

Configures linkage. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| workoutConfig | [WorkoutConfig](#workoutconfig) | Yes | Linkage configuration item. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout not in stopped or idle state. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService, healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  let workoutOptions: healthService.workout.WorkoutConfig = {
    linkageType: healthService.workout.LinkageType.COURSE_LINK,
    sportType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE.id
  };
  await healthService.workout.config(workoutOptions);
  hilog.info(0x0000, 'testTag', 'Succeeded in configuring workout');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to configure workout. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.start

start(): Promise<StartResult>

Enables linkage. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[StartResult](#startresult)> | Promise used to return the result of enabling the linking service. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104002-workout-type-not-supported) | Unsupported sport type. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout in sporting, paused or stopped state. |
| [1009104004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104004-permission-verification-error) | Permission verification error. Application has no permission, such as Motion Permission. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  await healthService.workout.start();
  hilog.info(0x0000, 'testTag', 'Succeeded in starting workout');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to start workout. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.pause

pause(): Promise<void>

Pauses linkage. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout in ready, paused or stopped state. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  await healthService.workout.pause();
  hilog.info(0x0000, 'testTag', 'Succeeded in pausing workout');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to pause workout. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.resume

resume(): Promise<void>

Resumes linkage. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout in ready, sporting or stopped state. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  await healthService.workout.resume();
  hilog.info(0x0000, 'testTag', 'Succeeded in resuming workout');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to resume workout. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.stop

stop(): Promise<void>

Stops linkage. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  await healthService.workout.stop();
  hilog.info(0x0000, 'testTag', 'Succeeded in stopping workout');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to stop workout. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.onData

onData(dataType: healthStore.DataType, listener: Callback<SampleReal[]>): Promise<void>

Registers a listener for specified linkage fitness data. You are advised to subscribe to a maximum of three types of data. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataType | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Yes | Linkage workout data type. |
| listener | Callback<[SampleReal](#samplereal)[]> | Yes | Callback used to return the linkage workout data. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService, healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const callback: Callback<healthService.SampleReal[]> = (sampleReals) => {
    hilog.info(0x0000, 'testTag', `Succeeded in receiving data. The sampleReals size is ${sampleReals.length}`);
  };
  const realTimeMotionDataType: healthStore.DataType = {
    id: 50004
  };
  await healthService.workout.onData(realTimeMotionDataType, callback);
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to onData. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.onData

onData(dataType: undefined, listener: Callback<SampleReal[]>): Promise<void>

Registers a listener for all linkage workout data. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataType | undefined | Yes | All linkage workout data types for which the listener is registered. |
| listener | Callback<[SampleReal](#samplereal)[]> | Yes | Callback used to return the linkage workout data. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const callback: Callback<healthService.SampleReal[]> = (sampleReals) => {
    hilog.info(0x0000, 'testTag', `Succeeded in receiving data. The sampleReals size is ${sampleReals.length}`);
  };
  await healthService.workout.onData(undefined, callback);
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to onData. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.offData

offData(dataType: healthStore.DataType, listener: Callback<SampleReal[]>): Promise<void>

Cancels the listener for the specified linkage workout data. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataType | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Yes | Linkage workout data type. |
| listener | Callback<[SampleReal](#samplereal)[]> | Yes | Callback used to return the linkage workout data. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService, healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const callback: Callback<healthService.SampleReal[]> = (sampleReals) => {
    hilog.info(0x0000, 'testTag', `Succeeded in receiving data. The sampleReals size is ${sampleReals.length}`);
  };
  await healthService.workout.offData(healthStore.healthDataTypes.WORKOUT, callback);
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to offData. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.offData

offData(dataType: undefined, listener: Callback<SampleReal[]>): Promise<void>

Cancels the listener for all linkage workout data. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataType | undefined | Yes | All linkage workout data types for which the listener is registered. |
| listener | Callback<[SampleReal](#samplereal)[]> | Yes | Callback used to return the linkage workout data. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Parameter verification failed. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const callback: Callback<healthService.SampleReal[]> = (sampleReals) => {
    hilog.info(0x0000, 'testTag', `Succeeded in receiving data. The sampleReals size is ${sampleReals.length}`);
  };
  await healthService.workout.offData(undefined, callback);
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to offData. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.onEvent("*")

onEvent(event: "*", listener: Callback<SampleEvent>): Promise<void>

Registers a listener for linkage device events. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthService

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 401.

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| event | string | Yes | Linkage device event type. This field has a fixed value of *****. This event is triggered when the workout status of the linkage device is changed. |
| listener | Callback<[SampleEvent](#sampleevent)> | Yes | Callback used to return the linkage device event. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const callback: Callback<healthService.SampleEvent> = (event) => {
    hilog.info(0x0000, 'testTag', `Succeeded in receiving event. Event data: ${event.eventData}, event id: ${event.eventId}`);
  };
  await healthService.workout.onEvent('*', callback);
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to onEvent. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.offEvent("*")

offEvent(event: "*", listener: Callback<SampleEvent>): Promise<void>

Unregisters a listener for linkage device events. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthService

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 401.

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| event | string | Yes | Linkage device event type. This field has a fixed value of *****. This event is triggered when the workout status of the linkage device is changed. |
| listener | Callback<[SampleEvent](#sampleevent)> | Yes | Callback used to return the linkage device event. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Parameter verification failed. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const callback: Callback<healthService.SampleEvent> = (event) => {
    hilog.info(0x0000, 'testTag', `Succeeded in receiving event. Event data: ${event.eventData}, event id: ${event.eventId}`);
  };
  await healthService.workout.offEvent('*', callback);
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to offEvent. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.readActivityReport

readActivityReport(): Promise<ActivityReport>

Reads real-time Activity rings data. This API requires the **DAILY_ACTIVITIES** data type permission and uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthService

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[ActivityReport](#activityreport)> | Promise used to return real-time Activity rings data. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission denied. |
| [14500101](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section14500101-service-exception) | Service exception. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const result: healthService.workout.ActivityReport = await healthService.workout.readActivityReport();
  
  hilog.info(0x0000, 'testTag', 'Succeeded in reading ActivityReport');
  Object.keys(result).forEach(key => {
    hilog.info(0x0000, 'testTag', `the ${key} is ${result[key]}`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read ActivityReport. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.sendData

sendData(sampleReal: SampleReal[]): Promise<void>

Sends the fused workout data to the linkage device. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthService

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 401.

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| sampleReal | [SampleReal](#samplereal)[] | Yes | Fused workout data. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const sampleReal: healthService.SampleReal = {
    dataType: { id: 50004 },
    time: 1695740400000, // 2023-09-26 23:00:00,
    fields: {
      hr: 90
    }
  };
  await healthService.workout.sendData([sampleReal]);
  hilog.info(0x0000, 'testTag', 'Succeeded in sending data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to send data. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.sendEvent

sendEvent(event: SampleEvent): Promise<void>

Sends the control event to the linkage device. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthService

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 401.

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| event | [SampleEvent](#sampleevent) | Yes | Linkage control event. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  const sampleEvent: healthService.SampleEvent = {
    eventId: 800400002,
    eventLevel: 0,
    eventData: 'start'
  };
  await healthService.workout.sendEvent(sampleEvent);
  hilog.info(0x0000, 'testTag', 'Succeeded in sending event.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to send event. Code: ${err.code}, message: ${err.message}`);
}
```

## workout.getCurrentSportInfo

getCurrentSportInfo(): Promise<SportInfo>

Obtains the workout status. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthService

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[SportInfo](#sportinfo)> | Promise used to return the workout status. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Require workout management permission.Refer to the development documentation for permission request. |

> **Note:** Before calling this API, call [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  await healthService.workout.getCurrentSportInfo();
  hilog.info(0x0000, 'testTag', 'Succeeded in getting current sportInfo');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to getting current sportInfo'. Code: ${err.code}, message: ${err.message}`);
}
```
