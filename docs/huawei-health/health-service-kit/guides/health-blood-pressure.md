<!--
  Title: Blood Pressure
  Catalog: harmonyos-guides
  Document ID: health-blood-pressure
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-blood-pressure
-->
# Blood Pressure

Blood pressure of a user at a certain time point.

Constant in the HarmonyOS SDK: [samplePointHelper.bloodPressure.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-1)

> **Note:** This data type is not supported on wearables.

#### OAuth Scope

To apply for the required scopes, go to **Health data** > **Blood pressure** on the Console of HUAWEI Developers.

#### Sampling Details

## Fields

Field definition: [samplePointHelper.bloodPressure.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-1)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| bloodPressureSystolic | Systolic (top) pressure. | number | Yes | mmHg | (0, ∞) |
| bloodPressureDiastolic | Diastolic (bottom) pressure. | number | Yes | mmHg | (0, ∞) |
| sphygmus | Pulse. | number | No | Beats/min | (0, ∞) |
| measurementAnomalyFlag | Measurement exception event. | number | No | - | (0, ∞) The options are: **1**: normal **2**: The device is not level with the user's heart. **3**: The user shakes slightly during the measurement. **4**: The user does not rest for 5 minutes or more before the measurement. |
| beforeMeasureActivity | Activity before measurement. | number | No | - | (0, ∞) The options are: **1**: intense exercise **2**: smoking **3**: eating **4**: drinking alcohol **5**: drinking coffee **6**: no activity **7**: after getting up **8**: prepared for bed **100**: custom |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | In minutes | Blood pressure monitors or more |
