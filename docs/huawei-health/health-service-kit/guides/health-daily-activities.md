<!--
  Title: Daily Activities
  Catalog: harmonyos-guides
  Document ID: health-daily-activities
  Updated: 2026-10-14 09:30:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-daily-activities
-->
# Daily Activities

Daily activity data of a user within a short period of time.

- Constant in the HarmonyOS SDK: [samplePointHelper.dailyActivities.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#constant-3) > **Note:** This data type is not supported on wearables. To read real-time daily activity data, use the [Real-time Activity Rings Data](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-wearable-three-ring-read) API.

#### OAuth Scope

To apply for the required scopes, go to **Activity data** > **Daily activity summary** on the Console of HUAWEI Developers.

#### Sampling Details

## Fields

- Field definition: [samplePointHelper.dailyActivities.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#fields-3)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| step | Step count. | number | Yes | Step | [0, 500) |
| calorie | Calories. | number | Yes | cal | [0, 65536) |
| distance | Distance. | number | Yes | Meter | [0, ∞) |
| duration | Duration. | number | No | Minute | **0** or **1** |
| status | Status (walking, running, cycling, climbing, etc.) | number | No | - | **2**: mountain climbing **3**: cycling **4**: running **5**: walking **9**: swimming **10**: working out **13**: standing |
| isIntensity | Whether an activity is of moderate or high intensity. | number | No | - | **0**: no **1**: yes |
| climbHighAltitude | Altitude difference (positive or negative). | number | No | Meter | - |
| isStand | Whether the user stands. (If there is an activity record within an hour, the first minute of the hour is marked as **1**.) | number | No | - | **0**: no **1**: yes |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) | In 10 minutes | Mobile phones, watches, bands, and so on |

#### Sampling Statistics

## Aggregation Metrics

- Field definition: [samplePointHelper.dailyActivities.AggregateFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-samplepointhelper#aggregatefields-2) 
| **Field** | Description | Aggregation Metric | **Type** | Unit |
| --- | --- | --- | --- | --- |
| step | Step count. | sum | number | Step |
| calorie | Calories. | sum | number | cal |
| distance | Distance. | sum | number | Meter |
| isIntensity | Whether an activity is of moderate or high intensity. (Data aggregation by day. Matching with the Exercise data of Activity rings in the Huawei Health app.) | sum | number | - |
| climbHighAltitude | Altitude difference (positive or negative). | sum | number | Meter |
| isStand | Whether the user stands. (If there is an activity record within an hour, the first minute of the hour is marked as **1**. Data aggregation by day. Matching with the Stand data of Activity rings in the Huawei Health app.) | sum | number | - |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) | In 10 minutes | Mobile phones, watches, bands, and so on |
