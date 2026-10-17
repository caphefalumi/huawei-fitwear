<!--
  Title: Heart Rate Variability
  Catalog: harmonyos-guides
  Document ID: ide-heart-rate-variability
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-heart-rate-variability
-->
# Heart Rate Variability

Heart rate variability data of a user at a certain time point.

Constant in the HarmonyOS SDK: [samplePointHelper.heartRateVariability.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-6)

#### OAuth Scope

To apply for the required scopes, go to **Health data** > **Heart rate** on the Console of HUAWEI Developers.

#### Sampling Details

## Fields

Field definition: [samplePointHelper.heartRateVariability.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-6)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| heartRateVariabilityRMSSD | Heart rate variability | number | Yes | Millisecond | (0, 200] |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | In hours | Watches, bands, and so on |
