<!--
  Title: Obtaining the Wearable List
  Catalog: huaweihealth-Guides
  Document ID: get-device-list-0000002372216449
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-device-list-0000002372216449
-->
# Obtaining the Wearable List

This section describes how to obtain the list of wearables paired with an industry app. The list is returned as a JSON string. You need to parse the string and encapsulate the data.

> **Note:** In SDK 2.13.0.102 and later versions, an industry app can obtain the wearable model from the wearable list.

- Call the [getDeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceConnectClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800) object.
- Call the [getDeviceList](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__getDeviceList-com_huawei_health_industry_client_callback_ServiceCallback-) method to obtain the list of paired wearables. 
```cpp
// Obtain the DeviceConnectClient object.
DeviceConnectClient deviceConnectClient = IndustryWear.getDeviceConnectClient(this);

// Obtain the list of paired wearables.
deviceConnectClient.getDeviceList(new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
        // If the value of statusCode is 0, the wearable list is obtained successfully. In this case, parse result as follows to obtain the wearable information:
        try {
            JSONArray jsonArray = new JSONArray(result);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject deviceJson = jsonArray.getJSONObject(i);
                int connectionStatus = deviceJson.getInt("connectionStatus");
                String deviceId = deviceJson.getString("deviceId");
                String deviceName = deviceJson.getString("deviceName");
                String mac = deviceJson.getString("mac");
                String sn = deviceJson.getString("SN");
                String softwareVersion = deviceJson.getString("softwareVersion");
                if (deviceJson.has("deviceMode")) {
                   String deviceMode = deviceJson.getString("deviceMode");
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 26 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call fails, an error message is returned. If the API call succeeds, the wearable information is returned. |
 Wearable information returned in **result**: 
```cpp
[{
    "connectionStatus": 2,
    "deviceId": "XXXXXXXXXXXXXXXXXXXXXX",
    "deviceName": "XXXXXXXXXXXXXX",
    "mac": "XX:XX:XX:XX:XX:XX",
    "SN": "XXXXXXXXXXXXXXXX",
    "softwareVersion": "12.0.0.136C00SP1",
    "deviceMode": "XXX"
}]
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| connectionStatus | 0, 1, 2, 3, 4, 5 | Wearable connection status code. For details, please refer to the status codes for device connection state broadcasts in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| deviceId | - | ID of a wearable. |
| deviceName | - | Name of a wearable. |
| mac | - | MAC address of a wearable. |
| SN | - | SN of a wearable. |
| softwareVersion | - | Software version of a wearable. |
| deviceMode | - | Model of a wearable. |
 > **Note:** After the Health Industry SDK is updated to 2.7.0.105, reconnect the wearable and then call the API to obtain the wearable SN.
