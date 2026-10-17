<!--
  Title: Querying SpO2 Data
  Catalog: huaweihealth-Guides
  Document ID: query-blood-oxygen-data-0000002447392137
  Updated: 2026-08-05 02:10:30
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-blood-oxygen-data-0000002447392137
-->
# Querying SpO2 Data

A wearable provides the SpO2 measurement capability. After a user measures their SpO2, industry apps can call the corresponding API to query the latest SpO2 data recorded on the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying SpO2 data. 
```cpp
{
    "item": "bloodOxygen"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query SpO2 data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying SpO2 data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "bloodOxygen");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query SpO2 data.
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
| data | - | If the API call succeeds, the latest SpO2 data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains SpO2 data. 
```cpp
data example:
{
    "bloodOxygen":95
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| bloodOxygen | Data of the int type | Latest SpO2 data. |
