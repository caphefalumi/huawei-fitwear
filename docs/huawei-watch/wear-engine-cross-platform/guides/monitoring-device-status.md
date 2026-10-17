<!--
  Title: Querying and Subscribing to Status
  Catalog: connectivity-Guides
  Document ID: monitoring-device-status-0000001050785756
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/monitoring-device-status-0000001050785756
-->
# Querying and Subscribing to Status

- Query the available space and battery level of a wearable device in real time.
- Subscribe to the connection status, low battery level alerts, and heart rate alerts of a wearable device.
- Query and subscribe to the charging status, wearing status, and device mode of a wearable device.

Before using this API, apply for the required permission from the user on the phone (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/requesting-user-authorization-0000001050819181)).

| Wearable Status and Health Status | Permission | Query Result | Trigger Condition for Subscription | Subscription Result |
| --- | --- | --- | --- | --- |
| Connection | Basic device information [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) | N/A Check the connection status of the wearable device by referring to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152). | • 2: The phone and the wearable device are connected. • 3: The phone is disconnected from the wearable device. (By disconnecting Bluetooth or enlarging the distance between two devices.) | • 2: The phone and the wearable device are connected. • 3: The wearable device is disconnected from the phone. • 4: Two devices are unable to connect. • 5: The device is deleted. |
| Available space | Available space (for example: 20480) | N/A | N/A |  |
| Battery | Battery level (for example, 97) | The battery level of the wearable device decreases by 1% (for example, from 98% to 97%), and the device is not being charged. | Battery level (for example, 97) |  |
| Charging | • 1: The wearable device is being charged. • 2: The wearable device is not being charged. • 3: The device is being fully charged. | • 1: Charge the wearable device. • 2: Stop charging the wearable device. • 3: The wearable device is fully charged. | • 1: The charging starts. • 2: The charging ends. • 3. The charging completes. |  |
| Device mode | • –1: The device does not support mode switching. • 0: The device is in standard mode. • 1: The device is in ultra-long battery life mode. | • 0: The device switches from ultra-long battery life mode to standard mode. • 1: The device switches from standard mode to ultra-long battery life mode. | • 0: The device is in standard mode. • 1: The device is in ultra-long battery life mode. |  |
| Wearing | Wearable user status [WEAR_USER_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#section1423182224014) (only for enterprise developers) | • 1: The wearable device is worn. • 2: The wearable device is not worn. | • 1. The wearable device is worn on the wrist. • 2. The wearable device is removed from the wrist. | • 1: The wearable device is worn. • 2: The wearable device is not worn. |
| Heart rate alerts | N/A | • 1: The resting heart rate is above the upper limit for 10 consecutive minutes. • 2: The resting heart rate is below the lower limit for 10 consecutive minutes. • 3: The exercise heart rate is too high. • 4: The exercise heart rate is too low. Note: Open the **Huawei Health** app, touch **Devices** and the connected device, and go to **Health monitoring** > **Continuous heart rate monitoring**. (The "heart rate" refers to the "resting heart rate".) | • 1: The resting heart rate is too high. • 2: The resting heart rate is too low. • 3: The exercise heart rate is too high. • 4: The exercise heart rate is too low. |  |

> **Note:** The wearable device status can be obtained by your phone app even though you don't have the app installed on the wearable device. Ensure that the wearable device is connected to the Huawei Health app when querying or subscribing to the status including the battery level, charging status, wearing status, and heart rate alerts. Users can query the connection status on the **Devices** screen in the Huawei Health app. You can call the [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--) method to query whether the wearable device is connected (**true**: connected; **false**: not connected) and remind the user to re-connect the device. In version 5.0.1.302, you will need to apply for the [WEAR_USER_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#section1423182224014) permission to query and subscribe to the wearing status and heart rate alerts.

#### Querying the Available Space of the Wearable Device

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) object.
- Call the [getAvailableKbytes](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getAvailableKbytes-com_huawei_wearengine_device_Device-) method to obtain the available space of the specified device. 
```cpp
// Step 2: Obtain the DeviceClient object.
DeviceClient deviceClient = HiWear.getDeviceClient(this);

// Step 3: Obtain the available space of the specified device.
if (connectedDevice != null && connectedDevice.isConnected()) {
    deviceClient.getAvailableKbytes(connectedDevice).addOnSuccessListener(new OnSuccessListener<Integer>() {
        @Override
        public void onSuccess(Integer integer) {
            // Return the available storage space (KB) of a specified device.
        }
    }).addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
        // Process the logic related to the failure to query the available storage space of a specified device.
        }
    });
}
```

