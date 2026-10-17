<!--
  Title: Querying Daily Activity Data
  Catalog: huaweihealth-Guides
  Document ID: query-daily-total-data-0000002413912820
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-daily-total-data-0000002413912820
-->
# Querying Daily Activity Data

This section describes how to query daily activity data from a wearable. After a user engages in daily activities while wearing a wearable, industry apps can call the corresponding API to query the daily activity data recorded on the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying daily activity data. 
```cpp
{
    "item": "dailyTotalData"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query the daily activity data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying daily activity data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "dailyTotalData");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query daily activity data.
deviceManageClient.query(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, the activity records of the current day are returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains daily activity data. 
```cpp
data example:
{
    "totalStep":129,
    "totalCalorie":4289,
    "totalDistance":49,
    "totalStrengthTime":0,
    "totalHeight":200,
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| totalStep | Data of the int type | Step count |
| totalCalorie | Data of the double type | Total calorie (unit: cal). |
| totalDistance | Data of the double type | Total distance, in minutes. |
| totalStrengthTime | Data of the int type | Total duration of moderate- and high-intensity activities, in minutes. |
| totalHeight | Data of the double type | Climbing height, in meters. |
