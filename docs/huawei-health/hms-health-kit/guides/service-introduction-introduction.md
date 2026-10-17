<!--
  Title: Service Introduction
  Catalog: HMSCore-Guides-V5
  Document ID: introduction-0000001050060843-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/introduction-0000001050060843-V5
-->
**
# Service Introduction

Extended Health Kit capabilities open up more real-time fitness/health data and scenario-specific fitness and health solution data.

By integrating extended Health Kit capabilities, you can obtain local health and fitness data from the Huawei Health app or write your app data to Health, upon user authorization. These capabilities allow for secure, cross-app data sharing (only on the client side) and merges apps developed by ecosystem developers, providing consumers with better, more secure, and more professional fitness and health services.

There are two major application scenarios:

- Reading data: A third-party app reads user data from the Huawei Health app.
- Writing data: A third-party app writes data to the Huawei Health app.

#### Scenario 1: Reading Data

If you wish to obtain real-time heart rate data from a Huawei wearable device and display the data on your app, you can integrate extended Health Kit capabilities for measurements and automatic data reading. The measurement and data reading can be performed only after the user has granted authorization. The following figure shows the interaction process.
Figure 1 **Procedure for reading the heart rate data**
#### Scenario 2: Writing Data

If you wish to write the user data measured by a body fat scale into the HUAWEI Health app and display the data on the HUAWEI Health app, you can integrate HiHealth Kit for easy data writing. The following figure shows the interaction process.
Figure 2 **Procedure for writing data measured by a body fat scale

#### Open Data Types

Currently, extended Health Kit capabilities open the following data types:

| Type | **Data Type** | **Description** | Reading | Writing |
| --- | --- | --- | --- | --- |
| Health behavior management | Personal profile | Includes the gender, date of birth, height, and weight. | √ | × |
| Basic workout management | Daily activities | Includes step count (statistics and details), distance, calories, and medium- and high-intensity activities. | √ | × |
| Single workout record | Includes the walking, running, and cycling records, but does not include GPS tracks. | √ | × |  |
| Real-time workout data | Includes the duration, distance, speed, heart rate, calories, step count, step cadence, stroke count, and stroke rate. | √ | × |  |
| Heart health/Sleep management | Sleep | Includes TruSleep data such as sleep scores and sleep durations, as well as regular sleep data. | √ | × |
| Heart health | Includes daily heart statistics and real-time heart measurement data: • Daily heart statistics include the heart rate range, resting heart rate, and heart rate details. • Real-time heart rate measurement data includes real-time heart rate and heart RR interval (RRI). | √ | × |  |
| Diet/Fat reduction management | Weight | Includes the weight, BMI, fat rate, muscle mass, and other related data measured by the body fat scale. | √ | √ |
| Emotion/Stress management | Stress | Includes the stress values. | √ | × |
| Chronic disease management | Blood oxygen | Includes daily maximum, minimum, and average blood oxygen level of the day, as well as the last measured blood oxygen level of each day. | √ | × |

> **Note:** Currently, the data of your apps written using the extended Health Kit capabilities is not uploaded to the cloud and is not counted in as the operation activities of the HUAWEI Health app. You can delete only the weight data that has been written to Health.

#### Restrictions

## Supported Devices

| Device Type | Requirements |
| --- | --- |
| Phone | The following conditions must all be met: • A Huawei phone is required. • The HMS Core (APK) 5.1.0.300 or a later version has been installed. • The HUAWEI Health app has been installed. It is recommended that you obtain the latest version from HUAWEI AppGallery. For details about the mapping between the app and SDK versions, refer to [Version Change History](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/version-change-history-0000001053214729-V5). NOTICE: The app version 11.0.3.512 or later is required to gain full access to the API functions of extended Health Kit capabilities. |
| Fitness and health device | The device must be contained in the list in **Devices** > **Add** in the HUAWEI Health app. |

## Supported Countries/Regions

For details, please refer to [Supported Countries/Regions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/countries-regions-0000001101570814-V5).
