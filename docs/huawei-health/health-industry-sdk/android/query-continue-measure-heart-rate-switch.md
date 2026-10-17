<!--
  Title: Querying the Continuous Heart Rate Monitoring Mode
  Catalog: huaweihealth-Guides
  Document ID: query-continue-measure-heart-rate-switch-0000002372259081
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-continue-measure-heart-rate-switch-0000002372259081
-->
# Querying the Continuous Heart Rate Monitoring Mode

This section describes how to query the continuous heart rate monitoring mode of a wearable, which is enabled by default (smart mode) after the wearable is connected for the first time.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the continuous heart rate monitoring mode. 
```cpp
{
    "item": "continueMeasureHeartRateSwitch"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the continuous heart rate monitoring mode. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the continuous heart rate monitoring mode.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "continueMeasureHeartRateSwitch");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the continuous heart rate monitoring mode.
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
| result | - | If the API call succeeds, the continuous heart rate monitoring mode is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The continuous heart rate monitoring mode is carried in **result** when the query is successful. 
```cpp
data example:
{
    "continueMeasureHeartRateSwitch":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| continueMeasureHeartRateSwitch | 0 | Continuous heart rate monitoring disabled. |
| 1 | Continuous heart rate monitoring (smart mode) enabled. |  |
| 2 | Continuous heart rate monitoring (real-time mode) enabled. |  |
