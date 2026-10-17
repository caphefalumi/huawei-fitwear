<!--
  Title: Configuring the Signature File
  Catalog: huaweihealth-Guides
  Document ID: configure-signature-file-0000002372216437
  Updated: 2026-08-05 02:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/configure-signature-file-0000002372216437
-->
# Configuring the Signature File
Add signature information to the Android closure of the app-level **build.gradle** file. (The signing certificate file saved in **C:/industryDemo.jks** is used as an example.)
```cpp
signingConfigs {
    release {
        storeFile file('C:\\industryDemo.jks')
        keyAlias 'industryDemo'
        storePassword '******'
        keyPassword '******'
        v1SigningEnabled true
        v2SigningEnabled true
    }
}

buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled false
           proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
       }
       debug {
           signingConfig signingConfigs.release
           debuggable true
       }
}
```
