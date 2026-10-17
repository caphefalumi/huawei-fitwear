<!--
  Title: Configuring the Obfuscation Script
  Catalog: huaweihealth-Guides
  Document ID: ui-proguard-rules-0000002372256589
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/ui-proguard-rules-0000002372256589
-->
# Configuring the Obfuscation Script

Before building the APK, you need to configure the obfuscation script to prevent the Health IndustryConnectionUI SDK from being obfuscated. If obfuscation arises, the Health IndustryConnectionUI SDK may not function properly.

- Open the app-level obfuscation script file **proguard-rules.pro**.
- Add configurations to exclude the IndustryConnectionUI SDK from obfuscation. 
```cpp
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod
-keep class com.huawei.health.industry.industryconnectionui.activity.ScanDeviceActivity {*;}
```
