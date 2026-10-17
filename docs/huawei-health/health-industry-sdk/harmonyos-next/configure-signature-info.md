<!--
  Title: Configuring App Signing Information
  Catalog: huaweihealth-Guides
  Document ID: configure-signature-info-0000002376394481
  Updated: 2026-08-05 02:10:04
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/configure-signature-info-0000002376394481
-->
# Configuring App Signing Information

You need to create a new keystore file (.p12) and certificate request file (.csr) in DevEco Studio, and use them to apply for a digital certificate (.cer) and a HarmonyAppProvision file (.p7b), to ensure that your app can be properly installed on wearables after integrating the Health Industry SDK.

#### Creating a Keystore File and a Certificate Request File

- On the menu bar, choose **Build** > **Generate Key and CSR**. > **Note:** If a key already exists locally, click **Skip** in **Generate Key** and use this key to generate a certificate request file.
- In **Key Store File**, click **Choose Existing** to select an existing keystore file (a .p12 file that stores keys). If no keystore file exists, click **New** to create one. The following describes how to create a keystore file.
- In the **Create Key Store** dialog box, set the following parameters and click **OK**: **Key store file**: Set the keystore file path. The value includes the file path and file name, which must have the .p12 extension.
- **Password**: Enter a keystore password, which must contain at least eight characters consisting of two or more types of the following: uppercase letters, lowercase letters, digits, and special characters. Remember the password as it will be used later for configuring the signing.
- **Confirm password**: Enter the keystore password again.

- In the **Generate Key and CSR** dialog box, set the following parameters and click **Next**: **Alias**: Enter the alias of the key, which is used to identify the key name. Remember the alias as it will be used later for configuring the signing.
- **Password**: Password of the key, which is automatically filled in and is the same as the keystore password.

- In the **Generate Key and CSR** dialog box, set the CSR file storage path and CSR file name.
- Click **Finish**. You can then obtain the generated .p12 keystore file and CSR file from their respective storage locations.

#### Applying for a Release Certificate and Profile

Use the generated CSR file to apply for a release certificate and profile in [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html). The steps are as follows:

- On the project page in AppGallery Connect, create a HarmonyOS app/atomic service. For details, please refer to [Creating a HarmonyOS App](https://developer.huawei.com/consumer/en/doc/app/agc-help-create-app-0000002247955506) or [Creating an Atomic Service](https://developer.huawei.com/consumer/en/doc/app/agc-help-create-atomic-service-0000002247795706). > **Note:** In the app/service distribution phase, HarmonyOS apps are distributed to AppGallery, and atomic services are distributed to the service center. When applying for a signing certificate for your atomic service, select **Yes** for **Atomic service** during app creation.
- Apply for and download a release certificate and profile in AppGallery Connect. For details, please refer to [Requesting a Release Certificate](https://developer.huawei.com/consumer/en/doc/app/agc-help-release-cert-0000002283336729) and [Requesting a Release Profile](https://developer.huawei.com/consumer/en/doc/app/agc-help-release-profile-0000002248341090). An app signed with the release certificate and profile cannot be manually installed on a wearable. It can only be installed after being released to AppGallery.
- In the development and debugging phases, only apps that are manually signed with the debug certificate and profile can be installed on a wearable. For details, please refer to [Requesting a Debug Certificate](https://developer.huawei.com/consumer/en/doc/app/agc-help-debug-cert-0000002283256797) and [Requesting a Debug Profile](https://developer.huawei.com/consumer/en/doc/app/agc-help-debug-profile-0000002248181278).

With the obtained release certificate and profile, sign your app in DevEco Studio. For details, please refer to [Configuring the Signing Information](#section1839475132817).

#### Configuring the Signing Information

Use the generated private key file (.p12) and the certificate file (.cer) and profile (.p7b) requested in AppGallery Connect to configure signing information in DevEco Studio and then build an app that carries release signing information.

Go to **File** > **Project Structure** > **Project** > **Signing Configs** > **default**, deselect **Automatically generate signature**, and configure the project signing information.

- **Store file**: Select the .p12 keystore file.
- **Store password**: Enter the keystore password.
- **Key alias**: Enter the alias of the key.
- **Key password**: Enter the password of the key.
- **Sign alg**: Signing algorithm, which has a fixed value of **SHA256withECDSA**.
- **Profile file**: Select the obtained release profile in .p7b format.
- **Certpath file**: Select the obtained release digital certificate file in .cer format.

After the signing information is configured, click **OK** to save the settings. Then build your app in DevEco Studio. For details, please refer to [Compiling and Building the .app File](#section164316581548).

#### Compiling and Building the .app File

For an app to be released, the app package type must be **Release**.

During app packaging, DevEco Studio automatically includes all HAP/HSP modules in your project directory into the final app package. Therefore, ensure that all unnecessary HAP/HSP modules are deleted from your project directory before packaging.

- Go to **Build** > **Build Hap(s)/APP(s)** > **Build APP(s)** and wait for the process to complete. > **Note:** The default [Build Mode](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-hvigor-compilation-options-customizing-guide#section192461528194916) is **Release** for an app package and **Debug** for a HAP/HSP/HAR package. That is, when **Build APP(s)** is selected, the app package is of the **Release** type by default, meeting the release requirement. No further settings are required from you.
- Go to **build** > **outputs** > **default** to obtain the signed app package.

#### Releasing the App to AppGallery

Release the HarmonyOS app/atomic service package (.app file) to AppGallery. For details, please refer to [Releasing a HarmonyOS App](https://developer.huawei.com/consumer/en/doc/app/agc-help-release-app-0000002271695230) and [Releasing an Atomic Service](https://developer.huawei.com/consumer/en/doc/app/agc-help-release-atomic-0000002327731065).
