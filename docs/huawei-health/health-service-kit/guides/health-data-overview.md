<!--
  Title: Open Data Overview
  Catalog: harmonyos-guides
  Document ID: health-data-overview
  Updated: 2026-10-14 09:28:49
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-data-overview
-->
# Open Data Overview

This section lists the data provided by Health Service Kit. You can request data permissions for your app as needed. In the **Openness Level** column,  indicates advanced data that is not open to individual developers. You can access such data by registering as an enterprise developer and requesting the relevant permissions.  indicates basic data that is open both to individual and enterprise developers.

> **Note:** Data timeliness depends on actual user behavior. If the wearable is not connected to the phone via Bluetooth or the HUAWEI Health app is not kept alive in the background, data timeliness cannot be ensured. During the development, you need to take extreme situations that may affect data timeliness into consideration, and determine the appropriate data usage scenarios, to ensure the stability of your product/service. For details about the permissions corresponding to each data type, please refer to [Permission Description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description).

**Table 1** **Sample data**

| Sub-Category | Data Item | Openness Level | Data Timeliness | Read Supported | Write Supported |
| --- | --- | --- | --- | --- | --- |
| [Daily activities](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-daily-activities) | Daily activity data such as step count, calories, and distance |  | Hourly | Y | Y |
| [Heart rate](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-heart-rate) | Dynamic heart rate, resting heart rate, and heart rate variability |  | Hourly | Y | Y |
| [SpO2](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-blood-oxygen) | Instantaneous blood oxygen saturation |  | Hourly | Y | Y |
| [Stress](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-stress) | Stress score |  | Hourly | Y | Y |
| [Body temperature](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-body-temperature) | Body temperature and skin temperature |  | Minute-level | Y | Y |
| [Blood pressure](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-blood-pressure) | Systolic and diastolic blood pressure, pulse, and so on |  | Minute-level | Y | Y |
| [Weight](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-weight) | Weight, body fat rate, BMI, and so on |  | Minute-level | Y | Y |
| [Height](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-height) | Height |  | Minute-level | Y | Y |
| [Emotion](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-emotion) | Emotion data |  | Hourly | Y | Y |

**Table 2** **Health and workout records**

| Sub-Category | Data Item | Openness Level | Data Timeliness | Read Supported | Write Supported |
| --- | --- | --- | --- | --- | --- |
| [Sleep](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-sleeprecord) | Segment-based sleep sample data and sleep records |  | Minute-level | Y | Y |
| [Menstrual cycle](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-menstrualcycle) | Menstrual flow, dysmenorrhea severity, physical symptoms, mood, skin condition, ovulation test result, and vaginal spotting |  | Hourly | Y | N |
| [Workout record data](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-exercisesequence-summary) | Workout records for different modes such as running, cycling, walking, jump rope, and treadmill |  | Minute-level | Y | Y |
