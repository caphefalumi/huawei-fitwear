<!--
  Title: Subscribing to Device-Side Call Operations
  Catalog: huaweihealth-Guides
  Document ID: subscribe-phone-call-operation-0000002417409621
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-phone-call-operation-0000002417409621
-->
# Subscribing to Device-Side Call Operations

The Health Industry SDK allows industry apps to subscribe to and unsubscribe from the device-side call hangups and rejections via SMS. When receiving a call hangup operation, industry apps can call the hangup API to end the call. When receiving an operation of call rejection via SMS, industry apps can call the SMS sending API to send an automatic SMS response.

> **Note:** If industry apps need to hang up a call, they must request the call answering permission (**android.permission.ANSWER_PHONE_CALLS**) dynamically so that they can call the hangup API to hang up the call. If industry apps need to reject a call via SMS, they must request the SMS sending permission (**android.permission.SEND_SMS**) dynamically so that they can call the SMS sending API to send SMS messages.

If industry apps do not have the permission to send SMS messages, rejecting calls via SMS message is unavailable on the [lite wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555) or [smart bands](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from device-side call operations. 
```cpp
{
    "item":"phoneCallOperation"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to device-side call operations. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from device-side call operations.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "phoneCallOperation");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to device-side call operations.
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
| statusCode | 0, 2, 3, 4, 5, 6, 7, 10 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. When a call operation is performed, the state of that operation is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the subscribed call operations.
- Process the subscription result and call operation in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When a call is hung up or rejected, **statusCode** is **10** and the operation state is returned in **result**. 
```cpp
The following is an example of result when the value of operation is 0 (hang up an incoming call):
{
    "operation":0
}
```
 
```cpp
The following is an example of result when the value of operation is 1 (reject an incoming call via SMS message):
{
    "operation":1,
    "phoneNumber":"18211111111",
    "subscriptionId":1,
    "replyContent":"Contact you later."
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| operation | **0**: hang up an incoming call **1**: reject an incoming call via SMS message | Hang up an incoming call or reject an incoming call via SMS message. |
| phoneNumber | Data of the String type (optional) | Incoming call number, which is also the number that receives the SMS message when the incoming call is rejected. This parameter is returned when the value of **operation** is **1**, but not returned when the value of **operation** is **0**. |
| subscriptionId | Data of the int type (optional) | Subscription ID for the SIM card handling the incoming call. This parameter is returned when the value of **operation** is **1**, but not returned when the value of **operation** is **0**. |
| replyContent | Data of the String type (optional) | Content of the SMS message for rejecting an incoming call. This parameter is returned when the value of **operation** is **1**, but not returned when the value of **operation** is **0**. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from device-side call operations when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from device-side call operations.
// Note: serviceCallback is the object declared in step 4, and jsonObject is the one used for subscription.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
