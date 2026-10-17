<!--
  Title: healthSequenceHelper (Health Record Type Constants)
  Catalog: harmonyos-references
  Document ID: health-api-healthsequencehelper
  Updated: 2026-10-14 09:35:52
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper
-->
# healthSequenceHelper (Health Record Type Constants)

This module provides data type constants and data models of health records.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { healthStore } from '@kit.HealthServiceKit';
```

> **Note:** This module is a sub-module of **healthStore** and needs to be used in **healthStore.healthSequenceHelper** mode.

#### sleepRecord

Nighttime sleep constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Nighttime sleep data type. |

## Model

type Model = healthModels.SleepRecord

Data model for nighttime sleep records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.SleepRecord](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#sleeprecord) | Data model for nighttime sleep records. |

## Fields

type Fields = healthFields.Sleep

List of data fields about nighttime sleep records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.Sleep](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleep) | List of data fields about nighttime sleep records. |

## DetailFields

type DetailFields = healthFields.SleepDetail

List of data fields about sleep details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.SleepDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepdetail) | List of data fields about sleep details. |

#### sleepNapRecord

Nap constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Nap data type. |

## Model

type Model = healthModels.SleepNapRecord

Data model for nap records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.SleepNapRecord](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#sleepnaprecord) | Data model for nap records. |

## Fields

type Fields = healthFields.SleepNap

List of nap record data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.SleepNap](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepnap) | List of nap record data fields. |

## DetailFields

type DetailFields = healthFields.SleepDetail

List of data fields about sleep details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.SleepDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepdetail) | List of data fields about sleep details. |

#### menstrualCycle

Menstrual cycle constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Menstrual cycle data type. |

## Model

type Model = healthModels.MenstrualCycle

Data model for menstrual cycle records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.MenstrualCycle](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#menstrualcycle) | Data model for menstrual cycle records. |

## Fields

type Fields = healthFields.MenstrualCycle

List of data fields about menstrual cycle records.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.MenstrualCycle](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#menstrualcycle) | List of data fields about menstrual cycle records. |

## DetailFields

type DetailFields = healthFields.MenstrualCycleDetail

List of data fields about menstrual cycle details.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 6.1.1(24)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.MenstrualCycleDetail](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#menstrualcycledetail) | List of data fields about menstrual cycle details. |
