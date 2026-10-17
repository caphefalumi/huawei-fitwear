<!--
  Title: Querying the Resting Calorie Consumption of the Current Day
  Catalog: huaweihealth-Guides
  Document ID: query-today-resting-calories-0000002527135670
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-today-resting-calories-0000002527135670
-->
# Querying the Resting Calorie Consumption of the Current Day

This section describes how industry apps use the corresponding capability to query the resting calorie consumption data of the current day recorded on a wearable.

> **Note:** Before using this API, the Stay Fit app needs to be started on the wearable. If the app is not opened, the wearable will not generate any related data. This API returns the resting calorie consumption data of the current day starting at 00:00:00 and ending at the query time (including the resting calorie consumption after workouts). It is normal that the resting calorie consumption value returned by this API differs from the value displayed in the Stay Fit app on the wearable by 1–2 kcal. Concurrent query of resting calorie consumption data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the resting calorie consumption data of the current day. 
```cpp
{
    "item":"todayRestingCalories"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the resting calorie consumption data of the current day. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the resting calorie consumption data of the current day.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "todayRestingCalories");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the resting calorie consumption data of the current day.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the resting calorie consumption data of the current day is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The resting calorie consumption data of the current day is carried in **result** when the query is successful. 
```cpp
result example:
{
  "timestamp": 1678434120,
  "todayRestingCalories": 1180
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| timestamp | Data of the long type | Data cutoff time, in seconds (UTC time). |
| todayRestingCalories | Data of the int type | Resting calories consumed on the current day, in kcal. |
