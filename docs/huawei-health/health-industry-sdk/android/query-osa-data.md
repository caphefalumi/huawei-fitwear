<!--
  Title: Querying Sleep Apnea Data
  Catalog: huaweihealth-Guides
  Document ID: query-osa-data-0000002383948102
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-osa-data-0000002383948102
-->
# Querying Sleep Apnea Data

This section describes how to query the sleep apnea data from a wearable. When a user falls asleep while wearing a wearable, industry apps can call the corresponding API to query sleep apnea data detected by the wearable.

> **Note:** This API is restricted to wearables that support sleep apnea detection. Before querying sleep apnea data, ensure that the APIs for [setting the activation state of sleep apnea detection](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-osa-active-state-0000002417356473) and [setting the sleep apnea detection switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-osa-switch-0000002383597172) have been called to make the settings, and there is sleep data on the target wearable. Concurrent query of sleep apnea data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying sleep apnea data. 
```cpp
{
  "item": "obstructiveSleepApnea",
  "value": {
    "startTime": 1725193422, // Unit: second
    "endTime": 1725452622 // Unit: second
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
 > **Note:** The time interval between the start time for querying data and the current time cannot exceed 7 days (including the current day), and the end time cannot be later than the current timestamp.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query sleep apnea data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying sleep apnea data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1725193422);
    valueObject.put("endTime", 1725452622);
    jsonObject.put("item", "obstructiveSleepApnea");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query sleep apnea data.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, sleep apnea data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The sleep apnea data is carried in **result** when the query is successful. 
```cpp
result example:
{
  "dataType": "obstructiveSleepApnea",
  "totalCount": 2,
  "dataList": [
    {
      "startTime": 1727092800,
      "osaLevel": 1
    },
    {
      ...
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | obstructiveSleepApnea | Sleep apnea data type. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Start time. |
| osaLevel | • **1**: normal • **2**: suspected low risk • **3**: suspected medium risk • **4**: suspected high risk | Risk level. |
