<!--
  Title: Querying Daily Health Data
  Catalog: huaweihealth-Guides
  Document ID: query-daily-health-data-0000002413673072
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-daily-health-data-0000002413673072
-->
# Querying Daily Health Data

This section describes how to query the daily health data of a wearable user. Supported data types include daily activity data, heart rates measured on a regular basis, and SpO2 data.

> **Note:** Concurrent query of daily health data is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying daily activity data. You must wait for the previous query task to complete before initiating a new one. Before querying heart rate and SpO2 data, ensure that the continuous heart rate monitoring and automatic SpO2 measurement switches are enabled. Otherwise, empty data will be returned. This API can be used together with the API for [subscribing to daily health data updates](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-daily-health-update-event-0000002447591805). When daily health data is updated and you have subscribed to such updates, you can call this API to query the updated health data.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying daily health data. 
```cpp
{
    "item":"dailyHealthData",
    "value":
    {
        "startTime":1644796800,
        "endTime":1644811200,
        "dataType":["fitness","heartRate","spo2"]
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
| dataType | Array of at least one element. Optional elements: • fitness • heartRate • spo2 | Type of the data to be queried. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours and should be no less than 1 minute, and that between the start time and current time should be no more than 7 days. It is recommended that the start time be at least 5 minutes earlier than the current time. Otherwise, the workout intensity data returned may be inaccurate. Currently, the following data types are supported: daily activity (**fitness**), periodic heart rate (**heartRate**), and SpO2 (**spo2**). Pass at least one data type for data query.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query daily health data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying daily health data.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONArray zsonArray = new ZSONArray();
    zsonArray .put("fitness");
    zsonArray .put("heartRate");
    zsonArray .put("spo2");
    ZSONObject valueObject = new ZSONObject();
    valueObject.put("startTime", 1644796800);
    valueObject.put("endTime", 1644811200);
    valueObject.put("dataType", zsonArray);
    zsonObject.put("item", "dailyHealthData");
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query daily health data.
manageClient.query(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 6, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, daily health data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains daily health data. 
```cpp
data example:
{
    "dataType": "fitness",
    "totalCount": 30,
    "index": 0,
    "count": 30,
    "dataList": [{
        "startTime": 1644544380,
        "step": 30,
        "calorie": 200,
        "distance": 5,
        "height": 0,
        "restingHeartRate": 68,
        "exerciseIntensity": 0
    },{
        ...
    }]
}
{
    "dataType": "heartRate",
    "totalCount": 11,
    "index": 0,
    "count": 11,
    "dataList": [{
        "startTime": 1644544380,
        "heartRate": 97
    },{
        ...
    }]
}
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
| dataType | "fitness" | Daily health data. |
| "heartRate" | Heart rate. |  |
| "spo2" | SpO2. |  |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | One or more of the following fields included: **startTime**, **step**, **calorie**, **distance**, **height**, **restingHeartRate**, and **exerciseIntensity** | Data list. Fields vary depending on the data type. For details, please refer to the **data** example. |
| startTime | Data of the long type | Start timestamp of the current data point (UTC time in seconds). |
| step | Data of the int type | Step count. |
| calorie | Data of the int type | Calories (unit: cal). |
| distance | Data of the int type | Distance. |
| height | Data of the int type | Height, in meters. |
| restingHeartRate | Data of the int type | Resting heart rate. |
| exerciseIntensity | Data of the int type | Workout intensity. For details, please refer to [Table 4](#EN-US_TOPIC_0000002648084488__table1144284415323). |
| heartRate | Data of the int type | Periodic heart rate (beats/min). |
| spo2 | Data of the int type | SpO2. The value **99** indicates that the SpO2 is 99%. |
 
| Value of exerciseIntensity | Description |
| --- | --- |
| 0 | Unspecified or low intensity. Note: This value is used if the workout intensity is not specified. |
| 1 | Moderate-to-high intensity. |
 > **Note:** Daily health data is returned by data type passed for query. Data of each data type will be delivered via its own dedicated callback. If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
