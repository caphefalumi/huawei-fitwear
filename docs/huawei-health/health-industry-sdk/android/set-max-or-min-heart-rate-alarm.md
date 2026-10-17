<!--
  Title: Setting the High/Low Heart Rate Alert Switch and Threshold
  Catalog: huaweihealth-Guides
  Document ID: set-max-or-min-heart-rate-alarm-0000002535401852
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-max-or-min-heart-rate-alarm-0000002535401852
-->
# Setting the High/Low Heart Rate Alert Switch and Threshold

This section describes how to set the high/low heart rate alert switch and threshold (unit: beats/min) for non-workout states on a wearable. After the alert switch is enabled, the wearable will generate a high/low heart rate alert if the heart rate remains above/below the threshold for 10 consecutive minutes. After the alert switch is disabled, no alerts will be generated.

> **Note:** To enable the high/low heart rate alert, you need to enable the continuous heart rate monitoring mode first. For details, please refer to [Setting the Continuous Heart Rate Monitoring Mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-continue-measure-heart-rate-switch-0000002372218953).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the high/low heart rate alert switch and threshold. 
```cpp
Input data in JSON format for setting the high heart rate alert switch and threshold:
{
    "settingKey": "maxHeartRateAlarm",
    "settingValue": {
        "switch": 1,
        "threshold": 130
    }
}

Input data in JSON format for setting the low heart rate alert switch and threshold:
{
    "settingKey": "minHeartRateAlarm",
    "settingValue": {
        "switch": 1,
        "threshold": 40
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | maxHeartRateAlarm | Key of the high heart rate alert switch and threshold. |
| minHeartRateAlarm | Key of the low heart rate alert switch and threshold. |  |
| settingValue | Fields included: **switch** and **threshold** | High/Low heart rate alert switch state and alert threshold. |
| switch | 0 | Disables high/low heart rate alert switch for non-workout states. |
| 1 | Enables high/low heart rate alert switch for non-workout states. |  |
| threshold | Integer ranging from 100 to 150 | High heart rate alert threshold for non-workout states. **This parameter is mandatory only when the alert switch is enabled.** |
| Integer ranging from 40 to 50 | Low heart rate alert threshold for non-workout states. **This parameter is mandatory only when the alert switch is enabled.** |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the high/low heart rate alert switch and threshold. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the high/low heart rate alert switch and threshold.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject switchAndThreshold = new JSONObject();
    switchAndThreshold.put("switch", 1);
    switchAndThreshold.put("threshold", 130); 
    // switchAndThreshold.put("threshold", 40);
    jsonObject.put("settingKey", "maxHeartRateAlarm");
    // jsonObject.put("settingKey", "minHeartRateAlarm");
    jsonObject.put("settingValue", switchAndThreshold);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the high/low heart rate alert switch and threshold.
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
