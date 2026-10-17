<!--
  Title: Querying Resting Heart Rate Data
  Catalog: huaweihealth-Guides
  Document ID: query-resting-heart-rate-data-0000002447392141
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-resting-heart-rate-data-0000002447392141
-->
# Querying Resting Heart Rate Data

A wearable provides the heart rate measurement capability. After a user measures their heart rate, industry apps can call the corresponding API to query the last resting heart rate data measured on the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying resting heart rate data. 
```cpp
{
    "item": "restingHeartRate"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query resting heart rate data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying resting heart rate data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "restingHeartRate");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query resting heart rate data.
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
| data | - | If the API call succeeds, the last resting heart rate is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains resting heart rate data. 
```cpp
data example:
{
    "restingHeartRate":80
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| restingHeartRate | Data of the int type | Last resting heart rate. |
