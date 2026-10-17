<!--
  Title: Configuring Obfuscation Scripts
  Catalog: HMSCore-Guides-V5
  Document ID: config-obfuscation-scripts-0000001071222399-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/config-obfuscation-scripts-0000001071222399-V5
-->
# Configuring Obfuscation Scripts

Before building the APK, configure obfuscation scripts to prevent the SDK of extended Health Kit capabilities from being obfuscated. If obfuscation arises, the SDK may not function properly.

- Open the app-level obfuscation script file **proguard-rules.pro**.
- Add configurations to exclude the SDK from obfuscation.
```cpp
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keep class com.huawei.hihealth.**{*;}
-keep class com.huawei.hihealthkit.**{*;}
```
