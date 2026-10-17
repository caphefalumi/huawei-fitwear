<!--
  Title: Setting the Calendar Synchronization Switch
  Catalog: huaweihealth-Guides
  Document ID: set-sync-calendar-switch-0000002418368209
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-sync-calendar-switch-0000002418368209
-->
# Setting the Calendar Synchronization Switch
This section describes how to set the calendar synchronization switch on a wearable. After the switch is enabled, calendar events will be automatically synchronized to the wearable when calendar events and dates on the phone change if the wearable is successfully connected to the phone. After the switch is disabled, calendar events will no longer be automatically synchronized to the wearable.
Calendar synchronization requires the calendar permission. For details, please refer to the [operation of applying for calendar read and write](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-permission-0000002338138528#EN-US_TOPIC_0000002647924382__li8752254164617).

> **Note:** After the calendar synchronization switch is enabled, [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) that support calendar creation can synchronize their calendar events to the mobile device (such as a phone).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the calendar synchronization switch. 
```cpp
{
    "settingKey": "syncCalendarSwitch",
    "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | syncCalendarSwitch | Key of the calendar synchronization switch. |
| settingValue | 0 | Disables the calendar synchronization switch. |
| 1 | Enables the calendar synchronization switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the calendar synchronization switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the calendar synchronization switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "syncCalendarSwitch");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the calendar synchronization switch.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 26, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
