<!--
  Title: How Do I Obtain the App Fingerprint?
  Catalog: harmonyos-guides
  Document ID: wearengine_faq-9
  Updated: 2026-10-14 09:34:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_faq-9
-->
# How Do I Obtain the App Fingerprint?

#### Apps on iOS Phones

Apps on iOS phones do not have fingerprint information. You need to enter a non-empty character string as the fingerprint. For details, please refer to [Sending P2P Messages from Your Phone App](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-ios-0000001875158886#section795719274334).

#### Apps on Android Phones

During app development on Android phones, the app fingerprint is an SHA-256 fingerprint. The procedure is as follows:

- Generate a signing certificate. For details, please refer to [Configuring the Signing Certificate](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/addingappid-packagename-0000001050818013#section1041814153312).
- Use the Keytool in the JDK to export the SHA-256 information from the signing certificate. **Windows** a. Open the cmd command line tool and run the **cd** command to go to the directory where **keytool.exe** is located. b. Run the **keytool -list -v -keystore <keystore-file>** command, where **<keystore-file>** indicates the absolute path to the app's signing certificate. Example: 
```cpp
cd C:\Program Files\Java\jdk\bin
keytool -list -v -keystore C:\TestApp.jks
```
 **macOS** Open the Terminal, run the **keytool -list -v -keystore <keystore-file>** command, where **<keystore-file>** indicates the absolute path to the app's signing certificate, and follow the instructions. Example: 
```cpp
keytool -list -v -keystore /Users/admin/Downloads/Demo.jks
```

- Obtain the SHA-256 fingerprint. The following figure shows an example on Windows.

#### Apps on Phones Running Versions Earlier Than HarmonyOS 5.0

For app development on phones running versions earlier than HarmonyOS 5.0 (such as HarmonyOS 2.x/3.x/4.x), the app fingerprint is an SHA-256 fingerprint. For details, please refer to [Apps on Android Phones](#apps-on-android-phones).

#### Apps on Devices Running HarmonyOS 5.0 or Later

- For apps on phones, tablets, and wearables, the app fingerprint is the app ID provided by AppGallery Connect. Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html), choose **Development and services**, find your desired app, and click it to access the **Project settings** page. On the **General information** tab page, find the app ID under **App information**.
- For apps on lite wearables, the app fingerprint is the app bundle name followed by **_base64Encode(Public key)**. The procedure is as follows: Open the [digital certificate (.cer) file](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-signing) in a text editor. Then copy the last **BEGIN CERTIFICATE** block, including **BEGIN CERTIFICATE**, **END CERTIFICATE**, and all content between them, to a new text file to create a new .cer file.
- Obtain the public key (**pubKey**). **Windows**: Open the .cer file, and click **Details** and **Public key** to obtain the public key. **macOS**: Run the **penssl x509 -in test.cer -text -noout** command, where **test.cer** is the name of the new .cer file.
- Base64-encode the **pubKey**. Remove all spaces and colons from the public key obtained in the previous step. For example, after removal, the value becomes **04d929a057d784d95dcf7a15dcdea9d88aeb0a7b86fdafdf5b83bc5435917f2a3dcaa6f97b355462bc5301e00c4ed8aa4165e2111ec77f4b03abca02b06a212b**. Then Base64-encode this value to obtain **BNkXKaBX14TZXc96FdzeqdiK6wp7hv2v31uDvFQ1kX8qPcqm+Xs1VGK8UwHgDE7YqkFl4hEex39LA6vKArBqISs=**. You can use a third-party website (for example, [tomeko.net](https://www.tomeko.net/online_tools/hex_to_base64.php?lang=en)) to perform transcoding.
- The fingerprint is the app bundle name followed by **_base64Encode(pubKey)**, for example: **com.huawei.wearengine_BC5Z9/29Yn93xSa9XkQ2HN5GikugmXjor9se0VwnOENK9t4uFK4VlRpOHv4B3lphjIa7P6Sh61CFRsT0MZNhuV8=**.
