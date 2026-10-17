<!--
  Title: Setting the Real-Time Heart Rate Linkage Switch
  Catalog: huaweihealth-Guides
  Document ID: set-realtime-heart-rate-0000002338141040
  Updated: 2026-08-05 02:10:30
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-realtime-heart-rate-0000002338141040
-->
# Setting the Real-Time Heart Rate Linkage Switch

This section describes how to set the real-time heart rate linkage switch between an industry app and a wearable. After the linkage switch is enabled and [real-time heat rate subscription is successful](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-realtime-heart-rate-data-0000002376595249), heart rate data will be reported every second. After the linkage switch is disabled, no heart rate data will be reported.

> **Note:** This API only enables the switch for a device to report heart rate data but does not process reported heart rate data. To process the reported data, you need to [subscribe to real-time heart rate data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-realtime-heart-rate-data-0000002376595249) first and implement the logic for processing the real-time heart rate data. The heart rate linkage will stop if a user removes the device or the device is disconnected during heart rate linkage. In this case, the heart rate linkage needs to be enabled again after the user wears the device again or the device reconnects.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the real-time heart rate linkage switch. 
```cpp
{
    "settingKey": "realtimeHeartRate",
    "settingValue": {
        "operateType": 1
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | realtimeHeartRate | Key of the real-time heart rate linkage switch. |
| settingValue | Field included: **operateType** | State of the real-time heart rate linkage switch. |
| operateType | 1 | Enables the real-time heart rate linkage switch. |
| 2 | Disables the real-time heart rate linkage switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the real-time heart rate linkage switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the real-time heart rate linkage switch.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject subJsonObject = new JSONObject();
    subJsonObject.put("operateType", 1);
    jsonObject.put("settingKey", "realtimeHeartRate");
    jsonObject.put("settingValue", subJsonObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the real-time heart rate linkage switch.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 303 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
