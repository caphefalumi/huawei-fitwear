<!--
  Title: Querying the Maximum Workout Heart Rate
  Catalog: huaweihealth-Guides
  Document ID: query-max-heart-rate-0000002372259077
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-max-heart-rate-0000002372259077
-->
# Querying the Maximum Workout Heart Rate

This section describes how to query the maximum workout heart rate (unit: beats/min) on a wearable. If no heart rate configuration API has been called earlier (to set the basic user information, maximum workout heart rate, or heart rate zones), result code **9** will be returned for the maximum workout heart rate query.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the maximum workout heart rate. 
```cpp
{
    "item": "maxHeartRate"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the maximum workout heart rate. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the maximum workout heart rate.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "maxHeartRate");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the maximum workout heart rate.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 6, 7, 9 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the maximum workout heart rate is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The maximum heart rate during workout (beats/min) is carried in **result** when the query is successful. 
```cpp
result example:
{
    "maxHeartRate":180
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| maxHeartRate | For details, please refer to the options of **settingValue** in [Setting the Maximum Workout Heart Rate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-max-heart-rate-0000002372218949). | Maximum workout heart rate. |
