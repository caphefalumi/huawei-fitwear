<!--
  Title: SDK Privacy and Security Statement
  Catalog: huaweihealth-Guides
  Document ID: sdk-data-security-0000002447182209
  Updated: 2026-08-05 02:10:03
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/sdk-data-security-0000002447182209
-->
# SDK Privacy and Security Statement

The Health Industry SDK is a set of open capabilities provided by Huawei Software Technologies Co., Ltd. (hereinafter referred to as "Huawei", "we", "us", or "our") for developers to help them achieve efficient app development. The capabilities include connection, management, and data openness of wearables.

After developers integrate the Health Industry SDK into their apps by referring to the relevant development documentation, we will provide services for end users (hereinafter referred to as "you", "your", or "users") of the developers and process data, which may include your personal data. Huawei takes your personal information and privacy seriously, and is committed to taking appropriate security measures to protect your personal information in accordance with applicable laws and established industry security standards. This Statement will explain to developers and you how we collect, use, disclose, protect, store, and transmit your personal information.

Note: **We require all developers who have integrated the Health Industry SDK to strictly comply with applicable laws and regulations, *Health Industry Service Usage Agreement*, and requirements in the SDK Compliance Guide when processing your personal data. Before developers integrate and use our open capabilities, we require developers to notify you of basic information about personal data processed by the integrated SDK in their apps' privacy policies and obtain your consent or other legal basis. However, we are unable to control how developers and their apps process your personal data that they control, and will not be liable for their behavior. We recommend that you carefully read relevant user agreements and privacy policies of developers' apps and use the apps after you fully understand how the developers will process your personal data and accept it.**

#### 1. Personal Data Collection and Usage

Huawei will only collect and use your personal information in accordance with the purposes and methods stated in this Statement. If we want to use your personal information for purposes not stated in this Statement, we will explicitly inform you about this ourselves or through developers, and obtain your consent again or other legal bases. If the SDK has extended functions or collects and uses optional personal data items, we will illustrate this specifically below.

**Device Management**

To authenticate devices and query device information, the SDK provides APIs for developers. The processed device information includes device **SN**, system settings (language), and device status (wearing status, battery level, and charging status). The aforementioned information is processed only on the device.

**Device Initialization**

To initialize the device and calibrate the algorithm, the SDK provides an API for developers to set basic user information. The processed basic personal information includes the height, weight, gender, date of birth, and age. The aforementioned information is processed only on the device.

**Data Openness**

To implement data openness, the SDK provides APIs for developers to query or subscribe to data. The personal data processed includes **workout information, such as step count, distance, stairs climbed, moderate-to-high workout intensity, standup times, workout type, workout duration, maximum oxygen uptake, active calories, resting calories, workout heart rate zone, maximum workout heart rate, training status (time required for full recovery and workout load), speed, workout pace, pace zone, pace zone statistics, altitude (total ascent and descent height), and other workout data (workout status, activity time, and single workout data);** **health information, such as heart rate (heart rate data, maximum heart rate, minimum heart rate, and resting heart rate), heart health (pulse wave arrhythmia analysis result), SpO2 (SpO2 level and minimum SpO2), stress data (stress value and level), temperature (skin temperature data and core body temperature data), and sleep data (sleep quality score, sleep duration, nighttime sleep details, nap details, sleep details, Sleep breathing awareness data, and sleep apnea risk level)**; and sensor data (PPG sensor). The aforementioned information is processed only on the device.

#### 2. Required Permissions

When you use relevant functions and services, we will request the necessary device permissions through developers' apps. To manage the permissions for an app, you can go to the device settings or privacy settings menu on your device and choose which permissions you want to allow or deny.

When integrating and using our open capabilities, developers independently determine the required permissions and the scope of information access with each permission. As such, developers are responsible for informing you of the requested permissions and their intended purposes. If you enable any permission that the developers' apps request, it means that you authorize us to process your personal data in order to enjoy our services. Once you disable any permission, it means that you revoke the authorization and we will not process your personal data anymore based on the permission. In this case, we may not be able to continue offering you the service corresponding to the permission. Please note that your decision to disable any permission will not affect the validity of the personal data processing activities previously carried out based on your prior authorization.

The Health Industry SDK requires minimum system permissions to deliver its services. Developers must apply for the appropriate permissions based on the SDK capabilities they intend to use, and make sure that users are notified and their consent is obtained.

The following permission requires user authorization. (The permission is defined by the operating system. The information about and open capabilities of wearables can be obtained only after the authorization is granted.)

