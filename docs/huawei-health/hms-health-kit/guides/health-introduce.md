<!--
  Title: About HUAWEI Health Kit
  Catalog: HMSCore-Guides-V5
  Document ID: health-introduce-0000001053684429-V5
  Updated: 2021-05-27 00:46:54
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/health-introduce-0000001053684429-V5
-->
# About HUAWEI Health Kit

HUAWEI Health Kit (Health Kit for short) allows ecosystem apps to access fitness and health data of users based on their HUAWEI ID and authorization. For consumers, Health Kit provides a mechanism for fitness and health data storage and sharing based on flexible authorization. For developers and partners, Health Kit provides a data platform and fitness and health open capabilities, so that they can build related apps and services based on a multitude of data types. Health Kit connects the hardware devices and ecosystem apps to provide consumers with health care, workout guidance, and ultimate service experience.

Health Kit is open to enterprise developers and individual developers.

As shown in the preceding figure, Health Kit provides a series of open capabilities, for ecosystem apps/services and hardware devices.

- Java API: Allows mobile app developers to read and write fitness and health data.
- Cloud API: Supports access of mobile and web app developers to read and write fitness and health data.
- JavaScript API: Supports the access of developers from partners to provide value-added services for the HUAWEI Health app.
- Device access: Third-party fitness and health devices provide APIs for hardware devices to measure and upload data through the standard Bluetooth protocol provided by HUAWEI Health.

> **Note:** HUAWEI HiHealth and Health Kit are now known as Health Kit. New applications for HiHealth data API permissions are no longer accepted. Developers who have accessed HiHealth can continue to use the service. For detailed instructions, please refer to [HiHealth Development Guide](https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/overview-0000001050060843). React Native JavaScript (HTML5) open APIs are being built. Please stay tuned for more information. To allow Health Kit to read data from the HUAWEI Health app, ensure that the version of the app installed on the user's device is 11.0.0.512 or later. For details, please refer to [Data Openness of Huawei Wear and HUAWEI Health – Restrictions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/read-sport-health-datatype-0000001059873166-V5#EN-US_TOPIC_0000001059873166__section99545522502).

#### Main Functions

- Data storage Provides a data platform for developers to store fitness and health data.

- Data openness Provides a wide range of fitness and health APIs and supports sharing of the various fitness and health data, including step count, weight, and heart rate.
- Data access authorization management Provides settings for users and developers so users can manage developers' access to their health and fitness data, guaranteeing users' data privacy and legal rights.
- Device access Provides hardware devices (including fitness and health devices) with APIs for measuring and uploading data through the standard Bluetooth protocol.
