<!--
  Title: Height
  Catalog: harmonyos-guides
  Document ID: health-height
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-height
-->
# Height

Height data of a user at a certain time point.

Constant in the HarmonyOS SDK: [samplePointHelper.height.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-7)

> **Note:** This data type is not supported on wearables.

#### OAuth Scope

To apply for the required scopes, go to **Health data** > **Body fat** on the Console of HUAWEI Developers.

#### Sampling Details

## Fields

Field definition: [samplePointHelper.height.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-7)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| height | Height | number | Yes | cm | - |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | In hours | Personal information in the Huawei Health app |
