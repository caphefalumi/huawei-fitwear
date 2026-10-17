<!--
  Title: Class
  Catalog: connectivity-References
  Document ID: we-ios-wesmonitorclient-class-0000001898103114
  Updated: 2026-07-25 02:34:07
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/we-ios-wesmonitorclient-class-0000001898103114
-->
# Class

| NSObject \|---WearEngineSDK.WESMonitorClient |
| --- |

Client used for reporting events, for example, the connection status between a device and a mobile phone.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [subscribeStatusOfDevice](#section16552950197) Subscribes to the device status. |
| void | [unsubscribeStatusOfDevice](#section161612521497) Unsubscribes from the device status. |

## subscribeStatusOfDevice

- (void)subscribeStatusOfDevice:(WESDevice *)device callback:(WESConnectCallback)callback;

Subscribes to the device status.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device. |
| callback | Callback used for subscribing to result and device status. |

## unsubscribeStatusOfDevice

- (void)unsubscribeStatusOfDevice:(WESDevice *)device callback:(WESConnectCallback)callback;

Unsubscribes from the device status.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device. |
| callback | Callback indicating whether the unsubscription is successful. |
