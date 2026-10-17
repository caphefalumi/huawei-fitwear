<!--
  Title: Subscribing to Daily Activity Data Updates
  Catalog: huaweihealth-Guides
  Document ID: subscribe-daily-health-update-event-0000002376715109
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-daily-health-update-event-0000002376715109
-->
# Subscribing to Daily Activity Data Updates

This section describes how to subscribe to and unsubscribe from daily activity data update events on a wearable. Following a successful subscription, the wearable reports a daily activity data update event when detecting that the conditions for updating daily activity data are met. After unsubscription, the wearable no longer reports daily activity data update events.

> **Note:** You can set only one time range for data subscription for each wearable. When you call this API repeatedly with different subscription settings, the latest settings prevail. Only data update events generated within the time range you have specified for subscription are reported to your app. A data update event is reported each natural hour when the user stands up for the first time within this hour when the connected wearable is HUAWEI WATCH H5546, HUAWEI WATCH H7546, HUAWEI WATCH H7556, HUAWEI Band HA590, HUAWEI Band HA5A0, HUAWEI WATCH H5556, HUAWEI WATCH H5756, HUAWEI WATCH H3540, or HUAWEI WATCH H9D20. A data update event is reported and the statistical values of the four conditions are reset to 0 when the wearable detects that any of the following conditions is met: The step count reaches 500. The distance reaches 1000 meters. The activity duration reaches 1 hour (only supported on [smart bands](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148), [lite wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555), HUAWEI WATCH H7546, and HUAWEI WATCH H7556). The calories burned reaches 100 kcal.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from daily activity data update events. 
```cpp
{
    "item": "dailyHealthUpdateEvent",
    "value":
    {
        "onDutyTime": "0800",
        "offDutyTime": "2200"
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| onDutyTime | Character string in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. The earliest time value is **0000** and the latest time value is **2400**. Examples: **0800** and **2000** | Subscription start time. |
| offDutyTime | Character string in HHmm format (24-hour), with HH indicating the hour and mm indicating the minute. The earliest time value is **0000** and the latest time value is **2400**. Examples: **0800** and **2000** | Subscription end time. |
 > **Note:** If the value of **offDutyTime** is earlier than that of **onDutyTime**, the subscription crosses midnight and **offDutyTime** indicates a time point on the second day.
- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to daily activity data update events. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from daily activity data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject = new JSONObject();
    valueObject.put("onDutyTime", "0800");
    valueObject.put("offDutyTime", "2200");
    jsonObject.put("item", "dailyHealthUpdateEvent");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to daily activity data update events.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
}
manageClient.subscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 6, 7, 10 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription succeeds, the subscription ID is returned. If the subscription fails, an error message is returned. When daily activity data is updated, an empty string is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and daily activity data update events in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and the corresponding **subscribeId** is returned in **result**. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When there is a daily activity data update event, **statusCode** is **10** and **result** is an empty string. 
```cpp
result example:
{
    "subscribeId":"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| subscribeId | String of 36 characters | Subscription ID. |

- Construct input data in JSON format for unsubscribing from daily activity data update events, with **item** and **value** being the same as those set for subscription. 
```cpp
{
    "item": "dailyHealthUpdateEvent",
    "value":
    {
        "onDutyTime": "0800",
        "offDutyTime": "2200"
    }
}
```

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from daily activity data update events. 
```cpp
// Call the unSubscribe method to unsubscribe from daily activity data update events.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
