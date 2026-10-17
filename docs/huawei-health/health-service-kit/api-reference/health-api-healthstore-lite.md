<!--
  Title: healthStore (Health and Fitness Data Services) (Lite)
  Catalog: harmonyos-references
  Document ID: health-api-healthstore-lite
  Updated: 2026-10-14 09:35:40
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite
-->
# healthStore (Health and Fitness Data Services) (Lite)

This module provides health and fitness data services.

**Since:** 6.1.1(24)

#### Modules to Import

```javascript
import healthStore from '@hms.health.store';
```

#### AuthorizationBase

Authorization information base class.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| readDataTypes | [DataType](#datatype)[] | No | No | Read data type. |
| writeDataTypes | [DataType](#datatype)[] | No | No | Write data type. |

#### AuthorizationRequest

Authorization request parameter type, which inherits from [AuthorizationBase](#authorizationbase).

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| readDataTypes | [DataType](#datatype)[] | No | No | Read data type. |
| writeDataTypes | [DataType](#datatype)[] | No | No | Write data type. |
| scopes | string[] | No | Yes | Non-data type permission, which is authorized by scope. For details, please refer to [OAuth Scope](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-cloudsync#oauth-scope). If this parameter is not set, it is empty by default. |

#### AuthorizationResponse

Authorization response type, which inherits from [AuthorizationBase](#authorizationbase).

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| readDataTypes | [DataType](#datatype)[] | No | No | Read data type that is successfully authorized. The corresponding permission is in the intersection of the [app request permission](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and the user authorization permission. |
| writeDataTypes | [DataType](#datatype)[] | No | No | Write data type that is successfully authorized. The corresponding permission is in the intersection of the [app request permission](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and the user authorization permission. |
| scopes | string[] | No | Yes | Non-data type permission, which is authorized by scope. For details, please refer to [OAuth Scope](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-cloudsync#oauth-scope). If this parameter is not set, it is empty by default. |

#### DataReadRequest

Base class for read request parameters, which inherits from [DataRequest](#datarequest).

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| count | number | No | Yes | Number of data records to be read. If this parameter is not set, there is no restriction on the number of data records by default. Value range: [1, ∞) |
| offset | number | No | Yes | Offset relative to the current position. If this parameter is not set, the default value **0** is used, indicating no offset. |
| sortOrder | [SortOrder](#sortorder) | No | Yes | Sort order. If this parameter is not set, the ascending order is used by default. |

#### DataRequest

Request parameter base class.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| startLocalDate | string | No | No | Local start date of data, in MM/DD/YYYY format. |
| endLocalDate | string | No | No | Local end date of data, in MM/DD/YYYY format. |
| startTime | number | No | No | Start time of the request. The value is a Unix timestamp, in milliseconds. This parameter does not take effect on lite wearables. Only the latest data record can be returned. Value range: (0, ∞) |
| endTime | number | No | No | End time of the request. The value is a Unix timestamp, in milliseconds. This parameter does not take effect on lite wearables. Only the latest data record can be returned. Value range: (0, ∞) |
| dataSourceOptions | [DataSourceOptions](#datasourceoptions) | No | Yes | Data sources associated with the request. If this parameter is not set, there is no restriction on the data source by default. |

#### DataSourceOptions

Data source option class, which is used to query and delete data sources.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataSourceId | string | No | Yes | ID of a data source, which is generated by the platform and cannot be changed. If this parameter is not set, it is empty by default. |
| deviceUniqueId | string | No | Yes | Unique device ID. If this parameter is not set, it is empty by default. |
| appBundleName | string | No | Yes | App bundle name. If this parameter is not set, it is empty by default. |
| appId | string | No | Yes | OAuth 2.0 client ID (**client_id**) of your app. If this parameter is not set, it is empty by default. |

#### DataType

Data type class. Each data type field is identified by a unique ID.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| id | number | Yes | No | Unique ID of a data type. |
| name | string | Yes | Yes | Name of a data type. If this parameter is not set, the name matching the data type ID is used by default. |

#### ExerciseSequence

ExerciseSequence<K extends Record<string, [ExerciseSummary](#exercisesummary)> = Record<string, [ExerciseSummary](#exercisesummary)>,DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Workout record data class, which inherits from [SampleDataBase](#sampledatabase).

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseType | [SubDataType](#subdatatype) | No | No | Subdata type of workout records. |
| duration | number | No | Yes | Workout duration, in milliseconds. If this parameter is not set, the default value is the end time minus the start time. Value range: (0, ∞) |
| summaries | Pick<K, keyof K> | No | No | Statistical data. For details about the statistical data types associated with workout records, please refer to the model defined in [exerciseSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper-lite). |
| details | Pick<DK, keyof DK> | No | Yes | Details data. For details about the details data types associated with workout records, please refer to the model defined in [exerciseSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper-lite). If this parameter is not set, it is empty by default. |

#### ExerciseSequenceReadRequest

ExerciseSequenceReadRequest<DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Request class for reading workout records, which inherits from Omit<[DataReadRequest](#datareadrequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseType | [SubDataType](#subdatatype) \| [SubDataType](#subdatatype)[] \| null | No | No | Subdata type of workout records. If this parameter is not set, all data types are read. |
| readOptions | [SequenceReadOptions](#sequencereadoptions)<DK> | No | Yes | Details data option. If this parameter is not set, details data is not read by default. |

#### ExerciseSummary

Workout record statistics class, which inherits from Record<string, [HealthValueType](#healthvaluetype) | [PaceValueType](#pacevaluetype)>.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| [P: string] | [HealthValueType](#healthvaluetype) \| [PaceValueType](#pacevaluetype) | No | No | Statistical data field. |

#### HealthValueType

type HealthValueType = number | string | boolean | undefined

Health and fitness data value type.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Type | **Description** |
| --- | --- |
| number | The value can be any number. |
| string | The value can be any string. |
| boolean | The value can be **true** or **false**. The specific meaning varies depending on the actual situation. |
| undefined | The value is empty. |

#### PaceValueType

type PaceValueType = Record<string, number>

Pace data type.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Type | **Description** |
| --- | --- |
| Record<string, number> | Pace data field. |

#### SampleDataBase

Health data base class.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataType | [DataType](#datatype) | No | No | Data type. |
| dataSourceId | string | No | No | Unique ID of a data source. For lite wearable development, you do not need to set **dataSourceId**. |
| localDate | string | No | No | Local date of data, in MM/DD/YYYY format. |
| startTime | number | No | No | Data start time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) |
| endTime | number | No | No | Data end time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) |
| timeZone | string | No | No | Time zone where the data is located, in the format of +0800. |
| modifiedTime | number | No | No | Creation or modification time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) |

#### SequencePoint

Detailed health and fitness data point, which inherits from Record<string, [HealthValueType](#healthvaluetype)>.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| startTime | number | No | No | Data start time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) |
| [P: string] | [HealthValueType](#healthvaluetype) | No | No | Detailed data point field. |

#### SequenceReadOptions

SequenceReadOptions<DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Option class for reading health and fitness record details.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| withDetails | boolean | No | Yes | Indicates whether to read all details. The value **true** indicates that all details are read, and the value **false** indicates that no details are read. If this parameter is not set, the **withPartialDetails** parameter takes effect. |
| withPartialDetails | (keyof DK)[] | No | Yes | Type of partial details to be read. (If partial details need to be read, the **withDetails** parameter cannot be set.) For details about the details data types associated with workout records and health records, please refer to [exerciseSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper-lite). |

#### SortOrder

Sort order enum object.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Name | Value | Description |
| --- | --- | --- |
| ASC | 0 | Ascending order. |
| DESC | 1 | Descending order. |

#### SubDataType

type SubDataType = DataType

Subdata type.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

| Type | **Description** |
| --- | --- |
| [DataType](#datatype) | Data type. |

#### healthStore.saveData

saveData(exerciseSequence: ExerciseSequence): void

Saves workout record data.

> **Note:** Before calling this API, call [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart) to ensure that the linking service has been enabled.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseSequence | [ExerciseSequence](#exercisesequence) | Yes | A single workout record. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | Internal system error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1009104003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1009104003-illegal-command) | Illegal command. Called when workout is not started. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user is not signed in with a HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain the HUAWEI ID information. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy agreement not accepted. |

**Example:**

```javascript
import healthStore from '@hms.health.store';

let healthSequence = {
  dataType: healthStore.healthDataTypes.WORKOUT_REALTIME,
  // Pass the value of DataSourceId returned when you call insertDataSource to insert the data source.
  dataSourceId: 'xxx',
  localDate: '09/26/2023',
  startTime: 1695740400000,  // 2023-10-23 14:00:00
  endTime: 1695769200000,   // 2023-10-23 14:30:00
  timeZone: '+0800',
  modifiedTime: 1695769200000,
  exerciseType: healthStore.exerciseSequenceHelper.badminton.EXERCISE_TYPE,
  duration: 1800000,
  summaries: {
    avgShotSpeed: 25.5,
    maxShotSpeed: 32.8,
    shots: 125,
    maxContinuousRally: 7,
    forehandStroke: 45,
    backhandStroke: 32,
    overhandStroke: 18,
    underhandStroke: 10,
    smash: 23,
    highClear: 15
  }
}
try {
  healthStore.saveData(healthSequence);
} catch (err) {
  // Troubleshooting process.
}
```

#### healthStore.readData

readData<T extends ExerciseSequence>(request: ExerciseSequenceReadRequest, callback: Callback<T[]>): void

Reads workout record data. This API uses an asynchronous callback to return the result.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [ExerciseSequenceReadRequest](#exercisesequencereadrequest) | Yes | Request for reading workout records. The time span is 31 days. On lite wearables, only the latest record can be returned. |
| callback | Callback<T[]> | Yes | Callback used to return the workout record data. |

**Error codes:**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. Please ensure that the app has applied for the Health Service Kit, selected the product type, enabled the corresponding data read and write permissions, and the user has completed authorization. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | Internal system error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user is not signed in with a HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain the HUAWEI ID information. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy agreement not accepted. |

**Example:**

```javascript
import healthStore from '@hms.health.store';

// Query running records.
const startTime = 1698040800000; // 2023-10-23 14:00:00
const endTime = 1698042600000; // 2023-10-23 14:30:00

const sequenceReadRequest = {
  startTime: startTime,
  endTime: endTime,
  exerciseType: healthStore.exerciseSequenceHelper.badminton.EXERCISE_TYPE,
  count: 1,
  sortOrder: healthStore.SortOrder.DESC,
  readOptions: {
    withPartialDetails: ['exerciseHeartRate']
 }
};

const callback = (samplePoints) => {
    // Workout record data callback process.
};

try {
  healthStore.readData(sequenceReadRequest, callback);
} catch (err) {
  // Exception.
}
```

#### healthStore.requestAuthorizations

requestAuthorizations(request: AuthorizationRequest): AuthorizationResponse

User authorization.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [AuthorizationRequest](#authorizationrequest) | Yes | Authorization request. Make sure you have applied for the scopes specified in the authorization parameters during your Health Service Kit application. |

**Returns:**

| Type | Description |
| --- | --- |
| [AuthorizationResponse](#authorizationresponse) | Authorization response result. |

**Example:**

```javascript
import healthStore from '@hms.health.store';

let authorizationParameter = {
  readDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
  writeDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
  scopes: ['https://www.huawei.com/healthkit/workout']
}

try {
  let authorizationResponse = healthStore.requestAuthorizations(authorizationParameter);
  // Process the authorization response result.
} catch (err) {
  // Troubleshooting process.
}
```

#### healthStore.getAuthorizations

getAuthorizations(request: AuthorizationRequest): AuthorizationResponse

Queries the granted permissions.

**System capability:** SystemCapability.Health.HealthStore.Lite

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the FA model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [AuthorizationRequest](#authorizationrequest) | Yes | Authorization query request. |

**Returns:**

| Type | Description |
| --- | --- |
| [AuthorizationResponse](#authorizationresponse) | Authorization query request. |

**Example:**

```javascript
import healthStore from '@hms.health.store';

let queryAuthorizationRequest = {
  readDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
  writeDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
  scopes: ['https://www.huawei.com/healthkit/workout']
}

try {
  let queryAuthorizationResponse = healthStore.getAuthorizations(queryAuthorizationRequest);
  // Process the authorization query result.
} catch (err) {
  // Troubleshooting process.
}
```
