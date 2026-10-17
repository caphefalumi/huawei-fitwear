<!--
  Title: samplePointHelper (Sampling Data Type Constants)
  Catalog: harmonyos-references
  Document ID: health-api-samplepointhelper
  Updated: 2026-10-14 09:35:52
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper
-->
# samplePointHelper (Sampling Data Type Constants)

This module provides sampling data type constants and data models.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { healthStore } from '@kit.HealthServiceKit';
```

> **Note:** This module is a sub-module of **healthStore** and needs to be used in **healthStore.samplePointHelper** mode.

#### bloodOxygenSaturation

SpO2 constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | SpO2 data type. |

## Model

type Model = healthModels.BloodOxygenSaturation

Data model for SpO2 sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.BloodOxygenSaturation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#bloodoxygensaturation) | Data model for SpO2 sampling. |

## Fields

type Fields = healthFields.BloodOxygenSaturation

List of SpO2 sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.BloodOxygenSaturation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bloodoxygensaturation) | List of SpO2 sampling data fields. |

## AggregateResult

type AggregateResult = healthModels.BloodOxygenSaturationAggregateResult

Model for SpO2 sampling data aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.BloodOxygenSaturationAggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#bloodoxygensaturationaggregateresult) | Model for SpO2 sampling data aggregation results. |

## AggregateRequest

type AggregateRequest = healthModels.BloodOxygenSaturationAggregateRequest

Model for requesting aggregation of SpO2 sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.BloodOxygenSaturationAggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#bloodoxygensaturationaggregaterequest) | Model for requesting aggregation of SpO2 sampling data. |

## AggregateFields

type AggregateFields = healthFields.BloodOxygenSaturationAggregation

List of aggregate fields supported by SpO2 sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.BloodOxygenSaturationAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bloodoxygensaturationaggregation) | List of aggregate fields supported by SpO2 sampling data. |

#### bloodPressure

Blood pressure constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Blood pressure data type. |

## Model

type Model = healthModels.BloodPressure

Data model for blood pressure sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.BloodPressure](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#bloodpressure) | Data model for blood pressure sampling. |

## Fields

type Fields = healthFields.BloodPressure

List of blood pressure sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.BloodPressure](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bloodpressure) | List of blood pressure sampling data fields. |

#### bodyTemperature

Body temperature constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Body temperature data type. |

## Model

type Model = healthModels.BodyTemperature

Data model for body temperature sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.BodyTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#bodytemperature) | Data model for body temperature sampling. |

## Fields

type Fields = healthFields.BodyTemperature

List of body temperature sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.BodyTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bodytemperature) | List of body temperature sampling data fields. |

## AggregateResult

type AggregateResult = healthModels.BodyTemperatureAggregateResult

Model for body temperature sampling data aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.BodyTemperatureAggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#bodytemperatureaggregateresult) | Model for body temperature sampling data aggregation results. |

## AggregateRequest

type AggregateRequest = healthModels.BodyTemperatureAggregateRequest

Model for requesting aggregation of body temperature sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.BodyTemperatureAggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#bodytemperatureaggregaterequest) | Model for requesting aggregation of body temperature sampling data. |

## AggregateFields

type AggregateFields = healthFields.BodyTemperatureAggregation

List of aggregate fields supported by body temperature sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.BodyTemperatureAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#bodytemperatureaggregation) | List of aggregate fields supported by body temperature sampling data. |

#### dailyActivities

Daily activity constant and data model.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Daily activity data type. |

## Model

type Model = healthModels.DailyActivities

Data model for daily activity sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.DailyActivities](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#dailyactivities) | Data model for daily activity sampling. |

## Fields

type Fields = healthFields.DailyActivities

List of daily activity sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.DailyActivities](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#dailyactivities) | List of daily activity sampling data fields. |

## AggregateResult

type AggregateResult = healthModels.DailyActivitiesAggregateResult

Model for daily activity sampling data aggregation results.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.DailyActivitiesAggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#dailyactivitiesaggregateresult) | Model for daily activity sampling data aggregation results. |

## AggregateRequest

type AggregateRequest = healthModels.DailyActivitiesAggregateRequest

Model for requesting aggregation of daily activity sampling data.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.DailyActivitiesAggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#dailyactivitiesaggregaterequest) | Model for requesting aggregation of daily activity sampling data. |

## AggregateFields

type AggregateFields = healthFields.DailyActivitiesAggregation

List of aggregate fields supported by daily activity sampling data.

**Atomic service API:** This API can be used in atomic services since API version 5.0.0(12).

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.DailyActivitiesAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#dailyactivitiesaggregation) | List of aggregate fields supported by daily activity sampling data. |

#### emotion

Emotion constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Emotion data type. |

## Model

type Model = healthModels.Emotion

Data model for emotion sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Emotion](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#emotion) | Data model for emotion sampling. |

## Fields

type Fields = healthFields.Emotion

List of emotion sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.Emotion](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#emotion) | List of emotion sampling data fields. |

#### heartRate

Dynamic heart rate constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Dynamic heart rate data type. |

## Model

type Model = healthModels.HeartRate

Data model for dynamic heart rate sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.HeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#heartrate) | Data model for dynamic heart rate sampling. |

## Fields

type Fields = healthFields.HeartRate

List of dynamic heart rate sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.HeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#heartrate) | List of dynamic heart rate sampling data fields. |

## AggregateResult

type AggregateResult = healthModels.HeartRateAggregateResult

Model for dynamic heart rate sampling data aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.HeartRateAggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#heartrateaggregateresult) | Model for dynamic heart rate sampling data aggregation results. |

## AggregateRequest

type AggregateRequest = healthModels.HeartRateAggregateRequest

Model for requesting aggregation of dynamic heart rate sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.HeartRateAggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#heartrateaggregaterequest) | Model for requesting aggregation of dynamic heart rate sampling data. |

## AggregateFields

type AggregateFields = healthFields.HeartRateAggregation

List of aggregate fields supported by dynamic heart rate sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.HeartRateAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#heartrateaggregation) | List of aggregate fields supported by dynamic heart rate sampling data. |

#### heartRateVariability

Heart rate variability constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Heart rate variability data type. |

## Model

type Model = healthModels.HeartRateVariability

Data model for heart rate variability sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.HeartRateVariability](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#heartratevariability) | Data model for heart rate variability sampling. |

## Fields

type Fields = healthFields.HeartRateVariability

List of heart rate variability sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.1.0(18)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.HeartRateVariability](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#heartratevariability) | List of heart rate variability sampling data fields. |

#### height

Height constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Height data type. |

## Model

type Model = healthModels.Height

Data model for height sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Height](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#height) | Data model for height sampling. |

## Fields

type Fields = healthFields.Height

List of height sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.Height](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#height) | List of height sampling data fields. |

#### restingHeartRate

Resting heart rate constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Resting heart rate data type. |

## Model

type Model = healthModels.RestingHeartRate

Data model for resting heart rate sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.RestingHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#restingheartrate) | Data model for resting heart rate sampling. |

## Fields

type Fields = healthFields.RestingHeartRate

List of resting heart rate sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.RestingHeartRate](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#restingheartrate) | List of resting heart rate sampling data fields. |

## AggregateResult

type AggregateResult = healthModels.RestingHeartRateAggregateResult

Model for resting heart rate sampling data aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.RestingHeartRateAggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#restingheartrateaggregateresult) | Model for resting heart rate sampling data aggregation results. |

## AggregateRequest

type AggregateRequest = healthModels.RestingHeartRateAggregateRequest

Model for requesting aggregation of resting heart rate sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.RestingHeartRateAggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#restingheartrateaggregaterequest) | Model for requesting aggregation of resting heart rate sampling data. |

## AggregateFields

type AggregateFields = healthFields.RestingHeartRateAggregation

List of aggregate fields supported by resting heart rate sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.RestingHeartRateAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#restingheartrateaggregation) | List of aggregate fields supported by resting heart rate sampling data. |

#### skinTemperature

Skin temperature constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Skin temperature data type. |

## Model

type Model = healthModels.SkinTemperature

Data model for skin temperature sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.SkinTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#skintemperature) | Data model for skin temperature sampling. |

## Fields

type Fields = healthFields.SkinTemperature

List of skin temperature sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.SkinTemperature](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skintemperature) | List of skin temperature sampling data fields. |

## AggregateResult

type AggregateResult = healthModels.SkinTemperatureAggregateResult

Model for skin temperature sampling data aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.SkinTemperatureAggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#skintemperatureaggregateresult) | Model for skin temperature sampling data aggregation results. |

## AggregateRequest

type AggregateRequest = healthModels.SkinTemperatureAggregateRequest

Model for requesting aggregation of skin temperature sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.SkinTemperatureAggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#skintemperatureaggregaterequest) | Model for requesting aggregation of skin temperature sampling data. |

## AggregateFields

type AggregateFields = healthFields.SkinTemperatureAggregation

List of aggregate fields supported by skin temperature sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.SkinTemperatureAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skintemperatureaggregation) | List of aggregate fields supported by skin temperature sampling data. |

#### stress

Stress constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Stress data type. |

## Model

type Model = healthModels.Stress

Data model for stress sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Stress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#stress) | Data model for stress sampling. |

## Fields

type Fields = healthFields.Stress

List of stress sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.Stress](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stress) | List of stress sampling data fields. |

## AggregateResult

type AggregateResult = healthModels.StressAggregateResult

Model for stress sampling data aggregation results.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.StressAggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#stressaggregateresult) | Model for stress sampling data aggregation results. |

## AggregateRequest

type AggregateRequest = healthModels.StressAggregateRequest

Model for requesting aggregation of stress sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.StressAggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#stressaggregaterequest) | Model for requesting aggregation of stress sampling data. |

## AggregateFields

type AggregateFields = healthFields.StressAggregation

List of aggregate fields supported by stress sampling data.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.StressAggregation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#stressaggregation) | List of aggregate fields supported by stress sampling data. |

#### weight

Weight constant and data model.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

## Constant

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| DATA_TYPE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Weight data type. |

## Model

type Model = healthModels.Weight

Data model for weight sampling.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthModels.Weight](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthmodels#weight) | Data model for weight sampling. |

## Fields

type Fields = healthFields.Weight

List of weight sampling data fields.

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Type | **Description** |
| --- | --- |
| [healthFields.Weight](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#weight) | List of weight sampling data fields. |
