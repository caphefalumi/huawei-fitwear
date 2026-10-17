<!--
  Title: Sending a Template-based Notification to a Wearable
  Catalog: huaweihealth-Guides
  Document ID: device-notification-0000002342776768
  Updated: 2026-08-05 02:10:13
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/device-notification-0000002342776768
-->
**
# Sending a Template-based Notification to a Wearable

This section describes how an industry app sends a template-based notification to a wearable.

> **Note:** HUAWEI WATCH B7-536 and HUAWEI WATCH B7-738 do not support template-based notifications when working in ultra-long battery life mode. Wearables can display template-based notifications even without the industry app installed. Make sure that the wearable is connected to a mobile device. The wearable vibrates or rings when the following conditions are met: Vibration or ringing is enabled on the wearable. The wearable is being worn. Do Not Disturb is disabled on the wearable. Notifications will pop up automatically on the wearable when the following conditions are met: The wearable is being worn. Do Not Disturb is disabled on the wearable. When the connected wearable is HUAWEI WATCH H5546, HUAWEI WATCH H7546, HUAWEI WATCH H7556, HUAWEI Band HA590, HUAWEI Band HA5A0, HUAWEI WATCH H5556, HUAWEI WATCH H5756, HUAWEI WATCH H3540, or HUAWEI WATCH H9D20, users need to enable Wake screen by going to Settings > Notifications .

HUAWEI WATCH H7556 can receive missed call notifications only after [subscribing to device-side call operations](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-phone-call-operation-0000002417409621).
Figure 1 **Notifications on the home screen and message center

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for sending template-based notifications to the wearable. 
```cpp
{
  "item": "notification",
  "value": {
    "templateId": 53,
    "pkgName": "com.aa.bb",
    "title": "title",
    "content": "content",
    "remindType": 1,
    "button": {
      "button_1": "buttonText1",
      "button_2": "buttonText2",
      "button_3": "buttonText3"
    }
  }
}
```
 
| Parameter | Description |
| --- | --- |
| templateId | Notification template ID, which is of the int type. This parameter is mandatory, and the options are as follows: **50**: no button contained **51**: one button contained **52**: two buttons contained **53**: three buttons contained |
| pkgName | App package name, which contains a maximum of 28 bytes. The device displays the icon according to the app package name. This parameter is mandatory. |
| title | Notification title, which contains a maximum of 28 bytes. This parameter is mandatory. |
| content | Notification content, which contains a maximum of 400 bytes. This parameter is mandatory. |
| button | Button content. A maximum of three buttons (**button_1**, **button_2**, and **button_3**) are supported. The number of buttons must match **templateId**. This parameter is optional. |
| button_1 | Content of the first button, which contains a maximum of 12 bytes. |
| button_2 | Content of the second button, which contains a maximum of 12 bytes. |
| button_3 | Content of the third button, which contains a maximum of 12 bytes. |
| remindType | Vibration and ringing mode of template-based notifications. The value is of the int type. This parameter is optional, and the options are as follows: **1**: **less_importance** mode. In this mode, vibration is enabled for 1 cycle (0.5s) with the ringtone disabled. **2**: **normal_importance** mode. In this mode, vibration is enabled for 3 cycles (0.5s each at an interval of 0.5s) with a 3s ringtone. **3**: **most_importance** mode. In this mode, vibration is enabled for 3 cycles (1s each at an interval of 0.5s) with a 5s ringtone. |
 > **Note:** The number of buttons must be consistent with that specified by **templateId**. You are advised not to use the name of another enterprise app package, such as QQ and WeChat, when using template-based notifications. Currently, customizing (**remindType**) is supported only on HUAWEI WATCH H5546, HUAWEI WATCH H7546, HUAWEI Band HA590, HUAWEI Band HA5A0, HUAWEI WATCH H5556, HUAWEI WATCH H5756, HUAWEI WATCH H3540, and HUAWEI WATCH H9D20. The vibration and ringing durations are subject to the wearable system settings.
- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__send-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to send the template-based notification to the wearable. 
```cpp
// Step 1 Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Step 2 Obtain the list of paired wearables by referring to Obtaining the Wearable List. Then, select a target wearable from the list and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Step 3 Create a JSON object of the template-based notification.
JSONObject jsonObject = new JSONObject();
JSONObject valueObject = new JSONObject();
try {
    // Set the template ID.
    valueObject.put("templateId", 51);
    // Set the app package name.
    valueObject.put("pkgName", "com.aa.bb");
    // Set the notification title.
    valueObject.put("title", "This is a title.");
    // Set the notification content.
    valueObject.put("content", "This is content.");
    // (Optional) Customize the vibration and ringing mode.
    valueObject.put("remindType", 1);
    // Set the button. Since templateId is set to 51, you need to set one button here.
    JSONObject buttons = new JSONObject();
    buttons.put("button_1", "Button 1");
    valueObject.put("button", buttons);
    jsonObject.put("item", "notification"); 
    jsonObject.put("value", valueObject); 
} catch (JSONException e) {
    e.printStackTrace();
}

// Step 4 Call the send method to send the template-based notification to the wearable.
deviceManageClient.send(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 7, 24 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. When the user performs operations on the template-based notification, the operation type is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the API call succeeds, **statusCode** is **0** and **result** is an empty string. If the API call fails, **statusCode** is an error code and **result** is the corresponding error information. When the user taps a button on the device, **statusCode** is **24** and **result** is the specific user operation. 
```cpp
result example:
{
    "feedback":1
}
```
 
| Value | Description |
| --- | --- |
| 0 | No feedback (for example, the user presses the home button on the watch to exit or turns off the screen). |
| 1 | The user deletes the notification. |
| 2 | The user taps button 1. |
| 3 | The user taps button 2. |
| 4 | The user taps button 3. |
