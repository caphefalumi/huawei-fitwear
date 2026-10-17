<!--
  Title: Configuring the Obfuscation File
  Catalog: huaweihealth-Guides
  Document ID: configure-obfuscation-file-0000002338298244
  Updated: 2026-08-05 02:10:08
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/configure-obfuscation-file-0000002338298244
-->
# Configuring the Obfuscation File

Before building the APK, configure obfuscation scripts to prevent the Health Industry SDK from being obfuscated. If obfuscation arises, the Health Industry SDK may not function properly.

- Open the app-level obfuscation script file **proguard-rules.pro**.
- Add configurations to exclude the Health Industry SDK from obfuscation. 
```cpp
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod
-keep class com.huawei.health.industry.service.**{*;}
-keep class com.huawei.health.industry.client.**{*;}
-keep class net.sqlcipher.**{*;}
-keep class com.google.gson.**{*;}
-keep class com.google.json.**{*;}
-keep class org.apache.commons.io.**{*;}
-keep class org.bouncycastle.**{*;}
-keep class com.huawei.hms.framework.network.grs.**{*;}
```
