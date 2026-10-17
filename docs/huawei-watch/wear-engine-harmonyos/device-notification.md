<!--
  Title: Template-based Notifications on Wearables
  Catalog: harmonyos-guides
  Document ID: device_notification
  Updated: 2026-10-14 09:34:24
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/device_notification
-->
# Template-based Notifications on Wearables

The phone-side app sends notifications to the wearable, which displays them using predefined templates. The wearable can vibrate or ring upon receiving the notification, following its system settings. After the operation succeeds, the wearable displays the notification UI as shown below.

This API does not require user authorization, but make sure that you have applied for the message notification permission for your app by referring to [Applying for Integrating Wear Engine Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply). Otherwise, the API call will fail.

> **Note:** Template-based notifications can be displayed even if you do not have a corresponding app installed on the wearable. Ensure that the wearable is connected to the HUAWEI Health app. Users can query the connection status on the **Devices** screen in the HUAWEI Health app. You can determine whether the wearable is connected by calling [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices). If the target device is not included in the returned device list, prompt the user to reconnect it. The wearable vibrates or rings when the following conditions are met: Vibration or ringing is enabled on the wearable. The wearable is being worn. Do Not Disturb is disabled on the wearable. Notifications will pop up automatically on the wearable when the following conditions are met: The wearable is being worn. Do Not Disturb is disabled on the wearable.

#### Sending Notifications to the Wearable

> **Note:** To call this API, you need to apply for the message notification permission on HUAWEI Developers. For details, please refer to [Applying for Integrating Wear Engine Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply).

- Obtain the list of connected wearables by referring to [Querying Connected Wearables](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getNotifyClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetnotifyclient) method of [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [NotifyClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#notifyclient) object.
- Define the [NotificationOptions](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#notificationoptions) configuration class.
- Call the [notify](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#notify) method to push notifications from the phone-side app to the wearable. 
```typescript
// Step 3: Obtain the NotifyClient object.
let notifyClient: wearEngine.NotifyClient = wearEngine.getNotifyClient(this.getUIContext().getHostContext());

// Step 4: Construct the NotificationOptions object.
let button1: wearEngine.NotificationButton = {
  buttonId: wearEngine.ButtonId.FIRST_BUTTON,
  // The maximum length for the button content is 12 bytes.
  content: 'button_1'
}
let type1Notification: wearEngine.Notification = {
  type: wearEngine.NotificationType.NOTIFICATION_WITH_ONE_BUTTON,
  // The maximum length for the bundle name and title is 28 bytes.
  bundleName: 'bundleName',
  title: 'title',
  // The maximum length for the message content is 400 bytes.
  text: 'text',
  buttons: [button1]
}
let options: wearEngine.NotificationOptions = {
  notification: type1Notification,
  onAction: (feedback: wearEngine.NotificationFeedback) => {
    console.info(`one button notify get feedback is ${feedback.action ? feedback.action : feedback.errorCode}`);
  }
}

// Step 5: Send a template-based notification to the device.
notifyClient.notify(targetDevice.randomId, options).then(result => {
  console.info(`Succeeded in sending notification.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to send notification. Code is ${error.code}, message is ${error.message}`);
})
```
