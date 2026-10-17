<!--
  Title: Querying the Calendar Synchronization Switch State
  Catalog: huaweihealth-Guides
  Document ID: query-sync-calendar-switch-0000002384728996
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-sync-calendar-switch-0000002384728996
-->
# Querying the Calendar Synchronization Switch State

This section describes how to query the calendar synchronization switch state on a wearable.

> **Note:** If the calendar permission is not enabled, the calendar synchronization switch does not have a default value when a wearable is connected for the first time. In this case, error code **9** is returned. After the calendar permission is enabled, the calendar synchronization switch is enabled by default when a wearable is connected for the first time. After the calendar synchronization switch is set, the last configured switch state is returned if the calendar permission is disabled.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the calendar synchronization switch state. 
```cpp
{
    "item": "syncCalendarSwitch"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the calendar synchronization switch state. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the calendar synchronization switch state.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "syncCalendarSwitch");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the calendar synchronization switch state.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 9, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the state of the calendar synchronization switch is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The calendar synchronization switch information is carried in **result** when the query is successful. 
```cpp
result example:
{
    "syncCalendarSwitch":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| syncCalendarSwitch | 0 | Calendar synchronization switch disabled. |
| 1 | Calendar synchronization switch enabled. |  |
