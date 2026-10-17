<!--
  Title: Registering a HUAWEI ID and Applying for the HUAWEI ID Service
  Catalog: huaweihealth-Guides
  Document ID: register-account-and-apply-for-account-service-0000002338132754
  Updated: 2026-08-05 02:10:07
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/register-account-and-apply-for-account-service-0000002338132754
-->
**
# Registering a HUAWEI ID and Applying for the HUAWEI ID Service

- Register as a developer and complete identity verification. For details, please refer to [HUAWEI ID Registration](https://developer.huawei.com/consumer/en/doc/start/registration-and-verification-0000001053628148).
- Sign in to the [HUAWEI Developers](https://developer.huawei.com/consumer/en/) website and click Console.
- Go to App services > Development, and click the HUAWEI ID card. > **Note:** If the HUAWEI ID card cannot be found, click on the right of Development to add it.
- Click Apply for HUAWEI ID**. Once you accept the agreement, you will be directed to the product information page. 
| Parameter | How to Set |
| --- | --- |
| Product type | Select **Mobile app**. |
| Product | • If the product has been created, select it from the product list. • If the product has not been created, perform the following:Click **New**. Fill in the related information.**Figure 1 **New product** NOTE: When creating a product, please enter the real app name, to facilitate the subsequent review process. • An app ID and a key are generated to identify the app.Figure 2 **Product created successfully |
| Package name | Enter the [app package name](https://developer.huawei.com/consumer/en/doc/HMSCore-Guides/application-package-name-0000001580840241), for example, **com.huawei.healthdemoanna**. The value must be identical to the APK package name and cannot be changed once submitted. |
| SHA-256 certificate fingerprint | Enter the signing certificate fingerprint, which is used to verify the authenticity of apps. Please obtain the SHA-256 fingerprint of your app's signature file by referring to [Generating a Signing Certificate Fingerprint](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/generate-signature-cert-and-fingerprint-0000002372130841#section11131558123616). CAUTION: • After modifying the certificate fingerprint, you need to [apply for the Health Industry SDK service](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/apply-for-health-industry-sdk-service-0000002338292522) again and download the new certificate once the application is approved. • It is recommended that you configure the certificate fingerprints of multiple app stores for your app to facilitate message communication between your app on wearables and the apps downloaded from different app stores. |

- Click **Submit**. Then, [apply for the Health Industry SDK service](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/apply-for-health-industry-sdk-service-0000002338292522).
