<!--
  Title: Integrating the Health Industry SDK
  Catalog: huaweihealth-Guides
  Document ID: integrate-health-industrty-sdk-0000002372256553
  Updated: 2026-08-05 02:10:08
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/integrate-health-industrty-sdk-0000002372256553
-->
# Integrating the Health Industry SDK

If you are using Android Studio, you can integrate the Health Industry SDK via the Maven repository. For details, please refer to [Configuring the Maven Repository Address](#section1453441512308).

Open source software notice: [Health Industry SDK Open Source Software Notice](https://alliance-communityfile-drcn.dbankcdn.com/FileServer/getFile/cmtyPub/011/111/111/0000000000011111111.20260805101007.09239235293442178699104840219244:20261018153559:2800:26A3BBCFE36607AB54771084F2F6ECB62FA7D50B85D7E88EF272A58FE114E8D2.docx?needInitFileName=true)

| SDK Name | SDK Package | Developer | Version Number | Main Functions | Personal Information Processing Rule | Compliance Instruction | Verification Code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Health Industry SDK | If you are using Android Studio, you can integrate the Health Industry SDK via the Maven repository. For details, please refer to [Configuring the Maven Repository Address](#section1453441512308). | Huawei Software Technologies Co., Ltd. | Latest version: 2.15.0.107 More versions: [Version Change History](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/version-change-history-0000002338287146) | For details about the main functions provided by the Health Industry SDK, please refer to [About the Service](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/introduction-0000002372172841). | For details about how the SDK processes personal information, please refer to [SDK Privacy and Security Statement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-data-security-0000002385757941). | You need to comply with basic requirements for protecting personal information when integrating and using the SDK. For details, please refer to [SDK Compliance Guide](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-compliance-user-guide-0000002352037362). | 
```cpp
SHA-256 of industry-client:
84d66bbd64c9685eb068ef7e45c5b9f9c81c226ae1042d7ee1bb4de9235eeab7
SHA-256 of industry-service:
4e23a0177bbec527c9b4b52204611c286cf70e935e8ac8a55d97fd15409e4505
SHA-256 of industry-connectionui: c074716080b1b1b90ab3f6a3e503de489d50a2fb5115d1220d54c45bf478a12a
```
 |

#### Configuring the Maven Repository Address

The recommended method for configuring the Maven repository address in Android Studio is different for Gradle earlier than 7.0 and Gradle 7.0 or later. Click a relevant link below to find the configuration procedure for a specific Gradle version.

| [Gradle earlier than 7.0](#EN-US_TOPIC_0000002647924530__li938111913556) | [Gradle 7.0 or later](#EN-US_TOPIC_0000002647924530__li2516541165514) |
| --- | --- |

> **Note:** The Maven repository address cannot be accessed from a browser. It can only be configured in the IDE. If there are multiple Maven repositories, add the Maven repository address of Huawei as the last one.

- **Gradle earlier than 7.0**Open the **build.gradle** file in the root directory of your Android Studio project.
- Go to **buildscript** > **repositories** and add the Maven repository address.
```cpp
maven { url 'https://developer.huawei.com/repo/' }
```

- Go to **allprojects** > **repositories** and add the Maven repository address.
```cpp
maven { url 'https://developer.huawei.com/repo/' }
```

- **Gradle 7.0 or later**Open the **settings.gradle** file in the root directory of your Android Studio project.
- Go to **pluginManagement** > **repositories** and add the Maven repository address.
```cpp
maven { url 'https://developer.huawei.com/repo/' }
```

- Go to **dependencyResolutionManagement** > **repositories** and add the Maven repository address.
```cpp
maven { url 'https://developer.huawei.com/repo/' }
```

#### Adding Build Dependencies

- Open the app-level **build.gradle** file.
- Add build dependencies to the **dependencies** section.
```cpp
implementation 'com.huawei.health.industry:industry-service:{version}'
implementation 'com.huawei.health.industry:industry-client:{version}'
implementation 'com.huawei.health.industry:industry-connectionui:{version}'
```
 > **Note:** Replace *{version}* with the actual SDK version number. You are advised to integrate the latest SDK. For details about the version number, please refer to [Version Change History](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/version-change-history-0000002338287146). **industry-connectionui** provides UI pages for performing scanning and connection operations, and is only used for page layout reference. You can determine whether to integrate it based on your requirements. If your app depends on **'com.huawei.health.industry:industry-connectionui:{version}'**, replace the original theme in the **AndroidManifest.xml** file with **android:theme="@style/Theme.IndustryConnectionUI"**.
- Open the modified **build.gradle** file again. You will find **Sync Now** in the upper right corner of the page. Click **Sync Now** and wait until synchronization is complete. > **Note:** If an error occurs, check whether the network connection is normal and whether the configurations in the **build.gradle** file are correct.
