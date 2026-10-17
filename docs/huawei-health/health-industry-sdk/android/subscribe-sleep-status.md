<!--
  Title: Subscribing to the Sleep Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-sleep-status-0000002342757094
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-sleep-status-0000002342757094
-->
# Subscribing to the Sleep Status

This section describes how to subscribe to and unsubscribe from wearable user sleep status. Following a successful subscription, the current sleep status is reported when the wearable user's sleep status changes. After unsubscription, the sleep status is no longer reported.

> **Note:** Subscribing to the sleep status is not supported when a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) is in the ultra-long battery life mode. Subscribing to the sleep status is not supported on HUAWEI WATCH H7556.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from the sleep status. 
```cpp
{
    "item":"sleepStatus"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to the sleep status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from the sleep status.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "sleepStatus");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the sleep status.
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
| statusCode | 0, 2, 3, 4, 5, 6, 7, 8 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. When the sleep status changes, the sleep status is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and sleep status changes in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. If the sleep status changes, **statusCode** is **8** and the sleep status is returned in **result**. 
```cpp
result example:
{
    "sleepStatus":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| sleepStatus | 1 | Asleep. |
| 2 | Awake. |  |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from the sleep status when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the sleep status.
// Note: serviceCallback is the object declared in step 4, and jsonObject is the one used for subscription.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
