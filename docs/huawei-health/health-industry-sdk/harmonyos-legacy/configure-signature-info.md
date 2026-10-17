<!--
  Title: Configuring App Signing Information
  Catalog: huaweihealth-Guides
  Document ID: configure-signature-info-0000002447309641
  Updated: 2026-08-05 02:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/configure-signature-info-0000002447309641
-->
# Configuring App Signing Information

You need to create a new keystore file (.p12) and certificate request file (.csr) in DevEco Studio, and use them to apply for a digital certificate (.cer) and HarmonyAppProvision file (.p7b), to ensure that your app can be properly installed after integrating the Health Industry SDK. You also need to use the keystore file (.p12) to generate an SHA-256 fingerprint, which is used to apply for a certificate (.cer) required for using the Health Industry SDK's APIs.

#### Creating a Keystore File and a Certificate Request File

- On the menu bar, choose **Build** > **Generate Key and CSR**. > **Note:** If a key already exists locally, click **Skip** in **Generate Key** and use this key to generate a certificate request file.
- In **Key Store File**, click **Choose Existing** to select an existing keystore file (a .p12 file that stores keys). If no keystore file exists, click **New** to create one. The following describes how to create a keystore file.
- In the **Create Key Store** dialog box, set the following parameters and click **OK**: **Key store file**: Set the keystore file path. The value includes the file path and file name, which must have the .p12 extension.
- **Password**: Enter a keystore password, which must contain at least eight characters consisting of two or more types of the following: uppercase letters, lowercase letters, digits, and special characters. Remember the password as it will be used later for configuring the signing.
- **Confirm password**: Enter the keystore password again.

- In the **Generate Key and CSR** dialog box, set the following parameters and click **Next**: **Alias**: Enter the alias of the key, which is used to identify the key name. Remember the alias as it will be used later for configuring the signing.
- **Password**: Password of the key, which is automatically filled in and is the same as the keystore password.
- **Validity**: Specify the certificate validity period. A validity period of 25 years or longer is recommended to cover the entire lifecycle of your apps or services.
- **Certificate**: Enter basic certificate information, including the **Organization**, **City or locality**, and **Country code**.

- In the **Generate Key and CSR** dialog box, set the CSR file storage path and CSR file name.
- Click **Finish**. You can then obtain the generated .p12 keystore file and CSR file from their respective storage locations.

#### Applying for a Release Certificate and Profile

Use the generated CSR file to apply for a release certificate and profile in [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html). The steps are as follows:

- On the [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html#/) project page, [create a HarmonyOS app/service](https://developer.huawei.com/consumer/en/doc/app/agc-help-createharmonyapp-0000001945392297).

> **Note:** In the app/service distribution phase, HarmonyOS apps are distributed to an app store, and atomic services are distributed to the service center. When applying for a signing certificate for your atomic service, select **Yes** for **Atomic service** during app creation.

- Apply for and download a release certificate and profile in AppGallery Connect. For details, please refer to [Requesting a Release Certificate](https://developer.huawei.com/consumer/en/doc/app/agc-help-add-releasecert-0000001946273961) and [Requesting a Release Profile](https://developer.huawei.com/consumer/en/doc/app/agc-help-add-releaseprofile-0000001914714796).

With the obtained release certificate and profile, sign your app in DevEco Studio. For details, please refer to [Configuring the Signing Information](#section1839475132817).

#### Configuring the Signing Information

Use the generated private key file (.p12) and the certificate file (.cer) and profile (.p7b) requested in AppGallery Connect to configure signing information in DevEco Studio and then build an app that carries release signing information.

Go to **File** > **Project Structure** > **Project** > **Signing Configs** > **Signing Configs**, deselect **Automatically generate signature**, and configure the project signing information.

- **Store file**: Select the .p12 keystore file.
- **Store password**: Enter the keystore password.
- **Key alias**: Enter the alias of the key.
- **Key password**: Enter the password of the key.
- **Sign alg**: Signing algorithm, which has a fixed value of **SHA256withECDSA**.
- **Profile file**: Select the obtained release profile in .p7b format.
- **Certpath file**: Select the obtained release digital certificate file in .cer format.

After setting the signing information, click **OK** to save the settings. Then build your app in DevEco Studio as instructed in the following section.

#### Building Your App

Before packaging, make sure your project directory does not contain any unwanted HAPs. Once packaging starts, DevEco Studio will pack all HAPs in your project directory into your app.

- Go to **Build** > **Build Hap(s)/APP(s)** > **Build APP(s)** and wait for the process to complete.
- Go to **build** > **outputs** > **app** > **release** to obtain the digitally signed app package.

#### Releasing Your App/Service to AppGallery Connect

After an app/service is released to AppGallery Connect, the app will be distributed to AppGallery and the service will be distributed to the service center. For details, please refer to [Releasing a HarmonyOS App](https://developer.huawei.com/consumer/en/doc/app/agc-help-harmonyos-releaseapp-non-next-0000002179322402) or [Releasing an Atomic Service](https://developer.huawei.com/consumer/en/doc/app/agc-help-harmonyos-releaseservice-0000001946273965).

#### Generating a Signing Certificate Fingerprint

The signing certificate fingerprint is used to verify the authenticity of an app. Before releasing an app, you must generate a signing certificate fingerprint locally based on the keystore file (.p12) and configure the fingerprint in AppGallery Connect.

Before you do this, make sure that the [keystore file and CSR file](#section135084784718) have been generated in DevEco Studio.
The steps are as follows:

- Execute the **cmd** command to open the CLI on Windows, or open the Terminal on macOS. Run the **cd** command to go to the directory where **keytool.exe** is located. (In the following example, the JDK is installed in the **C:\Program Files** directory.)
```cpp
cd C:\Program Files\Java\jdk\bin
```

- Run **keytool -list -v -keystore ***<keystore-file>* and follow the prompted instructions. In the command, *<keystore-file>* indicates the absolute path to the app's signing certificate. Example:
```cpp
keytool -list -v -keystore D:\WatchIndustrySdk\DemoTestNew\watchindustrydemonew1\sign\watchindustrydemonew1.p12
```

- Obtain the SHA-256 certificate fingerprint.

#### Configuring a Signing Certificate Fingerprint

- In [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html), click **My projects**.
- Find your app project, and click the desired app name.
- Go to **Project settings** > **General information**. In the **App information** area, click **Add public key fingerprint** next to **SHA-256 certificate fingerprint/public key fingerprint**. > **Note:** In the **App information** area, you can click next to **Client Secret** to copy the client secret.
- In the **Add SHA-256 public key fingerprint** window, set **How to add** to **Enter fingerprint**, and enter the obtained [signing certificate fingerprint](#section158182436101) in the text box.
- Click **OK**.
