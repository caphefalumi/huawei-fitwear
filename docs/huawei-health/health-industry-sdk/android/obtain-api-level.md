<!--
  Title: Obtaining the API Level
  Catalog: huaweihealth-Guides
  Document ID: obtain-api-level-0000002338298268
  Updated: 2026-08-05 02:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/obtain-api-level-0000002338298268
-->
# Obtaining the API Level

In the Health Industry SDK, each API has a corresponding API level, for example, 0 or 2. For details about the API levels, please refer to the [API Reference](https://developer.huawei.com/consumer/en/doc/health-References/overview-0000001199159886).

The Health Industry SDK client and server each possess an overall API level, defined as the highest API level among all supported APIs. For example, if the client comprises 40 APIs with API levels of either 0 or 2, the API level of the client as a whole is 2.

If the server's API level is lower than the client's, certain APIs of the client are not supported by the server. In this case, you need to update the server. If the server's API level is higher than or equal to the client's, all functions of the client are supported by the server.

#### Obtaining the API Level of the Client

- Call the [getServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [ServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952) object.
- Call the [getClientApiLevel](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952#EN-US_TOPIC_0000002647924358__getClientApiLevel--) method to obtain the API level of the client. 
```cpp
// Obtain the ServiceClient object.
ServiceClient serviceClient = IndustryWear.getServiceClient(this); 

// Call the getClientApiLevel method to obtain the API level of the client.
int level = serviceClient.getClientApiLevel();
```

#### Obtaining the API Level of the Server

- Call the [getServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [ServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952) object.
- Call the [getServiceApiLevel](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952#EN-US_TOPIC_0000002647924358__getServiceApiLevel-com_huawei_health_industry_client_callback_ServiceCallback-) method to obtain the API level of the server. 
```cpp
// Obtain the ServiceClient object.
ServiceClient serviceClient = IndustryWear.getServiceClient(this); 

// Call the getServiceClient method to obtain the API level of the server.
serviceClient.getServiceApiLevel(new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
	// Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the API level of the server is returned. |
