<!--
  Title: Querying Blood Pressure Data
  Catalog: huaweihealth-Guides
  Document ID: query-blood-pressure-data-0000002342554544
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-blood-pressure-data-0000002342554544
-->
# Querying Blood Pressure Data

This section describes how to query the blood pressure data of a wearable. After a user measures their blood pressure, industry apps can call the corresponding API to query the blood pressure data recorded on the wearable.

> **Note:** This API is restricted to wearables that support blood pressure measurement. Currently, HUAWEI WATCH B9-D10 and HUAWEI WATCH H9D20 are supported. This API can be used together with the API for [subscribing to blood pressure data updates](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-blood-pressure-update-event-0000002342597334). When blood pressure data is updated and you have subscribed to such updates, you can call this API to query the updated blood pressure data. Concurrent query of blood pressure data is not supported. You must wait for the previous query to complete before initiating a new one. A maximum of 60 blood pressure data records can be returned for HUAWEI WATCH B9-D10.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying blood pressure data. 
```cpp
{
    "item": "bloodPressure",
    "value": {
        "startTime": 1992342222, // Unit: second
        "endTime": 1992342229 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying blood pressure records. |
| endTime | UTC timestamp, in seconds | End time for querying blood pressure records. Note: The time interval between the start time and end time must be no more than 24 hours. |
| (Optional) subscribeId | Subscription ID returned by the API for [subscribing to blood pressure data updates](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-blood-pressure-update-event-0000002342597334) | Subscription ID. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours. If **subscribeId** is left empty or set to an empty string, data in the time range specified by **startTime** and **endTime** will be queried; if **subscribeId** is set to a valid value, the intersection of the time range specified by the subscription duration (accurate to minutes, for example, **0900**) corresponding to **subscribeId** and that specified by **startTime** and **endTime** will be used for query. If no such intersection exists, the query fails.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query blood pressure data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying blood pressure data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    jsonObject.put("item", "bloodPressure");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query blood pressure data.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, blood pressure data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The blood pressure data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "bloodPressure",
  "totalCount": 1,
  "index": 0,
  "count": 1,
  "dataList": [
    {
      "startTime": 1657158434,
      "systolic": 96,
      "diastolic": 62,
      "sphygmus": 65
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | bloodPressure | Blood pressure data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Time when the blood pressure data is recorded, in seconds. |
| systolic | Data of the int type | Systolic pressure (unit: mmHg). |
| diastolic | Data of the int type | Diastolic pressure (unit: mmHg). |
| sphygmus | Data of the int type | Heart rate (unit: bpm). |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback, so you do not need to call the query API again. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
