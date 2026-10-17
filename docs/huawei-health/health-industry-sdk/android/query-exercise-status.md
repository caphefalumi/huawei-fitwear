<!--
  Title: Querying the Workout Status
  Catalog: huaweihealth-Guides
  Document ID: query-exercise-status-0000002482700877
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-exercise-status-0000002482700877
-->
# Querying the Workout Status

This section describes how to query the workout status. Wearables support multiple workout types. After a user starts a workout while wearing a wearable with the Workout app launched, industry apps can call the corresponding API to query the workout status of the user.

> **Note:** This feature is not supported when a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) is in the ultra-long battery life mode. Querying workout status is not supported on HUAWEI WATCH H7556.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the workout status. 
```cpp
{
    "item": "exerciseStatus"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the workout status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the workout status.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "exerciseStatus");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the workout status.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the workout status is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The workout status is carried in **result** when the query is successful. 
```cpp
result example:
{
    "exerciseStatus":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| exerciseStatus | For details, please refer to [Workout Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sport-status-enumeration-0000002338268622). | Workout status. |
