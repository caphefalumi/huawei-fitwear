<!--
  Title: Personal Data Processing Information
  Catalog: huaweihealth-Guides
  Document ID: personal-data-0000002624549045
  Updated: 2026-08-05 02:10:04
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/personal-data-0000002624549045
-->
# Personal Data Processing Information

Huawei is a data processor, but not a data controller. The purpose and method of using data are determined by developers.

In personal data processing, Huawei serves as the end user data processor, and you (the developer) serve as the end user data controller. For appropriate and legal processing of personal data, the following are provided:

- List of personal data processed by Huawei
- Guidance for you to help the end user control personal data

#### List of Personal Data Processed by Huawei

| Personal Data | Purpose of Use | Retention Period |
| --- | --- | --- |
| Device information: mutable device identifier (device UUID), device name, system properties (firmware version), **MAC address, SN**, system settings (language), device status (wearing status, battery level, and charging status), and system status (device connection status) | • **The mutable device identifier (device UUID) and device name are used by the Health Industry SDK to scan for and connect to a specified device. In addition, the mutable device identifier (device UUID) is also used by the Health Industry SDK to implement automatic reconnection after a device is disconnected due to long distance, and to identify the device in data reporting scenarios. The data is stored only locally and will be cleared after the device is deleted.** • **Other device information and device status data are open to industry apps and will not be stored locally or on the cloud.** | **N/A** |
| Basic personal information: height, weight, gender, date of birth, and age | Delivered by industry apps to a device and used to initialize the device. The data is not stored locally or uploaded to the cloud. | N/A |
| **Workout information: step count, distance, stair climbing height, moderate-to-high workout intensity, standup times, workout type, active calories, resting calories, workout status, exercise duration, and hours active** **Health information:** **heart rate (heart rate data, maximum heart rate, minimum heart rate, resting heart rate, heart rate variability [HRV], and R-R interval [RRI]), SpO2 (SpO2 and minimum SpO2), stress data (stress value and level), emotion (emotion data and category), and sleep data (sleep status, sleep quality score, sleep duration, nighttime sleep details, nap details, sleep details, and sleep breathing awareness data)** | **Used by industry apps to query or subscribe to fitness and health data. The Health Industry SDK only transmits the data transparently, and the data will not be stored locally or on the cloud.** | **N/A** |

#### Guidance for You to Help the End User Control Personal Data

Among the preceding personal data, the Health Industry SDK only locally stores the mutable device identifier (UUID) to implement automatic reconnection after a device is disconnected due to long distance, and to identify the device in data reporting scenarios. The UUID is cleared after the device is deleted.

You need to obtain end users' consent before processing such data, develop a publicly stated privacy statement in compliance with applicable laws and regulations, process end users' personal data in accordance with applicable laws and regulations, and retain such personal data only within the minimum necessary period.

Last updated: May 30, 2026
