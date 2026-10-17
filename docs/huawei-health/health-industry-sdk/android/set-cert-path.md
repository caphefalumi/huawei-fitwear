<!--
  Title: Setting a Certificate Path
  Catalog: huaweihealth-Guides
  Document ID: set-cert-path-0000002372256561
  Updated: 2026-08-05 02:10:12
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-cert-path-0000002372256561
-->
# Setting a Certificate Path

This section describes how to set a certificate path for an industry app. After a certificate path is set, the app will read the certificate when a device is added, and then access the address provided by HUAWEI Enterprise Manager (HEM) for permission verification. Connection between the app and the device can be established only after the verification is successful.

> **Note:** HEM is a mobile device management solution provided for you based on the powerful platform and hardware of Huawei. You can use it to check device permissions. Before setting the certificate path, place the [certificate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/apply-for-health-industry-sdk-service-0000002338292522#EN-US_TOPIC_0000002678163989__li16905940101212) in the **src/main/assets** directory of the industry app development project. If no such directory exists, create one. The certificate file name extension is **.cer**. Test certificates have a finite validity period. After an app's test certificate is changed to a commercial certificate, remind app users to perform pairing and connection again.

- Call the [getServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [ServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952) object.
- Call the [setCertPath](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952#EN-US_TOPIC_0000002647924358__setCertPath-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set a certificate path. 
```cpp
// Obtain the ServiceClient object.
ServiceClient serviceClient = IndustryWear.getServiceClient(this);

// Set the certificate name, which must be consistent with the name of the certificate file in the src/main/assets directory.
String certPath = "industrycer.cer";

// Set the certificate path.
serviceClient.setCertPath(certPath, new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
