<!--
  Title: Setting the Stand Reminder Switch
  Catalog: huaweihealth-Guides
  Document ID: set-sedentary-reminder-switch-0000002338300780
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-sedentary-reminder-switch-0000002338300780
-->
# Setting the Stand Reminder Switch

This section describes how to set the stand reminder switch of a wearable. After the switch is enabled, the wearable will generate a stand reminder if the user remains seated for one hour between 8:00 and 21:00 each day. After the switch is disabled, no stand reminder will be generated.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the stand reminder switch. 
```cpp
{
    "settingKey": "sedentaryReminderSwitch",
    "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | sedentaryReminderSwitch | Key of the stand reminder switch. |
| settingValue | 0 | Disables the stand reminder switch. |
| 1 | Enables the stand reminder switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the stand reminder switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the stand reminder switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "sedentaryReminderSwitch");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the stand reminder switch.
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
