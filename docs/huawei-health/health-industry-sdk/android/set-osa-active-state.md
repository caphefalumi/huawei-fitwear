<!--
  Title: Setting the Activation State of Sleep Apnea Detection
  Catalog: huaweihealth-Guides
  Document ID: set-osa-active-state-0000002417356473
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-osa-active-state-0000002417356473
-->
# Setting the Activation State of Sleep Apnea Detection

This section describes how to set the activation state of the sleep apnea detection feature for a wearable. After sleep apnea detection is activated, the sleep apnea detection feature can be used on the wearable. After sleep apnea detection is deactivated, the feature is no longer available on the wearable.

> **Note:** Once sleep apnea detection is activated, the SDK enables the sleep apnea detection switch by default.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the activation state of sleep apnea detection. 
```cpp
{
  "settingKey": "osaActiveState",
  "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | osaActiveState | Key of the activation state of sleep apnea detection. |
| settingValue | 0 | Activates sleep apnea detection. |
| 1 | Deactivates sleep apnea detection. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the activation state for sleep apnea detection. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the activation state of sleep apnea detection.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "osaActiveState");
    jsonObject.put("settingValue", 0);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the activation state of sleep apnea detection.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 4, 5, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
