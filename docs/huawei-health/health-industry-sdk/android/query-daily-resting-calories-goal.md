<!--
  Title: Querying the Daily Resting Calorie Consumption Target
  Catalog: huaweihealth-Guides
  Document ID: query-daily-resting-calories-goal-0000002558295467
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-daily-resting-calories-goal-0000002558295467
-->
# Querying the Daily Resting Calorie Consumption Target

This section describes how to query the daily resting calorie consumption target data. A wearable provides the weight management capability, encompassing features like calorie deficit assessment, calorie consumption monitoring, and calorie intake recording. Industry apps can use this capability to query the daily resting calorie consumption target data recorded on the wearable.

> **Note:** Before using this API, the Stay Fit app needs to be started on the wearable. If the app is not opened, the wearable will not generate any related data. Resting calorie data is generated daily starting at 00:00:00. Therefore, the query start time must be 00:00:00. This API returns the **daily resting calorie consumption target** (including post-workout resting calorie data if a workout occurs). Concurrent query of resting calorie consumption target data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the daily resting calorie consumption target. 
```cpp
{
    "item":"dailyRestingCaloriesGoal",
    "value":
    {
        "startTime":1773158400,
        "endTime":1773213674
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
 > **Note:** The time interval between the start time for querying data and the current time cannot exceed 7 days (excluding the current day), and the end time cannot be later than the current timestamp.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the daily resting calorie consumption target. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the daily resting calorie consumption target.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject = new JSONObject();
    valueObject.put("startTime", 1773158400);
    valueObject.put("endTime", 1773213674);
    jsonObject.put("item", "dailyRestingCaloriesGoal");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the daily resting calorie consumption target.
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
| result | - | If the API call succeeds, the daily resting calorie consumption target data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The daily resting calorie consumption target data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "dailyRestingCaloriesGoal",
  "totalCount": 4,
  "index": 0,
  "count": 4,
  "dataList": [
    {
      "startTime": 1678434120,
      "dailyRestingCaloriesGoal": 1817
    },
    ...
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | dailyRestingCaloriesGoal | Data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | Fields included: **startTime** and **dailyRestingCaloriesGoal** | Detailed data information list. |
| startTime | Data of the long type | UTC timestamp when data is generated, in seconds. |
| dailyRestingCaloriesGoal | Data of the int type | Daily resting calorie consumption target, in kcal. |
