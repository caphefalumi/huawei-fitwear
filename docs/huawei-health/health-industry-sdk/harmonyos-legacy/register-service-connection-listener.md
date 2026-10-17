<!--
  Title: Registering a Listener for the Server Connection Status
  Catalog: huaweihealth-Guides
  Document ID: register-service-connection-listener-0000002448110861
  Updated: 2026-08-05 02:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/register-service-connection-listener-0000002448110861
-->
# Registering a Listener for the Server Connection Status

This section describes how to register and unregister a listener for the connection status between your app and the Health Industry SDK server. After the registration is successful, the current connection status between your app and the industry SDK server is returned upon status changes.

- Call the [getServiceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#EN-US_TOPIC_0000002648084254__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [ServiceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/servicemanageclient-0000002412617972) object.
- Call the [registerServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/health-References/servicemanageclient-0000002412617972#EN-US_TOPIC_0000002647924342__getServiceClient-android_content_Context-) method to register a listener for the connection status between your app and the server. 
```cpp
// Obtain the ServiceManageClient object.
ServiceManageClient serviceManageClient = IndustryWear.getServiceManageClient(getContext());

// Register a listener for the connection status between your app and the server.
serviceManageClient.registerServiceConnectionListener(new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the returned result, with statusCode indicating the status code and data indicating the data.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 8 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the registration succeeds, an empty string is returned. When the connection status changes, the server connection status is returned. • **1**: Disconnected • **0**: Connected |

- Call the [unregisterServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/health-References/servicemanageclient-0000002412617972#section884813561243) method to unregister the connection status listener. 
```cpp
// Unregister a listener for the connection status between your app and the server.
serviceManageClient.unregisterServiceConnectionListener(serviceCallback);
```
 > **Note:** The unregistration is successful when the following condition is met: **ServiceCallback** passed for unregistration must be the one passed for registration.
