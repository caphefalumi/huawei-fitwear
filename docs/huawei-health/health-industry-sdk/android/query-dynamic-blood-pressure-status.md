<!--
  Title: Querying the Ambulatory Blood Pressure Monitoring Status
  Catalog: huaweihealth-Guides
  Document ID: query-dynamic-blood-pressure-status-0000002418368213
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-dynamic-blood-pressure-status-0000002418368213
-->
# Querying the Ambulatory Blood Pressure Monitoring Status

This section describes how to query the ambulatory blood pressure monitoring status of a wearable. Industry apps can call the corresponding API to query the data.

> **Note:** This API is restricted to wearables that support ambulatory blood pressure monitoring. Currently, only HUAWEI WATCH H9D20 is supported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the ambulatory blood pressure monitoring status. 
```cpp
{
  "item": "dynamicBloodPressureStatus"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the ambulatory blood pressure monitoring status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the ambulatory blood pressure monitoring status.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "dynamicBloodPressureStatus");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the ambulatory blood pressure monitoring status.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the ambulatory blood pressure monitoring status is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. Information about the ambulatory blood pressure monitoring status is carried in **result** when the query is successful. 
```cpp
result example:
{
    "planId":"W_4:D8_1742201815000",
    "planStartTime":1742201815,
    "planEndTime":1742288215,
    "planLocalData":1742207266,
    "ratio":0.08,
    "lastSystolic":129,
    "lastDiastolic":95,
    "lastTimestamp":1742207266
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| planId | Data of the String type | ID of the ambulatory blood pressure monitoring plan. |
| planStartTime | Data of the long type | Plan start time (UTC timestamp in seconds). |
| planEndTime | Data of the long type | Plan end time (UTC timestamp in seconds). |
| planLocalData | Data of the long type | Local date of the plan (UTC timestamp in seconds). |
| ratio | Data of the double type | Plan completion status, displayed as a percentage rounded to two decimal places. |
| lastSystolic | Data of the int type | Latest systolic blood pressure. |
| lastDiastolic | Data of the int type | Latest diastolic blood pressure. |
| lastTimestamp | Data of the long type | Latest measurement time (UTC timestamp in seconds) |
