<!--
  Title: Template-based Notifications on Wearable Devices
  Catalog: connectivity-Guides
  Document ID: wearable-device-notification-0000001057412109
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/wearable-device-notification-0000001057412109
-->
**
# Template-based Notifications on Wearable Devices

This API allows for template-based display of notifications on wearable devices. When your phone app sends a notification to a wearable device, the notification will be displayed based on a specific template on the wearable device. Meanwhile, the wearable device will vibrate or ring, depending on system settings. The following figure shows an example notification displayed on the wearable device.

Before using this API, apply for the [NOTIFY](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__NOTIFY) permission from the user on the phone (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/requesting-user-authorization-0000001050819181)).

> **Note:** Template-based notifications can be displayed even if you don't have your app installed on the wearable device. Ensure that the wearable device is connected to the Huawei Health app. Users can query the connection status on the Devices screen in the Huawei Health app. You can call the [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--) method to query whether the wearable device is connected ( true : connected; false : not connected) and remind the user to re-connect the device. The wearable device vibrates or rings when the following conditions are met: Vibration or ringing is enabled on the wearable device. The wearable device is being worn. Do Not Disturb is not enabled on the wearable device. Notifications will pop up on its own on the wearable device when the following conditions are met: The wearable device is being worn. Do Not Disturb is not enabled on the wearable device.
Figure 1 **Notifications on the home screen and message center

#### Sending Notifications to the Wearable Device

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call the [getNotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getNotifyClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [NotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/notifyclient-0000001060330666) object.
- Define the [Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) object.
- Call the [notify](https://developer.huawei.com/consumer/en/doc/connectivity-References/notifyclient-0000001060330666#EN-US_TOPIC_0000001874111246__notify-com_huawei_wearengine_device_Device-com_huawei_wearengine_notify_Notification-) method to send notifications from the phone app to the wearable device. Use the [Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) object to define the **Notification** object.
- Use the [onResult](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918#EN-US_TOPIC_0000001920110421__onResult-com_huawei_wearengine_notify_Notification-int-)(Notification notification, int feedback) method to return the result for successful sending.
- Use the [onError](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918#EN-US_TOPIC_0000001920110421__onError-com_huawei_wearengine_notify_Notification-int-java_lang_String-)(Notification notification, int errorCode, String errorMsg) method to return the result for failed sending and other exceptions.

```cpp
// Step 2: Obtain the NotifyClient object.
NotifyClient notifyClient = HiWear.getNotifyClient(this);

// Step 3: Define the Notification object.
Notification.Builder builder = new Notification.Builder();
// notificationTemplate is mandatory and indicates the notification sending style. Currently, there are four styles: no button (50), one button (51), two buttons (52), and three buttons (53). 
builder.setTemplateId(NotificationTemplate.NOTIFICATION_TEMPLATE_THREE_BUTTONS);
// packageName is mandatory and can contain a maximum of 28 characters. It is the package name of your app on the wearable device. If there is no wearable app, enter any package name. In this case, the default icon is displayed for notifications.
String packageName = "com.*.*";
builder.setPackageName(packageName);
// title is mandatory and can contain a maximum of 28 characters.
String title = "Wear Engine Notification";
builder.setTitle(title);
// text is mandatory and can contain a maximum of 400 characters.
String text = "Hello, Wear Engine!";
builder.setText(text);
// If the notificationTemplate style is set to no button, buttonContents does not need to be set. Otherwise, the number of buttons to be added depends on the number of buttons that are set. Each button contains a maximum of 12 bytes.
HashMap<Integer, String> buttonContents = new HashMap<>();
buttonContents.put (NotificationConstants.BUTTON_ONE_CONTENT_KEY, "button 1")
buttonContents.put(NotificationConstants.BUTTON_TWO_CONTENT_KEY, "button 2")
buttonContents.put(NotificationConstants.BUTTON_THREE_CONTENT_KEY, "button 3")
builder.setButtonContents(buttonContents);
// Create a callback object for sending notifications. After the wearable device receives the notification, you can receive the callback information when the user touches the button on the notification.
Action action = new Action() {
    @Override
    public void onResult(Notification notification, int feedback) {
        // Process the result returned by the notify message indicating that the message is sent successfully.
        // feedback == 0: Exit or turn off the screen by pressing the home button
        // feedback == 1: Delete a message
        // feedback == 2: Touches the first button
        // feedback == 3: Touches the second button
        // feedback == 4: Touches the third button
    }

    @Override
    public void onError(Notification notification, int errorCode, String errorMsg) {
        // Process the result returned by the notify message indicating that the message failed to be sent or there are other exceptions.
    }
};
builder.setAction(action);
Notification notification = builder.build();

// Step 4: Call the notify method to send notifications from your phone app to the wearable device.
if (connectedDevice != null && connectedDevice.isConnected()) {
    notifyClient.notify(connectedDevice, notification).addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void successVoid) {
            // Process the event indicating that the message notification API is successfully called.
        }
    }).addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Process the event indicating that the message notification API failed to be called.
        }
    });
}
```
