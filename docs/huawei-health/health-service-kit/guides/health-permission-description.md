<!--
  Title: Permission Description
  Catalog: harmonyos-guides
  Document ID: health-permission-description
  Updated: 2026-10-14 09:29:53
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description
-->
# Permission Description

Permissions are required for reading and writing health and fitness data and for managing workout linkage. For details about how to apply for the permissions, please refer to [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply). The following lists the permissions for each data type.

#### Wearable

| Data Type | Constant in the HarmonyOS SDK | Read | Write |
| --- | --- | --- | --- |
| Daily activities | [samplePointHelper.dailyActivities.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-3) | Daily activity data (read) | Daily activity data (write) |
| Dynamic heart rate | [samplePointHelper.heartRate.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-5) | Heart rate data (read) | Heart rate data (write) |
| Resting heart rate | [samplePointHelper.restingHeartRate.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-8) | Heart rate data (read) | Heart rate data (write) |
| SpO2 | [samplePointHelper.bloodOxygenSaturation.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant) | SpO2 data (read) | SpO2 data (write) |
| Stress | [samplePointHelper.stress.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-10) | Stress data (read) | Stress data (write) |
| Body temperature | [samplePointHelper.bodyTemperature.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-2) | Body temperature data (read) | Body temperature data (write) |
| Skin temperature | [samplePointHelper.skinTemperature.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-9) | Body temperature data (read) | Body temperature data (write) |
| Blood pressure | [samplePointHelper.bloodPressure.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-1) | Blood pressure data (read) | Blood pressure data (write) |
| Height | [samplePointHelper.height.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-7) | Body fat data (read) | Body fat data (write) |
| Weight | [samplePointHelper.weight.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-11) | Body fat data (read) | Body fat data (write) |
| Emotion | [samplePointHelper.emotion.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-4) | Emotion data (read) | Emotion data (write) |
| Heart rate variability | [samplePointHelper.heartRateVariability.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-6) | Heart rate data (read) | Heart rate data (write) |
| Sleep | [healthSequenceHelper.sleepRecord.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#constant) [healthSequenceHelper.sleepNapRecord.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#constant-1) | Sleep data (read) | Sleep data (write) |
| Workout records | [exerciseSequenceHelper.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant) | Workout summary (read) Workout details (read) Workout location details (read) | Workout summary (write) Workout details (write) Workout location details (write) |

#### Lite Wearable

| Permission | Permission Field and Value | Description |
| --- | --- | --- |
| Workout linkage | scopes: ['https://www.huawei.com/healthkit/workout'] | Enables workout linkage management. Once granted, the app can manage workout linkage switches. |
| Workout summary read permission | readDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY] | Allows the app to read workout summary data. |
| Workout summary write permission | writeDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY] | Allows the app to write workout summary data. |

> **Note:** To read/write workout records, apply for the workout summary read/write permission. To read/write workout records and associate them with the corresponding details, apply for both the workout summary read/write permission and the workout details read/write permission. To read/write workout records where the associated detailed data includes location details, apply for the workout summary read/write permission, workout details read/write permission, and workout location details read/write permission.
