<!--
  Title: Setting the Continuous Heart Rate Monitoring Mode
  Catalog: huaweihealth-Guides
  Document ID: set-continue-measure-heart-rate-switch-0000002372218953
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-continue-measure-heart-rate-switch-0000002372218953
-->
# Setting the Continuous Heart Rate Monitoring Mode

This section describes how to set the continuous heart rate monitoring mode for a wearable. After continuous heart rate monitoring (smart mode) is enabled, the wearable will dynamically adjust the measurement frequency based on users' workout status and provide 24-hour smart heart rate monitoring. After continuous heart rate monitoring (real-time mode) is enabled, the wearable will provide 24-hour real-time heart rate monitoring. After continuous heart rate monitoring is disabled, the wearable will not automatically measure the heart rate.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the continuous heart rate monitoring mode. 
```cpp
{
    "settingKey": "continueMeasureHeartRateSwitch",
    "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | continueMeasureHeartRateSwitch | Key of the continuous heart rate monitoring mode. |
| settingValue | 0 | Disables continuous heart rate monitoring. |
| 1 | Enables continuous heart rate monitoring (smart mode). |  |
| 2 | Enables continuous heart rate monitoring (real-time mode). This mode is not available on HUAWEI Band HA580, HUAWEI Band HA590, and HUAWEI Band HA5A0. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the continuous heart rate monitoring mode. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the continuous heart rate monitoring mode.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "continueMeasureHeartRateSwitch");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the continuous heart rate monitoring mode.
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
