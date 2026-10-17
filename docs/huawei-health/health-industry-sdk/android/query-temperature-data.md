<!--
  Title: Querying Body Temperature Data
  Catalog: huaweihealth-Guides
  Document ID: query-temperature-data-0000002342714356
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-temperature-data-0000002342714356
-->
# Querying Body Temperature Data

This section describes how to query the body temperature measured by a wearable. After a user measures their body temperature, industry apps can call the corresponding API to query the body temperature data recorded on the wearable.

> **Note:** This API is restricted to wearables that support body temperature measurement. Concurrent query of body temperature data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying body temperature data. 
```cpp
{
    "item": "temperatureData",
    "value": {
        "startTime": 1992342222, // Unit: second
        "endTime": 1992342229 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying body temperature data. |
| endTime | UTC timestamp, in seconds | End time for querying body temperature data. Note: The time interval between the start time and end time must be no more than 24 hours. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query body temperature data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying body temperature data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    jsonObject.put("item", "temperatureData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query body temperature data.
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
| result | - | If the API call succeeds, body temperature data is returned. If the API call fails, an error message is returned. If multiple measurements are performed within one minute, the average value of the measurement results is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The body temperature data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "temperatureData",
  "totalCount": 1,
  "index": 0,
  "count": 1,
  "dataList": [
    {
      "startTime": 1657158420,
      "bodyTemperature": 36.7,
      "skinTemperature": 31.8
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | temperatureData | Body temperature data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time, in seconds. |
| bodyTemperature | Data of the double type, ranging from 34.0 to 42.0 | Body temperature (unit: °C). |
| skinTemperature | Data of the double type, ranging from 20.0 to 42.0 | Skin temperature (unit: °C). |
