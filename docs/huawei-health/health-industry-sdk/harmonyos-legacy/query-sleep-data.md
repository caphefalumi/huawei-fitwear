<!--
  Title: Querying Sleep Data
  Catalog: huaweihealth-Guides
  Document ID: query-sleep-data-0000002413673064
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-sleep-data-0000002413673064
-->
# Querying Sleep Data

A wearable provides the capability of monitoring sleep and breathing quality data in real time. When a user falls asleep (nighttime sleep or nap) while wearing a wearable, industry apps can call the corresponding API to query sleep data recorded on the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying sleep data. 
```cpp
{
    "item": "sleepData"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query sleep data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying sleep data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "sleepData");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query sleep data.
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
| data | - | If the API call succeeds, the latest sleep data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains sleep data. 
```cpp
data example:
{
    "sleepTime":30,
    "napsTime":10,
    "napsStartTime":1680494400,
    "napsEndTime":1680495000,
    "longSleepTime":540,
    "longSleepStartTime":1680444000,
    "longSleepEndTime":1680476400
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| sleepTime | Data of the int type | Total sleep duration of the current day, in minutes. |
| napsTime | Data of the int type | Total nap duration, in minutes. |
| napsStartTime | Data of the long type | Start time of a nap (UTC timestamp in seconds). |
| napsEndTime | Data of the long type | End time of a nap (UTC timestamp in seconds) |
| longSleepTime | Data of the int type | Total sleep duration at night of the current day, in minutes. |
| longSleepStartTime | Data of the long type | Start time of the sleep at night of the current day (UTC timestamp in seconds). |
| longSleepEndTime | Data of the long type | End time of the sleep at night of the current day (UTC timestamp in seconds). |
 > **Note:** Sleep data returned in the query covers the period from 20:00 of the previous day to 20:00 of the current day. Sleep data generated from 20:00 to 24:00 of a day will not be available for query until the day has passed (after 24:00). **longSleepTime** excludes the duration of wake-ups during sleep. Therefore, the difference between **longSleepStartTime** and **longSleepEndTime** does not necessarily equal **longSleepTime**.
