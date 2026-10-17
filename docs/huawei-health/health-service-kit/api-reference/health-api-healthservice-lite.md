<!--
  Title: healthService (Health and Fitness Linking Services) (Lite)
  Catalog: harmonyos-references
  Document ID: health-api-healthservice-lite
  Updated: 2026-10-14 09:35:42
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite
-->
# healthService (Health and Fitness Linking Services) (Lite)

This module provides health and fitness linking services.

**Since:** 6.1.1(24)

#### Modules to Import

```javascript
import healthService from '@hms.health.service';
```

#### SampleReal

SampleReal<K extends Record<string, [healthStore.HealthValueType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#healthvaluetype)> = Record<string, [healthStore.HealthValueType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#healthvaluetype)>>

Linkage real-time workout data.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataType | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#datatype) | No | No | Real-time fused data type. |
| time | number | No | No | Generation time of real-time fused data. The value is a Unix timestamp, in milliseconds. |
| fields | Pick<K, keyof K> | No | No | Real-time fused data field. |
| deviceUniqueId | string | No | Yes | Real-time fused data source. If this parameter is not set, it is empty by default. |

#### workout

Provides real-time health and fitness data.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

## ConfigType

type ConfigType = number | string | boolean

Linkage configuration item type.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Type | **Description** |
| --- | --- |
| number | The value can be any number. |
| string | The value can be any string. |
| boolean | The value can be **true** or **false**. The specific meaning varies depending on the actual situation. |

## DeviceState

Linkage device status.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| deviceId | string | No | No | Device ID. |
| state | number | No | No | Device status. |
| deviceName | string | No | Yes | Device name. If this parameter is not set, it is empty by default. |

## Goal

Linkage workout goal.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| type | number | No | No | Goal type. For details about the value, please refer to [TargetType](#targettype). |
| value | number | No | No | Goal value. |

## LinkageType

Linkage type.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | Value | Description |
| --- | --- | --- |
| COURSE_LINK | 0 | Course linkage. |
| ACTIVITY_LINK | 1 | Workout linkage. |

## StartCode

Result code when the linking service is enabled.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | Value | Description |
| --- | --- | --- |
| SUCCESS | 0 | The linking service is enabled successfully. |
| WORKOUT_WORKING | 1 | The linking service is started. |
| NO_SUPPORTED_DEVICE | 2 | No device supports the linking service. |
| DEVICE_BUSY | 3 | The linkage device is busy. |

## StartResult

Result of enabling the linking service.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| startCode | [StartCode](#startcode) | No | No | Result code when the linking service is enabled. |
| deviceState | [DeviceState](#devicestate)[] | No | No | Linkage device status. |

## TargetType

Linkage goal type.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | Value | Description |
| --- | --- | --- |
| NONE | 0 | No goal. |
| DISTANCE | 1 | Distance. |
| CALORIE | 2 | Calories. |
| TIME | 3 | Duration. |
| SKIPPING_TIMES | 4 | Jump times. |

## WorkoutConfig

Linkage configuration item.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| linkageType | [LinkageType](#linkagetype) | No | No | Linkage type. |
| sportType | number | No | No | Workout type. For details, please refer to [Workout Record Type Constants](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper-lite). |
| activityGoals | [Goal](#goal)[] | No | Yes | Linkage workout goal. If this parameter is not set, it is empty by default. |
| extensionConfig | Record<string, [ConfigType](#configtype)> | No | Yes | Extended configuration item. If this parameter is not set, it is empty by default. |

## DynamicLibResult

Result type of the algorithm library loading operation.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| operationCode | [DynamicLibErrorCode](#dynamicliberrorcode) | No | No | Result code of the algorithm library loading operation. |

## DynamicLibErrorCode

Result code of the algorithm library file loading or uninstalling operation.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | Value | Description |
| --- | --- | --- |
| OPERATION_SUCCESS | 0 | Operation successful. |
| FILE_NOT_FOUND | 1 | The algorithm library file is not found. |
| SERVICE_BUSY | 2 | The algorithm library file has been loaded. |
| OPERATION_FAILED | 3 | Operation failed. |
| SYSTEM_INTERNAL_ERROR | 4 | Internal system error. |

## workout.config

config(workoutConfig: WorkoutConfig): void

Workout linkage configuration.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| workoutConfig | [WorkoutConfig](#workoutconfig) | Yes | Linkage configuration item. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout not in stopped or idle state. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';
import healthStore from '@hms.health.store';

try {
  let workoutOptions = {
    linkageType: healthService.workout.LinkageType.ACTIVITY_LINK,
    sportType: healthStore.exerciseSequenceHelper.badminton.EXERCISE_TYPE.id
  };
  healthService.workout.config(workoutOptions);
} catch (err) {
  // Troubleshooting process.
}
```

## workout.start

start(): StartResult

Enables the linking service.

> **Note:** Before calling this API, call [config](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutconfig) to configure the linking service.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Returns:**

| Type | Description |
| --- | --- |
| [StartResult](#startresult) | Result of enabling the linking service. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104002-workout-type-not-supported) | Unsupported sport type. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout in sporting, paused or stopped state. |
| [1009104004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104004-permission-verification-error) | Permission verification error. Application has no permission, such as Motion Permission. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';
import healthStore from '@hms.health.store';

try {
  healthService.workout.start();
} catch (err) {
  // Troubleshooting process.
}
```

## workout.pause

pause(): void

Pauses the linking service.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout in ready, paused or stopped state. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  healthService.workout.pause();
} catch (err) {
  // Troubleshooting process.
}
```

## workout.resume

resume(): void

Resumes the linking service.

> **Note:** Before calling this API, call [pause](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutpause) to pause the linking service.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout in ready, sporting or stopped state. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  healthService.workout.resume();
} catch (err) {
  // Troubleshooting process.
}
```

## workout.stop

stop(): void

Stops the linking service.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled. After this API is called, the current workout linking service is stopped, and the linking service can be enabled for other workouts.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  healthService.workout.stop();
} catch (err) {
  // Troubleshooting process.
}
```

## workout.onData(deprecated)

onData(dataType: undefined, listener: Callback<SampleReal[]>): void

Subscribes to all types of data. This API uses an asynchronous callback to return the result.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled.

**System capability:** SystemCapability.Health.HealthService.Lite

**Model restriction:** This API can be used only in the FA model.

**Since:** 6.1.1(24)

**Deprecated since:** 26.0.0

**Substitutes:** [workout.onData](#workoutondata)

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataType | undefined | Yes | All linkage workout data types for which the listener is registered. |
| listener | Callback<[SampleReal](#samplereal)[]> | Yes | Callback used to return the linkage workout data. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const callback = (sampleReals) => {
    // Workout data callback process.
  };
  healthService.workout.onData(undefined, callback);
} catch (err) {
  // Troubleshooting process.
}
```

## workout.onData

onData(listener: Callback<SampleReal[]>): void

Subscribes to all types of data. This API uses an asynchronous callback to return the result.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled.

**System capability:** SystemCapability.Health.HealthService.Lite

**Model restriction:** This API can be used only in the FA model.

**Since:** 26.0.0

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| listener | Callback<[SampleReal](#samplereal)[]> | Yes | Callback used to return the linkage workout data. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. For the app, ensure that you have requested Health Service Kit, selected the product type, and enabled required data read and write permissions, and that the user has granted authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sports service busy. Workout has already been started by another app. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Invalid command. The API is called when workout is not started. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | Internal system error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const callback = (sampleReals) => {
    // Workout data callback process.
  };
  healthService.workout.onData(callback);
} catch (err) {
  // Troubleshooting process.
}
```

## workout.offData(deprecated)

offData(dataType: undefined, listener?: Callback<SampleReal[]>): void

Unsubscribes from all types of data.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled.

**System capability:** SystemCapability.Health.HealthService.Lite

**Model restriction:** This API can be used only in the FA model.

**Since:** 6.1.1(24)

**Deprecated since:** 26.0.0

**Substitutes:** [workout.offData](#workoutoffdata)

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataType | undefined | Yes | Types of all linkage workout data for which the listener is canceled. |
| listener | Callback<[SampleReal](#samplereal)[]> | No | Callback for canceling the subscription. If this parameter is not specified, all listeners are canceled. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const callback = (sampleReals) => {
    // Data callback process.
  };
  healthService.workout.offData(undefined, callback);
} catch (err) {
  // Troubleshooting process.
}
```

## workout.offData

offData(listener?: Callback<SampleReal[]>): void

Unsubscribes from all types of data.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled.

**System capability:** SystemCapability.Health.HealthService.Lite

**Model restriction:** This API can be used only in the FA model.

**Since:** 26.0.0

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| listener | Callback<[SampleReal](#samplereal)[]> | No | Callback for canceling the subscription. If this parameter is not specified, all listeners are canceled. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. For the app, ensure that you have requested Health Service Kit, selected the product type, and enabled required data read and write permissions, and that the user has granted authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sports service busy. Workout has already been started by another app. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | Internal system error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const callback = (sampleReals) => {
    // Data callback process.
  };
  healthService.workout.offData(callback);
} catch (err) {
  // Troubleshooting process.
}
```

## workout.sendData

sendData(sampleReal: SampleReal[]): void

Sends the fused workout data to the linkage device.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled.

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.HealthService.Lite

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| sampleReal | [SampleReal](#samplereal)[] | Yes | Fused workout data. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';
import healthStore from '@hms.health.store';

try {
  const sampleReal = {
    dataType: { id: healthStore.healthDataTypes.WORKOUT_REALTIME.id },
    time: 1695740400000, // 2023-09-26 23:00:00,
    fields: {
      forehandStroke: 45
    }
  };
  healthService.workout.sendData([sampleReal]);
} catch (err) {
    // Troubleshooting process.
}
```

## workout.load

load(path: string): void

Loads the algorithm library file. After the file is loaded, the algorithms in the algorithm library can be used.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| path | string | Yes | Path for storing the algorithm library file in the code project, for example, **common/dynamic_example.so**. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1009104004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104004-permission-verification-error) | Permission verification error. Application has no permission, such as Motion Permission. |
| [1009104005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104005-failed-to-load-the-dynamic-library) | Failed to load the dynamic library. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const path = "common/dynamic_example.so";
  healthService.workout.load(path);
} catch (err) {
  // Troubleshooting process.
}
```

## workout.load

load(path: string, callback: Callback<[DynamicLibResult](#dynamiclibresult)>): void

Loads the algorithm library file. After the file is loaded, the algorithms in the algorithm library can be used. This API uses an asynchronous callback to return the result.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| path | string | Yes | Path for storing the algorithm library file in the code project, for example, **common/dynamic_example.so**. |
| callback | Callback<[DynamicLibResult](#dynamiclibresult)> | Yes | Callback used to return the algorithm library loading result. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1009104004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104004-permission-verification-error) | Permission verification error. Application has no permission, such as Motion Permission. |
| [1009104005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104005-failed-to-load-the-dynamic-library) | Failed to load the dynamic library. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const path = "common/dynamic_example.so";
  healthService.workout.load(path, (result) => {
    switch (result.operationCode) {
      case healthService.workout.DynamicLibErrorCode.OPERATION_SUCCESS:
          // Process for successful loading.
          break;
      case healthService.workout.DynamicLibErrorCode.FILE_NOT_FOUND:
          // Process for the case where the .so file is not found.
          break;
      case healthService.workout.DynamicLibErrorCode.SERVICE_BUSY:
          // Process for the case where the .so file has been loaded.
          break;
      case healthService.workout.DynamicLibErrorCode.OPERATION_FAILED:
          // Process for operation failures.
          break;
      default :
          // Process for unknown errors.
    }
  });
} catch (err) {
  // Troubleshooting process.
}
```

## workout.unload

unload(path: string): void

Uninstalls the algorithm library file. After the file is uninstalled, the algorithms in the algorithm library cannot be used.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| path | string | Yes | Path for storing the algorithm library file in the code project, for example, **common/dynamic_example.so**. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1009104004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104004-permission-verification-error) | Permission verification error. Application has no permission, such as Motion Permission. |
| [1009104006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104006-failed-to-uninstall-the-dynamic-library) | Failed to unload the dynamic library. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const path = "common/dynamic_example.so";
  healthService.workout.unload(path);
} catch (err) {
  // Troubleshooting process.
}
```

## workout.unload

unload(path: string, callback: Callback<[DynamicLibResult](#dynamiclibresult)>): void

Uninstalls the algorithm library file. After the file is uninstalled, the algorithms in the algorithm library cannot be used. This API uses an asynchronous callback to return the result.

**System capability:** SystemCapability.Health.HealthService.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| path | string | Yes | Path for storing the algorithm library file in the code project, for example, **common/dynamic_example.so**. |
| callback | Callback<[DynamicLibResult](#dynamiclibresult)> | Yes | Callback used to return the algorithm library uninstallation result. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1009104001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104001-linking-service-enabled) | Sport service busy. Workout is already started by other application. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1009104004](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104004-permission-verification-error) | Permission verification error. Application has no permission, such as Motion Permission. |
| [1009104006](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104006-failed-to-uninstall-the-dynamic-library) | Failed to unload the dynamic library. |
| [1009104999](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104999-universal-error-code) | System internal error. |

**Example:**

```javascript
import healthService from '@hms.health.service';

try {
  const path = "common/dynamic_example.so";
  healthService.workout.unload(path, (result) => {
    switch (result.operationCode) {
      case healthService.workout.DynamicLibErrorCode.OPERATION_SUCCESS:
        // Process for successful loading.
        break;
      case healthService.workout.DynamicLibErrorCode.FILE_NOT_FOUND:
        // Process for the case where the .so file is not found.
        break;
      case healthService.workout.DynamicLibErrorCode.OPERATION_FAILED:
        // Process for operation failures.
        break;
      default :
        // Process for unknown errors.
    }
  });
} catch (err) {
  // Troubleshooting process.
}
```
