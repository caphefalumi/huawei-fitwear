<!--
  Title: Querying Sleep Apnea Data
  Catalog: huaweihealth-Guides
  Document ID: query-osa-data-0000002413673076
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-osa-data-0000002413673076
-->
# Querying Sleep Apnea Data

A wearable provides the sleep apnea detection capability. When a user falls asleep (at night) while wearing a wearable, industry apps can call the corresponding API to query sleep apnea data detected by the wearable.

> **Note:** Before querying the sleep apnea data from a wearable, enable the sleep apnea detection function in the Huawei Health app first. To enable it, go to **Devices** > *Connected device* > **Sleep apnea**, and tap **ACTIVATE** at the top. To collect sleep apnea data, ensure that TruSleep has been enabled on the wearable through the API for [setting the TruSleep switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-trusleep-switch-0000002447392129) and the wearable has sleep data. Concurrent query of sleep apnea data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying sleep apnea data. 
```cpp
{
    "item": "obstructiveSleepApnea",
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
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query sleep apnea data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying sleep apnea data.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject valueObject= new ZSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    zsonObject.put("item", "obstructiveSleepApnea");
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query sleep apnea data.
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
| data | - | If the API call succeeds, sleep apnea data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains sleep apnea data. 
```cpp
data example:
{
    "dataType": "obstructiveSleepApnea",
    "totalCount": 2,
    "index": 0,
    "count": 2,
    "dataList": [{
        "startTime": 1657158420,
        "osaLevel": 1
    },{
    ...
    }]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time. |
| osaLevel | Data of the int type | Risk level. • **1**: normal • **2**: suspected low risk • **3**: suspected medium risk • **4**: suspected high risk |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback, so you do not need to call the query API again. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
