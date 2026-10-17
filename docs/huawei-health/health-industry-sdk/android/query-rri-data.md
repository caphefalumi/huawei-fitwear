<!--
  Title: Querying R-R Interval (RRI) Data
  Catalog: huaweihealth-Guides
  Document ID: query-rri-data-0000002527336380
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-rri-data-0000002527336380
-->
# Querying R-R Interval (RRI) Data

This section describes how to query the R-R interval (RRI) data from a wearable. After a user wears the device for a period of time, industry apps can call the corresponding API to query the RRI data recorded on the device.

> **Note:** The RRI is measured every 10 minutes. RRI measurement requires the user to be at rest. During activity, values may not be generated. Concurrent query of historical heart rate data is not supported. You must wait for the previous query to complete before initiating a new one. This API cannot be called simultaneously with the API for querying historical SpO2 data, for querying daily activity data, or for querying daily activity status. You must wait for the previous query task to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct the input data in JSON format for querying RRI data. 
```cpp
{
    "item": "rriData"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query RRI data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct the input data in JSON format for querying RRI data.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "rriData");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query RRI data.
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
| data | - | If the API call succeeds, RRI data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The RRI data is carried in **data** when the query is successful. 
```cpp
{
    "dataType": "rriData",
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [
        {
            "startTime": 1774409495000,
            "detailData": [
                {
                    "timestamp": 1774409495000,
                    "rri": 887,
                    "sqi": 100
                },
                {
                    "timestamp": 1774409495887,
                    "rri": 898,
                    "sqi": 100
                },
                {
                    "timestamp": 1774409496785,
                    "rri": 914,
                    "sqi": 100
                }
            ]
        }
    ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| timestamp | Data of the long type | Timestamp when the RRI data is generated. (Unit: millisecond) |
| rri | Data of the int type | RRI value. |
| sqi | Data of the int type | RRI confidence. |
