<!--
  Title: Setting the Sleep Apnea Detection Switch
  Catalog: huaweihealth-Guides
  Document ID: set-osa-switch-0000002383597172
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-osa-switch-0000002383597172
-->
# Setting the Sleep Apnea Detection Switch

This section describes how to set the sleep apnea detection switch of a wearable. After the switch is turned on, the wearable performs sleep apnea detection when the user is asleep. Once the switch is turned off, the wearable stops sleep apnea detection.

> **Note:** Before calling the API for setting the sleep apnea detection switch, ensure that the sleep apnea detection feature has been activated. The sleep apnea detection feature depends on the TruSleep feature. Therefore, you are advised to associate the sleep apnea detection switch with the [TruSleep switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-trusleep-switch-0000002338300784) in your app as follows: Enabling the sleep apnea detection switch automatically turns on the TruSleep switch if it is currently disabled. Disabling the TruSleep switch automatically turns off the sleep apnea detection switch if it is currently enabled.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the sleep apnea detection switch. 
```cpp
{
  "settingKey": "osaSwitch",
  "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | osaSwitch | Key of the sleep apnea detection switch. |
| settingValue | 0 | Disables the sleep apnea detection switch. |
| 1 | Enables the sleep apnea detection switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the sleep apnea detection switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the sleep apnea detection switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "osaSwitch");
    jsonObject.put("settingValue", 0);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the sleep apnea detection switch.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 4, 5, 6, 7, 12, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
