<!--
  Title: Setting a Periodic Blood Pressure Measurement Plan
  Catalog: huaweihealth-Guides
  Document ID: set-blood-pressure-measure-plan-0000002395898832
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-blood-pressure-measure-plan-0000002395898832
-->
# Setting a Periodic Blood Pressure Measurement Plan

This section describes how to set a periodic blood pressure measurement plan for a wearable. Industry apps can call the corresponding API to set such a plan.

> **Note:** This API is restricted to wearables that support single blood pressure measurement. Currently, HUAWEI WATCH B9-D10 and HUAWEI WATCH H9D20 are supported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting a periodic blood pressure measurement plan. 
```cpp
{
  "settingKey": "bloodPressureMeasurePlan",
  "settingValue": {
      "wakeUpTime":"0700",
      "beforeSleepTime":"2200",
      "enabled":1,
      "daysOfWeek":[1,2,6],
      "planTimes":["0745","0840","1433"]
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | bloodPressureMeasurePlan | Key of a periodic blood pressure measurement plan. |
| settingValue | Fields included: **wakeUpTime**, **beforeSleepTime**, **enabled**, **daysOfWeek**, and **planTimes** | Content of the periodic blood pressure measurement plan. |
| wakeUpTime | Character string in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. The earliest time value is **0600** and the latest time value is **0900**. | Measurement time after wakeup. The time ranges from 6:00 to 9:00. |
| beforeSleepTime | Character string in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. The time range spans two days, with the earliest time value **2000** on the first day, and the latest time value **0159** on the next day. | Measurement time before bedtime. The time ranges from 20:00 to 1:59 (next day). |
| enabled | Data of the int type | Indicates whether to send a reminder. The options are **1** (yes) and **0** (no). |
| daysOfWeek | Array of the int type | Weekdays for scheduled reminders. The value of each element in the array ranges from 1 to 7. |
| planTimes | Character string array. Each element is in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. | Custom measurement time. The value ranges from **wakeUpTime** to **beforeSleepTime**. Ensure that the time interval between each two measurements (including the wake-up and before-sleep measurements) is at least 45 minutes. |
 **planTimes** supports a maximum of eight custom measurements.
- Each custom measurement time point cannot be earlier than the wake-up measurement time and cannot be later than the before-sleep measurement time.
- If an ambulatory blood pressure monitoring plan has been enabled, reminders will not be sent to users for single blood pressure measurement once a periodic blood pressure measurement plan is set up.

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set a periodic blood pressure measurement plan. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting a periodic blood pressure measurement plan.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "bloodPressureMeasurePlan");
    JSONArray settingJson = new JSONArray();
    settingJson.put("wakeUpTime", "0700");
    settingJson.put("beforeSleepTime", "2200");
    settingJson.put("enabled", 1);
    JSONArray daysOfWeekArray = new JSONArray();
    daysOfWeekArray.put(1);
    daysOfWeekArray.put(2);
    daysOfWeekArray.put(6);
    settingJson.put("daysOfWeek", daysOfWeekArray);
    JSONArray planTimesArray = new JSONArray();
    daysOfWeekArray.put("0745");
    daysOfWeekArray.put("0840");
    daysOfWeekArray.put("1433");
    settingJson.put("planTimes", planTimesArray );
    jsonObject.put("settingValue", settingJson);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set a periodic blood pressure measurement plan.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
