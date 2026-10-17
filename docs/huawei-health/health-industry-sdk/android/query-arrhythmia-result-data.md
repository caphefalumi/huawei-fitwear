<!--
  Title: Querying Pulse Wave Arrhythmia Detection Result Data
  Catalog: huaweihealth-Guides
  Document ID: query-arrhythmia-result-data-0000002527189498
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-arrhythmia-result-data-0000002527189498
-->
# Querying Pulse Wave Arrhythmia Detection Result Data

This section describes how to query pulse wave arrhythmia detection result data based on the pulse wave arrhythmia analysis capability of a wearable. After a user completes pulse wave arrhythmia detection for result analysis, industry apps can call the corresponding API to query the detection result data recorded on the wearable.

> **Note:** To successfully retrieve pulse wave arrhythmia detection result data, it is recommended that pulse wave arrhythmia analysis be performed at least once within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of pulse wave arrhythmia detection result data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying pulse wave arrhythmia detection result data. 
```cpp
{
  "item": "arrhythmiaResultData",
  "value": {
    "startTime": 1725193422, // Unit: second
    "endTime": 1725452622 // Unit: second
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying pulse wave arrhythmia detection result data. |
| endTime | UTC timestamp, in seconds | End time for querying pulse wave arrhythmia detection result data. |
 > **Note:** Parameter requirements of the API for querying pulse wave arrhythmia detection result data: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The time interval between the query start time and current time cannot exceed 7 days (excluding the current day).
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query pulse wave arrhythmia detection result data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying pulse wave arrhythmia detection result data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1725193422);
    valueObject.put("endTime", 1725452622);
    jsonObject.put("item", "arrhythmiaResultData");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query pulse wave arrhythmia detection result data.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 7, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the pulse wave arrhythmia detection result data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The pulse wave arrhythmia detection result data is carried in **result** when the query is successful. 
```cpp
result example:
[{
    "dataType": "arrhythmiaResultData",
    "totalCount": 3,
    "dataList": {
        "startTime": 1736586113,
        "ppgIrregularHeartbeat": 2
        "saveTime": 1736586113,
        "measureType": 1,
    }
},
{
    "dataType": "arrhythmiaResultData",
    "dataList": {
        "startTime": 1736585902,
        "ppgIrregularHeartbeat": 4
        "saveTime": 1736585902,
        "measureType": 1,
    }
},...
]
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | arrhythmiaResultData | Data type (pulse wave arrhythmia detection result). |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time. |
| ppgIrregularHeartbeat | Data of the int type | Pulse wave arrhythmia analysis result. • **1**: no abnormality detected • **2**: suspected premature beats • **3**: suspected AFib • **4**: irregular heart rhythm - potential AFib risk • **5**: irregular heart rhythm - potential premature beats risk |
| saveTime | UTC time, in seconds | Time when the pulse wave arrhythmia detection result data is saved. |
| measureType | Data of the int type | Measurement type. • **0**: automatic measurement • **1**: active measurement |
