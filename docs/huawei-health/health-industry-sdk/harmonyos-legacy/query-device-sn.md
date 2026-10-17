<!--
  Title: Querying the Device SN
  Catalog: huaweihealth-Guides
  Document ID: query-device-sn-0000002447392145
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-device-sn-0000002447392145
-->
# Querying the Device SN

This section describes how to query the SN of a wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying the device SN. 
```cpp
{
    "item": "serialNumber"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query the device SN. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying the device SN.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "serialNumber");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query the SN.
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
| data | - | If the API call succeeds, the device SN is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The device SN is returned after the query is successful. 
```cpp
data example:
{
    "serialNumber": "xxxx"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| serialNumber | String | Device SN. |
