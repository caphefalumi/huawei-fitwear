<!--
  Title: Scanning Wearables
  Catalog: huaweihealth-Guides
  Document ID: scan-device-0000002372256565
  Updated: 2026-08-05 02:10:12
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/scan-device-0000002372256565
-->
# Scanning Wearables

This section describes how to scan for nearby industry wearables in an industry app. The scanning automatically ends after 15 seconds. Wearables detected will be returned one by one in the API.

> **Note:** Before scanning, you need to obtain the Bluetooth and location permissions on the mobile device where the app runs. Please refer to [Adding Permissions](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-permission-0000002338138528) for how to dynamically apply for these permissions. Once a wearable is deleted, it can be detected by the industry app only after being reconnected via **Settings** > **System & updates** > **Connect new phone**.

- Call the [getDeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceConnectClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800) object.
- Construct input data in JSON format for initiating wearable scanning. 
```cpp
{
    "filterType": 0,
    "matcher": ""
}
```
 
| Parameter | Type | Description |
| --- | --- | --- |
| filterType | int | Filtering type. • **0**: no filtering • **1**: exact match • **2**: prefix match • **3**: suffix match • **4**: partial match • **5**: exact match by MAC address |
| matcher | String | Wearable filtering condition. |

- Call the [scanDevice](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__scanDevice-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to initiate wearable scanning. 
```cpp
// Obtain the DeviceConnectClient object.
DeviceConnectClient deviceConnectClient = IndustryWear.getDeviceConnectClient(this);

// Construct JSON parameters to start wearable scanning.
int type = 0; // Filtering type.
String matcher = ""; // Wearable filtering condition.
JSONObject jsonObject = new JSONObject();
try {
    // For details about the parameters, please refer to Table 1.
    jsonObject.put("filterType", type);
    jsonObject.put("matcher", matcher);
} catch (JSONException e) {
    e.printStackTrace();
}
deviceConnectClient.scanDevice(jsonObject.toString(), scanCallback);

// Obtain returned wearables in ServiceCallback.
private final ServiceCallback scanCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
};
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 1, 2, 3, 20, 21, 22, 23, 26, 32, 33 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call fails, an error message is returned. If a wearable is detected, the wearable information is returned. |
 The following shows an example of scanned Bluetooth wearable information returned in **result**. 
```cpp
{
    "deviceName": "HUAWEI Fara-B68-038",
    "mac": "66:0A:6D:1E:D0:45",
    "rssi": -72
}
```
 
| Parameter | Description |
| --- | --- |
| deviceName | Name of a wearable. |
| mac | MAC address of a wearable. |
| rssi | Signal strength. |
