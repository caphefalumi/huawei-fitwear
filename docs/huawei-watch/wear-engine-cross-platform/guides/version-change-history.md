<!--
  Title: Version Change History
  Catalog: connectivity-Guides
  Document ID: version-change-history-0000001086350238
  Updated: 2026-04-07 07:42:02
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/version-change-history-0000001086350238
-->
# Version Change History

#### 5.0.3.304 (2025-07-04)

| **Modified Features:** Added support for Android 14. |
| --- |

> **Note:** The Huawei Health app must be version 14.0.12.310 or later.

#### Earlier Versions

## 5.0.3.303 (2024-03-18)

| **Modified Features:** Optimized the internal verification logic to improve stability and performance. |
| --- |

> **Note:** The Huawei Health app must be version 14.0.12.310 or later.

## 5.0.3.302 (2023-09-05)

| **Modified Features:** Optimized the internal verification logic to improve security and performance. |
| --- |

> **Note:** The Huawei Health app must be version 13.1.6.300 or later.

## 5.0.3.301 (2023-04-25)

| **New Features:** • Added [MONITOR_ITEM_POWER_MODE](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#section1932264143916) to MonitorItem to query the device mode and subscribe to device mode switching events. For details, see [Querying and Subscribing to Status](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/monitoring-device-status-0000001050785756). • Added the [getDeviceType](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section1897065074420) method to the Device object to obtain the device type. For details, see [getDeviceType](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section1897065074420). |
| --- |

> **Note:** The Huawei Health app must be version 13.1.3.300 or later.

## 5.0.2.310 (2023-01-20)

| **New Features:** • Added the **DEVICE_SN** permission to control whether **getDeviceSn** can be used to obtain the device SN. • Added the **getDeviceSn** method to obtain the SN of wearable devices. For details, see [Querying the SN of a Wearable Device](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152#section14541443283). |
| --- |

> **Note:** The Huawei Health app must be version 13.1.1.300 or later.

## 5.0.2.309 (2022-09-09)

| **New Features:** • Added queryDeviceCapability to query whether the wearable device supports a certain capability set. For details, see [Querying Whether the Wearable Device Supports a Certain Capability Set](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152#section1627762313). • Added **getDeviceCategory** to obtain the all-scenario category to which the device belongs. For details, see [getDeviceCategory](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__section2041011520614). |
| --- |

> **Note:** The Huawei Health app must be version 12.1.8.300 or later.

## 5.0.2.306 (2022-02-09)

| **New Features:** • Added [getAppVersion](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#section1545919591033) to query the version number of your wearable app. For details, refer to [Obtaining the Version Number of the App on the Wearable Device](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209#section112106597136). • Added [getCommonDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#section35971727163219) to obtain the list of paired devices that have the Wear Engine capabilities. Added [getP2pCapability](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section10259112594716), [getMonitorCapability](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section599145914319), and [getNotifyCapability](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section165631894415) to query whether the open capabilities of Wear Engine are supported on the wearable device. For details, refer to [Obtaining Wearable Devices That Support Wear Engine](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/device-connection-management-0000001050779152#section630575318466). • Added [getSoftwareVersion](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#section172824191612) to obtain the version number of the wearable device. |
| --- |

> **Note:** The Huawei Health app must be version 12.1.1.120 or later.

## 5.0.1.302 (2021-05-27)

| **New Features:** • Changed the permission classification from [Device management](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/permission-data-earlier-0000001153383793#EN-US_TOPIC_0000001919950553__p144135716461), [Message notification](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/permission-data-earlier-0000001153383793#EN-US_TOPIC_0000001919950553__p9640134154416) permissions to [Basic device information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p144135716461), [Message notification](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p9640134154416), [Wearable user status](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p281553519149) permissions. • Added openness to individual developers. (Only the [Basic device information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p144135716461) and [Message notification](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p9640134154416) permissions can be applied for.) |
| --- |

## 5.0.1.301 (2021-02-05)

| **New Features:** [App-to-App Message Communications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209): Added support for checking whether your app has been installed on the wearable device and for canceling the sending of files. |
| --- |

## 5.0.1.300 (2020-12-25)

| **Modified Features:** If users are using the Huawei Health app version 11.0.3.512 or later and have not granted permissions for your app, your app will be granted with [NOTIFY](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__NOTIFY) and [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) permissions by default. Ensure that permissions required by your app have been approved after [applying for the Wear Engine service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982). **New Features:** • [App-to-App Message Communications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209): Added support for receiving files sent from wearable apps. • [Querying and Subscribing to Status](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/monitoring-device-status-0000001050785756): Added support for querying or subscribing to the connection status, available space, battery level, charging status, and wearing status of the wearable device, and subscribing to users' heart rate alerts. • [Template-based Notifications on Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/wearable-device-notification-0000001057412109): Added support for sending notifications to the wearable device from your phone app. • [Obtaining the API Level of Wear Engine](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/obtains-api-level-0000001063993525): Added support for obtaining the API level information from both the Wear Engine client and server. |
| --- |

> **Note:** The Huawei Health app must be version 11.0.1.512 or later.

## 5.0.0.301 (2020-10-26)

| **New Features:** Added the [checkPermission](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__checkPermission-com_huawei_wearengine_auth_Permission-) and [checkPermissions](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__checkPermissions-com_huawei_wearengine_auth_Permission:A-) methods for querying whether a user has granted permissions for your app. For details, refer to [Querying User Authorization Results](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/requesting-user-authorization-0000001050819181#section2689154763012). |
| --- |

> **Note:** The Huawei Health app must be version 10.1.2.548 or later.

## 5.0.0.300 (2020-09-25)

| Huawei Health has introduced the brand new Wear Engine, version 5.0.0.300. This update added new features such as allowing your phone app to obtain a list of connected wearable devices and subscribe to their connection status; and added support for P2P messaging between your phone app and wearable app and P2P file transfers from your phone app to the wearable app. Update Wear Engine to try it out! |
| --- |

> **Note:** The Huawei Health app must be version 10.1.2.513 or later.
