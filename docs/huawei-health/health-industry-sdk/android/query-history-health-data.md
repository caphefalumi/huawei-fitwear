<!--
  Title: Querying the Step Count History
  Catalog: huaweihealth-Guides
  Document ID: query-history-health-data-0000002376552473
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-history-health-data-0000002376552473
-->
# Querying the Step Count History

This section describes how to query the step count history from a wearable. After a user walks while wearing the wearable, industry apps can call the corresponding API to query the step count recorded on the wearable.

> **Note:** Concurrent query of step count history records is not supported. You must wait for the previous query to complete before initiating a new one. Avoid calling this API when you are querying daily activity data or daily activity status data. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the step count history. 
```cpp
{
    "item":"historyHealthData",
    "value":
    {
        "startTime":1644796800,
        "endTime":1644811200,
        "dataType":["total","detail"]
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying the step count history. |
| endTime | UTC timestamp, in seconds | End time for querying the step count history. |
| dataType | Array of at least one element. Optional elements: • total • detail | Type of the step count data to be queried. • **total**: total data • **detail**: detailed data |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours and should be no less than 1 minute, and that between the start time and current time should be no more than 7 days. When only **total** is selected for **dataType**, the total number of steps in the queried time period is returned. When only **detail** is selected for **dataType**, the timestamps and the number of steps corresponding to the timestamps are returned. When both **total** and **detail** are selected for **dataType**, the total number of steps, timestamps, and number of steps corresponding to the timestamps are all returned.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the step count history. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying historical step count data.
JSONObject jsonObject = new JSONObject();
try {
    JSONArray jsonArray = new JSONArray();
    jsonArray.put("total");
    jsonArray.put("detail");
    JSONObject valueObject = new JSONObject();
    valueObject.put("startTime", 1644796800);
    valueObject.put("endTime", 1644811200);
    valueObject.put("dataType", jsonArray);
    jsonObject.put("item", "historyHealthData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query historical step count data.
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
| result | - | If the API call succeeds, the step count history is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The historical step count data is carried in **result** when the query is successful. 
```cpp
result example:
When total is selected for dataType:
{
    "dataType":"total",
    "step":579
}

When detail is selected for dataType:
{
    "dataType":"detail",
    "totalCount":579,
    "index":6,
    "count":6,
    "dataList":[{
        "startTime":1644796800,
        "step":79
    },{
        ...
    }]
}

When both total and detail are selected for dataType:
{
    "dataType":"total",
    "step":579
}
{
    "dataType":"detail",
    "totalCount":579,
    "index":6,
    "count":6,
    "dataList":[{
        "startTime":1644796800,
        "step":79
    },{
        ...
    }]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | "total" | Data summary. |
| "detail" | Data details. |  |
| step | Data of the int type | Total number of steps. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | Fields included: **startTime** and **step** | Data list. Fields vary depending on the data type. |
| startTime | Data of the long type | Start timestamp of the current data point (UTC time in seconds). |
| step | Data of the int type | Number of steps corresponding to the timestamp. |
 > **Note:** Historical step count data is returned by data type passed for query. Data of each data type will be delivered via its own dedicated callback. If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
