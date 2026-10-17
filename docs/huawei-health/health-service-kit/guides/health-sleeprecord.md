<!--
  Title: Sleep
  Catalog: harmonyos-guides
  Document ID: health-sleeprecord
  Updated: 2026-10-14 09:30:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-sleeprecord
-->
# Sleep

#### Nighttime Sleep

A complete record from the time when the user falls asleep to the time when the user wakes up (with the sleep duration exceeding 3 hours). It consists of nighttime sleep data and sleep status sampling data at each moment.

The following table lists the types of health records.

| **Constant** | **Description** | Data Source |
| --- | --- | --- |
| [healthSequenceHelper.sleepRecord.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#constant) | Nighttime sleep. | Selected watches, bands, and so on |

## OAuth Scope

To apply for the required scopes, go to **Health data** > **Sleep** on the Console of HUAWEI Developers.

## Nighttime Sleep Data Types

- Field definition: [healthSequenceHelper.sleepRecord.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#fields)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| fallAsleepTime | Earliest fall-asleep time in segment-based sleep data. | number | Yes | Millisecond | [0, ∞) |
| wakeupTime | Latest wake-up time in segment-based sleep data. | number | Yes | Millisecond | [0, ∞) |
| duration | Nighttime/Normal sleep duration (excluding naps). | number | Yes | Second | [0, ∞) |
| bedTime | Earliest bed time. | number | No | - | [0, ∞) |
| risingTime | Latest wake-up time. | number | No | - | [0, ∞) |
| prepareSleepTime | Time when the user lies down preparing for sleep. | number | No | Millisecond | [0, ∞) |
| shallowDuration | Light sleep duration. | number | No | Second | [0, ∞) |
| deepDuration | Deep sleep duration. | number | No | Second | [0, ∞) |
| dreamDuration | REM duration. | number | No | Second | [0, ∞) |
| wakeDuration | Waking hours. | number | No | Second | [0, ∞) |
| wakeCount | Times woken up. | number | No | - | [0, ∞) |
| onBedDuration | Time in bed. | number | No | Second | [0, ∞) |
| recordDuration | Sleep record duration (or the total duration of a manually entered record). | number | No | Second | [0, ∞) |
| sleepEfficiency | Sleep efficiency. | number | No | - | [0,100] |
| sleepScore | Sleep score. | number | No | - | [0,100] |
| deepSleepContinuity | Deep sleep continuity. | number | No | - | [0,100] |
| respiratoryQualityScore | Respiratory quality. | number | No | - | [0,100] |
| turnOverCount | Roll-over times. | number | No | - | [0, ∞) |
| sleepEndReason | Sleep end reason. | number | No | - | [0, ∞) The options are: **0**: sleep monitoring ended manually **1**: sleep monitoring ended automatically **2**: sleep monitoring interrupted **3**: sleep monitoring ended due to a low battery level |
| sleepSymptoms | Sleep symptoms. | string | No | - | - |
| sleepType | Sleep data type. | number | No | - | **1**: TruSleep **2**: regular sleep **3**: manually recorded **4**: recorded by phone If this parameter is not set, the default value **2** is used. |

## Associated Detailed Data

- Field definition: [healthSequenceHelper.sleepRecord.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#detailfields)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| sleepSegment | Sleep status sampling. | [SleepSegment](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepsegment)[] | No |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-2) | In minutes | Selected watches, bands, and so on |

#### Naps

Naps during the day, including nap data and sleep status sampling data at each moment.

The following table lists the types of health records.

| **Constant** | **Description** | Data Source |
| --- | --- | --- |
| [healthSequenceHelper.sleepNapRecord.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#constant-1) | Naps. | Selected watches, bands, and so on |

## OAuth Scope

To apply for the required scopes, go to **Health data** > **Sleep** on the Console of HUAWEI Developers.

## Nap Data Type

- Field definition: [healthSequenceHelper.sleepNapRecord.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#fields-1)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| noonDuration | Nap duration. | number | Yes | Second | [0, ∞) |
| noonRecordDuration | Nap record duration. | number | No | Second | [0, ∞) |

## Associated Detailed Data

- Field definition: [healthSequenceHelper.sleepNapRecord.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#detailfields-1)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| sleepSegment | Sleep status sampling. | [SleepSegment](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sleepsegment)[] | No |

## Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-2) | In minutes | Selected watches, bands, and so on |
