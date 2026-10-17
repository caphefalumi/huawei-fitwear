<!--
  Title: Setting the SpO2 Alert Switch and Threshold
  Catalog: huaweihealth-Guides
  Document ID: set-blood-oxygen-alarm-0000002372218957
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-blood-oxygen-alarm-0000002372218957
-->
# Setting the SpO2 Alert Switch and Threshold

This section describes how to set the SpO2 alert switch and alert threshold (in percentage) of a wearable. After the alert switch is enabled, the wearable will generate an abnormal SpO2 alert when detecting that the SpO2 value is lower than the alert threshold for three consecutive times. After the alert switch is disabled, no abnormal SpO2 alert will be generated.

> **Note:** If you want to enable the SpO2 alert switch, automatic SpO2 measurement needs to be enabled first. For details, please refer to [Setting the Automatic SpO2 Measurement Switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-blood-oxygen-switch-0000002338300788).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the SpO2 alert switch and the threshold for triggering an alert. 
```cpp
{
    "settingKey": "bloodOxygenAlarm",
    "settingValue": {
        "switch": 1,
        "threshold": 80
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | bloodOxygenAlarm | Key of the SpO2 alert switch and threshold. |
| settingValue | Fields included: **switch** and **threshold** | SpO2 alert switch state and the threshold for triggering an alert. |
| switch | 0 | Disables the SpO2 alert switch. |
| 1 | Enables the SpO2 alert switch. |  |
| threshold | Integer ranging from 75 to 90 | Threshold for triggering an abnormal SpO2 alert. **This parameter is mandatory only when the alert switch is enabled**. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the SpO2 alert switch and the threshold for triggering an alert. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the SpO2 alert switch and the threshold for triggering an alert.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject switchAndThreshold = new JSONObject();
    switchAndThreshold.put("switch", 1);
    switchAndThreshold.put("threshold", 80);
    jsonObject.put("settingKey", "bloodOxygenAlarm");
    jsonObject.put("settingValue", switchAndThreshold);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the SpO2 alert switch and the threshold for triggering an alert.
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
