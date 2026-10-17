<!--
  Title: Querying Historical Sleep Data
  Catalog: huaweihealth-Guides
  Document ID: query-historical-sleep-data-0000002447352069
  Updated: 2026-08-05 02:10:30
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-historical-sleep-data-0000002447352069
-->
# Querying Historical Sleep Data

A wearable provides the capability of monitoring sleep and breathing quality data in real time. When a user falls asleep (nighttime sleep or nap) while wearing a wearable, industry apps can call the corresponding API to query historical sleep data recorded on the wearable.

> **Note:** To collect sleep data, ensure that TruSleep has been enabled on the wearable through the API for [setting the TruSleep switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-trusleep-switch-0000002447392129) and the wearable has sleep data. Concurrent query of sleep data is not supported. You must wait for the previous query to complete before initiating a new one. To collect sleep data, it is recommended that the wearable be worn and the sleep duration be longer than three hours (excluding naps). Otherwise, the wearable may return empty data.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying historical sleep data. 
```cpp
{
    "item": "historySleepData",
    "value": {
        "startTime": 1685341304, // Unit: second
        "endTime": 1685686904 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
 > **Note:** The interval between the query start time and the current time should be no more than 7 days.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query historical sleep data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying historical sleep data.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject valueObject= new ZSONObject();
    valueObject.put("startTime", 1685341304);
    valueObject.put("endTime", 1685686904);
    zsonObject.put("item", "historySleepData");
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query historical sleep data.
deviceManageClient.query(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 6, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, historical sleep data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains historical sleep data. 
```cpp
data example:
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
| sleepScore | Data of the long type | Sleep score, ranging from 0 to 100. |
| sleepEfficiency | Data of the int type | Sleep efficiency. |
| deepSleepPart | Data of the long type | Deep sleep continuity score. |
| snoreFreq | Data of the String type | Snoring frequency. |
| sleepDetail | Data of the List type | Sleep status details. |
 Fields in **sleepDetail**: 
| Field | Value | Description |
| --- | --- | --- |
| startTime | UTC time, in seconds | Sleep start time. |
| duration | Data of the int type, in minutes | Sleep duration. |
| sleepState | Data of the int type. For details, please refer to [Sleep Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sleep-status-enumeration-0000002372106937). | Sleep status type. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned. The **sleepScore**, **sleepEfficiency**, **deepSleepPart**, and **snoreFreq** parameters are optional. Whether to return these parameters depends on the wearable. Before obtaining these parameters, you need to check whether the wearable supports these parameters.
