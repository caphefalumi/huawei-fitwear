<!--
  Title: Setting the Automatic SpO2 Measurement Switch
  Catalog: huaweihealth-Guides
  Document ID: set-blood-oxygen-switch-0000002338300788
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-blood-oxygen-switch-0000002338300788
-->
# Setting the Automatic SpO2 Measurement Switch

This section describes how to set the automatic SpO2 measurement switch of a wearable. After the switch is enabled, the wearable will automatically measure SpO2 every 10 minutes while the user is stationary. After the switch is disabled, the wearable will stop automatic SpO2 measurement.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the automatic SpO2 measurement switch. 
```cpp
{
    "settingKey": "bloodOxygenSwitch",
    "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | bloodOxygenSwitch | Key of the automatic SpO2 measurement switch. |
| settingValue | 0 | Disables the automatic SpO2 measurement switch. |
| 1 | Enables the automatic SpO2 measurement switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the automatic SpO2 measurement switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the automatic SpO2 measurement switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "bloodOxygenSwitch");
    jsonObject.put("settingValue", 0);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the automatic SpO2 measurement switch.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 4, 5, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
