<!--
  Title: Setting the Raise-to-Wake Switch
  Catalog: huaweihealth-Guides
  Document ID: set-auto-light-screen-0000002338141028
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-auto-light-screen-0000002338141028
-->
# Setting the Raise-to-Wake Switch

This section describes how to set the raise-to-wake switch of a wearable. After the switch is enabled, the wearable will automatically wake the screen when the user raises their wrist. After the switch is disabled, the wearable will not automatically wake the screen when the user raises their wrist.

> **Note:** This API cannot be used for setting the raise-to-wake switch for [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557). Users have to modify the raise-to-wake settings on their wearables.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the raise-to-wake switch. 
```cpp
{
    "settingKey": "autoLightScreen",
    "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | autoLightScreen | Key of the raise-to-wake switch. |
| settingValue | 0 | Disables the raise-to-wake switch. |
| 1 | Enables the raise-to-wake switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the raise-to-wake switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the raise-to-wake switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "autoLightScreen");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the raise-to-wake switch.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
