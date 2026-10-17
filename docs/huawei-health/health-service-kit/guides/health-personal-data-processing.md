<!--
  Title: Personal Data Processing Information
  Catalog: harmonyos-guides
  Document ID: health-personal-data-processing
  Updated: 2026-10-14 09:28:43
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-personal-data-processing
-->
# Personal Data Processing Information

Huawei is a data processor, not a data controller. The purpose and method of data use are determined by users.

In personal data processing of Health Service Kit, Huawei serves as the end user data processor, and you (the developer) serve as the end user data controller. For appropriate and legal processing of personal data, the following are provided:

- List of personal data processed by Huawei
- Guidance for you to help the end user control personal data

#### List of Personal Data Processed by Huawei

| Personal data | Processing Purpose | Retention Period |
| --- | --- | --- |
| **Personal information**: height and weight **Fitness data**: daily activities (steps, calories, distance, moderate-to-vigorous activity, ascent, and active hours), and workout records **Health data**: sleep, heart rate, stress, SpO2, body temperature, and blood pressure data | Health Service Kit provides a platform for users to store and share their data, but does not proactively process any user data. All data displays and health and fitness services are provided for users by you. The data originates from the HUAWEI Health app and third-party services, is stored in the local database of Health Service Kit, and is synchronized to the cloud through device-cloud synchronization. | After a user deletes their HUAWEI ID, their personal data will be deleted. |
| Device IDs of data sources (MAC addresses or other device identifiers, which are provided by third-party services) | To identify the data source. | After a user deletes their HUAWEI ID, their personal data will be deleted. |
| HUAWEI ID | To identify the end user when their HUAWEI ID is bound to a third-party service. | After a user deletes their HUAWEI ID, their personal data will be deleted. |

#### Guidance for You to Help the End User Control Personal Data

**How to Clear the End User's Personal Data**

- After an end user signs in to your app and grants authorization through the relevant Health Service Kit API, you can delete the user data written by your app to Health Service Kit through the [healthStore.deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata) method.
- The end user can delete their personal data by deleting their HUAWEI ID, which will delete all associated personal data under their HUAWEI ID.

**How to Export the End User's Personal Data**

You can obtain user data by calling the data access API of Health Service Kit and provide the data export service for users through the [healthStore.readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) method. For details, please refer to [Health and Fitness Sample Data](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-samplepoint-manage).
