<!--
  Title: Querying Raw Pulse Wave Arrhythmia Data
  Catalog: huaweihealth-Guides
  Document ID: query-arrhythmia-ppg-data-0000002560673099
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-arrhythmia-ppg-data-0000002560673099
-->
# Querying Raw Pulse Wave Arrhythmia Data

This section describes how to query raw pulse wave arrhythmia data.

> **Note:** Arrhythmia data is generated only after automatic arrhythmia detection is enabled or active pulse wave arrhythmia analysis is performed. This API is restricted to wearables that support pulse wave arrhythmia analysis.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying raw arrhythmia data. 
```cpp
{
  "item": "arrhythmiaPpgData",
  "value": {
    "startTime": 1725193422, // Unit: second
    "endTime": 1725452622 // Unit: second
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
 > **Note:** The query end time cannot be later than the current time. The interval between the query start time and the current time cannot exceed 7 days.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the raw pulse wave arrhythmia data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct a JSON object for querying the raw pulse wave arrhythmia data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1725193422);
    valueObject.put("endTime", 1725452622);
    jsonObject.put("item", "arrhythmiaPpgData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the raw pulse wave arrhythmia data.
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
| result | - | If the API call succeeds, the raw pulse wave arrhythmia data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The raw arrhythmia data is carried in **result** when the query is successful. 
```cpp
Example data:
{
    "dataType": "arrhythmiaPpgData",
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [
        {
            "startTime": 1773633275,
            "endTime": 1773633275,
            "waveClass": "060101010101010101010101010101010101010101010101010101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "rriArray": "380438043804C003100438043804C003E803E803C00360048804100460046004E80310043804C003C00338041004100438048804E80338043804E80310043804E80338043804E80310043804C003E803C003C003C003C00398030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009C017FF6FC7B",
            "rriArrayLen": 45,
            "firstValley": 1
        }
    ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | arrhythmiaPpgData | Data type (raw pulse wave arrhythmia data). |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | Data of the long type | Start time, in seconds. |
| endTime | Data of the long type | End time, in seconds. |
| waveClass | Data of the String type | Waveform type. |
| rriArray | Data of the String type | Peak point information (peak-to-peak distance). |
| rriArrayLen | Data of the int type | Length of peak point information in **rriArray**. |
| firstValley | Data of the int type | Amplitude of the first peak point. |
| accStatus | Data of the String type | Status of accelerometer data. |
