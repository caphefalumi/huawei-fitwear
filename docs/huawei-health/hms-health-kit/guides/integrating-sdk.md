<!--
  Title: Integrating the HMS Core SDK
  Catalog: HMSCore-Guides-V5
  Document ID: integrating-sdk-0000001050069724-V5
  Updated: 2021-06-07 01:00:34
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/integrating-sdk-0000001050069724-V5
-->
# Integrating the HMS Core SDK

#### Configuring the Maven Repository Address for the HMS Core SDK

- Open the **build.gradle** file in the root directory of your Android Studio project.
- Go to **allprojects** > **repositories** and add the Maven repository address for the HMS Core SDK.
```cpp
maven {url 'https://developer.huawei.com/repo/'}
```

- Go to **buildscript** > **repositories** and add the Maven repository address for the HMS Core SDK.
```cpp
maven {url 'https://developer.huawei.com/repo/'}
```
 > **Note:** The Maven repository address cannot be accessed from a browser. It can only be configured in the IDE. If there are multiple Maven repositories, add the Maven repository address of Huawei to the end of the file.

#### Adding Build Dependencies

- Open the **build.gradle** file in the **app** directory.

- Add build dependencies in the **dependencies** section.
```cpp
implementation 'com.huawei.hms:health:{version}'
```
 > **Note:** Replace *{version}* with the actual SDK version number: com.huawei.hms:health:5.3.0.301. You are advised to integrate the latest SDK version. For details about the version number, see [Version Change History](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/version-change-history-0000001057072287-V5).
- Open the modified **build.gradle** file again. You will find a **Sync Now** link in the upper right corner of the page. Click **Sync Now** in the upper right corner and wait until synchronization is complete. > **Note:** If an error occurs, check the network connection and configurations in the **build.gradle** file.

#### Adding the App ID Information

- Open the **AndroidManifest.xml** file.
- Add the app ID generated when the creating the app on HUAWEI Developers to the application section. For **value="APP ID"**, make sure that the value is set to the app ID that has been generated when [applying for the HUAWEI ID service](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-id-0000001050069756-V5). 
```cpp
<meta-data
android:name="com.huawei.hms.client.appid"
android:value="APP ID"/>
```

- After you have finished the configuration, click **Sync Now** in the upper right corner.

#### Defining Multi-language Settings

- By default, your app supports all languages provided by the HMS Core SDK. If your app uses all these languages, skip the operation procedure in this section.
- If your app uses only some of these languages, follow the operation procedure in this section to complete the required configuration.

- Open the **build.gradle** file in the **app** directory of your project.
- Go to **android** > **defaultConfig** and add the **resConfigs** configuration. Note that **en** (English) and **zh-rCN** (Simplified Chinese) are mandatory.
```cpp
resConfigs "en", "zh-rCN", "Other languages supported by your app"
```
 For details about the languages supported by the HMS Core SDK, see [Languages Supported by HMS Core SDK](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/support-language-0000001050040564-V5).
