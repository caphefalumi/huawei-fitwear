<!--
  Title: Configuring Obfuscation Scripts
  Catalog: connectivity-Guides
  Document ID: proguard-rules-0000001058693464
  Updated: 2025-10-13 02:54:13
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/proguard-rules-0000001058693464
-->
# Configuring Obfuscation Scripts

Before building the APK, configure obfuscation scripts to prevent the Wear Engine SDK from being obfuscated. If obfuscation arises, the Wear Engine SDK may not function properly.

- Open the app-level obfuscation script file **proguard-rules.pro**.
- Add configurations to exclude the Wear Engine SDK from obfuscation. 
```cpp
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keep class com.huawei.wearengine.**{*;}
```
