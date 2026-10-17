<!--
  Title: Querying Wearable Device Information
  Catalog: connectivity-Guides
  Document ID: device-connection-management-0000001050779152
  Updated: 2025-10-13 02:54:15
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/device-connection-management-0000001050779152
-->
# Querying Wearable Device Information

Before obtaining the device list, apply for the [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) permission from the user on the phone (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/requesting-user-authorization-0000001050819181)), otherwise you may fail to obtain the device list.

#### Obtaining Wearable Devices That Support App-to-App Message Communications

Obtain the list of paired Huawei wearable devices using your phone app (only devices that support [App-to-App Message Communications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209)) and select the device to be operated from the list.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_content_Context-) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) object.
- Call the [getBondedDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getBondedDevices--) method to obtain the paired device list. > **Note:** If the user is using the Huawei Health app version 11.0.3.512 or later, the UUID of the device will change after the user unpairs and re-pairs the same device. If the cached device is used to call the service API, the UUID may be invalid ([ERROR_CODE_DEVICE_UUID_IS_INVALID](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_UUID_IS_INVALID)). In this case, you are advised to use the **getBondedDevices** method to obtain the device list again. For details about the device information, refer to the [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) object.
- From the device list, select the device that requires further operations. (This is an optional step and only required when you want to integrate features such as [app-to-app message communications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209).) The device you selected needs to be a connected device, otherwise the operation may fail. > **Note:** The Huawei Health app can be paired with multiple wearable devices, but can only connect to one device at a time. The device connection status returned by [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--) is not real-time status, but is the status returned when the [getBondedDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getBondedDevices--) method is called. For details about how to subscribe to the real-time device connection status, refer to [Querying and Subscribing to Status](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/monitoring-device-status-0000001050785756). 
```cpp
// Store the paired device list.
final List<Device> deviceList = new ArrayList<>();

// Step 1: Obtain the DeviceClient object.
DeviceClient deviceClient = HiWear.getDeviceClient(this);

// Step 2: Obtain the list of paired devices.
deviceClient.getBondedDevices()
    .addOnSuccessListener(new OnSuccessListener<List<Device>>() {
        @Override
        public void onSuccess(List<Device> devices) {
            // The device list is obtained.
            deviceList.addAll(devices);
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Process logic when the device list fails to be obtained.
        }
    });

// Step 3: Select the device that requires further operations from the device list. The device you selected needs to be a connected device; otherwise the operation may fail.
Device connectedDevice = null;
if (deviceList != null && !deviceList.isEmpty()){
    // Note: This part describes the code logic for obtaining connected devices. You need to modify the code logic based on the actual situation and requirements.
    for(Device device : deviceList){
        if(device.isConnected()){
            connectedDevice = device;
        }
    }
}
```
 Obtain the [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) object from the device list and call [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--) from the **Device** object to check the device connection status (**true**: connected; **false**: not connected). 
```cpp
device.isConnected();
```

#### Obtaining Wearable Devices That Support Wear Engine

