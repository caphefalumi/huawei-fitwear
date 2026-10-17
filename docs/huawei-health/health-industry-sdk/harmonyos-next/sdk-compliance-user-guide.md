<!--
  Title: SDK Compliance Guide
  Catalog: huaweihealth-Guides
  Document ID: sdk-compliance-user-guide-0000002352305288
  Updated: 2026-08-05 02:10:03
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/sdk-compliance-user-guide-0000002352305288
-->
# SDK Compliance Guide

Since the *Personal Information Protection Law of the People's Republic of China* was released on November 1, 2021, supervisory authorities, industry participants, and consumers have become increasingly concerned about user privacy protection. In addition, supervisory authorities have formulated relevant standards and regulations to effectively govern illegal collection and use of personal information by apps and SDKs.

As a developer providing services for end users, you acknowledge and agree that you will comply with applicable laws, regulations, and standards, including but not limited to the *Personal Information Protection Law of the People's Republic of China*, *Cybersecurity Law of the People's Republic of China*, and *Data Security Law of the People's Republic of China*, to fulfill your obligation of personal information protection, and that you will process users' personal information in accordance with the principles of legality, legitimacy, necessity, and good faith.

This document provides guidance for better understanding and compliant use of the Health Industry SDK, applicable only to the scenario where your service region is the Chinese mainland.

#### 1. Basic Requirements

Your product and service must respect user privacy and comply with applicable data protection laws and regulations. Do not engage in any activities that may disrupt, interfere with, damage, or access any device, server, or network without prior authorization.

**(I) Privacy Statement Requirements**

You shall release a privacy statement in your own name in accordance with applicable laws, and obtain users' consent or other legal bases for the processing of their personal data. The privacy statement requirements include but are not limited to the following:

- The privacy statement must be a separate document, and cannot be a part of the user agreement.
- Before collecting and processing users' personal data for the first time, your app must remind users to read the privacy statement in a noticeable manner. The privacy statement should be easily accessible, for example, requiring no more than four taps or swipes from your app's main function screen.
- The privacy statement must use clear and straightforward language, align with common reading habits, and avoid any ambiguous or confusing terms.
- The privacy statement must clearly outline the purpose, method, and scope of collecting users' personal data for your product and service, as well as the name and contact information of the personal data processor.
- If your product and service need to share users' personal data with third parties or integrate third-party SDKs, you must disclose and clarify this in the privacy statement and obtain users' authorization or consent.

**(II) Personal Data Processing Requirements**

When processing users' personal data, your product and service must comply with requirements including but not limited to the following:

- Personal data must be processed based on the purpose of use and in accordance with the data minimization principle.
- The scope and usage purpose of the actually collected and processed personal data must be consistent with those outlined in the privacy statement.
- The frequency of personal data collection must be consistent with that specified in the privacy statement. Collecting personal data at a frequency exceeding the specified limit is strictly prohibited.
- A clear mechanism must be in place for deleting expired personal data, to ensure that the personal data retention period aligns with what is specified in the privacy statement and that expired personal data is promptly deleted or anonymized.
- Before processing the personal data of minors under the age of 14, consent must be obtained from their parents or other legal guardians.
- If personal data is to be processed for personalized recommendations or big data analysis, end users must be informed and their consent be obtained in advance.
- If sensitive personal data is to be processed, separate consent must be obtained from end users.
- If cross-border personal data transfer is required, a security assessment must be conducted in strict compliance with all applicable regulations, standards, and requirements from relevant supervisory authorities. Separate consent must also be obtained from end users.
- Users must have convenient means to exercise their rights as data subjects, including the rights to view, copy, modify, and delete their personal data.

#### 2. Personal Data Processing

Before accessing and using the Health Industry SDK and its services, your privacy statement must inform end users of the following information about the Health Industry SDK: SDK name, SDK provider name, types of personal data to be collected, usage purposes of such data, and a link to the privacy statement. Your app shall also obtain users' consent or other legal bases. If sensitive personal data needs to be processed when your app provides health data query or subscription services, it is recommended that your app display a dialog box to obtain users' separate consent. You can display the aforementioned information in either of the following forms:

- In text form

**Third-party SDK**: Health Industry SDK

**Provider**: Huawei Software Technologies Co., Ltd.

**Personal data to be collected**: device information (including **SN**), basic personal information, **fitness and health information**, and sensor data

**Purpose of use**: To **query or subscribe to wearable data**

**Privacy statement**: [SDK Privacy and Security Statement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-data-security-0000002352145496)

- In table form

| Third-Party SDK | Provider | Personal Data to Be Collected | Purpose of Use | Privacy Statement |
| --- | --- | --- | --- | --- |
| Health Industry SDK | Huawei Software Technologies Co., Ltd. | Device information (including **SN**), basic personal information, **fitness and health information**, and sensor data | Used to **query or subscribe to wearable data**. | [SDK Privacy and Security Statement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-data-security-0000002352145496) |

#### 3. Required Permissions

The Health Industry SDK requires minimum system permissions to deliver its services. You must apply for the appropriate permissions based on the SDK capabilities you intend to use, and make sure that users are notified and their consent is obtained.

The following permission requires user authorization. (The permission is defined by the operating system. The information about and open capabilities of wearables can be obtained only after the authorization is granted.)

| Permission | Description | Purpose of Use | When to Request |
| --- | --- | --- | --- |
| ohos.permission.INTERNET | Allows an app to access the Internet. | To perform HEM authentication. | When the authentication API is called. |

#### 4. Associated App Startup

When a user uses the Health Industry SDK in your apps, the Wear Cooperation Service communicates with the Health Industry SDK through a secure and reliable process channel and performs unified identity authentication to ensure the security of service calls. This process may trigger the associated startup of the Wear Cooperation Service. You must inform users in your privacy statement that the Health Industry SDK may start the Wear Cooperation Service and must obtain user consent or other legal bases.

#### 5. API Calling Timing Requirements

- If your app needs to use the SN of a user's wearable, you can call the [Device.deviceSn](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) API. Before doing so, ensure that your app notifies the user and obtains their consent, and that the API is called only within the scope of the user's consent.
- If your app needs to access the wearing status of a user, you can call the [h2queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section146851522182511) API. Before doing so, ensure that your app notifies the user and obtains their consent, and that the API is called only within the scope of the user's consent.
- If your app needs to access the fitness and health data of a user, you can call the [h2queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) or [h2queryTodaySummation](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section102431619008) API. Before doing so, ensure that your app notifies the user and obtains their consent, and that the API is called only within the scope of the user's consent.
- If your app needs to subscribe to health status and safety event notifications while in use, including high heart rate alerts, low heart rate alerts, low SpO2 alerts, SOS events, and fall events, you can call the [h2subscribeEvent](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section141971612182616) API. Before doing so, ensure that your app notifies the user and obtains their consent, and that the API is called only within the scope of the user's consent.

#### 6. Minimal Use of Functionality

The Health Industry SDK does not provide extended functions. Therefore, the configuration capabilities for extended functions and optional personal information processing are not involved.

#### 7. Rights Protection for Personal Data Subjects

The Health Industry SDK processes personal data only on the device side, and will not upload any personal data to the cloud. Huawei does not provide cloud storage for such data. You are advised to provide a privacy statement for end users to understand their means to exercise their rights as data subjects, including the rights to access, copy, modify, and delete their personal data.
