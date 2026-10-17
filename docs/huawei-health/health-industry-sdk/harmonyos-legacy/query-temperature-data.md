<!--
  Title: Querying Body Temperature Data
  Catalog: huaweihealth-Guides
  Document ID: query-temperature-data-0000002447352073
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-temperature-data-0000002447352073
-->
# Querying Body Temperature Data

A wearable provides the body temperature measurement capability. After a user measures their body temperature, industry apps can call the corresponding API to query the latest or historical body temperature data recorded on the wearable.

> **Note:** Concurrent query of historical body temperature data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying body temperature data. 
```cpp
{
    "item": "temperatureData",
    "value": {
        "startTime": 1685341304, // Unit: second
        "endTime": 1685686904 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| item | temperatureData | Key of the body temperature data. |
| value (optional) | - | You can query historical body temperature data by passing **value**, and query the latest body temperature data with this parameter not specified. |
| startTime | UTC timestamp, in seconds | Start time for querying body temperature data. |
| endTime | UTC timestamp, in seconds | End time for querying body temperature data. Note: The time interval between the start time and end time must be no more than 24 hours. |

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query body temperature data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying body temperature data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "temperatureData");
    ZSONObject valueObject= new ZSONObject();
    valueObject.put("startTime", 1685341304);
    valueObject.put("endTime", 1685686904);
    // Optional.
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query body temperature data.
deviceManageClient.query(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 6, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, the latest or historical (if the time is specified for query) body temperature data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains core body temperature and skin temperature data. 
```cpp
Query the latest body temperature data:
data example:
{
    "bodyTemperature":36.7,
    "skinTemperature":31.8
}
```
 
```cpp
Query the historical body temperature data:
data example:
{
  "dataType": "temperatureData",
  "totalCount": 2,
  "index": 0,
  "count": 2,
  "dataList": [
    {
      "startTime": 1716195780,
      "bodyTemperature": 37,
      "skinTemperature": 34.6
    },
    {
      ...
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC timestamp, in seconds | Body temperature measurement time. |
| bodyTemperature | Data of the float type | Core body temperature (unit: °C). |
| skinTemperature | Data of the float type | Skin temperature (unit: °C). |
