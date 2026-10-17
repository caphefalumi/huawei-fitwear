<!--
  Title: Querying the State of the Automatic Arrhythmia Detection Switch
  Catalog: huaweihealth-Guides
  Document ID: query-arrhythmia-auto-monitor-switch-0000002527189070
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-arrhythmia-auto-monitor-switch-0000002527189070
-->
# Querying the State of the Automatic Arrhythmia Detection Switch

This section describes how to query the state of the automatic arrhythmia detection switch of a wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the state of the automatic arrhythmia detection switch. 
```cpp
{
    "item": "arrhythmiaAutoMonitorSwitch"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the state of the automatic arrhythmia detection switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the state of the automatic arrhythmia detection switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "arrhythmiaAutoMonitorSwitch");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the state of the automatic arrhythmia detection switch.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 12 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the state of the automatic arrhythmia detection switch is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The state of the automatic arrhythmia detection switch is carried in **result** when the query is successful. 
```cpp
result example:
{
    "arrhythmiaAutoMonitorSwitch":1,
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| arrhythmiaAutoMonitorSwitch | 0 | Switch of automatic arrhythmia detection in non-workout states disabled. |
| 1 | Switch of automatic arrhythmia detection in non-workout states enabled. |  |
