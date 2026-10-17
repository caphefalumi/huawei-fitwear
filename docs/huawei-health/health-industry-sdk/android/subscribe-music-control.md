<!--
  Title: Subscribing to Music Control Events
  Catalog: huaweihealth-Guides
  Document ID: subscribe-music-control-0000002417529477
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-music-control-0000002417529477
-->
# Subscribing to Music Control Events

This section describes how to subscribe to and unsubscribe from music control events of a connected wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from music control event notifications. 
```cpp
{
    "item": "musicControl"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to music control event notifications. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to music control event notifications.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "musicControl");
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
| statusCode | 0, 1, 2, 3, 6, 7, 10, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002338108834). |
| result | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and music control event information in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When a music control event is generated, **statusCode** is **10**, and the music control type and volume are returned in **result**. 
```cpp
result example:
{
    "controlType":7,
    "musicVolume":50
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| controlType | • **0**: Query music information. • **1**: Play music. • **2**: Pause music. • **3**: Switch to the previous song. • **4**: Switch to the next song. • **5**: Increase the volume. • **6**: Decrease the volume. • **7**: Set the volume based on **musicVolume**. | Type of the control instruction reported by the wearable. |
| musicVolume | Data of the int type | Volume that is configured. The wearable sends this value to the app, which then uses the value to set the phone's volume. This parameter is reported only when the value of **controlType** is **7**. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from music control event notifications. 
```cpp
// Call the unSubscribe method to unsubscribe from music control event notifications.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
