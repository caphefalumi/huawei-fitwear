<!--
  Title: Getting Started
  Catalog: HMSCore-Guides-V5
  Document ID: dev-process-0000001050166278-V5
  Updated: 2021-05-27 00:46:54
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/dev-process-0000001050166278-V5
-->
# Getting Started

#### Quick Tutorial

Before developing your app, you can refer to the [sample code](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Examples-V5/sample-code-client-0000001050983703-V5) to learn how to quickly integrate Health Kit into an app.

#### Development Process

Follow the steps in the following process when you develop an app.

| No. | Step | Description |
| --- | --- | --- |
| 1 | [Register and verify your HUAWEI ID](https://developer.huawei.com/consumer/en/doc/start/registration-and-verification-0000001053628148) | Before you get started, you must register as a Huawei developer on HUAWEI Developers. It is recommended that an enterprise account be used for verification. Note: Only one account can be sent for verification for an enterprise. |
| 2 | [Apply for the HUAWEI ID service](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-id-0000001050069756-V5#EN-US_TOPIC_0000001050746503__li94404319595) | Health Kit uses the HUAWEI ID service and therefore, you need to apply for the HUAWEI ID service first. |
| 3 | [Apply for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001050071707-V5) | Enable the data read and write permissions applied for in step 2. |
| 4 | [Integrate the HMS Core SDK](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/integrating-sdk-0000001050069724-V5) | Integrate the SDK of the Health Kit basic capability service into your development environment locally or remotely. |
| 5 | [Configure obfuscation scripts](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/config-obfuscation-scripts-0000001050071675-V5) | Before building the APK, configure the obfuscation script to prevent the HMS Core SDK from being obfuscated. |
| 6 | [Develop your app](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/add-permissions-0000001050069726-V5) | Use Android Studio to develop required functions for your app based on the Health Kit basic capability service, according to the development guide. |
| 7 | [Perform pre-release check](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/pre-release-check-0000001050714942-V5) | Use the check tool to perform a self-check on the app, and perform a pre-release check against the Pre-release Checklist. |
| 8 | [Release your app](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/app-release-0000001051074910-V5) | Submit the app for release review, a process that usually takes 1 to 2 workdays. |

#### Development Environment

- Android Studio 3.X or later
- JDK 1.8 or later
- SDK and Gradle: minSdkVersion: 24
- targetSdkVersion: 29
- compileSdkVersion: 29
- Gradle 4.6 or later

- Test device: 1. A phone running a version later than Android 6.0 (API level: 23) or HarmonyOS. 2. HMS Core (APK) 5.0.4.300 or later has been installed. 3. The HUAWEI Health app of version 11.0.0.512 or later has been installed.
