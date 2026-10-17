<!--
  Title: Setting the Arrhythmia Alert Switch
  Catalog: huaweihealth-Guides
  Document ID: set-arrhythmia-notify-switch-0000002558189339
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-arrhythmia-notify-switch-0000002558189339
-->
# Setting the Arrhythmia Alert Switch

This section describes how to set the arrhythmia alert switch of a wearable. When the switch is enabled, the wearable will issue alerts upon detecting abnormal heartbeat rhythms. After the switch is disabled, the wearable no longer displays alerts.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the arrhythmia alert switch. 
```cpp
{
    "settingKey": "arrhythmiaNotifySwitch",
    "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | arrhythmiaNotifySwitch | Key of the arrhythmia alert switch. |
| settingValue | 0 | Disables arrhythmia alert. |
| 1 | Enables arrhythmia alert. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the arrhythmia alert switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the arrhythmia alert switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "arrhythmiaNotifySwitch");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the arrhythmia alert switch.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 4, 5, 6, 7, 12 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
