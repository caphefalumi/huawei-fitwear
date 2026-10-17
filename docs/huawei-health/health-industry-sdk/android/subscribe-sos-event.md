<!--
  Title: Subscribing to SOS Events
  Catalog: huaweihealth-Guides
  Document ID: subscribe-sos-event-0000002376595273
  Updated: 2026-08-05 02:10:12
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-sos-event-0000002376595273
-->
# Subscribing to SOS Events

This section describes how to subscribe to and unsubscribe from SOS events of a wearable. Following a successful subscription, the wearable reports an SOS event when detecting that SOS is triggered. After unsubscription, SOS events are no longer reported.

> **Note:** This API is restricted to industry wearables that have the SOS event subscription feature. Currently, HUAWEI WATCH H7546 and HUAWEI WATCH H7556 are supported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from SOS event notifications. 
```cpp
{
    "item": "SOSEvent"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to SOS event notifications. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to SOS event notifications.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "SOSEvent");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method.
manageClient.subscribe(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 10, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from SOS event notifications. 
```cpp
// Call the unSubscribe method to unsubscribe from SOS event notifications.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
