<!--
  Title: Querying the Bluetooth Disconnection Reminder Switch
  Catalog: huaweihealth-Guides
  Document ID: query-bt-lost-reminder-switch-0000002338141056
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-bt-lost-reminder-switch-0000002338141056
-->
# Querying the Bluetooth Disconnection Reminder Switch

This section describes how to query the state of the Bluetooth disconnection reminder switch, which is enabled by default when a wearable is connected for the first time.

> **Note:** This feature is not supported when a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) is in the ultra-long battery life mode.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the state of the Bluetooth disconnection reminder switch. 
```cpp
{
    "item": "BTLostReminderSwitch"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the state of the Bluetooth disconnection reminder switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the state of the Bluetooth disconnection reminder switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "BTLostReminderSwitch");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the state of the Bluetooth disconnection reminder switch.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the state of the Bluetooth disconnection reminder switch is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The state of the Bluetooth disconnection reminder switch is carried in **result** when the query is successful. 
```cpp
result example:
{
    "BTLostReminderSwitch":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| BTLostReminderSwitch | 0 | The Bluetooth disconnection reminder switch is disabled. |
| 1 | The Bluetooth disconnection reminder switch is enabled. |  |
