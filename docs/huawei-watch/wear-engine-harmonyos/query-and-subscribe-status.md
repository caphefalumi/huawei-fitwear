<!--
  Title: Querying and Subscribing to Status
  Catalog: harmonyos-guides
  Document ID: query_and_subscribe_status
  Updated: 2026-10-14 09:34:23
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_and_subscribe_status
-->
# Querying and Subscribing to Status

> **Note:** To call this API, you need to apply for the basic device information permission and the wearable user status permission on HUAWEI Developers (refer to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply) for details). The wearable user status permission needs to be granted by users.

- Query the available space and battery level of a wearable device in real time.
- Subscribe to the connection status, low battery level alerts, and heart rate alerts of a wearable device.
- Query and subscribe to the charging status, wearing status, and device mode of a wearable device.

Before calling this API, ensure that you have applied for the required permissions for your app (by referring to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply)) and requested the authorization from the phone user (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/request_user_authorization)). Otherwise, the API calling will fail.

**Table1** Permission application: basic device information

| Wearable Status and Health Status | Query Result | Trigger Condition for Subscription | Subscription Result |
| --- | --- | --- | --- |
| Connection | N/A | - **2**: The phone and the wearable device are connected. - **3**: The phone is disconnected from the wearable device (by disabling Bluetooth or increasing the distance between the two devices). | - **2**: The phone and the wearable device are connected. - **3**: The wearable device is disconnected from the phone. - **4**: The connection fails. - **5**: The device is deleted. |
| Available space | Available space, in KB (for example: **20480**) | N/A | N/A |
| Battery | Battery level (for example, **97**) | The wearable's battery level drops by 1% (for example, from 98% to 97%) while not being charged. | Battery level (for example, **97**) |
| Charging | - **1**: The wearable device is being charged. - **2**: The wearable device is not being charged. - **3**: The wearable device is being charged and the battery is fully charged. | - **1**: The wearable device is being charged. - **2**: The wearable device charging stops. - **3**: The wearable device is fully charged. | - **1**: The charging starts. - **2**: The charging ends. - **3**: The charging completes. |
| Device mode | - **-1**: The device does not support mode switching. - **0**: The device is in standard mode. - **1**: The device is in ultra-long battery life mode. | - **0**: The device switches from ultra-long battery life mode to standard mode. - **1**: The device switches from standard mode to ultra-long battery life mode. | - **0**: The device is in standard mode. - **1**: The device is in ultra-long battery life mode. |

**Table2** Permission application: wearable user status **USER_STATUS** (for enterprise developers only)

| Wearable Status and Health Status | Query Result | Trigger Condition for Subscription | Subscription Result |
| --- | --- | --- | --- |
| Wearing | - **1**: The wearable device is worn. - **2**: The wearable device is not worn. | - **1**: The wearable device is worn on the wrist. - **2**: The wearable device is removed from the wrist. | - **1**: The wearable device is worn. - **2**: The wearable device is not worn. |
| Heart rate alerts | N/A | - **1**: The resting heart rate is above the upper limit for 10 consecutive minutes. - **2**: The resting heart rate is below the lower limit for 10 consecutive minutes. - **3**: The exercise heart rate is too high. - **4**: The exercise heart rate is too low. Note: Open the Huawei Health app, go to Devices, and touch **Heart rate** from the app and service list to set the heart rate alert. | - **1**: The resting heart rate is too high. - **2**: The resting heart rate is too low. - **3**: The exercise heart rate is too high. - **4**: The exercise heart rate is too low. |

