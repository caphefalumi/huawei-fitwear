<!--
  Title: Registering a Listener for Connection Status Between an App and the Server
  Catalog: huaweihealth-Guides
  Document ID: register-service-connection-listener-0000002372216461
  Updated: 2026-08-05 02:10:12
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/register-service-connection-listener-0000002372216461
-->
# Registering a Listener for Connection Status Between an App and the Server

This section describes how to register a listener for the connection status between an industry app and the server of the Health Industry SDK. Upon successful registration, you can monitor the connection status changes.

- Call the [getServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [ServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952) object.
- Call the [registerServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952#EN-US_TOPIC_0000002647924358__registerServiceConnectionListener-com_huawei_health_industry_client_callback_ServiceCallback-) method to register a listener for the connection status between your app and the server. 
```cpp
// Obtain the ServiceClient object.
ServiceClient serviceClient = IndustryWear.getServiceClient(this);

// Register a listener for the connection status between your app and the server.
serviceClient.registerServiceConnectionListener(new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the connection status change information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 3, 8 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | • **0**: server successfully connected • **1**: server disconnected | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. When the connection status changes, the server connection status is returned. |
