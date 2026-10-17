<!--
  Title: Querying the Resting Calories
  Catalog: huaweihealth-Guides
  Document ID: query-basal-metabolism-0000002447352081
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-basal-metabolism-0000002447352081
-->
# Querying the Resting Calories

A wearable provides the weight management capability, encompassing functions like calorie deficit assessment, calorie consumption monitoring, and calorie intake recording. Industry apps can call the corresponding API to query resting calories data recorded on the wearable.

> **Note:** Before querying the data, ensure that a target weight has been set in the Stay Fit app on the wearable. The resting calories consumption data is generated starting at 00:00:00. Therefore, the query start time must be 00:00:00. Concurrent query of resting calories data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying resting calories data. 
```cpp
{
    "item": "basalMetabolism",
    "value": {
        "startTime": 1992342222, // Unit: second
        "endTime": 1992342229 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
 > **Note:** The interval between the query start time and the current time should be no more than 7 days.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query resting calories data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying resting calories data.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject valueObject= new ZSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    zsonObject.put("item", "basalMetabolism");
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query resting calories data.
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
| data | - | If the API call succeeds, resting calories data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains resting calories data. 
```cpp
data example:
{
    "dataType": "basalMetabolism",
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [{
        "startTime": 1657158420,
        "basalMetabolism": 1700
    }]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time. |
| basalMetabolism | Data of the int type (unit: kcal) | Resting calories data. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback, so you do not need to call the query API again. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
