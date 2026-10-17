<!--
  Title: Subscribing to Data Updates of a Single Workout
  Catalog: huaweihealth-Guides
  Document ID: subscribe-workout-update-event-0000002342597322
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-workout-update-event-0000002342597322
-->
# Subscribing to Data Updates of a Single Workout

This section describes how to subscribe to and unsubscribe from events of data updates to a single workout on a wearable. Following a successful subscription, the wearable reports a single-workout data update event after a single workout completes within the subscription time range. After unsubscription, single-workout data update events are no longer reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from data updates of a single workout. 
```cpp
{
    "item": "workoutUpdateEvent",
    "value": {
        "onDutyTime": "0000",
        "offDutyTime": "2400"
    }
}
```
 
| Parameter in value | Value | Description |
| --- | --- | --- |
| onDutyTime | A 24-hour time string in HHmm format, with HH indicating the hour and mm indicating the minute. The earliest time value is **0000**, and the latest time value is **2400**. Examples: **0800** and **2000** | Subscription start time (24-hour format). |
| offDutyTime | A 24-hour time string in HHmm format, with HH indicating the hour and mm indicating the minute. The earliest time value is **0000**, and the latest time value is **2400**. Examples: **0800** and **2000** | Subscription end time (24-hour format). |
 > **Note:** If the value of **offDutyTime** is earlier than that of **onDutyTime**, the subscription crosses midnight and **offDutyTime** indicates a time point on the second day.
- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to data updates of a single workout. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to data updates of a single workout.
JSONObject jsonObject = new JSONObject();
JSONObject valueObject = new JSONObject();
try {
    jsonObject.put("item", "workoutUpdateEvent");
    valueObject.put("onDutyTime", "0000");
    valueObject.put("offDutyTime", "2400");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to data updates of a single workout.
manageClient.subscribe(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 10 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription succeeds, the subscription ID is returned. If the subscription fails, an error message is returned. When the data of a single workout is updated, an empty string is returned. The workout types that support reporting workout data update events are the same as those described in [Table 4](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-workout-data-0000002342714348#EN-US_TOPIC_0000002648084490__table2253114519479). |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and events of data updates to a single workout in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and the corresponding **subscribeId** is returned in **result**. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When there is a data update event for a single workout, **statusCode** is **10** and **result** is an empty string. 
```cpp
result example:
{
    "subscribeId":"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| subscribeId | String of 36 characters | Subscription ID. |

- Construct input data in JSON format for unsubscribing from data updates of a single workout. In these parameters, **item** and **value** must be the same as those for subscription. 
```cpp
{
    "item": "workoutUpdateEvent",
    "value":
    {
        "onDutyTime": "0000",
        "offDutyTime": "2200"
    }
}
```

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from data updates of a single workout. 
```cpp
// Call the unSubscribe method to unsubscribe from data updates of a single workout.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
