<!--
  Title: Class
  Catalog: connectivity-References
  Document ID: we-ios-wesdeviceclient-class-0000001937982749
  Updated: 2026-07-25 02:34:07
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/we-ios-wesdeviceclient-class-0000001937982749
-->
# Class

| NSObject \|---WearEngineSDK.WESDeviceClient |
| --- |

Client used for device management. You can use it to connect to and view devices.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| WESDevice* | [getCurrentDevices](#section6464173116407) Obtains the currently connected device. |
| void | [getCommonDevices](#section16552950197) Obtains all devices. |
| void | [connectDevice](#section161612521497) Connects to a device. |

## getCurrentDevices

- (WESDevice *)getCurrentDevices;

Obtains the currently connected device. Only one device can be connected at a time.

**Returns:**

Currently connected device. **NULL** if no device is connected.

## getCommonDevices

- (void)getCommonDevices:(WESGetDeviceCallback)callback;

Obtains the device list.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| callback | Callback function used for returning the device list. |

## connectDevice

- (void)connectDevice:(WESDevice *)device connectCallback:(WESConnectCallback)callback;

Connects to a specified device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device to be connected. |
| callback | Callback used for obtaining the device connection result. |
