<!--
  Title: Querying SpO2 Data
  Catalog: huaweihealth-Guides
  Document ID: query-spo2-data-0000002532229812
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-spo2-data-0000002532229812
-->
# Querying SpO2 Data

This section describes how to query the SpO2 data of a wearable. After a user measures their SpO2, industry apps can call the corresponding API to query the SpO2 data recorded on the wearable.

> **Note:** Concurrent query of SpO2 from the same device is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying step count history or for querying daily activity status data. You must wait for the previous query to complete before initiating a new one. Before calling this API to query SpO2 data, ensure that automatic SpO2 measurement is enabled. Otherwise, empty data will be returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying SpO2 data. 
```cpp
{
    "item":"dailyHealthData",
    "value":
    {
        "startTime":1644796800,
        "endTime":1644811200,
        "dataType":["spo2"]
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying SpO2 data. |
| endTime | UTC timestamp, in seconds | End time for querying SpO2 data. |
| dataType | ["spo2"] | SpO2 data type. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours and should be no less than 1 minute, and that between the start time and current time should be no more than 7 days. It is recommended that the query start time be at least 5 minutes earlier than the current time. Otherwise, the data returned may be inaccurate.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query SpO2 data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying SpO2 data.
JSONObject jsonObject = new JSONObject();
try {
    JSONArray jsonArray = new JSONArray();
    jsonArray.put("spo2");
    JSONObject valueObject = new JSONObject();
    valueObject.put("startTime", 1644796800);
    valueObject.put("endTime", 1644811200);
    valueObject.put("dataType", jsonArray);
    jsonObject.put("item", "dailyHealthData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query SpO2 data.
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
| result | - | If the API call succeeds, SpO2 data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The SpO2 data is carried in **result** when the query is successful. 
```cpp
result example:
{
    "dataType": "spo2",
    "totalCount": 5,
    "index": 0,
    "count": 5,
    "dataList": [{
        "startTime": 1644544380,
        "spo2": 98
    },{
        ...
    }]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | spo2 | SpO2 data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time, in seconds. |
| spo2 | Data of the int type | SpO2. The value **99** indicates that the SpO2 is 99%. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
