<!--
  Title: Personal Data Processing Information
  Catalog: huaweihealth-Guides
  Document ID: personal-data-0000002385985865
  Updated: 2026-08-05 02:10:04
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/personal-data-0000002385985865
-->
# Personal Data Processing Information

Huawei is a data processor, but not a data controller. The purpose and method of using data are determined by developers.

In personal data processing, Huawei serves as the end user data processor, and you (the developer) serve as the end user data controller. For appropriate and legal processing of personal data, the following are provided:

- List of personal data processed by Huawei
- Guidance for you to help the end user control personal data

#### List of Personal Data Processed by Huawei

| Personal Data | Purpose of Use | Retention Period |
| --- | --- | --- |
| Device information: device name, **SN**, system settings (language), and device status (wearing status and battery level) | **Used for device authentication and device information query.** | **N/A** |
| Basic personal information: height, weight, gender, date of birth, and age | Delivered by the app and used to initialize the device; not uploaded to the cloud. | N/A |
| **Workout information: step count, step cadence, distance, stairs climbed, moderate-to-high workout intensity, standup times, workout type, workout duration, maximum oxygen uptake, active calories, resting calories, workout heart rate zone, maximum heart rate, minimum heart rate, training status (time required for full recovery and workout load), speed, workout pace, pace zone, pace zone statistics, altitude (total ascent and descent height), other workout data (workout status, exercise duration, hours active, activity time, single workout data, stroke rate, stroke count, and cadence), rope jump data, and swimming data** **Health information:** **heart rate (heart rate data, maximum heart rate, minimum heart rate, resting heart rate, heart rate recovery, HRV, and RRI), heart health (pulse wave arrhythmia analysis result and PPG-based pulse wave arrhythmia analysis data), SpO2 (SpO2 level and minimum SpO2), stress data (stress value and level), emotion data (emotion data and emotion classification), temperature (skin temperature data and core body temperature data), sleep data (sleep quality score, sleep duration, nighttime sleep details, nap details, sleep details, Sleep breathing awareness data, and sleep apnea risk level), and health risk assessment data** | **Used by industry apps to query or subscribe to fitness and health data. The Health Industry SDK only transmits the data transparently, and the data will not be stored locally or on the cloud.** | **N/A** |
| Sensor data: PPG sensor | Used by industry apps to subscribe to sensor data. The Health Industry SDK only transmits the data transparently, and the data will not be stored locally or on the cloud. | N/A |

Last updated: May 22, 2026
