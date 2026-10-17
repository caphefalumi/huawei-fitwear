<!--
  Title: WearEngineClient
  Catalog: connectivity-References
  Document ID: wearengineclient-0000001060620904
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/wearengineclient-0000001060620904
-->
# WearEngineClient

| java.lang.Object \|---com.huawei.wearengine.client.WearEngineClient 
```
public class WearEngineClient
extends java.lang.Object
```
 |
| --- |

It is the client used to listen for the connection status of Wear Engine.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| com.huawei.hmf.tasks.Task<java.lang.Integer> | [getClientApiLevel](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__getClientApiLevel--)() Obtains the API level of the Wear Engine client. |
| com.huawei.hmf.tasks.Task<java.lang.Integer> | [getServiceApiLevel](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__getServiceApiLevel--)() Obtains the API level of the Wear Engine server. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [registerServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__registerServiceConnectionListener--)() Registers and listens for the connection status between your app and Wear Engine. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [releaseConnection](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__releaseConnection--)() Disconnects your app from Wear Engine. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [unregisterServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__unregisterServiceConnectionListener--)() Deregisters the registered connection status. |

#### Method Detail

## registerServiceConnectionListener

public com.huawei.hmf.tasks.Task<java.lang.Void> registerServiceConnectionListener()

Registers and listens for the connection status between your app and Wear Engine.

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## unregisterServiceConnectionListener

public com.huawei.hmf.tasks.Task<java.lang.Void> unregisterServiceConnectionListener()

It is used to deregister the registered connection status.

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## releaseConnection

public com.huawei.hmf.tasks.Task<java.lang.Void> releaseConnection()

It is used to disconnect your app from Wear Engine.

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## getClientApiLevel

public com.huawei.hmf.tasks.Task<java.lang.Integer> getClientApiLevel()

It is used to obtain the API level of the Wear Engine client.

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 2 (SDK 5.0.1.300)

## getServiceApiLevel

public com.huawei.hmf.tasks.Task<java.lang.Integer> getServiceApiLevel()

It is used to obtain the API level of the Wear Engine server.

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 2 (SDK 5.0.1.300)
