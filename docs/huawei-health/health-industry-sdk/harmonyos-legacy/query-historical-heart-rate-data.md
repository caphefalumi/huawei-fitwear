<!--
  Title: Querying Historical Heart Rate Data
  Catalog: huaweihealth-Guides
  Document ID: query-historical-heart-rate-data-0000002413673068
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-historical-heart-rate-data-0000002413673068
-->
# Querying Historical Heart Rate Data

A wearable provides the heart rate measurement capability. After a user measures their heart rate, industry apps can call the corresponding API to query the historical heart rate data of the current day recorded on the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying historical heart rate data. 
```cpp
{
    "item": "historyHeartRate"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query historical heart rate data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying historical heart rate data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "historyHeartRate");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query historical heart rate data.
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
| data | - | If the API call succeeds, historical heart rate data is returned. If the API call fails, an error message is returned. |

- Process the returned information in **onResult** of **ServiceCallback**. If the query succeeds, **data** contains 73 historical heart rate records of the current day (24 hours). 
```cpp
data example:
{
    "historyHeartRate":"[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 82, 91, 0, 0, 73, 58, 74, 49, 71, 0, 0, 77, 69, 95, 69, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| historyHeartRate | Data of the int type | Heart rate data consisting of 73 values sampled every 20 minutes from 00:00 to 24:00 of the current day. If no heart rate is generated for a specific time point, the value defaults to **0**. |
 > **Note:** Historical heart rate data is recorded at 20-minute intervals at timestamps 00:00, 00:20, 00:40, 01:00, …, 23:20, 23:40, and 24:00.
