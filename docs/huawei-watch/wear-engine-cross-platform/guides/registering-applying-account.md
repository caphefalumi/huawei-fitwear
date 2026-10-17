<!--
  Title: Registering a HUAWEI ID and Applying for the HUAWEI ID Service
  Catalog: connectivity-Guides
  Document ID: registering-applying-account-0000001050818011
  Updated: 2025-10-31 01:20:04
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/registering-applying-account-0000001050818011
-->
**
# Registering a HUAWEI ID and Applying for the HUAWEI ID Service

- Register as a developer and complete identity verification. For detailed operations, refer to [HUAWEI ID Registration](https://developer.huawei.com/consumer/en/doc/start/registration-and-verification-0000001053628148). > **Note:** Individual developers can apply for only two basic service permissions ([basic device information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p144135716461) and [message notifications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p9640134154416)). Enterprise developers can apply for a complete range of service permissions. Therefore, you are advised to apply for an enterprise developer account.
- Sign in to the [HUAWEI Developers](https://developer.huawei.com/consumer/en/) website and click Console**. **Figure 1 **Accessing the console

- Go to **App services** > **Development** > **HUAWEI ID**.

- Click **Apply for HUAWEI ID**. If you accept the agreement, you will access the page for filling in product information. **Product type**: Select **Mobile app**.
- **Product**: Select an existing Android mobile app or create a new one.Scenario 1: From the drop-down list box, select an existing app.
- Scenario 2: The app that you want is still not created. Create it now.Click **New**. Then fill in the app name and select the app type and language.
- After the app is successfully created, its app ID and secret are generated to uniquely identify the app.

- **Package name**: Enter the [app's package name](https://developer.huawei.com/consumer/en/doc/HMSCore-Guides/application-package-name-0000001580840241), for example, **com.huawei.healthdemoanna**. The value must be identical to the APK package name and cannot be changed once submitted.
- **SHA-256 certificate fingerprint**: Enter the signing certificate fingerprint. It is used to verify the authenticity of the app. Refer to [Generating a Signing Certificate](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#2) to create a signing certificate for the app and refer to [Generating a Signing Certificate Fingerprint](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#3) to obtain the SHA-256 certificate fingerprint. > **Note:** You are advised to configure your app's certificate fingerprints for multiple app stores in advance to ensure seamless message communication between the wearable-side app and the phone-side app when the two are installed from different app stores.
- **Callback URL** (optional): You can add up to 50 callback URLs. Each URL must not exceed 255 characters; (optional) supports IP address and port; and must not contain a question mark.

- Click **Submit**. The HUAWEI ID service is enabled, and the Account Kit switch of your app in AppGallery Connect is automatically turned on. Then, proceed to [apply for the Wear Engine service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982). > **Note:** You can check whether the Account Kit switch is turned on in [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html#/). Before viewing the switch status, add your app to a project. For details, please refer to [Creating Your Project and App](https://developer.huawei.com/consumer/en/doc/app/agc-help-create-0000001100014692).
