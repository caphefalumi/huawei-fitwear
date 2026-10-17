<!--
  Title: Setting the Notification Push Switch
  Catalog: huaweihealth-Guides
  Document ID: set-notification-push-switch-0000002372218945
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-notification-push-switch-0000002372218945
-->
# Setting the Notification Push Switch

This section describes how to set the switch for pushing notifications shown in the notification bar of a mobile device (for example, a phone) to a wearable. After the switch is enabled, the notifications received by the mobile device will be pushed to the wearable based on the app trustlist set in [Setting the App Trustlist for Pushing Notifications](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-notification-trust-list-0000002372259057). After the switch is disabled, the notifications received by the mobile device will not be pushed to the wearable.

> **Note:** To use the notification push feature, you need to apply for the notification bar access permission. For details, please refer to [Adding Permissions](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-permission-0000002338138528).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the notification push switch. 
```cpp
{
    "settingKey": "notificationPushSwitch",
    "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | notificationPushSwitch | Key of the notification push switch. |
| settingValue | 0 | Disables the notification push switch. |
| 1 | Enables the notification push switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the notification push switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the notification push switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "notificationPushSwitch");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the notification push switch.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
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
