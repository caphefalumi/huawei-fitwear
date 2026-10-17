<!--
  Title: Class
  Catalog: connectivity-References
  Document ID: we-ios-wesp2pclient-class-0000001897319430
  Updated: 2026-07-25 02:34:07
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/we-ios-wesp2pclient-class-0000001897319430
-->
# Class

| NSObject \|---WearEngineSDK.WESP2PClient |
| --- |

Client for P2P communication.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [ping](#section229118515360) Checks whether an app on a wearable device that needs to be communicated with is running. |
| void | [isAppInstalled](#section459201316365) Checks whether the specified app is installed on the wearable device. |
| void | [getAppVersion](#section156970158362) Checks the version of the app installed on the specified device. **-1** is returned if the app is not installed. |
| void | [send](#section20780101610361) Sends the communication message to the app on the wearable device. |
| void | [registerReceiver](#section154581017173613) Registers a callback object for receiving messages with a specified app on a specified device. |
| void | [unRegisterReceiver](#section918315181360) Unregisters a registered callback object for receiving messages. |

## ping

- (void)ping:(WESDevice *)device

srcPkgName:(NSString *)srcPkgName

destPkgName:(NSString *)destPkgName

pingCallback:(WESPingCallback)callback;

Checks whether an app on a wearable device that needs to be communicated with is running.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device object to be communicated. |
| srcPkgName | App package name on the iOS phone. |
| destPkgName | App package name on the wearable device. |
| callback | Callback of the ping message result. |

## isAppInstalled

- (void)isAppInstalled:(WESDevice *)device

targetPkgName:(NSString *)targetPkgName

srcPkgName:(NSString *)srcPkgName

callback:(WESDataCallback)callback;

Checks whether the specified app is installed on the wearable device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device object to be communicated. |
| srcPkgName | App package name on the iOS phone. |
| targetPkgName | App package name on the wearable device. |
| callback | Callback of the app installation result. |

## getAppVersion

- (void)getAppVersion:(WESDevice *)device

targetPkgName:(NSString *)targetPkgName

srcPkgName:(NSString *)srcPkgName

callback:(WESDataCallback)callback;

Checks the version of the app installed on the specified device. **-1** is returned if the app is not installed.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device object to be communicated. |
| srcPkgName | App package name on the iOS phone. |
| targetPkgName | App package name on the wearable device. |
| callback | Callback for the result of checking the installed app version on the specified device. |

## send

- (void)send:(WESDevice *)device

message:(WESP2PMessage *)message

srcInfo:(WESIdentityInfo *)srcInfo

destInfo:(WESIdentityInfo *)destInfo

sendCallback:(WESSendCallback)callback;

Sends the communication message to the app on the wearable device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device. |
| message | Message content. |
| srcInfo | App information on the iOS phone. |
| destInfo | App information on the wearable. |
| callback | Callback for passing the message sending result and device status. |

## registerReceiver

- (void)registerReceiver:(WESDevice *)device

srcInfo:(WESIdentityInfo *)srcInfo

destInfo:(WESIdentityInfo *)destInfo

receiverCallback:(WESReceiverCallback)callback;

Registers a callback object for receiving messages with a specified app on a specified device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device. |
| srcInfo | App information on the iOS phone. |
| destInfo | App information on the wearable. |
| callback | Callback for passing the subscription result and message content. |

## unRegisterReceiver

- (void)unRegisterReceiver:(WESDevice *)device

srcInfo:(WESIdentityInfo *)srcInfo

destInfo:(WESIdentityInfo *)destInfo

receiverCallback:(WESReceiverCallback)callback;

Unregisters a registered callback object for receiving messages.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device. |
| srcInfo | App information on the iOS phone. |
| destInfo | App information on the wearable. |
| callback | Callback for passing the unsubscription result. |

## cancelFileTransfer

- (void)cancelFileTransfer:(WESDevice *)device

fileIdentification:(WESFileIdentification *)fileIdentification

srcInfo:(WESIdentityInfo *)srcInfo

destInfo:(WESIdentityInfo *)destInfo

cancelFileTransferCallback:(WESCancelFileTransferCallback)callback;

Cancels file sending.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Specified device. |
| fileIdentification | Information about the file whose sending is to be canceled. |
| srcInfo | App information on the iOS phone. |
| destInfo | App information on the wearable. |
