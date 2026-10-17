<!--
  Title: Querying the State of the High Body Temperature Alert Switch
  Catalog: huaweihealth-Guides
  Document ID: query-high-temp-alert-switch-0000002560501363
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-high-temp-alert-switch-0000002560501363
-->
# Querying the State of the High Body Temperature Alert Switch

This section describes how to query the state of the high body temperature alert switch, which is disabled by default when a wearable is connected for the first time.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the state of the high body temperature alert switch. 
```cpp
{
    "item": "highTempAlertSwitch"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the state of the high body temperature alert switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the state of the high body temperature alert switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "highTempAlertSwitch");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the state of the high body temperature alert switch.
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
| result | - | If the API call succeeds, the state of the high body temperature alert switch is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The state of the high body temperature alert switch is carried in **result** when the query is successful. 
```cpp
result example:
{
    "switch":1,
    "threshold":37.5
}
Or
{
    "switch":0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| switch | 0 | High body temperature alert disabled. |
| 1 | High body temperature alert enabled. |  |
| threshold | Integer ranging from 37.2 to 38.5 | Threshold for triggering a high body temperature alert. |
 > **Note:** If the switch is disabled, no threshold will be returned.
