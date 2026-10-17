<!--
  Title: Weight
  Catalog: harmonyos-guides
  Document ID: health-weight
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-weight
-->
# Weight

This data records the weight of a user at a certain time point.

Constant in the HarmonyOS SDK: [samplePointHelper.weight.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-11)

> **Note:** This data type is not supported on wearables.

#### OAuth Scope

To apply for the required scopes, go to **Health data** > **Body fat** on the Console of HUAWEI Developers.

#### Sample Details

## Fields

Field definition: [samplePointHelper.weight.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-11)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| bodyWeight | Weight. | number | Yes | kg | [0.1, 500] |
| bmi | Body mass index. | number | No | kg/m2 | [1, 200] |
| bodyFat | Body fat. | number | No | kg | [0, 500] |
| bodyFatRate | Body fat percentage. | number | No | % | [0, 100] |
| muscleMass | Muscle mass. | number | No | kg | [0.1, 150] |
| basalMetabolism | Basal metabolic rate. | number | No | kcal/day | [0, ∞) |
| moisture | Body water mass. | number | No | kg | [0, 500] |
| moistureRate | Body water percentage. | number | No | % | [0, 100] |
| visceralFatLevel | Visceral fat level. | number | No | - | [1, 59] |
| boneSalt | Bone mineral content. | number | No | kg | [0.5, 5] |
| proteinRate | Protein rate. | number | No | % | [0, 100] |
| bodyScore | Body score. | number | No | % | [0, 100] |
| bodyAge | Body age. | number | No | - | [5, 99] |
| skeletalMuscleMass | Skeletal muscle mass. | number | No | kg | [1, 150] |
| impedance | Impedance. | number | No | Ohm | [0.1, 100000] |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | Minute-level | Huawei and other compatible body fat scales (ecosystem devices) |
