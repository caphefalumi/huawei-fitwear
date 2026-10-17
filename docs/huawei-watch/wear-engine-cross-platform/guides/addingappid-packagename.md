<!--
  Title: Configuring the App ID, Package Name, and Signing Certificate
  Catalog: connectivity-Guides
  Document ID: addingappid-packagename-0000001050818013
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/addingappid-packagename-0000001050818013
-->
**
# Configuring the App ID, Package Name, and Signing Certificate

Huawei will validate your app by verifying its package name, app ID, and signing certificate fingerprint to ensure that the information is the same as the one filled in when registering a HUAWEI ID and applying for the HUAWEI ID service.

Modify the following information of the app before debugging.

#### Adding an App ID

- Open the AndroidManifest.xml file. Figure 1 **The **AndroidManifest.xml** file**
- Add the app ID generated when creating the app on HUAWEI Developers to the application section. Make sure that value is set to the app ID that has been generated when [registering a HUAWEI ID and applying for the HUAWEI ID service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).
```cpp
<meta-data
    android:name="com.huawei.hms.client.appid"
    android:value="******"/>
<!-- Make sure to change the asterisks (*) in the preceding code to the actual app ID.-->
```
 Figure 2 **Adding an app ID**

#### Changing the Package Name

Note that the package name must be the same as the one filled in when [registering a HUAWEI ID and applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011). If it is not, [change the app package name](https://developer.huawei.com/consumer/en/doc/HMSCore-Guides/application-package-name-0000001580840241).

#### Configuring the Signing Certificate

Note that the [signing certificate fingerprint](https://developer.huawei.com/consumer/en/codelab/HMSPreparation/index.html#7) must be the same as the one filled in when [applying for the HUAWEI ID service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).

> **Note:** Include the signature information when building an app. The following figure shows how to build a signed app.
Figure 3 **Building a signed app
