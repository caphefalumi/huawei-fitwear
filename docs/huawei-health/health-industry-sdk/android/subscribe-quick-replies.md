<!--
  Title: Subscribing to SMS Quick Replies
  Catalog: huaweihealth-Guides
  Document ID: subscribe-quick-replies-0000002418288385
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-quick-replies-0000002418288385
-->
# Subscribing to SMS Quick Replies

This section describes how to subscribe to and unsubscribe from the SMS quick reply information on a wearable. Following a successful subscription, when the wearable receives an SMS notification and the user selects the desired quick reply to respond to the SMS message, the current SMS quick reply data will be returned. After unsubscription, the SMS quick reply information will no longer be returned.

> **Note:** This API is restricted to industry wearables that have the SMS quick reply feature. To enable the SMS quick reply function, you need to add the following permissions to the industry app's **AndroidManifest.xml** file and request them dynamically: 
```cpp
<uses-permission android:name="android.permission.READ_SMS"/>
<uses-permission android:name="android.permission.SEND_SMS"/>
```
 When you need to call the Android API to send SMS messages, please refer to [How Do I Call the System API to Send an SMS Message After the Device Reports an Operation of Call Rejection via SMS?](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/faq-0000002511427352#section246991918536) in FAQs.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from SMS quick replies. 
```cpp
{
  "item": "quickReplies"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to SMS quick replies. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to SMS quick replies.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "quickReplies");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to SMS quick replies.
manageClient.subscribe(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 8, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. When the user taps a quick reply on their wearable, the SMS quick reply data is returned. |

- Process the subscription result in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When the user taps an SMS quick reply on their wearable, **statusCode** is **8** and the SMS quick reply information is returned in **result**. 
```cpp
result example:
{
  "subscriptionId": 0,
  "desPhoneNumber": "+8611122223333",
  "replyContent": "ok"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| subscriptionId | Data of the int type | Subscription ID for the SIM card that receives the SMS message. |
| desPhoneNumber | Data of the String type | Destination phone number for receiving the SMS message. |
| replyContent | Data of the String type | Reply content. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from SMS quick replies when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from SMS quick replies.
// Note: serviceCallback is the object declared in step 4, and jsonObject is the one used for subscription.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