| Permission | Description | Purpose of Use | When to Request |
| --- | --- | --- | --- |
| android.permission.INTERNET | Allows the app to access the Internet. | To perform HEM authentication. | When the authentication API is called. |

#### 3. Protection of Minors

We attach great importance to the protection of minors' personal data. We will provide services and protection for minors in strict accordance with local laws and regulations. If you are a minor, you must obtain consent from your parents or legal guardians to use developers' apps and to agree to the relevant Terms of Service. Parents or legal guardians shall also take appropriate precautions to protect minors, including monitoring their use of the developers' apps.

In particular, if you are a child (a minor under the age of 14), please make sure to notify your parents or legal guardians about carefully reading with you the privacy statements of the developers' apps, this Statement, and the [Huawei Consumer Business Statement About Children's Privacy Protection](https://legal.cloud.huawei.com/legal/child/privacy-statement.htm?code=us&language=en-us) specifically formulated by us before you use the apps and our services, and use developers' apps and our services or provide information to us only with the consent or under the guidance of your parents or legal guardians. If you are a parent or legal guardian, please make sure that the child under your guardianship uses developers' apps and our services and provides us with information with your consent or under your guidance.

#### 4. Sharing with Third Parties

N/A

#### 5. Integrated Third-Party Services

N/A

#### 6. Associated App Startup

When you use the Health Industry SDK in developers' apps, the Industry Wear Service communicates with the Health Industry SDK through a secure and reliable process channel and performs unified identity authentication to ensure the security of service calls. This process may trigger the associated startup of the Industry Wear Service. Developers must inform users in the privacy policy that the Health Industry SDK may start the Industry Wear Service and must obtain user consent or other legal bases.

#### 7. Personal Data Management

We highly respect your concerns for personal data and are committed to complying with applicable laws and regulations to facilitate, support, and safeguard your rights to access, copy, modify, and delete your personal data, and your rights to exercise other privileges as a personal data subject.

As you use the Health Industry SDK and its services through developers' apps, you shall request your personal data subject rights through paths provided by developers' apps when you want to access, copy, or modify your personal data related to the Health Industry SDK and its services.

To protect your rights to access, copy, modify, and delete your personal data, we explicitly require developers, in the signed ***Health Industry Service Usage Agreement*** and the *SDK Compliance Guide*, to comply with applicable laws, regulations, and standards. This includes providing convenient means for you to request and exercise your personal data subject rights in accordance with applicable legal requirements. You can contact us using the contact information provided in the [9. Contacting Us](#section18349163411472) section of this Statement and we will try our best to coordinate, support, and ensure the implementation of your subject rights.

If you directly request personal data subject rights from us, we may verify your identity and ask you to provide the personal data needed to do so, in order to safeguard your data security and other legitimate interests. Additionally, we may share the collected information with developers to verify your identity. After confirming your identity, we will promptly respond to your requests in accordance with applicable laws and regulations.

If you have any further requests, questions, comments, or suggestions regarding your rights as a data subject, please contact us using the contact information provided under the [Contacting Us](#section18349163411472) section of this Statement.

#### 8. Information Storage Location and Retention Period

The Health Industry SDK processes personal data only on the device side, and will not upload any personal data to the cloud. Huawei does not provide cloud storage for such data. We recommend that you review the privacy policies provided by developers to understand how your personal information is stored.

#### 9. Contacting Us

We have appointed the person responsible for personal information protection who you can contact from [here](https://consumer.huawei.com/en/legal/privacy-questions/). You may contact us by visiting the [Privacy Questions](https://consumer.huawei.com/en/legal/privacy-questions) page. We will reply as soon as possible. You can also contact app developers to exercise your relevant rights. We will cooperate with developers to respond to the requests after receiving requests from the developers and verifying the request authenticity and legitimacy.

Registration address: Huawei Software Technologies Co., Ltd., No. 101, Software Avenue, Yuhuatai District, Nanjing, Jiangsu Province, China. Postal code: 210012.

If you are not satisfied with the response you receive, especially if you feel that our processing or handling of your personal information has violated or infringed on your legal rights and/or interests, you may seek external resolution, whether by filing a lawsuit with the people's court in the relevant jurisdiction, submitting a complaint to the industry self-regulation association or relevant government regulatory agencies, or by other means. You may also consult us regarding the available channels for voicing your complaint.

Huawei's collection and use of your personal data is governed by our privacy policy. For more information, please refer to the [Huawei Consumer Business Privacy Statement](https://consumer.huawei.com/en/legal/privacy-policy/worldwide/).