#### Querying Other Status

In addition to the available space, other states of the wearable device and health data may be obtained by calling the [query](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__query-com_huawei_wearengine_device_Device-com_huawei_wearengine_monitor_MonitorItem-) method in the [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) object. A maximum of one status can be queried at one time.

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call the [getMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getMonitorClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) object.
- Call the [query](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__query-com_huawei_wearengine_device_Device-com_huawei_wearengine_monitor_MonitorItem-) method to query the status of the specified indicator. Use the [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) object to query the status of the specified indicator. Currently, the following status can be queried: Battery status: [MONITOR_POWER_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_POWER_STATUS).
- Charging status: [MONITOR_CHARGE_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_CHARGE_STATUS).
- Wearing status: [MONITOR_ITEM_WEAR](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_WEAR).
- Device mode: [MONITOR_ITEM_POWER_MODE](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#section1932264143916).

- Use the [MonitorData](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124) object to return the specified device status result. Sample code (Querying the wearing status is used as an example.) 
```cpp
// Step 2: Obtain the MonitorClient object.
MonitorClient monitorClient = HiWear.getMonitorClient(this);

// Step 3: Query the status of the specified indicator.
if (connectedDevice != null && connectedDevice.isConnected()) {
    monitorClient.query(connectedDevice, MonitorItem.MONITOR_ITEM_WEAR)
        .addOnSuccessListener(new OnSuccessListener<MonitorData>() {
            @Override
            public void onSuccess(MonitorData monitorData) {
                // Process the events related to the successful query.
                int wearStatus = monitorData.asInt();
                // 1: worn
                // 2: not worn
                if(wearStatus == 1){
                    // Process the logic related to the wearing status.
                }
            }
        })
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                // Process the events related to the failed query.
            }
        });
}
```

#### Subscribing to a Single Status

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call the [getMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getMonitorClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) object.
- Define the callback object **monitorListener** of the subscription task.
- Call the [register](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__register-com_huawei_wearengine_device_Device-com_huawei_wearengine_monitor_MonitorItem-com_huawei_wearengine_monitor_MonitorListener-) method to subscribe to the status changes of a specified indicator. Use the [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) object to subscribe to the status of the wearable device and health data. Currently, the following status can be subscribed to: Device connection status: [MONITOR_ITEM_CONNECTION](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_CONNECTION).
- Battery level decrease status: [MONITOR_ITEM_LOW_POWER](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_LOW_POWER).
- Charging status: [MONITOR_CHARGE_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_CHARGE_STATUS).
- Wearing status: [MONITOR_ITEM_WEAR](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_WEAR).
- Heart rate alerts: [MONITOR_ITEM_HEART_RATE_ALARM](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_HEART_RATE_ALARM).
- Device mode: [MONITOR_ITEM_POWER_MODE](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#section1932264143916).

- Use the [MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) object to return the subscribed results for the device connection.

Sample code (Subscribing to the wearing status is used as an example.)

```cpp
// Step 2: Obtain the MonitorClient object.
MonitorClient monitorClient = HiWear.getMonitorClient(this);

// Step 3: Define the callback object of the subscribed task.
MonitorListener monitorListener = new MonitorListener() {
    @Override
    public void onChanged(int errorCode, MonitorItem monitorItem, MonitorData monitorData) {
        // Process the status change of the specified indicator of the wearable device.
        // Determine the wearing status of the device.
        if(MonitorItem.MONITOR_ITEM_WEAR.getName().equals(monitorItem.getName())){
            int wearStatus = monitorData.asInt();
            // 1: worn
            // 2: not worn
            if(wearStatus == 1){
                // Process the logic related to the wearing status.
            }
        }       
    }
};

//Step 4: Subscribe to the wearing status changes.
if (connectedDevice != null && connectedDevice.isConnected()) {
    monitorClient.register(connectedDevice, MonitorItem.MONITOR_ITEM_WEAR, monitorListener)
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void successVoid) {
                // Process the events related to the successful subscription.
            }
        })
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                // Process the events related to the failed subscription.
            }
        });
}
```

- Call the [unregister](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__unregister-com_huawei_wearengine_monitor_MonitorListener-) method to cancel the subscription to the status changes of the wearable device. 
```cpp
monitorClient.unregister(monitorListener);
```

#### Subscribing to Multiple Statuses

- Refer to [Querying Wearable Device Information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152) to obtain the paired device list and select the device for communications.
- Call the [getMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getMonitorClient-android_content_Context-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) object.
- Define the callback object **monitorListener** of the subscription task.
- Call the [register](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__register-com_huawei_wearengine_device_Device-com_huawei_wearengine_monitor_MonitorItem-com_huawei_wearengine_monitor_MonitorListener-) method to subscribe to the status changes of multiple indicators. Use List<[MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013)> to subscribe to multiple status indicators of the wearable device and health data. Device connection status: [MONITOR_ITEM_CONNECTION](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_CONNECTION).
- Battery level decrease status: [MONITOR_ITEM_LOW_POWER](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_LOW_POWER).
- Wearing status: [MONITOR_ITEM_WEAR](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_WEAR).
- Charging status: [MONITOR_CHARGE_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_CHARGE_STATUS).
- Heart rate alerts: [MONITOR_ITEM_HEART_RATE_ALARM](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_HEART_RATE_ALARM).

- Use the [MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) object to return the subscribed results for the device connection.

```cpp
// Step 2: Obtain the MonitorClient object.
MonitorClient monitorClient = HiWear.getMonitorClient(this);

// Step 3: Define the callback object of the subscribed task.
MonitorListener monitorListener = new MonitorListener() {
    @Override
    public void onChanged(int errorCode, MonitorItem monitorItem, MonitorData monitorData) {
        // Process the status change of the specified indicator of the wearable device.
        // Check whether the device is switched. If the device is switched, use the getBondedDevices method to obtain the device that has been paired with the Huawei Health app by referring to section "Querying Wearable Device Information". In addition, you can call the device.isConnected() method to obtain the device that is currently connected.
        if(MonitorItem.MONITOR_ITEM_CONNECTION.getName().equals(monitorItem.getName())){
            int connectionStatus = monitorData.asInt();
            // 2: Connected
            // 3: Disconnected
            // 4: Unable to connect
            if(connectionStatus == 3){
                // Process the logic related to the disconnection.
            }
        }       
    }
};
ArrayList<MonitorItem> monitorItemList = new ArrayList<>();
monitorItemList.add(MonitorItem.MONITOR_ITEM_CONNECTION);
monitorItemList.add(MonitorItem.MONITOR_ITEM_LOW_POWER);
monitorItemList.add(MonitorItem.MONITOR_ITEM_WEAR);
monitorItemList.add(MonitorItem.MONITOR_CHARGE_STATUS);
monitorItemList.add(MonitorItem.MONITOR_ITEM_HEART_RATE_ALARM);

// Step 4: Subscribe to the status changes of multiple indicators.
if (connectedDevice != null && connectedDevice.isConnected()) {
    monitorClient.register(connectedDevice, monitorItemList, monitorListener)
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                // Process the events related to the failed subscription.
            }
        })
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void successVoid) {
                // Process the events related to the successful subscription.
            }
        });
}
```

- Call the [unregister](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__unregister-com_huawei_wearengine_monitor_MonitorListener-) method to cancel the subscription to the status changes of the wearable device and health data. 
```cpp
monitorClient.unregister(monitorListener);
```
