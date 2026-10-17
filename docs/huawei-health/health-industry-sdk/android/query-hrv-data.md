<!--
  Title: Querying Heart Rate Variability (HRV) Data
  Catalog: huaweihealth-Guides
  Document ID: query-hrv-data-0000002558176259
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-hrv-data-0000002558176259
-->
# Querying Heart Rate Variability (HRV) Data

This section describes how to query the heart rate variability (HRV) data from a wearable. After a user wears the device for a period of time, industry apps can call the corresponding API to query the HRV data recorded on the device.

> **Note:** The HRV is measured every 10 minutes. HRV measurement requires the user to be at rest. During activity, values may not be generated. Concurrent query of historical HRV data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in JSON format for querying HRV data. 
```cpp
{
    "item": "hrvData"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query HRV data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying HRV data.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "hrvData");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query HRV data.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, the latest HRV value is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The HRV data is carried in **data** when the query is successful. 
```cpp
{
    "dataType": "heartRateVariabilityRMSSD",
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [
        {
            "startTime": 1774409495,
            "heartRateVariabilityRMSSD": 37
        }
    ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | Data of the long type | Timestamp when the HRV data is generated. (Unit: second) |
| heartRateVariabilityRMSSD | Data of the int type | HRV value. (Unit: millisecond) |
