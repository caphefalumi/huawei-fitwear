<!--
  Title: Adding a Wearable
  Catalog: huaweihealth-Guides
  Document ID: add-device-0000002338138536
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/add-device-0000002338138536
-->
# Adding a Wearable

This section describes how to pair an industry app with a target wearable. Before adding a wearable for the first time, ensure that your industry app has obtained the required Bluetooth and location permissions on the mobile device (for example, a phone), and perform operations in [Setting a Certificate Path](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-cert-path-0000002372256561) and [Registering a Connection Status Listener](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/register-connection-status-listener-0000002338298252).

- If a wearable was previously connected to the Huawei Health app, it must be deleted from the app and restored to factory settings before being added to your industry app.
- If a wearable (except HUAWEI Band 6 B10 and HUAWEI Band 6 B20) was previously connected to your industry app, it must be deleted from the app and restored to factory settings before being added again. If the wearable has not been factory-reset, adding it to your industry app will trigger a factory reset prompt on the wearable.
- From SDK 2.13.0.102, if a wearable is already connected, the wearable will be disconnected automatically when you connect another wearable.

> **Note:** From SDK 2.13.0.102: The wearable adding API supports a user account parameter. If you have your own account system, you can use this parameter to set user accounts. If the same user account is used for re-adding a wearable, the wearable does not need to be forcibly factory reset. When a user uses the same account to re-add a wearable after deleting it from your industry app without a factory reset, the app must re-deliver the pre-deletion settings. After a wearable is successfully added to your industry app, the time on the phone will be automatically synchronized to the wearable. The phone's time format (12-hour or 24-hour) will also be synchronized, except for HUAWEI WATCH B7-536, HUAWEI WATCH B7-738, and HUAWEI WATCH H7546.

- Call the [getDeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceConnectClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800) object.
- Construct input data in JSON format for adding a wearable. 
```cpp
{
    "deviceName": "HUAWEI Fara-B69-66A",
    "mac": "F4:87:C5:90:16:6A",
    "bluetoothType": 0,
    "userId": "a87c38475da045349dee"    
}
```
 
| Parameter | Type | Description |
| --- | --- | --- |
| deviceName | String | Name of a wearable, which cannot be used to uniquely identify the wearable. |
| mac0 | String | MAC address of a wearable, which uniquely identifies the wearable. |
| bluetoothType (optional) | int | Bluetooth connection mode. • **0** (default): The connection mode is automatically selected. • **1**: The BLE connection mode is specified (supported only on [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) as well as HUAWEI WATCH H5546 and subsequent [lite wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555)). |
| userId (optional) | String | User account, which can contain only letters and digits. The value can contain up to 256 characters. This parameter is added in version 2.13.0.102. If a wearable is re-added using the same account after being unpaired, no factory reset is required. |

- Call [addDevice](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__addDevice-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) to add a wearable. 
```cpp
// Obtain the DeviceConnectClient object.
DeviceConnectClient deviceConnectClient = IndustryWear.getDeviceConnectClient(this);

// Construct the JSON parameters. deviceName indicates the wearable name and mac indicates the wearable MAC address.
JSONObject deviceInfo = new JSONObject();
try {
    deviceInfo.put("deviceName", deviceName);
    deviceInfo.put("mac", mac);
    deviceInfo.put("bluetoothType", bluetoothType);
    deviceInfo.put("userId", userId);
} catch (JSONException e) {
    e.printStackTrace();
}

// Initiate a request to add a wearable.
deviceConnectClient.addDevice(deviceInfo.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 23, 25, 26, 28, 29, 31 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Adding result. An error message is returned if the API call fails. |
 If you want to cancel wearable addition, perform the following operations. > **Note:** The **bluetoothType** value passed to the API for canceling wearable addition should be the same as the one passed to the API for adding a wearable. 
```cpp
// Initiate a request to cancel wearable addition.
deviceConnectClient.cancelAddDevice(deviceInfo.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 23, 26 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Cancellation result. An error message is returned if the API call fails. |
