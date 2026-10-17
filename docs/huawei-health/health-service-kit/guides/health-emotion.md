<!--
  Title: Emotion
  Catalog: harmonyos-guides
  Document ID: health-emotion
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-emotion
-->
# Emotion

Emotion data of a user at a certain time point.

Constant in the HarmonyOS SDK: [samplePointHelper.emotion.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-4)

#### OAuth Scope

To apply for the required scopes, go to **Health data** > **Emotion** on the Console of HUAWEI Developers.

#### Sampling Details

## Fields

Field definition: [samplePointHelper.emotion.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-4)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| emotionStatus | Emotional state | number | Yes | - | [0, 100) Currently, the Huawei Health app only displays the following values: 1: unpleasant 2: neutral 3: pleasant |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | In hours | Watches, bands, and so on |
