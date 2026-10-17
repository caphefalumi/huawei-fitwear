<!--
  Title: Querying the Activation State of Sleep Apnea Detection
  Catalog: huaweihealth-Guides
  Document ID: query-osa-active-state-0000002383788214
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-osa-active-state-0000002383788214
-->
# Querying the Activation State of Sleep Apnea Detection

This section describes how to query the activation state of sleep apnea detection for a wearable, which is deactivated by default.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the activation state of sleep apnea detection. 
```cpp
{
    "item": "osaActiveState"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the activation state of sleep apnea detection. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the activation state of sleep apnea detection.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "osaActiveState");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the activation state of sleep apnea detection.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the activation state of sleep apnea detection is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The current activation state of sleep apnea detection is carried in **result** when the query is successful. 
```cpp
result example:
{
    "osaActiveState":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| osaActiveState | 0 | Sleep apnea detection not activated. |
| 1 | Sleep apnea detection activated. |  |
