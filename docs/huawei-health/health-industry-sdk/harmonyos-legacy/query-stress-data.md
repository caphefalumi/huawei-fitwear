<!--
  Title: Querying Stress Data
  Catalog: huaweihealth-Guides
  Document ID: query-stress-data-0000002413832960
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-stress-data-0000002413832960
-->
# Querying Stress Data

A wearable provides the stress measurement capability. After a user measures their stress, industry apps can call the corresponding API to query the stress data recorded on the wearable.

> **Note:** Before obtaining the stress data from a wearable, enable the automatic stress detection switch in the Huawei Health app. To enable it, go to **Devices** > *Connected device* > **Health monitoring** > **Automatic stress test**, and enable the switch next to **Automatic stress test**.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying stress data. 
```cpp
{
    "item": "stressData"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query stress data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying stress data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "stressData");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query stress data.
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
| data | - | If the API call succeeds, all data from 00:00:00 to the current time of the current day is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains all stress data from 00:00:00 to the current time of the current day. 
```cpp
data example:
{
    "stressData":[
    {
        "stressStartTime":1680492389,
        "stressEndTime":16804892445,
        "stressScore":66,
        "stressGrade":3
    },
    {
        "stressStartTime":1680500187,
        "stressEndTime":1680500244,
        "stressScore":43,
        "stressGrade":2
    },
...
    ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| stressData | - | Data list. Fields vary depending on the data type. |
| stressStartTime | Data of the long type | Start time (UTC timestamp in seconds). |
| stressEndTime | Data of the long type | End time (UTC timestamp in seconds). |
| stressScore | Data of the int type | Stress score. • 80–99: high • 60–79: medium • 30–59: normal • 1–29: relaxed |
| stressGrade | Data of the int type | Stress level. • **4**: high • **3**: medium • **2**: normal • **1**: relaxed |
