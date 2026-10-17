<!--
  Title: Getting Started
  Catalog: connectivity-Guides
  Document ID: dev-process-0000001051058039
  Updated: 2026-04-07 07:42:01
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/dev-process-0000001051058039
-->
# Getting Started

#### Quick Tutorial

Before developing an app, refer to the [sample code](https://developer.huawei.com/consumer/en/doc/connectivity-Examples/phone-samplecode-0000001050820291) to view the effects after integrating Wear Engine to the app.

#### Development Environment

**Android platform for phones**

- Android Studio 3.3.2 or later
- Requirements for your app: minSdkVersion 23 or later
- compileSdkVersion 34

- Requirements for test devices: Phone runs Android 6.0 or later, with the Huawei Health app installed (For non-Huawei phones, HMS Core (APK) is also required, and the Huawei Health app is allowed to run in the background in the app permission management on the phone's settings screen.)

**iOS platform for phones**

- Xcode 12 or later

- Requirements for your app: Supports iOS 13 and later versions

- Test device: a mobile phone running iOS 13 or later and has the Huawei Health app installed

**HarmonyOS platform for wearable devices**

- For details about the DevEco Studio development environment, refer to [DevEco Studio User Guide](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V2/deveco_overview-0000001053582387-V2).
- For details about the devices used for app testing, please refer to [Supported Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/service-introduction-0000000000018585#section14370945135215).

#### Development Process

You need to follow the process below to develop your app.

- Register as a developer and complete identity verification. For details, refer to [Registering a HUAWEI ID and Applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).
- Apply for the account service and create phone apps, fill in the app information (including the package name and signing certificate fingerprint) to obtain the app ID. For details, refer to [Registering a HUAWEI ID and Applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).
- Apply for the Wear Engine service to obtain the usage permission of related Huawei wearable APIs. For details, refer to [Applying for the Wear Engine Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982). You can only proceed to the following debugging process after you have obtained the permission, otherwise some features of Wear Engine cannot run as expected.

- Develop your phone app. Use Android Studio to develop your phone app and integrate the Wear Engine SDK, so you can develop the Wear Engine capabilities for your phone app. For details, refer to [Integrating the Wear Engine SDK](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/integrating-phone-sdk-0000001051137958).
- (Optional) Develop your wearable app. > **Note:** To implement message communications between apps (sending messages or files between the phone app and its counterpart on the wearable device), you need to develop the corresponding wearable app. Obtain a Huawei wearable device that has been integrated with Wear Engine. (For details, refer to [Supported Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/service-introduction-0000000000018585#section14370945135215).)
- Use HUAWEI [DevEco Studio](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V2/deveco_overview-0000001053582387-V2), and refer to the [lite wearable app development guide](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V3/lite-wearable-overview-0000001197577411-V3) or [wearable app development guide](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V3/wearable-overview-0000001052065839-V3) to develop a wearable app. **Note**: If [template-based notifications on wearable devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/wearable-device-notification-0000001057412109) of Wear Engine need to be used, ensure that the package name of a wearable app does not exceed 28 characters.
- Follow instructions in this guide to integrate the Wear Engine SDK and develop Wear Engine for your wearable app.

- Download the Huawei Health app from AppGallery to the phone. Pair the wearable device with the Huawei Health app on the phone.
- Install the developed wearable and phone apps and check whether features of Wear Engine can work properly. For details about how to install wearable apps, refer to [Running Your App/Service on a Lite Wearable](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V2/run_fitnesswatch-0000001054134240-V2) and [Running Your App/Service on a Wearable](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V2/run_smartwatch-0000001052902433-V2).
- Release your app to AppGallery. For details about how to release phone apps, refer to [Releasing an App (APK)](https://developer.huawei.com/consumer/en/doc/distribution/app/agc-help-releaseapkrpk-0000001106463276). For details about how to release wearable apps, refer to [Releasing a HarmonyOS App](https://developer.huawei.com/consumer/en/doc/app/agc-help-release-app-0000002271695230).
