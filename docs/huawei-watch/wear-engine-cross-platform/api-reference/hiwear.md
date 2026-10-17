<!--
  Title: HiWear
  Catalog: connectivity-References
  Document ID: hiwear-0000001060938716
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/hiwear-0000001060938716
-->
# HiWear

| java.lang.Object \|---com.huawei.wearengine.HiWear 
```
public final class HiWear
extends java.lang.Object
```
 |
| --- |

As a general entrance to the Wear Engine capabilities, it is used to obtain client instances that use the Wear Engine capabilities, such as DeviceClient and P2pClient.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| static [AuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967) | [getAuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getAuthClient-android_app_Activity-)(android.app.Activity activity) Obtains an **AuthClient** instance based on the specified activity. You can use this instance to perform operations related to permission authorization. |
| static [AuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967) | [getAuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getAuthClient-android_content_Context-)(android.content.Context context) Obtains an **AuthClient** instance based on the specified context. You can use this instance to perform operations related to permission authorization. |
| static [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) | [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_app_Activity-)(android.app.Activity activity) Obtains a **DeviceClient** instance based on the specified activity. You can use this instance to perform operations on devices. |
| static [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) | [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_content_Context-)(android.content.Context context) Obtains a **DeviceClient** instance based on the specified context. You can use this instance to perform operations on devices. |
| static [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) | [getMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getMonitorClient-android_app_Activity-)(android.app.Activity activity) Obtains a **MonitorClient** instance based on the specified activity. You can use this instance to listen for event reporting and query status. |
| static [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) | [getMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getMonitorClient-android_content_Context-)(android.content.Context context) Obtains a **MonitorClient** instance based on the specified context. You can use this instance to listen for event reporting and query status. |
| static [NotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/notifyclient-0000001060330666) | [getNotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getNotifyClient-android_app_Activity-)(android.app.Activity activity) Obtains a **NotifyClient** instance based on the specified activity. You can use this instance to implement notifications. |
| static [NotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/notifyclient-0000001060330666) | [getNotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getNotifyClient-android_content_Context-)(android.content.Context context) Obtains a **NotifyClient** instance based on the specified context. You can use this instance to implement notifications. |
| static [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) | [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_app_Activity-)(android.app.Activity activity) Obtains a **P2pClient** instance based on the specified activity. You can use this instance to perform operations related to P2P message communication. |
| static [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) | [getP2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getP2pClient-android_content_Context-)(android.content.Context context) Obtains a **P2pClient** instance based on the specified context. You can use this instance to perform operations related to P2P message communication. |
| static [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) | [getWearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getWearEngineClient-android_app_Activity-com_huawei_wearengine_client_ServiceConnectionListener-)(android.app.Activity activity, [ServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/serviceconnectionlistener-0000001060460910) listener) Obtains a **WearEngineClient** instance based on the specified activity. You can use this instance to monitor the connection status between your app and Wear Engine. |
| static [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) | [getWearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getWearEngineClient-android_content_Context-com_huawei_wearengine_client_ServiceConnectionListener-)(android.content.Context context, [ServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/serviceconnectionlistener-0000001060460910) listener) Obtains a **WearEngineClient** instance based on the specified context. You can use this instance to monitor the connection status between your app and Wear Engine. |

#### Method Detail

## getDeviceClient

public static [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) getDeviceClient(android.content.Context context)

It is used to obtain a **DeviceClient** instance based on the specified context. You can use this instance to perform operations on devices.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | App context. |

**Returns:**

**DeviceClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getDeviceClient

public static [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) getDeviceClient(android.app.Activity activity)

It is used to obtain a **DeviceClient** instance based on the specified activity. You can use this instance to perform operations on devices.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| activity | Activity that a user is interacting with. |

**Returns:**

**DeviceClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getP2pClient

public static [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) getP2pClient(android.content.Context context)

It is used to obtain a **P2pClient** instance based on the specified context. You can use this instance to perform operations related to P2P message communication.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | App context. |

**Returns:**

**P2pClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getP2pClient

public static [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) getP2pClient(android.app.Activity activity)

It is used to obtain a **P2pClient** instance based on the specified activity. You can use this instance to perform operations related to P2P message communication.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| activity | Activity that a user is interacting with. |

**Returns:**

**P2pClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getAuthClient

public static [AuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967) getAuthClient(android.content.Context context)

It is used to obtain an** AuthClient** instance based on the specified context. You can use this instance to perform operations related to permission authorization.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | App context. |

**Returns:**

**AuthClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getAuthClient

public static [AuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967) getAuthClient(android.app.Activity activity)

It is used to obtain an** AuthClient** instance based on the specified activity. You can use this instance to perform operations related to permission authorization.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| activity | Activity that a user is interacting with. |

**Returns:**

**AuthClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getMonitorClient

public static [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) getMonitorClient(android.content.Context context)

It is used to obtain a **MonitorClient **instance based on the specified context. You can use this instance to listen for event reporting and query status.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | App context. |

**Returns:**

**MonitorClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getMonitorClient

public static [MonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorclient-0000001059980975) getMonitorClient(android.app.Activity activity)

It is used to obtain a **MonitorClient **instance based on the specified activity. You can use this instance to listen for event reporting and query status.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| activity | Activity that a user is interacting with. |

**Returns:**

**MonitorClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getNotifyClient

public static [NotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/notifyclient-0000001060330666) getNotifyClient(android.content.Context context)

It is used to obtain a **NotifyClient** instance based on the specified context. You can use this instance to implement notifications.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | App context. |

**Returns:**

**NotifyClient** instance.

**Since:**

API level 2 (SDK 5.0.1.300)

## getNotifyClient

public static [NotifyClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/notifyclient-0000001060330666) getNotifyClient(android.app.Activity activity)

It is used to obtain a **NotifyClient** instance based on the specified activity. You can use this instance to implement notifications.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| activity | Activity that a user is interacting with. |

**Returns:**

**NotifyClient** instance.

**Since:**

API level 2 (SDK 5.0.1.300)

## getWearEngineClient

public static [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) getWearEngineClient(android.content.Context context, [ServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/serviceconnectionlistener-0000001060460910) listener)

It is used to obtain a **WearEngineClient** instance based on the specified context. You can use this instance to listen for the connection status between your app and Wear Engine.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | App context. |
| listener | Listens for the service connection status. |

**Returns:**

**WearEngineClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## getWearEngineClient

public static [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) getWearEngineClient(android.app.Activity activity, [ServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/serviceconnectionlistener-0000001060460910) listener)

It is used to obtain a **WearEngineClient** instance based on the specified activity. You can use this instance to listen for the connection status between your app and Wear Engine.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| activity | Activity that a user is interacting with. |
| listener | Listens for the service connection status. |

**Returns:**

**WearEngineClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)
