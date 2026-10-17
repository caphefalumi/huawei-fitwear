<!--
  Title: NotifyClient
  Catalog: connectivity-References
  Document ID: notifyclient-0000001060330666
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/notifyclient-0000001060330666
-->
# NotifyClient

| java.lang.Object \|---com.huawei.wearengine.notify.NotifyClient 
```
public final class NotifyClient
extends java.lang.Object
```
 |
| --- |

It is the client used for sending notifications.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [notify](https://developer.huawei.com/consumer/en/doc/connectivity-References/notifyclient-0000001060330666#EN-US_TOPIC_0000001874111246__notify-com_huawei_wearengine_device_Device-com_huawei_wearengine_notify_Notification-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) notification) Sends a notification to a specified device. |

#### Method Detail

## notify

public com.huawei.hmf.tasks.Task<java.lang.Void> notify([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) notification)

It is used to send a notification to a specified device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Indicates the wearable device for receiving notifications. |
| notification | Indicates the notification received by the wearable device. |

**Returns:**

The notification result.

**Since:**

API level 2 (SDK 5.0.1.300)
