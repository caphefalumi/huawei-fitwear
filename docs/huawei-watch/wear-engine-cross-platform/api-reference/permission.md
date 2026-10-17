<!--
  Title: Permission
  Catalog: connectivity-References
  Document ID: permission-0000001059433005
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/permission-0000001059433005
-->
# Permission

| java.lang.Object \|---com.huawei.wearengine.auth.Permission 
```
public class Permission
extends java.lang.Object
implements android.os.Parcelable
```
 |
| --- |

Permission object of Wear Engine. It encapsulates the permissions specified by Wear Engine. Currently, the **DEVICE_MANAGER**, **NOTIFY**, and **WEAR_USER_STATUS** permissions are included.

For details about how to apply for permissions, see the developer guide.

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) | [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) (basic device information): scans, pairs, and unpairs devices; obtains the device status, available space, battery level, and charging status; shares messages and files between the app on the phone and the app on the wearable device. |
| static [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) | [NOTIFY](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__NOTIFY) (message notifications): sends template-based messages to devices. To use **NotifyClient** APIs, you need to apply for this permission. |
| static [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) | [WEAR_USER_STATUS](#section1423182224014) (wearable user status): queries and subscribes to users' wearing status; subscribes to users' heart rate alerts. |
| static [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) | [DEVICE_SN](#section8848193515365) (device SN): obtains the SN of the paired wearable device. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| java.lang.String | [getName](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__getName--)() Obtains a permission name. |

#### Field Detail

## DEVICE_MANAGER

public static final [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) DEVICE_MANAGER

Basic device information: scans, pairs, and unpairs devices; obtains the device status, available space, battery level, and charging status; shares messages and files between the app on the phone and the app on the wearable device.

To use **DeviceClient**, **P2pClient**, and **MonitorClient** APIs, you need to apply for these permissions.

**Since:**

API level 0 (SDK 5.0.0.301)

## NOTIFY

public static final [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) NOTIFY

Message notification: sends template-based messages to devices. To use **NotifyClient** APIs, you need to apply for this permission.

**Since:**

API level 2 (SDK 5.0.1.300)

## WEAR_USER_STATUS

public static final [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) WEAR_USER_STATUS

Wearable user status: queries and subscribes to users' wearing status; subscribes to users' heart rate alerts.

To use **MonitorClient** APIs, you need to apply for this permission.

**Since:**

API level 6 (SDK 5.0.1.302)

## DEVICE_SN

public static final [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) DEVICE_SN

Device SN: obtains the SN of the paired wearable device.

To obtain the device SN, you need to apply for this permission.

**Since:**

API level 11 (SDK 5.0.2.310)

#### Method Detail

## getName

public java.lang.String getName()

It is used to obtain a permission name.

**Returns:**

Permission name.

**Since:**

API level 0 (SDK 5.0.0.301)
