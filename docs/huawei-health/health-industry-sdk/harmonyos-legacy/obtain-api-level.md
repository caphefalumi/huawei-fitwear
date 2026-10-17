<!--
  Title: Obtaining the API Level of the Server
  Catalog: huaweihealth-Guides
  Document ID: obtain-api-level-0000002413832936
  Updated: 2026-08-05 02:10:07
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/obtain-api-level-0000002413832936
-->
# Obtaining the API Level of the Server

This section describes how to obtain the API level of the Health Industry SDK server.

- Call the [getServiceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#EN-US_TOPIC_0000002648084254__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [ServiceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/servicemanageclient-0000002412617972) object.
- Call the [getApiLevel](https://developer.huawei.com/consumer/en/doc/health-References/servicemanageclient-0000002412617972#section19401185291) method to obtain the API level of the server. 
```cpp
// Obtain the ServiceManageClient object.
ServiceManageClient serviceManageClient = IndustryWear.getServiceManageClient(getContext());

// Call the getApiLevel method to obtain the API level of the server.
serviceManageClient.getApiLevel(new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the returned result, with statusCode indicating the status code and data indicating the data.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, the API level is returned. If it fails, an error message is returned. |
