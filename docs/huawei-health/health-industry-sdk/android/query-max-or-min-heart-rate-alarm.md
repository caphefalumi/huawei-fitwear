<!--
  Title: Querying the High/Low Heart Rate Alert Switch State and Threshold
  Catalog: huaweihealth-Guides
  Document ID: query-max-or-min-heart-rate-alarm-0000002535410772
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-max-or-min-heart-rate-alarm-0000002535410772
-->
# Querying the High/Low Heart Rate Alert Switch State and Threshold

This section describes how to query the state of the high/low heart rate alert switch and the threshold for triggering an alert (unit: beats/min). The switch is disabled by default when a wearable is connected for the first time.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the state of the high/low heart rate alert switch and the threshold for triggering an alert. 
```cpp
Input data in JSON format for querying the state of the high heart rate alert switch and the threshold for triggering an alert:
{
    "item": "maxHeartRateAlarm"
}

Input data in JSON format for querying the state of the low heart rate alert switch and the threshold for triggering an alert:
{
    "item": "minHeartRateAlarm"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the state of the high/low heart rate alert switch and the threshold for triggering an alert. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the state of the high/low heart rate alert switch and the threshold for triggering an alert.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "maxHeartRateAlarm");
    // jsonObject.put("item", "minHeartRateAlarm");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the state of the high/low heart rate alert switch and the threshold for triggering an alert.
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
| result | - | If the API call succeeds, the state of the high/low heart rate alert switch and the threshold for triggering an alert are returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The alert switch state and threshold are carried in **result** when the query is successful. 
```cpp
result example of querying the high heart rate alert switch state and threshold:
{
    "switch":1,
    "threshold":130
}
Or
{
    "switch":0
}

result example of querying the low heart rate alert switch state and threshold:
{
    "switch":1,
    "threshold":40
}
Or
{
    "switch":0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| switch | 0 | High/Low heart rate alert switch for non-workout states disabled. |
| 1 | High/Low heart rate alert switch for non-workout states enabled. |  |
| threshold | Integer ranging from 100 to 150 | Threshold for triggering an alert when the heart rate is too high in non-workout states. |
| Integer ranging from 40 to 50 | Threshold for triggering an alert when the heart rate is too low in non-workout states. |  |
 > **Note:** If the switch is disabled, no threshold will be returned.
