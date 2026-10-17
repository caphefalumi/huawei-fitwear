<!--
  Title: Menstrual Cycle
  Catalog: harmonyos-guides
  Document ID: health-menstrualcycle
  Updated: 2026-10-14 09:30:02
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-menstrualcycle
-->
# Menstrual Cycle

This feature records a female user's daily physical status during her menstrual cycle (defaulting to 28 days), with each record representing the user's status for a single day.

> **Note:** This type of data is open starting from API version 24.

The following table lists the types of health records.

| **Constant** | **Description** | Data Source |
| --- | --- | --- |
| [healthSequenceHelper.menstrualCycle.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#constant-2) | Menstrual cycle. | HUAWEI Health app |

#### OAuth Scope

To apply for the required scope, go to **Health data** > **Reproductive** on the Console of HUAWEI Developers.

#### Menstrual Cycle Data Types

- Field definition: [healthSequenceHelper.menstrualCycle.Fields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#fields-2)

| **Field** | Description | **Type** | Mandatory | Unit | Value Range |
| --- | --- | --- | --- | --- | --- |
| status | Daily status. | number | Yes | - | The options are as follows: **0**: normal **100**: regular menstrual period **101**: first day of the menstrual period **102**: last day of the menstrual period **2**: day of ovulation **300**: predicted regular menstrual period **301**: predicted first day of the menstrual period **302**: predicted last day of the menstrual period **400**: regular fertile window **401**: first day of the fertile window **402**: last day of the fertile window **403**: fertile window of only one day |
| remarks | Remarks. | string | No | - | - |

#### Associated Detailed Data

- Field definition: [healthSequenceHelper.menstrualCycle.DetailFields](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthsequencehelper#detailfields-2)

| **Field** | Description | **Type** | Mandatory |
| --- | --- | --- | --- |
| menstrualFlow | Menstrual flow sample. | [MenstrualFlow](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#menstrualflow)[] | No |
| dysmenorrhea | Dysmenorrhea severity sample. | [Dysmenorrhea](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#dysmenorrhea)[] | No |
| physicalSymptoms | Physical symptoms sample. | [PhysicalSymptoms](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#physicalsymptoms)[] | No |
| mood | Mood sample. | [Mood](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#mood)[] | No |
| skin | Skin condition sample. | [Skin](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#skin)[] | No |
| sexuality | Sexual activity sample. | [Sexuality](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#sexuality)[] | No |
| ovulationTestPaper | Ovulation test paper sample. | [OvulationTestPaper](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#ovulationtestpaper)[] | No |
| cervicalMucus | Cervical mucus sample. | [CervicalMucus](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthfields#cervicalmucus)[] | No |

#### Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-2) | Hourly | HUAWEI Health app |
