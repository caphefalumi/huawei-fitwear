<!--
  Title: Class
  Catalog: connectivity-References
  Document ID: we-ios-hiwear-class-0000001898103106
  Updated: 2026-07-25 02:34:07
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/we-ios-hiwear-class-0000001898103106
-->
# Class

| NSObject \|---WearEngineSDK.HiWear |
| --- |

General entrance to the Wear Engine capabilities. It is used to obtain client instances that use the Wear Engine capabilities, such as **WESDeviceClient** and **WESP2PClient**.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| static [WESAuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesauthclient-0000001897479350) | [getAuthClient](#section612419344112) Obtains an **AuthClient** instance. You can use this instance to perform operations related to permission authorization. |
| static [WESDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesdeviceclient-0000001897479342) | [getDeviceClient](#section81891233142218) Obtains a **WESDeviceClient** instance. You can use this instance to perform operations on devices. |
| static [WESMonitorClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesmonitorclient-0000001897319434) | [getMonitorClient](#section7710184710415) Obtains a **WESMonitorClient** instance. You can use this instance to monitor event reporting and query status. |
| static [WESP2PClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) | [getP2PClient](#section124399485412) Obtains a **WESP2PClient** instance. You can use this instance to perform operations related to P2P message communication. |
| static startLogWithBlock | **startLogWithBlock** Connects to the SDK log output. |

## getAuthClient

+ (WESAuthClient *)getAuthClient;

Obtains a **WESAuthClient** instance. You can use this instance to perform operations related to permission authorization.

**Parameters:**

None

**Returns:**

**WESAuthClient** instance.

## getDeviceClient

+ (WESDeviceClient *)getDeviceClient;

Obtains a **WESDeviceClient** instance. You can use this instance to perform operations on devices.

**Parameters:**

None

**Returns:**

**WESDeviceClient** instance.

## getMonitorClient

+ (WESMonitorClient *)getMonitorClient;

Obtains a **WESMonitorClient** instance. You can use this instance to monitor event reporting and query status.

**Parameters:**

None

**Returns:**

**WESMonitorClient** instance.

## getP2PClient

+ (WESP2PClient *)getP2PClient;

Obtains a **WESP2PClient** instance. You can use this instance to perform operations related to P2P message communication.

**Parameters:**

None

**Returns:**

**WESP2PClient** instance.

## startLogWithBlock

+ (void)startLogWithBlock:(void(^)(NSString *log))logBlock;

Connects to the SDK log output.

**Parameters:**

Callback block for log output.

**Returns:**

None
