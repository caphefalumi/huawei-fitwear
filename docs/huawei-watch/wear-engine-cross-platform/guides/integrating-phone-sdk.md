<!--
  Title: Integrating the Wear Engine SDK
  Catalog: connectivity-Guides
  Document ID: integrating-phone-sdk-0000001051137958
  Updated: 2025-10-13 02:54:10
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/integrating-phone-sdk-0000001051137958
-->
**
# Integrating the Wear Engine SDK

Android Studio development environment V3.3.2 or later is recommended.

#### Configuring the Maven Repository Address

The procedure for configuring the code library in Android Studio is different for Gradle plugin earlier than 7.0, Gradle plugin 7.0, and Gradle plugin 7.1 or later. Click a relevant link below to find the configuration procedure for the specific Gradle plugin version.

| [Gradle plugin earlier than 7.0](#EN-US_TOPIC_0000001874111098__li547444421611) | [Gradle plugin 7.0](#EN-US_TOPIC_0000001874111098__li1290114539389) | [Gradle plugin 7.1 or later](#EN-US_TOPIC_0000001874111098__li1016312238418) |
| --- | --- | --- |

> **Note:** The Maven repository address cannot be accessed from a browser. It can only be configured in the IDE. If there are multiple Maven repositories, add the Maven repository address of Huawei as the last one.

- Gradle plugin earlier than 7.0Open the build.gradle** file in the root directory of your Android Studio project.
- Add the AppGallery Connect plugin and the Maven repository.Configure the Maven repository address for the HMS Core SDK in **buildscript** > **repositories**.
- Configure the Maven repository address for the HMS Core SDK in **allprojects** > **repositories**.
- If the **agconnect-services.json** file has been added to the app, go to **buildscript** > **dependencies** and add the AppGallery Connect plugin configuration.

```cpp
buildscript {
    repositories {
        google()
        jcenter()
        // Configure the Maven repository address for the HMS Core SDK.
        maven {url 'https://developer.huawei.com/repo/'}
    }
    dependencies {
        ...
        // Add the AppGallery Connect plugin configuration. Please refer to AppGallery Connect Plugin Dependency to select a proper plugin version.
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
    }
}

allprojects {
    repositories {
        google()
        jcenter()
        // Configure the Maven repository address for the HMS Core SDK.
        maven {url 'https://developer.huawei.com/repo/'}
    }
}
```

- **Gradle plugin 7.0**Open the **build.gradle** file in the root directory of your Android Studio project.
- Add the AppGallery Connect plugin and the Maven repository.Configure the Maven repository address for the HMS Core SDK in **buildscript** > **repositories**.
- If the **agconnect-services.json** file has been added to the app, go to **buildscript** > **dependencies** and add the AppGallery Connect plugin configuration and Android Gradle plugin configuration.

```cpp
buildscript {
    repositories {
        google()
        jcenter()
        // Configure the Maven repository address for the HMS Core SDK.
        maven {url 'https://developer.huawei.com/repo/'}
    }
    dependencies {
        ...
        // Add the Android Gradle plugin configuration. You need to replace {version} with the actual Gradle plugin version, for example, 7.0.1.
        classpath 'com.android.tools.build:gradle:{version}'
        // Add the AppGallery Connect plugin configuration. Please refer to AppGallery Connect Plugin Dependency to select a proper plugin version. 
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
    }
}
```

- Open the project-level **settings.gradle** file and configure the Maven repository address for the HMS Core SDK.
```cpp
dependencyResolutionManagement {
    ...
    repositories {
        google()
        jcenter() 
        // Configure the Maven repository address for the HMS Core SDK.
        maven {url 'https://developer.huawei.com/repo/'}
    }
}
```

- **Gradle plugin 7.1 or later**Open the project-level **build.gradle** file of your Android Studio project.
- If the **agconnect-services.json** file has been added to the app, go to **buildscript** > **dependencies** and add the AppGallery Connect plugin configuration and Android Gradle plugin configuration.
```cpp
buildscript {
    dependencies {
        ...
        // Add the Android Gradle plugin configuration. You need to replace {version} with the actual Gradle plugin version, for example, 7.1.1.
        classpath 'com.android.tools.build:gradle:{version}'
        // Add the AppGallery Connect plugin configuration. Please refer to AppGallery Connect Plugin Dependency to select a proper plugin version. 
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
    }
}
```

- Open the project-level **settings.gradle** file and configure the Maven repository address for the HMS Core SDK.
```cpp
pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
        // Configure the Maven repository address for the HMS Core SDK.
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
dependencyResolutionManagement {
    ...
    repositories {
        google()
        mavenCentral()
        // Configure the Maven repository address for the HMS Core SDK.
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
```

#### Adding Build Dependencies

- Open the app-level **build.gradle** file. **Figure 1 **The app-level **build.gradle** file**
- Add build dependencies to the dependencies section. 
```cpp
implementation 'com.huawei.hms:wearengine:{version}'
```
 > **Note:** Replace *{version}* with the actual SDK version number "com.huawei.hms:wearengine:5.0.2.306". You are advised to integrate the latest SDK version. For details about the version number, see [Version Change History](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/version-change-history-0000001086350238). Figure 2 **Adding build dependencies**
- Re-open the modified build.gradle file. You will find a Sync Now link in the upper right corner of the page. Click Sync Now and wait until syncing is complete. Figure 3 **Syncing by clicking **Sync Now**** > **Note:** If an error occurs, check whether the network connection is normal and configurations in the gradle file are correct.

#### Android 11 adaptation

The Wear Engine service is integrated into the Huawei Health app. Therefore, to use the Wear Engine service, your app must be able to access the Huawei Health app.
On Android 11, the way for your app to query other apps on the user device and interact with them has been changed. If targetSdkVersion of your app is 30 or later, add the <queries> tag to manifest in AndroidManifest.xml** to allow your app to access the Huawei Health app.
```cpp
<manifest ...>
    ...
    <queries>
        <package android:name="com.huawei.health" />
    </queries>
    ...
</manifest>
```

> **Note:** The **<queries>** tag requires the following: Your Android Studio version is 3.3 or later. Your [Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin) version is 3.3.3, 3.4.3, 3.5.4, 3.6.4, 4.0.1, 4.1.0, or later.
