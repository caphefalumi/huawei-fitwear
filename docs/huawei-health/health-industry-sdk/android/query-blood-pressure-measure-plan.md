<!--
  Title: Querying the Periodic Blood Pressure Measurement Plan
  Catalog: huaweihealth-Guides
  Document ID: query-blood-pressure-measure-plan-0000002429418641
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-blood-pressure-measure-plan-0000002429418641
-->
# Querying the Periodic Blood Pressure Measurement Plan

This section describes how to query the periodic blood pressure measurement plan delivered to a wearable. Industry apps can call the corresponding API to query the plan.

> **Note:** This API is restricted to wearables that support single blood pressure measurement. Currently, HUAWEI WATCH B9-D10 and HUAWEI WATCH H9D20 are supported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the periodic blood pressure measurement plan. 
```cpp
{
  "item": "bloodPressureMeasurePlan"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the periodic blood pressure measurement plan. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the periodic blood pressure measurement plan.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "bloodPressureMeasurePlan");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the periodic blood pressure measurement plan.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, information about the periodic blood pressure measurement plan is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The periodic blood pressure measurement plan is carried in **result** when the query is successful. 
```cpp
result example:
{
      "wakeUpTime":"0700",
      "beforeSleepTime":"2200",
      "enabled":1,
      "daysOfWeek":[1,2,6],
      "planTimes":["0745","0840","1433"]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| wakeUpTime | Character string in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. The earliest time value is **0600** and the latest time value is **0900**. | Measurement time after wakeup. The time ranges from 6:00 to 9:00. |
| beforeSleepTime | Character string in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. The time range spans two days, with the earliest time value **2000** on the first day, and the latest time value **0159** on the next day. | Measurement time before bedtime. The time ranges from 20:00 to 1:59 (next day). |
| enabled | Data of the int type | Indicates whether to send a reminder. The options are **1** (yes) and **0** (no). |
| daysOfWeek | Array of the int type | Weekdays for scheduled reminders. The value of each element in the array ranges from 1 to 7. |
| planTimes | Character string array. Each element is in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. | Custom measurement time. The value ranges from **wakeUpTime** to **beforeSleepTime**. Ensure that the time interval between each two measurements (including the wake-up and before-sleep measurements) is at least 45 minutes. |
