<!--
  Title: Integrating the Health Industry SDK
  Catalog: huaweihealth-Guides
  Document ID: integrate-health-industry-sdk-0000002413790526
  Updated: 2026-08-05 02:10:07
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/integrate-health-industry-sdk-0000002413790526
-->
# Integrating the Health Industry SDK

If you are using HUAWEI DevEco Studio, you can integrate the Health Industry SDK via the Maven repository. Before development, you need to integrate the Health Industry SDK into your HUAWEI DevEco Studio.

| SDK Name | SDK Package | Developer | Version Number | Main Functions | Personal Information Processing Rule | Compliance Instruction | Verification Code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Health Industry SDK | If you are using DevEco Studio, you can integrate the Health Industry SDK via the Maven repository. For details, please refer to the section describing how to configure the Maven repository address below. | Huawei Software Technologies Co., Ltd. | Latest version: 4.3.0.106 More versions: [Version Change History](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/version-change-history-0000002447182205) | For details about the main functions provided by the Health Industry SDK, please refer to [About the Service](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/introduction-0000002372172841). | For details about how the SDK processes personal information, please refer to [SDK Privacy and Security Statement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-data-security-0000002447182209). | You need to comply with basic requirements for protecting personal information when integrating and using the SDK. For details, please refer to [SDK Compliance Guide](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-compliance-user-guide-0000002413623118). | 
```cpp
SHA-256 of industry-client-wearable: 5261919aa5733eaecedd4147697378722a782e9e48476b37156e3ab8fb408ee8
```
 |

#### Configuring the Maven Repository Address

- Open the **build.gradle** file in the root directory of your DevEco Studio project.
- Go to **buildscript** > **repositories**, and add the Maven repository configurations.
```cpp
maven {
    url 'https://developer.huawei.com/repo/'
}
```

- Go to **allprojects** > **repositories** and add the Maven repository address.
```cpp
maven {
    url 'https://developer.huawei.com/repo/'
}
```

#### Adding Build Dependencies

- Open the app-level **build.gradle** file.
- Add build dependencies to the **dependencies** section.
```cpp
implementation 'com.huawei.health.industry:industry-client-wearable:{version}'
```
 > **Note:** Replace *{version}* with the actual SDK version number **com.huawei.health.industry:industry-client-wearable:4.3.0.106**. You are advised to integrate the latest SDK version. For details about the version number, please refer to [Version Change History](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/version-change-history-0000002447182205).

#### Synchronizing the Project

After completing the preceding configuration, go to **File** > **Sync Project with Gradle Files** to synchronize the **build.gradle** file to the local PC.

> **Note:** If an error occurs, check the network connection and the configuration in the **build.gradle** file.
