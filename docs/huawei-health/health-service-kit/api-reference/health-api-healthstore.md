<!--
  Title: healthStore (Health and Fitness Data Services)
  Catalog: harmonyos-references
  Document ID: health-api-healthstore
  Updated: 2026-10-14 09:35:34
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore
-->
# healthStore (Health and Fitness Data Services)

This module provides health and fitness data services.

**Description**

For the system capability SystemCapability.Health.HealthStore, use [canIUse()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-syscap#caniuse) to check whether the current device supports this system capability and the corresponding APIs.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { healthStore } from '@kit.HealthServiceKit';
```

#### AggregateMetrics

type AggregateMetrics = Partial<Record<[AggregateMetricScope](#aggregatemetricscope), number>>

Aggregation metric.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| max | number | No | Yes | Maximum aggregation. If this parameter is not set, this type of aggregation is not supported. |
| min | number | No | Yes | Minimum aggregation. If this parameter is not set, this type of aggregation is not supported. |
| avg | number | No | Yes | Average aggregation. If this parameter is not set, this type of aggregation is not supported. |
| sum | number | No | Yes | Sum aggregation. If this parameter is not set, this type of aggregation is not supported. |
| last | number | No | Yes | Latest aggregation. If this parameter is not set, this type of aggregation is not supported. |
| count | number | No | Yes | Count aggregation. If this parameter is not set, this type of aggregation is not supported. |

#### AggregateMetricScope

type AggregateMetricScope = 'max' | 'min' | 'avg' | 'sum' | 'last' | 'count'

Aggregation metric type.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| 'max' | Calculates the maximum value. |
| 'min' | Calculates the minimum value. |
| 'avg' | Calculates the average value. |
| 'sum' | Calculates the sum value. |
| 'last' | Calculates the latest value. |
| 'count' | Calculates the count. |

#### AggregateRequest

AggregateRequest<T extends Record<string, [AggregateMetrics](#aggregatemetrics)> = Record<string, [AggregateMetrics](#aggregatemetrics)>>

Aggregation query request class, which inherits from Omit<[DataReadRequest](#datareadrequest), 'startTime' | 'endTime'>.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataType | [DataType](#datatype) | No | No | Type of the data to be queried. |
| metrics | Partial<Record<keyof T, [AggregateMetricScope](#aggregatemetricscope)[]>> | No | No | Aggregation metric. |
| groupBy | [GroupOption](#groupoption) | No | No | Aggregation group options. |

#### AggregateResult

AggregateResult<T extends Record<string, [AggregateMetrics](#aggregatemetrics)> = Record<string, [AggregateMetrics](#aggregatemetrics)>>

Aggregation query result class, which inherits from Omit<[SampleDataBase](#sampledatabase), 'dataSourceId'>.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| fields | Pick<T, keyof T> | No | No | Aggregation query field. |

#### AppInfo

App information class.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| bundleName | string | Yes | Yes | App bundle name. If this parameter is not set, the bundle name of your app will be used by default. |
| appId | string | Yes | Yes | OAuth 2.0 client ID (**client_id**). If this parameter is not set, **client_id** of your app is used by default. |
| appName | string | Yes | Yes | App name. The length is less than 256 bytes. If this parameter is not set for the first time, the default value **CoreServiceExtAbility** is used. To update the value, call the [updateDataSource](#healthstoreupdatedatasource) API. |
| version | string | Yes | Yes | App version. The length is less than 256 bytes. If this parameter is not set for the first time, it is empty by default. To update the value, call the [updateDataSource](#healthstoreupdatedatasource) API. |

#### AuthorizationBase

Authorization information base class.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| readDataTypes | [DataType](#datatype)[] | No | No | Read data type. |
| writeDataTypes | [DataType](#datatype)[] | No | No | Write data type. |

#### AuthorizationRequest

Authorization request parameter type, which inherits from [AuthorizationBase](#authorizationbase).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| readDataTypes | [DataType](#datatype)[] | No | No | Read data type. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| writeDataTypes | [DataType](#datatype)[] | No | No | Write data type. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| scopes | string[] | No | Yes | Non-data type permission, which is authorized by scope. For details, please refer to [OAuth Scope](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-cloudsync#oauth-scope). If this parameter is not set, it is empty by default. **Since:** 5.1.0(18) **Atomic service API:** This API can be used in atomic services since API version 5.1.0(18). |

#### AuthorizationResponse

Authorization response type, which inherits from [AuthorizationBase](#authorizationbase).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| readDataTypes | [DataType](#datatype)[] | No | No | Read data type that is successfully authorized. The corresponding permission is in the intersection of the [app request permission](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and the user authorization permission. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| writeDataTypes | [DataType](#datatype)[] | No | No | Write data type that is successfully authorized. The corresponding permission is in the intersection of the [app request permission](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and the user authorization permission. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| scopes | string[] | No | Yes | Non-data type permission, which is authorized by scope. For details, please refer to [OAuth Scope](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-cloudsync#oauth-scope). If this parameter is not set, it is empty by default. **Since:** 5.1.0(18) **Atomic service API:** This API can be used in atomic services since API version 5.1.0(18). |

#### DataReadRequest

Base class for read request parameters, which inherits from [DataRequest](#datarequest).

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| count | number | No | Yes | Number of data records to be read. If this parameter is not set, there is no restriction on the number of data records by default. Value range: [1, ∞) |
| offset | number | No | Yes | Offset relative to the current position. If this parameter is not set, the default value **0** is used, indicating no offset. |
| sortOrder | [SortOrder](#sortorder) | No | Yes | Sort order. If this parameter is not set, the ascending order is used by default. |

#### DataRequest

Request parameter base class.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| startLocalDate | string | No | No | Local start date of data, in MM/DD/YYYY format. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| endLocalDate | string | No | No | Local end date of data, in MM/DD/YYYY format. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| startTime | number | No | No | Start time of the request. The value is a Unix timestamp, in milliseconds. This parameter does not take effect on wearables. Only the latest data record can be returned. Value range: (0, ∞) |
| endTime | number | No | No | End time of the request. The value is a Unix timestamp, in milliseconds. This parameter does not take effect on wearables. Only the latest data record can be returned. Value range: (0, ∞) |
| dataSourceOptions | [DataSourceOptions](#datasourceoptions) | No | Yes | Data sources associated with the request. If this parameter is not set, there is no restriction on the data source by default. |

#### DataSource

Data source.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataSourceId | string | Yes | No | ID of a data source, which is generated by the platform and cannot be changed. The length is less than 256 bytes. |
| deviceInfo | [DeviceInfo](#deviceinfo) | Yes | Yes | Device information. If this parameter is not set, it is empty by default. |
| appInfo | [AppInfo](#appinfo) | Yes | Yes | App information. If this parameter is not set, your app information is used by default. |

#### DataSourceBase

type DataSourceBase = Omit<DataSource, 'dataSourceId'>

Data source base class, which is used to insert data sources.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| deviceInfo | [DeviceInfo](#deviceinfo) | Yes | Yes | Device information. If this parameter is not set, it is empty by default. |
| appInfo | [AppInfo](#appinfo) | Yes | Yes | App information. If this parameter is not set, your app information is used by default. |

#### DataSourceOptions

Data source option class, which is used to query and delete data sources.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataSourceId | string | No | Yes | ID of a data source, which is generated by the platform and cannot be changed. If this parameter is not set, it is empty by default. |
| deviceUniqueId | string | No | Yes | Unique device ID. If this parameter is not set, it is empty by default. |
| appBundleName | string | No | Yes | App bundle name. If this parameter is not set, it is empty by default. |
| appId | string | No | Yes | OAuth 2.0 client ID (**client_id**) of your app. If this parameter is not set, it is empty by default. |

#### DataSourceReadRequest

Request for reading a data source.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataSourceId | string | No | Yes | Unique ID of a data source. (Do not set **dataSourceId** when you have set **bundleName** and **deviceUniqueId**). |
| bundleName | string | No | Yes | App bundle name. (Set this parameter only when **dataSourceId** is not set.) |
| deviceUniqueId | string | No | Yes | Unique device ID. (Set this parameter only when **dataSourceId** is not set.) |

#### DataType

Data type class. Each data type field is identified by a unique ID.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| id | number | Yes | No | Unique ID of a data type. |
| name | string | Yes | Yes | Name of a data type. If this parameter is not set, the name matching the data type ID is used by default. |

#### DeviceCategory

Device type enum object.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| MANUAL_INPUT | '000' | Manually entered. |
| SMART_PHONE | '00E' | Phone. |
| WEARABLE_WATCH | '06D' | Watch. |
| WEARABLE_BAND | '06E' | Band. |
| SMART_HEADPHONES | '082' | Smart earphones. |
| HDK_WEIGHT_SCALE | '0CB' | Body fat scale. |
| HDK_BLOOD_SUGAR_MONITOR | '086' | Blood glucose monitor. |
| HDK_BLOOD_PRESSURE_MONITOR | '02B' | Blood pressure monitor. |
| HDK_HEART_RATE_MONITOR | '088' | Heart rate monitor. |
| HDK_THERMOMETER | '0B3' | Thermometer. |
| HDK_BLOOD_OXYGEN_MONITOR | '0B4' | Oximeter. |
| HDK_ROPE_SKIPPING | '095' | Jump rope. |
| HDK_TREADMILL | '08F' | Treadmill. |
| HDK_EXERCISE_BIKE | '0BF' | Spinning bike. |
| HDK_ROWING_MACHINE | '0C1' | Rower. |
| HDK_ELLIPTICAL_MACHINE | '0C0' | Elliptical machine. |
| HDK_WALKING_MACHINE | '092' | Air walker. |
| SPORTS_GENIE | 'A12' | Running form monitoring device. |

#### DeviceInfo

Device information class.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| **Name** | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| uniqueId | string | Yes | No | Unique device ID. The length is less than 256 bytes. |
| udid | string | Yes | Yes | Device UDID. If this parameter is not set, it is empty by default. |
| name | string | Yes | Yes | Device name. The length is less than 256 bytes. (This parameter is mandatory when a data source is inserted.) |
| category | [DeviceCategory](#devicecategory) | Yes | Yes | Device type, which must match the value of **productId**. (This parameter is mandatory when a data source is inserted.) |
| productId | string | Yes | Yes | Huawei ecosystem product ID, which must match the value of **category**. The length is less than 256 bytes. (This parameter is mandatory when a data source is inserted.) For example, in a manual input scenario: **category**: [DeviceCategory](#devicecategory)**.MANUAL_INPUT** **productId**: **'0062'** |
| model | string | Yes | Yes | Device model name. If this parameter is not set, it is empty by default. |
| manufacturer | string | Yes | Yes | Device manufacturer. If this parameter is not set, it is empty by default. |
| mac | string | Yes | Yes | Device MAC address. If this parameter is not set, it is empty by default. |
| sn | string | Yes | Yes | Device SN. If this parameter is not set, it is empty by default. |
| hardwareVersion | string | Yes | Yes | Device hardware version. If this parameter is not set, it is empty by default. |
| softwareVersion | string | Yes | Yes | Device software version. If this parameter is not set, it is empty by default. |
| firmwareVersion | string | Yes | Yes | Device firmware version. If this parameter is not set, it is empty by default. |

#### ExerciseSequence

ExerciseSequence<K extends Record<string, [ExerciseSummary](#exercisesummary)> = Record<string, [ExerciseSummary](#exercisesummary)>,DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Workout record data class, which contains workout record statistics and details. This API inherits from [SampleDataBase](#sampledatabase).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseType | [SubDataType](#subdatatype) | No | No | Subdata type of workout records. |
| duration | number | No | Yes | Workout duration, in milliseconds. If this parameter is not set, the default value is the end time minus the start time. Value range: (0, ∞) |
| summaries | Pick<K, keyof K> | No | No | Statistical data. For details about the statistical data types associated with workout records, please refer to the model defined in [exerciseSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper). |
| details | Pick<DK, keyof DK> | No | Yes | Details data. For details about the details data types associated with workout records, please refer to the model defined in [exerciseSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper). If this parameter is not set, it is empty by default. |

#### ExerciseSequenceDeleteRequest

Request class for deleting workout records, which inherits from Omit<[DataRequest](#datarequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseType | [SubDataType](#subdatatype) \| [SubDataType](#subdatatype)[] \| null | No | No | Subdata type of workout records. If this parameter is not set, all data types are deleted. |

#### ExerciseSequenceReadRequest

ExerciseSequenceReadRequest<DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Request class for reading workout records, which inherits from Omit<[DataReadRequest](#datareadrequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| exerciseType | [SubDataType](#subdatatype) \| [SubDataType](#subdatatype)[] \| null | No | No | Subdata type of workout records. If this parameter is not set, all data types are read. |
| readOptions | [SequenceReadOptions](#sequencereadoptions)<DK> | No | Yes | Details data option. If this parameter is not set, details data is not read by default. |

#### ExerciseSummary

Workout record statistics class, which inherits from Record<string, [HealthValueType](#healthvaluetype) | [PaceValueType](#pacevaluetype)>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| [P: string] | [HealthValueType](#healthvaluetype) \| [PaceValueType](#pacevaluetype) | No | No | Statistical data field. |

#### GroupOption

Aggregation group options.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| unitType | [GroupUnitType](#groupunittype) | No | No | Aggregation metric (group unit). |
| duration | number | No | Yes | Number of units in each group. If this parameter is not set, the default value is **1**, indicating one unit in each group. The value of **duration** can only be **1** if aggregation is performed by day. |

#### GroupUnitType

Aggregation metric (group unit) enum object.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| DAY | 3 | Data aggregation by day. |

#### HealthSequence

HealthSequence<K extends Record<string, [HealthValueType](#healthvaluetype)> = Record<string, [HealthValueType](#healthvaluetype)>,DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Health record data class, which contains health record feature data and details. This API inherits from [SampleDataBase](#sampledatabase).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| summaries | Pick<K, keyof K> | No | No | Statistical data. For details about the statistical data types associated with health records, please refer to the model defined in [healthSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper). |
| details | Pick<DK, keyof DK> | No | Yes | Details data. For details about the details data types associated with health records, please refer to the model defined in [healthSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper). If this parameter is not set, it is empty by default. |

#### HealthSequenceDeleteRequest

Request class for deleting health records, which inherits from Omit<[DataRequest](#datarequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| healthSequenceDataType | [DataType](#datatype) \| [DataType](#datatype)[] | No | No | Health data type. |

#### HealthSequenceReadRequest

HealthSequenceReadRequest<DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Request class for reading health records, which inherits from Omit<[DataReadRequest](#datareadrequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| healthSequenceDataType | [DataType](#datatype) \| [DataType](#datatype)[] | No | No | Health data type. |
| readOptions | [SequenceReadOptions](#sequencereadoptions)<DK> | No | Yes | Details data option. If this parameter is not set, details data is not read by default. |

#### HealthValueType

type HealthValueType = number | string | boolean | undefined

Health and fitness data value type.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| number | The value can be any number. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| string | The value can be any string. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| boolean | The value can be **true** or **false**. The specific meaning varies depending on the actual situation. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| undefined | The value is empty. **Since:** 6.0.1(21) **Atomic service API:** This API can be used in atomic services since API version 6.0.1(21). |

#### PaceValueType

type PaceValueType = Record<string, number>

Pace data type.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| Record<string, number> | Pace data field. |

#### SampleDataBase

Health data base class.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataType | [DataType](#datatype) | No | No | Data type. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| dataSourceId | string | No | No | Unique ID of a data source. |
| localDate | string | No | No | Local date of data, in MM/DD/YYYY format. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| startTime | number | No | No | Data start time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| endTime | number | No | No | Data end time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| timeZone | string | No | No | Time zone where the data is located, in the format of +0800. **Atomic service API:** This API can be used in atomic services since API version 5.0.0(12). |
| modifiedTime | number | No | No | Creation or modification time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) |

#### SamplePoint

SamplePoint<K extends Record<string, [HealthValueType](#healthvaluetype)> = Record<string, [HealthValueType](#healthvaluetype)>>

Data sampling point, which defines the model for sampling measurement in chronological order. One or more fields are used to describe the data. This API inherits from [SampleDataBase](#sampledatabase).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| fields | Pick<K, keyof K> | No | No | Data field. For details about the fields corresponding to each data type, please refer to the model defined in [samplePointHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper). |

#### SamplePointDeleteRequest

type SamplePointDeleteRequest = UnixTimeBasedDataDeleteRequest

Request class for deleting data sampling points, which inherits from Omit<[DataRequest](#datarequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataType | [DataType](#datatype) \| [DataType](#datatype)[] | No | No | Data type to be deleted. |

#### SamplePointReadRequest

SamplePointReadRequest<FK extends Record<string, [HealthValueType](#healthvaluetype)> = Record<string, [HealthValueType](#healthvaluetype)>>

Request class for reading data sampling points, which inherits from Omit<[DataReadRequest](#datareadrequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| samplePointDataType | [DataType](#datatype)\| [DataType](#datatype)[] | No | No | Type of the data to be queried. |
| fields | Partial<Pick<FK, keyof FK>> | No | Yes | List of fields to be read. If the value of **samplePointDataType** is an array, the **fields** parameter cannot be set. For details about the fields corresponding to each data type, please refer to the model defined in [samplePointHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper). If this parameter is not set, all fields are read. |

#### SequencePoint

Detailed health and fitness data point, which inherits from Record<string, [HealthValueType](#healthvaluetype)>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| startTime | number | No | No | Data start time. The value is a Unix timestamp, in milliseconds. Value range: (0, ∞) |
| [P: string] | [HealthValueType](#healthvaluetype) | No | No | Detailed data point field. |

#### SequenceReadOptions

SequenceReadOptions<DK extends Record<string, [SequencePoint](#sequencepoint)[]> = Record<string, [SequencePoint](#sequencepoint)[]>>

Option class for reading health and fitness record details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| withDetails | boolean | No | Yes | Indicates whether to read all details. The value **true** indicates that all details are read, and the value **false** indicates that no details are read. If this parameter is not set, the **withPartialDetails** parameter takes effect. |
| withPartialDetails | (keyof DK)[] | No | Yes | Type of partial details to be read. (If partial details need to be read, the **withDetails** parameter cannot be set.) For details about the details data types associated with workout records and health records, please refer to the models defined in [exerciseSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper) and [healthSequenceHelper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper), respectively. |

#### SequenceValueType

type SequenceValueType = number | string | boolean | object

Health and fitness data value type.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| number | The value can be any number. |
| string | The value can be any string. |
| boolean | The value can be **true** or **false**. The specific meaning varies depending on the actual situation. |
| object | The value can be any object. |

#### SortOrder

Sort order enum object.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Value | Description |
| --- | --- | --- |
| ASC | 0 | Ascending order. |
| DESC | 1 | Descending order. |

#### SubDataType

type SubDataType = DataType

Subdata type.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| id | number | Yes | No | Unique ID of a subdata type. |
| name | string | Yes | Yes | Name of a subdata type. If this parameter is not set, the name matching the subdata type ID is used by default. |

#### UnixTimeBasedDataDeleteRequest

Base class for deletion requests based on the Unix timestamp, which inherits from Omit<[DataRequest](#datarequest), 'startLocalDate' | 'endLocalDate'>.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | **Type** | Read-Only | Optional | **Description** |
| --- | --- | --- | --- | --- |
| dataType | [DataType](#datatype) \| [DataType](#datatype)[] | No | No | Data type to be deleted. |

#### healthStore.init

init(context: common.Context): Promise<void>

Initializes Health Service Kit. This API uses a promise to return the result. Call this API before calling other APIs when you call the kit for the first time.

This API can be used to develop wearables since API 19 Release.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| context | [common.Context](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-context#context) | Yes | Context. Currently, only the [UIAbility](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-app-ability-uiability#uiability) or [UIExtensionAbility](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-app-ability-uiextensionability#uiextensionability) context is supported. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types. |

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  // Obtain the context from the component and ensure that the return value of this.getUIContext().getHostContext() is UIAbilityContext.
  await healthStore.init(this.getUIContext().getHostContext());
  hilog.info(0x0000, 'testTag', 'Succeeded in initing.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to init. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.insertDataSource

insertDataSource(dataSource: DataSourceBase): Promise<string>

Inserts a specific data source. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataSource | [DataSourceBase](#datasourcebase) | Yes | Constructed data source. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<string> | Promise used to return the unique ID (**dataSourceId**) of the data source. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let dataSource: healthStore.DataSourceBase = {
  deviceInfo: {
    uniqueId: 'test',
    name: 'test', // This field is mandatory when a data source is inserted.
    category: healthStore.DeviceCategory.WEARABLE_BAND, // This field is mandatory when a data source is inserted.
    productId: '0554', // This field is mandatory when a data source is inserted.
    model: 'lotana',
    manufacturer: 'HUAWEI',
    mac: 'testDeviceMac',
    sn: 'testDeviceSn',
    hardwareVersion: '1',
    softwareVersion: '2',
    firmwareVersion: '3',
    udid: 'simulateUdid'
  }
}

try {
  const dataSourceId = await healthStore.insertDataSource(dataSource);
  hilog.info(0x0000, 'testTag', `Succeeded in inserting dataSource, the dataSourceId is ${dataSourceId}.`);
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to insert dataSource. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.readDataSource

readDataSource(request: DataSourceReadRequest): Promise<DataSource[]>

Reads a data source. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [DataSourceReadRequest](#datasourcereadrequest) | Yes | Request for reading a data source. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[DataSource](#datasource)[]> | Promise used to return a [DataSource](#datasource) array. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let readSourceRequest: healthStore.DataSourceReadRequest = {
  deviceUniqueId: 'testudidupdate'
}

try {
  let dataSources = await healthStore.readDataSource(readSourceRequest);
  dataSources.forEach((dataSource) => {
    hilog.info(0x0000, 'testTag', `Succeeded in reading dataSource, the dataSourceId is ${dataSource.dataSourceId}.`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read dataSource. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.updateDataSource

updateDataSource(dataSource: DataSource): Promise<void>

Updates a data source. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| dataSource | [DataSource](#datasource) | Yes | Data source to be updated. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let newDataSource: healthStore.DataSource = {
  deviceInfo: {
    uniqueId: 'test',
    name: 'test',
    category: healthStore.DeviceCategory.WEARABLE_BAND,
    productId: '0554',
    model: 'lotana',
    manufacturer: 'HUAWEI',
    mac: 'testDeviceMac',
    sn: 'testDeviceSn',
    hardwareVersion: '1',
    softwareVersion: '2',
    firmwareVersion: '3',
    // Update the UDID.
    udid: 'updateudid'
  },
  // Pass the value of dataSourceId returned when you insert the data source during the development.
  dataSourceId: 'xxx'
}

try {
  await healthStore.updateDataSource(newDataSource);
  hilog.info(0x0000, 'testTag', 'Succeeded in updating dataSource.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to update dataSource. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.saveData

saveData(sampleData: SamplePoint[] | SamplePoint): Promise<void>

Saves data sampling points. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| sampleData | [SamplePoint](#samplepoint)[] \| [SamplePoint](#samplepoint) | Yes | A single data sampling point or an array of data sampling points. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let samplePoint: healthStore.SamplePoint = {
  dataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000,
  localDate: '10/30/2023',
  timeZone: '+0800',
  modifiedTime: 1698633801000,
  // Pass the value of DataSourceId returned when you call insertDataSource to insert the data source.
  dataSourceId: 'xxx',
  fields: {
    bodyTemperature: 39
  }
}

try {
  await healthStore.saveData(samplePoint);
  hilog.info(0x0000, 'testTag', 'Succeeded in saving data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to save data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.saveData

saveData(exerciseSequence: ExerciseSequence[] | ExerciseSequence): Promise<void>

Saves workout record data. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseSequence | [ExerciseSequence](#exercisesequence)[] \| [ExerciseSequence](#exercisesequence) | Yes | A single workout record or an array of workout records. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

// Construct a running record.
const startTime = 1698040800000; // 2023-10-23 14:00:00
const endTime = 1698042600000; // 2023-10-23 14:30:00

const runningSequence: healthStore.exerciseSequenceHelper.running.Model = {
  dataType: healthStore.exerciseSequenceHelper.DATA_TYPE,
  // Pass the value of DataSourceId returned when you call insertDataSource to insert the data source.
  dataSourceId: 'xxx',
  startTime: startTime, // 2023-10-23 14:00:00
  endTime: endTime, // 2023-10-23 14:30:00
  localDate: '10/23/2023',
  timeZone: '+0800',
  modifiedTime: new Date().getTime(),
  exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE,
  duration: 1800000,
  summaries: {
    distance: {
      totalDistance: 2000
    },
    calorie: {
      totalCalories: 20
    },
    speed: {
      avg: 5,
      max: 6
    }
  },
  details: {
    exerciseHeartRate: [
      {
        startTime: startTime,
        bpm: 88
      },
      {
        startTime: startTime + 5000,
        bpm: 89
      }
    ],
    speed: [
      {
        startTime: startTime,
        speed: 2.5
      },
      {
        startTime: startTime + 5000,
        speed: 2.3
      }
    ],
    altitude: [
      {
        startTime: startTime,
        altitude: 100
      },
      {
        startTime: startTime + 5000,
        altitude: 101
      }
    ]
  }
};
try {
  await healthStore.saveData(runningSequence);
  hilog.info(0x0000, 'testTag', 'Succeeded in saving data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to save data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.saveData

saveData(healthSequence: HealthSequence[] | HealthSequence): Promise<void>

Saves health record data. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| healthSequence | [HealthSequence](#healthsequence)[] \| [HealthSequence](#healthsequence) | Yes | A single health record or an array of health records. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let healthSequence: healthStore.healthSequenceHelper.sleepRecord.Model = {
  summaries: {
    fallAsleepTime: 1695740400000, // 2023-09-26 23:00:00
    wakeupTime: 1695769200000, // 2023-09-27 7:00:00
    sleepScore: 80,
    wakeCount: 2,
    sleepType: 1,
    shallowDuration: 14400,
    deepDuration: 7200,
    dreamDuration: 7200,
    wakeDuration: 0,
    duration: 28800
  },
  dataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
  // Pass the value of DataSourceId returned when you call insertDataSource to insert the data source.
  dataSourceId: 'xxx',
  localDate: '09/26/2023',
  startTime: 1695740400000,
  endTime: 1695769200000,
  timeZone: '+0800',
  modifiedTime: 1695769200000,
  details: {
    sleepSegment: [
      {
        startTime: 1695740400000, // 2023-09-26 23:00:00
        endTime: 1695747600000, // 2023-09-27 01:00:00
        sleepStatus: 2
      },
      {
        startTime: 1695747600000, // 2023-09-27 01:00:00
        endTime: 1695754800000, // 2023-09-27 03:00:00
        sleepStatus: 1
      },
      {
        startTime: 1695754800000, // 2023-09-27 03:00:00
        endTime: 1695762000000, // 2023-09-27 05:00:00
        sleepStatus: 3
      },
      {
        startTime: 1695762000000, // 2023-09-27 05:00:00
        endTime: 1695769200000, // 2023-09-27 07:00:00
        sleepStatus: 2
      }
    ]
  }
}
try {
  await healthStore.saveData(healthSequence);
  hilog.info(0x0000, 'testTag', 'Succeeded in saving data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to save data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.readData

readData<T extends SamplePoint>(request: SamplePointReadRequest): Promise<T[]>

Reads data sampling points. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [SamplePointReadRequest](#samplepointreadrequest) | Yes | Request for reading data sampling points. The time span is 31 days. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<T[]> | Promise used to return the array of data sampling points. T inherits from [SamplePoint](#samplepoint). |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let samplePointReadRequest: healthStore.SamplePointReadRequest = {
  samplePointDataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000,
  fields: {
    bodyTemperature: 39
  }
}

try {
  let samplePoints = await healthStore.readData(samplePointReadRequest);
  samplePoints.forEach((samplePoint) => {
    hilog.info(0x0000, 'testTag', `Succeeded in reading data,
      the bodyTemperature is ${samplePoint.fields.bodyTemperature}.`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.readData

readData<T extends ExerciseSequence>(request: ExerciseSequenceReadRequest): Promise<T[]>

Reads workout record data. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [ExerciseSequenceReadRequest](#exercisesequencereadrequest) | Yes | Request for reading workout records. The time span is 31 days. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<T[]> | Promise used to return the array of workout records. T inherits from [ExerciseSequence](#exercisesequence). |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

// Query running records.
const startTime = 1698040800000; // 2023-10-23 14:00:00
const endTime = 1698042600000; // 2023-10-23 14:30:00

const sequenceReadRequest:
  healthStore.ExerciseSequenceReadRequest<healthStore.exerciseSequenceHelper.running.DetailFields> = {
  startTime: startTime,
  endTime: endTime,
  exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE,
  count: 1,
  sortOrder: 1,
  readOptions: {
    withPartialDetails: ['exerciseHeartRate', 'altitude']
 }
};
try {
  const runningSequences =
    await healthStore.readData<healthStore.exerciseSequenceHelper.running.Model>(sequenceReadRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in reading data.');
  runningSequences.forEach((runningSequence) => {
    hilog.info(0x0000, 'testTag', `the start time is ${runningSequence.startTime}.`);
    hilog.info(0x0000, 'testTag', `the end time is ${runningSequence.endTime}.`);
    Object.keys(runningSequence.summaries).forEach((key) => {
      Object.keys(runningSequence.summaries[key]).forEach((fieldName) => {
        hilog.info(0x0000, 'testTag',
          `the summaries of ${key} field ${fieldName} is ${runningSequence.summaries[key][fieldName]}.`);
      });
    });
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.readData

readData<T extends HealthSequence>(request: HealthSequenceReadRequest): Promise<T[]>

Reads health record data. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [HealthSequenceReadRequest](#healthsequencereadrequest) | Yes | Request for reading health records. The time span is 31 days. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<T[]> | Promise used to return the array of health records. T inherits from [HealthSequence](#healthsequence). |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let healthSequenceReadRequest: healthStore.HealthSequenceReadRequest = {
  healthSequenceDataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
  startTime: 1695740400000,
  endTime: 1695769200000,
  readOptions: {
    withDetails: true
  }
}
try {
  const healthSequences = await healthStore.readData(healthSequenceReadRequest);
  
  hilog.info(0x0000, 'testTag', 'Succeeded in reading data.');
  healthSequences.forEach((healthSequence) => {
    hilog.info(0x0000, 'testTag', `the start time is ${healthSequence.startTime}.`);
    hilog.info(0x0000, 'testTag', `the end time is ${healthSequence.endTime}.`);
    Object.keys(healthSequence.summaries).forEach((key) => {
      hilog.info(0x0000, 'testTag', `the summaries of ${key} is ${healthSequence.summaries[key]}.`);
    });
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.deleteData

deleteData(request: SamplePointDeleteRequest | SamplePointDeleteRequest[]): Promise<void>

Deletes data sampling points. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [SamplePointDeleteRequest](#samplepointdeleterequest) \| [SamplePointDeleteRequest](#samplepointdeleterequest)[] | Yes | Request for deleting data sampling points. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let samplePointDeleteRequest: healthStore.SamplePointDeleteRequest = {
  dataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000
}

try {
  await healthStore.deleteData(samplePointDeleteRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.deleteData

deleteData(request: ExerciseSequenceDeleteRequest | ExerciseSequenceDeleteRequest[]): Promise<void>

Deletes workout record data. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [ExerciseSequenceDeleteRequest](#exercisesequencedeleterequest) \| [ExerciseSequenceDeleteRequest](#exercisesequencedeleterequest)[] | Yes | Request for deleting workout records. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let exerciseSequenceDeleteRequest: healthStore.ExerciseSequenceDeleteRequest = {
  exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000
}
try {
  await healthStore.deleteData(exerciseSequenceDeleteRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.deleteData

deleteData(request: HealthSequenceDeleteRequest | HealthSequenceDeleteRequest[]): Promise<void>

Deletes health record data. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [HealthSequenceDeleteRequest](#healthsequencedeleterequest) \| [HealthSequenceDeleteRequest](#healthsequencedeleterequest)[] | Yes | Request for deleting health records. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const healthSequenceDeleteRequest: healthStore.HealthSequenceDeleteRequest = {
  healthSequenceDataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
  startTime: 1695740400000,
  endTime: 1695769200000
}
try {
  await healthStore.deleteData(healthSequenceDeleteRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.deleteData

deleteData(samplePoint: SamplePoint | SamplePoint[]): Promise<void>

Deletes a specified data sampling point. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| samplePoint | [SamplePoint](#samplepoint) \| [SamplePoint](#samplepoint)[] | Yes | A single data sampling point or an array of data sampling points. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  let samplePointReadRequest: healthStore.SamplePointReadRequest = {
    samplePointDataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
    startTime: 1698633801000,
    endTime: 1698633801000
  }
  let samplePoints: healthStore.SamplePoint[] = await healthStore.readData(samplePointReadRequest);
  for (let index = 0; index < samplePoints.length; index++) {
    const samplePoint = samplePoints[index];
    await healthStore.deleteData(samplePoint);
  }
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.deleteData

deleteData(exerciseSequence: ExerciseSequence | ExerciseSequence[]): Promise<void>

Deletes a specified workout record. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| exerciseSequence | [ExerciseSequence](#exercisesequence) \| [ExerciseSequence](#exercisesequence)[] | Yes | A single workout record or an array of workout records. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

// Delete running records.
try {
  const sequenceReadRequest:
    healthStore.ExerciseSequenceReadRequest<healthStore.exerciseSequenceHelper.running.DetailFields> = {
    startTime: 1698040800000,
    endTime: 1698042600000,
    exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE
  };
  const runningSequences = await
    healthStore.readData<healthStore.exerciseSequenceHelper.running.Model>(sequenceReadRequest);
  for (let index = 0; index < runningSequences.length; index++) {
    const runningSequence = runningSequences[index];
    await healthStore.deleteData(runningSequence);
  }
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.deleteData

deleteData(healthSequence: HealthSequence | HealthSequence[]): Promise<void>

Deletes a specified health record. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| healthSequence | [HealthSequence](#healthsequence) \| [HealthSequence](#healthsequence)[] | Yes | A single health record or an array of health records. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  let healthSequenceReadRequest: healthStore.HealthSequenceReadRequest = {
    healthSequenceDataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
    startTime: 1695740400000,
    endTime: 1695769200000
  }
  const healthSequences = await healthStore.readData(healthSequenceReadRequest);
  for (let index = 0; index < healthSequences.length; index++) {
    const healthSequence = healthSequences[index];
    await healthStore.deleteData(healthSequence);
  }
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.aggregateData

aggregateData<T extends AggregateResult>(request: AggregateRequest | AggregateRequest[]): Promise<T[]>

Performs an aggregate query. This API uses a promise to return the result.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 1002700001.

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [AggregateRequest](#aggregaterequest) \| [AggregateRequest](#aggregaterequest)[] | Yes | Request for performing an aggregation query. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<T[]> | Promise used to return the array of aggregation query results. T inherits from [AggregateResult](#aggregateresult). |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let aggregateRequest: healthStore.AggregateRequest<healthStore.samplePointHelper.dailyActivities.AggregateFields> = {
  dataType: healthStore.samplePointHelper.dailyActivities.DATA_TYPE,
  metrics: {
    step: ['sum'],
    calorie: ['sum'],
    distance: ['sum'],
    climbHighAltitude:['sum'],
    isIntensity: ['sum'],
    isStand: ['sum']
 },
  groupBy: {
    unitType: 3,
    duration: 0
  },
  startLocalDate: '10/30/2023',
  endLocalDate: '10/30/2023'
}

try {
  const aggregateResults =
    await healthStore.aggregateData<healthStore.samplePointHelper.dailyActivities.AggregateResult>(aggregateRequest);
  
  hilog.info(0x0000, 'testTag', 'Succeeded in reading data.');
  aggregateResults.forEach((aggregateResult) => {
    hilog.info(0x0000, 'testTag', `the start time is ${aggregateResult.startTime}.`);
    hilog.info(0x0000, 'testTag', `the end time is ${aggregateResult.endTime}.`);
    Object.keys(aggregateResult.fields).forEach((fieldName) => {
      hilog.info(0x0000, 'testTag', `the sum of ${fieldName} is ${aggregateResult.fields[fieldName].sum}.`);
    });
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.requestAuthorizations

requestAuthorizations(context: common.UIAbilityContext, request: AuthorizationRequest): Promise<AuthorizationResponse>

Performs user authorization. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| context | [common.UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1) | Yes | UIAbility context. |
| request | [AuthorizationRequest](#authorizationrequest) | Yes | Authorization request parameter. Ensure that the permission in the authorization parameter has been selected when you [apply for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply). |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[AuthorizationResponse](#authorizationresponse)> | Promise used to return the authorization response result. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal). For other error codes, please refer to [Account Kit ArkTS Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { common } from '@kit.AbilityKit';

let authorizationParameter: healthStore.AuthorizationRequest = {
  readDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE],
  writeDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE]
}

try {
  // Obtain the context from the component and ensure that the return value of this.getUIContext().getHostContext() is UIAbilityContext.
  let authorizationResponse =
    await healthStore.requestAuthorizations(this.getUIContext().getHostContext() as common.UIAbilityContext,
      authorizationParameter);
  
  hilog.info(0x0000, 'testTag', 'Succeeded in requesting authorization.');
  authorizationResponse.writeDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedWriteDataType is : ${dataType.name}`);
  });
  authorizationResponse.readDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedReadDataTypes is : ${dataType.name}`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to request authorization. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.getAuthorizations

getAuthorizations(request: AuthorizationRequest): Promise<AuthorizationResponse>

Queries permissions. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| request | [AuthorizationRequest](#authorizationrequest) | Yes | Authorization query request. |

**Returns:**

| Type | Description |
| --- | --- |
| Promise<[AuthorizationResponse](#authorizationresponse)> | Promise used to return the authorization query result. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [401](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section401-参数检查失败) | Parameter error. Possible causes: 1. Mandatory parameters are left unspecified;2. Incorrect parameter types; 3.Parameter verification failed. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

let queryAuthorizationRequest: healthStore.AuthorizationRequest = {
  readDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE],
  writeDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE]
}

try {
  let queryAuthorizationResponse = await healthStore.getAuthorizations(queryAuthorizationRequest);
  
  hilog.info(0x0000, 'testTag', 'Succeeded in getting authorization.');
  queryAuthorizationResponse.writeDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedWriteDataType is : ${dataType.name}`);
  });
  queryAuthorizationResponse.readDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedReadDataTypes is : ${dataType.name}`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to get authorization. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.cancelAuthorizations

cancelAuthorizations(): Promise<void>

Performs user authorization revoking. This API uses a promise to return the result.

This API can be used to develop wearables since API 19 Release.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the following error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For details about other error codes, please refer to [Account Kit ArkTS Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  await healthStore.cancelAuthorizations();
  hilog.info(0x0000, 'testTag', 'Succeeded in canceling authorization.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to cancel authorization. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.syncAll

syncAll(): Promise<void>

Proactively triggers data syncing on the cloud. This API uses a promise to return the result.

**System capability:** SystemCapability.Health.HealthStore

**Device behavior differences:** This API is supported on phones and tablets. On wearables, it returns error code 801.

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Returns:**

| Type | Description |
| --- | --- |
| Promise<void> | Promise that returns no value. |

**Error codes**

For details about the error codes, please refer to [Health Service Kit ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice) and [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

| ID | Error Message |
| --- | --- |
| [201](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#health-service-kit-call-failure-with-error-code-201) | Permission verification failed. |
| [801](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/errorcode-universal#section801-该设备不支持此api) | Capability not supported. Failed to call the API due to limited device capabilities. |
| [1002700001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700001-internal-system-error) | System internal error. |
| [1002700002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002700002-database-error) | Database processing error. |
| [1002701001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002701001-network-error) | Network error. The network is unavailable. |
| [1002702001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702001-not-signed-in) | Account error. The user has not logged in with HUAWEI ID. |
| [1002702002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002702002-account-exception) | Account error. Failed to obtain account information with HUAWEI ID. |
| [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) | User privacy is not agreed. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

try {
  await healthStore.syncAll();
  hilog.info(0x0000, 'testTag', 'Succeeded in synchronizing data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to synchronize data. Code: ${err.code}, message: ${err.message}`);
}
```

#### healthStore.on('serviceDie')

on(type: 'serviceDie', callback: Callback<void>): void

Subscribes to Health Service Kit process destruction notifications. This API uses an asynchronous callback to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| type | string | Yes | Health Service Kit process status type. This field has a fixed value of **serviceDie**. This event is triggered when the Health Service Kit process is destroyed. |
| callback | Callback<void> | Yes | Callback that returns no value. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

healthStore.on('serviceDie', () => {
  hilog.info(0x0000, 'testTag', 'Succeeded in monitoring the process death.');
});
```

#### healthStore.off('serviceDie')

off(type: 'serviceDie', callback?: Callback<void>): void

Unsubscribes from Health Service Kit process destruction notifications. This API uses an asynchronous callback to return the result.

This API can be used to develop wearables since API 19 Release.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

**Parameters:**

| **Parameter** | **Type** | Mandatory | **Description** |
| --- | --- | --- | --- |
| type | string | Yes | Health Service Kit process status type. This field has a fixed value of **serviceDie**. This event is triggered when the Health Service Kit process is destroyed. |
| callback | Callback<void> | No | Callback that returns no value. - If **callback** is null, cancel all callbacks. - If **callback** is not null, cancel the specified callback. |

> **Note:** Before calling these APIs, call [init](#healthstoreinit) to perform initialization.

**Example:**

```typescript
import { healthStore } from '@kit.HealthServiceKit';

healthStore.off('serviceDie');
```
