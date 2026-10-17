<!--
  Title: Configuring Obfuscation Scripts
  Catalog: HMSCore-Guides-V5
  Document ID: config-obfuscation-scripts-0000001050071675-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/config-obfuscation-scripts-0000001050071675-V5
-->
**
# Configuring Obfuscation Scripts

Before building the APK, configure the obfuscation configuration file to prevent the HMS Core SDK from being obfuscated.

- Open the obfuscation configuration file proguard-rules.pro** in the **app** directory of your project and add configurations to exclude the HMS Core SDK from obfuscation.
```cpp
-ignorewarnings
-keepattributes *Annotation*
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes Signature
-keepattributes SourceFile,LineNumberTable
-keep class com.huawei.hianalytics.**{*;}
-keep class com.huawei.updatesdk.**{*;}
-keep class com.huawei.hms.**{*;}
```

- If you are using AndResGuard, add its trustlist to the **build.gradle** file in the **app** directory of your project.
```cpp
"R.string.hms*",
"R.string.connect_server_fail_prompt_toast",
"R.string.getting_message_fail_prompt_toast",
"R.string.no_available_network_prompt_toast",
"R.string.third_app_*",
"R.string.upsdk_*",
"R.layout.hms*",
"R.layout.upsdk_*",
"R.drawable.upsdk*",
"R.color.upsdk*",
"R.dimen.upsdk*",
"R.style.upsdk*", 
"R.string.agc*"
```
