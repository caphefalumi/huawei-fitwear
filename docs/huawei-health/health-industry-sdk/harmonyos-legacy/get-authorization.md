<!--
  Title: Performing App Authentication
  Catalog: huaweihealth-Guides
  Document ID: get-authorization-0000002451240493
  Updated: 2026-08-05 02:10:08
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-authorization-0000002451240493
-->
# Performing App Authentication

When an industry app attempts to call an API of the Health Industry SDK, the SDK authenticates the app. The API call will succeed only when the authentication is successful.

> **Note:** Authentication requires network access. Ensure that the wearable is connected to the Internet. (The following network connection modes are supported: 1. The wearable connects to the Internet via Wi-Fi. 2. The wearable is paired with the Huawei Health app to share the mobile phone's network. 3. The wearable enables the eSIM service and uses the eSIM network.) Before setting the certificate path, place the [certificate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/apply-for-health-industry-sdk-service-0000002447189737#EN-US_TOPIC_0000002678164053__li16905940101212) in the **src/main/resources/rawfile** directory of the app development project. (If this directory does not exist, create one.) The certificate file name extension must be **.cer**. Test certificates have a finite validity period. After an app's test certificate is changed to a commercial certificate, the app must be authenticated again.

- Call the [getServiceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#EN-US_TOPIC_0000002648084254__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [ServiceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/servicemanageclient-0000002412617972) object.
- Call the [getAuthorization](https://developer.huawei.com/consumer/en/doc/health-References/servicemanageclient-0000002412617972#section5914149183414) method to authenticate the app. 
```cpp
// Obtain the ServiceManageClient object.
ServiceManageClient serviceManageClient = IndustryWear.getServiceManageClient(getContext());

// Enter the certificate path, which is a relative path to the resource/rawfile.
String certPath = "industrycer.cer";

// Perform app authentication.
serviceManageClient.getAuthorization(certPath, new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the returned result, with statusCode indicating the status code and data indicating the data.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 9 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the authentication succeeds, an empty string is returned. If the authentication fails, an error message is returned. |
