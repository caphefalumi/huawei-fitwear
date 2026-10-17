<!--
  Title: Generating a Signing Certificate and Its Fingerprint
  Catalog: huaweihealth-Guides
  Document ID: generate-signature-cert-and-fingerprint-0000002372130841
  Updated: 2026-08-05 02:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/generate-signature-cert-and-fingerprint-0000002372130841
-->
# Generating a Signing Certificate and Its Fingerprint

You need to use Android Studio to create a signing certificate file to sign your app, and generate a signing certificate fingerprint to apply for the HUAWEI ID service on HUAWEI Developers.

If you have not obtained the signing certificate, [generate a signing certificate file](#section9130185816368) and then [its fingerprint](#section11131558123616). If you have already obtained the signing certificate, [generate a signing certificate fingerprint](#section11131558123616) only.

#### Generating a Signing Certificate File

All the procedures and screenshots in this section are for Android Studio 2025.1.2.2.

- Go to **Build** > **Generate Signed App Bundle or APK...** on the menu bar of the new Android Studio project.
- On the **Generate Signed App Bundle or APK** page, select **APK** and click **Next**.
- On the page for entering signature file information, click **Create new...** to create a signature file.
- On the **New Key Store** page, enter the information such as the save path, name, password, and alias of the signature file, and click **OK**. (The following is just an example. Please enter the information based on the actual situation.)
- After the signature file is created, return to the **Generate Signed App Bundle or APK** page, and click **Cancel**. Open the **Key store path** selected in [4](#EN-US_TOPIC_0000002648084346__li153189141022), and you will see the generated signing certificate file.

#### Generating a Signing Certificate Fingerprint

- On Windows, run the **cmd** command to open the CLI. On macOS, open the Terminal. Run the **cd** command to go to the directory where **keytool.exe** is located (the following example assumes that JDK is installed in the **Program Files** directory on drive C). 
```cpp
cd C:\Program Files\Java\jdk\bin
```

- Run the **keytool -list -keystore** *<keystore-file>* command. Replace *<keystore-file>* with the complete path of the signing certificate, for example, **D:\Code\Demo\industryDemo.jks** in the following. 
```cpp
keytool -list -keystore D:\Code\Demo\industryDemo.jks
```

- Enter the password of the signature file as prompted to obtain the SHA-256 certificate fingerprint.