Only wearable devices that support app-to-app message communications can be obtained using the [getBondedDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getBondedDevices--) method. Those that do not support this capability but support other capabilities of Wear Engine can be obtained using the [getCommonDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#section35971727163219) method.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_content_Context-) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) object.
- Call the [getCommonDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#section35971727163219) method to obtain the paired device list. > **Note:** Only [wearable devices that are integrated with Wear Engine](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/service-introduction-0000000000018585#section14370945135215) can be obtained using the [getCommonDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#section35971727163219) method. If the user is using the Huawei Health app version 11.0.3.512 or later, the UUID of the device will change after the user unpairs and re-pairs the same device. If the cached device is used to call the service API, the UUID may be invalid ([ERROR_CODE_DEVICE_UUID_IS_INVALID](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_UUID_IS_INVALID)). In this case, you are advised to use the [getCommonDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#section35971727163219) method to obtain the device list again. For details about the device information, refer to the [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) object.
- From the device list, select the device that requires further operations. (This is an optional step and only required when you want to integrate features such as [app-to-app message communications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209).) The device you selected needs to be a connected device, otherwise the operation may fail. > **Note:** The Huawei Health app can be paired with multiple wearable devices, but can only connect to one device at a time. 
```cpp
// Store the paired device list.
final List<Device> deviceList = new ArrayList<>();

// Step 1: Obtain the DeviceClient object.
DeviceClient deviceClient = HiWear.getDeviceClient(this);

// Step 2: Obtain the list of paired devices.
deviceClient.getCommonDevice()
    .addOnSuccessListener(new OnSuccessListener<List<Device>>() {
        @Override
        public void onSuccess(List<Device> devices) {
            // The device list is obtained.
            deviceList.addAll(devices);
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Process logic when the device list fails to be obtained.
        }
    });

// Step 3: Select the device that requires further operations from the device list. The device you selected needs to be a connected device; otherwise the operation may fail.
Device connectedDevice = null;
if (deviceList != null && !deviceList.isEmpty()){
    // Note: This part describes the code logic for obtaining connected devices. You need to modify the code logic based on the actual situation and requirements.
    for(Device device : deviceList){
        if(device.isConnected()){
            connectedDevice = device;
        }
    }
}
```

- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) object from the device list and call [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--) from the **Device** object to check the device connection status (**true**: connected; **false**: not connected). 
```cpp
device.isConnected();
```

- Call the [getP2pCapability](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section10259112594716), [getMonitorCapability](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section599145914319), and [getNotifyCapability](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section165631894415) APIs from the **Device** object to determine whether the device supports app-to-app message communications, status query and subscription, and template-based notifications, respectively. The return value can be **0** (supported), **1** (not supported), or **2** (unknown). 
```cpp
// Determine whether the device supports app-to-app message communications.
device.getP2pCapability();
// Determine whether the device supports status query and subscription.
device.getMonitorCapability();
// Determine whether the device supports template-based notifications.
device.getNotifyCapability();
```

#### Querying Whether the Wearable Device Supports a Certain Capability Set

The **queryDeviceCapability** method is used to query whether the wearable device supports a certain capability set. Currently, only the query of whether the device supports the CBTI capability set is supported. The query ID is **128**.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_content_Context-) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) object.
- Call [getBondedDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getBondedDevices--) or [getCommonDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#section35971727163219) to obtain the list of paired devices.
- Select the device that requires further operations from the device list. The device you selected needs to be a connected device; otherwise the operation may fail. 
```cpp
// Store the paired device list.
final List<Device> deviceList = new ArrayList<>();

// Step 1: Obtain the DeviceClient object.
DeviceClient deviceClient = HiWear.getDeviceClient(this);

// Step 2: Obtain the list of paired devices.
deviceClient.getCommonDevice()
    .addOnSuccessListener(new OnSuccessListener<List<Device>>() {
        @Override
        public void onSuccess(List<Device> devices) {
            // The device list is obtained.
            deviceList.addAll(devices);
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Process logic when the device list fails to be obtained.
        }
    });

// Step 3: Select the device that requires further operations from the device list. The device you selected needs to be a connected device; otherwise the operation may fail.
Device connectedDevice = null;
if (deviceList != null && !deviceList.isEmpty()){
    // Note: This part describes the code logic for obtaining connected devices. You need to modify the code logic based on the actual situation and requirements.
    for(Device device : deviceList){
        if(device.isConnected()){
            connectedDevice = device;
        }
    }
}
```

- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) object from the device list and call [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--) from the **Device** object to check the device connection status (**true**: connected; **false**: not connected). 
```cpp
device.isConnected();
```

- Call **queryDeviceCapability** from the **Device** object to query whether the device supports a certain capability set. If the return value is **0**, the device supports the capability set. If the return value is **1**, the device does not support the capability set. 
```cpp
//Query whether the device supports the CBTI capability set. device: connected device object; 128: whether the device supports the CBTI capability set.
deviceClient.queryDeviceCapability(device, 128)    
    .addOnSuccessListener(new OnSuccessListener<Integer>() {
        @Override        
        public void onSuccess(Integer integer) {
            // The device capability set is successfully queried.
            // Device.DEVICE_CAPABILITY_SUPPORT: supported
            // DEVICE_CAPABILITY_NOT_SUPPORT: not supported
            if(integer == Device.DEVICE_CAPABILITY_SUPPORT){
            //Process logic when the device supports the CBTI capability set.
            }        
        }    
    })    
    .addOnFailureListener(new OnFailureListener() {
        @Override        
        public void onFailure(Exception e) {
            // Process logic when the device capability set fails to be queried.
        }    
    });
```

#### Querying the SN of a Wearable Device

Use **getDeviceSn** to query the SN of a wearable device. Before doing so, apply for the **DEVICE_SN** permission from the phone user (for details, see [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/requesting-user-authorization-0000001050819181)). Otherwise, the device SN will fail to be obtained.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_content_Context-) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) object.
- Call the [getCommonDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#section35971727163219) method to obtain the paired device list.
- Call **getDeviceSn** of the [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) object to query the SN of a wearable device. 
```cpp
// Query the SN of the wearable device. The DEVICE_SN permission is required.
deviceClient.getDeviceSn(device)    
    .addOnSuccessListener(new OnSuccessListener<String>() {
        @Override        
        public void onSuccess(String deviceSn) {
            //Process logic when the device SN is successfully queried.
            Log.i(TAG, "getDeviceSn: " + devicesSn);
        }    
    })    
    .addOnFailureListener(new OnFailureListener() {
        @Override        
        public void onFailure(Exception e) {
            // Process logic when the device SN fails to be queried.
        }    
    });
```
