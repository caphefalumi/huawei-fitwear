<!--
  Title: FAQs About Health Service Kit
  Catalog: harmonyos-guides
  Document ID: health-faqs
  Updated: 2026-10-14 09:28:41
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs
-->
# FAQs About Health Service Kit

#### Why Are the Daily Activity Statistics Inconsistent with Those in the HUAWEI Health App?

There is a delay in data reporting when you call the [aggregation query](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-samplepoint-manage#performing-an-aggregation-query) API to read daily activity data. Therefore, you are advised to use the API for reading [real-time activity rings data](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-three-ring-read) instead to read real-time daily activity data.

#### Why Are the Data Type Permissions Still Unavailable After the Authorization?

Your app permissions for authentication are the intersection of the permissions you have applied for and those granted by users. Make sure that:

- You have applied for the permissions for the required data types by referring to [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply). For details about the permissions corresponding to each data type, please refer to [Permission Description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description).
- Users have selected the required permissions during the authorization.

#### Why Is Error 1001502003 Reported During the Authorization?

Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html) and verify that the bundle name in the code matches the client ID. For details, please refer to [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id). If the error persists, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

For more information about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

#### Why Is Error 1001502014 Reported During Authorization?

Make sure that you have applied for the permissions on the **Health Service Kit** card for the data types specified in the authorization request. For details about how to apply for the permissions, please refer to [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply). For details about the permissions corresponding to each data type, please refer to [Permission Description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description).

For more information about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice).

#### How Do I Guide Users to Open the HUAWEI Health App If They Have Not Agreed to the User Privacy Statement?

If error code 1002703001 is returned, perform the following operations to instruct the user to open the HUAWEI Health app and agree to the user privacy statement:

Call [canOpenLink](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bundlemanager#bundlemanagercanopenlink12) to check whether the HUAWEI Health app has been installed. HUAWEI Health app scheme: huaweischeme://healthapp/home/main

- If the app has been installed, call [openLink](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#openlink12) to start the HUAWEI Health app. HUAWEI Health app scheme: huaweischeme://healthapp/home/main
- If the app has not been installed, call the API in [Recommendation on AppGallery](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/appgallery-productview-loadproduct) to guide the user to download the HUAWEI Health app, whose bundle name is **com.huawei.hmos.health**.
