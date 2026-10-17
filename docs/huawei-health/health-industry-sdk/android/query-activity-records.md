<!--
  Title: Querying Activity Records
  Catalog: huaweihealth-Guides
  Document ID: query-activity-records-0000002417387525
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-activity-records-0000002417387525
-->
# Querying Activity Records

This section describes how to query activity records on a wearable. Activity data includes active calories, exercise duration, hours active, and their corresponding goals.

> **Note:** Concurrent query of activity records is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying activity records. 
```cpp
{
    "item": "activityRecords",
    "value": {
        "startTime": "1685341304",
        "endTime": "1685686904",
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying activity records. Only the year, month, and date will be used and then converted to the 00:00:00 timestamp of the day. |
| endTime | UTC timestamp, in seconds | End time for querying activity records. Only the year, month, and date will be used and then converted to the 23:59:59 timestamp of the day. |
 > **Note:** Only the year, month, and date will be used for querying data because each data record returned by the wearable is the data of the whole day. The end time for data query cannot be later than the end of the current day. The time interval between the query start time and current time cannot exceed 7 days (including the current day).
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query activity records. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying activity records.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "activityRecords");
    valueObject.put("startTime", "1685341304");
    valueObject.put("endTime", "1685686904");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query activity records.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 6, 7, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, activity records are returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The activity records are carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "activityRecords",
  "totalCount": 3,
  "dataList": [
    {
      "startTime": 1724083200,
      "endTime": 1724169599,
      "calories": 0,
      "exerciseDuration": 0,
      "standHours": 0,
      "caloriesGoal": 270000,
      "exerciseDurationGoal": 25,
      "standHoursGoal": 12
    },
    {
      "startTime": 1724169600,
      "endTime": 1724255999,
      "calories": 4598,
      "exerciseDuration": 0,
      "standHours": 2,
      "caloriesGoal": 270000,
      "exerciseDurationGoal": 25,
      "standHoursGoal": 12
    },
    {
      "startTime": 1724256000,
      "endTime": 1724257588,
      "calories": 25244,
      "exerciseDuration": 0,
      "standHours": 4,
      "caloriesGoal": 270000,
      "exerciseDurationGoal": 25,
      "standHoursGoal": 12
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | activityRecords | Activity record data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time for querying data on the specific day, in seconds. |
| endTime | UTC time, in seconds | End time for querying data on the specific day, in seconds. |
| calories | Data of the int type | Active calories (cal). |
| exerciseDuration | Data of the int type | Workout duration, in minutes. |
| standHours | Data of the int type | Hours active. |
| caloriesGoal | Data of the int type | Target number of active calories (cal). |
| exerciseDurationGoal | Data of the int type | Target workout duration, in minutes. |
| standHoursGoal | Data of the int type | Target number of hours active. |
 > **Note:** One activity record is returned every day. The returned data value is the accumulated value on that day. For an activity record not of the current day, the start time of the returned data is 00:00:00 and the end time is 23:59:59 of that day. For the activity record of the current day, the start time of the returned data is 00:00:00 of the current day and the end time is the current system time. If the wearable disconnects and its target value is changed, an activity or workout needs to be performed before querying the target value.
