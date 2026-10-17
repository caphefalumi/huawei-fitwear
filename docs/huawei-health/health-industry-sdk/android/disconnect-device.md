<!--
  Title: Disconnecting a Connected Wearable
  Catalog: huaweihealth-Guides
  Document ID: disconnect-device-0000002372256569
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/disconnect-device-0000002372256569
-->
# Disconnecting a Connected Wearable

This section describes how to disconnect an industry app from a paired wearable. Before doing so, ensure that your industry app has obtained the required Bluetooth and location permissions on the mobile device (for example, a phone), and perform operations in [Registering a Connection Status Listener](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/register-connection-status-listener-0000002338298252).

- Call the [getDeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceConnectClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Call the [disconnectDevice](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__disconnectDevice-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to disconnect the wearable with a certain **deviceId**. 
```cpp
// Obtain the DeviceConnectClient object.
DeviceConnectClient deviceConnectClient = IndustryWear.getDeviceConnectClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Disconnect the target wearable.
deviceConnectClient.disconnectDevice(deviceId, new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 23, 26 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Disconnection result. An error message is returned if the API call fails. |
