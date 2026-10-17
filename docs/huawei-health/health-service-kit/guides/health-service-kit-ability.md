<!--
  Title: About This Kit
  Catalog: harmonyos-guides
  Document ID: health-service-kit-ability
  Updated: 2026-10-14 09:28:25
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-service-kit-ability
-->
# About This Kit

Health Service Kit provides a platform for ecosystem apps to access users' health and fitness data based on users' HUAWEI ID and authorization. With the user's consent and authorization, you can access their health and fitness data with the open capabilities provided by Health Service Kit, and use such data to build various kinds of apps and services to deliver professional health and fitness experiences.

#### About the Service

#### App Services

By integrating third-party devices, Huawei devices, and high-quality app services with the health and fitness data provided by Health Service Kit, an ecosystem of smart fitness devices + Huawei devices + app services is formed, delivering a safe, intelligent, and convenient health and fitness experience.

App services include the following:

- Huawei apps: The HUAWEI Health app provides professional features such as workout recording, weight loss and body shaping courses, TruSleep, and health management.
- The AI Life app is a unified management platform for Huawei smart IoT devices. It can discover, connect, and manage Huawei smart 8 + N devices, enabling seamless interconnection between devices and creating personalized smart scenarios that bring a more convenient and enjoyable experience.

- Ecosystem apps: Apps in fields such as health and fitness, medical research, and insurance can more easily build professional, scenario-based user experiences by leveraging Huawei smart wearables together with the Health Service Kit data platform.

#### Health Service Kit

As shown in the preceding figure, Health Service Kit provides a series of open capabilities for ecosystem apps/services and hardware devices. It provides a wide range of health and fitness APIs and supports access to various types of health and fitness data, such as step count and heart rate.

- Open data: As a health and fitness data platform, this kit unlocks extensive health data and professional workout and fitness data.
- Open services: This kit supports workout linkage and real-time data synchronization between wearables and ecosystem devices. This feature will be supported in the future. Please stay tuned.
- Open models: In addition to the basic health and fitness data, this kit provides models that analyze indicators such as maximum oxygen uptake (VO2Max) and training load. This feature will be supported in the future. Please stay tuned.
- Data platform: This kit provides a data platform for you to store health and fitness data.
- Privacy compliance for data security: This kit complies with applicable laws and regulations to manage privacy. Personal data is managed across its full lifecycle with reference to the GAPP and other industry best practices.

#### Constraints

## Supported Devices

This kit is applicable only to phones, tablets, wearables, and lite wearables.

## Supported Countries/Regions

This kit for phones and tablets is supported only in the Chinese mainland.

#### Emulator Support

Starting from version 6.0.2(22), this kit supports development using the Emulator. However, its capabilities differ from those on real devices. Specifically:

- General differences: For details, please refer to [Differences Between the Emulator and Real Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-emulator-specification).
- The Emulator does not support wearable app development.
- The Emulator does not support the workout linkage service, real-time Activity rings, manual data synchronization, and capabilities related to the HUAWEI Health app.
- Privacy authorization is enabled by default or the Emulator.
