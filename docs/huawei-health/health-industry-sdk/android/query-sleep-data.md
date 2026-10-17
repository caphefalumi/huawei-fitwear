<!--
  Title: Querying Sleep Data
  Catalog: huaweihealth-Guides
  Document ID: query-sleep-data-0000002342554556
  Updated: 2026-08-05 02:10:30
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-sleep-data-0000002342554556
-->
# Querying Sleep Data

This section describes how to query sleep data. Wearables can monitor sleep and breathing data in real time. When a user falls asleep (nighttime sleep or nap) while wearing a wearable, industry apps can call the corresponding API to query recorded sleep data.

> **Note:** Querying sleep data is only supported on HUAWEI Band HA580, HUAWEI Band HA590, HUAWEI Band HA5A0, HUAWEI WATCH H7546, HUAWEI WATCH H7556, HUAWEI WATCH H5546, HUAWEI WATCH H5556, HUAWEI WATCH H5756, HUAWEI WATCH H3540, and HUAWEI WATCH H9D20. To collect sleep data, ensure that TruSleep has been enabled on the wearable through the API for [setting the TruSleep switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-trusleep-switch-0000002338300784) and the wearable has sleep data. Due to the large amount of data, sleep data can only be queried from one wearable at a time. A single wearable does not support multiple simultaneous queries. Please wait until the current query has finished before starting another. To collect sleep data, it is recommended that the wearable be worn and the sleep duration be longer than three hours (excluding naps). Otherwise, the wearable may return empty data.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying sleep data. 
```cpp
{
    "item": "sleepData",
    "value": {
        "startTime": 1685341304, // Unit: second
        "endTime": 1685686904 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying sleep data. |
| endTime | UTC timestamp, in seconds | End time for querying sleep data. |
 > **Note:** The interval between the query start time and the current time should be no more than 7 days.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query sleep data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying sleep data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1685341304);
    valueObject.put("endTime", 1685686904);
    jsonObject.put("item", "sleepData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query sleep data.
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
| result | - | If the API call succeeds, sleep data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The sleep data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "sleepData",
  "totalCount": 2,
  "index": 0,
  "count": 2,
  "dataList": [
    {
      "fallAsleepTime": 1685376180,
      "wakeupTime": 1685399040,
      "sleepScore": 80,
      "sleepEfficiency": 100,
      "deepSleepPart": 55,
      "snoreFreq": 2,
      "avgHeartRate": 61,
      "minHearRateBaseline": -1,
      "maxHeartRateBaseline": -1,
      "heartRateDayToBaseline": 4,
      "avgOxygenSaturation": 97,
      "minOxygenSaturationBaseline": -1,
      "maxOxygenSaturationBaseline": -1,
      "oxygenSaturationDayToBaseline": 4,
      "avgBreathRate": 14,
      "minBreathRateBaseline": -1,
      "maxBreathRateBaseline": -1,
      "breathRateDayToBaseline": 4,
      "avgHrv": 62,
      "minHrvBaseline": -1,
      "maxHrvBaseline": -1,
      "hrvDayToBaseline": 4,
      "sleepDetail": [
        {
          "startTime": 1685387880,
          "sleepState": 1,
          "duration": 32
        },
        {
          "startTime": 1685389800,
          "sleepState": 3,
          "duration": 10
        }
      ]
    },
    {
      ...
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | sleepData | Sleep data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| fallAsleepTime | UTC time, in seconds | Fall-asleep time, in seconds. |
| wakeupTime | UTC time, in seconds | Wake-up time, in seconds. |
| sleepScore | Data of the int type | Sleep score, ranging from 0 to 100. |
| sleepEfficiency | Data of the int type | Sleep efficiency. |
| deepSleepPart | Data of the int type | Deep sleep continuity score. |
| snoreFreq | Data of the int type | Snoring frequency. |
| minHeartRate | Data of the int type | Minimum heart rate, in beats per minute. |
| maxHeartRate | Data of the int type | Maximum heart rate, in beats per minute. |
| minOxygenSaturation | Data of the double type | Minimum SpO2. |
| maxOxygenSaturation | Data of the double type | Maximum SpO2. |
| minBreathRate | Data of the double type | Minimum respiratory rate, in breaths per minute. |
| maxBreathRate | Data of the double type | Maximum respiratory rate, in breaths per minute. |
| avgHeartRate | Data of the int type | Average heart rate, in beats per minute. |
| minHearRateBaseline | Data of the int type | Lower limit of baseline heart rate, in beats per minute. |
| maxHeartRateBaseline | Data of the int type | Upper limit of baseline heart rate, in beats per minute. |
| heartRateDayToBaseline | Data of the int type | Number of days of wear required to evaluate the baseline heart rate. |
| avgOxygenSaturation | Data of the int type | Average SpO2. |
| minOxygenSaturationBaseline | Data of the int type | Lower limit of baseline SpO2. |
| maxOxygenSaturationBaseline | Data of the int type | Upper limit of baseline SpO2. |
| oxygenSaturationDayToBaseline | Data of the int type | Number of days of wear required to evaluate the baseline SpO2. |
| avgBreathRate | Data of the int type | Average respiratory rate, in breaths per minute. |
| minBreathRateBaseline | Data of the int type | Lower limit of baseline respiratory rate, in breaths per minute. |
| maxBreathRateBaseline | Data of the int type | Upper limit of baseline respiratory rate, in breaths per minute. |
| breathRateDayToBaseline | Data of the int type | Number of days of wear required to evaluate the baseline respiratory rate. |
| avgHrv | Data of the int type | Average HRV, in millisecond. |
| minHrvBaseline | Data of the int type | Lower limit of baseline HRV, in milliseconds. |
| maxHrvBaseline | Data of the int type | Upper limit of baseline HRV, in milliseconds. |
| hrvDayToBaseline | Data of the int type | Number of days of wear required to evaluate the baseline HRV. |
| sleepDetail | Data of the List type | Sleep status details. |
 Fields in **sleepDetail**: 
| Field | Value | Description |
| --- | --- | --- |
| startTime | UTC time, in seconds | Sleep start time. |
| duration | Data of the int type, in minutes | Sleep duration. |
| sleepState | Data of the int type (For details, please refer to [Sleep Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sleep-status-enumeration-0000002372106937).) | Sleep status type. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned. The **sleepScore**, **sleepEfficiency**, **deepSleepPart**, and **snoreFreq** parameters are optional. Whether to return these parameters depends on the wearable. Before obtaining these parameters, you need to check whether the wearable supports these parameters.
