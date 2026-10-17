<!--
  Title: Querying the Daily Activity Status
  Catalog: huaweihealth-Guides
  Document ID: query-fitness-status-0000002376552485
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-fitness-status-0000002376552485
-->
# Querying the Daily Activity Status

This section describes how to query the daily activity status from a wearable. After a user engages in daily activities when wearing a wearable, industry apps can call the corresponding API to query the daily activity status and the corresponding activity duration recorded on the wearable.

> **Note:** Concurrent query of daily activity status records is not supported. You must wait for the previous query to complete before initiating a new one. Avoid calling this API when you are querying daily activity data or step count history. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the daily activity status. 
```cpp
{
    "item":"fitnessStatus",
    "value":
    {
        "startTime":1678671036,
        "endTime":1678696236
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying the activity status. |
| endTime | UTC timestamp, in seconds | End time for querying the activity status. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours and should be no less than 1 minute, and that between the start time and current time should be no more than 7 days. You are advised to pass the start time and end time as second-level timestamps aligned to whole minutes. The duration of the activity status is measured in minutes.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the daily activity status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the daily activity status.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject = new JSONObject();
    valueObject.put("startTime", 1678671036);
    valueObject.put("endTime", 1678696236);
    jsonObject.put("item", "fitnessStatus");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the daily activity status.
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
| result | - | If the API call succeeds, the activity status is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The daily activity status data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "fitnessStatus",
  "totalCount": 4,
  "index": 0,
  "count": 4,
  "dataList": [
    {
      "statusType": 1,
      "startTime": 1678434120,
      "duration": 1
    },
    ...
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | fitnessStatus | Daily activity status flag. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | Fields included: **statusType**, **startTime**, and **duration** | Detailed data information list. |
| statusType | Data of the int type. For details, please refer to [Daily Activity Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/daily-activity-status-enumeration-0000002372186769). | Activity status type. |
| startTime | Data of the long type | Start timestamp of the current data point (UTC time in seconds). |
| duration | Data of the int type | Duration of the activity status, in minutes. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
