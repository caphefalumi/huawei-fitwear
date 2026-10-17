<!--
  Title: Querying the Daily Activity Status
  Catalog: huaweihealth-Guides
  Document ID: query-fitness-status-0000002447352077
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-fitness-status-0000002447352077
-->
# Querying the Daily Activity Status

This section describes how to query the daily activity status from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity status and the corresponding activity duration recorded on the wearable.

> **Note:** Concurrent query of the daily activity status is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying daily health data. You must wait for the previous query task to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying the daily activity status. 
```cpp
{
    "item":"fitnessStatus",
    "value":
    {
        "startTime":1678671036,
        "endTime":1678696236
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying the daily activity status. |
| endTime | UTC timestamp, in seconds | End time for querying the activity status. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours and should be no less than 1 minute, and that between the start time and current time should be no more than 7 days. You are advised to pass the start time and end time as second-level timestamps aligned to whole minutes. The duration of the activity status is measured in minutes.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query the daily activity status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying the daily activity status.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject valueObject = new ZSONObject();
    valueObject.put("startTime", 1678671036);
    valueObject.put("endTime", 1678696236);
    zsonObject.put("item", "fitnessStatus");
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query the daily activity status.
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
| data | - | If the API call succeeds, the daily activity status is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains the daily activity status. 
```cpp
data example:
{
  "dataType": "fitnessStatus",
  "totalCount": 4,
  "index": 0,
  "count": 4,
  "dataList": [
    {
      "statusType": 1,
      "startTime": 1678434120,
      "duration": 1
    },
    ...
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | fitnessStatus | Daily activity status flag. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | Fields included: **statusType**, **startTime**, and **duration** | Detailed data information list. |
| statusType | Data of the int type. For details, please refer to [Daily Activity Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/daily-activity-status-enumeration-0000002372186769). | Activity status type. |
| startTime | Data of the long type | Start timestamp of the current data point (UTC time in seconds). |
| duration | Data of the int type | Duration of the activity status, in minutes. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned. This API will not return sleep status information if the device is HUAWEI WATCH H7546.
