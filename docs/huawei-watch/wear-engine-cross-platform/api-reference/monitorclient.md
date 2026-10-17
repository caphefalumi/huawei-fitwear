<!--
  Title: MonitorClient
  Catalog: connectivity-References
  Document ID: monitorclient-0000001059980975
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/monitorclient-0000001059980975
-->
# MonitorClient

| java.lang.Object \|---com.huawei.wearengine.monitor.MonitorClient 
```
public final class MonitorClient
extends java.lang.Object
```
 |
| --- |

It indicates a client used for event reporting and status query, for example, it listens for the connection status between a device and the Huawei Health app.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| com.huawei.hmf.tasks.Task<[MonitorData](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124)> | [query](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__query-com_huawei_wearengine_device_Device-com_huawei_wearengine_monitor_MonitorItem-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) monitorItem) Obtains the value of a specified indicator of a specified device. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [register](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__register-com_huawei_wearengine_device_Device-java_util_List-com_huawei_wearengine_monitor_MonitorListener-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, java.util.List<[MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013)> monitorItemList, [MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) monitorListener) Registers a monitoring object with a specified device to monitor multiple indicators. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [register](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__register-com_huawei_wearengine_device_Device-com_huawei_wearengine_monitor_MonitorItem-com_huawei_wearengine_monitor_MonitorListener-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) monitorItem, [MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) monitorListener) Registers a monitoring object with a specified device to monitor a single indicator. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [unregister](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975#EN-US_TOPIC_0000001874111238__unregister-com_huawei_wearengine_monitor_MonitorListener-)([MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) monitorListener) Deregisters a registered object. |

#### Method Detail

## register

public com.huawei.hmf.tasks.Task<java.lang.Void> register([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) monitorItem, [MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) monitorListener)

It is used to register a monitored object with a specified device to monitor a single indicator.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object to be monitored specified by your app. |
| monitorItem | Indicator type to be monitored and reported |
| monitorListener | Callback object to be registered. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## register

public com.huawei.hmf.tasks.Task<java.lang.Void> register([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, java.util.List<[MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013)> monitorItemList, [MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) monitorListener)

It is used to register an object with a specified device to listen for multiple indicators.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object to be listened for specified by your app. |
| monitorItemList | List of indicator types to be listened for and reported. |
| monitorListener | Callback object to be registered. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## unregister

public com.huawei.hmf.tasks.Task<java.lang.Void> unregister([MonitorListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655) monitorListener)

It is used to deregister a registered object.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| monitorListener | Callback object to be deregistered. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## query

public com.huawei.hmf.tasks.Task<[MonitorData](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124)> query([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) monitorItem)

It is used to obtain the value of a specified indicator of a specified device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object to be queried specified by your app. |
| monitorItem | Indicator type to be queried. |

**Returns:**

The value of a specified indicator of a specified device.

**Since:**

API level 2 (SDK 5.0.1.300)
