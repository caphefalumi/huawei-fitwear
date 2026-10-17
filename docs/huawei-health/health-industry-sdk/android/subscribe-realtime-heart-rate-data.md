<!--
  Title: Subscribing to the Real-Time Heart Rate
  Catalog: huaweihealth-Guides
  Document ID: subscribe-realtime-heart-rate-data-0000002376595249
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-realtime-heart-rate-data-0000002376595249
-->
# Subscribing to the Real-Time Heart Rate

This section describes how to subscribe to and unsubscribe from the real-time heart rate of a wearable. Following a successful subscription, the wearable reports real-time heart rate data if the real-time heart rate linkage switch is enabled. After unsubscription, the real-time heart rate data will no longer be reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from the real-time heart rate. 
```cpp
{
    "item":"realtimeHeartRateData"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to the real-time heart rate. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from the real-time heart rate.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "realtimeHeartRateData");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the real-time heart rate.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
};
manageClient.subscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 8, 300, 303 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. When [heart rate linkage](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-realtime-heart-rate-0000002338141040) is enabled, real-time heart rate information is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and real-time heart rate update events in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode **is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When the real-time heart rate is reported, **statusCode** is **8** and the heart rate timestamp and value are returned in **result**. 
```cpp
result example:
{
    "timeStamp":1644544380,
    "heartRate":86
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| timeStamp | UTC timestamp, in seconds | Heart rate data time point. |
| heartRate | Data of the int type | Heart rate (beats/min). |
 > **Note:** The heart rate sensor collects data at an interval of 1000 ms and reports data at an interval of about 1000 ms. One piece of data is reported at a time, which indicates the number of heartbeats per minute. The heart rate values reported for consecutive minutes may be the same. The actual reporting interval may vary depending on the device.
- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from the real-time heart rate. 
```cpp
// Call the unSubscribe method to unsubscribe from the real-time heart rate.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
