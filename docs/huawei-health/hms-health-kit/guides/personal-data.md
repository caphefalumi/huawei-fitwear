<!--
  Title: Personal Data Processing Information
  Catalog: HMSCore-Guides-V5
  Document ID: personal-data-0000001050069754-V5
  Updated: 2021-06-07 01:00:34
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/personal-data-0000001050069754-V5
-->
# Personal Data Processing Information

#### List of Personal Data Processed by Huawei

Last modified: June 5, 2020

Huawei is a data processor, but not a data controller. The purpose and method of using data are determined by users.

In personal data processing of Health Kit, Huawei serves as the end user data processor, and you (the developer) serve as the end user data controller. For appropriate and legal processing of personal data, the following are provided:

- List of personal data processed by Huawei
- Guidance for you to help the end user control personal data

| Personal Data | Processing Purpose | Retention Period |
| --- | --- | --- |
| Personal information: height and weight | Health Kit provides a platform for users to store and share their data. It does not proactively process any user data. All data display and fitness and health services are provided by developers. | • When a user revokes authorization for a third-party service, data written by the third-party service will be deleted. • After a user deletes HUAWEI ID, all personal data of the user will be deleted. |
| Workout data: step count, distance and climbing height, speed, calories, pulmonary function data, medium- and high-intensity data, activity data, and location data |  |  |
| Health data: body fat data, sleep data, heart rate data, nutrition data |  |  |
| Restricted health data: blood glucose data, blood pressure data, blood oxygen data, body temperature data, and reproductive data |  |  |
| Device ID of the data collector (MAC address or other device IDs, which are provided by the third-party service) | The device ID is used to identify the source of the data. |  |
| HUAWEI ID and OpenID | The HUAWEI ID and OpenID are used to identify the end user when their HUAWEI ID is bound to a third-party service. |  |
| AAID | Anonymous app ID of HMS Core. | - |

#### Guidance for You to Help the End User Control Personal Data

**How to Clear User Data**

- After an end user logs in to your app integrating the Health Kit SDK and authorizes the related permissions, you can call the [DataController::clearAll](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5#EN-US_TOPIC_0000001053208304__section172200211248) method to delete the user data written by your service from Health Kit.
- The end user can go to **Settings** > **HUAWEI ID** > **Privacy center** > **Control account access** to delete all the data written by the service to the Health Kit by withdrawing authorizations. All data involved in the authorizations will be deleted from the Health Kit cloud.
- The end user can delete their personal data by deleting their HUAWEI ID. All personal data under their HUAWEI ID will be deleted.

> **Note:** The HMS Core (APK) caches the fitness and health data authorization information and retains the information for 24 hours.

**How to Export the End User's Personal Data**

- After integrating the Health Kit SDK into your service, you can obtain user data through the data access API and provide the data export service for end users. The [DataController::read](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5#EN-US_TOPIC_0000001053208304__section0447440145418) method is used. For details, see the [DataController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/datacontroller-develop-0000001050071677-V5) development guide.
- Health Kit provides the electronic data copy function. The end user can go to **Settings** > **HUAWEI ID** > **Privacy center** > **Request personal data** and select **Health Kit** to export personal data. The exported data includes all data stored by third-party services in Health Kit. The data is managed by source and type. This feature is not yet supported in the Chinese mainland.
