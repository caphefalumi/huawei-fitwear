<!--
  Title: Querying Pulse Wave Arrhythmia Analysis Data
  Catalog: huaweihealth-Guides
  Document ID: query-arrhythmia-data-0000002447392149
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-arrhythmia-data-0000002447392149
-->
# Querying Pulse Wave Arrhythmia Analysis Data

A wearable provides the pulse wave arrhythmia analysis capability. After a user completes a pulse wave arrhythmia analysis, industry apps can call the corresponding API to query pulse wave arrhythmia analysis data recorded by the wearable.

> **Note:** Before querying the pulse wave arrhythmia analysis data, ensure that the pulse wave arrhythmia analysis function is enabled in the Huawei Health app. To enable it, go to **Devices** > *Connected device* > **Pulse wave arrhythmia analysis**, tap **Agree** to go to the next screen, and tap **ACTIVATE** on the top. Concurrent query of pulse wave arrhythmia analysis data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying pulse wave arrhythmia analysis data. 
```cpp
{
    "item": "arrhythmiaResult",
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
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query the pulse wave arrhythmia analysis data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying pulse wave arrhythmia analysis data.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject valueObject= new ZSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    zsonObject.put("item", "arrhythmiaResult");
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query the pulse wave arrhythmia analysis data.
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
| data | - | If the API call succeeds, pulse wave arrhythmia analysis data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains pulse wave arrhythmia analysis data. 
```cpp
data example:
{
    "dataType": "arrhythmiaResult",
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [{
        "saveTime": 1657158420,
        "measureType": 1,
        "ppgIrregulerHeartbeat": 1
    }]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataList | - | Data list. Fields vary depending on the data type. |
| saveTime | UTC time, in seconds | Record storage time. |
| measureType | Data of the int type | Heart rate measurement type. • **0**: automatic measurement • **1**: active measurement |
| ppgIrregulerHeartbeat | Data of the int type | Pulse wave arrhythmia analysis result. • **1**: no abnormality detected • **2**: suspected premature beats • **3**: suspected atrial fibrillation (AFib) • **4**: irregular heart rhythm - potential AFib risk • **5**: irregular heart rhythm - potential premature beats risk |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback, so you do not need to call the query API again. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
