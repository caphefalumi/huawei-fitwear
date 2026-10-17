<!--
  Title: Connecting to a Wearable
  Catalog: huaweihealth-Guides
  Document ID: connect-device-0000002338298256
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/connect-device-0000002338298256
-->
# Connecting to a Wearable

This section describes how to reconnect an industry app to a wearable if the connection is lost after the initial connection. Before doing so, ensure that your industry app has obtained the required Bluetooth and location permissions on the mobile device, and perform operations in [Registering a Connection Status Listener](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/register-connection-status-listener-0000002338298252).

- Ensure that the interval between two reconnection attempts is greater than 60 seconds. Otherwise, the Bluetooth usage will be restricted, causing connection failures. If an exception occurs, please disable and then re-enable Bluetooth.
- From SDK 2.13.0.102: If a wearable is already connected, the wearable will be disconnected when you connect another wearable.
- If a wearable connected to your industry app is restored to factory settings but is not deleted from the app, you need to reset the wearable information after reconnecting to the wearable.

- Call the [getDeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceConnectClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Call [connectDevice](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__connectDevice-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) to connect to the target wearable. 
```cpp
// Obtain the DeviceConnectClient object.
DeviceConnectClient deviceConnectClient = IndustryWear.getDeviceConnectClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Connect to the target wearable.
deviceConnectClient.connectDevice(deviceId, new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 23, 26 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Connection result. An error message is returned if the API call fails. |
