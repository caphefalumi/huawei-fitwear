<!--
  Title: Querying Emotional Wellbeing Data
  Catalog: huaweihealth-Guides
  Document ID: query-emotion-data-0000002557722765
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-emotion-data-0000002557722765
-->
# Querying Emotional Wellbeing Data

This section describes how to query the emotional wellbeing data on a wearable. After a user assesses their emotions with a wearable, industry apps can call the corresponding API to query the emotion data recorded on the wearable.

> **Note:** This API is restricted to wearables that support emotion assessment. Enable the [stress test switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-stress-auto-monitor-switch-0000002417316317) on a wearable that supports emotion assessment before performing emotion assessment. Concurrent query of emotion data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying emotion data. 
```cpp
{
    "item": "emotionData",
    "value": {
        "startTime": 1992342222, // Unit: second
        "endTime": 1992342229 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying emotion records. |
| endTime | UTC timestamp, in seconds | End time for querying emotion records. |
 > **Note:** The time interval between the query start time and end time must not exceed 24 hours. The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The time interval between the query start time and current time cannot exceed 7 days (excluding the current day).
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query emotion data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying emotion data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    jsonObject.put("item", "emotionData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query emotion data.
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
| result | - | If the API call succeeds, emotion data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The emotion data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "emotionData",
  "totalCount": 1,
  "dataList": [
    {
      "startTime": 1657158420,
      "emotionStatus": 2,
      "valenceCharacter": 59.87324142456055,
      "arousalCharacter": 9.810883522033691,
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | emotionData | Emotion data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time, in seconds. |
| emotionStatus | Data of the int type | Emotion value. • **1**: negative emotions, such as unpleasant • **2**: neutral emotions, such as calm • **3**: positive emotions, such as pleasant |
| valenceCharacter | Data of the double type | Valence feature, representing the valence dimension of human emotions. A lower value indicates a more negative emotion, and a higher value indicates a more positive emotion. The value ranges from 0 to 100. |
| arousalCharacter | Data of the double type | Arousal feature, representing the physiological activation level of a person. A larger value indicates greater activation. The value ranges from 0 to 100. |