> **Note:** The wearable device status can be obtained by your phone app even if you do not have a counterpart app installed on the wearable device. Ensure that the wearable device is connected to the Huawei Health app when you query or subscribe to the device status including its battery level, charging status, wearing status, and heart rate alerts. Users can query the connection status on the **Devices** screen in the Huawei Health app. You can determine whether the device is connected to the phone by calling [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices) or by checking the error code. If the device is not connected to the phone, prompt the user to reconnect the device. You will need to apply for the [USER_STATUS](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#permission) permission to query and subscribe to the wearing status and heart rate alerts.

#### Querying Device Status

Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#querystatus) method in the [MonitorClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#monitorclient) object to query the wearable device status. A maximum of one status can be queried at one time.

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getMonitorClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetmonitorclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [MonitorClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#monitorclient) object.
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#querystatus) method to query the specified status. Use the [MonitorItem](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#monitoritem) object to query the specified status. Currently, the following status can be queried: Battery status: **POWER_STATUS**
- Charging status: **CHARGE_STATUS**
- Wearing status: **WEAR_STATUS**
- Device mode: **POWER_MODE**
- Available space: **AVAILABLE_STORAGE_SPACE**

- Use the [MonitorData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#monitordata) object to return the specified device status. 
```typescript
// Step 3: Obtain the MonitorClient object.
let monitorClient: wearEngine.MonitorClient = wearEngine.getMonitorClient(this.getUIContext().getHostContext());

// Step 4: Query a specified status (the wearing status is used as an example).
monitorClient.queryStatus(targetDevice.randomId, wearEngine.MonitorItem.WEAR_STATUS).then((result: wearEngine.MonitorData) => {
  // Obtain the status and process the service logic.
  console.info(`Succeeded in querying wear status, result is ${result.code}.`);
}).catch((error: BusinessError) => {
  // Process the exception captured if the API call fails.
  console.error(`Failed to query wear status. Code is ${error.code}, message is ${error.message}.`);
})
```

#### Subscribing to Device Status

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getMonitorClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetmonitorclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [MonitorClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#monitorclient) object.
- Define the [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-base#callback) object of the subscription task.
- Call the [subscribeEvent](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#subscribeevent) method to subscribe to changes to the specified status. Use the [MonitorEvent](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#monitorevent) object to subscribe to the wearable status and health status. Currently, the following status can be subscribed to: Device connection status: EVENT_CONNECTION_STATUS_CHANGED
- Battery level decrease status: EVENT_BATTERY_LEVEL_DROPPED
- Charging status: EVENT_CHARGE_STATUS_CHANGED
- Wearing status: EVENT_WEAR_STATUS_CHANGED
- Heart rate alerts: EVENT_HEART_RATE_ALARM
- Device mode: EVENT_POWER_MODE_CHANGED

- Use the [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-base#callback)<[MonitorEventData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#monitoreventdata)> object to return the device status.

```typescript
// Step 3: Obtain the MonitorClient object.
let monitorClient: wearEngine.MonitorClient = wearEngine.getMonitorClient(this.getUIContext().getHostContext());

// Step 4: Define the callback function.
let callback = (monitorEventData: wearEngine.MonitorEventData) => {
  // Process the service logic after the status change is detected.
  console.info(`Succeeded in listening change of ${monitorEventData.event}, the new status is ${monitorEventData.data}.`)
}

// Step 5: Call the subscription method.
monitorClient.subscribeEvent(targetDevice.randomId, wearEngine.MonitorEvent.EVENT_WEAR_STATUS_CHANGED, callback).then(() => {
  console.info(`Succeeded in subscribing wear status.`);
}).catch((error: BusinessError) => {
  console.error(`Failed to subscribe wear status. Code is ${error.code}, message is ${error.message}.`);
})
```

- Call the [unsubscribeEvent](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#unsubscribeevent) method to unsubscribe from wearable status and health status changes. (Pass the callback function used during the subscription.) 
```typescript
// Step 6: Cancel the subscription. Ensure that the callback function is the same one used during the subscription.
monitorClient.unsubscribeEvent(targetDevice.randomId, wearEngine.MonitorEvent.EVENT_WEAR_STATUS_CHANGED, callback).then(() => {
  console.info(`Succeeded in unsubscribing wear status`);
}).catch((error: BusinessError) => {
  console.error(`Failed to unsubscribe wear status. Code is ${error.code}, message is ${error.message}.`);
})
```
