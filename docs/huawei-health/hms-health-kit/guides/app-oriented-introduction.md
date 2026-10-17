<!--
  Title: App-oriented Open Services
  Catalog: HMSCore-Guides-V5
  Document ID: app-oriented-introduction-0000001053924443-V5
  Updated: 2021-05-27 00:46:54
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/app-oriented-introduction-0000001053924443-V5
-->
# App-oriented Open Services

#### Overview

Health Kit provides an open fitness and health data platform for developers, offering data aggregation, storage, and sharing capabilities for fitness and health apps and devices. It provides open APIs for developers to read and write data, and provides a sharing mechanism for consumers to authorize and revoke authorization.

#### Working Principles

#### Open APIs

- Java API After integrating the Health Kit SDK, your phone app can read and write the user's fitness and health data upon the data-type-specific user authorization. The app can also obtain real-time data from Huawei wearable devices connected to the phone, such as the real-time step count (coming soon).

- Cloud API Open capabilities on the cloud side support both web apps and phone apps. You can use RESTful APIs to access the Health Kit data platform. The app can read and write users' fitness and health data upon the data-type-specific user authorization.

- JavaScript API (under development) The Health Kit data platform also supports integration through cross-platform development framework plugins, such as React Native.

#### Scenarios

| Partner Type | API Type | Scenario |
| --- | --- | --- |
| Ecosystem apps | Java API | You can use the health data sharing API provided by Health Kit to provide end users with a surplus of services related to running, heart rate, and sleep. For example, fitness apps can analyze users' fitness data based on user authorization, in order to provide customized fitness services and suggestions for users. |
| Cloud API |  |  |
| Industry apps | Cloud API | You can use the fitness data sharing API provided by Health Kit to provide customized service experience for enterprise users. For example, enterprises can carry out various enterprise team building activities based on fitness data to care about the health of enterprise employees. |
| Ecosystem services | JavaScript API | You can use the JavaScript data open capability provided by Health Kit to offer value-added services such as sleep, insurance, and activities for users on HTML 5 pages. |
| Cloud API |  |  |

#### Supported Countries/Regions

For details, please refer to [Supported Countries/Regions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/countries-regions-0000001058740695-V5).
