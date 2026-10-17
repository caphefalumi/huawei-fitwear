<!--
  Title: Querying Daily Activity Data
  Catalog: huaweihealth-Guides
  Document ID: query-daily-health-data-0000002376672361
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-daily-health-data-0000002376672361
-->
# Querying Daily Activity Data

This section describes how to query daily activity data from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity data recorded on the wearable.

> **Note:** Concurrent query of daily activity data records is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying step count history or for querying daily activity status data. You must wait for the previous query to complete before initiating a new one. This API can be used together with the API for [subscribing to daily activity data updates](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-daily-health-update-event-0000002376715109). When daily activity data is updated and you have subscribed to such updates, you can call this API to query the updated activity data.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying daily activity data. 
```cpp
{
    "item":"dailyHealthData",
    "value":
    {
        "startTime":1644796800,
        "endTime":1644811200,
        "subscribeId":"3fc65203-dc4c-49d8-a436-71a8ceaffbff",
        "dataType":["fitness"]
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
| (Optional) subscribeId | Subscription ID returned by the API for [subscribing to daily activity data updates](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-daily-health-update-event-0000002376715109). | Subscription ID. |
| dataType | ["fitness"] | Daily activity data type. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours and should be no less than 1 minute, and that between the start time and current time should be no more than 7 days. It is recommended that the start time be at least 5 minutes earlier than the current time. Otherwise, the workout intensity data returned may be inaccurate. If **subscribeId** is left empty or set to an empty string, data in the time range specified by **startTime** and **endTime** will be queried; if **subscribeId** is set to a valid value, the intersection of the time range specified by the subscription duration corresponding to **subscribeId** and that specified by **startTime** and **endTime** will be used for query. If no such intersection exists, the query fails.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query daily activity data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying daily activity data.
JSONObject jsonObject = new JSONObject();
try {
    JSONArray jsonArray = new JSONArray();
    jsonArray.put("fitness");
    JSONObject valueObject = new JSONObject();
    valueObject.put("startTime", 1644796800);
    valueObject.put("endTime", 1644811200);
    // subscribeId is optional if you have made no subscription.
    valueObject.put("subscribeId", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
    valueObject.put("dataType", jsonArray);
    jsonObject.put("item", "dailyHealthData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query daily activity data.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, daily activity data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The daily activity data is carried in **result** when the query is successful. 
```cpp
result example:
{
    "dataType": "fitness",
    "totalCount": 30,
    "index": 0,
    "count": 30,
    "dataList": [{
        "startTime": 1644544380,
        "step": 30,
        "calorie": 200,
        "distance": 5,
        "height": 0,
        "restingHeartRate": 68,
        "exerciseIntensity": 0
    },{
        ...
    }]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | fitness | Daily activity data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | Data of the long type | Start timestamp of the current data point (UTC time in seconds). |
| step | Data of the int type | Step count. |
| calorie | Data of the int type | Calories burned (cal). |
| distance | Data of the int type | Distance, in meters. |
| height | Data of the int type | Height, in decimeters. |
| restingHeartRate | Data of the int type | Resting heart rate. |
| exerciseIntensity | Data of the int type | Workout intensity. For details, please refer to [Table 4](#EN-US_TOPIC_0000002647924554__table1144284415323). |
 
| Value of exerciseIntensity | Description |
| --- | --- |
| 0 | Unspecified or low intensity. Note: This value is used if the workout intensity is not specified. |
| 1 | Moderate-to-high intensity. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
