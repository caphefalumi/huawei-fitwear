<!--
  Title: Overview
  Catalog: harmonyos-guides
  Document ID: health-exercisesequence-summary
  Updated: 2026-10-14 09:30:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-exercisesequence-summary
-->
# Overview

A workout record represents a continuous exercise session and consists of the workout type, app information, time range, associated detailed data, and associated statistical data. Examples include running and rope skipping sessions.

You can call the API for [querying workout record data](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-1) to obtain workout record data from the HUAWEI Health app.

For details about the workout record data model, please refer to [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence).

Workout record type constant: [exerciseSequenceHelper.DATA_TYPE](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper#constant)

#### OAuth Scope

Apply for the following scopes on the Console of HUAWEI Developers:

**Activity records** > **Activity record**

**Activity records** > **Activity**

**Activity records** > **Location**

> **Note:** To read/write workout records, apply for the workout summary read/write permission. To read/write workout records and associate them with the corresponding details, apply for both the workout summary read/write permission and the workout details read/write permission. To read/write workout records where the associated detailed data includes location details, apply for the workout summary read/write permission, workout details read/write permission, and workout location details read/write permission.

#### Data Openness

| Open API | Query Timeliness | Data Source |
| --- | --- | --- |
| [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-1) | In minutes | Mobile phones, watches, bands, and so on |
