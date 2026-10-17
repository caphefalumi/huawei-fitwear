<!--
  Title: Subscribing to Blood Pressure Data Updates
  Catalog: huaweihealth-Guides
  Document ID: subscribe-blood-pressure-update-event-0000002342597334
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-blood-pressure-update-event-0000002342597334
-->
# Subscribing to Blood Pressure Data Updates

This section describes how to subscribe to and unsubscribe from blood pressure data update events on a wearable. Following a successful subscription, the wearable reports a blood pressure data update event after a measurement is completed if the measurement end time is within the subscription time range. After unsubscription, the wearable will no longer report blood pressure data update events.

> **Note:** This API is restricted to wearables of the industry version that have the blood pressure measurement feature.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from blood pressure data updates. 
```cpp
{
    "item": "bloodPressureUpdateEvent",
    "value": {
        "onDutyTime": "0000",
        "offDutyTime": "2400"
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| onDutyTime | A 24-hour time string in HHmm format, with HH indicating the hour and mm indicating the minute. The earliest time value is **0000**, and the latest time value is **2400**. Examples: **0800** and **2000** | Subscription start time (24-hour format). |
| offDutyTime | A 24-hour time string in HHmm format, with HH indicating the hour and mm indicating the minute. The earliest time value is **0000**, and the latest time value is **2400**. Examples: **0800** and **2000** | Subscription end time (24-hour format). |
 > **Note:** If the value of **offDutyTime** is earlier than that of **onDutyTime**, the subscription crosses midnight and **offDutyTime** indicates a time point on the second day.
- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to blood pressure data updates. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from blood pressure data updates.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject = new JSONObject();
    valueObject.put("onDutyTime", "0000");
    valueObject.put("offDutyTime", "2400");
    jsonObject.put("item", "bloodPressureUpdateEvent");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to blood pressure data updates.
manageClient.subscribe(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 8, 10, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription succeeds, the subscription ID is returned. If the subscription fails, an error message is returned. When the blood pressure data is updated, an empty string is returned. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from blood pressure data updates. 
```cpp
// Call the unSubscribe method to unsubscribe from blood pressure data updates.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
