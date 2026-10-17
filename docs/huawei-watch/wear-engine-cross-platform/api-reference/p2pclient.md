<!--
  Title: P2pClient
  Catalog: connectivity-References
  Document ID: p2pclient-0000001061098712
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/p2pclient-0000001061098712
-->
# P2pClient

| java.lang.Object \|---com.huawei.wearengine.p2p.P2pClient 
```
public final class P2pClient
extends java.lang.Object
```
 |
| --- |

It is the client used for P2P communication.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [ping](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__ping-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_PingCallback-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [PingCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/pingcallback-0000001060938728) pingCallback) Detects whether an app that needs to be communicated with is running on the wearable device. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [registerReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__registerReceiver-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_Receiver-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [Receiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920) receiver) Registers a callback object for receiving a message or a file with a specified app on a specified device. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [registerReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__registerReceiver-com_huawei_wearengine_p2p_Peer-com_huawei_wearengine_p2p_Receiver-)([Peer](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922) peer, [Receiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920) receiver) Registers a callback object for receiving a message or a file to a specified app on a specified device through a device message object. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [send](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__send-com_huawei_wearengine_device_Device-com_huawei_wearengine_p2p_Message-com_huawei_wearengine_p2p_SendCallback-)([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) message, [SendCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639) sendCallback) Sends messages to the app on the wearable device that needs to be communicated with. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [send](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__send-com_huawei_wearengine_p2p_Peer-com_huawei_wearengine_p2p_Message-com_huawei_wearengine_p2p_SendCallback-)([Peer](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922) peer, [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) message, [SendCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639) sendCallback) Sends messages to the app on the wearable device that needs to be communicated with through a device message object. |
| [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) | [setPeerFingerPrint](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerFingerPrint-java_lang_String-)(java.lang.String fingerPrint) Sets the signing certificate fingerprint to be used on the wearable device side for communication. Otherwise, the communication will fail. |
| [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) | [setPeerPkgName](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__setPeerPkgName-java_lang_String-)(java.lang.String peerPkgName) Indicates the package name of the app that needs to be communicated with on the wearable device. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [unregisterReceiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712#EN-US_TOPIC_0000001920110385__unregisterReceiver-com_huawei_wearengine_p2p_Receiver-)([Receiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920) receiver) Deregisters a registered object. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [cancelFileTransfer](#section219165413392)(final [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, final [FileIdentification](https://developer.huawei.com/consumer/en/doc/connectivity-References/fileidentification-0000001077679542) fileIdentification, final [CancelFileTransferCallBack](https://developer.huawei.com/consumer/en/doc/connectivity-References/cancelfiletransfercallback-0000001093458245) cancelFileTransferCallBack) Cancels sending files to the wearable device that needs to be communicated with. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [cancelFileTransfer](#section14958171316405)(final [Peer](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922) peer, final [FileIdentification](https://developer.huawei.com/consumer/en/doc/connectivity-References/fileidentification-0000001077679542) fileIdentification, final [CancelFileTransferCallBack](https://developer.huawei.com/consumer/en/doc/connectivity-References/cancelfiletransfercallback-0000001093458245) cancelFileTransferCallBack) Cancels sending files to the wearable device that needs to be communicated with through a device message object. |
| com.huawei.hmf.tasks.Task<java.lang.Boolean> | [isAppInstalled](#section12211338104010)(final [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, final String targetPkgName) Checks whether the specified device app has been installed. |
| com.huawei.hmf.tasks.Task<java.lang.Integer> | [getAppVersion](#section1545919591033)(final [Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, final String targetPkgName) Queries the version of the installed specified device app. the value **-1** is returned if the app is not installed. |

#### Method Detail

## ping

public com.huawei.hmf.tasks.Task<java.lang.Void> ping([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [PingCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/pingcallback-0000001060938728) pingCallback)

It is used to check whether an app on a wearable device that needs to be communicated with is online.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object specified by your app for communication. |
| pingCallback | Callback of the ping message result. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## send

public com.huawei.hmf.tasks.Task<java.lang.Void> send([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) message, [SendCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639) sendCallback)

It is used to send messages to an app on a wearable device that needs to be communicated with.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object specified by your app for communication. |
| message | Message specified by your app to be sent. |
| sendCallback | Callback object of the message sending result. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## send

public com.huawei.hmf.tasks.Task<java.lang.Void> send([Peer](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922) peer, [Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) message, [SendCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639) sendCallback)

It is used to send messages to the app on the wearable device that needs to be communicated with through a device message object.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| peer | Message object of the device specified by your app. |
| message | Message specified by your app to be sent. |
| sendCallback | Callback object of the message sending result. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## setPeerPkgName

public [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) setPeerPkgName(java.lang.String peerPkgName)

It is the name of the app package that needs to be communicated with on the wearable device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| peerPkgName | App package name specified by your app for communication. |

**Returns:**

**P2pClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## setPeerFingerPrint

public [P2pClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/p2pclient-0000001061098712) setPeerFingerPrint(java.lang.String fingerPrint)

It is used to set the signing certificate fingerprint for the wearable device that needs to be communicated with. Otherwise, the communication will fail.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| fingerPrint | Fingerprint of the app specified by your app for communication. |

**Returns:**

**P2pClient** instance.

**Since:**

API level 0 (SDK 5.0.0.301)

## registerReceiver

public com.huawei.hmf.tasks.Task<java.lang.Void> registerReceiver([Device](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971) device, [Receiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920) receiver)

It registers a callback object for receiving messages or files with a specified app on a specified device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object specified by your app to be communicated with. |
| receiver | Callback object for receiving messages or files. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 2 (SDK 5.0.1.300)

## registerReceiver

public com.huawei.hmf.tasks.Task<java.lang.Void> registerReceiver([Peer](https://developer.huawei.com/consumer/en/doc/connectivity-References/peer-0000001060460922) peer, [Receiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920) receiver)

It is used to register a callback object for receiving messages or files for a specified app on a specified device through a device message object.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| peer | Peer object that is specified by your app and needs to be communicated with. |
| receiver | Callback object for receiving messages or files. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 2 (SDK 5.0.1.300)

## unregisterReceiver

public com.huawei.hmf.tasks.Task<java.lang.Void> unregisterReceiver([Receiver](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920) receiver)

It is used to deregister a registered callback object for receiving messages or files.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| receiver | Callback function for receiving messages or files, which needs to be deregistered. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 2 (SDK 5.0.1.300)

## cancelFileTransfer

public com.huawei.hmf.tasks.Task<java.lang.Void> cancelFileTransfer(final Device device, final FileIdentification fileIdentification, final CancelFileTransferCallBack cancelFileTransferCallBack)

It cancels sending files to the wearable device that needs to be communicated with.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device object specified by your app to be communicated with. |
| fileIdentification | File identifier specified by your app to cancel sending files. |
| cancelFileTransferCallBack | Callback object for canceling sending files. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 5 (SDK 5.0.1.301)

## cancelFileTransfer

public com.huawei.hmf.tasks.Task<java.lang.Void> cancelFileTransfer(final Peer peer, final FileIdentification fileIdentification, final CancelFileTransferCallBack cancelFileTransferCallBack)

It is used to cancel sending files to the app on the wearable device that needs to be communicated with through a device message object.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| peer | Message object of the device specified by your app. |
| fileIdentification | File identifier specified by your app to cancel sending files. |
| cancelFileTransferCallBack | Callback object for canceling sending files. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 5 (SDK 5.0.1.301)

## isAppInstalled

public com.huawei.hmf.tasks.Task<java.lang.Boolean> isAppInstalled(final Device device, final String targetPkgName)

It is used to check whether the specified app has been installed on the device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| Device | Device object specified by your app to be communicated with. |
| targetPkgName | Package name of an app. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 5 (SDK 5.0.1.301)

## getAppVersion

public com.huawei.hmf.tasks.Task<java.lang.Integer> getAppVersion(final Device device, final String targetPkgName)

It is used to query the version of the installed specified device app. **-1** is returned if the app is not installed.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| Device | Device object specified by your app to be communicated with. |
| targetPkgName | Package name of an app. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 8 (SDK 5.0.2.306)
