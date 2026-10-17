<!--
  Title: Querying Health Glance Reports
  Catalog: huaweihealth-Guides
  Document ID: query-health-glance-report-0000002527074956
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-health-glance-report-0000002527074956
-->
# Querying Health Glance Reports

This section describes how to query Health Glance reports from wearables providing the Health Glance capability. After a user wears a wearable and completes measurement in the Health Glance app, industry apps can call the corresponding API to query the Health Glance report data generated on the wearable.

> **Note:** This API is restricted to wearables that support Health Glance. Concurrent query of Health Glance report data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying Health Glance report data. 
```cpp
{
  "item": "healthGlanceReport",
  "value": {
    "startTime": 1773126000, // Unit: second
    "endTime": 1773129600 // Unit: second
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying Health Glance report data. |
| endTime | UTC timestamp, in seconds | End time for querying Health Glance report data. |
 The time interval between the start time and end time for data query cannot exceed 24 hours.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query Health Glance report data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying Health Glance report data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1773126000);
    valueObject.put("endTime", 1773129600);
    jsonObject.put("item", "healthGlanceReport");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query Health Glance report data.
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
| result | - | If the API call succeeds, Health Glance report data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The Health Glance report data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "healthGlanceReport",
  "totalCount": 1,
  "index": 0,
  "count": 1,
  "dataList": [
    {
      "startTime": 1773199123,
      "averageHeartRate": 82,
      "hrv": 300,
      "hrvTimestamp": 0,
      "bloodOxygen": 98,
      "bodyTemperature": 33.3,
      "stress": 50,
      "emotionStatus": 100,
      "emotionTimestamp": 0,
      "heartType": 0,
      "heartResult": 1,
      "arrhythmiaTotal": 0,
      "arrhythmiaRule": 0,
      "arrhythmiaAfPrem": 0,
      "arrhythmiaAfAtrial": 0,
      "sleepApneaGrade": 0,
      "sleepApneaTimestamp": 0,
      "systolicPressure": 65535,
      "diastolicPressure": 65535,
      "bpHeartRate": 0
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | healthGlanceReport | Data type (Health Glance report data). |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | Data of the long type | Start time, in seconds. |
| averageHeartRate | Data of the int type | Average heart rate, in beats per minute. |
| hrv | Data of the int type | HRV, in milliseconds. The value ranges from 0 to 300. The value **300** indicates an invalid value. |
| hrvTimestamp | Data of the long type | Timestamp of HRV data generation, in seconds. The value range is [0, ∞). The default value is **0**. |
| bloodOxygen | Data of the int type | SpO2. |
| bodyTemperature | Data of the double type | Body temperature (unit: °C). |
| skinTemperature | Data of the double type | Skin temperature (unit: °C). |
| stress | Data of the int type | Stress. The value range is [0, ∞). |
| emotionStatus | Data of the int type | Emotional state. The value range is [0, 100]. • **1**: negative emotions, such as unpleasant • **2**: neutral emotions, such as calm • **3**: positive emotions, such as pleasant • **100**: invalid value |
| emotionTimestamp | Data of the long type | Timestamp of emotion data generation, in seconds. The value range is [0, ∞). The default value is **0**. |
| heartType | Data of the int type | Heart rhythm measurement type. The value range is [0, ∞). • **0**: EGC • **1**: pulse wave |
| heartResult | Data of the int type | Heart rhythm measurement result. The value range is [0, ∞). When **heartType** is **0**: • **1**: sinus rhythm • **2**: atrial premature beats • **4**: ventricular premature beats • **8**: AFib When **heartType** is **1**: • **1**: no abnormality detected • **2**: suspected premature beats • **3**: suspected AFib |
| arrhythmiaTotal | Data of the int type | Total number of pulse wave arrhythmia detections. |
| arrhythmiaRule | Data of the int type | Number of pulse wave arrhythmia detections with no abnormality detected. |
| arrhythmiaAfPrem | Data of the int type | Number of pulse wave arrhythmia detections with a result of suspected premature beats. |
| arrhythmiaAfAtrial | Data of the int type | Number of pulse wave arrhythmia detections with a result of suspected AFib. |
| sleepApneaGrade | Data of the int type | Sleep apnea detection result. The value range is [0, ∞). • **1**: normal • **2**: suspected low risk • **3**: suspected medium risk • **4**: suspected high risk |
| sleepApneaTimestamp | Data of the long type | Sleep apnea detection timestamp, in seconds. The value range is [0, ∞). The default value is **0**. |
| systolicPressure | Data of the double type | Systolic pressure, in mmHg. The value range is [0, ∞). The value **65535** indicates an invalid value. |
| diastolicPressure | Data of the double type | Diastolic pressure, in mmHg. The value range is [0, ∞). The value **65535** indicates an invalid value. |
| bpHeartRate | Data of the int type | Pulse recorded during blood pressure measurement, in beats per minute. |
