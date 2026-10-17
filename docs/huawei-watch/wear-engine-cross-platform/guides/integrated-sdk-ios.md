<!--
  Title: Integrating the SDK
  Catalog: connectivity-Guides
  Document ID: integrated-sdk-ios-0000001921071177
  Updated: 2026-05-29 06:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/integrated-sdk-ios-0000001921071177
-->
# Integrating the SDK

- Start the IDE (for example, Xcode), copy the **WearEngineSDK.framework** and **WearEngineSDK.bundle** files in the iOS package to the project folder, and import the file to the project.
- Add the following two dependencies to **Link Binary With Libraries** under the **Build Phases** tab.
- After importing the SDK, add the import dependencies and recompile the project. If the compilation is successful, the dependencies have been successfully introduced.
- Add the following two URL schemes to the **info.plist** file of the project: huaweischeme
- huaweihealthwearengine

> **Note:** URL scheme configuration aims to enable scheme-based redirection to the Huawei Health app during authorization. Currently, the number of URL schemes configured for an app cannot exceed 50. If the URL scheme count of an app exceeds 50, you can call the [authWithClientId](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesauthclient-class-0000001897943254#section15405203834110) API for authorization.
