<!--
  Title: Integrating the Wear Engine SDK
  Catalog: connectivity-Guides
  Document ID: integrating-smartwatch-sdk-0000001051620422
  Updated: 2025-10-13 02:54:14
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/integrating-smartwatch-sdk-0000001051620422
-->
**
# Integrating the Wear Engine SDK

For details about the DevEco Studio development environment, refer to [DevEco Studio User Guide](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V2/deveco_overview-0000001053582387-V2).

#### Configuring the Maven Repository Address

- Open the build.gradle file in the root directory of your DevEco Studio project. Figure 1 **The **build.gradle** file in the root directory
- Go to **buildscript** > **repositories**, and add the Maven repository configurations. 
```cpp
maven {url 'https://developer.huawei.com/repo/'}
```
 **Figure 2 **Configuring the Maven repository
- Go to **allprojects** > **repositories** and add the Maven repository address. 
```cpp
maven {url 'https://developer.huawei.com/repo/'}
```
 **Figure 3 **Configuring the Maven repository** > **Note:** The Maven repository address cannot be accessed from a browser. It can only be configured in the IDE. If there are multiple Maven repositories, add the Maven repository address of Huawei as the last one.

#### Adding Build Dependencies

- Open the app-level build.gradle file. Figure 4 **App-level build.gradle file
- Add build dependencies to the **dependencies** section. 
```cpp
implementation 'com.huawei.hms:wearengine-wearable-harmonyos:{version}'
```
 > **Note:** Replace *{version}* with the actual SDK version number com.huawei.hms:wearengine-wearable-harmonyos:5.0.2.306. You are advised to integrate the latest SDK version. For details about the version number, see [Version Change History](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/version-change-history-0000001119036892). **Figure 5 **Adding Build Dependencies
- Re-open the modified **build.gradle** file. You will find a **Sync Now** link in the upper right corner of the page. Click **Sync Now** and wait until syncing is complete. > **Note:** If an error occurs, check whether the network connection is normal and configurations in the **gradle** file are correct.
