<!--
  Title: Deleting a Certificate Path
  Catalog: huaweihealth-Guides
  Document ID: delete-cert-path-0000002338138532
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/delete-cert-path-0000002338138532
-->
# Deleting a Certificate Path

This section describes how to delete the certificate path you have set.

> **Note:** If no certificate path has been set, error code **9** will be returned.

- Call the [getServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [ServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952) object.
- Call the [deleteCertPath](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952#EN-US_TOPIC_0000002647924358__deleteCertPath-com_huawei_health_industry_client_callback_ServiceCallback-) method to delete a certificate path. 
```cpp
// Obtain the ServiceClient object.
ServiceClient serviceClient = IndustryWear.getServiceClient(this);

// Delete a certificate path.
serviceClient.deleteCertPath(new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 9 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Deletion result. An error message is returned if the API call fails. |
