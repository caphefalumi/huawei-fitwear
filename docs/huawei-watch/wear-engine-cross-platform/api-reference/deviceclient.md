<!--
  Title: DeviceClient
  Catalog: connectivity-References
  Document ID: deviceclient-0000001060779120
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/deviceclient-0000001060779120
-->
# DeviceClient

| java.lang.Object \|---com.huawei.wearengine.device.DeviceClient 
```
public final class DeviceClient
extends java.lang.Object
```
 |
| --- |

It is the client that is used to operate the device.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| com.huawei.hmf.tasks.Task<java.lang.Integer> | [getAvailableKbytes](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getAvailableKbytes-com_huawei_wearengine_device_Device-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device) Returns the available storage space (in KB) of a specified device. |
| com.huawei.hmf.tasks.Task<java.util.List<[Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971)>> | [getBondedDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getBondedDevices--)() Obtains the list of devices that have the app-to-app message communications capability and have been paired with the Huawei Health app. |
| com.huawei.hmf.tasks.Task<java.util.List<[Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971)>> | [getCommonDevice](#section35971727163219)() Obtains the list of devices that have the Wear Engine capabilities and have been paired with the Huawei Health app. |
| com.huawei.hmf.tasks.Task<java.lang.String> | [getHiLinkDeviceId](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__getHiLinkDeviceId-com_huawei_wearengine_device_Device-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device) Returns the **hiLinkDeviceId** of the device. |
| com.huawei.hmf.tasks.Task<java.lang.Boolean> | [hasAvailableDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__hasAvailableDevices--)() Returns whether there is a device that supports Wear Engine and has been connected to the Huawei Health app. |
| com.huawei.hmf.tasks.Task<java.lang.Integer> | [queryDeviceCapability](#section1140095101717)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, int capabilityID) Queries whether a specified device supports a specified capability set. |
| com.huawei.hmf.tasks.Task<java.lang.String> | [getDeviceSn](#section3242122720118)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device) Obtains the SN of the paired wearable device. |

#### Method Detail

## getBondedDevices

public com.huawei.hmf.tasks.Task<java.util.List<[Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971)>> getBondedDevices()

It is used to obtain the list of devices that have the app-to-app message communications capability and have been paired with the Huawei Health app.

**Returns:**

A task is returned. You can call methods such as **addOnSuccessListener **and** addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## getCommonDevice

public com.huawei.hmf.tasks.Task<java.util.List<[Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971)>> getCommonDevice()

It is used to obtain the list of devices that have the Wear Engine capabilities and have been paired with the Huawei Health app.

**Returns:**

A task is returned. You can call methods such as **addOnSuccessListener **and** addOnFailureListener** to check the task execution result.

**Since:**

API level 8 (SDK 5.0.2.306)

## hasAvailableDevices

public com.huawei.hmf.tasks.Task<java.lang.Boolean> hasAvailableDevices()

It is used to return whether there is a device that supports Wear Engine and has been connected to the Huawei Health app.

**Returns:**

A task is returned. You can call methods such as **addOnSuccessListener **and** addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## getHiLinkDeviceId

public com.huawei.hmf.tasks.Task<java.lang.String> getHiLinkDeviceId([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device)

It is used to return the **hiLinkDeviceId** of the device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object specified by your app for communication. |

**Returns:**

A task is returned. You can call methods such as **addOnSuccessListener **and** addOnFailureListener** to check the task execution result.

**Since:**

API level 2 (SDK 5.0.1.300)

## getAvailableKbytes

public com.huawei.hmf.tasks.Task<java.lang.Integer> getAvailableKbytes([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device)

It is used to return the available storage space (in KB) of a specified device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object. |

**Returns:**

A task is returned. You can call methods such as **addOnSuccessListener **and** addOnFailureListener** to check the task execution result.

**Since:**

API level 2 (SDK 5.0.1.300)

## queryDeviceCapability

public com.huawei.hmf.tasks.Task<java.lang.Integer> queryDeviceCapability([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, int capabilityID)

It is used to query whether a specified device supports a specified capability set.

**Returns:**

A task is returned. You can call methods such as **addOnSuccessListener **and** addOnFailureListener** to check the task execution result.

**Since:**

API level 10 (SDK 5.0.2.309)

## getDeviceSn

public com.huawei.hmf.tasks.Task<java.lang.String> getDeviceSn([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device)

It is used to obtain the SN of the paired wearable device.

**Returns:**

A task is returned. You can call methods such as **addOnSuccessListener **and** addOnFailureListener** to check the task execution result.

**Since:**

API level 11 (SDK 5.0.2.310)
