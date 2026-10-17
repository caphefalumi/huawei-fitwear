<!--
  Title: Subscribing to the Ambulatory Blood Pressure Monitoring Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-dynamic-blood-pressure-status-0000002429538581
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-dynamic-blood-pressure-status-0000002429538581
-->
# Subscribing to the Ambulatory Blood Pressure Monitoring Status

This section describes how to subscribe to and unsubscribe from the ambulatory blood pressure monitoring status of a wearable. Following a successful subscription, the wearable reports ambulatory blood pressure monitoring status update events. After unsubscription, the wearable will no longer report ambulatory blood pressure monitoring status update events.

> **Note:** This API is restricted to wearables that support ambulatory blood pressure monitoring. Currently, only HUAWEI WATCH H9D20 is supported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from the ambulatory blood pressure monitoring status. 
```cpp
{
    "item": "dynamicBloodPressureStatus"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to the ambulatory blood pressure monitoring status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from the ambulatory blood pressure monitoring status.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "dynamicBloodPressureStatus");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the ambulatory blood pressure monitoring status.
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
| statusCode | 0, 1, 2, 3, 5, 7, 10, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. When the ambulatory blood pressure monitoring status changes, the latest status is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and ambulatory blood pressure monitoring status in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When the ambulatory blood pressure monitoring status changes, **statusCode** is **10** and the latest status is returned in **result**. 
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
 > **Note:** If ambulatory blood pressure monitoring is performed when the wearable is disconnected, two monitoring records will be reported after the measurement is complete and the wearable is connected again.
- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from the ambulatory blood pressure monitoring status. 
```cpp
// Call the unSubscribe method to unsubscribe from the ambulatory blood pressure monitoring status.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
